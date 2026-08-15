import React, { useEffect, useState } from "react";
import MarathonInfoModal from "./MarathonInfoModal.jsx";
import { disableMarathonFailedModal } from "../../services/marathonService.js";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function MarathonFailedModal({
                                                open,
                                                onClose,
                                                theme,
                                                account = null,
                                                ruleIds = [],
                                            }) {
    const [infoOpen, setInfoOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        setInfoOpen(false);
    }, [open]);

    if (!open) return null;

    const onCloseHandler = () => {
        onClose?.();
    };

    const handleStartNew = () => {
        disableMarathonFailedModal();
        setInfoOpen(true);
    };

    if (infoOpen) {
        return (
            <MarathonInfoModal
                open={true}
                onClose={() => {
                    setInfoOpen(false);
                    onCloseHandler();
                }}
                theme={theme}
                account={account}
                ruleIds={ruleIds}
            />
        );
    }

    return (
        <ModalShell
            open={open}
            id="marathon-failed-modal"
            theme={theme}
            title="Кінець марафону"
            subtitle="Але можна постаратися краще"
            onClose={onCloseHandler}
            maxWidth={480}
        >
            <div
                style={{
                    marginBottom: 20,
                    textAlign: "left",
                    color: theme.text,
                    fontWeight: 400,
                    lineHeight: 1.35,
                    fontSize: 14.5,
                }}
            >
                Завдання марафону не було зроблено вчасно, тому він був автоматично завершений.
                <br />
                <br />
                <span style={{ opacity: 0.8 }}>
                    Доступ до підписки було скасовано.
                </span>
                <br />
                <br />
                <span style={{ opacity: 0.8 }}>
                    Щоб тренуватися далі без обмежень — почни новий марафон.
                </span>
            </div>

            <Button
                variant="offset"
                compact
                fullWidth
                shadowColor={theme.accent}
                shadowOffset={0}
                onClick={handleStartNew}
                style={{
                    backgroundColor: theme.accent,
                    color: "#fff",
                    borderColor: "transparent",
                    boxShadow: "0 12px 28px rgba(116, 119, 184, 0.16)",
                }}
            >
                Почати новий марафон
            </Button>
        </ModalShell>
    );
}
