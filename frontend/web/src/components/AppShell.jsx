export default function AppShell({ children, theme }) {
    const styles = {
        app: {
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",       // vertical center
            justifyContent: "center",   // horizontal center
            color: theme.text,
            fontFamily: "Poppins, system-ui, sans-serif",
            overflowX: "hidden",
            background: theme.bg,
            backgroundSize: "cover",
        },
        container: {
            width: "100%",
            height: "100%",
            maxWidth: 1160,
            boxSizing: "border-box",
            padding: "40px 24px 80px",
            margin: "0 auto",
        },
        background: {
            width: "100%",
            height: "100%",
            backdropFilter: "grayscale(.5)",
        },
    };

    return (
        <div style={styles.app}>
            <div style={styles.background}>
                <div style={styles.container}>{children}</div>
            </div>
        </div>
    );
}
