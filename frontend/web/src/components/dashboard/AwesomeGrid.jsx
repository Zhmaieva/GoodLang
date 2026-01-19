import React from "react";

export default function AwesomeGrid({ left, right }) {
    return (
        <div style={styles.grid}>
            <div style={styles.col}>{left}</div>
            <div style={styles.col}>{right}</div>
        </div>
    );
}

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
        alignItems: "start",
    },
    col: {
        minWidth: 0,
    },
};
