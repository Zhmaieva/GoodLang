import React from "react";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function DailyTasksNeedMorePracticeModal({
                                                            open,
                                                            onClose,
                                                            theme,
                                                        }) {
    const contentBoxStyle = {
        marginBottom: 12,
        textAlign: "left",
        color: theme.text,
        fontWeight: 400,
        lineHeight: 1.35,
        fontSize: 14.5,
    };

    return (
        <ModalShell
            open={open}
            id="marathon-daily-more-modal"
            theme={theme}
            title="Завдання зроблено"
            subtitle="Але є ще дещо"
            onClose={onClose}
            maxWidth={500}
        >
            <div style={contentBoxStyle}>
                Всі завдання виконано на сьогодні, але деякі правила ще потребують
                додаткової практики, щоб пройти марафон.
            </div>

            <div style={{ ...contentBoxStyle, marginBottom: 20 }}>
                <span style={{ opacity: 0.85 }}>
                    Дороби практику{" "}
                </span>
                <span style={{ color: "#000", opacity: 1 }}>
                    до дедлайну
                </span>
                <span style={{ opacity: 0.85 }}>
                    , щоб не вилетіти з марафону.
                </span>
            </div>

            <Button
                variant="offset"
                compact
                fullWidth
                shadowColor={theme.accent}
                shadowOffset={0}
                onClick={onClose}
                style={{
                    backgroundColor: theme.accent,
                    color: "#fff",
                    borderColor: "transparent",
                    boxShadow: "0 12px 28px rgba(116, 119, 184, 0.16)",
                }}
            >
                Добре
            </Button>
        </ModalShell>
    );
}
