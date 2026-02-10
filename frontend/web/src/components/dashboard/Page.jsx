import React, { useMemo } from "react";
import { theme } from "../../App.jsx";

export default function Page({ title, children }) {

    const styles = useMemo(() => {
        theme.createAssignments = {
            // page layout
            pageMinH: "100%",
            pageW: "100%",
            pageDisplay: "flex",
            pageDirection: "column",

            // content columns
            contentFlex: "1 1 auto",
            contentMinH: "0",
            contentW: "100%",
            contentDisplay: "flex",
            contentDirection: "column",

            // groups list scroll area
            groupsFlex: "1 1 auto",
            groupsMinH: "0",
        };

        return {
            page: {
                flex: "1 1 auto",
                minHeight: 0,
                overflowY: "auto",
                overflowX: "hidden",
                overscrollBehavior: "contain", // ✅ key
                WebkitOverflowScrolling: "touch",
                width: theme.createAssignments.pageW,
                display: theme.createAssignments.pageDisplay,
                flexDirection: theme.createAssignments.pageDirection,
            },
            content: {
                width: theme.createAssignments.contentW,
                display: theme.createAssignments.contentDisplay,
                flexDirection: theme.createAssignments.contentDirection,
                flex: theme.createAssignments.contentFlex,
                minHeight: theme.createAssignments.contentMinH,
                height: theme.pageSizeHeight,
                overflow: 'scroll',
            },
        };
    }, []);

    return (
        <div style={styles.page}>
            <div style={styles.content}>
                <div>
                    <h2 style={{
                        padding: theme.layoutMetrics.pagePad,
                        fontFamily: theme.fontFamily,
                        fontWeight: theme.weights.title,
                        color: theme.textDark,
                        fontSize: theme.breadcrumbs.fontSize
                    }}>{title}</h2>
                </div>
                {children}
            </div>
        </div>
    );
}
