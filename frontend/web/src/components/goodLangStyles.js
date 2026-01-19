// ui/goodlangStyles.js
export const glCard = (theme) => ({
    background: "#fffdf8",
    border: "3px solid rgba(0,0,0,0.12)",
    boxShadow: "4px 4px 0 rgba(0,0,0,0.18)",
    borderRadius: 18, // squarish but friendly
    padding: 16,
    color: theme?.text ?? "#3a2a1d",
    fontFamily: "Nunito, system-ui, sans-serif",
});

export const glCardTitle = (theme) => ({
    margin: 0,
    fontWeight: 900,
    fontSize: "1.2rem",
    letterSpacing: -0.2,
    color: theme?.text ?? "#3a2a1d",
});

export const glMuted = (theme) => ({
    opacity: 0.8,
    color: theme?.text ?? "#3a2a1d",
});

export const glBtnPrimary = (theme, { hover = false, disabled = false, squarish = true } = {}) => ({
    appearance: "none",
    border: "2px solid rgba(0,0,0,0.12)",
    boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
    borderRadius: squarish ? 14 : 999,
    padding: "10px 14px",
    cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "rgba(0,0,0,0.08)" : (theme?.accent ?? "#ff6138"),
    color: disabled ? "rgba(0,0,0,0.45)" : "#fff",
    fontFamily: "Nunito, system-ui, sans-serif",
    fontWeight: 900,
    lineHeight: 1,
    userSelect: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    transform: (!disabled && hover) ? "translateY(1px)" : "none",
    filter: (!disabled && hover) ? "brightness(0.95)" : "none",
    transition: "transform 120ms ease, filter 120ms ease, opacity 120ms ease",
});

export const glBtnGhost = (theme, { hover = false, disabled = false, squarish = true } = {}) => ({
    ...glBtnPrimary(theme, { hover, disabled, squarish }),
    background: disabled ? "rgba(0,0,0,0.04)" : "#fff",
    color: disabled ? "rgba(0,0,0,0.45)" : (theme?.text ?? "#3a2a1d"),
});

export const glTableWrap = () => ({
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    overflow: "hidden",
    background: "#fff",
});

export const glTr = (hover) => ({
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 130px",
    gap: 10,
    padding: "12px 12px",
    alignItems: "center",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    background: hover ? "#f2f2f2" : "#fff",
    transition: "background 120ms ease",
});
