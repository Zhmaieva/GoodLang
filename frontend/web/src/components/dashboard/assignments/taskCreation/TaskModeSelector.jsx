// TaskModeSelector.jsx
import React, { useMemo } from "react";

export default function TaskModeSelector({
                                             value, // "translations" | "gaps" | "mixed"
                                             onChange,
                                             disabled = false,
                                             style,
                                         }) {
    const state = useMemo(() => {
        const v = String(value || "translations");
        const translations = v === "translations" || v === "mixed";
        const gaps = v === "gaps" || v === "mixed";
        return { translations, gaps };
    }, [value]);

    const setFromChecks = (nextTranslations, nextGaps) => {
        // prevent "none" state
        const t = !!nextTranslations;
        const g = !!nextGaps;

        if (!t && !g) return; // keep as-is

        if (t && g) onChange?.("mixed");
        else if (t) onChange?.("translations");
        else onChange?.("gaps");
    };

    return (
        <div style={{ ...styles.wrap, ...style }}>
            <div style={styles.label}>Task type</div>

            <label style={styles.row}>
                <input
                    type="checkbox"
                    checked={state.translations}
                    disabled={disabled}
                    onChange={(e) => setFromChecks(e.target.checked, state.gaps)}
                    style={styles.checkbox}
                />
                <span style={styles.text}>Translations</span>
            </label>

            <label style={styles.row}>
                <input
                    type="checkbox"
                    checked={state.gaps}
                    disabled={disabled}
                    onChange={(e) => setFromChecks(state.translations, e.target.checked)}
                    style={styles.checkbox}
                />
                <span style={styles.text}>Gaps</span>
            </label>
        </div>
    );
}

const styles = {
    wrap: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: "Nunito, ui-sans-serif, system-ui",
    },
    label: {
        fontWeight: 900,
        fontSize: 13,
        color: "var(--muted, #a47856)",
    },
    row: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        userSelect: "none",
    },
    checkbox: {
        width: 18,
        height: 18,
        accentColor: "var(--accent, #ff6138)",
        cursor: "pointer",
    },
    text: {
        fontWeight: 800,
        color: "var(--text, #3a2a1d)",
    },
};
