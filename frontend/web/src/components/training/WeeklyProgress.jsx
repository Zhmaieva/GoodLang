import React, { useState, useEffect } from "react";
import {estimateTimeToNextLevelText} from "../../services/insightsService.js";
import {off, on} from "../../services/events.js";

export function WeeklyProgress({ theme, mobile }) {
    const [daysLeft, setDaysLeft] = useState("");

    function refresh() {setDaysLeft(estimateTimeToNextLevelText());
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
            <div style={{
                visibility: daysLeft ? "visible" : "hidden",
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
