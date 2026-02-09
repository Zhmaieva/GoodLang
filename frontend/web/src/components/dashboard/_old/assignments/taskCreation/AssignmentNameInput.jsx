// AssignmentNameInput.jsx
import React, { useEffect, useState } from "react";

function pad2(n) {
    return String(n).padStart(2, "0");
}

function defaultName() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = pad2(d.getMonth() + 1);
    const dd = pad2(d.getDate());
    const hh = pad2(d.getHours());
    const mi = pad2(d.getMinutes());
    return `Assignment ${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}

export default function AssignmentNameInput({ value, onChange, style }) {
    const TOKENS = {
        card: "rgba(255,255,255,0.1)",
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        radius: 20,
    };

    const [local, setLocal] = useState(value ?? "");

    useEffect(() => {
        if (!String(value ?? "").trim()) {
            const d = defaultName();
            setLocal(d);
            onChange?.(d);
        } else {
            setLocal(String(value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            style={{
                borderRadius: TOKENS.radius,
                background: TOKENS.card,
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontFamily: "Nunito, ui-sans-serif, system-ui",
                ...style,
            }}
        >
            <div style={{ paddingLeft: 4, color: TOKENS.muted, fontWeight: 900 }}>
                Assignment name
            </div>

            <input
                value={local}
                onChange={(e) => {
                    const v = e.target.value;
                    setLocal(v);
                    onChange?.(v);
                }}
                placeholder="Assignment name"
                style={{
                    width: "100%",
                    padding: "12px 12px",
                    borderRadius: 14,
                    border: `1px solid ${TOKENS.border}`,
                    background: "rgba(255,255,255,0.65)",
                    fontFamily: "Nunito, ui-sans-serif, system-ui",
                    fontWeight: 900,
                    color: TOKENS.text,
                    outline: "none",
                }}
            />
        </div>
    );
}
