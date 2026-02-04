import React, { useState, useRef, useEffect } from "react";
import {
    callAccountInfoApi,
    callAccountVerifyApi,
    callDataSyncApi,
    callSendCodeApi,
    callVerifyCodeApi
} from "../../services/api.js";
import TermsOfUseModal from "./TermsOfUseModal.jsx";
import { logoStyle } from "./LimitModal.jsx";
import { useNavigate } from "react-router-dom";
import { logError } from "../../services/logger.js";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import { acceptCookies, getCookieConsent, rejectCookies } from "../../services/settingsService.js";
import { ensureAnalytics, trackMetaCustomEvent, trackPageView } from "../../services/gaService.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import {enableBodyScroll, disableBodyScroll} from 'body-scroll-lock';

export default function LoginForm({
                                      theme,
                                      account,
                                      ruleToDownload = null,
                                      fileTypeToDownload = "translations",
                                      onClose = () => {}
                                  }) {
    const [step, setStep] = useState("email"); // "email" | "code"
    const [emailInput, setEmailInput] = useState("");
    const [code, setCode] = useState(new Array(6).fill(""));
    const [loading, setLoading] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [cookieOpen, setCookieOpen] = useState(false);

    // hover for Trainer-style button
    const [btnHover, setBtnHover] = useState(false);

    const inputsRef = useRef([]);
    const checkoutRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        lockScroll()
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // lock body scroll while modal is shown (prevents scroll propagation outside modal)
    useEffect(() => {
        const isOpen = !cookieOpen && !termsOpen;
        if (!isOpen) return;

        const prevOverflow = document.body.style.overflow;
        const prevPaddingRight = document.body.style.paddingRight;

        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (scrollBarWidth > 0) document.body.style.paddingRight = `${scrollBarWidth}px`;

        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.paddingRight = prevPaddingRight;
        };
    }, [cookieOpen, termsOpen]);

    const wrapperStyle = {
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingTop: "env(safe-area-inset-top)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
    };

    const boxStyle = {
        background: theme.bg,
        padding: "28px",
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "90%",
        maxWidth: 520,
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        fontFamily: "Nunito, system-ui, sans-serif",
        lineHeight: 1.4,
    };

    // Trainer / LimitModal button style
    const mainButtonStyle = (disabled) => ({
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "clamp(0.95rem, 3.5vw, 1rem)",
        lineHeight: 1,
        borderRadius: 999,
        background: disabled ? "#999" : theme.accent,
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        opacity: disabled ? 0.7 : 1,
        transform: btnHover && !disabled ? "translateY(1px)" : "none",
        filter: btnHover && !disabled ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
    });

    // -----------------------------
    // ✅ TaskCard textarea look-alike
    // (same colors/border/shadow; no new focus behavior)
    // -----------------------------
    const SOFT_INNER = "rgba(255, 250, 243, 0.92)";
    const SOFT_STROKE_ACCENT = "rgba(255,97,56,0.55)";
    const INPUT_SHADOW = "0 8px 20px rgba(0,0,0,0.08)";
    const INPUT_RADIUS = 14;

    const baseInputStyle = {
        resize: "none",
        flex: 1,
        borderRadius: INPUT_RADIUS,
        border: `2px solid ${SOFT_STROKE_ACCENT}`,
        background: SOFT_INNER,
        padding: "12px 14px",
        fontSize: "18pt",
        fontWeight: 700,
        fontFamily: "Nunito, system-ui, sans-serif",
        color: theme.text,
        textAlign: "center",
        caretColor: "grey",
        marginBottom: 16,
        outline: "none",
        boxShadow: INPUT_SHADOW,
    };

    // individual digit input inside the “gapped” code box
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
        boxShadow: "none", // keep shadow on the container, like TaskCard (single surface)
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
        if (!emailInput) {
            setError("Імейл не може бути пустим");
            return;
        }

        if (emailInput.trim().toLowerCase() === account?.email) {
            setError("Ти вже увійшов під цим імейлом");
            return;
        }

        const v = String(emailInput.trim().toLowerCase() || "");
        if (!/^\S+@\S+\.\S+$/.test(v)) {
            setError("Введіть правильний імейл");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await callSendCodeApi({ email: emailInput });
            setStep("code");
        } catch (err) {
            setError(err?.message || "Не вдалося відправити код");
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

    async function handleCodeKeyDown(e, index) {
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

        if (e.key === "Enter") {
            await handleVerify();
        }
    }

    function handlePaste(e) {
        e.preventDefault();

        const pasted = (e.clipboardData?.getData("text") || "")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

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

        setTimeout(() => {
            el.focus({ preventScroll: true });
            try {
                el.setSelectionRange(1, 1);
            } catch {}
        }, 0);
    }

    function focusIndex(idx) {
        const el = inputsRef.current[idx];
        if (!el) return;

        el.focus({ preventScroll: true });
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

            if (oldAccount?.email && oldAccount?.status !== "free") {
                localStorage.clear();
                localStorage.setItem("token", token);
            }

            if (newAccount?.status !== "free")
                await syncData();

            // if (newAccount?.status === "free" && getPaymentIntent()) {
            //     setPaymentIntent(false);
            //     try {
            //         setLoading(true);
            //
            //         const stripe = await getStripe();
            //
            //         const { clientSecret, isSuccess } = await callCheckoutApi();
            //         if (!isSuccess) {
            //             navigate("/payment/cancel");
            //             setLoading(false);
            //             return;
            //         }
            //
            //         setIsPaying(true);
            //
            //         setTimeout(async () => {
            //             if (!checkoutRef.current) {
            //                 checkoutRef.current = await stripe.initEmbeddedCheckout({ clientSecret });
            //                 checkoutRef.current.mount("#embedded-checkout-container-login-form");
            //             }
            //
            //             document.getElementById("embedded-checkout-container-login-form").style.display = "block";
            //             setLoading(false);
            //         }, 200);
            //     } catch (err) {
            //         console.error("Stripe error:", err);
            //         setLoading(false);
            //     }
            //     return;
            // }

            if (!getCookieConsent()) {
                setCookieOpen(true);
                await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);
                return;
            }

            reloadWithRuleParam(ruleToDownload);

            unlockScroll()
            onClose();
        } catch (err) {
            setError("Невірний код");
        } finally {
            setLoading(false);
        }
    }

    const lockScroll = () => {
        disableBodyScroll(document.querySelector('#login-form'));
    }

    const unlockScroll = () => {
        enableBodyScroll(document.querySelector('#login-form'));
    }

    function reloadWithRuleParam(ruleId) {
        try {
            const url = new URL(window.location.href);

            if (ruleId) {
                url.searchParams.set("ruleToDownload", ruleId);
                url.searchParams.set("pdf_type", fileTypeToDownload);
            } else {
                url.searchParams.delete("ruleToDownload");
            }

            window.history.replaceState({}, "", url.toString());
            window.location.reload();
        } catch (e) {
            const encoded = ruleId ? encodeURIComponent(ruleId) : "";
            const encodedType = fileTypeToDownload ? encodeURIComponent(fileTypeToDownload) : "";
            window.location.href = ruleId
                ? `${window.location.pathname}?ruleToDownload=${encoded}&pdf_type=${encodedType}`
                : window.location.pathname;
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

    const closeDisabled = loading || isPaying;

    return (
        <>
            {(!cookieOpen && !termsOpen) && (
                <div id={"login-form"} style={wrapperStyle}
                     onClick={(e) => {
                         e.stopPropagation();
                         unlockScroll();
                         onClose();
                     }}
                >
                    <div style={boxStyle} onClick={(e) => e.stopPropagation()}>
                        {!termsOpen && !isPaying && (
                            <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                                {step === "email" && (
                                    <>
                                        <div style={{display: "flex", height: "0", justifyContent: "space-between"}}>
                                            <div></div>

                                            <p
                                                onClick={() => {
                                                    unlockScroll()
                                                    if (!closeDisabled) onClose();
                                                }}
                                                style={{
                                                    marginBottom: 16,
                                                    marginTop: -22,
                                                    marginLeft: 0,
                                                    marginRight: -16,
                                                    color: theme.accent,
                                                    fontSize: "1.3rem",
                                                    fontWeight: 500,
                                                    textAlign: "left",
                                                    cursor: closeDisabled ? "not-allowed" : "pointer",
                                                    userSelect: "none",
                                                    WebkitUserSelect: "none",
                                                    WebkitTouchCallout: "none",
                                                    opacity: closeDisabled ? 0.6 : 1,
                                                }}
                                            >
                                                ✕
                                            </p>
                                        </div>

                                        <div
                                            style={{
                                                marginLeft: 0,
                                                marginBottom: 16,
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                <h2
                                                    style={{
                                                        textAlign: "left",
                                                        marginBottom: 0,
                                                        marginTop: 0,
                                                        color: theme.text,
                                                        fontSize: "18pt",
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    Введи свій імейл
                                                </h2>
                                                <p
                                                    style={{
                                                        marginBottom: 0,
                                                        marginTop: 8,
                                                        marginLeft: 0,
                                                        color: theme.text,
                                                        fontWeight: 800,
                                                        opacity: 0.55,
                                                        fontSize: "1rem",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    На пошту надійде підтвердження
                                                </p>
                                            </div>

                                            <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                                <div style={logoStyle(64)}>GL</div>
                                            </div>
                                        </div>

                                        <input
                                            className={"highlight-input"}
                                            type="email"
                                            placeholder="goodlang.app@example.com"
                                            value={emailInput}
                                            onChange={(e) => {
                                                setError(null);
                                                setEmailInput(e.target.value);
                                            }}
                                            onKeyDown={async (e) => {
                                                if (e.key === "Enter" && !loading) {
                                                    e.preventDefault();
                                                    await handleEmailSubmit(e);
                                                }
                                            }}
                                            style={{
                                                ...baseInputStyle,
                                                width: "100%",
                                                opacity: loading ? 0.7 : 1,
                                            }}
                                            required
                                            disabled={loading}
                                        />

                                        <button
                                            style={mainButtonStyle(loading)}
                                            onMouseEnter={() => setBtnHover(true)}
                                            onMouseLeave={() => setBtnHover(false)}
                                            onClick={handleEmailSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? "Відправляю..." : "Підтвердити"}
                                        </button>
                                    </>
                                )}

                                {step === "code" && (
                                    <>
                                        <div style={{display: "flex", height: "0", justifyContent: "space-between"}}>
                                            <div></div>

                                            <p
                                                onClick={() => {
                                                    unlockScroll()
                                                    if (!closeDisabled) onClose();
                                                }}
                                                style={{
                                                    marginBottom: 16,
                                                    marginTop: -20,
                                                    marginLeft: 0,
                                                    marginRight: -18,
                                                    color: theme.accent,
                                                    fontSize: "1.3rem",
                                                    fontWeight: 500,
                                                    textAlign: "left",
                                                    cursor: closeDisabled ? "not-allowed" : "pointer",
                                                    userSelect: "none",
                                                    WebkitUserSelect: "none",
                                                    WebkitTouchCallout: "none",
                                                    opacity: closeDisabled ? 0.6 : 1,
                                                }}
                                            >
                                                ✕
                                            </p>
                                        </div>

                                        <div
                                            style={{
                                                marginLeft: 0,
                                                marginBottom: 16,
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                <h2
                                                    style={{
                                                        textAlign: "left",
                                                        marginBottom: 0,
                                                        marginTop: 0,
                                                        color: theme.text,
                                                        fontSize: "18pt",
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    Введи код з імейлу
                                                </h2>
                                                <p
                                                    style={{
                                                        marginBottom: 0,
                                                        marginTop: 8,
                                                        marginLeft: 0,
                                                        color: theme.text,
                                                        fontSize: "16px",
                                                        fontWeight: 700,
                                                        textAlign: "left",
                                                        overflow: "clip",
                                                        maxWidth: 310,
                                                        opacity: .7,
                                                    }}
                                                >
                                                    Відправлено на: {emailInput}
                                                </p>
                                            </div>

                                            <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                                <div style={logoStyle(64)}>GL</div>
                                            </div>
                                        </div>

                                        <div
                                            className={'highlight-input-wrapper'}
                                            onPaste={handlePaste}
                                            style={{
                                                display: "flex",
                                                resize: "none",
                                                justifyContent: "space-between",
                                                borderRadius: INPUT_RADIUS,
                                                border: `2px solid ${SOFT_STROKE_ACCENT}`,
                                                background: SOFT_INNER,
                                                fontSize: "18pt",
                                                fontWeight: 700,
                                                color: theme.text,
                                                textAlign: "center",
                                                caretColor: "grey",
                                                marginBottom: 16,
                                                boxShadow: INPUT_SHADOW,
                                                padding: "0 10px",
                                                opacity: loading ? 0.7 : 1,
                                            }}
                                        >
                                            {code.map((digit, i) => (
                                                <input
                                                    className={'highlight-input-inner'}
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
                                                            e.preventDefault();
                                                            forceFocusFirstEmpty();
                                                        }
                                                    }}
                                                    onTouchStart={(e) => {
                                                        const firstEmpty = getFirstEmptyIndex(code);
                                                        if (i !== firstEmpty) {
                                                            e.preventDefault();
                                                            forceFocusFirstEmpty();
                                                        }
                                                    }}
                                                    onFocus={() => {
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

                                        <button
                                            style={mainButtonStyle(loading)}
                                            onMouseEnter={() => setBtnHover(true)}
                                            onMouseLeave={() => setBtnHover(false)}
                                            onClick={handleVerify}
                                            disabled={loading}
                                        >
                                            {loading ? "Перевіряю..." : "Увійти"}
                                        </button>
                                    </>
                                )}

                                {error && <div style={{color: theme.text, fontWeight: 700}}>{error}</div>}

                                <style>
                                    {`
                                        input::placeholder,
                                        textarea::placeholder {
                                            text-align: center;
                                        }
                                    `}
                                </style>
                            </div>
                        )}

                        {isPaying && (
                            <div
                                style={{
                                    position: "fixed",
                                    inset: 0,
                                    width: "100vw",
                                    height: "100vh",
                                    background: "rgba(0,0,0,0.35)",
                                    display: "flex",
                                    alignItems: isMobile ? "top" : "center",
                                    justifyContent: "center",
                                    zIndex: 9999,
                                    backdropFilter: "blur(6px)",
                                    WebkitBackdropFilter: "blur(6px)",
                                }}
                            >
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
                        )}
                    </div>
                </div>
            )}

            {termsOpen && !isPaying && (
                <TermsOfUseModal
                    ruleToDownload={ruleToDownload}
                    theme={theme}
                    onClose={() => {
                        unlockScroll()
                        setTermsOpen(false);
                        onClose();
                    }}
                    email={emailInput}
                    verificationCode={code.join("")}
                />
            )}

            {cookieOpen && (
                <CookieConsentModal
                    theme={theme}
                    onAccept={async () => {
                        acceptCookies();
                        ensureAnalytics();
                        if (localStorage.getItem("teacher") === "true")
                            trackPageView("/greetings");

                        trackPageView(window.location.pathname);
                        trackMetaCustomEvent("StartUsing");

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);

                        unlockScroll();
                        reloadWithRuleParam(ruleToDownload);
                    }}
                    onReject={async () => {
                        rejectCookies();

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);

                        unlockScroll();
                        reloadWithRuleParam(ruleToDownload);
                    }}
                />
            )}
        </>
    );
}
