import {LEVELS} from "../../utils/constants.js";
import {Chip} from "./Chip.jsx";
import React, {useState} from "react";
import {themeStyles} from "../../utils/theme";

const theme = themeStyles;
export default function ChooseLevel({initialLevel, onChange = (l) => {}}) {
    const [level, setLevel] = useState(initialLevel);

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: theme.spacing.gap,
            maxWidth: theme.sizes.commonWidth,
        }}>
            {LEVELS.map((l) => (
                <Chip
                    key={l}
                    active={level === l}
                    onClick={() => {
                        setLevel(l);
                        onChange(l);
                        // clearTextOnly();
                        // setToast("");
                        // setGlobalError("");
                    }}
                >
                    {l}
                </Chip>
            ))}
        </div>
    )
}