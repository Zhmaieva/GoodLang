import React, { useEffect, useMemo, useState } from "react";
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { localizationService } from "../../localization/localizationService.js";
import FeatureToggleService, {featureToggleService} from "../../services/featureToggleService.js";

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

export default function ChooseLocaleModal({
                                              open,
                                              theme,
                                          }) {
    const [selected, setSelected] = useState(null);
    const [initial, setInitial] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [btnHovered, setBtnHovered] = useState(false);

    const options = useMemo(() => localizationService.getAvailableLocales(), [localizationService.getAvailableLocales()]);

    const hasDefinedLocale = !!localizationService.isLocaleDefined();
    const canClose = !!selected;

    const lockScroll = () => {
        // const _el = document.querySelector("#choose-locale-modal");
        // if (_el) disableBodyScroll(_el);
    };

    const unlockScroll = () => {
        // const _el = document.querySelector("#choose-locale-modal");
        // clearAllBodyScrollLocks();
        // if (_el) enableBodyScroll(_el);
    };

    useEffect(() => {
        if (!open) return;

        const _saved = localizationService.isLocaleDefined()
            ? localizationService.getLocale()
            : null;

        setSelected(_saved);
        setInitial(_saved);
        setHovered(null);
        setBtnHovered(false);
        lockScroll();

        return () => {
            unlockScroll();
        };
    }, [open]);

    if (!open) return null;

    const handleClose = () => {
        if (!canClose) return;
        unlockScroll();
        window.location.reload();
    }

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

    const cardStyle = (isActive, isHover) => ({
        width: "100%",
        textAlign: "left",
        borderRadius: theme.radius * 0.9,
        border: `2px solid ${isActive ? theme.green : "rgba(0,0,0,0.12)"}`,
        background: isActive
            ? "rgba(75,163,110,0.14)"
            : "rgba(0,0,0,0.04)",
        padding: "14px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        cursor: "pointer",
        transform: isHover ? "translateY(1px)" : "none",
        transition: "transform 120ms ease",
    });

    const mainButtonStyle = {
        appearance: "none",
        padding: "12px 16px",
        fontWeight: 800,
        fontSize: "clamp(0.95rem, 3.5vw, 1.05rem)",
        lineHeight: 1,
        borderRadius: 999,
        display: canClose ? "initial" : "none",
        background: canClose ? theme.accent : "rgba(0,0,0,0.18)",
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",
        transform: btnHovered && canClose ? "translateY(1px)" : "none",
        filter: btnHovered && canClose ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
        cursor: canClose ? "pointer" : "not-allowed",
        width: "100%",
        marginTop: 10,
        opacity: canClose ? 1 : 0.8,
    };

    const listOuterStyle = {
        position: "relative",
        marginTop: 18,
    };

    const listWrapStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxHeight: "42vh",
        overflowY: "scroll",
        paddingRight: 4,
    };

    const selectedLocaleName =
        options.find((o) => o.locale === selected)?.name || null;

    if (!featureToggleService.get(featureToggleService.FEATURE_NAME.LOCALIZATION))
        return null;

    return (
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
            onClick={handleClose}
        >
            <div
                id="choose-locale-modal"
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
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div/>
                    <p
                        onClick={handleClose}
                        style={{
                            marginBottom: 0,
                            marginTop: 4,
                            marginRight: -16,
                            visibility: canClose ? "visible" : "hidden",
                            color: canClose ? theme.accent : "rgba(0,0,0,0.28)",
                            fontSize: "1.3rem",
                            fontWeight: 500,
                            textAlign: "left",
                            cursor: canClose ? "pointer" : "not-allowed",
                            userSelect: "none",
                            WebkitUserSelect: "none",
                            WebkitTouchCallout: "none",
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
                            Choose a language
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
                            {selectedLocaleName || "What is your mother tongue"}
                        </p>
                    </div>

                    <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                        <div style={logoStyle(56, theme)}>GL</div>
                    </div>
                </div>

                <div style={{display: "flex", flexDirection: "column"}}>
                    <div style={listOuterStyle}>
                        <div style={listWrapStyle}>
                            {options.map((o) => {
                                const isActive = selected === o.locale;
                                const isHover = hovered === o.locale;

                                return (
                                    <div
                                        key={o.locale}
                                        onMouseEnter={() => setHovered(o.locale)}
                                        onMouseLeave={() => setHovered(null)}
                                        onClick={() => {
                                            setSelected(o.locale);
                                            localizationService.setLocale(o.locale);
                                        }}
                                        style={cardStyle(isActive, isHover)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                setSelected(o.locale);
                                                localizationService.setLocale(o.locale);
                                            }
                                        }}
                                    >
                                        <div style={radioStyle(isActive)}>
                                            <div style={radioDotStyle(isActive)}/>
                                        </div>

                                        <div style={{display: "flex", flexDirection: "column", gap: 4, width: "100%"}}>
                                            <div
                                                style={{
                                                    fontWeight: 900,
                                                    color: theme.text,
                                                    fontSize: "1.05rem",
                                                }}
                                            >
                                                {o.name}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div
                            style={{
                                pointerEvents: "none",
                                position: "absolute",
                                left: 0,
                                right: 0,
                                bottom: 0,
                                height: 40,
                                background: `linear-gradient(to bottom, rgba(255,255,255,0), ${theme.bg})`,
                            }}
                        />
                    </div>

                    {!canClose && (
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
                            Choose a language to continue
                        </div>
                    )}

                    <button
                        onMouseEnter={() => setBtnHovered(true)}
                        onMouseLeave={() => setBtnHovered(false)}
                        style={mainButtonStyle}
                        onClick={handleClose}
                    >
                        Ok
                    </button>
                </div>

            </div>
        </div>
    );
}