import React from "react";

export default function AwesomeGrid({ left, right, gridStyle, colStyle }) {
    return (
        <div style={{ ...styles.grid, ...gridStyle }}>
            <div style={{ ...styles.col, ...colStyle }}>{left}</div>
            <div style={{ ...styles.col, ...colStyle }}>{right}</div>
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
