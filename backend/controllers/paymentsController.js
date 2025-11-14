import {authMiddleware} from "../middleware/authMiddleware.js";
import Stripe from "stripe";

import express from "express";
import {updateSubscriptionForAccount} from "../database/repositories/subscriptionRepository.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const name = 'payments';

export const paymentsController = {
    mapRoutes: function (app) {

        app.post(`/${name}/create-checkout-session`, authMiddleware, async (req, res) => {
            try {
                const accountId = req.user.id;

                if (!accountId) {
                    return res.status(400).json({error: "Missing accountId"});
                }

                const session = await stripe.checkout.sessions.create({
                    ui_mode: "embedded",
                    mode: "subscription",
                    return_url: `${process.env.FRONTEND_URL}/payment/success`,
                    client_reference_id: accountId, // identify the user in your DB
                    line_items: [
                        {
                            price: process.env.STRIPE_PRICE_ID,
                            quantity: 1,
                        },
                    ],
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
                        email,
                        stripe_subscription_id: subscriptionId,
                    });
                }

                res.json({ received: true });
            }
        );
    }
}