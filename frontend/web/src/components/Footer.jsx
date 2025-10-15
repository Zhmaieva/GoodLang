import React from "react";

export default function Footer({ theme, children }) {
    const style = { marginTop: 20, textAlign: "center", color: theme.muted, fontSize: 13 };
    return <footer style={style}>{children}</footer>;
}
