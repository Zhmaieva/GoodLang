import LevelSwitch from "./LevelSwitch";
import Card from "./Card.jsx";

export default function Header({ theme, level, loading, onLevelChange }) {
    const styles = {
        // one row: brand left, levels right; wraps nicely on narrow widths
        header: {
            display: "flex",
            alignItems: "flex-start",
            //justifyContent: "space-between",
            //flexWrap: "wrap",
            gap: 16,
            paddingBottom: 12,
            border: 'none',
            marginBottom: 25,
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
        },
        brand: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 240,
        },
        logo: {
            width: 64,
            height: 64,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 28,
        },
        titleWrap: { display: "grid", gap: 4 },
        h1: {
            margin: 0,
            fontWeight: 900,
            fontSize: 40,
            lineHeight: 1,
            letterSpacing: ".01em",
            color: theme.primaryText,
        },
        sub: {
            color: theme.primaryText,
            fontSize: 14,
            letterSpacing: ".02em",
        },

        right: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginLeft: "auto",
        },
    };

    return (
        <header style={styles.header}>
            <Card style={styles.brand} theme={theme}>
                <div style={styles.logo} aria-hidden="true">SL</div>
                <div style={styles.titleWrap}>
                    <h1 style={styles.h1}>StepLang</h1>
                    <div style={styles.sub}>Переклад → короткий фідбек → нове речення згідно твого рівня</div>
                </div>
            </Card>

            <div style={styles.right}>
                <LevelSwitch
                    level={level}
                    loading={loading}
                    onLevelChange={onLevelChange}
                    theme={theme}
                    compact
                />
            </div>
        </header>
    );
}
