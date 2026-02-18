import React, { useMemo, useState } from "react";
import Page from "../Page.jsx";
import Input from "../Input.jsx";
import { AssignmentList } from "./AssignmentList.jsx";
import { theme } from "../../../App.jsx";
import { Chip } from "../Chip.jsx";
import RectangleGroup from "../RectangleGroup.jsx";
import DynamicList from "../DynamicList.jsx";
import EmptyContent from "../EmptyContent.jsx";
import TabSwitcher from "../TabSwitcher.jsx";

// ids
const TYPE_ALL = "all";
const RECIPIENT_ALL = "all";
const SORT_NEWEST = "newest";
const SORT_OLDEST = "oldest";

function safePercent(x) {
    const n = Number(x);
    if (!Number.isFinite(n)) return null; // ✅ null means "no percent"
    return Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeStatus(s) {
    const x = String(s ?? "").trim();
    return x ? x : "";
}

function StudentRow({ name, percent, status }) {
    const p = safePercent(percent);
    const st = normalizeStatus(status);

    // ✅ if status provided OR percent is missing => show status
    const showStatus = !!st || p === null;

    const rightText = showStatus ? (st || "not done") : `${p}%`;
    const rightTitle = showStatus ? rightText : `${p}%`;

    return (
        <div
            style={{
                width: "100%",
                border: theme.borders.card,
                borderRadius: theme.radius.card,
                padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
                background: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: theme.spacing.gap,
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    fontFamily: theme.fontFamily,
                    fontSize: theme.type.title,
                    fontWeight: theme.weights.title,
                    color: theme.textDark,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
                title={name}
            >
                {name}
            </div>

            <div
                style={{
                    fontFamily: theme.fontFamily,
                    fontSize: theme.type.title,
                    fontWeight: theme.weights.title,
                    color: theme.textDark,
                    whiteSpace: "nowrap",
                    textTransform: showStatus ? "lowercase" : "none",
                }}
                title={rightTitle}
            >
                {rightText}
            </div>
        </div>
    );
}

function PreviewTaskCard({ idx, task }) {
    const title = String(task?.title ?? task?.ruleTitle ?? task?.rule ?? "").trim();
    const prompt = String(task?.prompt ?? task?.question ?? task?.text ?? "").trim();
    const options = Array.isArray(task?.options) ? task.options : (Array.isArray(task?.choices) ? task.choices : []);

    return (
        <div
            style={{
                width: "100%",
                border: theme.borders.card,
                borderRadius: theme.radius.card,
                padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
                background: "transparent",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                gap: Math.max(6, theme.spacing.rowGap),
            }}
        >
            <div
                style={{
                    fontFamily: theme.fontFamily,
                    fontSize: theme.type.subtitle,
                    fontWeight: theme.weights.title,
                    color: theme.textMutedDark,
                    opacity: 0.95,
                }}
            >
                {idx + 1}. {title || "Task"}
            </div>

            {!!prompt && (
                <div
                    style={{
                        fontFamily: theme.fontFamily,
                        fontSize: theme.type.title,
                        fontWeight: theme.weights.title,
                        color: theme.textDark,
                        lineHeight: theme.type.titleLineHeight,
                    }}
                >
                    {prompt}
                </div>
            )}

            {!!options.length && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.rowGap }}>
                    {options.map((o, i) => (
                        <div
                            key={`${idx}-${i}`}
                            style={{
                                border: theme.borders.card,
                                borderRadius: theme.radius.card,
                                padding: "6px 12px",
                                background: "transparent",
                                fontFamily: theme.fontFamily,
                                fontSize: theme.type.subtitle,
                                color: theme.textDark,
                                whiteSpace: "nowrap",
                            }}
                            title={String(o)}
                        >
                            {String(o)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function AssignmentsPage() {
    const [rightTab, setRightTab] = useState("results");
    const [assignments, setAssignments] = useState([
        {
            id: "1",
            title: "Choose an option: 1st conditional",
            type: "grammar",
            taskMode: "choose_option",
            tasksCount: 12,
            ruleIds: ["FIRST_CONDITIONAL"],
            createdAt: Date.now(),
            studentsCount: 18,
            submittedCount: 9,
            className: "Individual students",
            results: [
                { studentId: "s1", name: "Artem Ovechko", percent: 92 },
                { studentId: "s2", name: "Sofiia K.", percent: 78 },
                { studentId: "s3", name: "Dmytro L.", status: "not done" },
            ],
        },
        {
            id: "2",
            title: "First conditional (B1)",
            type: "grammar",
            taskMode: "choose_option",
            tasksCount: 8,
            ruleIds: ["FIRST_CONDITIONAL"],
            createdAt: Date.now(),
            studentsCount: 18,
            submittedCount: 9,
            className: "B1 Evening",
            results: [
                { studentId: "s1", name: "Artem Ovechko", percent: 55 },
                { studentId: "s4", name: "Olha S.", percent: 88 },
                { studentId: "s5", name: "Maksym P.", percent: 73 },
            ],
        },
    ]);

    const [selectedAssignmentId, setSelectedAssignmentId] = useState(""); // ✅
    const [q, setQ] = useState("");
    const [typeFilter, setTypeFilter] = useState(TYPE_ALL);
    const [recipientFilter, setRecipientFilter] = useState(RECIPIENT_ALL);
    const [sortKey, setSortKey] = useState(SORT_NEWEST);

    const typeOptions = useMemo(
        () => [
            { id: TYPE_ALL, title: "All types" },
            { id: "grammar", title: "Grammar" },
            { id: "vocabulary", title: "Vocabulary" },
            { id: "reading", title: "Reading" },
            { id: "listening", title: "Listening" },
            { id: "writing", title: "Writing" },
        ],
        []
    );

    const recipientOptions = useMemo(
        () => [
            { id: RECIPIENT_ALL, title: "All recipients" },
            { id: "individual", title: "Individual students" },
            { id: "class", title: "Classes" },
        ],
        []
    );

    const sortOptions = useMemo(
        () => [
            { id: SORT_NEWEST, title: "Newest first" },
            { id: SORT_OLDEST, title: "Oldest first" },
        ],
        []
    );

    const filteredSorted = useMemo(() => {
        const qq = String(q || "").trim().toLowerCase();
        let arr = [...(assignments || [])];

        if (qq) {
            arr = arr.filter((a) => {
                const title = String(a?.title ?? "").toLowerCase();
                const cls = String(a?.className ?? "").toLowerCase();
                const type = String(a?.type ?? "").toLowerCase();
                return title.includes(qq) || cls.includes(qq) || type.includes(qq);
            });
        }

        if (typeFilter !== TYPE_ALL) {
            arr = arr.filter((a) => String(a?.type ?? "") === String(typeFilter));
        }

        if (recipientFilter !== RECIPIENT_ALL) {
            arr = arr.filter((a) => {
                const cn = String(a?.className ?? "").toLowerCase();
                const isIndividual = cn.includes("individual");
                if (recipientFilter === "individual") return isIndividual;
                if (recipientFilter === "class") return !isIndividual && !!cn;
                return true;
            });
        }

        arr.sort((a, b) => {
            const da = Number(a?.createdAt ?? a?.created_at ?? 0) || 0;
            const db = Number(b?.createdAt ?? b?.created_at ?? 0) || 0;
            return sortKey === SORT_OLDEST ? da - db : db - da;
        });

        return arr;
    }, [assignments, q, typeFilter, recipientFilter, sortKey]);

    // ✅ keep selection valid when filters change
    const selectedAssignment = useMemo(() => {
        const id = String(selectedAssignmentId || "");
        const found =
            filteredSorted.find((a) => String(a?.id ?? a?._id ?? "") === id) ||
            assignments.find((a) => String(a?.id ?? a?._id ?? "") === id) ||
            null;
        return found;
    }, [selectedAssignmentId, filteredSorted, assignments]);

    const styles = useMemo(() => {
        const leftPad = (theme.layoutMetrics?.pagePad ?? 14) * 2;

        return {
            rightSub: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                fontWeight: theme.weights.normal,
                lineHeight: theme.type.subtitleLineHeight,
                color: theme.textMutedDark,
                marginBottom: theme.spacing.gap,
                marginTop: 20,
            },
            row: {
                display: "flex",
                gap: theme.spacing.gap,
                width: "100%",
                flex: "1 1 auto",
                minHeight: 0,
                overflow: "hidden",
                paddingBottom: theme.bottomDynamicList?.padBottom ?? 0,
            },

            left: {
                flex: "1 1 auto",
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

            // ✅ filters are natural height
            filtersWrap: {
                paddingLeft: leftPad,
                paddingRight: theme.layoutMetrics?.pagePad ?? 14,
                marginTop: theme.spacing.gap,
                width: "min(760px, 100%)",
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
                flex: "0 0 auto",
            },

            // ✅ list area takes remaining height
            listArea: {
                flex: "1 1 auto",
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

            right: {
                flex: "0 0 auto",
                width: "min(520px, 42%)",
                minWidth: 320,
                maxWidth: 560,
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

            rightBox: {
                flex: "1 1 auto",
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

            section: { display: "flex", flexDirection: "column", gap: theme.spacing.rowGap },

            label: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                fontWeight: theme.weights.title,
                lineHeight: theme.type.subtitleLineHeight,
                color: theme.textDark,
            },

            chipsRow: { display: "flex", flexWrap: "wrap", gap: theme.spacing.rowGap, alignItems: "center" },

            searchRow: {
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.gap,
                width: "100%",
            },

            searchLabel: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                fontWeight: theme.weights.title,
                color: theme.textDark,
                minWidth: 70,
            },
            rightHeader: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.h2 ?? theme.type.h1 ?? 34,   // підлаштуй якщо треба
                fontWeight: theme.weights.title,
                lineHeight: theme.type.titleLineHeight,
                color: theme.textDark,
                margin: 0,
                padding: 0,
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            },
            rightHeaderWrap: {
                width: "100%",
                paddingLeft: theme.spacing.cardPadX,
                paddingRight: theme.spacing.cardPadX,
                boxSizing: "border-box",
            },
        };
    }, []);

    return (
        <Page
            title={"Assignments"}
            subtitle={`Showing ${filteredSorted.length} assignment${filteredSorted.length === 1 ? "" : "s"}`}
        >
            <div style={styles.row}>
                {/* LEFT */}
                <div style={styles.left}>
                    <div style={styles.filtersWrap}>
                        <div style={styles.section}>
                            <div style={styles.searchRow}>
                                <Input
                                    placeholder="Search title, class, type..."
                                    mode="raw"
                                    value={q}
                                    onChange={setQ}
                                    charLimit={80}
                                    inputStyle={{
                                        border: "none",
                                        borderBottom: `1px solid ${theme.border}`,
                                        borderRadius: 0,
                                        background: "transparent",
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                    }}
                                    wrapperStyle={{
                                        flex: 1,
                                        background: "transparent",
                                        border: "none",
                                        padding: 0,
                                    }}
                                />
                            </div>
                        </div>

                        <div style={styles.section}>
                            <div style={styles.chipsRow}>
                                <div style={styles.label}>Type</div>
                                {typeOptions.map((o) => (
                                    <Chip
                                        key={o.id}
                                        active={String(typeFilter) === String(o.id)}
                                        onClick={() => setTypeFilter(String(o.id))}
                                    >
                                        {o.title}
                                    </Chip>
                                ))}
                            </div>
                        </div>

                        <div style={styles.section}>
                            <div style={styles.chipsRow}>
                                <div style={styles.label}>Recipient</div>
                                {recipientOptions.map((o) => (
                                    <Chip
                                        key={o.id}
                                        active={String(recipientFilter) === String(o.id)}
                                        onClick={() => setRecipientFilter(String(o.id))}
                                    >
                                        {o.title}
                                    </Chip>
                                ))}
                            </div>
                        </div>

                        <div style={styles.section}>
                            <div style={styles.chipsRow}>
                                <div style={styles.label}>Sort</div>
                                {sortOptions.map((o) => (
                                    <Chip
                                        key={o.id}
                                        active={String(sortKey) === String(o.id)}
                                        onClick={() => setSortKey(String(o.id))}
                                    >
                                        {o.title}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </div>

                    <AssignmentList
                        assignments={filteredSorted}
                        selectedId={selectedAssignmentId}
                        onSelect={(a) => setSelectedAssignmentId(String(a?.id ?? a?._id ?? ""))}
                        onDelete={(a) => {
                            const id = String(a?.id ?? "");
                            setAssignments((prev) => prev.filter((x) => String(x?.id ?? "") !== id));
                            setSelectedAssignmentId((prevSel) => (String(prevSel) === id ? "" : prevSel));
                        }}
                        onOpen={(a) => console.log("open", a)}
                        onEdit={(a) => console.log("edit", a)}
                    />
                </div>

                {/* RIGHT (Tabs: Students results / Preview) */}
                <div style={styles.right}>
                    <RectangleGroup
                        title={selectedAssignment ? selectedAssignment.title : ""}
                        style={styles.rightBox}
                        boxStyle={{ flexDirection: "column", flexWrap: "nowrap" }}
                    >
                        <TabSwitcher
                            value={rightTab}
                            onChange={setRightTab}
                            tabs={[
                                { key: "results", label: "Students results" },
                                { key: "preview", label: "Preview" },
                            ]}
                            renderContent={(key) => {
                                // якщо нічого не вибрано — показуємо той самий empty state в обох табах
                                if (!selectedAssignment) {
                                    return (
                                        <EmptyContent
                                            sourceText={"Select an assignment"}
                                            subtitle={"Click an assignment on the left to see details here."}
                                        />
                                    );
                                }

                                // header (назва assignment) — показуємо в обох табах однаково
                                const headerNode = (
                                    <div style={styles.rightHeaderWrap}>
                                        <h3
                                            style={{
                                                fontFamily: theme.fontFamily,
                                                fontSize: theme.type.h1 || theme.breadcrumbs?.fontSize || theme.type.title,
                                                fontWeight: theme.weights.title,
                                                color: theme.textDark,
                                                margin: 0,
                                                padding: 0,
                                                // ✅ прибрали зайвий правий відступ — просто не даємо йому “роздуватись”
                                                maxWidth: "100%",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                            title={selectedAssignment.title}
                                        >

                                        </h3>

                                        <div style={styles.rightSub}>
                                            {key === "preview"
                                                ? "Preview tasks inside this assignment"
                                                : "Student score for this assignment"}
                                        </div>
                                    </div>
                                );

                                if (key === "preview") {
                                    const previewTasks =
                                        selectedAssignment.previewTasks ||
                                        selectedAssignment.tasks ||
                                        selectedAssignment.preview?.tasks ||
                                        selectedAssignment.preview?.items ||
                                        [];

                                    return (
                                        <>
                                            {headerNode}

                                            <DynamicList contentStyle={{ paddingRight: 0 }}>
                                                {Array.isArray(previewTasks) && previewTasks.length ? (
                                                    previewTasks.map((t, idx) => <PreviewTaskCard key={String(t?.id ?? `${idx}`)} idx={idx} task={t} />)
                                                ) : (
                                                    <EmptyContent
                                                        sourceText={"No preview tasks"}
                                                        subtitle={"Attach tasks to the assignment to see preview here."}
                                                    />
                                                )}
                                            </DynamicList>
                                        </>
                                    );
                                }

                                // results tab
                                return (
                                    <>
                                        {headerNode}

                                        <DynamicList contentStyle={{ paddingRight: 0 }}>
                                            {(selectedAssignment.results || []).length ? (
                                                (selectedAssignment.results || []).map((r) => (
                                                    <StudentRow
                                                        key={String(r.studentId ?? r.id ?? r.name)}
                                                        name={String(r.name ?? "Student")}
                                                        percent={r.percent}
                                                        status={r.status}
                                                    />
                                                ))
                                            ) : (
                                                <EmptyContent
                                                    sourceText={"No results yet"}
                                                    subtitle={"When students complete this assignment, you’ll see their % here."}
                                                />
                                            )}
                                        </DynamicList>
                                    </>
                                );
                            }}
                        />
                    </RectangleGroup>
                </div>

            </div>
        </Page>
    );
}
