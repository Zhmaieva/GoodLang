// NumberSlider.jsx — theme-driven, with optional persisted default value
import React, { useEffect, useMemo, useRef } from "react";
import { theme } from "../../App.jsx";
import {Header} from "./Header.jsx";

function mergeStyle(a, b) {
    return { ...(a || {}), ...(b || {}) };
}

function clamp(n, min, max) {
    const nn = Number(n);
    if (Number.isNaN(nn)) return min;
    if (nn < min) return min;
    if (nn > max) return max;
    return nn;
}

function chooseWord(n, singular, plural) {
    return Number(n) === 1 ? singular : plural;
}

export default function NumberSlider({
                                         value,
                                         onChange,

                                         min = 0,
                                         max = 100,
                                         step = 1,

                                         wordSingular = "",
                                         wordPlural = "",
                                         postText = "",

                                         subtitle = "",

                                         disabled = false,

                                         // NEW
                                         defaultValue,     // number
                                         persistKey,       // string (localStorage key)

                                         // style escape hatches (theme-first)
                                         wrapperStyle,
                                         headerStyle,
                                         valueStyle,
                                         subtitleStyle,
                                         sliderWrapStyle,
                                         sliderStyle,

                                         ariaLabel,
                                     }) {
    const t = theme.numberSlider;

    const safeMin = Number(min);
    const safeMax = Number(max);
    const safeStep = Number(step) || 1;

    // --- NEW: initialize value from storage (once) ---
    const didInitRef = useRef(false);

    useEffect(() => {
        if (didInitRef.current) return;
        didInitRef.current = true;

        // If parent controls value, we only set it if it's missing/invalid
        const current = Number(value);
        const hasValidCurrent = !Number.isNaN(current);

        const fallback = clamp(
            defaultValue ?? safeMin,
            safeMin,
            safeMax
        );

        let next = fallback;

        if (persistKey) {
            try {
                const raw = window.localStorage.getItem(persistKey);
                if (raw != null) {
                    const parsed = Number(raw);
                    if (!Number.isNaN(parsed)) next = clamp(parsed, safeMin, safeMax);
                }
            } catch (_) {}
        }

        if (!hasValidCurrent || value == null) {
            onChange?.(next);
        }
    }, [persistKey, defaultValue, safeMin, safeMax]); // intentionally NOT depending on value/onChange

    const v = clamp(value ?? (defaultValue ?? safeMin), safeMin, safeMax);
    const word = chooseWord(v, wordSingular, wordPlural);

    const styles = useMemo(() => {
        return {
            wrap: mergeStyle({ ...t.wrap }, wrapperStyle),
            header: mergeStyle({ ...t.header }, headerStyle),
            valueLine: mergeStyle({ ...t.valueLine }, valueStyle),
            subtitle: mergeStyle({ ...t.subtitle }, subtitleStyle),
            sliderWrap: mergeStyle({ ...t.sliderWrap }, sliderWrapStyle),
            slider: mergeStyle(
                {
                    ...t.slider,
                    opacity: disabled ? t.sliderDisabledOpacity : t.slider.opacity,
                    pointerEvents: disabled ? "none" : t.slider.pointerEvents,
                },
                sliderStyle
            ),
        };
    }, [
        t,
        wrapperStyle,
        headerStyle,
        valueStyle,
        subtitleStyle,
        sliderWrapStyle,
        sliderStyle,
        disabled,
    ]);

    const handleChange = (e) => {
        const raw = Number(e?.target?.value);
        const next = clamp(raw, safeMin, safeMax);

        if (persistKey) {
            try {
                window.localStorage.setItem(persistKey, String(next));
            } catch (_) {}
        }

        onChange?.(next);
    };

    return (
        <div style={styles.wrap}>
            <Header title={`${v} ${word} ${postText}`} subtitle={subtitle} />

            <div style={styles.sliderWrap}>
                <input
                    className="gl-number-slider"
                    type="range"
                    min={safeMin}
                    max={safeMax}
                    step={safeStep}
                    value={v}
                    onChange={handleChange}
                    disabled={disabled}
                    aria-label={ariaLabel || t.a11y?.sliderLabel || "Number slider"}
                    style={{
                        ...styles.slider,
                        "--gl-steps": (safeMax - safeMin) / safeStep,
                    }}
                />
            </div>
        </div>
    );
}