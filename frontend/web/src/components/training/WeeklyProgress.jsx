import React, { useState, useEffect } from "react";
import { estimateTimeToNextLevelText } from "../../services/insightsService.js";
import { off, on } from "../../services/events.js";
import { getProgress } from "../../services/trainingDirector.js";

export function WeeklyProgress({ theme, mobile }) {
    const [daysLeft, setDaysLeft] = useState("");
    const [nextLevelAccuracy, setNextLevelAccuracy] = useState("");
    const [nextLevelTo, setNextLevelTo] = useState("");

    function refresh() {
        const estimate = estimateTimeToNextLevelText();
        setDaysLeft(estimate.text);

        const { accuracy, levelNameTo } = getProgress();

        if (!accuracy || accuracy <= 0) {
            setNextLevelTo(null);
            setNextLevelAccuracy(null);
        } else {
            setNextLevelTo(levelNameTo);
            setNextLevelAccuracy(accuracy.toFixed(2));
        }
    }

    useEffect(() => {
        refresh();
        on("weeklyProgressUpdate", refresh);
        return () => off("weeklyProgressUpdate", refresh);
    }, []);

    const isAssessment = daysLeft === "Оцінка рівня - продовжуй практику";

    return (
        (daysLeft || mobile || nextLevelAccuracy) && (
            <div
                style={{
                    alignItems: mobile ? "start" : "end",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 12,
                }}
            >
                {daysLeft && (
                    <div
                        style={{
                            padding: "6px 12px",
                            borderRadius: isAssessment ? 20 : 8,
                            background: "#fff",
                            border: `2px solid ${theme.accent}`,
                            color: theme.accentDark,
                            fontWeight: 600,
                            fontSize: mobile ? 12 : 14,
                            marginLeft: mobile ? 0 : 12,
                        }}
                    >
                        {daysLeft}
                    </div>
                )}

                {daysLeft !== "Оцінка рівня - продовжуй практику" &&
                    nextLevelAccuracy && (
                        <div
                            style={{
                                padding: "6px 12px",
                                borderRadius: 20,
                                background: "#fff",
                                border: `2px solid ${theme.accent}`,
                                color: theme.accentDark,
                                fontWeight: 600,
                                fontSize: mobile ? 12 : 14,
                                marginLeft: mobile ? 0 : 12,
                            }}
                        >
                            Точність {nextLevelTo} рівня: {nextLevelAccuracy}%
                        </div>
                    )}
            </div>
        )
    );
}
