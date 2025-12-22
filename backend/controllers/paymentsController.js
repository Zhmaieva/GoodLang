import {authMiddleware} from "../middleware/authMiddleware.js";
import Stripe from "stripe";

import express from "express";
import {updateSubscriptionForAccount} from "../database/repositories/subscriptionRepository.js";
import {getAccountById} from "../database/repositories/accountsRepository.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const name = 'payments';

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
                    return res.status(400).json({error: "Missing accountId"});
                }

                const session = await stripe.checkout.sessions.create({
                    ui_mode: "embedded",
                    mode: "subscription",
                    return_url: `${process.env.FRONTEND_URL}/payment/success`,
                    client_reference_id: accountId,
                    customer_email: account.email,
                    allow_promotion_codes: true,
                    line_items: [
                        {
                            price: process.env.STRIPE_PRICE_ID,
                            quantity: 1,
                        },
                    ],
                    subscription_data: {
                        metadata: {
                            accountId: accountId,
                        }
                    }
                });

                return res.json({
                    clientSecret: session.client_secret
                });
            } catch (err) {
                console.error("Stripe error:", err);
                res.status(500).json({error: "Failed to create session"});
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
                    const status = subscription.status; // active, canceled, past_due, unpaid, etc.

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
                            status: "attention",
                        });
                    }
                }

                res.json({ received: true });
            }
        );
    }
}