// MarathonPurchaseModal.jsx
import React, { useEffect, useRef, useState } from "react";
import LoginModal from "../subscription/LoginModal.jsx"; // adjust path if needed
import { setPaymentIntent } from "../../services/dataService.js";
import {callAccountVerifyApi, callCheckoutMarathonApi} from "../../services/api.js";
import { getStripe } from "../subscription/LimitModal.jsx";
import MarathonPlanner from "../training/MarathonPlanner.jsx";
import {clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll} from "body-scroll-lock";
import { Button } from "../Buttons.jsx";
import {ACTION_TYPES} from "../../utils/constants.js"; // ✅ reuse same Stripe singleton loader
import { X } from "@phosphor-icons/react";

export default function MarathonPurchaseModal({
                                                  open,
                                                  onClose,
                                                  theme,

                                                  // pass account from parent (same shape you pass to PdfTypeModal)
                                                  account = null, // { email?: string|null, status?: string }

                                                  // required: array of 7 rule IDs for the marathon
                                                  ruleIds = [],

                                                  title = "Марафон",
                                                  subtitle = "Твій план на наступні 7 днів",
                                              }) {
    const [loading, setLoading] = useState(false);
    const [btnHover, setBtnHover] = useState(false);

    const [isPaying, setIsPaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [plannedRuleIds, setPlannedRuleIds] = useState([]); // <- NEW

    const checkoutRef = useRef(null);

    // ✅ Drop-in fix for Stripe selector duplication:
    // mount embedded checkout into this element (NOT by "#id" selector)
    const checkoutContainerRef = useRef(null);

    // reset on open
    useEffect(() => {
        if (!open) return;

        setLoading(false);
        setBtnHover(false);
        setIsPaying(false);

        // ✅ hide + clear checkout container if it existed from previous open
        const el = checkoutContainerRef.current;
        if (el) {
            el.style.display = "none";
            el.innerHTML = "";
        }

        // NOTE: we don't unmount stripe embedded checkout instance here
        // (LimitModal doesn't either). If you want, we can destroy on close.
    }, [open]);

    if (!open) return null;

    const safeRuleIds = Array.isArray(plannedRuleIds) ? plannedRuleIds.filter(Boolean) : [];

    const onCloseHandler = () => {
        // match LimitModal behavior
        try {
            setPaymentIntent(false);
        } catch {}

        // ✅ optional cleanup: hide & clear embedded checkout DOM
        if (checkoutContainerRef.current) {
            checkoutContainerRef.current.style.display = "none";
            checkoutContainerRef.current.innerHTML = "";
        }

        if (isPaying) {
            // same pattern as LimitModal: if embedded checkout was mounted, refresh
            window.location.reload();
            return;
        }
        onClose?.();
    };

    const startCheckoutFlow = async () => {
        if (loading) return;

        setLoading(true);

        try {
            // mark intent + type (same as you asked)
            try { localStorage.setItem("paymentIntentType", "1"); } catch {}
            try { setPaymentIntent(true); } catch {}

            const stripe = await getStripe();

            const { clientSecret, isSuccess } = await callCheckoutMarathonApi(
                safeRuleIds.map((x) => String(x).trim())
            );

            if (!isSuccess || !clientSecret) {
                console.error("Marathon checkout: failed to get clientSecret");
                setLoading(false);
                return;
            }

            // ✅ Ensure container exists and is clean
            const containerEl = checkoutContainerRef.current;
            if (!containerEl) {
                console.error("Marathon checkout: missing checkout container ref");
                setLoading(false);
                return;
            }

            // Always clear before mounting (prevents leftover iframe/content)
            containerEl.innerHTML = "";
            containerEl.style.display = "none";

            if (!checkoutRef.current) {
                setIsPaying(true);
                checkoutRef.current = await stripe.initEmbeddedCheckout({ clientSecret });

                // ✅ Mount into a single element, not by selector (fixes duplicate selector error)
                checkoutRef.current.mount(containerEl);
            }

            containerEl.style.display = "block";

            setLoading(false);
        } catch (e) {
            console.error("Marathon checkout error:", e);
            setLoading(false);
        }
    };

    const handleStart = async () => {
        try {
            callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_MARATHON_PURCHASE).then();
            await startCheckoutFlow();
        } catch (e) {
            callAccountVerifyApi(ACTION_TYPES.ERROR_PURCHASE_MARATHON).then();
        }
    };

    return (
        <>
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9998,
                            background: "rgba(248, 249, 252, 0.66)",
                            paddingBottom: "env(safe-area-inset-bottom)",
                            paddingTop: "env(safe-area-inset-top)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                        onClick={(e) => {
                            e?.stopPropagation();
                            if (loading) return;
                            onCloseHandler();
                        }}
                    >
                        {/* embedded checkout container (hidden until started) */}
                        <div
                            ref={checkoutContainerRef}
                            style={{
                                display: "none",

                        // ✅ stay inside modal width
                        width: "90%",
                        maxWidth: "100%",
                                padding: 20,

                        // ✅ prevent any child overflow from Stripe
                        overflow: "scroll",

                        // ✅ keep your look
                        margin: "12px auto 0",
                        background: theme.surface,
                        borderRadius: theme.radius * 1.2,
                        border: `1px solid ${theme.border}`,
                        boxShadow: "0 24px 80px rgba(31, 36, 54, 0.14)",

                        // ✅ make it usable on mobile
                        maxHeight: window.innerWidth < 400 ? "75vh" : "85vh",
                    }}
                />

                        {!isPaying &&
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
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* top row with close */}
                            <div style={{display: "flex", justifyContent: "flex-end"}}>
                                <div/>
                                <p
                                    onClick={() => {
                                        if (loading) return;
                                        onCloseHandler();
                                    }}
                                    style={{
                                        margin: "-22px -22px 0 0",
                                        color: theme.accent,
                                        fontSize: "1.3rem",
                                        fontWeight: 500,
                                        textAlign: "center",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        width: 36,
                                        height: 36,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        userSelect: "none",
                                        WebkitUserSelect: "none",
                                        WebkitTouchCallout: "none",
                                        opacity: loading ? 0.6 : 1,
                                    }}
                                >
                                    <X size={28} weight="regular" aria-hidden />
                                </p>
                            </div>

                            {/* header */}
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
                                            fontSize: "clamp(2rem, 6vw, 3rem)",
                                            fontWeight: 800,
                                        }}
                                    >
                                        {title}
                                    </h2>

                                    <p
                                        style={{
                                            marginBottom: 0,
                                            marginTop: 8,
                                            marginLeft: 0,
                                            color: theme.text,
                                            fontWeight: 400,
                                            opacity: 0.55,
                                            fontSize: "clamp(.75rem, 1.9vh, 1rem)",
                                            textAlign: "left",
                                        }}
                                    >
                                        {subtitle}
                                    </p>
                                </div>

                        </div>

                        <MarathonPlanner theme={theme} onChange={(ids) => setPlannedRuleIds(ids)} max={7}
                        onLoadingComplete={() => {
                            setIsLoading(false);
                        }}/>

                            {
                                <div style={{display: isLoading ? "none" : "initial"}}>
                                    {/* footer button */}
                                    {/* footer button (LoginForm style) */}
                                    <Button
                                        onMouseEnter={() => setBtnHover(true)}
                                        onMouseLeave={() => setBtnHover(false)}
                                        onClick={handleStart}
                                        disabled={loading || isLoading || safeRuleIds.length !== 7}
                                        style={{
                                            appearance: "none",
                                            padding: "10px 14px",
                                            fontWeight: 800,
                                            fontSize: "clamp(0.95rem, 3.5vw, 1rem)",
                                            lineHeight: 1,
                                            borderRadius: 14,
                                            background: (loading || safeRuleIds.length !== 7) ? "#999" : theme.accent,
                                            color: "#fff",
                                            border: "1px solid transparent",
                                            boxShadow: "0 12px 28px rgba(116, 119, 184, 0.16)",
                                            fontFamily: 'var(--font-family-base)',
                                            whiteSpace: "nowrap",
                                            opacity: (loading || safeRuleIds.length !== 7) ? 0.7 : 1,
                                            transform: btnHover && !loading && safeRuleIds.length === 7 ? "translateY(1px)" : "none",
                                            filter: btnHover && !loading && safeRuleIds.length === 7 ? "brightness(0.95)" : "none",
                                            transition: "transform 120ms ease, filter 120ms ease",
                                            cursor: (loading || safeRuleIds.length !== 7) ? "not-allowed" : "pointer",
                                            width: "100%",
                                        }}
                                    >
                                        Придбати і розпочати: 500.00₴
                                    </Button>

                                    <p
                                        style={{
                                            marginBottom: 0,
                                            marginTop: 8,
                                            marginLeft: 0,
                                            color: theme.text,
                                            fontWeight: 800,
                                            opacity: 0.55,
                                            fontSize: "clamp(.6rem, 1.5vh, .75rem)",
                                            textAlign: "center",
                                        }}
                                    >
                                        500.00₴ / 7 днів. Автоматичне припинення послуги в разі невиконання завдання у термін
                                    </p>
                                </div>
                            }

                        </div>
                        }
             </div>
        </>
    );
}
