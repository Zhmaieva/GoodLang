import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import RecommendedStudentsTable from "./RecommendedStudentsTable.jsx";
import RecommendedToolbar from "./RecommendedToolbar.jsx";
import RulesRecommendationsSection from "./RulesRecommendationsSection.jsx";

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
            <RecommendedStudentsTable
                selectedStudentIds={selectedStudentIds}
                isNarrow={isNarrow}
            />

            <div style={styles.rightWrap}>
                <RecommendedToolbar />
                <RulesRecommendationsSection
                    selectedStudentIds={selectedStudentIds}
                    previewKey={previewKey}
                    onReady={onReady}
                    isNarrow={isNarrow}
                />
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
        gap: 12,
    },
    rootNarrow: {
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
