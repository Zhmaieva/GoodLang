// Input.jsx — drop-in, theme-driven (no fonts/sizes/colors defined here)
// Changes requested:
// ✅ add optional subtext row below label (occupies space) + fades in/out on input changes
// ✅ prevent caret jumping to end when value updates

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
                                  subtext = "",
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

    const inputRef = React.useRef(null);
    const selRef = React.useRef({ start: null, end: null, wasFocused: false });

    // ✅ subtext opacity (occupy space, fade only)
    const [subtextOpacity, setSubtextOpacity] = React.useState(subtext ? 1 : 0);

    // when parent provides new subtext -> fade in
    useEffect(() => {
        setSubtextOpacity(subtext ? 1 : 0);
    }, [subtext]);

    useEffect(() => {
        // ✅ preserve caret/selection only if the input is focused
        const el = inputRef.current;
        const isFocused = !!el && document.activeElement === el;

        if (isFocused && el) {
            selRef.current = {
                start: el.selectionStart,
                end: el.selectionEnd,
                wasFocused: true,
            };
        } else {
            selRef.current = { start: null, end: null, wasFocused: false };
        }

        setVal(value !== undefined ? String(value ?? "") : undefined);

        // restore selection AFTER state applies
        if (selRef.current.wasFocused) {
            queueMicrotask(() => {
                const el2 = inputRef.current;
                if (!el2) return;
                if (document.activeElement !== el2) return;

                const { start, end } = selRef.current;
                if (typeof start === "number" && typeof end === "number") {
                    try {
                        el2.setSelectionRange(start, end);
                    } catch {}
                }
            });
        }
    }, [value]);

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

            // ✅ subtext style: reuse theme.input.subtext if present, else empty object
            subtext: mergeStyle(
                (t.subtext || {}),
                {
                    // only opacity animation; occupies space because we always render it
                    transition: `opacity ${theme.motion.fast} ${theme.motion.ease}`,
                    opacity: subtextOpacity,
                }
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
    }, [t, style, wrapperStyle, inputStyle, labelStyle, clearStyle, disabled, value, subtextOpacity]);

    const currentValue = val !== undefined ? val : String(defaultValue ?? "");
    const showClear = !!currentValue;

    const emit = (next) => {
        if (!onChange) return;
        onChange(next);
    };

    const handleChange = (e) => {
        // ✅ when input changes -> fade OUT subtext (but keep its row space)
        if (subtextOpacity !== 0) setSubtextOpacity(0);

        let next = e?.target?.value ?? "";
        if (mode === "email") next = normalizeEmail(next);

        if (typeof charLimit === "number" && charLimit >= 0) {
            if (next.length > charLimit) next = next.slice(0, charLimit);
        }

        emit(next);
    };

    const handleClear = () => {
        // clearing is also a change -> fade out
        if (subtextOpacity !== 0) setSubtextOpacity(0);
        emit("");
    };

    // (keeping your autofill css exactly as-is)
    const autofillCss = useMemo(() => {
        const ff = theme.input?.input?.fontFamily || theme.fontFamily;
        const fs = theme.input?.input?.fontSize;
        const fw = theme.input?.input?.fontWeight;
        const lh = theme.input?.input?.lineHeight;
        const color = theme.input?.input?.color;

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

      -webkit-text-size-adjust: 100% !important;
    }
  `;
    }, []);

    return (
        <div style={computed.wrap}>
            <style dangerouslySetInnerHTML={{__html: autofillCss}}/>

            <div style={computed.labelRow}>
                <div style={computed.label}>{title}</div>
            </div>

            <div style={{
                display: "flex",
            }}>
                <input
                    ref={inputRef}
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
            <div style={computed.subtext}>{subtext ? subtext : "\u00A0"}</div>


        </div>
    );
}
