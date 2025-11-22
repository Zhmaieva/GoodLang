import React from "react";
import LevelSwitch from "./LevelSwitch";
import AccountStatusButton from "./subscription/AccountStatusButton.jsx";
import AccountButton from "./subscription/AccountButton.jsx";
import {WeeklyProgress} from "./training/WeeklyProgress.jsx";

export default function Header({ theme, level, loading, onLevelChange }) {
    const styles = {
        header: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            paddingBottom: 12,
            borderBottom: `3px solid ${theme.accent}`,
            marginBottom: 25,
        },
        brand: {
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 240,
            width: '100%',
            height: "80px",
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
        titleWrap: {
            display: "flex",
            flexDirection: "column",
            gap: 4,
        },
        h1: {
            margin: 0,
            fontWeight: 900,
            fontSize: 40,
            lineHeight: 1,
            letterSpacing: ".01em",
            color: theme.accentDark,
        },
        sub: {
            color: theme.muted,
            fontSize: 14,
            letterSpacing: ".02em",
        },
        right: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginLeft: "auto",
        },
        accountButtonsWrapper: {
            display: "flex",
            alignItems: "center",
            gap: 8,
        },
    };

    return (
        <header style={styles.header}>
            <div style={styles.brand}>
                <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%"}}>
                    <div style={{display: "flex", alignItems: "center", gap: 12}}>
                        <div style={styles.logo} aria-hidden="true">GL</div>
                        <div style={styles.titleWrap}>
                            <h1 style={styles.h1}>GoodLang</h1>
                            <div style={styles.sub}>Переклад → короткий фідбек → нове речення згідно твого рівня</div>
                        </div>
                    </div>

                    <WeeklyProgress theme={theme}/>
                </div>
            </div>

            <div style={{display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center"}}>
                <div style={styles.accountButtonsWrapper}>
                    <AccountStatusButton theme={theme}/>
                    <AccountButton theme={theme}/>
                </div>
                <div style={styles.right}>
                    <LevelSwitch level={level} loading={loading} onLevelChange={onLevelChange} theme={theme} />
                </div>
            </div>
        </header>
    );
}
