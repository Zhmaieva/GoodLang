// TeacherDashboardLayout.jsx
import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const LS_KEY = "teacher_nav_collapsed";

export default function TeacherDashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(LS_KEY);
            if (saved === "1") setCollapsed(true);
        } catch {}
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(LS_KEY, collapsed ? "1" : "0");
        } catch {}
    }, [collapsed]);

    const sideW = collapsed ? 72 : 260;

    return (
        <div style={styles.page}>
            {/* Fixed left drawer */}
            <aside style={{ ...styles.sidebar, width: sideW }}>
                <div style={styles.sideTop}>
                    <div style={styles.brandRow}>
                        <div style={styles.brandText}>
                            {collapsed ? "GL" : "GoodLang • Teacher"}
                        </div>

                        <button
                            type="button"
                            onClick={() => setCollapsed((v) => !v)}
                            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
                            title={collapsed ? "Expand" : "Collapse"}
                            style={styles.collapseBtn}
                        >
                            {collapsed ? "»" : "«"}
                        </button>
                    </div>
                </div>

                <nav style={styles.nav}>
                    <NavItem
                        to="/teacher/profile"
                        label="Мій профіль"
                        icon="👤"
                        collapsed={collapsed}
                    />
                    <NavItem
                        to="/teacher/students"
                        label="Мої учні"
                        icon="🧑‍🎓"
                        collapsed={collapsed}
                    />
                    <NavItem
                        to="/teacher/classes"
                        label="Мої класи"
                        icon="🏫"
                        collapsed={collapsed}
                    />
                </nav>

                {!collapsed ? (
                    <div style={styles.sideHint}>
                        Навігація зліва (fixed). Можна згорнути.
                    </div>
                ) : null}
            </aside>

            {/* Content: full width minus sidebar */}
            <main style={{ ...styles.content, marginLeft: sideW }}>
                <Outlet />
            </main>
        </div>
    );
}

function NavItem({ to, label, icon, collapsed }) {
    return (
        <NavLink
            to={to}
            style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : null),
                ...(collapsed ? styles.navItemCollapsed : null),
            })}
            title={collapsed ? label : undefined}
        >
            <span style={styles.icon}>{icon}</span>
            {!collapsed ? <span style={styles.label}>{label}</span> : null}
        </NavLink>
    );
}

const styles = {
    page: {
        background: "var(--bg, #fff3df)",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
    },

    sidebar: {
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        overflowY: "auto",
        borderRight: "3px solid var(--accent, #ff6138)",
        background: "var(--card, #fffdf8)",
        boxShadow: "4px 0 0 rgba(0,0,0,0.06)",
        padding: 12,
        transition: "width 180ms ease",
    },

    sideTop: {
        position: "sticky",
        top: 0,
        background: "var(--card, #fffdf8)",
        paddingBottom: 10,
        marginBottom: 10,
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        zIndex: 2,
    },

    brandRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
    },

    brandText: {
        fontWeight: 900,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    collapseBtn: {
        border: "2px solid rgba(0,0,0,0.2)",
        background: "rgba(255,255,255,0.7)",
        fontWeight: 900,
        cursor: "pointer",
        padding: "6px 10px",
        lineHeight: 1,
    },

    nav: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    navItem: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 10px",
        border: "2px solid rgba(0,0,0,0.12)",
        textDecoration: "none",
        color: "var(--text, #3a2a1d)",
        fontWeight: 900,
        background: "rgba(255,255,255,0.65)",
        userSelect: "none",
    },

    navItemActive: {
        background: "var(--accent, #ff6138)",
        color: "#fff",
        border: "2px solid #000",
    },

    navItemCollapsed: {
        justifyContent: "center",
        padding: "10px 6px",
    },

    icon: {
        width: 24,
        textAlign: "center",
        flex: "0 0 24px",
    },

    label: {
        minWidth: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    sideHint: {
        marginTop: 12,
        paddingTop: 10,
        borderTop: "1px solid rgba(0,0,0,0.08)",
        color: "var(--muted, #a47856)",
        fontWeight: 800,
        lineHeight: 1.35,
    },

    content: {
        minHeight: "100vh",
        width: "auto",
        padding: 14,
        transition: "margin-left 180ms ease",
    },
};
