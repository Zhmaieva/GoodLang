import React, { useState, useRef, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {callAccountInfoApi, callCheckoutApi} from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function LimitModal({ isLimitReached, theme, open, onClose, waitTimeSeconds }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const checkoutRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(0);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [account, setAccount] = useState(null);

    const onCloseHandler = () => {
        if (isPaying)
            window.location.reload();
        onClose();
    }

    const logoStyle = (size) => ({
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

    const loadAccountInfo = async () => {
        const account = await callAccountInfoApi();
        setAccount(account);
    }

    // ⏳ Countdown timer — only when limit is reached
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

    function formatTime(sec) {
        const h = Math.floor(sec / 3600);
        const m = Math.floor((sec % 3600) / 60);
        const s = sec % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    if (!open) return null;

    async function handleSubscribe() {
        try {
            setLoading(true);

            if (isLimitReached) {
                if (!account)
                    await loadAccountInfo();

                if (!account.email) {
                    setLoginModalOpen(true);
                    return;
                }
            }

            const stripe = await stripePromise;

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

    return (
        <>
            {
                !loginModalOpen && <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999
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

                        <div style={{
                            marginLeft: 10,
                            marginBottom: 16,
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <div style={{ display: "flex", flexDirection: "column", maxHeight: 90 }}>
                                <h2 style={{
                                    textAlign: "left",
                                    marginBottom: 0,
                                    marginTop: 0,
                                    color: theme.text,
                                    fontSize: "18pt",
                                    fontWeight: 800
                                }}>
                                    {"Навчання у повну силу"}
                                </h2>
                                <p style={{
                                    marginBottom: 16,
                                    marginTop: 8,
                                    marginLeft: 0,
                                   // lineHeight: "1.45",
                                    color: theme.text,
                                    fontSize: "16px",
                                    fontWeight: 500,
                                    textAlign: "left"
                                }}>
                                    Підписка ₴170.00 / місяць
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
                            </ul>
                        </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                            <button
                                onClick={handleSubscribe}
                                disabled={loading}
                                style={{
                                    background: loading ? "#999" : theme.accent,
                                    color: "white",
                                    padding: "10px 20px",
                                    borderRadius: theme.radius,
                                    border: "none",
                                    cursor: loading ? "default" : "pointer",
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    width: "100%",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? "Завантаження…" : "Придбати преміум"}
                            </button>

                            <button
                                onClick={async () => {
                                    if (!account)
                                        await loadAccountInfo().then();
                                    setLoginModalOpen(true)
                                }}
                                disabled={loading}
                                style={{

                                    appearance: "none",
                                    padding: "10px 16px",
                                    fontWeight: 800,
                                    fontSize: "1rem",
                                    lineHeight: 1,
                                    borderRadius: 999,
                                    cursor: "pointer",

                                    background: "#fffdf8",
                                    color: theme.text,
                                    border: `2px solid ${theme.accent}`,
                                    boxShadow: `2px 2px 0 ${theme.accentDark}`,

                                    justifyContent: "center",
                                    width: "100%",

                                }}
                            >
                                Увійти в інший акаунт
                            </button>
                        </div>


                        {(isLimitReached && timeLeft > 0) && (
                            <div
                                style={{
                                    marginLeft: 10,
                                    marginTop: 24,
                                    marginBottom: 0,
                                    fontSize: "1.2rem",
                                    fontWeight: 700,
                                    color: theme.accent,
                                    fontFamily: "monospace",
                                    letterSpacing: "0.5px",
                                    width: "100%",
                                    opacity: 0.5,
                                    display: "inline-block",
                                    textAlign: "center"
                                }}
                            >
                                {"Або почекай:"}
                                <span style={{display: "inline-block", minWidth: "110px", textAlign: "center"}}>
            {formatTime(timeLeft)}
        </span>
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
