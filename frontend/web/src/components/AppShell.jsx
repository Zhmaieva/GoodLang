import { APP_BACKGROUND_COLOR, APP_TEXT_COLOR } from "../theme.js";

export default function AppShell({ children, theme, noPadding = false }) {
    const styles = {
        app: {
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
            background: theme?.bg ?? APP_BACKGROUND_COLOR,
            color: theme?.text ?? APP_TEXT_COLOR,
            fontFamily: "var(--font-family-base)",
            overflowX: "hidden",
        },

        container: {
            width: "100%",
            maxWidth: "none",
            boxSizing: "border-box",
            padding: noPadding ? "0px" : "40px 24px 80px",
            margin: 0,
        },
    };

    return (
        <div id="app-shell" style={styles.app}>
            <style>{`
                html, body, #root {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    min-height: 100%;
                    overflow-x: hidden;
                    background: var(--bg);
                    color: var(--text);
                }

                body {
                    font-family: var(--font-family-base);
                }

                *, *::before, *::after {
                    box-sizing: border-box;
                }

                button,
                input,
                textarea,
                select {
                    font: inherit;
                }

                input,
                textarea,
                select {
                    color: var(--text);
                }

                input:focus,
                textarea:focus,
                select:focus {
                    outline: none;
                    box-shadow: none !important;
                }

                ::selection {
                    background: rgba(123, 97, 216, 0.18);
                }
            `}</style>

            <div style={styles.container}>
                {children}
            </div>
        </div>
    );
}
