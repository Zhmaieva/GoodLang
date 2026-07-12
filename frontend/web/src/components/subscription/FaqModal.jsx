import React from "react";
import { Button } from "../Buttons.jsx";
import ModalShell from "../modals/ModalShell.jsx";

export default function FaqModal({
                                     theme,
                                     onClose = () => {},
                                 }) {
    const contentStyle = {
        textAlign: "left",
        borderRadius: 5,
        border: `2px solid ${theme.accent}`,
        padding: "14px 14px",
        maxHeight: 320,
        overflowY: "auto",
        lineHeight: 1.55,
        color: theme.text,
        fontSize: "1rem",
    };

    return (
        <ModalShell
            id="faq-modal"
            theme={theme}
            title="Frequently Asked Questions"
            subtitle="A quick overview of the GoodLang service"
            onClose={onClose}
            maxWidth={560}
            width="92%"
        >
            <div style={contentStyle}>
                <h3 style={{ marginTop: 0 }}>1. What is this?</h3>
                <p>
                    <strong>GoodLang</strong> is a personal English learning trainer that helps you
                    <strong> understand exactly the rules you are struggling with</strong>.
                    The service shows your progress, weak points, and useful analytics.
                    All grammar rules are collected in one place.
                    You can use it on your own or together with a teacher.
                </p>

                <h3>2. How much does it cost?</h3>
                <p>
                    <strong>GoodLang</strong> can be used <strong>for free</strong>.
                    Free access includes an English level assessment
                    and daily practice with enough sentences
                    to see real progress.
                </p>

                <h3>3. Do I need a subscription / marathon?</h3>
                <p>
                    A subscription and marathon remove the daily limit on translations
                    and give access to learning from an unlimited
                    number of devices. The marathon also motivates you to study the rules
                    so you do not lose access to the subscription.
                </p>

                <h3>4. Can I get a discount?</h3>
                <p>
                    Yes. Write to us at{" "}
                    <strong>
                        <a
                            style={{ color: theme.accent, textDecoration: "none" }}
                            href="mailto:goodlang.app@gmail.com"
                        >
                            goodlang.app@gmail.com
                        </a>
                    </strong>{" "}
                    and we will offer special terms for individual users as well as separate programs
                    for educational institutions, teachers, and study groups.
                </p>

                <h3>5. Who are we?</h3>
                <p>
                    Yulia and Artem are enthusiasts who are constantly improving the service.
                    We care deeply about feedback, and we have many cool features ahead.
                    Is something missing in <strong>GoodLang</strong>? Write to us at{" "}
                    <strong>
                        <a
                            style={{ color: theme.accent, textDecoration: "none" }}
                            href="mailto:goodlang.app@gmail.com"
                        >
                            goodlang.app@gmail.com
                        </a>
                    </strong>
                </p>
            </div>

            <div style={{ marginTop: 16 }}>
                <Button
                    variant="offset"
                    compact
                    fullWidth
                    shadowColor={theme.accent}
                    shadowOffset={5}
                    style={{ backgroundColor: theme.accent }}
                    onClick={onClose}
                >
                    OK
                </Button>
            </div>
        </ModalShell>
    );
}
