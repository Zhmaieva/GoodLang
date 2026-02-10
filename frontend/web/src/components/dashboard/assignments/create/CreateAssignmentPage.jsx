import React, { useMemo, useState } from "react";
import { theme } from "../../../../App.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import DynamicList from "../../DynamicList.jsx";
import ItemCard from "../../ItemCard.jsx";

function pickHandById(id) {
    const pool = theme.assignmentsCatalog.cardImagePool || [];
    const s = String(id || "");
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const idx = pool.length ? h % pool.length : 0;
    return pool[idx] || pool[0];
}

function mkItem(groupKey, key, title, subtitle) {
    return {
        id: `${groupKey}:${key}`,
        groupKey,
        title,
        subtitle,
    };
}

export function CreateAssignmentsPage() {

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

    theme.assignmentsCatalog = {
        groupsGap: theme.spacing.gap,
        cardImagePool: ["/hand1.PNG", "/hand2.PNG", "/hand3.PNG"],
    };

    const groups = useMemo(() => {
        return [
            {
                key: "vocabulary",
                title: "Vocabulary",
                items: [
                    mkItem("vocabulary", "audio_gaps", "Audio fill in gaps", "Listen and complete missing words"),
                    mkItem("vocabulary", "match_def", "Match definitions", "Match words to meanings"),
                    mkItem("vocabulary", "vocabulary_choose_option", "Choose an option", "Pick the right word"),
                    mkItem("grammar", "grammar_gaps", "Fill in gaps", "Vocabulary-focused fill in the blanks"),
                ],
            },
            {
                key: "grammar",
                title: "Grammar",
                items: [
                    mkItem("grammar", "grammar_gaps", "Fill in gaps", "Grammar-focused fill in the blanks"),
                    mkItem("grammar", "grammar_choose_option", "Choose an option", "Pick the correct grammar form"),
                ],
            },
            {
                key: "listening",
                title: "Listening",
                items: [
                    mkItem("listening", "audio_gaps", "Audio fill in gaps", "Listen and fill the blanks"),
                    mkItem("listening", "order_paragraphs", "Order paragraphs", "Rebuild the story order by listening"),
                    mkItem("listening", "free_answer", "Audio + free answers", "Listen and answer in your own words"),
                ],
            },
            {
                key: "reading",
                title: "Reading",
                items: [
                    mkItem("reading", "abcd", "Text + A/B/C/D questions", "Read and choose answers"),
                    mkItem("reading", "order_paragraphs", "Name paragraphs", "Match titles with paragraphs"),
                    mkItem("reading", "free_answers", "Text + free answers", "Read and answer in your own words"),
                ],
            },
            {
                key: "writing",
                title: "Writing",
                items: [
                    mkItem("writing", "essay", "Essay", "Long-form writing task"),
                    mkItem("writing", "letter", "Letter", "Formal or informal letter"),
                ],
            },
        ];
    }, []);

    const [selectedId, setSelectedId] = useState(null);

    const styles = useMemo(() => {
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
                    }}>Choose assignment type</h2>
                </div>
                <DynamicList>
                    {groups.map((g) => (
                        <RectangleGroup key={g.key} title={g.title}>
                            {g.items.map((it) => (
                                <ItemCard
                                    key={it.id}
                                    title={it.title}
                                    subtitle={it.subtitle}
                                    imageUrl={pickHandById(it.id)}
                                    selected={selectedId === it.id}
                                    selectedShift={false} // keep non-shifting per your request
                                    onClick={() => {
                                        setSelectedId(it.id);
                                    }}
                                />
                            ))}
                        </RectangleGroup>
                    ))}
                </DynamicList>
            </div>
        </div>
    );
}
