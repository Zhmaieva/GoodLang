export const pct = (num, den) => (den ? Math.round((num / den) * 100) : 0);

export const fmtDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export const fmtDateEnShort = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const daysSince = (iso) => {
    if (!iso) return 999;
    const d = new Date(iso).getTime();
    return Math.max(0, Math.round((Date.now() - d) / (1000 * 60 * 60 * 24)));
};
