import { useEffect, useState } from "react";
import { Button } from "./Buttons.jsx";
import { APP_ACCENT_COLOR } from "../theme.js";

const LEVELS = [
    { id: "all", label: "All" },
    { id: "beginner", label: "Beginner" },
    { id: "intermediate", label: "Intermediate" },
    { id: "advanced", label: "Advanced" },
];

const SELECTED_BUTTON_COLOR = "#000";
const BUTTON_OFFSET = 4;

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
                                isMobile={isMobile}
                                shadowColor={selected ? SELECTED_BUTTON_COLOR : theme?.accent ?? APP_ACCENT_COLOR}
                                shadowOffset={selected ? 0 : BUTTON_OFFSET}
                                aria-pressed={selected}
                                onClick={() => onLevelChange(lvl.id)}
                                style={{
                                    backgroundColor: selected ? SELECTED_BUTTON_COLOR : theme?.accent ?? APP_ACCENT_COLOR,
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
                    isMobile={isMobile}
                    shadowColor={showWeakOnly ? SELECTED_BUTTON_COLOR : theme?.accent ?? APP_ACCENT_COLOR}
                    shadowOffset={showWeakOnly ? 0 : BUTTON_OFFSET}
                    onClick={onToggleWeak}
                    style={{
                        backgroundColor: showWeakOnly ? SELECTED_BUTTON_COLOR : theme?.accent ?? APP_ACCENT_COLOR,
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
