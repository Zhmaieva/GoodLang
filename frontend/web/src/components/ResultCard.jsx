import Card from "./Card.jsx";

export default function ResultCard({ theme, hint, correctAnswer, loading }) {
    const styles = {
        card: {
            width: "100%",
            padding: "12px 20px",
            opacity: !loading ? 1 : .5,
            transition: "opacity 0.2s ease",
        },
        title: {
            userSelect: "none",
            margin: '0px 0px 10px 0px',
            padding: '0px',
            fontSize: 18, color: theme.primaryText,
            fontWeight: 700, letterSpacing: ".05em",
        },
        feedback: {
            background: correctAnswer ? theme.backgroundGlassError : theme.backgroundGlassHighlight,
            padding: "12px 14px",
            fontSize: '18px',
        },
        correctWrap: {
            marginTop: 8,
            padding: "10px 12px",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
        },
        correctTitle: {
            userSelect: "none",
            fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 6,
            textTransform: "uppercase", letterSpacing: ".04em",
        },
        correctText: {
            // fontFamily:
            //     'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace',
            fontSize: 16, background: theme.backgroundGlassHighlight,
            padding: "8px 10px", display: "inline-block",
        },
    };

    return (
        <Card theme={theme} style={styles.card}>
            <h2 style={styles.title}>Результат</h2>
            <Card theme={theme} style={styles.feedback}>{hint}</Card>
            {correctAnswer ? (
                <Card theme={theme} style={styles.correctWrap}>
                    <div style={styles.correctTitle}>Правильна відповідь</div>
                    <Card theme={theme} style={styles.correctText}>{correctAnswer}</Card>
                </Card>
            ) : null}
        </Card>
    );
}
