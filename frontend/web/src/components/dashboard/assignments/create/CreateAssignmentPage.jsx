import React, { useMemo, useState } from "react";
import { theme } from "../../../../App.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import DynamicList from "../../DynamicList.jsx";
import ItemCard from "../../ItemCard.jsx";
import {useNavigate} from "react-router-dom";
import Page from "../../Page.jsx";

function pickHandById(id) {
    const pool = theme.assignmentsCatalog.cardImagePool || [];
    const s = String(id || "");
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    const idx = pool.length ? h % pool.length : 0;
    return pool[idx] || pool[0];
}

function mkItem(groupKey, key, title, subtitle, url) {
    return {
        id: `${groupKey}:${key}`,
        groupKey,
        title,
        subtitle,
        url
    };
}

export const groups = (() => {
    return [
        {
            key: "vocabulary",
            title: "Vocabulary",
            items: [
                mkItem("vocabulary", "audio_gaps", "Audio fill in gaps", "Listen and complete missing words"),
                mkItem("vocabulary", "match_def", "Match definitions", "Match words to meanings"),
                mkItem("vocabulary", "vocabulary_choose_option", "Choose an option", "Pick the right word"),
                mkItem("vocabulary", "vocabulary_gaps", "Fill in gaps", "Vocabulary-focused fill in the blanks",
                    "vocabulary-gaps"),
            ],
        },
        {
            key: "grammar",
            title: "Grammar",
            items: [
                mkItem("grammar", "grammar_gaps", "Fill in gaps", "Grammar-focused fill in the blanks"),
                mkItem("grammar", "grammar_choose_option", "Choose an option", "Pick the correct grammar form",
                    `grammar-choose-option`),
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
});

export function CreateAssignmentsPage() {
    const navigate = useNavigate();

    theme.assignmentsCatalog = {
        groupsGap: theme.spacing.gap,
        cardImagePool: ["/hand1.PNG", "/hand2.PNG", "/hand3.PNG"],
    };

    const [selectedId, setSelectedId] = useState(null);

    return (
        <Page title={"Choose assignment type"}>
            <DynamicList>
                {groups().map((g) => (
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
                                    //setSelectedId(it.id);
                                    navigate(it.url)
                                }}
                            />
                        ))}
                    </RectangleGroup>
                ))}
            </DynamicList>
        </Page>
    );
}
