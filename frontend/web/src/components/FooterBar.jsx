import React from "react";
import TermsOfUseModal from "./subscription/TermsOfUseModal.jsx";

export default function FooterBar({theme}) {
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
              `}
                </style>
                <div style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                }}>
                    <div style={{
                        fontWeight: 900,
                        fontSize: "1rem",
                        alignSelf: "center",
                        textAlign: "center"
                    }}>© 2025-2026 GoodLang • <a style={{
                        color: "#ff6138",
                        textDecoration: "none",
                    }} href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a>
                    </div>

                    <a onClick={() => {
                            setTouOpen(true);
                        }} style={{
                            fontWeight: 900,
                            fontSize: "1rem",
                            color: "#ff6138",
                            textDecoration: "none",
                        }} href="#">Умови використання і політика приватності</a>
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
)
}
