import React from "react";
import { theme } from "../../../App.jsx";

function onlyDigits(s) {
    return String(s ?? "").replace(/\D/g, "");
}

export default function AuthCodeInput({ value = "", onChange }) {
    const t = theme.authCodeInput;

    const L = t.length;
    const digits = onlyDigits(value).slice(0, L).padEnd(L, " ");

    const refs = React.useRef([]);

    const emit = (next) => {
        onChange?.(onlyDigits(next).slice(0, L));
    };

    const setAt = (idx, ch) => {
        const arr = digits.split("");
        arr[idx] = ch;
        emit(arr.join("").replace(/\s/g, ""));
    };

    const focus = (idx) => {
        const el = refs.current[idx];
        if (!el) return;
        el.focus();
        try {
            el.setSelectionRange(0, 1);
        } catch {}
    };

    const handlePaste = (idx, e) => {
        const text = onlyDigits(e.clipboardData?.getData("text") || "");
        if (!text) return;

        e.preventDefault();

        const arr = digits.split("");
        let j = idx;
        for (let i = 0; i < text.length && j < L; i += 1, j += 1) {
            arr[j] = text[i];
        }
        emit(arr.join("").replace(/\s/g, ""));

        // focus next empty (or last)
        const nextIdx = Math.min(j, L - 1);
        focus(nextIdx);
    };

    const onKeyDown = (idx, e) => {
        const k = e.key;

        if (k === "Backspace") {
            const cur = digits[idx] === " " ? "" : digits[idx];
            if (cur) {
                e.preventDefault();
                setAt(idx, " ");
                focus(idx);
                return;
            }
            if (idx > 0) {
                e.preventDefault();
                setAt(idx - 1, " ");
                focus(idx - 1);
            }
            return;
        }

        if (k === "ArrowLeft") {
            if (idx > 0) {
                e.preventDefault();
                focus(idx - 1);
            }
            return;
        }

        if (k === "ArrowRight") {
            if (idx < L - 1) {
                e.preventDefault();
                focus(idx + 1);
            }
            return;
        }
    };

    const onInputChange = (idx, e) => {
        const raw = e?.target?.value ?? "";
        const d = onlyDigits(raw);

        // allow typing more than 1 char (mobile) -> distribute
        if (d.length > 1) {
            const arr = digits.split("");
            let j = idx;
            for (let i = 0; i < d.length && j < L; i += 1, j += 1) arr[j] = d[i];
            emit(arr.join("").replace(/\s/g, ""));
            focus(Math.min(j, L - 1));
            return;
        }

        const ch = d ? d[0] : " ";
        setAt(idx, ch);

        // ✅ move focus forward only when a digit is entered
        if (d && idx < L - 1) focus(idx + 1);
    };

    return (
        <div style={t.row}>
            {Array.from({ length: L }).map((_, idx) => (
                <div
                    key={idx}
                    style={{
                        ...t.cellWrap,
                        width: t.cellWidth,
                    }}
                >
                    <input
                        ref={(el) => (refs.current[idx] = el)}
                        value={digits[idx] === " " ? "" : digits[idx]}
                        onChange={(e) => onInputChange(idx, e)}
                        onKeyDown={(e) => onKeyDown(idx, e)}
                        onPaste={(e) => handlePaste(idx, e)}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        style={t.cellInput}
                        aria-label={`Code digit ${idx + 1}`}
                    />
                </div>
            ))}
        </div>
    );
}
