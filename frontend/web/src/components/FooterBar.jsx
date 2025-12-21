import React from "react";

export default function FooterBar(theme) {
    return (
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
            }}>© 2025-2026 GoodLang • з питань підтримки та співпраці пишіть до <br/> <a style={{
                color: "#ff6138",
                textDecoration: "none",
            }} href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a></div>
        </footer>
    )
}
