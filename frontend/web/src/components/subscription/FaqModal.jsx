import React, {use, useEffect} from "react";
import { logoStyle } from "./LimitModal.jsx";
import {clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll} from "body-scroll-lock";

export default function FaqModal({
                                     theme,
                                     onClose = () => {},
                                 }) {
    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        inset: 0,
        height: "100dvh",

        // ✅ blur-only overlay (no darkening)
        background: "rgba(255,255,255,0)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,

        // ✅ blur underlying page
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",

        // ✅ safe-area padding (consistent with other modals)
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingTop: "env(safe-area-inset-top)",
    };

    const cardStyle = {
        background: theme.bg,
        padding: "28px",
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "92%",
        maxWidth: 560,
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    };

    const contentStyle = {
        textAlign: "left",
        background: "#fffdf8",
        borderRadius: theme.radius,
        border: `3px solid ${theme.accent}`,
        padding: "14px 14px",
        maxHeight: 320,
        overflowY: "auto",
        lineHeight: 1.55,
        color: theme.text,
        fontSize: "1rem",
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
    };

    const closeBtn = {
        fontFamily: "Nunito, system-ui, sans-serif",
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",
        background: "#fffdf8",
        color: theme.text,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        width: "100%",
    };

    const lockScroll = () => {
        disableBodyScroll(document.querySelector('#faq-modal'));
    }

    const unlockScroll = () => {
        clearAllBodyScrollLocks();
        enableBodyScroll(document.querySelector('#faq-modal'));
    }

    useEffect(() => {
        lockScroll();
    })

    return (
        <div style={overlayStyle} onClick={() => {
            unlockScroll();
            onClose();
        }}>
            <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            color: theme.text,
                            fontSize: "1.5rem",
                            fontWeight: 800,
                            textAlign: "left"
                        }}>
                            Frequently Asked Questions
                        </h2>
                        <p style={{
                            marginTop: 8,
                            color: theme.text,
                            fontSize: "1rem",
                            fontWeight: 500,
                            textAlign: "left"
                        }}>
                            A quick overview of the GoodLang service
                        </p>
                    </div>

                    <div style={logoStyle(64)}>GL</div>
                </div>

                <div id={"faq-modal"} style={contentStyle}>
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
                    <button style={closeBtn} onClick={() => {
                        unlockScroll();
                        onClose();
                    }}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}