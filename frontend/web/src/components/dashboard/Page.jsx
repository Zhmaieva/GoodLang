import React, { useMemo } from "react";
import { theme } from "../../App.jsx";

export default function Page({ title, subtitle, subSubtitleChild, headerRight, children, loading }) {
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
                overscrollBehavior: "contain",
                WebkitOverflowScrolling: "touch",
                width: theme.createAssignments.pageW,
                display: theme.createAssignments.pageDisplay,
                flexDirection: theme.createAssignments.pageDirection,
                transition: `opacity ${theme.motion.slow} ${theme.motion.ease}`,
                opacity: loading ? 0 : 1,
                paddingTop: "10px"
            },
            content: {
                width: theme.createAssignments.contentW,
                display: theme.createAssignments.contentDisplay,
                flexDirection: theme.createAssignments.contentDirection,
                flex: theme.createAssignments.contentFlex,
                minHeight: theme.createAssignments.contentMinH,
                height: theme.pageSizeHeight,
                overflow: "scroll",
            },

            // ✅ new header row (left title/subtitle + right custom content)
            headerRow: {
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: theme.layoutMetrics.pagePad * 2,
                padding: theme.layoutMetrics.pagePad,
                //paddingLeft: theme.layoutMetrics.pagePad * 2,
            },
            headerLeft: {
                minWidth: 0,
            },
            headerRight: {
                flex: "0 0 auto",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                minWidth: 0,
            },

            h2: {
                fontFamily: theme.fontFamily,
                fontWeight: theme.weights.title,
                color: theme.textDark,
                fontSize: theme.breadcrumbs.fontSize,
                margin: 0,
                padding: 0,
            },
            h3: {
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 6,
                fontFamily: theme.fontFamily,
                fontWeight: theme.weights.normal,
                opacity: 0.75,
                color: theme.textDark,
                fontSize: theme.type.title,
            },
        };
    }, [loading]);

    return (
        <div style={styles.page}>
            <div style={styles.content}>
                <div style={styles.headerRow}>
                    <div style={styles.headerLeft}>
                        <h2 style={styles.h2}>{title}</h2>
                        {subtitle ? <h3 style={styles.h3}>{subtitle}</h3> : null}
                        {subSubtitleChild}
                    </div>

                    {/* ✅ anything you pass here will sit to the right of title+subtitle */}
                    {headerRight ? <div style={styles.headerRight}>{headerRight}</div> : null}
                </div>

                {children}
            </div>
        </div>
    );
}
