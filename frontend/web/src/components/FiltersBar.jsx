import { useEffect, useState } from "react";

const LEVELS = [
    { id: "all", label: "All" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
];

export default function FiltersBar({
                                       filterLevel,
                                       onLevelChange,
                                       query,
                                       onQueryChange,
                                       showWeakOnly,
                                       onToggleWeak,
                                       advanced = true,
                                       theme, // ✅ pass theme from App/HomePage like others
                                   }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 915);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // Fallbacks if theme is not passed for some reason
    const t = theme ?? {
        green: "#4ba36e",
        greenDark: "#2d6f48",
        text: "#3a2a1d",
        muted: "#a47856",
    };

    // "Common button" language (like marathon modal), with your selected/unselected palette
    const pillStyle = (selected) => ({
        appearance: "none",
        padding: "8px 14px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        fontFamily: "Nunito, system-ui, sans-serif",
        whiteSpace: "nowrap",

        background: selected ? t.green : "rgba(255,255,255,0.78)",
        color: selected ? "#fff" : t.text,

        border: selected ? "2px solid rgba(0,0,0,0.10)" : "2px solid rgba(0,0,0,0.12)",
        boxShadow: selected ? "2px 2px 0 rgba(0,0,0,0.16)" : "2px 2px 0 rgba(0,0,0,0.12)",

        cursor: "pointer",
        transition: "transform 120ms ease, filter 120ms ease, box-shadow 120ms ease",
    });

    // input should match your current “highlight-input” behavior; we keep it minimal
    const inputStyle = {
        fontSize: "1rem",
        fontWeight: 700,
        fontFamily: "Nunito, system-ui, sans-serif",
        color: t.text,
    };

    return (
        <div className="filters">
            {!isMobile && (
                <div
                    className="level-switch"
                    role="group"
                    aria-label="Фільтр рівня"
                    style={{
                        display: "flex",
                        gap: "8px",
                        flexWrap: "wrap",
                        justifyContent: "flex-start",
                    }}
                >
                    {LEVELS.map((lvl) => {
                        const selected = filterLevel === lvl.id;

                        return (
                            <button
                                key={lvl.id}
                                className={`pill ${selected ? "selected" : ""}`}
                                aria-pressed={selected}
                                onClick={() => onLevelChange(lvl.id)}
                                style={{
                                    ...pillStyle(selected),

                                    // keep your truncation behavior
                                    flexShrink: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textAlign: "center",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseDown={(e) => {
                                    e.currentTarget.style.transform = "translateY(1px)";
                                }}
                                onMouseUp={(e) => {
                                    e.currentTarget.style.transform = "translateY(-1px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "none";
                                }}

                            >
                                {lvl.label}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="search">
                <input
                    className={"highlight-input"}
                    style={inputStyle}
                    type="search"
                    placeholder={`Search rule…${isMobile ? "" : " (e.g., Present Perfect, or, wish)"}`}
                    aria-label="Search rule"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                />
            </div>

            {advanced && (
                <button
                    className={`pill ${showWeakOnly ? "selected" : ""}`}
                    onClick={onToggleWeak}
                    style={pillStyle(showWeakOnly)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.transform = "translateY(1px)";
                    }}
                    onMouseUp={(e) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                    }}

                >
                    {showWeakOnly ? "Show all" : "Weak only"}
                </button>
            )}
        </div>
    );
}
