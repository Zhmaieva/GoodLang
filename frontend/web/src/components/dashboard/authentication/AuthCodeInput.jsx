import React from "react";
import { theme } from "../../../App.jsx";

function onlyDigits(s) {
    return String(s ?? "").replace(/\D/g, "");
}

export default function AuthCodeInput({
                                          value = "",
                                          onChange,
                                          onComplete,
                                          length,
                                          autoFocus = true,
                                          disabled = false,
                                      }) {
    const t = theme.authCodeInput;
    const L = Number.isFinite(length) ? length : t.length;

    const refs = React.useRef([]);

    const digits = React.useMemo(() => {
        const clean = onlyDigits(value).slice(0, L);
        return Array.from({ length: L }, (_, i) => clean[i] || "");
    }, [value, L]);

    const focus = (idx) => {
        const el = refs.current[idx];
        if (!el) return;
        el.focus({ preventScroll: true });
        try {
            el.setSelectionRange(1, 1);
        } catch {}
    };

    const firstEmpty = () => {
        const i = digits.findIndex((d) => !d);
        return i === -1 ? L - 1 : i;
    };

    React.useEffect(() => {
        if (!autoFocus) return;
        focus(firstEmpty());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setAt = (idx, ch) => {
        const next = [...digits];
        next[idx] = ch;
        const joined = next.join("");
        onChange?.(joined);
        if (!next.includes("") && joined.length === L) onComplete?.(joined);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        if (disabled) return;

        const pasted = onlyDigits(e.clipboardData?.getData("text") || "").slice(0, L);
        if (!pasted) return;

        const joined = pasted.padEnd(L, "");
        onChange?.(joined);

        requestAnimationFrame(() => focus(Math.min(pasted.length, L - 1)));
        if (pasted.length === L) onComplete?.(pasted);
    };

    return (
        <div style={t.row} onPaste={handlePaste}>
            {digits.map((d, i) => (
                <div key={i} style={t.cellWrap}>
                    <input
                        ref={(el) => (refs.current[i] = el)}
                        value={d}
                        disabled={disabled}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        style={t.cellInput}
                        onChange={(e) => {
                            if (disabled) return;
                            const ch = onlyDigits(e.target.value).slice(0, 1);
                            if (!ch) return;
                            setAt(i, ch);
                            requestAnimationFrame(() => focus(Math.min(i + 1, L - 1)));
                        }}
                        onKeyDown={(e) => {
                            if (disabled) return;

                            if (e.key === "Backspace") {
                                e.preventDefault();
                                if (digits[i]) {
                                    setAt(i, "");
                                    requestAnimationFrame(() => focus(i));
                                } else if (i > 0) {
                                    setAt(i - 1, "");
                                    requestAnimationFrame(() => focus(i - 1));
                                }
                                return;
                            }

                            if (e.key === "ArrowLeft") {
                                e.preventDefault();
                                focus(Math.max(0, i - 1));
                                return;
                            }
                            if (e.key === "ArrowRight") {
                                e.preventDefault();
                                focus(Math.min(L - 1, i + 1));
                                return;
                            }

                            if (e.key === "Enter") {
                                const joined = digits.join("");
                                if (!digits.includes("") && joined.length === L) onComplete?.(joined);
                            }
                        }}
                        onFocus={() => {
                            const fe = firstEmpty();
                            if (fe < i && digits[i] === "") focus(fe);
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
