import {reloadApp} from "../../services/reloadApp.js";
import React, {useState, useRef, useEffect, useCallback} from "react";
import { createPortal } from "react-dom";
import {callAccountInfoApi, callAccountVerifyApi, callCheckoutApi} from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
import {setPaymentIntent, getOverallAccuracy} from "../../services/dataService.js";
import {ACTION_TYPES} from "../../utils/constants.js";
import {off, on} from "../../services/events.js";
import { Button } from "../Buttons.jsx";
import { Check, X } from "@phosphor-icons/react";
import MobileSubscriptionSheet from "../mobile/MobileSubscriptionSheet.jsx";
import useMobileLayout from "../mobile/useMobileLayout.js";

let stripeLoaded = null;
export async function getStripe() {
    if (stripeLoaded) return stripeLoaded;
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) throw new Error("Stripe publishable key is not configured");

    const { loadStripe } = await import("@stripe/stripe-js");
    stripeLoaded = await loadStripe(publishableKey);

    return stripeLoaded;
}

export const logoStyle = (size) => ({
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#000",
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontWeight: 700,
    fontSize: size * 0.4,
    lineHeight: 1,
    letterSpacing: "-0.035em",
    whiteSpace: "nowrap",
});

export default function LimitModal({
                                       subscribeIntent = false,
                                       isLimitReached,
                                       theme,
                                       open,
                                       onClose,
                                       waitTimeSeconds,
                                       featurePdf = false}) {
    featurePdf = false;//temp block pdf selling

    const isMobile = useMobileLayout();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [checkoutError, setCheckoutError] = useState(false);
    const checkoutRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(0);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [account, setAccount] = useState(null);
    const [accountLoading, setAccountLoading] = useState(false);
    const [accountError, setAccountError] = useState(false);
    const [subscribe, setSubscribe] = useState(subscribeIntent);

    const [skillAccuracy, setSkillAccuracy] = useState(0);
    const [attemptsLeft, setAttemptsLeft] = useState(0);

    const refreshSkill = async () => {
        const overall = getOverallAccuracy();
        const acc = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

        setSkillAccuracy(acc);
        setAttemptsLeft(overall?.attemptsLeft ?? 0);
    };

    useEffect(() => {
        on("weeklyProgressUpdate", refreshSkill);
        return () => off("weeklyProgressUpdate", refreshSkill);
    }, []);

    useEffect(() => {
        if (!open) return;
        refreshSkill().then();
        setAccountLoading(true);

        const timer = setTimeout(async () => {
            try {
                await loadAccountInfo();
                if (subscribeIntent) await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_DISCOUNT_SUBSCRIPTION);
            } catch {
                // The mobile price state offers a retry without opening checkout.
            }
        }, 200);

        setSubscribe(subscribeIntent);
        return () => clearTimeout(timer);
    }, [open, subscribeIntent]);

    const loadAccountInfo = async () => {
        setAccountLoading(true);
        setAccountError(false);
        try {
            const nextAccount = await callAccountInfoApi();
            setAccount(nextAccount);
            return nextAccount;
        } catch (error) {
            setAccountError(true);
            throw error;
        } finally {
            setAccountLoading(false);
        }
    };

    const onCloseHandler = useCallback(async () => {
        setPaymentIntent(false);
        if (isPaying) {
            try {
                 await callAccountVerifyApi(ACTION_TYPES.MODAL_CANCELLED_STRIPE);
            } catch {}
            reloadApp();
        }
        onClose();
    }, [isPaying, onClose]);

    useEffect(() => {
        if (!open || !isLimitReached) return;

        setTimeLeft(waitTimeSeconds || 0);

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onCloseHandler();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [open, isLimitReached, waitTimeSeconds, onCloseHandler]);

    function formatMoneyUAH(n) {
        const v = Number(n);
        return `$${v.toFixed(2)}`;
    }

    function hoursLeftFromExpiration(expirationDate) {
        if (!expirationDate) return null;
        const ms = new Date(expirationDate).getTime() - Date.now();
        if (!Number.isFinite(ms)) return null;
        return Math.max(0, Math.ceil(ms / (1000 * 60 * 60)));
    }

    function pluralizeHoursUk(n) {
        const mod10 = n % 10;
        const mod100 = n % 100;

        if (mod100 >= 11 && mod100 <= 14) return "hours";
        if (mod10 === 1) return "hour";
        if (mod10 >= 2 && mod10 <= 4) return "hours";
        return "hours";
    }

    const computeImprovePct = (skill) => {
        const s = Number(skill);
        if (!Number.isFinite(s) || s <= 0) return null;
        const value = ((100 - s) / s) * 10;
        const min = Math.max(0, Math.round(value));
        return Math.min(37, min);
    };

    const improvePct = computeImprovePct(skillAccuracy);
    const hasEnoughEval = attemptsLeft <= 0;

    if (!open || typeof document === "undefined") return null;

    async function handleSubscribe() {
        try {
            setCheckoutError(false);
            setLoading(true);

            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_WANT_PREMIUM);

            const currentAccount = account || await loadAccountInfo();

            if (!currentAccount?.email) {
                setPaymentIntent(true);
                setLoginModalOpen(true);
                return;
            }

            const stripe = await getStripe();

            try {
                await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_STRIPE);
            } catch {}

            const { clientSecret, isSuccess } = await callCheckoutApi();
            if (!isSuccess) {
                try {
                    await callAccountVerifyApi(ACTION_TYPES.ERROR_PURCHASE_SUBSCRIPTION);
                } catch {}

                navigate("/payment/cancel");
                setLoading(false);
                return;
            }

            if (!checkoutRef.current) {
                setIsPaying(true);
                checkoutRef.current = await stripe.initEmbeddedCheckout({ clientSecret });
                checkoutRef.current.mount("#embedded-checkout-container");
            }

            document.getElementById("embedded-checkout-container").style.display = "block";
            setLoading(false);
        } catch (err) {
            try {
                await callAccountVerifyApi(ACTION_TYPES.ERROR_PURCHASE_SUBSCRIPTION);
            } catch {}

            console.error("Stripe error:", err);
            setCheckoutError(true);
            setLoading(false);
        }
    }

    const promo = account?.promo ?? null;

    const basePrice = promo?.originalPrice;
    const finalPrice = promo?.discountedPrice;
    const percent = promo?.discountPercentage;

    const hoursLeft = promo?.expirationDate ? hoursLeftFromExpiration(promo.expirationDate) : null;
    const hoursWord = hoursLeft != null ? pluralizeHoursUk(hoursLeft) : null;

    const benefitItemStyle = {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    };

    const benefitMarkerStyle = {
        flex: "0 0 auto",
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: theme.accentSoft,
        color: theme.accent,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const modalTitleStyle = {
        textAlign: "left",
        marginBottom: 0,
        marginTop: 0,
        color: theme.text,
        fontFamily: "var(--font-family-base)",
        fontSize: "clamp(2rem, 6vw, 3rem)",
        fontWeight: 800,
        letterSpacing: 0,
        lineHeight: 1.05,
    };

    const primaryModalButtonStyle = {
        backgroundColor: theme.dark,
        color: "#fff",
        borderColor: theme.dark,
        boxShadow: "none",
    };

    const login = loginModalOpen && <LoginModal forceLogin theme={theme} account={account} open={loginModalOpen}
        onClose={() => { setLoginModalOpen(false); setLoading(false); onCloseHandler(); }} />;

    if (isMobile) {
        return <>
            {!loginModalOpen && <MobileSubscriptionSheet account={account} loading={loading} priceLoading={accountLoading} accountError={accountError} checkoutError={checkoutError}
                onRetry={() => loadAccountInfo().catch(() => {})} onSubscribe={handleSubscribe}
                onSignIn={async () => {
                    try {
                        if (!account) await loadAccountInfo();
                        setLoginModalOpen(true);
                    } catch { /* Keep the offer open for a retry. */ }
                }} onClose={onCloseHandler} isPaying={isPaying} isLimitReached={isLimitReached}
                timeLeft={timeLeft} hoursLeft={hoursLeft} improvePct={improvePct} hasEnoughEval={hasEnoughEval} />}
            {login}
        </>;
    }

    return createPortal(
        <>
            {
                !loginModalOpen && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999,
                            background: "rgba(248, 249, 252, 0.66)",
                            paddingBottom: "env(safe-area-inset-bottom)",
                            paddingTop: "env(safe-area-inset-top)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                        onClick={onCloseHandler}
                    >
                        <div
                            style={{
                                background: theme.surface,
                                padding: 40,
                                borderRadius: 26,
                                border: `1px solid ${theme.border}`,
                                width: "90%",
                                maxWidth: 520,
                                textAlign: "center",
                                boxShadow: "0 24px 80px rgba(31, 36, 54, 0.14)",
                                display: !isPaying ? "block" : "none",
                                position: "relative",
                                fontFamily: "var(--font-family-base)",
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                style={{
                                    position: "absolute",
                                    top: 18,
                                    right: 18,
                                    width: 36,
                                    height: 36,
                                    padding: 0,
                                    border: "none",
                                    background: "transparent",
                                    color: theme.accent,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    userSelect: "none",
                                    WebkitUserSelect: "none",
                                    WebkitTouchCallout: "none",
                                }}
                                aria-label="Close"
                            >
                                <X size={28} weight="regular" aria-hidden />
                            </button>

                            {account?.email && (
                                <p style={{
                                    marginBottom: 12,
                                    marginTop: 0,
                                    marginLeft: 0,
                                    paddingRight: 36,
                                    color: theme.muted,
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    textAlign: "left"
                                }}>
                                    {account?.email}
                                </p>
                            )}

                            <div style={{
                                marginLeft: 0,
                                marginBottom: 16,
                                display: "flex",
                                justifyContent: "space-between",
                            }}>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    {/* ✅ TITLE SWITCH */}
                                    {!featurePdf && (!hasEnoughEval || improvePct === null) && (
                                        <h2 style={modalTitleStyle}>
                                            {"Learn faster"}
                                        </h2>
                                    )}

                                    {!featurePdf && hasEnoughEval && improvePct != null && (
                                        <h2 style={modalTitleStyle}>
                                            Learn faster

                                            {/*<span style={{ position: "relative" }}>*/}
                                            {/*    <h2*/}
                                            {/*        onClick={(e) => {*/}
                                            {/*            e.stopPropagation();*/}
                                            {/*            setShowInfo((v) => !v);*/}
                                            {/*        }}*/}
                                            {/*        style={{*/}
                                            {/*            marginLeft: 8,*/}
                                            {/*            marginTop: 0,*/}
                                            {/*            marginBottom: 0,*/}
                                            {/*            cursor: "pointer",*/}
                                            {/*            fontSize: "1.5rem",*/}
                                            {/*            fontWeight: 800,*/}
                                            {/*            paddingLeft: "8px",*/}
                                            {/*            borderRadius: "50%",*/}
                                            {/*            width: 18,*/}
                                            {/*            height: 18,*/}
                                            {/*            display: "inline-flex",*/}
                                            {/*            alignItems: "center",*/}
                                            {/*            justifyContent: "center",*/}
                                            {/*            color: theme.text,*/}
                                            {/*            lineHeight: 1,*/}
                                            {/*            userSelect: "none",*/}
                                            {/*        }}*/}
                                            {/*        aria-label="Info"*/}
                                            {/*    >*/}
                                            {/*        ⓘ*/}
                                            {/*    </h2>*/}

                                            {/*    {showInfo && (*/}
                                            {/*        <div*/}
                                            {/*            style={{*/}
                                            {/*                position: "absolute",*/}
                                            {/*                top: "130%",*/}
                                            {/*                left: "25%",*/}
                                            {/*                transform: "translateX(-25%)",*/}
                                            {/*                background: "#fffdf8",*/}
                                            {/*                borderRadius: 12,*/}
                                            {/*                boxShadow: `3px 3px 0 ${theme.accentDark}`,*/}
                                            {/*                padding: "10px 12px",*/}
                                            {/*                fontSize: "0.9rem",*/}
                                            {/*                color: theme.text,*/}
                                            {/*                width: 220,*/}
                                            {/*                zIndex: 10,*/}
                                            {/*                textAlign: "left",*/}
                                            {/*                cursor: "pointer",*/}
                                            {/*            }}*/}
                                            {/*            onClick={(e) => {*/}
                                            {/*                e.stopPropagation();*/}
                                            {/*                setShowInfo((v) => !v);*/}
                                            {/*            }}*/}
                                            {/*        >*/}
                                            {/*            With regular practice — the predicted result according to your performance and our statistics.*/}
                                            {/*        </div>*/}
                                            {/*    )}*/}
                                            {/*</span>*/}
                                        </h2>
                                    )}

                                    {featurePdf && (
                                        <h2 style={modalTitleStyle}>
                                            {"All learning tools"}
                                        </h2>
                                    )}

                                    <p style={{
                                        marginBottom: 0,
                                        marginTop: 8,
                                        marginLeft: 0,
                                        color: theme.text,
                                        fontSize: "1rem",
                                        textAlign: "left"
                                    }}>
                                        {hasEnoughEval && improvePct ? "With a subscription " : "Subscription "}
                                        {!(promo?.discountPercentage > 0) && <strong>{formatMoneyUAH(finalPrice)} / month</strong>}

                                        {promo?.discountPercentage > 0 && (
                                            <>
                                                <span style={{
                                                    textDecoration: "line-through",
                                                    color: theme.text,
                                                    opacity: 0.5,
                                                    fontWeight: 800,
                                                }}>
                                                    {formatMoneyUAH(basePrice)}
                                                </span>
                                                <br/>
                                                <strong>−{percent}%: {formatMoneyUAH(finalPrice)} / month</strong>

                                                {hoursLeft != null && (
                                                    <span style={{
                                                        display: "block",
                                                        marginTop: 6,
                                                        color: theme.text,
                                                        opacity: 0.5,
                                                        fontSize: "0.95rem",
                                                        fontWeight: 700
                                                    }}>
                                                        The offer expires in {hoursLeft} {hoursWord}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </p>
                                </div>

                            </div>

                            <div style={{textAlign: "left", margin: "0 0 28px 0", maxWidth: 360}}>
                                <ul style={{
                                    listStyle: "none",
                                    padding: 0,
                                    margin: 0,
                                    lineHeight: "1.45",
                                    color: theme.text,
                                    fontSize: "15px",
                                    fontWeight: 400
                                }}>
                                    {/* ✅ NEW featurePdf bullets */}
                                    {featurePdf && (
                                        <>
                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                1800+ вправ у форматі PDF
                                            </li>
                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Відсутність вотермарків на всіх PDF
                                            </li>

                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Priority support
                                            </li>

                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Unlimited training
                                            </li>
                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Cloud progress saving
                                            </li>

                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Cancel anytime
                                            </li>
                                        </>
                                    )}

                                    {!featurePdf && (
                                        <>
                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Unlimited training
                                            </li>

                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Cloud progress saving
                                            </li>

                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Priority support
                                            </li>

                                            {/*<li>*/}
                                            {/*    <span style={{*/}
                                            {/*        marginRight: 8,*/}
                                            {/*        color: theme.accent,*/}
                                            {/*        fontWeight: 700*/}
                                            {/*    }}>✓</span>*/}
                                            {/*    1800+ вправ у форматі PDF*/}
                                            {/*</li>*/}

                                            <li style={benefitItemStyle}>
                                                <span style={benefitMarkerStyle} aria-hidden>
                                                    <Check size={18} weight="bold" />
                                                </span>
                                                Cancel anytime
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                            <Button
                                variant="offset"
                                compact
                                fullWidth
                                theme={theme}
                                shadowColor={theme.dark}
                                shadowOffset={0}
                                style={primaryModalButtonStyle}
                                onClick={handleSubscribe}
                                disabled={loading}
                            >
                                {loading ? "Loading…" : "Subscribe"}
                            </Button>

                                <Button
                                    variant="offset"
                                    compact
                                    fullWidth
                                    theme={theme}
                                    shadowColor={theme.dark}
                                    shadowOffset={0}
                                    style={primaryModalButtonStyle}
                                    onClick={async () => {
                                        if (!account) await loadAccountInfo().then();
                                        setLoginModalOpen(true);
                                    }}
                                    disabled={loading}
                                >
                                    {account?.email ? "Sign in with another account" : "Sign in or sign up"}
                                </Button>
                            </div>
                        </div>

                        <div
                            id="embedded-checkout-container"
                            style={{
                                display: "none",
                                width: "92vw",
                                maxWidth: 720,
                                margin: "0 auto",
                                background: theme.surface,
                                borderRadius: theme.radius * 1.2,
                                border: `1px solid ${theme.border}`,
                                boxShadow: "0 24px 80px rgba(31, 36, 54, 0.14)",
                                maxHeight: "75%",
                                overflow: "auto",
                            }}
                        />
                    </div>
                )
            }

            {login}
        </>,
        document.body,
    );
}
