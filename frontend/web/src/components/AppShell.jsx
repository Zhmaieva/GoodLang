export default function AppShell({ children, theme, noPadding = false }) {
    const styles = {
        app: {
            minHeight: "100vh",
            width: "100vw",
            display: "flex",
            alignItems: "center",       // vertical center
            justifyContent: "center",   // horizontal center
            background: theme.bg,
            color: theme.text,
            fontFamily: "'Nunito', system-ui, sans-serif",
            overflowX: "hidden",
        },
        container: {
            width: "100%",
            maxWidth: 1060,
            boxSizing: "border-box",
            padding: noPadding ? "0px" : "40px 24px 80px",
            margin: "0 auto",
        },
    };

    return (
        <div id={"app-shell"} style={styles.app}>
            <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          background: ${theme.bg};
        }
        *, *::before, *::after { box-sizing: border-box; }
      `}</style>
            <div style={styles.container}>{children}</div>
        </div>
    );
}
