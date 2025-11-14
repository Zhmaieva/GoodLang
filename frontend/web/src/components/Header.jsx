import React, { useEffect, useState } from "react";
import LevelSwitch from "./LevelSwitch";
import { callAccountStatusApi } from "../services/api.js";
import LimitModal from "./subscription/LimitModal.jsx";
import AccountStatusButton from "./subscription/AccountStatusButton.jsx";

export default function Header({ theme, level, loading, onLevelChange }) {
    const styles = {
        // one row: brand left, levels right; wraps nicely on narrow widths
        header: {
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            paddingBottom: 12,
            borderBottom: `3px solid ${theme.accent}`,
            marginBottom: 25,
        },

        brand: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 240, // keeps logo+title stable
        },
        logo: {
            width: 64,
            height: 64,
            borderRadius: 12,
            background: theme.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 28,
            boxShadow: `0 2px 0 ${theme.accentDark}`,
        },
        titleWrap: { display: "grid", gap: 4 },
        h1: {
            margin: 0,
            fontWeight: 900,
            fontSize: 40,               // big like in the screenshot
            lineHeight: 1,
            letterSpacing: ".01em",
            color: theme.accentDark,
        },
        sub: {
            color: theme.muted,
            fontSize: 14,
            letterSpacing: ".02em",
        },

        // right area with pills; aligns to the bottom like in the pic
        right: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginLeft: "auto",
        },
    };

    return (
        <>
            <header style={styles.header}>
                <div style={styles.brand}>
                    <div style={styles.logo} aria-hidden="true">GL</div>
                    <div style={styles.titleWrap}>
                        <h1 style={styles.h1}>GoodLang</h1>
                        <div style={styles.sub}>Переклад → короткий фідбек → нове речення згідно твого рівня</div>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center"}}>
                    <div>
                        <AccountStatusButton theme={theme} />
                    </div>
                    <div style={styles.right}>
                        <LevelSwitch
                            level={level}
                            loading={loading}
                            onLevelChange={onLevelChange}
                            theme={theme}
                            compact
                        />
                    </div>
                </div>

            </header>
        </>
    );
}
