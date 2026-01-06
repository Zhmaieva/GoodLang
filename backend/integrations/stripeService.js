import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Ensure we have a lifetime 10% coupon (duration forever).
 * Best practice: create it once and store its ID in env STRIPE_LIFETIME_10_COUPON_ID.
 */
export async function getLifetime10CouponId() {
    const preset = process.env.STRIPE_LIFETIME_10_COUPON_ID;
    if (preset) return preset;

    // Fallback: create a new coupon (avoid doing this repeatedly in prod).
    const coupon = await stripe.coupons.create({
        percent_off: 10,
        duration: "forever",
        name: "GoodLang lifetime 10% off",
    });

    return coupon.id;
}
