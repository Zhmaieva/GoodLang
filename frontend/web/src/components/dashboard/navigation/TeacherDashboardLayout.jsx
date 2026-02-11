// TeacherDashboardLayout.jsx — FULL DROP-IN (NO NAVBAR BACKGROUND + AUTONOMOUS BREADCRUMBS, THEME-DRIVEN)
import React, {useEffect, useMemo} from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";
import ItemsList from "../ItemsList.jsx";
import { theme } from "../../../App.jsx";

export default function TeacherDashboardLayout() {
    const { teacher } = useTeacherDashboard();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.body.style.overflow = "hidden";
    })

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

    const navItems = useMemo(
        () => [
            {
                id: "/school/create-assignment",
                title: "Quick assignment",
                subtitle: "Create less than in a minute",
                //imageUrl: "/hand3.PNG",
            },
            {
                id: "/school/assignments",
                title: "Assignments",
                subtitle: "Create & track assignments",
                //imageUrl: "/hand3.PNG",
            },
            {
                id: "/school/classes",
                title: "Classes",
                subtitle: "Students, groups progress",
                //imageUrl: "/hand2.PNG",
            },
            {
                id: "/school/profile",
                title: "My profile",
                subtitle: "Edit profile & preferences",
                //imageUrl: "/hand1.PNG",
            },
        ],
        []
    );

    const activeBaseRoute = useMemo(() => {
        const path = location.pathname;
        const match =
            navItems.find((x) => path === x.id) ||
            navItems.find((x) => path.startsWith(x.id + "/"));
        return match?.id || navItems[0]?.id || "/school/profile";
    }, [location.pathname, navItems]);

    const styles = useMemo(() => {
        const m = theme.layoutMetrics;

        return {
            page: {
                background: theme.bg,
                minHeight: "100vh",
                width: "100vw",
                fontFamily: theme.fontFamily,
            },

            sidebar: {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: m.sidebarWidth,
                zIndex: 50,

                background: theme.panel.none,
                boxShadow: "none",

                display: "flex",
                flexDirection: "column",
                gap: m.sidebarGap,
                padding: m.sidebarPad,
            },

            navWrap: {
                flex: 1,
                minHeight: 0,
            },

            bottom: {
                display: "flex",
                flexDirection: "column",
                gap: theme.spacing.gap,
            },

            teacherRow: {
                display: "flex",
                alignItems: theme.layout.rowAlign,
                gap: theme.spacing.gap,
            },

            initials: {
                width: theme.avatar.size,
                height: theme.avatar.size,
                borderRadius: theme.avatar.radius,
                border: theme.avatar.border,
                color: theme.surface,
                background: theme.avatar.bg,
                display: "flex",
                alignItems: theme.layout.rowAlign,
                justifyContent: "center",
                fontWeight: theme.weights.title,
                userSelect: "none",
                flexShrink: 0,
            },

            teacherMeta: {
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2, // if you want *zero numbers anywhere*, move this into theme too
            },

            teacherName: {
                fontWeight: theme.weights.title,
                fontSize: theme.smallType.name,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: theme.textDark,
            },

            teacherHint: {
                fontSize: theme.smallType.hint,
                color: theme.smallType.hintColor,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            },

            content: {
                marginLeft: theme.layoutMetrics.sidebarWidth,
                minHeight: "100vh",
                padding: theme.layoutMetrics.pagePad,
                display: "flex",
                flexDirection: "column",
                gap: theme.layoutMetrics.contentGap,
                overflow: "hidden",
            },

            breadcrumbRow: {
                minHeight: m.breadcrumbRowMinH,
                display: "flex",
                alignItems: theme.layout.rowAlign,
            },

            outletWrap: {
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },

        };
    }, []);

    return (
        <div style={styles.page}>
            <aside style={styles.sidebar}>
                <div style={styles.navWrap}>
                    <ItemsList
                        items={navItems}
                        defaultSelectedId={activeBaseRoute}
                        selectedShift={true}
                        onSelect={(item) => item?.id && navigate(item.id)}
                        style={{ height: "100%", padding: 0 }}
                    />
                </div>

                <div style={styles.bottom}>
                    <div style={styles.teacherRow}>
                        <div style={styles.initials}>{initials}</div>
                        <div style={styles.teacherMeta}>
                            <div style={styles.teacherName}>{teacherName}</div>
                            <div style={styles.teacherHint}>English Teacher</div>
                        </div>
                    </div>
                </div>
            </aside>

            <main style={styles.content}>
                {/*<div style={styles.breadcrumbRow}>*/}
                {/*    <Breadcrumbs basePrefix={activeBaseRoute} />*/}
                {/*</div>*/}

                <div style={styles.outletWrap}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
