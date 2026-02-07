// TeacherDashboardLayout.jsx — FULL DROP-IN
import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTeacherDashboard } from "./TeacherDashboardContext.jsx";
import AwesomeButton from "./AwesomeButton.jsx";

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

    const initials = useMemo(() => {
        const parts = teacherName.split(" ").filter(Boolean);
        const a = parts[0]?.[0] || "T";
        const b = parts[1]?.[0] || "";
        return (a + b).toUpperCase();
    }, [teacherName]);

    return (
        <div style={styles.page}>
            {/* Sidebar */}
            <aside style={{ ...styles.sidebar, width: sideW }}>
                <nav style={styles.nav}>
                    <NavItem to="/teacher/profile" label="My profile" collapsed={collapsed} />
                    <NavItem to="/teacher/classes" label="Classes" collapsed={collapsed} />
                    <NavItem to="/teacher/assignments" label="Assignments" collapsed={collapsed} />
                </nav>
            </aside>

            {/* Content */}
            <main style={{ ...styles.content, marginLeft: sideW }}>
                <Outlet />
            </main>
        </div>
    );
}

function NavItem({ to, label, collapsed }) {
    return (
        <NavLink to={to} style={{ textDecoration: "none", display: "block" }}>
            {({ isActive }) => (
                <AwesomeButton
                    variant={isActive ? "accent" : "ghost"}
                    title={collapsed ? label : undefined}
                    style={{ width: "100%", textAlign: "left" }}
                >
                    {label}
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
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },

    top: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "stretch",
    },

    teacherName: {
        fontWeight: 900,
        fontSize: 14,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    initials: {
        width: 40,
        height: 40,
        border: "2px solid rgba(0,0,0,0.15)",
        background: "rgba(255,255,255,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        userSelect: "none",
    },

    nav: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },

    content: {
        minHeight: "100vh",
        padding: 14,
        transition: "margin-left 180ms ease",
    },
};
