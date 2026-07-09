// PdfTypeModal.jsx — FULL DROP-IN (NO DownloadLimitModal usage)
import React, {useEffect, useMemo, useState} from "react";
import LimitModal from "../subscription/LimitModal.jsx";
import LoginModal from "../subscription/LoginModal.jsx"; // ✅ adjust path if needed
import { getPdfDownloads, setPaymentIntent } from "../../services/dataService.js"; // ✅ setPaymentIntent used like in old modal
import { callAccountVerifyApi } from "../../services/api.js"; // ✅ optional analytics; safe to keep
import { ACTION_TYPES } from "../../utils/constants.js";
import { Button } from "../Buttons.jsx";
import {clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll} from "body-scroll-lock";      // ✅ optional analytics

// light copy of logo style to match DownloadLimitModal design
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

// tiny masked icon helper (same technique you use in switches)
const makeMaskIcon = (url, size = 18, color = "rgba(0,0,0,0.55)", scale = 1.2) => ({
    width: size,
    height: size,
    display: "inline-block",
    flex: "0 0 auto",
    backgroundColor: color,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "contain",
    maskImage: `url(${url})`,
    WebkitMaskImage: `url(${url})`,
    transform: `scale(${scale})`,
    transformOrigin: "center",
});

const isPaidStatus = (status) => status === "paid" || status === "attention";

