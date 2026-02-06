import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import RecommendedStudentsTable from "../taskCreation/RecommendedStudentsTable.jsx";
import RecommendedToolbar from "../taskCreation/RecommendedToolbar.jsx";
import RulesRecommendationsSection from "./RulesRecommendationsSection.jsx";
import RecommendedPreviewTopToolbar from "../taskCreation/RecommendedPreviewTopToolbar.jsx";
import {useTeacherDashboard} from "../TeacherDashboardContext.jsx";
import ManualRulesTableSection from "./ManualRulesTableSection.jsx";

export default function RecommendedPreviewSection({
                                                      selectedStudentIds = [],
                                                      previewKey = "no-students",
                                                      onReady = () => {},
                                                      style,
                                                      className,
                                                      narrowBreakpoint = 980,
                                                  }) {
    const rootRef = useRef(null);
    const [isNarrow, setIsNarrow] = useState(false);
    const { useRecommendedRules } = useTeacherDashboard();

    useLayoutEffect(() => {
        if (!rootRef.current) return;
        const el = rootRef.current;

        const update = () => {
            const r = el.getBoundingClientRect();
            const w = Math.floor(r.width || 0);
            setIsNarrow(w > 0 && w < narrowBreakpoint);
        };

        update();
        const ro = new ResizeObserver(() => update());
        ro.observe(el);
        return () => ro.disconnect();
    }, [narrowBreakpoint]);

    return (
        <div
            ref={rootRef}
            className={className}
            style={{
                ...styles.root,
                ...(isNarrow ? styles.rootNarrow : null),
                ...style,
            }}
        >
            {/* TOP ROW (full width) */}
            <div style={styles.topRow}>
                <RecommendedPreviewTopToolbar />
            </div>

            {/* BOTTOM ROW */}
            <div style={{ ...styles.contentRow, ...(isNarrow ? styles.contentRowNarrow : null) }}>
                <RecommendedStudentsTable selectedStudentIds={selectedStudentIds} isNarrow={isNarrow} />

                <div style={styles.rightWrap}>
                    {useRecommendedRules ? (
                        <>
                            <RecommendedToolbar />
                            <RulesRecommendationsSection
                                selectedStudentIds={selectedStudentIds}
                                previewKey={previewKey}
                                onReady={onReady}
                                isNarrow={isNarrow}
                            />
                        </>
                    ) : (
                        <ManualRulesTableSection />
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    root: {
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column", // ✅ important: vertical layout
        gap: 12,
    },

    topRow: {
        flex: "0 0 auto",
        minWidth: 0,
    },

    contentRow: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        gap: 12,
    },

    contentRowNarrow: {
        flexDirection: "column",
    },

    rightWrap: {
        flex: "1 1 auto",
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
};

