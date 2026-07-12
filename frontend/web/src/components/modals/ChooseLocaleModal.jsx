import React, { useEffect, useMemo, useState } from "react";
import { localizationService } from "../../localization/localizationService.js";
import { featureToggleService } from "../../services/featureToggleService.js";
import { Button } from "../Buttons.jsx";
import ModalShell, { modalShellTokens } from "./ModalShell.jsx";

export default function ChooseLocaleModal({
                                              open,
                                              theme,
                                          }) {
    const [selected, setSelected] = useState(null);
    const [initial, setInitial] = useState(null);
    const [hovered, setHovered] = useState(null);

    const options = useMemo(() => localizationService.getAvailableLocales(), [localizationService.getAvailableLocales()]);

    const hasDefinedLocale = !!localizationService.isLocaleDefined();
    const canClose = !!selected;

    useEffect(() => {
        if (!open) return;

        const _saved = localizationService.isLocaleDefined()
            ? localizationService.getLocale()
            : null;

        setSelected(_saved);
        setInitial(_saved);
        setHovered(null);
    }, [open]);

    if (!open) return null;

    const handleClose = () => {
        if (!canClose) return;
        window.location.reload();
    }

    const radioStyle = (isActive) => ({
        width: 18,
        height: 18,
        borderRadius: 999,
        border: `2px solid ${isActive ? "#000" : "rgba(0,0,0,0.45)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
    });

    const radioDotStyle = (isActive) => ({
        width: 10,
        height: 10,
        borderRadius: 999,
        background: isActive ? "#000" : "transparent",
    });

    const cardStyle = (isActive, isHover) => ({
        width: "100%",
        textAlign: "left",
        borderRadius: modalShellTokens.optionRadius,
        border: `${modalShellTokens.optionBorderWidth}px solid #000`,
        background: isActive ? theme.accent : "transparent",
        padding: "14px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        cursor: "pointer",
        filter: isHover && !isActive ? "brightness(0.98)" : "none",
        transition: "background-color 120ms ease, filter 120ms ease",
    });

    const mainButtonStyle = {
        display: canClose ? "initial" : "none",
        backgroundColor: canClose ? theme.accent : "rgba(0,0,0,0.18)",
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
        <ModalShell
            open={open}
            id="choose-locale-modal"
            theme={theme}
            title="Choose a language"
            subtitle={selectedLocaleName || "What is your mother tongue"}
            onClose={handleClose}
            closeDisabled={!canClose}
            maxWidth={520}
        >
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

                    <Button
                        variant="offset"
                        compact
                        fullWidth
                        shadowColor={theme.accent}
                        shadowOffset={5}
                        disabled={!canClose}
                        style={mainButtonStyle}
                        onClick={handleClose}
                    >
                        Ok
                    </Button>
                </div>
        </ModalShell>
    );
}
