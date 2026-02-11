// NumberSlider.jsx — theme-driven, no fonts/sizes/colors here
// UI: [ number + (word singular/plural) + postText ] + subtitle, then slider with vertical-bar thumb
// Params:
// - value (number) + onChange(nextNumber)
// - min, max, step
// - wordSingular, wordPlural, postText  (e.g. "tasks", "tasks", "in the assignment")
// - subtitle (string)
// - disabled
// - style overrides: wrapperStyle, headerStyle, valueStyle, subtitleStyle, sliderWrapStyle, sliderStyle

import React, { useMemo } from "react";
import { theme } from "../../App.jsx";

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
    // Simple EN-style pluralization rule:
    // 1 -> singular, everything else -> plural
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

    const v = clamp(value, safeMin, safeMax);
    const word = chooseWord(v, wordSingular, wordPlural);

    const styles = useMemo(() => {
        return {
            wrap: mergeStyle(
                {
                    ...t.wrap,
                },
                wrapperStyle
            ),

            header: mergeStyle(
                {
                    ...t.header,
                },
                headerStyle
            ),

            valueLine: mergeStyle(
                {
                    ...t.valueLine,
                },
                valueStyle
            ),

            subtitle: mergeStyle(
                {
                    ...t.subtitle,
                },
                subtitleStyle
            ),

            sliderWrap: mergeStyle(
                {
                    ...t.sliderWrap,
                },
                sliderWrapStyle
            ),

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
        onChange?.(next);
    };

    return (
        <div style={styles.wrap}>
            <div style={styles.header}>
                <div style={styles.valueLine}>
                    <span style={t.valueNumber}>{`${v} ${word} ${postText}`}</span>
                </div>
                {!!subtitle && <div style={styles.subtitle}>{subtitle}</div>}
            </div>

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
