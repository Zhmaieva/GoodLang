import React, { useMemo, useState } from "react";
import Page from "../../Page.jsx";
import DynamicList from "../../DynamicList.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import ItemCard from "../../ItemCard.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import { useNavigate } from "react-router-dom";

import { LEVEL_RULES, RULE_LABELS } from "../../../../utils/rules.js";
import { RULE_DESCRIPTIONS } from "../../../../utils/ruleDescriptions.js";
import { theme } from "../../../../App.jsx";
import Input from "../../Input.jsx";
import NumberSlider from "../../NumberSlider.jsx";

export function CreateGrammarChooseOptionPage() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);
    const [filter, setFilter] = useState("");
    const [tasksSelected, setTasksSelected] = useState(5);

    const groups = useMemo(() => {
        const levelOrder = ["A1", "A2", "B1", "B2"];
        return levelOrder.map((level) => ({
            key: level,
            title: level,
            items: (LEVEL_RULES[level] || [])
                .map((ruleId) => ({
                id: ruleId,
                title: RULE_LABELS[ruleId] || ruleId,
                subtitle: RULE_DESCRIPTIONS[ruleId] ? `"${RULE_DESCRIPTIONS[ruleId]}"` : "",
            })),
        }));
    }, [filter]);

    const selectedItems = useMemo(() => {
        const map = new Map();
        for (const g of groups) for (const it of g.items) map.set(it.id, it);
        return selected.map((id) => map.get(id)).filter(Boolean);
    }, [groups, selected]);

    const toggle = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const t = theme.createGrammarChooseOption;

    const styles = useMemo(
        () => ({
            row: {
                display: "flex",
                gap: t.rowGap,
                width: t.full,
                height: t.full,
                minHeight: t.minH0,
                overflow: "hidden",
            },

            left: {
                width: t.leftWidth,
                minWidth: t.minH0,
                height: t.full,
                minHeight: t.minH0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

            right: {
                flex: "1 1 auto",
                minWidth: t.minH0,
                height: t.rightHeight,
                maxWidth: t.rightMaxWidth,
                minHeight: t.minH0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

            footer: {
                flex: "0 0 auto",
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: t.footerPadTop,
            },

            footerInner: {
                paddingBottom: t.footerPadBottom,
                paddingRight: t.footerPadRight,
            },

            chosenGroup: {
                height: t.chosenGroupHeight,
            },

            chosenList: t.chosenList,

            empty: {
                opacity: t.emptyOpacity,
            },
        }),
        [t]
    );

    return (
        <Page title={"Choose an option (grammar)"} subtitle={"Select grammar rules to use in the assignment"}>
            <div style={styles.row}>
                {/* LEFT: all rules */}
                <div style={styles.left}>
                    <div style={{
                        paddingLeft: theme.bottomDynamicList.padX * 2,
                        marginTop: theme.bottomDynamicList.padBottom,
                        paddingBottom: theme.bottomDynamicList.padTop,
                        width: '80%'
                    }}>
                        <Input
                            placeholder={`Search a grammar rule: i.e. "1st conditional"`}
                            mode="raw"
                            charLimit={120}
                            value={filter}
                            onChange={(value) => {
                                setFilter(value);
                            }}
                        />
                    </div>

                    <DynamicList style={{
                        paddingLeft: theme.spacing.cardPadX,
                    }}>
                        {groups.filter((g) => {
                            if (!filter)
                                return true;
                            g.items = g.items?.filter(id => {
                                const name = RULE_LABELS[id] || id;
                                return name?.title?.toLowerCase().includes(filter.toLowerCase());
                            }) || [];

                            return g.items?.length > 0;
                        }).map((g) => (
                            <RectangleGroup key={g.key} title={g.title}>
                                {g.items.map((it) => (
                                    <ItemCard
                                        accentHover
                                        key={it.id}
                                        title={it.title}
                                        subtitle={it.subtitle}
                                        imageUrl={undefined}
                                        selected={selected.includes(it.id)}
                                        selectedShift={false}
                                        onClick={() => toggle(it.id)}
                                    />
                                ))}
                            </RectangleGroup>
                        ))}
                    </DynamicList>
                </div>

                {/* RIGHT: selected rules + bottom button */}
                <div style={styles.right}>
                    <RectangleGroup style={styles.chosenGroup} title={`Chosen grammar`}>
                        <DynamicList contentStyle={styles.chosenList}>
                            {selectedItems.length ? (
                                selectedItems.map((it) => (
                                    <ItemCard
                                        variant={'minimal'}
                                        accentHover
                                        key={`chosen:${it.id}`}
                                        title={it.title}
                                        subtitle={it.subtitle}
                                        imageUrl={undefined}
                                        selected={true}
                                        selectedShift={false}
                                        onClick={() => toggle(it.id)}
                                    />
                                ))
                            ) : (
                                <div style={styles.empty}>
                                    Select rules on the left to include them here.
                                </div>
                            )}
                        </DynamicList>
                    </RectangleGroup>

                    <NumberSlider
                        value={tasksSelected}
                        onChange={(value) => {
                            setTasksSelected(value);
                        }}
                        min={1}
                        max={30}
                        step={1}
                        wordSingular="task"
                        wordPlural="tasks"
                        postText="in the assignment"
                        subtitle="Pick how many tasks students will receive."
                    />


                    <div style={{ ...styles.footer, ...styles.footerInner }}>
                        <AwesomeActionButton
                            size="regular"
                            variant={"ghost"}
                            title={!selected.length ? "Select at least one rule" : "Finish creation"}
                            onClick={() => {
                                navigate("/create-assignment/finish", { state: { selectedRules: selected } });
                            }}
                        >
                            Save and share with students
                        </AwesomeActionButton>
                    </div>
                </div>
            </div>
        </Page>
    );
}
