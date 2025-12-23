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
                    fontSize: "0.8rem",
                    alignSelf: "center",
                    width: "100%",
                    textAlign: "center"
                }}>© 2025-2026 GoodLang • з питань підтримки та співпраці пиши до <br/> <a style={{
                    color: "#ff6138",
                    textDecoration: "none",
                }} href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a> <br/> <a onClick={() => {
                    setTouOpen(true);
                }} style={{
                    color: "#ff6138",
                    textDecoration: "none",
                }} href="#">Умови використання і політика приватності</a></div>
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
