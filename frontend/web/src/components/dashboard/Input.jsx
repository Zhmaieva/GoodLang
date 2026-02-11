// Input.jsx — drop-in, theme-driven (no fonts/sizes/colors defined here)
// Requirements:
// - relies on theme.input tokens
// - bottom-line title text (label row) + clear "×" on the right
// - controlled/uncontrolled friendly (value + onChange)
// - modes: "raw" | "email"
// - placeholder param
// - charLimit
// - full width of container
// - parent can pass style overrides (wrapperStyle, inputStyle, labelStyle, clearStyle)

import React, {useEffect, useMemo} from "react";
import { theme } from "../../App.jsx";

function mergeStyle(a, b) {
    return { ...(a || {}), ...(b || {}) };
}

function normalizeEmail(s) {
    // minimal normalization, no styling decisions here
    return String(s ?? "").trim().toLowerCase();
}

export default function Input({
                                  value,
                                  defaultValue = "",
                                  onChange,

                                  title = "",
                                  placeholder = "",

                                  mode = "raw", // "raw" | "email"
                                  charLimit,

                                  disabled = false,

                                  // style escape hatches (still theme-first)
                                  style,
                                  wrapperStyle,
                                  inputStyle,
                                  labelStyle,
                                  clearStyle,

                                  ariaLabel,
                              }) {
    const t = theme.input;

    const [val, setVal] = React.useState('');

    useEffect(() => {
        setVal(value !== undefined ? String(value ?? "") : undefined);
    }, [value])

    const computed = useMemo(() => {
        return {
            wrap: mergeStyle(
                {
                    width: t.width,
                    display: t.display,
                    flexDirection: t.flexDirection,
                    gap: t.gap,
                    minWidth: t.minWidth,
                },
                wrapperStyle
            ),

            labelRow: mergeStyle(
                {
                    display: t.labelRow.display,
                    alignItems: t.labelRow.alignItems,
                    justifyContent: t.labelRow.justifyContent,
                    gap: t.labelRow.gap,
                    width: t.width,
                },
                style
            ),

            label: mergeStyle(
                {
                    ...t.label,
                },
                labelStyle
            ),

            clearBtn: mergeStyle(
                {
                    ...t.clearBtn,
                    opacity: disabled ? t.clearBtnDisabledOpacity : t.clearBtn.opacity,
                    pointerEvents: disabled ? "none" : t.clearBtn.pointerEvents,
                },
                {
                    position: "relative",
                    right: '1rem',
                    bottom: '.5rem',
                    fontWeight: theme.weights.thin,
                    fontSize: theme.breadcrumbs.fontSize,
                },
                clearStyle
            ),

            input: mergeStyle(
                {
                    ...t.input,
                    width: t.width,
                },
                inputStyle
            ),
        };
    }, [t, style, wrapperStyle, inputStyle, labelStyle, clearStyle, disabled]);

    const currentValue = val !== undefined ? val : String(defaultValue ?? "");
    const showClear = !!currentValue;

    const emit = (next) => {
        if (!onChange) return;
        onChange(next);
    };

    const handleChange = (e) => {
        let next = e?.target?.value ?? "";
        if (mode === "email") next = normalizeEmail(next);

        if (typeof charLimit === "number" && charLimit >= 0) {
            if (next.length > charLimit) next = next.slice(0, charLimit);
        }

        emit(next);
    };

    const handleClear = () => {
        emit("");
    };

    return (
        <div style={computed.wrap}>
            <div style={computed.labelRow}>
                <div style={computed.label}>{title}</div>
            </div>

            <div style={{
                display: "flex",
            }}>
                <input
                    value={val !== undefined ? currentValue : undefined}
                    defaultValue={val === undefined ? currentValue : undefined}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    style={computed.input}
                    aria-label={ariaLabel || title || placeholder || (t.a11y?.inputLabel || "Input")}
                    autoComplete={mode === "email" ? (t.autoCompleteEmail || "email") : (t.autoCompleteRaw || "off")}
                    inputMode={mode === "email" ? (t.inputModeEmail || "email") : undefined}
                    type={mode === "email" ? (t.typeEmail || "email") : (t.typeRaw || "text")}
                />
                <div style={{
                    height: 0,
                }}>
                    <button
                        type="button"
                        style={computed.clearBtn}
                        onClick={handleClear}
                        disabled={disabled || !showClear}
                        aria-label={t.a11y?.clearLabel || "Clear input"}
                        title={t.a11y?.clearLabel || "Clear"}
                    >
                        {t.clearSymbol}
                    </button>
                </div>
            </div>
        </div>
    );
}
