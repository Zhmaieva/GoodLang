import React from "react";

export default function AwesomeToggle({ checked, onChange, label }) {
    return (
        <label style={styles.wrap}>
            <input
                type="checkbox"
                checked={!!checked}
                onChange={(e) => onChange?.(e.target.checked)}
                style={styles.input}
            />
            <span style={styles.text}>{label}</span>
        </label>
    );
}

const styles = {
    wrap: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        userSelect: "none",
        fontWeight: 700,
    },
    input: { transform: "scale(1.1)" },
    text: { color: "var(--text, #3a2a1d)" },
};
