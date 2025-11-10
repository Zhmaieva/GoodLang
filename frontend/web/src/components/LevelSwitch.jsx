import React from "react";
import PrimaryButton from "./PrimaryButton.jsx";

/**
 * LevelSwitch
 * Props:
 *  - level: "beginner" | "intermediate" | "advanced"
 *  - loading: boolean
 *  - onLevelChange: (value) => void
 *  - theme: { selected, accent, accentDark, unselected }  // optional fallback provided
 */
export default function LevelSwitch({
                                        level,
                                        loading = false,
                                        onLevelChange = (_) => {},
                                        theme,
                                    }) {

    const options = [
        { value: "beginner", label: "Початківець" },
        { value: "intermediate", label: "Середній" },
        { value: "advanced", label: "Просунутий" },
    ];

    // container style: aligns everything center vertically
    const wrap = {
        display: "flex",
        gap: 12,
        alignItems: "center", // vertically center buttons in the row
        flexWrap: "wrap",
        justifyContent: "flex-end",
    };

    return (
        <div style={wrap} role="group" aria-label="Вибір рівня">
            {options.map(({ value, label }) => {
                return (
                    <PrimaryButton key={label} label={label} onPressed={() => {onLevelChange(value)}} theme={theme} selected={level === value} loading={loading} />
                );
            })}
        </div>
    );
}
