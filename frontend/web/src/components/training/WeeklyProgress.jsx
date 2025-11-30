import React, { useState, useEffect } from "react";
import {estimateTimeToNextLevelText, getProgressSummary} from "../../services/insightsService.js";
import {off, on} from "../../services/events.js";

export function WeeklyProgress({ theme, mobile }) {
    const [summary, setSummary] = useState("");
    const [daysLeft, setDaysLeft] = useState("");

    function refresh() {
        setSummary(getProgressSummary());
        setDaysLeft(estimateTimeToNextLevelText());
    }

    useEffect(() => {
        refresh();

        // subscribe to event
        on("weeklyProgressUpdate", refresh);
        return () => off("weeklyProgressUpdate", refresh);
    }, []);

    return (
        (daysLeft || mobile) &&
        <div style={{
            alignItems: "end",      // vertically centers content
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
        }}>
            {/*<div style={{*/}
            {/*    margin: "6px 0px",*/}
            {/*    padding: "6px 12px",*/}
            {/*    borderRadius: 8,*/}
            {/*    background: "#fff",*/}
            {/*    color: theme.accentDark,*/}
            {/*    border: `2px solid ${theme.accent}`,*/}
            {/*    fontWeight: 600,*/}
            {/*    fontSize: 14,*/}
            {/*    marginLeft: 12,*/}

            {/*}}>*/}
            {/*    {summary}*/}
            {/*</div>*/}

            <div style={{
                visibility: summary ? "visible" : "hidden",
                padding: "6px 12px",
                borderRadius: 8,
                background: "#fff",
                border: `2px solid ${theme.accent}`,
                color: theme.accentDark,
                fontWeight: 600,
                fontSize: mobile ? 12 : 14,
                marginLeft: mobile ? 0 : 12,

            }}>
                {daysLeft}
            </div>
        </div>
    );
}
