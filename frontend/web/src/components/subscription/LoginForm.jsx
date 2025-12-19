import React, { useState, useRef, useEffect } from "react";
import {callAccountInfoApi, callDataSyncApi, callSendCodeApi, callVerifyCodeApi} from "../../services/api.js";
import TermsOfUseModal from "./TermsOfUseModal.jsx";
import {setPaymentIntent} from "../../services/dataService.js";

export default function LoginForm({ theme, account, onClose = () => {} }) {
    const [step, setStep] = useState("email"); // "email" | "code"
    const [emailInput, setEmailInput] = useState("");
    const [code, setCode] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [error, setError] = useState("");
    const inputsRef = useRef([]);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const buttonStyle = {
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",
        background: theme?.accent || "#007bff",
        color: "#fff",
        border: `2px solid ${theme?.accent || "#007bff"}`,
        boxShadow: `2px 2px 0 ${theme?.accentDark || "#0056b3"}`,
        transition: "transform 120ms ease",
    };

    const baseInputStyle = {
        resize: "none",
        flex: 1,
        borderRadius: theme.radius,
        border: `3px solid ${theme.accent}`,
        background: "#fffaf3",
        padding: "12px 14px",
        fontSize: "1.3rem",
        color: theme.text,
        textAlign: "center",
        caretColor: "grey"
    };

    const codeInputStyle = {
        ...baseInputStyle,
        width: isMobile ? 40 : 48,
        height: 58,
        textAlign: "center",
        padding: 0,
        fontSize: isMobile ? "1.3rem" : "2rem",
    };


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

        const newCode = [...code];
        newCode[index] = val;
        setCode(newCode);

        if (index < 5) inputsRef.current[index + 1].focus();
    }

    function handleCodeKeyDown(e, index) {
        if (e.key === "Backspace") {
            const newCode = [...code];
            if (newCode[index]) {
                newCode[index] = "";
                setCode(newCode);
            } else if (index > 0) {
                inputsRef.current[index - 1].focus();
            }
        }
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

            if (newAccount.status === "free") {
                setPaymentIntent(true);
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
            console.log(e);
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
                !termsOpen && <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                    {step === "email" && (
                        <>
                            <h2 style={{marginBottom: 16, color: theme.text, fontSize: "18pt", fontWeight: 800}}>Введіть
                                свій імейл</h2>
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
                            <h2 style={{marginBottom: 16, color: theme.text, fontSize: "14pt", fontWeight: 800}}>Введіть код
                                з імейлу</h2>
                            <div style={{display: "flex", gap: 8}}>
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => (inputsRef.current[i] = el)}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(e, i)}
                                        onKeyDown={(e) => handleCodeKeyDown(e, i)}
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

                    {error && <div style={{color: "red"}}>{error}</div>}

                    <style>
                        {`
                    input::placeholder,
                    textarea::placeholder {
                        text-align: center;
                        font-size: 1.3rem
                    }
                `}
                    </style>

                    {isMobile && <style>
                        {`
                    input::placeholder,
                    textarea::placeholder {
                        font-size: 1.3rem
                    }
                `}
                    </style>}
                </div>
            }
            {
                termsOpen && <TermsOfUseModal
                    theme={theme}
                    onClose={() => {
                        setTermsOpen(false);
                        onClose();
                    }}
                    email={emailInput}
                    verificationCode={code.join("")}
                />

            }
        </>
    );
}
