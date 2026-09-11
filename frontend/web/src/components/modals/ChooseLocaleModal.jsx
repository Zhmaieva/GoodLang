import React, { useLayoutEffect, useMemo, useState } from "react";
import { localizationService } from "../../localization/localizationService.js";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function ChooseLocaleModal({
                                              open,
                                              theme,
                                              onClose,
}) {
    const getSavedLocale = () => localizationService.isLocaleDefined()
        ? localizationService.getLocale()
        : null;
    const [selected, setSelected] = useState(getSavedLocale);
    const [initial, setInitial] = useState(getSavedLocale);

    const options = useMemo(() => localizationService.getAvailableLocales(), []);
    const browserLocale = useMemo(() => localizationService.getBrowserLocale(), []);
    const orderedOptions = useMemo(() => {
        const priorityLocales = [selected, browserLocale].filter(Boolean);
        const prioritized = priorityLocales
            .map((locale) => options.find((option) => option.locale === locale))
            .filter((option, index, list) => (
                option && list.findIndex((candidate) => candidate?.locale === option.locale) === index
            ));
        const prioritySet = new Set(prioritized.map((option) => option.locale));

        return [...prioritized, ...options.filter((option) => !prioritySet.has(option.locale))];
    }, [browserLocale, options, selected]);

    const canCancel = !!initial;

    useLayoutEffect(() => {
        if (!open) return;

        const saved = getSavedLocale();

        setSelected(saved);
        setInitial(saved);
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
        minHeight: 0,
        maxHeight: "46vh",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        overscrollBehaviorY: "contain",
        touchAction: "pan-y",
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
            closeOnBackdrop={canCancel}
            hideClose={!canCancel}
            maxWidth={520}
            panelStyle={{ padding: 40 }}
            contentStyle={listOuterStyle}
        >
                <div
                    style={listWrapStyle}
                    data-body-scroll-lock-scrollable="true"
                >
                    {orderedOptions.map((o) => {
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
