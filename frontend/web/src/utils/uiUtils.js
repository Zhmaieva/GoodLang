// uiUtils.js
export function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
}

export function hexToRgb(hex) {
    const h = (hex || "").replace("#", "").trim();
    if (h.length !== 6) return null;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
}

// Relative luminance (rough) -> decide if background is "light"
export function isLightColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return true;
    const { r, g, b } = rgb;
    // perceived brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 190; // threshold tuned for "white-like"
}
