import React, { useMemo, useState } from "react";
import AwesomeModal from "../AwesomeModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import StudentsSelectorSection from "../sections/StudentsSelectorSection.jsx";

function uniqStrings(arr) {
    const s = new Set((arr || []).map((x) => String(x)).filter(Boolean));
    return Array.from(s);
}

export default function CreateHomeworkModal({ open, onClose, onCreated }) {
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const selectedCount = useMemo(() => selectedStudentIds.length, [selectedStudentIds]);

    if (!open) return null;

    return (
        <AwesomeModal
            open={open}
            onClose={onClose}
            width="80%"
            height="80vh" // ✅ gives body a real height between header + footer
            title="Створити домашнє завдання"
            footer={
                <div style={styles.footer}>
                    <div style={styles.footerLeft}>
                        Обрано студентів: <b>{selectedCount}</b>
                    </div>

                    <div style={styles.footerRight}>
                        <AwesomeButton variant="ghost" onClick={onClose}>
                            Закрити
                        </AwesomeButton>
                    </div>
                </div>
            }
        >
            {/* This content goes into AwesomeModal's BODY (the area between header & footer) */}
            <div style={styles.body}>
                {/* upper half */}
                <div style={styles.topHalf}>
                    <StudentsSelectorSection
                        style={{ height: "100%" }}
                        initialSelectedStudentIds={selectedStudentIds}
                        onChangeSelectedStudentIds={(ids) => setSelectedStudentIds(uniqStrings(ids))}
                    />
                </div>

                {/* lower half (placeholder) */}
                <div style={styles.bottomHalf}>
                    {/* intentionally empty */}
                </div>
            </div>
        </AwesomeModal>
    );
}

const styles = {
    // ✅ This must fill the modal BODY area (which is already flex:1)
    body: {
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: 8, // inner spacing (so content doesn't touch modal edges)
        overflow: "hidden",
    },

    topHalf: {
        flex: "1 1 0",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
    },

    bottomHalf: {
        flex: "1 1 0",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        border: "2px dashed rgba(0,0,0,0.12)",
        background: "rgba(0,0,0,0.02)",
    },

    // footer is now rendered by AwesomeModal.footer (outside body, never clipped)
    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        width: "100%",
        flexWrap: "wrap",
    },

    footerLeft: {
        fontWeight: 900,
        color: "var(--muted, #a47856)",
        whiteSpace: "nowrap",
    },

    footerRight: {
        display: "flex",
        gap: 10,
        alignItems: "center",
    },
};
