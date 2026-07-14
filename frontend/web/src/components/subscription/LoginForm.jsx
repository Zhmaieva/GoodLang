import React, { useState, useRef, useEffect } from "react";
import {
    callAccountInfoApi,
    callAccountVerifyApi, callCheckoutApi,
    callDataSyncApi,
    callSendCodeApi,
    callVerifyCodeApi
} from "../../services/api.js";
import TermsOfUseModal from "./TermsOfUseModal.jsx";
import {getStripe} from "./LimitModal.jsx";
import { useNavigate } from "react-router-dom";
import { logError } from "../../services/logger.js";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import { acceptCookies, getCookieConsent, rejectCookies } from "../../services/settingsService.js";
import { ensureAnalytics, trackMetaCustomEvent, trackPageView } from "../../services/gaService.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import {enableBodyScroll, disableBodyScroll} from 'body-scroll-lock';
import {localizationService} from "../../localization/localizationService.js";
import {getPaymentIntent, setPaymentIntent} from "../../services/dataService.js";
import { Button } from "../Buttons.jsx";
import ModalShell from "../modals/ModalShell.jsx";

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
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [cookieOpen, setCookieOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);
    const [termsReadOnly, setTermsReadOnly] = useState(false);

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

    const mainButtonStyle = (disabled) => ({
        backgroundColor: disabled ? "#999" : theme.accent,
        opacity: disabled ? 0.7 : 1,
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
        fontFamily: 'var(--font-family-base)',
        color: theme.text,
        textAlign: "center",
        caretColor: "grey",
        marginBottom: 16,
        outline: "none",
        boxShadow: INPUT_SHADOW,
    };

    const emailInputStyle = {
        ...baseInputStyle,
        borderRadius: 5,
        border: "1px solid #000",
        padding: "10px 12px",
        fontSize: 16,
        fontWeight: 400,
        color: "#000",
        textAlign: "left",
        minHeight: 42,
        marginBottom: 10,
        boxShadow: "none",
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
            setError("Email cannot be empty");
            return;
        }

        if (emailInput.trim().toLowerCase() === account?.email) {
            setError("You are already signed in with this email");
            return;
        }

        const v = String(emailInput.trim().toLowerCase() || "");
        if (!/^\S+@\S+\.\S+$/.test(v)) {
            setError("Enter a valid email");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await callSendCodeApi({ email: emailInput });
            setStep("code");
        } catch (err) {
            setError(err?.message || "Failed to send the code");
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

            const savedLocale = localizationService.getLocale();

            if (oldAccount?.email && oldAccount?.status !== "free") {
                localStorage.clear();
                localStorage.setItem("token", token);

                if (savedLocale) {
                    localizationService.setLocale(savedLocale);
                }
            }

            if (newAccount?.status !== "free")
                await syncData();

            if (newAccount?.status === "free" && getPaymentIntent()) {
                setPaymentIntent(false);
                try {
                    setLoading(true);

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

                    setIsPaying(true);

                    setTimeout(async () => {
                        if (!checkoutRef.current) {
                            checkoutRef.current = await stripe.initEmbeddedCheckout({ clientSecret });
                            checkoutRef.current.mount("#embedded-checkout-container-login-form");
                        }

                        document.getElementById("embedded-checkout-container-login-form").style.display = "block";
                        setLoading(false);
                    }, 200);
                } catch (err) {
                    try {
                        await callAccountVerifyApi(ACTION_TYPES.ERROR_PURCHASE_SUBSCRIPTION);
                    } catch {}

                    console.error("Stripe error:", err);
                    setLoading(false);
                }
                return;
            }

            if (!getCookieConsent()) {
                setCookieOpen(true);
                await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);
                return;
            }

            reloadWithRuleParam(ruleToDownload);

            unlockScroll()
            onClose();
        } catch (err) {
            setError("Invalid code");
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
    const modalTitle = step === "email" ? "Enter your email" : "Enter the code from your email";
    const modalSubtitle = step === "email" ? "You’ll receive a confirmation email" : `Code sent to: ${emailInput}`;

    return (
        <>
            {(!cookieOpen && !termsOpen) && (
                <ModalShell
                    id="login-form"
                    theme={theme}
                    title={modalTitle}
                    subtitle={modalSubtitle}
                    titleStyle={step === "email" ? { fontSize: "1.75rem" } : undefined}
                    panelStyle={step === "email" ? { padding: 40 } : undefined}
                    onClose={() => {
                        unlockScroll();
                        if (!closeDisabled) onClose();
                    }}
                    closeDisabled={closeDisabled}
                    maxWidth={520}
                >
                        {!termsOpen && !isPaying && (
                            <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                                {step === "email" && (
                                    <>
                                        <input
                                            className={"highlight-input login-email-input"}
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
                                                ...emailInputStyle,
                                                width: "100%",
                                                opacity: loading ? 0.7 : 1,
                                            }}
                                            required
                                            disabled={loading}
                                        />

                                        <Button
                                            variant="offset"
                                            compact
                                            fullWidth
                                            shadowColor={theme.accent}
                                            shadowOffset={5}
                                            style={mainButtonStyle(loading)}
                                            onClick={handleEmailSubmit}
                                            disabled={loading}
                                        >
                                            {loading ? "Sending..." : "Confirm"}
                                        </Button>
                                    </>
                                )}

                                {step === "code" && (
                                    <>
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

                                        <Button
                                            variant="offset"
                                            compact
                                            fullWidth
                                            shadowColor={theme.accent}
                                            shadowOffset={5}
                                            style={mainButtonStyle(loading)}
                                            onClick={handleVerify}
                                            disabled={loading}
                                        >
                                            {loading ? "Checking..." : "Sign in"}
                                        </Button>
                                    </>
                                )}

                                {error && <div style={{color: theme.text, fontWeight: 700}}>{error}</div>}

                                <style>
                                    {`
                                        input::placeholder,
                                        textarea::placeholder {
                                            text-align: left;
                                            font-size: 16px;
                                            font-weight: 400;
                                            color: #000;
                                            opacity: 0.5;
                                        }

                                        .login-email-input,
                                        .login-email-input:focus {
                                            border-width: 1px !important;
                                            border-color: #000 !important;
                                            outline: none;
                                        }

                                        .login-email-input:focus,
                                        .login-email-input:focus-visible {
                                            border-width: 1px !important;
                                            border-color: ${theme.accent} !important;
                                            outline: none;
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
                </ModalShell>
            )}

            {termsOpen && !isPaying && (
                <TermsOfUseModal
                    readOnly={termsReadOnly}
                    ruleToDownload={ruleToDownload}
                    theme={theme}
                    onClose={() => {
                        setTermsOpen(false);
                        const termsRo = termsReadOnly;
                        setTermsReadOnly(false);
                        if (!termsRo) {
                            unlockScroll();
                            onClose();
                        } else {
                            setCookieOpen(true);
                        }
                    }}
                    email={emailInput}
                    verificationCode={code.join("")}
                />
            )}

            {cookieOpen && !termsOpen && (
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
                    onOpenPolicy={async () => {
                        setCookieOpen(false);
                        setTermsReadOnly(true);
                        setTermsOpen(true);
                        await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_TOU);
                    }}
                />
            )}
        </>
    );
}
