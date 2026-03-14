// MarathonPurchaseModal.jsx
import React, {useEffect, useMemo, useRef, useState} from "react";
import LoginModal from "../subscription/LoginModal.jsx"; // adjust path if needed
import {getOverallAccuracy, getPaymentIntent, inferUserLevel, setPaymentIntent} from "../../services/dataService.js";
import MarathonPurchaseModal from "./MarathonPurchaseModal.jsx";
import {normalizeLevel} from "../training/MarathonPlanner.jsx";
import {disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks} from "body-scroll-lock";
import {callAccountVerifyApi} from "../../services/api.js";
import {ACTION_TYPES} from "../../utils/constants.js";


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

export default function MarathonInfoModal({
                                              open,
                                              onClose,
                                              theme,

                                              // pass account from parent (same shape you pass to PdfTypeModal)
                                              account = null, // { email?: string|null, status?: string }

                                              // required: array of 7 rule IDs for the marathon
                                              ruleIds = [],
                                          }) {
    const [btnHover, setBtnHover] = useState(false);
    const [loginBtnHover, setLoginBtnHover] = useState(false);

    const [loginOpen, setLoginOpen] = useState(false);
    const [purchaseOpen, setPurchaseOpen] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [userLevel, setUserLevel] = useState("");

    const lockScroll = () => {
        disableBodyScroll(document.querySelector('#marathon-info-modal'));
    }

    const unlockScroll = () => {
        clearAllBodyScrollLocks();
        enableBodyScroll(document.querySelector('#marathon-info-modal'));
    }

    const items = useMemo(
        () => [
            { title: "7 rules in 7 days", sub: "A new rule every day and unlimited practice." },
            { title: "Learn it or you're out", sub: "You have 24 hours to learn the rule." },
            { title: "Personalized plan", sub: "Focus on weak points. Spaced repetition method." },
        ],
        []
    );

    const LEVEL_MAP = {
        A1: { label: "Beginner", percent: 33 },
        A2: { label: "Intermediate", percent: 66 },
        B1: { label: "Intermediate", percent: 66 },
        B2: { label: "Advanced", percent: 100 },
    };

    // reset on open
    useEffect(() => {
        if (!open) return;

        lockScroll();
        setBtnHover(false);
        setLoginOpen(false);
        setIsPaying(false);

        const lvl = inferUserLevel();
        const overall = getOverallAccuracy();
        const acc = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

        let inferred = lvl?.level || "A1";
        if (inferred === 'A1' && acc > 40) {
            inferred = 'A2';
        }

        if (inferred !== 'B2' && acc > 85) {
            inferred = 'B2';
        }

        setUserLevel(LEVEL_MAP[inferred] || LEVEL_MAP.A1);


        if (getPaymentIntent()) {
            setPaymentIntent(false);
            const intentType = localStorage.getItem("paymentIntentType");
            if (intentType === '1') {
                setPurchaseOpen(true);
            }
        }

        // NOTE: we don't unmount stripe embedded checkout instance here
        // (LimitModal doesn't either). If you want, we can destroy on close.
    }, [open]);

    if (!open) return null;

    const hasEmail = !!account?.email;

    const onCloseHandler = () => {
        unlockScroll();

        // match LimitModal behavior
        try { setPaymentIntent(false); } catch {}
        if (isPaying) {
            // same pattern as LimitModal: if embedded checkout was mounted, refresh
            window.location.reload();
            return;
        }
        onClose?.();
    };

    const openLoginFlow = () => {
        try {
            // localStorage.setItem("rulesToMarathon", JSON.stringify(ruleIds));
            localStorage.setItem("paymentIntentType", "1");
            setPaymentIntent(true);
        } catch {}
        try {
        } catch {}
        setLoginOpen(true);
    };

    const handleStart = async () => {
        // Like LimitModal:
        // if no email -> login flow; else -> purchase
        callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_MARATHON_START).then();

        if (!hasEmail) {
            openLoginFlow();
            return;
        }
        setPurchaseOpen(true);
    };

    const listWrap = {
        marginTop: 14,
        background: "rgba(255,255,255,0.55)",
        border: "2px solid rgba(0,0,0,0.10)",
        borderRadius: theme.radius,
        padding: 14,
        marginBottom: 20,
    };

    const row = {
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "10px 6px",
    };

    // ✅ no shadows on items
    const dot = {
        width: 12,
        height: 12,
        borderRadius: 999,
        background: theme.accent,
        flex: "0 0 12px",
        marginLeft: 6,
        marginTop: 4,
    };

    const itemTitle = {
        margin: 0,
        color: theme.text,
        fontWeight: 1000,
        fontSize: 15,
        lineHeight: 1.25,
        textAlign: "left",
    };

    const subText = {
        margin: "2px 0 0 0",
        color: theme.text,
        opacity: 0.8,
        fontWeight: 700,
        fontSize: 13.5,
        lineHeight: 1.35,
        textAlign: "left",
    };

    return (
        <>
            {
                account?.email && purchaseOpen ?
                    (<MarathonPurchaseModal
                        open={true}
                        onClose={() => setPurchaseOpen(false)}
                        theme={theme}
                        account={account}               // from callAccountInfoApi()
                    />)
                    : loginOpen ?

                        (<LoginModal
                            forceLogin={true}
                            theme={theme}
                            account={account}
                            open={loginOpen}
                            onClose={() => {
                                setLoginOpen(false);
                                // keep purchase modal open; user can click again after login
                                try {
                                    setPaymentIntent(false);
                                } catch {
                                }
                            }}
                        />)
                        :
                        (<div
                            id={"marathon-info-modal"}
                            style={{
                                position: "fixed",
                                inset: 0,
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
                                e?.stopPropagation();
                                if (loginOpen) return;
                                onCloseHandler();
                            }}
                        >
                            <div
                                style={{
                                    background: theme.bg,
                                    padding: "28px",
                                    paddingTop: 0,
                                    borderRadius: theme.radius * 1.2,
                                    border: `4px solid ${theme.accent}`,
                                    width: "90%",
                                    maxWidth: 480,
                                    textAlign: "center",
                                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                                    display: loginOpen ? "none" : "block",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* top row with close */}
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    {
                                        account?.email &&
                                        <p style={{
                                            marginBottom: 16,
                                            marginTop: 8,
                                            marginLeft: 0,
                                            color: theme.muted,
                                            fontSize: "1rem",
                                            fontWeight: 500,
                                            textAlign: "left",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            maxWidth: 250,
                                        }}>
                                            {account?.email}
                                        </p>
                                    }
                                    <div/>
                                    <p
                                        onClick={() => {
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
                                            cursor: "pointer",
                                            userSelect: "none",
                                            WebkitUserSelect: "none",
                                            WebkitTouchCallout: "none",
                                            opacity: 1,
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
                                                fontSize: "2rem",
                                                fontWeight: 800,
                                                lineHeight: 0.8
                                            }}
                                        >
                                            It will be hard
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
                                            But you will learn the rules. <br/>No pain, no gain.
                                        </p>
                                    </div>

                                    <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                        <div style={logoStyle(56, theme)}>GL</div>
                                    </div>
                                </div>


                                {/* ✅ fancy dot list (no vertical line, 1 substatement per item) */}
                                <div style={listWrap}>
                                    {items.map((x, idx) => (
                                        <div key={idx} style={row}>
                                            <div style={dot}/>
                                            <div style={{flex: 1, minWidth: 0}}>
                                                <p style={itemTitle}>{x.title}</p>
                                                <p style={subText}>{x.sub}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* tiny helper */}
                                    <div style={{
                                        marginTop: 6,
                                        fontSize: 12.5,
                                        fontWeight: 800,
                                        opacity: 0.55,
                                        color: theme.text
                                    }}>
                                        Your current level: {userLevel?.label?.toLowerCase()}
                                    </div>
                                </div>


                                {/* footer button */}
                                {/* footer button (LoginForm style) */}
                                <button
                                    onMouseEnter={() => setBtnHover(true)}
                                    onMouseLeave={() => setBtnHover(false)}
                                    onClick={handleStart}
                                    style={{
                                        appearance: "none",
                                        padding: "10px 14px",
                                        fontWeight: 800,
                                        fontSize: "clamp(0.95rem, 3.5vw, 1rem)",
                                        lineHeight: 1,
                                        borderRadius: 999,
                                        background: theme.accent,
                                        color: "#fff",
                                        border: "2px solid rgba(0,0,0,0.12)",
                                        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
                                        fontFamily: "Nunito, system-ui, sans-serif",
                                        whiteSpace: "nowrap",
                                        opacity: 1,
                                        transform: btnHover ? "translateY(1px)" : "none",
                                        filter: btnHover ? "brightness(0.95)" : "none",
                                        transition: "transform 120ms ease, filter 120ms ease",
                                        cursor: "pointer",
                                        width: "100%",
                                    }}
                                >
                                    Start marathon
                                </button>

                                {
                                    account?.email &&
                                    <button
                                        onMouseEnter={() => setLoginBtnHover(true)}
                                        onMouseLeave={() => setLoginBtnHover(false)}
                                        onClick={() => {setLoginOpen(true)}}
                                        style={{
                                            appearance: "none",
                                            padding: "10px 14px",
                                            marginTop: 8,
                                            fontWeight: 800,
                                            fontSize: "clamp(0.95rem, 3.5vw, 1rem)",
                                            lineHeight: 1,
                                            borderRadius: 999,
                                            background: "#fff",
                                            color: theme.text,
                                            border: "2px solid rgba(0,0,0,0.12)",
                                            boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
                                            fontFamily: "Nunito, system-ui, sans-serif",
                                            whiteSpace: "nowrap",
                                            opacity: 1,
                                            transform: loginBtnHover ? "translateY(1px)" : "none",
                                            filter: loginBtnHover ? "brightness(0.95)" : "none",
                                            transition: "transform 120ms ease, filter 120ms ease",
                                            cursor: "pointer",
                                            width: "100%",
                                        }}
                                    >
                                        Log in to another account
                                    </button>
                                }


                            </div>
                        </div>)
            }
        </>
    );
}