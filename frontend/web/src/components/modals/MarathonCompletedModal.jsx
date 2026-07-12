import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function MarathonCompletedModal({
                                                   open,
                                                   onClose,
                                                   theme,
                                               }) {
    let navigate;
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        navigate = useNavigate();
    } catch {
        navigate = null;
    }

    const goToAnalytics = () => {
        onClose?.();
        if (navigate) navigate("/analytics");
        else window.location.href = "/analytics";
    };

    return (
        <ModalShell
            open={open}
            id="marathon-completed-modal"
            theme={theme}
            title="Марафон пройдено 🎉"
            subtitle="7 днів — 7 правил — завершено"
            onClose={onClose}
            maxWidth={480}
        >
            <div
                style={{
                    marginBottom: 20,
                    textAlign: "left",
                    color: theme.text,
                    fontWeight: 700,
                    lineHeight: 1.35,
                    fontSize: 14.5,
                }}
            >
                Вітаємо! Марафон успішно пройдено.<br />
                <span style={{ opacity: 0.8 }}>
                    Подивись, як виріс твій прогрес — у твоїй аналітиці.
                </span>
            </div>

            <Button
                variant="offset"
                compact
                fullWidth
                shadowColor={theme.accent}
                shadowOffset={5}
                onClick={goToAnalytics}
                style={{ backgroundColor: theme.accent }}
            >
                Мій прогрес
            </Button>
        </ModalShell>
    );
}
