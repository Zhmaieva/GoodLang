import React from "react";
import TermsOfUseModal from "./subscription/TermsOfUseModal.jsx";

export default function FooterBar({ theme }) {
    const [touOpen, setTouOpen] = React.useState(false);

    return (
        <>
            <footer>
                <style>{`
                    .footer-link,
                    .footer-link:visited,
                    .footer-link:hover,
                    .footer-link:active {
                        color: ${theme.accent};
                        text-decoration: none;
                    }
                `}</style>

                <div
                    style={{
                        width: "100%",
                        height: "2px",
                        backgroundColor: theme.accent,
                        marginBottom: "20px",
                        marginTop: "20px",
                    }}
                />

                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            fontWeight: 500,
                            fontSize: "1rem",
                            alignSelf: "center",
                            textAlign: "center",
                            color: "#33302E",
                        }}
                    >
                        © 2026 GoodLang •{" "}
                        <a
                            style={{
                                color: theme.accent,
                                textDecoration: "none",
                                fontWeight: 800,
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
                            color: "#33302E",
                            textDecoration: "underline",
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
