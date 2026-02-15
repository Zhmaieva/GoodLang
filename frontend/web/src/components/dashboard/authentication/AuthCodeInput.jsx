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

    // ✅ focus without selecting; caret at end
    const focus = (idx) => {
        const el = refs.current[idx];
        if (!el) return;
        el.focus();
        try {
            const pos = (el.value || "").length; // 0 or 1
            el.setSelectionRange(pos, pos);
        } catch {}
    };

    // ✅ focus rules: first empty cell, else last cell
    const targetIndex = React.useCallback(() => {
        const i = digits.indexOf(" ");
        return i >= 0 ? i : Math.max(0, L - 1);
    }, [digits, L]);

    // ✅ ANY pointer down (including on inputs) behaves like wrapper click:
    // - prevent native caret placement
    // - focus the target cell
    const onAnyPointerDown = (e) => {
        e.preventDefault();
        focus(targetIndex());
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

        focus(targetIndex());
    };

    const onKeyDown = (idx, e) => {
        const k = e.key;

        // ✅ prevent movement with arrow keys
        if (k === "ArrowLeft" || k === "ArrowRight" || k === "ArrowUp" || k === "ArrowDown") {
            e.preventDefault();
            return;
        }

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
    };


    const onInputChange = (idx, e) => {
        const raw = e?.target?.value ?? "";
        const d = onlyDigits(raw);

        if (d.length > 1) {
            const arr = digits.split("");
            let j = idx;
            for (let i = 0; i < d.length && j < L; i += 1, j += 1) arr[j] = d[i];
            emit(arr.join("").replace(/\s/g, ""));

            focus(targetIndex());
            return;
        }

        const ch = d ? d[0] : " ";
        setAt(idx, ch);

        if (d && idx < L - 1) focus(idx + 1);
    };

    const wrapperStyle = {
        ...t.row,
        justifyContent: "center",
        borderBottom: t.underlineBorder || t.cellWrap?.borderBottom,
        cursor: "text",
    };

    const cellWrapStyle = {
        ...t.cellWrap,
        borderBottom: "none",
        width: t.cellWidth,
    };

    return (
        <div style={wrapperStyle} onPointerDown={onAnyPointerDown}>
            {Array.from({ length: L }).map((_, idx) => (
                <div key={idx} style={cellWrapStyle}>
                    <input
                        ref={(el) => (refs.current[idx] = el)}
                        value={digits[idx] === " " ? "" : digits[idx]}
                        onPointerDown={onAnyPointerDown}   // ✅ same behavior even when clicking input
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
