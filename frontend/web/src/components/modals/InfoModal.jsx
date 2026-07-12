import React from "react";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function InfoModal({
                                      theme,
                                      title = "Інформація",
                                      message,
                                      buttonText = "OK",
                                      onClose,
                                  }) {
    const isString = typeof message === "string";

    return (
        <ModalShell
            id="info-modal"
            theme={theme}
            title={title}
            onClose={onClose}
            maxWidth={420}
        >
            <div
                style={{
                    marginBottom: 22,
                    color: theme.text,
                    fontSize: "1rem",
                    lineHeight: 1.5,
                    whiteSpace: isString ? "pre-wrap" : "normal",
                }}
            >
                {message}
            </div>

            <Button
                variant="offset"
                compact
                fullWidth
                shadowColor={theme.accent}
                shadowOffset={5}
                onClick={onClose}
                style={{
                    backgroundColor: theme.accent,
                }}
            >
                {buttonText}
            </Button>
        </ModalShell>
    );
}
