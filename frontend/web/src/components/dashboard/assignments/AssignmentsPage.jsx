import React, { useMemo, useState } from "react";
import Page from "../Page.jsx";
import Input from "../Input.jsx";
import { AssignmentList } from "./AssignmentList.jsx";
import { theme } from "../../../App.jsx";
import {Chip} from "../Chip.jsx";

// ids
const TYPE_ALL = "all";
const RECIPIENT_ALL = "all";
const SORT_NEWEST = "newest";
const SORT_OLDEST = "oldest";

export function AssignmentsPage() {
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
        },
    ]);

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

        // search
        if (qq) {
            arr = arr.filter((a) => {
                const title = String(a?.title ?? "").toLowerCase();
                const cls = String(a?.className ?? "").toLowerCase();
                const type = String(a?.type ?? "").toLowerCase();
                return title.includes(qq) || cls.includes(qq) || type.includes(qq);
            });
        }

        // type
        if (typeFilter !== TYPE_ALL) {
            arr = arr.filter((a) => String(a?.type ?? "") === String(typeFilter));
        }

        // recipient (simple heuristic: className is a class vs individual)
        if (recipientFilter !== RECIPIENT_ALL) {
            arr = arr.filter((a) => {
                const cn = String(a?.className ?? "").toLowerCase();
                const isIndividual = cn.includes("individual");
                if (recipientFilter === "individual") return isIndividual;
                if (recipientFilter === "class") return !isIndividual && !!cn;
                return true;
            });
        }

        // sort
        arr.sort((a, b) => {
            const da = Number(a?.createdAt ?? a?.created_at ?? 0) || 0;
            const db = Number(b?.createdAt ?? b?.created_at ?? 0) || 0;
            return sortKey === SORT_OLDEST ? da - db : db - da;
        });

        return arr;
    }, [assignments, q, typeFilter, recipientFilter, sortKey]);

    // --- styles (theme-driven-ish, transparent, compact)
    const styles = useMemo(() => {
        const leftPad = (theme.layoutMetrics?.pagePad ?? 14) * 2;

        return {
            filtersWrap: {
                paddingLeft: leftPad,
                paddingRight: theme.layoutMetrics?.pagePad ?? 14,
                marginTop: theme.spacing.gap,
                width: "min(760px, 100%)",
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
            },

            section: {
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.rowGap,
            },

            label: {
                fontFamily: theme.fontFamily,
                fontSize: theme.type.subtitle,
                fontWeight: theme.weights.title,
                lineHeight: theme.type.subtitleLineHeight,
                color: theme.textDark,
            },

            chipsRow: {
                display: "flex",
                flexWrap: "wrap",
                gap: theme.spacing.rowGap,
                alignItems: "center",
            },

            searchBox: {
                border: theme.borders.card,
                borderRadius: theme.radius.card,
                padding: theme.spacing.listPad,
                background: "transparent",
            },
        };
    }, []);

    return (
        <Page
            title={"Assignments"}
            subtitle={`Showing ${filteredSorted.length} assignment${filteredSorted.length === 1 ? "" : "s"}`}
        >
            {/* ✅ Filters UNDER the header, left-aligned */}
            <div style={styles.filtersWrap}>
                <div style={styles.section}>
                    <div style={styles.label}>Search</div>
                    <div style={styles.searchBox}>
                        <Input
                            placeholder="Title, class, type..."
                            mode="raw"
                            value={q}
                            onChange={setQ}
                            charLimit={80}
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
                groupTitle={"test"}
                onDelete={(a) => {
                    const id = String(a?.id ?? "");
                    setAssignments((prev) => prev.filter((x) => String(x?.id ?? "") !== id));
                }}
                onOpen={(a) => console.log("open", a)}
                onEdit={(a) => console.log("edit", a)}
            />
        </Page>
    );
}
