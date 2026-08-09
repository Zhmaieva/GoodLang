import React, { useEffect, useMemo, useState } from "react";
import { localizationService } from "../../localization/localizationService.js";
import { featureToggleService } from "../../services/featureToggleService.js";
import { Button } from "../Buttons.jsx";
import ModalShell, { modalShellTokens } from "./ModalShell.jsx";

export default function ChooseLocaleModal({
                                              open,
                                              theme,
                                              onClose,
                                          }) {
    const [selected, setSelected] = useState(null);
    const [initial, setInitial] = useState(null);
    const [hovered, setHovered] = useState(null);

    const options = useMemo(() => localizationService.getAvailableLocales(), [localizationService.getAvailableLocales()]);

    const canConfirm = !!selected;
    const canCancel = !!initial;

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

    const handleCancel = () => {
        if (!canCancel) return;
        setSelected(initial);
        setHovered(null);
        onClose?.();
    }

    const handleConfirm = () => {
        if (!canConfirm) return;

        if (selected === initial) {
            onClose?.();
            return;
        }

        localizationService.setLocale(selected);
        onClose?.();
        window.location.reload();
    }

    const cardStyle = (isActive, isHover) => ({
        width: "100%",
        textAlign: "left",
        borderRadius: modalShellTokens.optionRadius,
        border: `${modalShellTokens.optionBorderWidth}px solid ${isActive ? theme.accent : theme.border}`,
        background: isActive ? theme.accent : theme.surface,
        padding: "14px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        cursor: "pointer",
        outline: "none",
        boxShadow: isActive ? "0 12px 28px rgba(123, 97, 216, 0.16)" : "none",
        filter: isHover && !isActive ? "brightness(0.99)" : "none",
        transition: "background-color 120ms ease, border-color 120ms ease, box-shadow 120ms ease, filter 120ms ease",
        WebkitTapHighlightColor: "transparent",
    });

    const mainButtonStyle = {
        marginTop: 10,
        display: canConfirm ? "block" : "none",
    };

    const listOuterStyle = {
        position: "relative",
        marginTop: 2,
        boxSizing: "border-box",
    };

    const listWrapStyle = {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxHeight: "42vh",
        overflowY: "scroll",
        paddingRight: 4,
    };

    if (!featureToggleService.get(featureToggleService.FEATURE_NAME.LOCALIZATION))
        return null;

    return (
        <ModalShell
            open={open}
            id="choose-locale-modal"
            theme={theme}
            title="Choose a language"
            titleStyle={{ fontSize: "1.75rem" }}
            onClose={handleCancel}
            closeDisabled={!canCancel}
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
                                        }}
                                        style={cardStyle(isActive, isHover)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                setSelected(o.locale);
                                            }
                                        }}
                                    >
                                        <div style={{display: "flex", flexDirection: "column", gap: 4, width: "100%"}}>
                                            <div
                                                style={{
                                                    fontWeight: 600,
                                                    color: isActive ? "#fff" : theme.text,
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

                    </div>

                    {!canConfirm && (
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
                        theme={theme}
                        shadowColor={theme.accent}
                        shadowOffset={0}
                        disabled={!canConfirm}
                        wrapperStyle={mainButtonStyle}
                        style={{
                            backgroundColor: theme.accent,
                            color: "#fff",
                            borderColor: "transparent",
                            boxShadow: "0 12px 28px rgba(123, 97, 216, 0.16)",
                        }}
                        onClick={handleConfirm}
                    >
                        Ok
                    </Button>
                </div>
        </ModalShell>
    );
}
