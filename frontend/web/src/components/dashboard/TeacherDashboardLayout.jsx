// TeacherDashboardLayout.jsx — FULL DROP-IN (NO NAVBAR BACKGROUND)
import React, { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTeacherDashboard } from "./TeacherDashboardContext.jsx";
import ItemsList from "./ItemsList.jsx";

const SIDEBAR_WIDTH = 300;

export default function TeacherDashboardLayout() {
    const { teacher } = useTeacherDashboard();
    const navigate = useNavigate();
    const location = useLocation();

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

    const navItems = useMemo(() => [
        {
            id: "/teacher/profile",
            title: "My profile",
            subtitle: "Edit profile & preferences",
            imageUrl: "/hand1.PNG",
        },
        {
            id: "/teacher/classes",
            title: "Classes",
            subtitle: "Students, groups, progress",
            imageUrl: "/1list.PNG",
        },
        {
            id: "/teacher/assignments",
            title: "Assignments",
            subtitle: "Create & track assignments",
            imageUrl: "/1lamp.PNG",
        },
    ], []);

    const defaultSelectedId = useMemo(() => {
        const path = location.pathname;
        const match =
            navItems.find((x) => path === x.id) ||
            navItems.find((x) => path.startsWith(x.id + "/"));
        return match?.id || null;
    }, [location.pathname, navItems]);

    return (
        <div style={styles.page}>
            {/* Sidebar (transparent) */}
            <aside style={styles.sidebar}>
                <div style={styles.navWrap}>
                    <ItemsList
                        items={navItems}
                        defaultSelectedId={defaultSelectedId}
                        selectedShift={true}
                        onSelect={(item) => item?.id && navigate(item.id)}
                        style={{height: "100%", padding: 0}}
                    />
                </div>

                <div style={styles.bottom}>
                    <div style={styles.teacherRow}>
                        <div style={styles.initials}>{initials}</div>
                        <div style={styles.teacherMeta}>
                            <div style={styles.teacherName}>{teacherName}</div>
                            <div style={styles.teacherHint}>Teacher dashboard</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content */}
            <main style={styles.content}>
                <Outlet/>
            </main>
        </div>
    );
}

const styles = {
    page: {
        background: "var(--bg, #fff3df)",
        minHeight: "100vh",
        width: "100vw",
    },

    sidebar: {
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        zIndex: 50,

        // 👇 no background, no shadow
        background: "transparent",
        boxShadow: "none",

        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 16,
    },

    bottom: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },

    teacherRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    teacherMeta: {
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
    },

    teacherName: {
        fontWeight: 900,
        fontSize: 14,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    teacherHint: {
        fontSize: 12,
        opacity: 0.65,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    initials: {
        width: 42,
        height: 42,
        borderRadius: 14,
        border: "2px solid rgba(0,0,0,0.15)",
        background: "rgba(255,255,255,0.6)", // subtle, not a panel
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        userSelect: "none",
        flexShrink: 0,
    },

    navWrap: {
        flex: 1,
        minHeight: 0,
    },

    content: {
        marginLeft: SIDEBAR_WIDTH,
        minHeight: "100vh",
        padding: 16,
    },
};
