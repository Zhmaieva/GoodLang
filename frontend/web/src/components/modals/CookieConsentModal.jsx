import React from "react";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function CookieConsentModal({
                                               theme,
                                               onAccept,
                                               onReject,
                                               onOpenPolicy,
                                               disableLinks = false,
                                           }) {
    const buttonStyle = {
        backgroundColor: theme.accent,
    };

    return (
        <ModalShell
            id="cookie-modal"
            theme={theme}
            title="Cookies"
            onClose={onReject}
            closeOnBackdrop={false}
            hideClose
            maxWidth={460}
        >
            <p
                style={{
                    marginTop: 0,
                    marginBottom: 16,
                    color: theme.text,
                    fontSize: "1rem",
                    lineHeight: 1.5,
                }}
            >
                We use <strong>strictly necessary cookies</strong> for secure authentication and payment processing. You can optionally accept <strong>analytics cookies</strong> to help us improve the service.
            </p>

            <p
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                    fontSize: "0.95rem",
                    color: theme.text,
                    opacity: 0.8,
                }}
            >
                Learn more in the{" "}
                {!disableLinks ? (
                    <a
                        href="#"
                        onClick={onOpenPolicy}
                        style={{
                            color: theme.accent,
                            fontWeight: 700,
                            textDecoration: "none",
                        }}
                    >
                        Privacy and Cookie Policy
                    </a>
                ) : (
                    "Privacy and Cookie Policy"
                )}
                .
            </p>

            <div style={{ display: "flex", gap: 12 }}>
                <Button
                    variant="offset"
                    compact
                    fullWidth
                    shadowColor={theme.accent}
                    shadowOffset={5}
                    onClick={onReject}
                    style={buttonStyle}
                >
                    Reject
                </Button>

                <Button
                    variant="offset"
                    compact
                    fullWidth
                    shadowColor={theme.accent}
                    shadowOffset={5}
                    onClick={onAccept}
                    style={buttonStyle}
                >
                    Accept
                </Button>
            </div>
        </ModalShell>
    );
}
