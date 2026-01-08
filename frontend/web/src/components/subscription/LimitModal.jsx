import React, {useState, useRef, useEffect, useCallback} from "react";
import {callAccountInfoApi, callAccountVerifyApi, callCheckoutApi} from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
import {theme} from "../../App.jsx";
import {setPaymentIntent, getOverallAccuracy} from "../../services/dataService.js";
import {ACTION_TYPES} from "../../utils/constants.js";
import {off, on} from "../../services/events.js";

let stripeLoaded = null;
export async function getStripe() {
    if (stripeLoaded)
        return stripeLoaded;

    const { loadStripe } = await import("@stripe/stripe-js");
    stripeLoaded = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

    return stripeLoaded;
}

export const logoStyle = (size) => ({
    flex: "0 0 auto",
    width: size,
    height: size,
    borderRadius: 12,
    background: theme.accent,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 800,
    fontSize: size * 0.45,
    boxShadow: `0 2px 0 ${theme.accentDark}`,
});

export default function LimitModal({ subscribeIntent = false, isLimitReached, theme, open, onClose, waitTimeSeconds }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const checkoutRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(0);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [account, setAccount] = useState(null);
    const [subscribe, setSubscribe] = useState(subscribeIntent);

    const [hovered, setHovered] = useState(false);
    const [signInHovered, setSignInHovered] = useState(false);

    const [skillAccuracy, setSkillAccuracy] = useState(0);
    const [attemptsLeft, setAttemptsLeft] = useState(0);

    const [showInfo, setShowInfo] = useState(false);

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
        refreshSkill().then();

        setTimeout(async () => {
            await loadAccountInfo();
            if (subscribeIntent) {
                await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_DISCOUNT_SUBSCRIPTION);
            }
        }, 200);

        setSubscribe(subscribeIntent);
    }, [subscribeIntent]);

    const loadAccountInfo = async () => {
        const account = await callAccountInfoApi();
        setAccount(account);
    }

    const onCloseHandler = useCallback(() => {
        setPaymentIntent(false);
        if (isPaying) window.location.reload();
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
        if (!Number.isFinite(v)) return "₴149.99";
        return `₴${v.toFixed(2)}`;
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

        if (mod100 >= 11 && mod100 <= 14) return "годин";
        if (mod10 === 1) return "годину";
        if (mod10 >= 2 && mod10 <= 4) return "години";
        return "годин";
    }

    function formatTime(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    const computeImprovePct = (skill) => {
        const s = Number(skill);
        if (!Number.isFinite(s) || s <= 0) return null; // avoid divide by zero
        const value = ((100 - s) / s) * 10;
        const min = Math.max(0, Math.round(value));
        return Math.min(37, min); // keep it punchy
    };

    const improvePct = computeImprovePct(skillAccuracy);
    const hasEnoughEval = attemptsLeft <= 0;


    if (!open) return null;

    async function handleSubscribe() {
        try {
            setLoading(true);

            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_WANT_PREMIUM);

            if (!account)
                await loadAccountInfo();

            if (!account?.email) {
                setPaymentIntent(true);
                setLoginModalOpen(true);
                return;
            }

            const stripe = await getStripe();

            const { clientSecret, isSuccess } = await callCheckoutApi();
            if (!isSuccess) {
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
            console.error("Stripe error:", err);
            setLoading(false);
        }
    }

    const promo = account?.promo ?? null;

    const basePrice = promo?.originalPrice ?? 149.99;
    const finalPrice = promo?.discountedPrice ?? (149.99 * 0.9);
    const percent = promo?.discountPercentage ?? 10;

    const hoursLeft = promo?.expirationDate ? hoursLeftFromExpiration(promo.expirationDate) : null;
    const hoursWord = hoursLeft != null ? pluralizeHoursUk(hoursLeft) : null;

    return (
        <>
            {
                !loginModalOpen && <div style={{
                    position: "fixed",
                    inset: 0,
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    paddingBottom: "env(safe-area-inset-bottom)",
                    paddingTop: "env(safe-area-inset-top)",
                }} onClick={onCloseHandler}>
                    <div style={{
                        background: theme.bg,
                        padding: "32px",
                        borderRadius: theme.radius * 1.2,
                        border: `4px solid ${theme.accent}`,
                        width: "90%",
                        maxWidth: 460,
                        textAlign: "center",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        display: !isPaying ? "block" : "none",
                    }} onClick={e => e.stopPropagation()}>

                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            {
                                account?.email &&
                                <p style={{
                                    marginBottom: 16,
                                    marginTop: 0,
                                    marginLeft: 0,
                                    color: theme.muted,
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    textAlign: "left"
                                }}>
                                    {account?.email}
                                </p>
                            }

                            {
                                !account?.email && <div></div>
                            }

                            <p onClick={onClose} style={{
                                marginBottom: 16,
                                marginTop: -22,
                                marginLeft: 0,
                                marginRight: -18,
                                color: theme.accent,
                                fontSize: "1.3rem",
                                fontWeight: 500,
                                textAlign: "left",
                                cursor: "pointer",
                                userSelect: "none",
                                WebkitUserSelect: "none",
                                WebkitTouchCallout: "none",
                            }}>
                                ✕
                            </p>
                        </div>

                        <div style={{
                            marginLeft: 0,
                            marginBottom: 16,
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                {(!hasEnoughEval || improvePct === null) && <h2 style={{
                                    textAlign: "left",
                                    marginBottom: 0,
                                    marginTop: 0,
                                    color: theme.text,
                                    fontSize: "1.5rem",
                                    fontWeight: 800
                                }}>
                                    {"Навчання на повну силу"}
                                </h2>}
                                {hasEnoughEval && improvePct != null && <h2 style={{
                                    textAlign: "left",
                                    marginBottom: 0,
                                    marginTop: 0,
                                    color: theme.text,
                                    fontSize: "1.5rem",
                                    fontWeight: 700
                                }}>
                                    Ти прокачаєш знання на <strong>+{improvePct}%</strong> за тиждень

                                    <span style={{ position: "relative" }}>
      {/* INFO ICON */}
                                            <h2
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowInfo((v) => !v);
                                                }}
                                                style={{
                                                    marginLeft: 8,
                                                    marginTop: 0,
                                                    marginBottom: 0,
                                                    cursor: "pointer",
                                                    fontSize: "1.5rem",
                                                    fontWeight: 800,
                                                    paddingLeft: "8px",
                                                    borderRadius: "50%",
                                                    width: 18,
                                                    height: 18,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: theme.text,
                                                    lineHeight: 1,
                                                    userSelect: "none",
                                                }}
                                                aria-label="Інформація"
                                            >
        ⓘ
      </h2>

                                            {/* TOOLTIP */}
                                            {showInfo && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "130%",
                                                        left: "25%",
                                                        transform: "translateX(-25%)",
                                                        background: "#fffdf8",
                                                        border: `2px solid ${theme.accent}`,
                                                        borderRadius: 12,
                                                        boxShadow: `3px 3px 0 ${theme.accentDark}`,
                                                        padding: "10px 12px",
                                                        fontSize: "0.9rem",
                                                        color: theme.text,
                                                        width: 220,
                                                        zIndex: 10,
                                                        textAlign: "left",
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowInfo((v) => !v);
                                                    }}
                                                >
                                                    Регулярно тренуючись - прогнозований результат згідно нашої статистики
                                                </div>
                                            )}
    </span>
                                </h2>}
                                <p style={{
                                    marginBottom: 0,
                                    marginTop: 8,
                                    marginLeft: 0,
                                    color: theme.text,
                                    fontSize: "1rem",
                                    textAlign: "left"
                                }}>
                                    {hasEnoughEval && improvePct ? "З підпискою " : "Підписка "}
                                    {!promo && <strong>₴149.99 / місяць</strong>}

                                    {promo && (
                                        <>
            <span style={{
                textDecoration: "line-through",
                color: theme.text,
                opacity: 0.5,
                fontWeight: 800,
            }}>
                {formatMoneyUAH(basePrice)}
            </span> <br/>

                                            <strong>−{percent}%: {formatMoneyUAH(finalPrice)} / місяць
                                            </strong>

                                            {hoursLeft != null && (
                                                <span style={{
                                                    display: "block",
                                                    marginTop: 6,
                                                    color: theme.text,
                                                    opacity: 0.5,
                                                    fontSize: "0.95rem",
                                                    fontWeight: 700
                                                }}>Пропозиція діятиме ще {hoursLeft} {hoursWord}
                </span>
                                            )}
                                        </>
                                    )}
                                </p>
                            </div>

                            <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                <div style={logoStyle(64)}>GL</div>
                            </div>
                        </div>

                        <div style={{textAlign: "left", margin: "0 0 28px 10px", maxWidth: 280}}>
                            <ul style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                lineHeight: "1.6",
                                color: theme.text,
                                fontSize: "16px",
                                fontWeight: 500
                            }}>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Необмежена кількість завдань
                                </li>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Хмарне збереження прогресу
                                </li>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Доступ з усіх пристроїв
                                </li>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Пріоритетна підтримка
                                </li>
                                <li>
                                    <span style={{marginRight: 8, color: theme.accent, fontWeight: 700}}>✓</span>
                                    Можеш завжди скасувати
                                </li>
                            </ul>
                        </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                            <button
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                                onClick={handleSubscribe}
                                disabled={loading}
                                style={{
                                    appearance: "none",
                                    padding: "10px 14px",
                                    fontWeight: 800,
                                    fontSize: "clamp(0.9rem, 3.5vw, 1rem)",
                                    lineHeight: 1,
                                    borderRadius: 999,
                                    background: loading ? "#999" : theme.accent,
                                    color: "#fff",
                                    border: "2px solid rgba(0,0,0,0.12)",
                                    boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
                                    fontFamily: "Nunito, system-ui, sans-serif",
                                    whiteSpace: "nowrap",
                                    opacity: (loading) ? 0.7 : 1,
                                    transform: hovered ? "translateY(1px)" : "none",
                                    filter: hovered ? "brightness(0.95)" : "none",
                                    transition: "transform 120ms ease, filter 120ms ease",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    width: "100%",
                                }}
                            >
                                {loading ? "Завантаження…" : "Придбати підписку"}
                            </button>

                            {true && <button
                                onMouseEnter={() => setSignInHovered(true)}
                                onMouseLeave={() => setSignInHovered(false)}
                                onClick={async () => {
                                    if (!account)
                                        await loadAccountInfo().then();
                                    setLoginModalOpen(true)
                                }}
                                disabled={loading}
                                style={{
                                    appearance: "none",
                                    padding: "10px 14px",
                                    fontWeight: 800,
                                    fontSize: "clamp(0.9rem, 3.5vw, 1rem)",
                                    lineHeight: 1,
                                    borderRadius: 999,
                                    background: loading ? "#999" : "#fff",
                                    color: theme.text,
                                    border: "2px solid rgba(0,0,0,0.12)",
                                    boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
                                    fontFamily: "Nunito, system-ui, sans-serif",
                                    whiteSpace: "nowrap",
                                    opacity: (loading) ? 0.7 : 1,
                                    transform: signInHovered ? "translateY(1px)" : "none",
                                    filter: signInHovered ? "brightness(0.95)" : "none",
                                    transition: "transform 120ms ease, filter 120ms ease",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    width: "100%",
                                }}
                            >
                                {account?.email ? "Увійти в інший аккаунт" : "Увійти або зареєструватися"}
                            </button>}
                        </div>


                        {(!account?.email) && (
                            <div
                                style={{
                                    marginLeft: 0,
                                    marginTop: 12,
                                    marginBottom: 0,
                                    fontSize: "0.95rem",
                                    fontWeight: 700,
                                    color: theme.text,
                                    letterSpacing: "0.5px",
                                    width: "100%",
                                    opacity: 0.5,
                                    display: "inline-block",
                                    textAlign: "center"
                                }}
                            >
        {/*                        {"Або почекай:"}*/}
        {/*                        <span style={{display: "inline-block", minWidth: "110px", textAlign: "center"}}>*/}
        {/*    {formatTime(timeLeft)}*/}
        {/*</span>*/}
                                На 60% більше завдань щодня для зареєстрованих користувачів
                            </div>
                        )}
                    </div>

                    <div
                        id="embedded-checkout-container"
                        style={{
                            display: "none",

                            width: "92vw",
                            maxWidth: 720,          // 👈 makes it feel much better
                            margin: "0 auto",
                            background: theme.bg,
                            borderRadius: theme.radius * 1.2,
                            border: `4px solid ${theme.accent}`,
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",

                            maxHeight: "75%",      // 👈 prevents “super long” look
                            overflow: "auto",
                        }}
                    />
                </div>
            }
            {
                loginModalOpen &&
                <LoginModal forceLogin={true} theme={theme} account={account} open={loginModalOpen} onClose={() => {
                    setLoginModalOpen(false);
                    setLoading(false);
                    onCloseHandler();
                }}/>
            }
        </>
    );
}
