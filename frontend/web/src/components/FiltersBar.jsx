import { useEffect, useState } from "react";
import { Button } from "./Buttons.jsx";
import {
    APP_ACCENT_COLOR,
    APP_ACCENT_SOFT_COLOR,
    APP_BORDER_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../theme.js";

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

    const accent = theme?.accent ?? APP_ACCENT_COLOR;
    const accentSoft = theme?.accentSoft ?? APP_ACCENT_SOFT_COLOR;
    const border = theme?.border ?? APP_BORDER_COLOR;
    const surface = theme?.surface ?? APP_SURFACE_COLOR;
    const text = theme?.text ?? APP_TEXT_COLOR;

    const inputStyle = {
        fontSize: "0.94rem",
        fontWeight: 600,
        fontFamily: "var(--font-family-base)",
        color: text,
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
                                shadowOffset={0}
                                aria-pressed={selected}
                                onClick={() => onLevelChange(lvl.id)}
                                style={{
                                    backgroundColor: selected ? accentSoft : surface,
                                    color: selected ? accent : text,
                                    borderColor: selected ? accent : border,
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
                    shadowOffset={0}
                    onClick={onToggleWeak}
                    style={{
                        backgroundColor: showWeakOnly ? accentSoft : surface,
                        color: showWeakOnly ? accent : text,
                        borderColor: showWeakOnly ? accent : border,
                        outline: "none",
                    }}
                >
                    {showWeakOnly ? "Show all" : "Weak only"}
                </Button>
            )}
        </div>
    );
}
