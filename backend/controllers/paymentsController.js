import {authMiddleware} from "../middleware/authMiddleware.js";
import Stripe from "stripe";

import express from "express";
import {updateSubscriptionForAccount} from "../database/repositories/subscriptionRepository.js";
import {getAccountById, getAccountInfo} from "../database/repositories/accountsRepository.js";
import { startMarathon } from "../database/repositories/marathonsRepository.js";
import {pool} from "../database/pool.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const name = 'payments';

function normalizePromoCode(raw) {
    if (typeof raw !== "string") return null;
    const v = raw.trim().toUpperCase();
    if (!v) return null;

    return v;
}


export const paymentsController = {
    mapRoutes: function (app) {

        app.get(`/${name}/manage`, authMiddleware, async (req, res) => {
            try {
                const accountId = req.user.id;

                const account = await getAccountById(accountId);
                const customerId = account.stripe_customer_id;

                if (!customerId) {
                    return res.status(400).json({ error: "Missing Stripe customer ID" });
                }

                const portalSession = await stripe.billingPortal.sessions.create({
                    customer: customerId,
                    return_url: `${process.env.FRONTEND_URL}`,
                });

                res.json({ url: portalSession.url });
            } catch (error) {
                console.error("Failed to create portal session:", error);
                res.status(500).json({ error: "Could not create portal link" });
            }
        });


        app.post(`/${name}/create-checkout-session`, authMiddleware, async (req, res) => {
            try {
                const accountId = req.user.id;
                const account = await getAccountById(accountId);

                if (!accountId) {
                    return res.status(400).json({ error: "Missing accountId" });
                }

                // 1) Soft-validate promo code string (format only)
                const promoCodeStr = normalizePromoCode(req.body?.promoCode);

                let discounts = undefined;
                let allowPromotionCodes = true;


                if (promoCodeStr) {
                    // 2) Hard-validate it in your DB (must belong to this account and not be expired)
                    const { rows } = await pool.query(
                        `
                      SELECT promo_code
                      FROM promo_codes
                      WHERE promo_code = $1
                        AND expiration_date > NOW()
                      LIMIT 1
                    `,
                        [promoCodeStr]
                    );

                    if (rows.length > 0) {
                        // 3) Resolve Stripe promotion_code id by code string
                        const list = await stripe.promotionCodes.list({
                            code: promoCodeStr,
                            active: true,
                            limit: 1,
                        }); // Stripe supports listing promotion codes and filtering by active. :contentReference[oaicite:2]{index=2}

                        const promo = list.data?.[0];

                        if (promo?.id) {
                            discounts = [{ promotion_code: promo.id }];
                            allowPromotionCodes = false;
                        }
                    }
                }

                const sessionParams = {
                    ui_mode: "embedded",
                    mode: "subscription",
                    return_url: `${process.env.FRONTEND_URL}/payment/success`,
                    client_reference_id: accountId,
                    customer_email: account.email,
                    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
                    subscription_data: {
                        metadata: { accountId },
                    },
                };

                // If promo pre-applied -> use discounts ONLY (no allow_promotion_codes)
                if (discounts) {
                    sessionParams.discounts = discounts;
                } else {
                    // If no promo pre-applied -> allow entering a code manually
                    sessionParams.allow_promotion_codes = true;
                }

                const session = await stripe.checkout.sessions.create(sessionParams);

                return res.json({ clientSecret: session.client_secret });
            } catch (err) {
                console.error("Stripe error:", err);
                res.status(500).json({ error: "Failed to create session" });
            }
        });

        app.post(`/${name}/create-marathon-checkout-session`, authMiddleware, async (req, res) => {
            try {
                const accountId = req.user.id;
                const account = await getAccountInfo(accountId);

                if (account?.isInMarathon) {
                    return res.status(400).json({ error: "The account is already in marathon" });
                }

                if (!accountId) {
                    return res.status(400).json({ error: "Missing accountId" });
                }

                const ruleIds = req.body?.ruleIds;

                if (!Array.isArray(ruleIds) || ruleIds.length !== 7 || ruleIds.some(r => typeof r !== "string" || !r.trim())) {
                    return res.status(400).json({ error: "ruleIds must be an array of exactly 7 non-empty strings" });
                }

                // Store as JSON string in metadata (Stripe metadata values are strings)
                const ruleIdsJson = JSON.stringify(ruleIds.map(r => r.trim()));


                const sessionParams = {
                    ui_mode: "embedded",
                    mode: "subscription",
                    return_url: `${process.env.FRONTEND_URL}/payment/success?type=marathon`,
                    client_reference_id: accountId,
                    customer_email: account?.email || undefined,
                    line_items: [{ price: process.env.STRIPE_MARATHON_PRICE_ID, quantity: 1 }],
                    metadata: {
                        accountId,
                        ruleIds: ruleIdsJson,
                        product: "marathon_7d",
                    },
                    subscription_data: {
                        metadata: {
                            accountId,
                            ruleIds: ruleIdsJson,
                            product: "marathon_7d",
                        },
                    },
                };

                const session = await stripe.checkout.sessions.create(sessionParams);

                return res.json({ clientSecret: session.client_secret });
            } catch (err) {
                console.error("Stripe error (marathon checkout):", err);
                res.status(500).json({ error: "Failed to create marathon checkout session" });
            }
        });

    },

    mapRawJsonRoutes: function (app) {
        app.post(
            `/${name}/webhook`, express.raw({ type: "application/json" }),
            async (req, res) => {
                const sig = req.headers["stripe-signature"];

                let event;
                try {
                    event = stripe.webhooks.constructEvent(
                        req.body,
                        sig,
                        process.env.STRIPE_WEBHOOK_SECRET
                    );
                } catch (err) {
                    console.error("Webhook signature error:", err);
                    return res.status(400).send(`Webhook Error: ${err.message}`);
                }

                if (event.type === "checkout.session.completed") {
                    const session = event.data.object;

                    const accountId = session.client_reference_id;
                    const email = session.customer_details.email;
                    const subscriptionId = session.subscription;

                    await updateSubscriptionForAccount(accountId, {
                        status: "active",
                        stripe_subscription_id: subscriptionId,
                        customer_id: session.customer,
                    });
                }

                if (event.type === "customer.subscription.deleted") {
                    const subscription = event.data.object;
                    const accountId = subscription.metadata.accountId
                        || subscription.client_reference_id;

                    if (!accountId) {
                        console.error("Missing accountId in subscription.deleted");
                    } else {
                        await updateSubscriptionForAccount(accountId, {
                            status: "canceled",
                            stripe_subscription_id: subscription.id,
                        });
                    }
                }

                if (event.type === "customer.subscription.updated") {
                    const subscription = event.data.object;
                    const status = subscription.status === 'active' && subscription.cancellation_details.reason === 'cancellation_requested'
                        ? 'cancellation_requested' // active, canceled, past_due, unpaid, etc.
                        : subscription.status;

                    const accountId = subscription.metadata?.accountId;

                    if (!accountId) {
                        console.error("Missing metadata.accountId in subscription.updated");
                    } else {
                        await updateSubscriptionForAccount(accountId, {
                            status,
                            stripe_subscription_id: subscription.id,
                        });
                    }
                }

                if (event.type === "invoice.payment_failed") {
                    const invoice = event.data.object;
                    const subscriptionId = invoice.subscription;

                    if (!subscriptionId) {
                        console.warn("No subscription on failed invoice → skipping");
                        return res.json({ received: true });
                    }

                    // Load subscription to get metadata
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const accountId = subscription.metadata?.accountId;

                    if (accountId) {
                        await updateSubscriptionForAccount(accountId, {
                            status: "free",
                        });
                    }
                }

                res.json({ received: true });
            }
        );
    }
}