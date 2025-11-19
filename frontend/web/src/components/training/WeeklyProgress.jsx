import React, { useState, useEffect } from "react";
import {getProgressSummary} from "../../services/insightsService.js";

export function WeeklyProgress({ theme }) {
    const [summary, setSummary] = useState("");

    useEffect(() => {
        setSummary(getProgressSummary());
    }, []);

    return (
        summary &&
        <div style={{
            alignItems: "center",      // vertically centers content
            height: "100%",
            display: "flex",
        }}>
            <div style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: "#fff",
                color: theme.accentDark,
                fontWeight: 600,
                fontSize: 14,
                marginLeft: 12,

            }}>
                {summary}
            </div>
        </div>
    );
}
