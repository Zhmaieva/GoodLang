import React, { useMemo, useState } from "react";
import Page from "../../Page.jsx";
import DynamicList from "../../DynamicList.jsx";
import RectangleGroup from "../../RectangleGroup.jsx";
import ItemCard from "../../ItemCard.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";
import { useNavigate } from "react-router-dom";

import { LEVEL_RULES, RULE_LABELS } from "../../../../utils/rules.js";
import { RULE_DESCRIPTIONS } from "../../../../utils/ruleDescriptions.js";
import {theme} from "../../../../App.jsx";

export function CreateGrammarChooseOptionPage() {
    const navigate = useNavigate();
    const [selected, setSelected] = useState([]);

    const groups = useMemo(() => {
        const levelOrder = ["A1", "A2", "B1", "B2"];
        return levelOrder.map((level) => ({
            key: level,
            title: level,
            items: (LEVEL_RULES[level] || []).map((ruleId) => ({
                id: ruleId,
                title: RULE_LABELS[ruleId] || ruleId,
                subtitle: RULE_DESCRIPTIONS[ruleId] ? `"${RULE_DESCRIPTIONS[ruleId]}"` : "",
            })),
        }));
    }, []);

    const selectedItems = useMemo(() => {
        const map = new Map();
        for (const g of groups) for (const it of g.items) map.set(it.id, it);
        return selected.map((id) => map.get(id)).filter(Boolean);
    }, [groups, selected]);

    const toggle = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const styles = useMemo(
        () => ({
            row: {
                display: "flex",
                gap: theme.spacing?.gap ?? 14,
                width: "100%",
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
            },

            left: {
                width: "60%",
                minWidth: 0,
                height: "100%",
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

            right: {
                flex: "1 1 auto",
                minWidth: 0,
                height: "90%",
                maxWidth: "40%",
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

            footer: {
                flex: "0 0 auto",
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: 12,
            },
        }),
        []
    );

    return (
        <Page title={"Grammar: choose an option"}>
            <div style={styles.row}>
                {/* LEFT: all rules */}
                <div style={styles.left}>
                    <DynamicList>
                        {groups.map((g) => (
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
                    <RectangleGroup style={{
                        height: "100%",
                    }} title={`Chosen rules`}>
                        <DynamicList contentStyle={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "flex-start",
                            flexWrap: "wrap",
                        }}>
                            {selectedItems.length ? (
                                selectedItems.map((it) => (
                                    <ItemCard
                                        accentHover
                                        key={`chosen:${it.id}`}
                                        title={it.title}
                                        subtitle={it.subtitle}
                                        imageUrl={undefined}
                                        selected={true}
                                        selectedShift={false}
                                        onClick={() => toggle(it.id)} // ✅ click here unselects
                                    />
                                ))
                            ) : (
                                <div style={{opacity: 0.75, padding: 10}}>
                                    Select rules on the left to include them here.
                                </div>
                            )}
                        </DynamicList>
                    </RectangleGroup>

                    <div style={styles.footer}>
                        <AwesomeActionButton
                            variant="accent"
                            size="regular"
                            title={!selected.length ? "Select at least one rule" : "Finish creation"}
                            onClick={() => {
                                navigate("/create-assignment/finish", {state: {selectedRules: selected}});
                            }}
                        >
                            Finish
                        </AwesomeActionButton>
                    </div>

                </div>
            </div>
        </Page>
    );
}