export default function PdfTypeModal({
                                         open,
                                         onClose,
                                         theme,
                                         ruleLabel = "PDF",
                                         defaultValue = "translations", // "translations" | "choose_variant"
                                         onConfirm = async (_pdfType) => {},

                                         // ✅ single source of truth
                                         account = null, // { status: 'paid' | 'free' | 'attention', email?: string }

                                         // optional (handy to pass through to LoginModal)
                                         ruleToDownload = null,
                                     }) {
    const [selected, setSelected] = useState(defaultValue);
    const [hovered, setHovered] = useState(null);
    const [btnHovered, setBtnHovered] = useState(false);
    const [loading, setLoading] = useState(false);

    // paid upsell modal (for locked option)
    const [limitOpen, setLimitOpen] = useState(false);

    // ✅ login modal inside PdfTypeModal (replacement for old download limit modal)
    const [loginOpen, setLoginOpen] = useState(false);

    const paid = isPaidStatus(account?.status);
    const hasEmail = !!account?.email;

    const lockScroll = () => {
        disableBodyScroll(document.querySelector('#pdf-type-modal'));
    }

    const unlockScroll = () => {
        clearAllBodyScrollLocks();
        enableBodyScroll(document.querySelector('#pdf-type-modal'));
    }

    useEffect(() => {
        if (!open) return;

        lockScroll();
        setSelected(defaultValue);
        setHovered(null);
        setBtnHovered(false);
        setLoading(false);
        setLimitOpen(false);
        setLoginOpen(false);
    }, [open, defaultValue]);

    const options = useMemo(
        () => [
            {
                id: "translations",
                title: "Речення на переклад",
                subtitle: "Теорія, 8 речень та відповіді",
                requiresPaid: false,
            },
            {
                id: "choose_variant",
                title: "Завдання \"обери вірний варіант\"",
                subtitle: "Теорія, 12 вправ та відповіді",
                requiresPaid: false,
            },
        ],
        []
    );

    // keep selection valid (ONLY ONCE)
    useEffect(() => {
        if (!open) return;
        if (!paid && options?.find(x => x.id === selected)?.requiresPaid) {
            setSelected("translations");
        }
    }, [open, paid, selected]);

    if (!open) return null;

    const isLockedOption = (o) => o.requiresPaid && !paid;

    // ✅ gate: already downloaded at least once and still no email → require login CTA
    const pdfDownloads = getPdfDownloads();
    const mustRegisterToDownload = pdfDownloads > 0 && !hasEmail;

    const radioStyle = (isActive) => ({
        width: 18,
        height: 18,
        borderRadius: 999,
        border: `2px solid ${isActive ? theme.green : "rgba(0,0,0,0.35)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
    });

    const radioDotStyle = (isActive) => ({
        width: 10,
        height: 10,
        borderRadius: 999,
        background: isActive ? theme.green : "transparent",
    });

    const lockIcon = makeMaskIcon("/lock-icon.svg", 18, "rgba(0,0,0,0.45)", 1.25);

    const cardStyle = (isActive, isHover, locked) => ({
        width: "100%",
        textAlign: "left",
        borderRadius: theme.radius * 0.9,
        border: `2px solid ${
            locked ? "rgba(0,0,0,0.10)" : isActive ? theme.green : "rgba(0,0,0,0.12)"
        }`,
        background: locked
            ? "rgba(0,0,0,0.03)"
            : isActive
                ? "rgba(75,163,110,0.14)"
                : "rgba(0,0,0,0.04)",
        padding: "14px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        cursor: loading || locked ? "default" : "pointer",
        opacity: loading ? 0.7 : 1,
        filter: "none",
        transform: !loading && !locked && isHover ? "translateY(1px)" : "none",
        transition: "transform 120ms ease",
    });

    const mainButtonStyle = {
        appearance: "none",
        padding: "12px 16px",
        fontWeight: 800,
        fontSize: "clamp(0.95rem, 3.5vw, 1.05rem)",
        lineHeight: 1,
        borderRadius: 999,
        background: loading ? theme.accentDark : theme.accent,
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
        fontFamily: 'var(--font-family-base)',
        whiteSpace: "nowrap",
        opacity: loading ? 0.75 : 1,
        transform: btnHovered && !loading ? "translateY(1px)" : "none",
        filter: btnHovered && !loading ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
        cursor: loading ? "not-allowed" : "pointer",
        width: "100%",
    };

    const unlockBtnStyle = (isHover) => ({
        appearance: "none",
        padding: "8px 12px",
        fontWeight: 900,
        fontSize: "0.95rem",
        lineHeight: 1,
        borderRadius: 999,
        background: loading ? theme.greenDark : theme.green,
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.18)",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
        fontFamily: 'var(--font-family-base)',
        whiteSpace: "nowrap",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        filter: isHover ? "brightness(0.95)" : "none",
        transform: isHover ? "translateY(1px)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
        marginTop: 10,
    });

    // ✅ register block styles (embedded, no extra modal)
    const infoBoxStyle = {
        borderRadius: theme.radius * 0.9,
        border: "2px solid rgba(0,0,0,0.10)",
        background: "rgba(0,0,0,0.03)",
        padding: "14px 14px",
        textAlign: "left",
        marginTop: 6,
    };

    const previewWrapStyle = {
        margin: "10px 0 10px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
    };

    const previewTextStyle = {
        margin: 0,
        textAlign: "center",
        fontSize: "0.95rem",
        lineHeight: 1.4,
        color: theme.text,
        opacity: 0.55,
        fontWeight: 800,
        maxWidth: 320,
    };

    const openLogin = async () => {
        // matches old “force login” flow: set payment intent + open login modal
        try {
            //setPaymentIntent(true);
        } catch {}
        try {
            // optional analytics; harmless if you keep it
            await callAccountVerifyApi(ACTION_TYPES?.MODAL_SHOWN_DISCOUNT_SUBSCRIPTION || "MODAL_SHOWN_DISCOUNT_SUBSCRIPTION");
        } catch {}
        setLoginOpen(true);
    };

    return (
        <>
            {/* paid upsell modal (featurePdf flag) */}
            <LimitModal
                open={limitOpen}
                onClose={() => setLimitOpen(false)}
                theme={theme}
                subscribeIntent={true}
                isLimitReached={false}
                waitTimeSeconds={0}
                featurePdf={true}
            />

            {/* ✅ login modal replaces old DownloadLimitModal */}
            <LoginModal
                ruleToDownload={ruleToDownload}
                fileTypeToDownload={selected}
                forceLogin={true}
                theme={theme}
                account={account}
                open={loginOpen}
                onClose={() => {
                    setLoginOpen(false);
                    setPaymentIntent(false);
                    // keep PdfTypeModal open; user can proceed after login
                }}
            />

            <div
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
                    if (loading) return;
                    if (limitOpen || loginOpen) return;
                    unlockScroll();
                    onClose();
                }}
            >
                <div
                    id={'pdf-type-modal'}
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
                        display: limitOpen || loginOpen ? "none" : "block",
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div />
                        <p
                            onClick={() => {
                                if (loading) return;
                                unlockScroll();
                                onClose();
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
                                    fontSize: "1.5rem",
                                    fontWeight: 800,
                                }}
                            >
                                Обери форму завдань
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
                                {ruleLabel}
                            </p>
                        </div>

                        <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                            <div style={logoStyle(56, theme)}>GL</div>
                        </div>
                    </div>

                    <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 18}}>
                        {options.map((o) => {
                            const locked = isLockedOption(o);
                            const isActive = selected === o.id;
                            const isHover = hovered === o.id;

                            return (
                                <div
                                    key={o.id}
                                    onMouseEnter={() => setHovered(o.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => {
                                        if (loading) return;
                                        if (locked) return;
                                        setSelected(o.id);
                                    }}
                                    style={cardStyle(isActive, isHover, locked)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    {!locked ? (
                                        <div style={radioStyle(isActive)}>
                                            <div style={radioDotStyle(isActive)} />
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                width: 18,
                                                height: 18,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flex: "0 0 auto",
                                                marginTop: 2,
                                            }}
                                            aria-hidden
                                        >
                                            <span style={lockIcon} />
                                        </div>
                                    )}

                                    <div style={{display: "flex", flexDirection: "column", gap: 4, width: "100%"}}>
                                        <div
                                            style={{
                                                fontWeight: 900,
                                                color: theme.text,
                                                fontSize: "1.05rem",
                                                opacity: locked ? 0.75 : 1,
                                            }}
                                        >
                                            {o.title}
                                        </div>

                                        <div
                                            style={{
                                                fontWeight: 800,
                                                color: theme.text,
                                                opacity: locked ? 0.45 : 0.55,
                                                fontSize: "0.95rem",
                                            }}
                                        >
                                            {o.subtitle}
                                        </div>

                                        {
                                            !locked && <div style={{marginTop: 6}}>
                                                <div
                                                    style={{
                                                        fontWeight: 900,
                                                        fontSize: "0.9rem",
                                                        color: theme.text,
                                                        opacity: 0.55,
                                                    }}
                                                >
                                                    {o.warning}
                                                </div>
                                            </div>
                                        }


                                        {locked && (
                                            <LockedCta
                                                theme={theme}
                                                onOpenLimit={() => {
                                                    localStorage.setItem("teacher", "true");
                                                    setLimitOpen(true);
                                                }}
                                                unlockBtnStyle={unlockBtnStyle}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {/* ✅ Register gate: show explanation + register button instead of Download */}
                        {mustRegisterToDownload ? (
                            <div >

                                <Button
                                    onMouseEnter={() => setBtnHovered(true)}
                                    onMouseLeave={() => setBtnHovered(false)}
                                    disabled={loading}
                                    style={{...mainButtonStyle}}
                                    onClick={() => {
                                        if (loading) return;
                                        openLogin();
                                    }}
                                >
                                    Увійти або зареєструватися
                                </Button>

                                <div
                                    style={{
                                        marginTop: 12,
                                        fontSize: "0.92rem",
                                        fontWeight: 800,
                                        color: theme.text,
                                        opacity: 0.5,
                                        textAlign: "center",
                                    }}
                                >
                                    Увійшовши, безкоштовно стягуй усі завдання з перекладами
                                </div>
                            </div>
                        ) : (
                            <Button
                                onMouseEnter={() => setBtnHovered(true)}
                                onMouseLeave={() => setBtnHovered(false)}
                                disabled={loading}
                                style={{...mainButtonStyle, marginTop: 10}}
                                onClick={async () => {
                                    try {
                                        setLoading(true);

                                        // safety: if not paid and somehow selected locked option, force translations
                                        //const safeSelected = selected;//(!paid && selected === "choose_variant") ? "translations" : selected;

                                        await onConfirm(selected);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                {loading ? "Стягую..." : "Стягнути"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

function LockedCta({ theme, onOpenLimit, unlockBtnStyle }) {
    const [h, setH] = useState(false);

    return (
        <div style={{marginTop: 6}}>
            <div
                style={{
                    fontWeight: 900,
                    fontSize: "0.9rem",
                    color: theme.text,
                    opacity: 0.55,
                }}
            >
                ✓ Усі копії без вотермарку
            </div>

            <Button
                type="button"
                onMouseEnter={() => setH(true)}
                onMouseLeave={() => setH(false)}
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenLimit();
                }}
                style={unlockBtnStyle(h)}
            >
        <span
            aria-hidden
            style={{
                width: 14,
                height: 14,
                display: "inline-block",
                backgroundColor: "#fff",
                maskRepeat: "no-repeat",
                maskPosition: "center",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                WebkitMaskSize: "contain",
                maskImage: "url(/lock-icon.svg)",
                WebkitMaskImage: "url(/lock-icon.svg)",
            }}
        />
                Оформити підписку
            </Button>
        </div>
    );
}
