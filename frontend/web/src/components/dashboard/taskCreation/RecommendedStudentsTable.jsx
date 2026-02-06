import React, {useEffect, useMemo} from "react";
import AwesomeTable from "../AwesomeTable.jsx";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

function safeId(x) {
    return String(x ?? "").trim();
}

export default function RecommendedStudentsTable({ selectedStudentIds = [], isNarrow = false }) {
    const {
        students,
        recommendedPreview,
        activePreviewStudentId,
        setActivePreviewStudentId,
    } = useTeacherDashboard();

    const items = Array.isArray(recommendedPreview?.data?.items) ? recommendedPreview.data.items : [];

    const studentById = useMemo(() => {
        const map = new Map();
        for (const s of students || []) {
            const id = safeId(s?.student_account_id ?? s?.studentId ?? s?.id);
            if (id) map.set(id, s);
        }
        return map;
    }, [students]);

    const rows = useMemo(() => {
        return items.map((it, idx) => {
            const sid = safeId(it?.studentId) || `rec-${idx}`;
            const s = studentById.get(sid);

            const lastName = (s?.last_name || "").trim();
            const firstName = (s?.first_name || "").trim();

            return {
                id: sid,
                __studentId: sid,
                __lastName: lastName || "—",
                __firstName: firstName || "—",
            };
        });
    }, [items, studentById]);


    const columns = useMemo(
        () => [
            {
                key: "__lastName",
                title: "Прізвище",
                size: 2,
                sortType: "string",
                render: (r) => (
                    <div style={styles.boldEllipsis}>{r.__lastName}</div>
                ),
            },
            {
                key: "__firstName",
                title: "Імʼя",
                size: 2,
                sortType: "string",
                render: (r) => (
                    <div style={styles.boldEllipsis}>{r.__firstName}</div>
                ),
            }
        ],
        []
    );


    const emptyText =
        (selectedStudentIds?.length || 0) > 0
            ? (recommendedPreview?.loading ? "Готуємо рекомендації..." : "Немає рекомендацій")
            : "Спочатку вибери учнів";

    return (
        <div style={{ ...styles.left, ...(isNarrow ? styles.leftNarrow : null) }}>
            <div style={styles.panelHeader}>
                <div style={styles.panelTitle}>Учні</div>
                {recommendedPreview?.loading ? <div style={styles.badge}>Завантаження…</div> : null}
            </div>

            {recommendedPreview?.err ? <div style={styles.error}>{recommendedPreview.err}</div> : null}

            <div style={styles.tableWrap}>
                <AwesomeTable
                    columns={columns}
                    rows={rows}
                    emptyText={emptyText}
                    storageKey={null}
                    defaultSortKey="__lastName"
                    defaultSortDir="asc"
                    onRowClick={(r) => setActivePreviewStudentId(safeId(r?.__studentId))}
                    selectedRowId={activePreviewStudentId}
                />

            </div>
        </div>
    );
}

const styles = {
    left: {
        flex: "0 0 20%",
        minWidth: 260,
        maxWidth: 420,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        border: "2px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        background: "var(--card, #fffdf8)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.06)",
        overflow: "hidden",
    },
    leftNarrow: {
        width: "100%",
    },

    panelHeader: {
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "10px 12px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
    },
    panelTitle: {
        fontWeight: 1000,
        color: "var(--text, #3a2a1d)",
    },
    badge: {
        fontWeight: 900,
        fontSize: 12,
        padding: "4px 8px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.06)",
    },

    error: {
        padding: "8px 12px",
        color: "#8b1d1d",
        fontWeight: 800,
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        background: "rgba(255, 97, 56, 0.06)",
    },

    tableWrap: {
        flex: "1 1 auto",
        minHeight: 0,
        padding: 10,
    },

    boldEllipsis: {
        fontWeight: 900,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
};
