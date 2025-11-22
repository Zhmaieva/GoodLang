import React, { useState, useEffect } from "react";
import {estimateTimeToNextLevelText, getProgressSummary} from "../../services/insightsService.js";

export function WeeklyProgress({ theme }) {
    const [summary, setSummary] = useState("");
    const [daysLeft, setDaysLeft] = useState("");

    useEffect(() => {
        setSummary(getProgressSummary());
        setDaysLeft(estimateTimeToNextLevelText());
    }, []);

    return (
        summary &&
        <div style={{
            alignItems: "end",      // vertically centers content
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        }}>
            <div style={{
                margin: "6px 0px",
                padding: "6px 12px",
                borderRadius: 8,
                background: "#fff",
                color: theme.accentDark,
                border: `2px solid ${theme.accent}`,
                fontWeight: 600,
                fontSize: 14,
                marginLeft: 12,

            }}>
                {summary}
            </div>

            <div style={{
                padding: "6px 12px",
                margin: "6px 0px",
                borderRadius: 8,
                background: "#fff",
                border: `2px solid ${theme.accent}`,
                color: theme.accentDark,
                fontWeight: 600,
                fontSize: 14,
                marginLeft: 12,

            }}>
                {daysLeft}
            </div>
        </div>
    );
}
