// Input.jsx — drop-in, theme-driven (no fonts/sizes/colors defined here)
// ONLY CHANGE: prevent browser autofill from changing text styling

import React, {useEffect, useMemo} from "react";
import { theme } from "../../App.jsx";

function mergeStyle(a, b) {
    return { ...(a || {}), ...(b || {}) };
}

function normalizeEmail(s) {
    // minimal normalization, no styling decisions here
    return String(s ?? "").trim().toLowerCase();
}

const AUTOFILL_CLASS = "gl-input-autofill";

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
                    opacity: disabled || !value ? t.clearBtnDisabledOpacity : t.clearBtn.opacity,
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
    }, [t, style, wrapperStyle, inputStyle, labelStyle, clearStyle, disabled, value]);

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

// ✅ autofill fix: force exact same typography as theme.input.input
    const autofillCss = useMemo(() => {
        // read the same tokens you're already applying via computed.input
        const ff = theme.input?.input?.fontFamily || theme.fontFamily;
        const fs = theme.input?.input?.fontSize;
        const fw = theme.input?.input?.fontWeight;
        const lh = theme.input?.input?.lineHeight;
        const color = theme.input?.input?.color;

        // Note: we only set typography + text fill; no background/shadow changes
        return `
    input.${AUTOFILL_CLASS}:-webkit-autofill,
    input.${AUTOFILL_CLASS}:-webkit-autofill:hover,
    input.${AUTOFILL_CLASS}:-webkit-autofill:focus,
    input.${AUTOFILL_CLASS}:-webkit-autofill:active {
      font-family: ${ff} !important;
      ${fs ? `font-size: ${fs} !important;` : ""}
      ${fw ? `font-weight: ${fw} !important;` : ""}
      ${lh ? `line-height: ${lh} !important;` : ""}

      ${color ? `-webkit-text-fill-color: ${color} !important;` : "-webkit-text-fill-color: inherit !important;"}
      caret-color: ${color || "inherit"} !important;

      /* avoid Safari text autosizing weirdness */
      -webkit-text-size-adjust: 100% !important;
    }
  `;
    }, []);


    return (
        <div style={computed.wrap}>
            {/* ✅ autofill text style fix only */}
            <style dangerouslySetInnerHTML={{ __html: autofillCss }} />

            <div style={computed.labelRow}>
                <div style={computed.label}>{title}</div>
            </div>

            <div style={{
                display: "flex",
            }}>
                <input
                    className={AUTOFILL_CLASS}
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
