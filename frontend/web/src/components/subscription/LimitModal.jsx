import React, { useState, useRef, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {callAccountInfoApi, callCheckoutApi} from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
import {theme} from "../../App.jsx";
import {setPaymentIntent} from "../../services/dataService.js";

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

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

export default function LimitModal({ accountInfo, isLimitReached, theme, open, onClose, waitTimeSeconds }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const checkoutRef = useRef(null);

    const [timeLeft, setTimeLeft] = useState(0);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [account, setAccount] = useState(accountInfo);

    const onCloseHandler = () => {
        setPaymentIntent(false);
        if (isPaying)
            window.location.reload();
        onClose();
    }

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

            if (!account)
                await loadAccountInfo();

            if (!account?.email) {
                setPaymentIntent(true);
                setLoginModalOpen(true);
                return;
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

                        <div style={{
                            marginLeft: 0,
                            marginBottom: 16,
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <h2 style={{
                                    textAlign: "left",
                                    marginBottom: 0,
                                    marginTop: 0,
                                    color: theme.text,
                                    fontSize: "1.5rem",
                                    fontWeight: 800
                                }}>
                                    {"Навчання на повну силу"}
                                </h2>
                                <p style={{
                                    marginBottom: 16,
                                    marginTop: 8,
                                    marginLeft: 0,
                                    color: theme.text,
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    textAlign: "left"
                                }}>
                                    Підписка <strong>₴149.99 / місяць</strong>
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
                                    boxShadow: `2px 2px 0 ${theme.accentDark}`,
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
                                {loading ? "Завантаження…" : "Придбати підписку"}
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
                                {accountInfo?.email ? "Увійти в інший аккаунт" : "Увійти або зареєструватися" }
                            </button>
                        </div>


                        {(isLimitReached && timeLeft > 0) && (
                            <div
                                style={{
                                    marginLeft: 0,
                                    marginTop: 24,
                                    marginBottom: 0,
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    color: theme.accent,
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
