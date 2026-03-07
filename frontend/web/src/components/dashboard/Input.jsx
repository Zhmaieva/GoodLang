import React, { useEffect, useMemo } from "react";
import { theme } from "../../App.jsx";

function mergeStyle(a, b) {
    return { ...(a || {}), ...(b || {}) };
}

function normalizeEmail(s) {
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

                                  mode = "raw",
                                  charLimit,

                                  disabled = false,

                                  style,
                                  wrapperStyle,
                                  inputStyle,
                                  labelStyle,
                                  clearStyle,

                                  ariaLabel,

                                  // ✅ NEW: shuffle support
                                  shuffleItems,
                                  shuffleEnabled = true,
                                  shuffleTitle = "Shuffle",
                                  shuffleAriaLabel = "Shuffle input",
                                  shuffleSymbol = "⟲",
                                  shuffleStyle,
                                  shufflePick,
                              }) {
    const t = theme.input;

    const inputRef = React.useRef(null);

    // ✅ single source of truth for displayed value
    const isControlled = value !== undefined;

    const [val, setVal] = React.useState(() => {
        const initial = isControlled ? String(value ?? "") : String(defaultValue ?? "");
        return initial;
    });

    // track last external value to avoid resetting caret on same-value renders
    const lastExtRef = React.useRef(isControlled ? String(value ?? "") : null);

    // selection restore info
    const selRef = React.useRef({ start: null, end: null, shouldRestore: false });

    // ✅ sync from parent ONLY when external value actually changes
    useEffect(() => {
        if (!isControlled) return;

        const nextExt = String(value ?? "");
        if (lastExtRef.current === nextExt) return;

        const el = inputRef.current;
        const isFocused = !!el && document.activeElement === el;

        if (isFocused && el) {
            selRef.current = {
                start: el.selectionStart,
                end: el.selectionEnd,
                shouldRestore: true,
            };
        } else {
            selRef.current = { start: null, end: null, shouldRestore: false };
        }

        lastExtRef.current = nextExt;
        setVal(nextExt);
    }, [isControlled, value]);

    // ✅ restore selection immediately after val changes (before paint)
    React.useLayoutEffect(() => {
        if (!selRef.current.shouldRestore) return;

        const el = inputRef.current;
        if (!el) return;
        if (document.activeElement !== el) return;

        const { start, end } = selRef.current;
        selRef.current.shouldRestore = false;

        if (typeof start === "number" && typeof end === "number") {
            try {
                // clamp to current length (important if parent normalized)
                const len = el.value.length;
                const s = Math.min(start, len);
                const e = Math.min(end, len);
                el.setSelectionRange(s, e);
            } catch {}
        }
    }, [val]);

    // ✅ subtext opacity
    const [subtextOpacity, setSubtextOpacity] = React.useState(subtext ? 1 : 0);
    useEffect(() => {
        setSubtextOpacity(subtext ? 1 : 0);
    }, [subtext]);

    const hasShuffle = shuffleEnabled && Array.isArray(shuffleItems) && shuffleItems.length > 0;

    const computed = useMemo(() => {
        const shuffleBtnBase =
            t.shuffleBtn ||
            {
                ...t.clearBtn,
                // slightly different placement than clear, but compatible if theme has only clearBtn
            };

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

            subtext: mergeStyle((t.subtext || {}), {
                transition: `opacity ${theme.motion.fast} ${theme.motion.ease}`,
                opacity: subtextOpacity,
            }),

            clearBtn: mergeStyle(
                {
                    ...t.clearBtn,
                    opacity: disabled || !val ? t.clearBtnDisabledOpacity : t.clearBtn.opacity,
                    pointerEvents: disabled ? "none" : t.clearBtn.pointerEvents,
                },
                {
                    position: "relative",
                    right: "1rem",
                    bottom: ".5rem",
                    fontWeight: theme.weights.thin,
                    fontSize: theme.breadcrumbs.fontSize,
                },
                clearStyle
            ),

            shuffleBtn: mergeStyle(
                {
                    ...shuffleBtnBase,
                    opacity: disabled ? (shuffleBtnBase.disabledOpacity ?? t.clearBtnDisabledOpacity) : shuffleBtnBase.opacity,
                    pointerEvents: disabled ? "none" : shuffleBtnBase.pointerEvents,
                },
                {
                    position: "relative",
                    right: "0.4rem",
                    bottom: ".5rem",
                    fontWeight: theme.weights.thin,
                    fontSize: theme.breadcrumbs.fontSize,
                    // keep it visually separate from clear
                    marginLeft: "0.1rem",
                },
                shuffleStyle
            ),

            input: mergeStyle(
                {
                    ...t.input,
                    width: t.width,
                },
                inputStyle
            ),
        };
    }, [
        t,
        style,
        wrapperStyle,
        inputStyle,
        labelStyle,
        clearStyle,
        disabled,
        val,
        subtextOpacity,
        shuffleStyle,
    ]);

    const showClear = !!val;

    const emit = (next) => {
        if (!onChange) return;
        onChange(next);
    };

    const applyNextValue = (next, { focus = true, selectAll = true } = {}) => {
        if (subtextOpacity !== 0) setSubtextOpacity(0);

        const el = inputRef.current;
        const isFocused = !!el && document.activeElement === el;

        // We want stable UX: focus and select all after shuffle (or at least put caret end)
        // Capture selection first if focused
        if (isFocused && el) {
            selRef.current = {
                start: el.selectionStart,
                end: el.selectionEnd,
                shouldRestore: false, // we'll set explicitly below
            };
        } else {
            selRef.current = { start: null, end: null, shouldRestore: false };
        }

        // enforce normalization/charLimit same as typing
        let normalized = String(next ?? "");
        if (mode === "email") normalized = normalizeEmail(normalized);

        if (typeof charLimit === "number" && charLimit >= 0) {
            if (normalized.length > charLimit) normalized = normalized.slice(0, charLimit);
        }

        setVal(normalized);
        if (isControlled) lastExtRef.current = normalized;
        emit(normalized);

        // focus + selection behavior
        if (focus && el) {
            try {
                el.focus();
                // after state update, React will re-render; we can still set selection immediately on DOM value
                // (works fine because we're controlling the input)
                if (selectAll) {
                    const len = normalized.length;
                    el.setSelectionRange(0, len);
                } else {
                    const len = normalized.length;
                    el.setSelectionRange(len, len);
                }
            } catch {}
        }
    };

    const handleChange = (e) => {
        if (subtextOpacity !== 0) setSubtextOpacity(0);

        const el = e?.target;
        // capture caret before we mutate val (important for mid-edit)
        if (el && document.activeElement === el) {
            selRef.current = {
                start: el.selectionStart,
                end: el.selectionEnd,
                shouldRestore: true,
            };
        } else {
            selRef.current = { start: null, end: null, shouldRestore: false };
        }

        let next = el?.value ?? "";
        if (mode === "email") next = normalizeEmail(next);

        if (typeof charLimit === "number" && charLimit >= 0) {
            if (next.length > charLimit) next = next.slice(0, charLimit);
        }

        // ✅ update internal state immediately so caret stays stable
        setVal(next);

        // ✅ keep lastExt in sync to avoid effect re-setting same value
        if (isControlled) lastExtRef.current = next;

        emit(next);
    };

    const handleClear = () => {
        applyNextValue("", { focus: true, selectAll: false });
    };

    const handleShuffle = () => {
        if (!hasShuffle || disabled) return;

        const items = shuffleItems.filter((x) => String(x ?? "").trim().length > 0);
        if (items.length === 0) return;

        let picked;
        if (typeof shufflePick === "function") {
            picked = shufflePick(items);
        } else {
            const idx = Math.floor(Math.random() * items.length);
            picked = items[idx];
        }

        applyNextValue(String(picked ?? ""), { focus: true, selectAll: true });
    };

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
            <style dangerouslySetInnerHTML={{ __html: autofillCss }} />

            <div style={computed.labelRow}>
                <div style={computed.label}>{title}</div>
            </div>

            <div style={{ display: "flex" }}>
                <input
                    ref={inputRef}
                    className={AUTOFILL_CLASS}
                    value={val}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    style={computed.input}
                    aria-label={ariaLabel || title || placeholder || (t.a11y?.inputLabel || "Input")}
                    autoComplete={mode === "email" ? (t.autoCompleteEmail || "email") : (t.autoCompleteRaw || "off")}
                    inputMode={mode === "email" ? (t.inputModeEmail || "email") : undefined}
                    type={mode === "email" ? (t.typeEmail || "email") : (t.typeRaw || "text")}
                />

                {/* right-side buttons */}
                <div style={{ height: 0, display: "flex" }}>
                    {hasShuffle && (
                        <button
                            type="button"
                            style={computed.shuffleBtn}
                            onClick={handleShuffle}
                            disabled={disabled}
                            aria-label={shuffleAriaLabel}
                            title={shuffleTitle}
                        >
                            {t.shuffleSymbol || shuffleSymbol}
                        </button>
                    )}

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