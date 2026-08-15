import React, { useEffect, useMemo, useState } from "react";
import { localizationService } from "../../localization/localizationService.js";
import { featureToggleService } from "../../services/featureToggleService.js";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function ChooseLocaleModal({
                                              open,
                                              theme,
                                              onClose,
}) {
    const [selected, setSelected] = useState(null);
    const [initial, setInitial] = useState(null);

    const options = useMemo(() => localizationService.getAvailableLocales(), [localizationService.getAvailableLocales()]);

    const canCancel = !!initial;

    useEffect(() => {
        if (!open) return;

        const _saved = localizationService.isLocaleDefined()
            ? localizationService.getLocale()
            : null;

        setSelected(_saved);
        setInitial(_saved);
    }, [open]);

    if (!open) return null;

    const handleCancel = () => {
        if (!canCancel) return;
        setSelected(initial);
        onClose?.();
    }

    const handleOptionClick = (nextLocale) => {
        setSelected(nextLocale);

        if (nextLocale === initial) {
            onClose?.();
            return;
        }

        localizationService.setLocale(nextLocale);
        onClose?.();
        window.location.reload();
    }

    const optionButtonStyle = (isActive) => ({
        background: isActive ? theme.dark : theme.surface,
        color: isActive ? theme.bg : theme.text,
        borderColor: isActive ? theme.dark : theme.border,
        width: "100%",
        minWidth: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        whiteSpace: "normal",
        boxShadow: "none",
    });

    const listOuterStyle = {
        position: "relative",
        boxSizing: "border-box",
    };

    const listWrapStyle = {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 12,
        maxHeight: "46vh",
        overflowY: "auto",
        paddingRight: 4,
    };

    const disabledHintStyle = {
        marginTop: 14,
        color: theme.muted,
        fontFamily: "var(--font-family-base)",
        fontSize: "0.92rem",
        lineHeight: 1.4,
        fontWeight: 500,
        textAlign: "center",
    };

    if (!featureToggleService.get(featureToggleService.FEATURE_NAME.LOCALIZATION))
        return null;

    return (
        <ModalShell
            open={open}
            id="choose-locale-modal"
            theme={theme}
            title="Choose your native language"
            subtitle="Pick the language you naturally speak."
            titleStyle={{ fontSize: "1.75rem" }}
            onClose={handleCancel}
            closeDisabled={!canCancel}
            maxWidth={520}
            panelStyle={{ padding: 40 }}
            contentStyle={listOuterStyle}
        >
                <div style={listWrapStyle}>
                    {options.map((o) => {
                        const isActive = selected === o.locale;

                        return (
                            <Button
                                key={o.locale}
                                variant="offset"
                                compact
                                fullWidth
                                theme={theme}
                                selected={isActive}
                                shadowColor={theme.accent}
                                shadowOffset={0}
                                aria-pressed={isActive}
                                onClick={() => handleOptionClick(o.locale)}
                                style={optionButtonStyle(isActive)}
                            >
                                <span>{o.name}</span>
                            </Button>
                        );
                    })}
                </div>

                {!canCancel && (
                    <p style={disabledHintStyle}>
                        Choose your native language to continue.
                    </p>
                )}

        </ModalShell>
    );
}
