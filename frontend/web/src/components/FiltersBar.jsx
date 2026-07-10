import { useEffect, useState } from "react";
import { Button } from "./Buttons.jsx";

const LEVELS = [
    { id: "all", label: "All" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
];

const SELECTED_BUTTON_COLOR = "#000";

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

    // input should match your current “highlight-input” behavior; we keep it minimal
    const inputStyle = {
        fontSize: "1rem",
        fontWeight: 600,
        fontFamily: 'var(--font-family-base)',
        color: "#000",
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
                            <Button
                                key={lvl.id}
                                variant="offset"
                                compact
                                shadowColor={selected ? SELECTED_BUTTON_COLOR : "#40a6ff"}
                                shadowOffset={0}
                                aria-pressed={selected}
                                onClick={() => onLevelChange(lvl.id)}
                                style={{
                                    backgroundColor: selected ? SELECTED_BUTTON_COLOR : "transparent",
                                    color: selected ? "#fff" : "#000",
                                    borderColor: SELECTED_BUTTON_COLOR,

                                    // keep your truncation behavior
                                    flexShrink: 1,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    textAlign: "center",
                                }}
                            >
                                {lvl.label}
                            </Button>
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
                <Button
                    variant="offset"
                    compact
                    shadowColor={showWeakOnly ? SELECTED_BUTTON_COLOR : "#40a6ff"}
                    shadowOffset={0}
                    onClick={onToggleWeak}
                    style={{
                        backgroundColor: showWeakOnly ? SELECTED_BUTTON_COLOR : "transparent",
                        color: showWeakOnly ? "#fff" : "#000",
                        borderColor: SELECTED_BUTTON_COLOR,
                    }}
                >
                    {showWeakOnly ? "Show all" : "Weak only"}
                </Button>
            )}
        </div>
    );
}
