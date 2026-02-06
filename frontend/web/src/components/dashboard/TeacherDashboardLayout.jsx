// TeacherDashboardLayout.jsx — FULL DROP-IN
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTeacherDashboard } from "./TeacherDashboardContext.jsx";
import AwesomeButton from "./AwesomeButton.jsx"; // ✅ adjust path if needed

const LS_KEY = "teacher_nav_collapsed";

export default function TeacherDashboardLayout() {
    const { teacher } = useTeacherDashboard();
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

    const teacherName =
        teacher?.displayName ||
        [teacher?.first_name, teacher?.last_name].filter(Boolean).join(" ").trim() ||
        "Teacher";

    const teacherEmail = teacher?.email || "";

    const initials = useMemo(() => {
        const parts = teacherName.split(" ").filter(Boolean);
        const a = parts[0]?.[0] || "T";
        const b = parts[1]?.[0] || "";
        return (a + b).toUpperCase();
    }, [teacherName]);

    return (
        <div style={styles.page}>
            {/* Fixed left drawer */}
            <aside style={{ ...styles.sidebar, width: sideW }}>
                <div style={styles.sideTop}>
                    <div style={{ ...styles.brandRow, justifyContent: collapsed ? "center" : "space-around" }}>
                        {!collapsed && <div style={styles.brandText}>{collapsed ? "" : "GoodLang • School"}</div>}

                        <AwesomeButton
                            variant="ghost"
                            onClick={() => setCollapsed((v) => !v)}
                            title={collapsed ? "Expand" : "Collapse"}
                            style={styles.collapseBtn}
                        >
                            {collapsed ? "»" : "«"}
                        </AwesomeButton>
                    </div>

                    {!collapsed ? (
                        <div style={styles.teacherBlock}>
                            <div style={styles.teacherName} title={teacherName}>
                                {teacherName}
                            </div>
                            <div style={styles.teacherEmail} title={teacherEmail}>
                                {teacherEmail}
                            </div>
                        </div>
                    ) : (
                        <div
                            style={styles.teacherMini}
                            title={`${teacherName}${teacherEmail ? ` • ${teacherEmail}` : ""}`}
                        >
                            {initials}
                        </div>
                    )}
                </div>

                <nav style={styles.nav}>
                    <NavItem to="/teacher/profile" label="Мій профіль" icon="👤" collapsed={collapsed} />
                    <NavItem to="/teacher/students" label="Мої учні" icon="🧑‍🎓" collapsed={collapsed} />
                    <NavItem to="/teacher/classes" label="Мої класи" icon="🏫" collapsed={collapsed} />

                    {/* ✅ NEW */}
                    <NavItem to="/teacher/homework" label="Домашня робота" icon="📝" collapsed={collapsed} />
                </nav>
            </aside>

            {/* Content */}
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
            title={collapsed ? label : undefined}
            style={() => ({
                textDecoration: "none",
                display: "block",
            })}
        >
            {({ isActive }) => (
                <AwesomeButton
                    title={collapsed ? label : undefined}
                    variant={isActive ? "accent" : "ghost"}
                    style={{ width: collapsed ? "auto" : "100%", textAlign: "left" }}
                >
                    {collapsed && <span style={styles.icon}>{icon}</span>}
                    {!collapsed ? <span style={styles.label}>{label}</span> : null}
                </AwesomeButton>
            )}
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

    brandRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
    brandText: { fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

    collapseBtn: { padding: "6px 10px", lineHeight: 1 },

    teacherBlock: {
        marginTop: 10,
        padding: "8px 8px",
        border: "2px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.55)",
    },
    teacherName: { fontWeight: 900, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    teacherEmail: {
        marginTop: 2,
        fontWeight: 800,
        fontSize: 12,
        color: "var(--muted, #a47856)",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
    teacherMini: {
        marginTop: 10,
        width: 42,
        height: 42,
        borderRadius: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        border: "2px solid rgba(0,0,0,0.15)",
        background: "rgba(255,255,255,0.7)",
        userSelect: "none",
    },

    nav: { display: "flex", flexDirection: "column", gap: 8 },

    icon: { width: 24, textAlign: "center", flex: "0 0 24px" },
    label: { minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },

    sideHint: {
        marginTop: 12,
        paddingTop: 10,
        borderTop: "1px solid rgba(0,0,0,0.08)",
        color: "var(--muted, #a47856)",
        fontWeight: 800,
        lineHeight: 1.35,
    },

    content: { minHeight: "100vh", width: "auto", padding: 14, transition: "margin-left 180ms ease" },
};
