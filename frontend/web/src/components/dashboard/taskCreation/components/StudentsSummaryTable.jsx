// StudentsSummaryTable.jsx
import React, { useMemo, useState } from "react";

function safeId(x) {
    return String(x ?? "").trim();
}

function pickStudentName(s) {
    const first =
        s?.first_name ?? s?.firstName ?? s?.given_name ?? s?.givenName ?? "";
    const last =
        s?.last_name ?? s?.lastName ?? s?.family_name ?? s?.familyName ?? "";
    return { first: String(first || "").trim(), last: String(last || "").trim() };
}

function pickClassName(s) {
    return String(
        s?.class_name ??
        s?.className ??
        s?.group_name ??
        s?.groupName ??
        s?.classTitle ??
        s?.class_title ??
        ""
    ).trim();
}

export default function StudentsSummaryTable({
                                                 students = [],
                                                 selectedStudentIds = [],
                                                 height = "100%",
                                             }) {
    const TOKENS = {
        card: "rgba(255,255,255,0.1)",
        text: "#3a2a1d",
        muted: "#a47856",
        border: "rgba(58,42,29,0.18)",
        radius: 20,
    };

    const [q, setQ] = useState("");

    const selectedSet = useMemo(() => new Set((selectedStudentIds || []).map(safeId)), [selectedStudentIds]);

    const rows = useMemo(() => {
        const list = (students || [])
            .map((s) => {
                const id = safeId(s?.student_account_id ?? s?.studentId ?? s?.id);
                if (!id || !selectedSet.has(id)) return null;
                const { first, last } = pickStudentName(s);
                const className = pickClassName(s);
                return { id, first, last, className };
            })
            .filter(Boolean);

        list.sort((a, b) => {
            const al = (a.last || "").toLowerCase();
            const bl = (b.last || "").toLowerCase();
            if (al !== bl) return al.localeCompare(bl);
            return (a.first || "").toLowerCase().localeCompare((b.first || "").toLowerCase());
        });

        const query = String(q || "").trim().toLowerCase();
        if (!query) return list;

        return list.filter((x) => (`${x.first} ${x.last} ${x.className}`.toLowerCase()).includes(query));
    }, [students, selectedSet, q]);

    const TH = (txt, align) => (
        <div
            style={{
                padding: "10px 10px",
                fontSize: 12,
                fontWeight: 900,
                color: TOKENS.muted,
                textAlign: align || "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
            }}
        >
            {txt}
        </div>
    );

    const TD = (txt, align) => (
        <div
            style={{
                padding: "10px 10px",
                fontSize: 13,
                fontWeight: 900,
                color: TOKENS.text,
                textAlign: align || "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minWidth: 0,
            }}
            title={txt}
        >
            {txt || "—"}
        </div>
    );

    return (
        <div
            style={{
                height,
                overflow: "hidden",
                borderRadius: TOKENS.radius,
                border: `1px solid ${TOKENS.border}`,
                background: TOKENS.card,
                boxShadow: "none",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                fontFamily: "Nunito, ui-sans-serif, system-ui",
            }}
        >
            <div style={{ padding: 12, borderBottom: `1px solid ${TOKENS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontWeight: 1000, color: TOKENS.text }}>Students</div>
                <div style={{ marginLeft: "auto", fontSize: 12, fontWeight: 900, color: TOKENS.muted }}>
                    {rows.length}
                </div>
            </div>

            <div style={{ padding: 12, borderBottom: `1px solid ${TOKENS.border}` }}>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search students..."
                    style={{
                        width: "100%",
                        padding: "10px 10px",
                        borderRadius: 12,
                        border: `1px solid ${TOKENS.border}`,
                        background: "rgba(255,255,255,0.65)",
                        fontFamily: "Nunito, ui-sans-serif, system-ui",
                        fontWeight: 900,
                        color: TOKENS.text,
                        outline: "none",
                    }}
                />
            </div>

            <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 110px",
                        borderBottom: `1px solid ${TOKENS.border}`,
                        background: "rgba(255,255,255,1)",
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        minWidth: 0,
                    }}
                >
                    {TH("First name")}
                    {TH("Last name")}
                    {TH("Class", "right")}
                </div>

                {rows.map((r) => (
                    <div
                        key={r.id}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr) 110px",
                            borderBottom: `1px solid ${TOKENS.border}`,
                            alignItems: "center",
                            minWidth: 0,
                        }}
                    >
                        {TD(r.first)}
                        {TD(r.last)}
                        {TD(r.className, "right")}
                    </div>
                ))}

                {!rows.length ? (
                    <div style={{ padding: 12, color: TOKENS.muted, fontWeight: 900 }}>
                        No students found.
                    </div>
                ) : null}
            </div>
        </div>
    );
}
