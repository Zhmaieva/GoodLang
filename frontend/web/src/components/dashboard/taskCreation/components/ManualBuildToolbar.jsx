// ManualBuildToolbar.jsx
import React, { useMemo } from "react";
import AwesomeButton from "../../AwesomeButton.jsx";
import TaskModeSelector from "../TaskModeSelector.jsx";
import TaskNumberSelector from "../TaskNumberSelector.jsx";

function makeRandomSeed() {
    return Math.floor(Math.random() * 1_000_000_000);
}

export default function ManualBuildToolbar({
                                               manualBuild,
                                               setManualBuild,
                                               disabled = false,
                                               style,
                                           }) {
    const seed = useMemo(() => {
        const n = Number(manualBuild?.seed);
        return Number.isFinite(n) ? n : makeRandomSeed();
    }, [manualBuild?.seed]);

    // ensure seed exists but never display it
    React.useEffect(() => {
        const n = Number(manualBuild?.seed);
        if (!Number.isFinite(n)) {
            setManualBuild?.((prev) => ({ ...(prev || {}), seed }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRegenerate = () => {
        const nextSeed = makeRandomSeed();
        setManualBuild?.((prev) => ({ ...(prev || {}), seed: nextSeed }));
    };

    return (
        <div style={{ ...styles.wrap, ...style }}>
            {/* TOP: controls */}
            <div style={styles.top}>
                <TaskModeSelector
                    value={manualBuild?.taskMode || "translations"}
                    onChange={(taskMode) =>
                        setManualBuild?.((prev) => ({ ...(prev || {}), taskMode }))
                    }
                    disabled={disabled}
                />

                <TaskNumberSelector
                    value={manualBuild?.numberOfTasks ?? 10}
                    onChange={(numberOfTasks) =>
                        setManualBuild?.((prev) => ({ ...(prev || {}), numberOfTasks }))
                    }
                    disabled={disabled}
                />
            </div>

            {/* BOTTOM: button */}
            <div style={styles.bottom}>
                <AwesomeButton
                    variant="accent"
                    onClick={onRegenerate}
                    disabled={disabled}
                    title="Перегенерувати"
                >
                    Перегенерувати
                </AwesomeButton>
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 12,
        fontFamily: "Nunito, ui-sans-serif, system-ui",
    },
    top: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: "flex-start",
        height: "0px",
    },
    bottom: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
    },
};
