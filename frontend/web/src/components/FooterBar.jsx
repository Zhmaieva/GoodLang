import React from "react";
import TermsOfUseModal from "./subscription/TermsOfUseModal.jsx";
import FaqModal from "./subscription/FaqModal.jsx";
import { APP_BACKGROUND_COLOR } from "../theme.js";
import { callAccountVerifyApi } from "../services/api.js";
import { ACTION_TYPES } from "../utils/constants.js";

export default function FooterBar({ theme }) {
    const [touOpen, setTouOpen] = React.useState(false);
    const [faqOpen, setFaqOpen] = React.useState(false);
    const footerTextColor = APP_BACKGROUND_COLOR;

    const openFaq = async () => {
        setFaqOpen(true);
        try {
            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_FAQ);
        } catch (error) {
            console.error("Failed to track FAQ click", error);
        }
    };

    return (
        <>
            <footer
                style={{
                    width: "100%",
                    height: 100,
                    background: "#000",
                    color: footerTextColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 24px",
                    boxSizing: "border-box",
                    flexShrink: 0,
                }}
            >
                <style>{`
                    .footer-link,
                    .footer-link:visited,
                    .footer-link:hover,
                    .footer-link:active {
                        color: ${footerTextColor};
                        text-decoration: none;
                    }
                `}</style>

                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "nowrap",
                        gap: 16,
                        minWidth: 0,
                    }}
                >
                    <div
                        style={{
                            fontWeight: 500,
                            fontSize: "1rem",
                            alignSelf: "center",
                            textAlign: "center",
                            color: footerTextColor,
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        © 2026 GoodLang •{" "}
                        <a
                            style={{
                                color: footerTextColor,
                                textDecoration: "none",
                                fontWeight: 500,
                            }}
                            href="mailto:goodlang.app@gmail.com"
                        >
                            goodlang.app@gmail.com
                        </a>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            gap: 20,
                            flexShrink: 0,
                            whiteSpace: "nowrap",
                        }}
                    >
                        <button
                            type="button"
                            onClick={openFaq}
                            style={{
                                appearance: "none",
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                margin: 0,
                                color: footerTextColor,
                                font: "inherit",
                                fontWeight: 500,
                                fontSize: "1rem",
                                textDecoration: "underline",
                                cursor: "pointer",
                            }}
                        >
                            FAQ
                        </button>

                        <a
                            onClick={(event) => {
                                event.preventDefault();
                                setTouOpen(true);
                            }}
                            style={{
                                fontWeight: 500,
                                fontSize: "1rem",
                                color: footerTextColor,
                                textDecoration: "underline",
                                flexShrink: 0,
                                whiteSpace: "nowrap",
                            }}
                            href="#"
                        >
                            Terms of Use and Privacy Policy
                        </a>
                    </div>
                </div>
            </footer>

            {touOpen && (
                <TermsOfUseModal
                    readOnly
                    theme={theme}
                    onClose={() => setTouOpen(false)}
                />
            )}

            {faqOpen && (
                <FaqModal
                    theme={theme}
                    onClose={() => setFaqOpen(false)}
                />
            )}
        </>
    );
}
