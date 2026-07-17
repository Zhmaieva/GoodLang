import React from "react";
import TermsOfUseModal from "./subscription/TermsOfUseModal.jsx";
import { APP_BACKGROUND_COLOR } from "../theme.js";

export default function FooterBar({ theme }) {
    const [touOpen, setTouOpen] = React.useState(false);
    const footerTextColor = APP_BACKGROUND_COLOR;

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

                    <a
                        onClick={() => {
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
            </footer>

            {touOpen && (
                <TermsOfUseModal
                    readOnly
                    theme={theme}
                    onClose={() => setTouOpen(false)}
                />
            )}
        </>
    );
}
