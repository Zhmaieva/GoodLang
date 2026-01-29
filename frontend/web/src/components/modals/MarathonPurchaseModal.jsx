// MarathonPurchaseModal.jsx
import React, { useEffect, useRef, useState } from "react";
import LoginModal from "../subscription/LoginModal.jsx"; // adjust path if needed
import { setPaymentIntent } from "../../services/dataService.js";
import { callCheckoutMarathonApi } from "../../services/api.js";
import { getStripe } from "../subscription/LimitModal.jsx";
import MarathonPlanner from "../training/MarathonPlanner.jsx"; // ✅ reuse same Stripe singleton loader

const logoStyle = (size, theme) => ({
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
        await startCheckoutFlow();
    };

    return (
        <>
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.35)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9998,
                            paddingBottom: "env(safe-area-inset-bottom)",
                            paddingTop: "env(safe-area-inset-top)",
                            backdropFilter: "blur(6px)",
                            WebkitBackdropFilter: "blur(6px)",
                        }}
                        onClick={() => {
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

                        // ✅ prevent any child overflow from Stripe
                        overflow: "scroll",

                        // ✅ keep your look
                        margin: "12px auto 0",
                        background: theme.bg,
                        borderRadius: theme.radius * 1.2,
                        border: `4px solid ${theme.accent}`,
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",

                        // ✅ make it usable on mobile
                        maxHeight: "85vh",
                    }}
                />

                        {!isPaying &&
                        <div
                            style={{
                                background: theme.bg,
                                padding: "28px",
                                paddingTop: 0,
                                borderRadius: theme.radius * 1.2,
                                border: `4px solid ${theme.accent}`,
                                width: "90%",
                                maxWidth: 520,
                                textAlign: "center",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* top row with close */}
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                <div/>
                                <p
                                    onClick={() => {
                                        if (loading) return;
                                        onCloseHandler();
                                    }}
                                    style={{
                                        marginBottom: 0,
                                        marginTop: 4,
                                        marginRight: -16,
                                        color: theme.accent,
                                        fontSize: "1.3rem",
                                        fontWeight: 500,
                                        textAlign: "left",
                                        cursor: loading ? "not-allowed" : "pointer",
                                        userSelect: "none",
                                        WebkitUserSelect: "none",
                                        WebkitTouchCallout: "none",
                                        opacity: loading ? 0.6 : 1,
                                    }}
                                >
                                    ✕
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
                                            fontSize: "clamp(1rem, 3.4vh, 2rem)",
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
                                            fontWeight: 800,
                                            opacity: 0.55,
                                            fontSize: "clamp(.75rem, 1.9vh, 1rem)",
                                            textAlign: "left",
                                        }}
                                    >
                                        {subtitle}
                                    </p>
                                </div>

                            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                <div style={logoStyle(56, theme)}>GL</div>
                            </div>
                        </div>

                        <MarathonPlanner theme={theme} onChange={(ids) => setPlannedRuleIds(ids)} max={7} />

                            {/* footer button */}
                            {/* footer button (LoginForm style) */}
                            <button
                                onMouseEnter={() => setBtnHover(true)}
                                onMouseLeave={() => setBtnHover(false)}
                                onClick={handleStart}
                                disabled={loading || safeRuleIds.length !== 7}
                                style={{
                                    appearance: "none",
                                    padding: "10px 14px",
                                    fontWeight: 800,
                                    fontSize: "clamp(0.95rem, 3.5vw, 1rem)",
                                    lineHeight: 1,
                                    borderRadius: 999,
                                    background: (loading || safeRuleIds.length !== 7) ? "#999" : theme.accent,
                                    color: "#fff",
                                    border: "2px solid rgba(0,0,0,0.12)",
                                    boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
                                    fontFamily: "Nunito, system-ui, sans-serif",
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
                            </button>

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
        </>
    );
}
