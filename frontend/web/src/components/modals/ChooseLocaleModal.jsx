import {reloadApp} from "../../services/reloadApp.js";
import React, { useLayoutEffect, useMemo, useState } from "react";
import { Check, MagnifyingGlass } from "@phosphor-icons/react";
import { localizationService } from "../../localization/localizationService.js";
import {
    APP_ACCENT_COLOR,
    APP_ACCENT_SOFT_COLOR,
    APP_BORDER_COLOR,
    APP_DARK_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../../theme.js";
import { Button } from "../Buttons.jsx";
import MobileLocalePicker from "../mobile/MobileLocalePicker.jsx";
import useMobileLayout from "../mobile/useMobileLayout.js";
import ModalShell from "./ModalShell.jsx";

function localeFlag(locale) {
    const region = String(locale ?? "").split("-")[1]?.toUpperCase();
    if (!region || region.length !== 2) return "";

    return String.fromCodePoint(...[...region].map((letter) => 127397 + letter.charCodeAt(0)));
}

export default function ChooseLocaleModal({
    open,
    theme,
    onClose,
}) {
    const isMobile = useMobileLayout();
    const getSavedLocale = () => localizationService.isLocaleDefined()
        ? localizationService.getLocale()
        : null;
    const browserLocale = useMemo(() => localizationService.getBrowserLocale(), []);
    const [selected, setSelected] = useState(() => getSavedLocale() || browserLocale);
    const [initial, setInitial] = useState(getSavedLocale);
    const [query, setQuery] = useState("");

    const options = useMemo(() => localizationService.getAvailableLocales(), []);
    const orderedOptions = useMemo(() => {
        const priorityLocales = [isMobile ? initial || browserLocale : selected, browserLocale].filter(Boolean);
        const prioritized = priorityLocales
            .map((locale) => options.find((option) => option.locale === locale))
            .filter((option, index, list) => (
                option && list.findIndex((candidate) => candidate?.locale === option.locale) === index
            ));
        const prioritySet = new Set(prioritized.map((option) => option.locale));

        return [...prioritized, ...options.filter((option) => !prioritySet.has(option.locale))];
    }, [browserLocale, initial, isMobile, options, selected]);
    const filteredOptions = useMemo(() => {
        const normalizedQuery = query.trim().toLocaleLowerCase();
        if (!normalizedQuery) return orderedOptions;

        return orderedOptions.filter((option) => (
            option.name.toLocaleLowerCase().includes(normalizedQuery)
            || option.locale.toLocaleLowerCase().includes(normalizedQuery)
        ));
    }, [orderedOptions, query]);

    const canCancel = !!initial;
    const accent = theme?.accent ?? APP_ACCENT_COLOR;
    const accentSoft = theme?.accentSoft ?? APP_ACCENT_SOFT_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const dark = theme?.dark ?? APP_DARK_COLOR;
    const muted = theme?.muted ?? APP_MUTED_TEXT_COLOR;
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;

    useLayoutEffect(() => {
        if (!open) return;

        const saved = getSavedLocale();
        setSelected(saved || browserLocale);
        setInitial(saved);
        setQuery("");
    }, [browserLocale, open]);

    if (!open) return null;

    const handleCancel = () => {
        if (!canCancel) return;
        setSelected(initial);
        onClose?.();
    };

    const handleContinue = () => {
        if (!selected) return;

        if (selected === initial) {
            onClose?.();
            return;
        }

        localizationService.setLocale(selected);
        onClose?.();
        reloadApp();
    };

    if (isMobile) {
        return <MobileLocalePicker
            options={filteredOptions}
            selected={selected}
            query={query}
            canCancel={canCancel}
            onQueryChange={setQuery}
            onSelect={setSelected}
            onClose={handleCancel}
            onContinue={handleContinue}
        />;
    }

    const optionButtonStyle = (isActive) => ({
        appearance: "none",
        width: "100%",
        minWidth: 0,
        minHeight: 50,
        padding: "8px 14px",
        display: "grid",
        gridTemplateColumns: "34px minmax(0, 1fr) 24px",
        alignItems: "center",
        gap: 10,
        border: `1px solid ${isActive ? accent : border}`,
        borderRadius: 14,
        background: isActive ? accentSoft : surface,
        color: text,
        cursor: "pointer",
        fontFamily: "var(--font-family-base)",
        fontSize: "0.95rem",
        fontWeight: 700,
        textAlign: "left",
        boxShadow: "none",
    });

    return (
        <ModalShell
            open={open}
            id="choose-locale-modal"
            theme={theme}
            onClose={handleCancel}
            closeDisabled={!canCancel}
            closeOnBackdrop={canCancel}
            hideClose={!canCancel}
            maxWidth={760}
            panelStyle={{ padding: "28px 32px 32px" }}
        >
            <h2
                style={{
                    margin: "2px 52px 18px 0",
                    color: text,
                    fontFamily: "var(--font-family-base)",
                    fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    letterSpacing: 0,
                }}
            >
                What’s your native language?
            </h2>

            <label
                style={{
                    minHeight: 48,
                    padding: "0 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${border}`,
                    borderRadius: 14,
                    background: surface,
                    color: muted,
                    boxSizing: "border-box",
                }}
            >
                <MagnifyingGlass size={21} weight="regular" aria-hidden />
                <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search language..."
                    aria-label="Search language"
                    autoComplete="off"
                    style={{
                        width: "100%",
                        minWidth: 0,
                        padding: 0,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: text,
                        fontFamily: "var(--font-family-base)",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                    }}
                />
            </label>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 250px), 1fr))",
                    gap: 10,
                    maxHeight: "48vh",
                    marginTop: 12,
                    paddingRight: 3,
                    overflowY: "auto",
                    overscrollBehaviorY: "contain",
                }}
            >
                {filteredOptions.map((option) => {
                    const isActive = selected === option.locale;

                    return (
                        <button
                            key={option.locale}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => setSelected(option.locale)}
                            style={optionButtonStyle(isActive)}
                        >
                            <span aria-hidden style={{ fontSize: "1.55rem", lineHeight: 1 }}>
                                {localeFlag(option.locale)}
                            </span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                {option.name}
                            </span>
                            {isActive ? (
                                <span
                                    aria-hidden
                                    style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 999,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: dark,
                                        color: "#fff",
                                    }}
                                >
                                    <Check size={14} weight="bold" />
                                </span>
                            ) : <span aria-hidden />}
                        </button>
                    );
                })}
            </div>

            {filteredOptions.length === 0 && (
                <p
                    style={{
                        margin: "20px 0",
                        color: muted,
                        fontFamily: "var(--font-family-base)",
                        fontSize: "0.95rem",
                        textAlign: "center",
                    }}
                >
                    No languages found.
                </p>
            )}

            <Button
                variant="primary"
                fullWidth
                theme={theme}
                disabled={!selected}
                onClick={handleContinue}
                style={{ minHeight: 50, marginTop: 14 }}
            >
                Continue
            </Button>
        </ModalShell>
    );
}
