import React, { useState, useRef, useEffect } from "react";
import {callAccountInfoApi, callDataSyncApi, callSendCodeApi, callVerifyCodeApi} from "../../services/api.js";

export default function LoginForm({ theme, account, onClose = () => {} }) {
    const [step, setStep] = useState("email"); // "email" | "code"
    const [emailInput, setEmailInput] = useState("");
    const [code, setCode] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputsRef = useRef([]);

    const inputStyle = {
        width: 40,
        height: 50,
        fontSize: 24,
        textAlign: "center",
        borderRadius: 6,
        border: `1px solid ${theme?.muted || "#ccc"}`,
    };

    const buttonStyle = {
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: 14,
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",
        background: theme?.accent || "#007bff",
        color: "#fff",
        border: `2px solid ${theme?.accent || "#007bff"}`,
        boxShadow: `2px 2px 0 ${theme?.accentDark || "#0056b3"}`,
        transition: "transform 120ms ease",
    };

    const buttonCancelStyle = {
        ...buttonStyle,
        background: "#fff",
        color: theme?.text || "#000",
        border: `2px solid ${theme?.accent || "#007bff"}`,
        boxShadow: `2px 2px 0 ${theme?.accentDark || "#0056b3"}`,
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
            setError(err.message || "Failed to send code");
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
            const { token, userId } = await callVerifyCodeApi({ email: emailInput, code: enteredCode });

            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);

            const newAccount = await callAccountInfoApi();

            if (oldAccount.email && oldAccount.status !== 'free') {//purge old data if it was synced account
                localStorage.clear();
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
            }

            if (newAccount.status !== 'free') // old data will be synced to new account if possible
                await syncData();

            window.location.reload();

            onClose();
        } catch (err) {
            setError(err.message || "Verification failed");
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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {step === "email" && (
                <>
                    <h3>Login</h3>
                    <input
                        type="email"
                        placeholder="Email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        style={{ ...inputStyle, width: "100%" }}
                        required
                        disabled={loading}
                    />
                    <button style={buttonStyle} onClick={handleEmailSubmit} disabled={loading}>
                        {loading ? "Sending..." : "Send Verification Code"}
                    </button>
                </>
            )}

            {step === "code" && (
                <>
                    <h3>Enter Verification Code</h3>
                    <div style={{ display: "flex", gap: 8 }}>
                        {code.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => (inputsRef.current[i] = el)}
                                value={digit}
                                onChange={(e) => handleCodeChange(e, i)}
                                onKeyDown={(e) => handleCodeKeyDown(e, i)}
                                style={inputStyle}
                                maxLength={1}
                                disabled={loading}
                            />
                        ))}
                    </div>
                    <button style={buttonStyle} onClick={handleVerify} disabled={loading}>
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </>
            )}

            {error && <div style={{ color: "red" }}>{error}</div>}

            <button type="button" style={buttonCancelStyle} onClick={onClose} disabled={loading}>
                Cancel
            </button>
        </div>
    );
}
