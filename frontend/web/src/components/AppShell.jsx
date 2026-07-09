export default function AppShell({ children, theme, noPadding = false }) {
    const styles = {
        app: {
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
            background: "#fffbf0",
            color: theme.text,
            fontFamily: 'var(--font-family-base)',
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
                    background: "#fffbf0";
                }

                *, *::before, *::after {
                    box-sizing: border-box;
                }
            `}</style>

            <div style={styles.container}>
                {children}
            </div>
        </div>
    );
}