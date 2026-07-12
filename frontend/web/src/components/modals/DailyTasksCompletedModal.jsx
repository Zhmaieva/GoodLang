import React from "react";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function DailyTasksCompletedModal({
                                                     open,
                                                     onClose,
                                                     theme,
                                                 }) {
    const contentBoxStyle = {
        marginBottom: 20,
        textAlign: "left",
        color: theme.text,
        fontWeight: 700,
        lineHeight: 1.35,
        fontSize: 14.5,
    };

    return (
        <ModalShell
            open={open}
            id="marathon-daily-completed-modal"
            theme={theme}
            title="На сьогодні все 💪"
            subtitle="Денний блок марафону виконано"
            onClose={onClose}
            maxWidth={480}
        >
            <div style={contentBoxStyle}>
                Це все на сьогодні.<br />
                <span style={{ opacity: 0.8 }}>
                    Можеш ще потренуватися у вільній практиці або зачекати до старту
                    наступного дня марафону.
                </span>
            </div>

            <Button
                variant="offset"
                compact
                fullWidth
                shadowColor={theme.accent}
                shadowOffset={5}
                onClick={onClose}
                style={{ backgroundColor: theme.accent }}
            >
                Добре
            </Button>
        </ModalShell>
    );
}
