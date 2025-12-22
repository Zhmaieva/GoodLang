import React, { useState, useRef, useEffect } from "react";
import {
    callAccountInfoApi,
    callCheckoutApi,
    callDataSyncApi,
    callSendCodeApi,
    callVerifyCodeApi
} from "../../services/api.js";
import TermsOfUseModal from "./TermsOfUseModal.jsx";
import {logoStyle, stripePromise} from "./LimitModal.jsx";
import {useNavigate} from "react-router-dom";
import {getPaymentIntent, setPaymentIntent} from "../../services/dataService.js";
import {logError} from "../../services/logger.js";

export default function LoginForm({ theme, account, onClose = () => {} }) {
    const [step, setStep] = useState("email"); // "email" | "code"
    const [emailInput, setEmailInput] = useState("");
    const [code, setCode] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    const inputsRef = useRef([]);
    const checkoutRef = useRef(null);

    const navigate = useNavigate();


    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const buttonStyle = {
        background: theme.accent,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        color: "white",
        padding: "10px 20px",
        borderRadius: theme.radius,
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
        fontWeight: 700,
        width: "100%",
        opacity: 1
    };

    const baseInputStyle = {
        resize: "none",
        flex: 1,
        borderRadius: theme.radius,
        border: `3px solid ${theme.accent}`,
        background: "#fffaf3",
        padding: "12px 14px",
        fontSize: "18pt",
        fontWeight: 700,
        color: theme.text,
        textAlign: "center",
        caretColor: "grey",
        marginBottom: 16
    };

    const codeInputStyle = {
        ...baseInputStyle,
        width: 34,
        height: 58,
        textAlign: "center",
        padding: 0,
        fontSize: "18pt",
        border: "none",
        marginBottom: 0,
        backgroundColor: "transparent",
    };

    function focusLastFilled(newCode) {
        const lastFilledIndex = newCode.findLastIndex(d => d !== "");

        const nextIndex =
            lastFilledIndex === -1
                ? 0
                : Math.min(lastFilledIndex + 1, newCode.length - 1);

        inputsRef.current[nextIndex]?.focus();
    }



    // --- Email Step ---
    async function handleEmailSubmit(e) {
        e.preventDefault();
        if (!emailInput || emailInput.trim().toLowerCase() === account.email) return;

        setLoading(true);
        setError("");
        try {
            await callSendCodeApi({ email: emailInput });
            setStep("code");
        } catch (err) {
            setError(err.message || "Не вдалося відправити код");
        } finally {
            setLoading(false);
        }
    }

    // --- Code Step ---
    function handleCodeChange(e, index) {
        const val = e.target.value.replace(/\D/g, "").slice(0, 1);
        if (!val) return;

        setError("");

        const newCode = [...code];
        newCode[index] = val;
        setCode(newCode);

        requestAnimationFrame(() => {
            focusLastFilled(newCode);
        });
    }

    function handleCodeKeyDown(e, index) {
        if (e.key === "Backspace") {
            e.preventDefault();

            setError("");

            const newCode = [...code];

            if (newCode[index]) {
                newCode[index] = "";
            } else if (index > 0) {
                newCode[index - 1] = "";
            }

            setCode(newCode);

            requestAnimationFrame(() => {
                focusLastFilled(newCode);
            });
        }
    }

    function handlePaste(e) {
        e.preventDefault();

        const pasted = (e.clipboardData?.getData("text") || "")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        // replace every input (reset all first)
        const newCode = new Array(6).fill("");
        pasted.split("").forEach((ch, i) => {
            newCode[i] = ch;
        });

        setCode(newCode);

        requestAnimationFrame(() => {
            focusLastFilled(newCode);
        });
    }

    function getFirstEmptyIndex(codeArr) {
        const idx = codeArr.findIndex(d => d === "");
        return idx === -1 ? codeArr.length - 1 : idx;
    }


    function forceFocusFirstEmpty() {
        const firstEmpty = getFirstEmptyIndex(code);
        const el = inputsRef.current[firstEmpty];
        if (!el) return;

        // iOS інколи краще реагує на "пізніший" фокус
        setTimeout(() => {
            el.focus({ preventScroll: true });

            // щоб точно було в кінці (на випадок автозаповнення/вставки)
            try {
                el.setSelectionRange(1, 1);
            } catch {}
        }, 0);
    }

    function focusIndex(idx) {
        const el = inputsRef.current[idx];
        if (!el) return;

        el.focus({ preventScroll: true });

        // щоб каретка точно стала в кінець (1 символ)
        try { el.setSelectionRange(1, 1); } catch {}
    }

    function focusFirstEmpty() {
        focusIndex(getFirstEmptyIndex(code));
    }

    async function handleVerify() {
        const enteredCode = code.join("");
        if (enteredCode.length < 6) return;

        setLoading(true);
        setError("");
        try {
            const oldAccount = await callAccountInfoApi();
            const { token, mustAcceptTerms } = await callVerifyCodeApi({ email: emailInput, code: enteredCode });

            if (mustAcceptTerms) {
                setTermsOpen(true);
                return;
            }

            localStorage.setItem("token", token);

            const newAccount = await callAccountInfoApi();

            if (oldAccount.email && oldAccount.status !== 'free') {//purge old data if it was synced account
                localStorage.clear();
                localStorage.setItem("token", token);
            }

            if (newAccount.status !== 'free') // old data will be synced to new account if possible
                await syncData();

            if (newAccount.status === "free" && getPaymentIntent()) {
                setPaymentIntent(false);
                try {
                    setLoading(true);

                    const stripe = await stripePromise;

                    const { clientSecret, isSuccess } = await callCheckoutApi();
                    if (!isSuccess) {
                        navigate("/payment/cancel");
                        setLoading(false);
                        return;
                    }

                    setIsPaying(true);

                    setTimeout(async () => {
                        if (!checkoutRef.current) {
                            checkoutRef.current = await stripe.initEmbeddedCheckout({ clientSecret });
                            checkoutRef.current.mount("#embedded-checkout-container-login-form");
                        }

                        document.getElementById("embedded-checkout-container-login-form").style.display = "block";
                        setLoading(false);
                    }, 200)
                } catch (err) {
                    console.error("Stripe error:", err);
                    setLoading(false);
                }
                return;
            }

            window.location.reload();

            onClose();
        } catch (err) {
            setError("Невірний код");
        } finally {
            setLoading(false);
        }
    }

    async function syncData() {
        try {
            await callDataSyncApi();
        } catch (e) {
            logError(e);
        }
    }

    // auto focus first code input when step changes
    useEffect(() => {
        if (step === "code" && inputsRef.current[0]) {
            inputsRef.current[0].focus();
        }
    }, [step]);

    return (
        <>
            {
                !termsOpen && !isPaying && <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                    {step === "email" && (
                        <>
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
                                        fontSize: "18pt",
                                        fontWeight: 800
                                    }}>
                                        Введіть свій імейл
                                    </h2>
                                    <p style={{
                                        marginBottom: 0,
                                        marginTop: 8,
                                        marginLeft: 0,
                                        color: theme.text,
                                        fontSize: "16px",
                                        fontWeight: 500,
                                        textAlign: "left"
                                    }}>
                                        На пошту надійде підтвердження
                                    </p>
                                </div>

                                <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                    <div style={logoStyle(64)}>GL</div>
                                </div>
                            </div>
                            <input
                                type="email"
                                placeholder="goodlang.app@example.com"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                style={{
                                    ...baseInputStyle,
                                    width: "100%",
                                }}
                                required
                                disabled={loading}
                            />
                            <button style={buttonStyle} onClick={handleEmailSubmit} disabled={loading}>
                                {loading ? "Відправляю..." : "Підтвердити"}
                            </button>
                        </>
                    )}

                    {step === "code" && (
                        <>
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
                                        fontSize: "18pt",
                                        fontWeight: 800
                                    }}>
                                        Введіть код з імейлу
                                    </h2>
                                    <p style={{
                                        marginBottom: 0,
                                        marginTop: 8,
                                        marginLeft: 0,
                                        color: theme.text,
                                        fontSize: "16px",
                                        fontWeight: 500,
                                        textAlign: "left",
                                        overflow: "clip",
                                        maxWidth: 310
                                    }}>
                                        Відправлено на: {emailInput}
                                    </p>
                                </div>

                                <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                    <div style={logoStyle(64)}>GL</div>
                                </div>
                            </div>
                            <div
                                onPaste={handlePaste}
                                style={{
                                display: "flex",
                                resize: "none",
                                justifyContent: "space-between",
                                borderRadius: theme.radius,
                                border: `3px solid ${theme.accent}`,
                                background: "#fffaf3",
                                fontSize: "18pt",
                                fontWeight: 700,
                                color: theme.text,
                                textAlign: "center",
                                caretColor: "grey",
                                marginBottom: 16}}>
                                {code.map((digit, i) => (
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        key={i}
                                        ref={(el) => (inputsRef.current[i] = el)}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(e, i)}
                                        onKeyDown={(e) => handleCodeKeyDown(e, i)}
                                        onClick={() => focusFirstEmpty()}
                                        onTouchEnd={() => focusFirstEmpty()}
                                        onPointerDown={(e) => {
                                            const firstEmpty = getFirstEmptyIndex(code);
                                            if (i !== firstEmpty) {
                                                e.preventDefault();     // важливо
                                                forceFocusFirstEmpty();
                                            }
                                        }}
                                        onTouchStart={(e) => {      // fallback для iOS, якщо pointer events десь вимкнені
                                            const firstEmpty = getFirstEmptyIndex(code);
                                            if (i !== firstEmpty) {
                                                e.preventDefault();
                                                forceFocusFirstEmpty();
                                            }
                                        }}
                                        onFocus={() => {            // додатковий захист
                                            const firstEmpty = getFirstEmptyIndex(code);
                                            if (i !== firstEmpty) {
                                                forceFocusFirstEmpty();
                                            }
                                        }}
                                        style={codeInputStyle}
                                        maxLength={1}
                                        disabled={loading}
                                    />

                                ))}
                            </div>
                            <button style={buttonStyle} onClick={handleVerify} disabled={loading}>
                                {loading ? "Перевіряю..." : "Увійти"}
                            </button>
                        </>
                    )}

                    {error && <div style={{color: theme.text}}>{error}</div>}

                    <style>
                        {`
                    input::placeholder,
                    textarea::placeholder {
                        text-align: center;
                    }
                `}
                    </style>
                </div>
            }
            {
                termsOpen && !isPaying && <TermsOfUseModal
                    theme={theme}
                    onClose={() => {
                        setTermsOpen(false);
                        onClose();
                    }}
                    email={emailInput}
                    verificationCode={code.join("")}
                />

            }

            {
                isPaying && <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: isMobile ? "top" : "center",
                    justifyContent: "center",
                    zIndex: 9999
                }}>
                    <div
                        id="embedded-checkout-container-login-form"
                        style={{
                            display: "none",
                            width: "92vw",
                            maxWidth: 720,
                            margin: "0 auto",
                            background: theme.bg,
                            borderRadius: theme.radius * 1.2,
                            border: `4px solid ${theme.accent}`,
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                            maxHeight: "75%",
                            overflow: "auto",
                        }}
                    />
                </div>
            }
        </>
    );
}
