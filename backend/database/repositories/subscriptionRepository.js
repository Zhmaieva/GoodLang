import { pool } from "../pool.js";
import {ACTION_TYPES} from "../../core/constants.js";

/**
 * Maps Stripe subscription.status into our internal account statuses.
 *
 * Stripe statuses we care about:
 * - active               -> paid
 * - trialing             -> paid
 * - past_due             -> attention
 * - unpaid               -> attention
 * - incomplete           -> attention (payment attempt failed)
 * - incomplete_expired   -> free
 * - canceled             -> free
 *
 * @param stripeStatus
 * @returns {"paid"|"free"|"attention"}
 */
function mapStripeStatus(stripeStatus) {
    switch (stripeStatus) {
        case "active":
        case "trialing":
            return "paid";

        case "past_due":
        case "unpaid":
        case "incomplete":
            return "attention";

        case "canceled":
        case "incomplete_expired":
        default:
            return "free";
    }
}

/**
 * Updates the status of an account based on Stripe subscription state.
 * Follows rules:
 *
 * - free users NEVER move to attention
 * - only paid/attention users may move to attention
 * - expired/canceled paid subscriptions revert to free
 *
 * Also logs an entry into account_log.
 *
 * @param {string} accountId
 * @param {object} stripeSubscription
 * @returns {Promise<{ oldStatus: string, newStatus: string }>}
 */
export async function updateSubscriptionForAccount(accountId, stripeSubscription) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const stripeStatus = stripeSubscription.status;
        const mappedStatus = mapStripeStatus(stripeStatus);

        // Load current account status
        const acc = await client.query(
            "SELECT status FROM accounts WHERE id = $1 LIMIT 1;",
            [accountId]
        );

        if (!acc.rows.length) {
            throw new Error("Account not found: " + accountId);
        }

        const oldStatus = acc.rows[0].status;
        const email = acc.rows[0].email;
        let newStatus = oldStatus;

        // --- RULES ---

        if (mappedStatus === "paid") {
            // Always upgrade to paid
            newStatus = "paid";
        } else if (mappedStatus === "attention") {
            // Only paid or attention accounts may become attention
            if (oldStatus === "paid" || oldStatus === "attention") {
                newStatus = "attention";
            } else {
                // free users stay free
                newStatus = "free";
            }
        } else if (mappedStatus === "free") {
            // Canceled / expired subscriptions revert to free
            newStatus = "free";
        }

        if (!email) {
            await client.query(
                "UPDATE accounts SET email = $1 WHERE id = $2;",
                [stripeSubscription.email, accountId]
            );
        }

        // Update only if changed
        if (newStatus !== oldStatus) {
            await client.query(
                "UPDATE accounts SET status = $1 WHERE id = $2;",
                [newStatus, accountId]
            );

            // Log status transition
            await client.query(
                `
                INSERT INTO account_log (account_id, action_type)
                VALUES ($1, $2);
                `,
                [
                    accountId,
                    newStatus === "paid"
                        ? ACTION_TYPES.UPDATE_ACCOUNT_STATUS_TO_PAID
                        : newStatus === "attention"
                            ? ACTION_TYPES.UPDATE_ACCOUNT_STATUS_TO_ATTENTION
                            : ACTION_TYPES.UPDATE_ACCOUNT_STATUS_TO_FREE
                ]
            );
        }

        await client.query("COMMIT");

        return { oldStatus, newStatus };
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}
