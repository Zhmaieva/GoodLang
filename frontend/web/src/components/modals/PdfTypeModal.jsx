// PdfTypeModal.jsx — FULL DROP-IN (NO DownloadLimitModal usage)
import React, {useEffect, useMemo, useState} from "react";
import LimitModal from "../subscription/LimitModal.jsx";
import LoginModal from "../subscription/LoginModal.jsx"; // ✅ adjust path if needed
import { getPdfDownloads, setPaymentIntent } from "../../services/dataService.js"; // ✅ setPaymentIntent used like in old modal
import { callAccountVerifyApi } from "../../services/api.js"; // ✅ optional analytics; safe to keep
import { ACTION_TYPES } from "../../utils/constants.js";
import { Button } from "../Buttons.jsx";
import { Check, LockKey } from "@phosphor-icons/react";
import ModalShell, { modalShellTokens } from "./ModalShell.jsx";

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
    const [loading, setLoading] = useState(false);

    // paid upsell modal (for locked option)
    const [limitOpen, setLimitOpen] = useState(false);

    // ✅ login modal inside PdfTypeModal (replacement for old download limit modal)
    const [loginOpen, setLoginOpen] = useState(false);

    const paid = isPaidStatus(account?.status);
    const hasEmail = !!account?.email;

    useEffect(() => {
        if (!open) return;

        setSelected(defaultValue);
        setHovered(null);
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
        border: `1px solid ${isActive ? "#fff" : theme.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        marginTop: 2,
    });

    const radioDotStyle = (isActive) => ({
        width: 10,
        height: 10,
        borderRadius: 999,
        background: isActive ? "#fff" : "transparent",
    });

    const cardStyle = (isActive, isHover, locked) => ({
        width: "100%",
        textAlign: "left",
        borderRadius: modalShellTokens.optionRadius,
        border: `${modalShellTokens.optionBorderWidth}px solid ${isActive ? theme.accent : theme.border}`,
        background: isActive ? theme.accent : theme.surface,
        padding: "14px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        cursor: loading || locked ? "default" : "pointer",
        opacity: loading || locked ? 0.7 : 1,
        filter: "none",
        boxShadow: isActive ? "0 12px 28px rgba(123, 97, 216, 0.16)" : "none",
        transition: "background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease",
    });

    const mainButtonStyle = {
        backgroundColor: theme.accent,
        color: "#fff",
        borderColor: "transparent",
        boxShadow: "0 12px 28px rgba(123, 97, 216, 0.16)",
        width: "100%",
        flex: 1,
        boxSizing: "border-box",
    };

    const unlockBtnStyle = {
        marginTop: 10,
    };

    // ✅ register block styles (embedded, no extra modal)
    const infoBoxStyle = {
        borderRadius: theme.radius * 0.9,
        border: `1px solid ${theme.border}`,
        background: theme.surface,
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

            <ModalShell
                open={open}
                id="pdf-type-modal"
                theme={theme}
                title="Обери форму завдань"
                subtitle={ruleLabel}
                onClose={onClose}
                closeDisabled={loading || limitOpen || loginOpen}
                hidden={limitOpen || loginOpen}
            >
                    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
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
                                            <LockKey size={22} weight="bold" color={theme.muted} aria-hidden />
                                        </div>
                                    )}

                                    <div style={{display: "flex", flexDirection: "column", gap: 4, width: "100%"}}>
                                        <div
                                            style={{
                                                fontWeight: 700,
                                                color: isActive ? "#fff" : theme.text,
                                                fontSize: "1.05rem",
                                                opacity: locked ? 0.75 : 1,
                                                lineHeight: 1.15,
                                            }}
                                        >
                                            {o.title}
                                        </div>

                                        <div
                                            style={{
                                                fontWeight: 400,
                                                color: isActive ? "#fff" : theme.muted,
                                                opacity: locked ? 0.65 : 1,
                                                fontSize: "0.95rem",
                                                lineHeight: 1.15,
                                                marginTop: 0,
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
                            <div>
                                <div style={{ display: "flex",
                                    width: "100%", marginTop: 0 }}>
                                    <Button
                                        variant="offset"
                                        compact
                                        fullWidth
                                        shadowColor={theme.accent}
                                        shadowOffset={0}
                                        disabled={loading}
                                        style={mainButtonStyle}
                                        onClick={() => {
                                            if (loading) return;
                                            openLogin();
                                        }}
                                    >
                                        Увійти або зареєструватися
                                    </Button>
                                </div>

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
                            <div style={{ display: "flex", marginTop: 0 }}>
                                <Button
                                    variant="offset"
                                    compact
                                    fullWidth
                                    shadowColor={theme.accent}
                                    shadowOffset={0}
                                    disabled={loading}
                                    style={mainButtonStyle}
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
                            </div>
                        )}
                    </div>
            </ModalShell>
        </>
    );
}

function LockedCta({ theme, onOpenLimit, unlockBtnStyle }) {
    const BUTTON_OFFSET = 4;

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
                <Check size={16} weight="bold" aria-hidden style={{ marginRight: 6, verticalAlign: "-2px" }} />
                Усі копії без вотермарку
            </div>

            <Button
                type="button"
                variant="offset"
                compact
                shadowColor={theme.accent}
                shadowOffset={BUTTON_OFFSET}
                onClick={(e) => {
                    e.stopPropagation();
                    onOpenLimit();
                }}
                style={unlockBtnStyle}
            >
                <LockKey size={16} weight="bold" aria-hidden />
                Оформити підписку
            </Button>
        </div>
    );
}
