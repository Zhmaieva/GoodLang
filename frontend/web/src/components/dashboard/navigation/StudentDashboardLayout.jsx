import React, { useEffect, useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";
import ItemsList from "../ItemsList.jsx";
import SignInPage from "../authentication/SignInPage.jsx";
import { theme } from "../../../App.jsx";

export default function StudentDashboardLayout() {
    const { teacher, loading } = useTeacherDashboard(); // same context
    const navigate = useNavigate();
    const location = useLocation();

    const studentName =
        teacher?.displayName ||
        [teacher?.first_name, teacher?.last_name].filter(Boolean).join(" ").trim() ||
        "";

    const initials = useMemo(() => {
        const parts = String(studentName || "").split(" ").filter(Boolean);
        const a = parts[0]?.[0] || "S";
        const b = parts[1]?.[0] || "";
        return (a + b).toUpperCase();
    }, [studentName]);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    const nextPath = useMemo(() => {
        return (location?.pathname || "/") + (location?.search || "");
    }, [location?.pathname, location?.search]);

    const navItems = useMemo(
        () => [
            {
                id: "/student/assignments",
                title: "My assignments",
                subtitle: "Things to work on",
            },
            {
                id: "/student/submissions",
                title: "My submissions",
                subtitle: "History & results (stub)",
            },
            {
                id: "/student/profile",
                title: "My profile",
                subtitle: "Preferences (stub)",
            },
        ],
        []
    );

    const activeBaseRoute = useMemo(() => {
        const path = location.pathname;
        const match =
            navItems.find((x) => path === x.id) ||
            navItems.find((x) => path.startsWith(x.id + "/"));
        return match?.id || navItems[0]?.id || "/student/assignments";
    }, [location.pathname, navItems]);

    const styles = useMemo(() => {
        const m = theme.layoutMetrics;
        const contentFull = {
            minHeight: "100vh",
            padding: theme.layoutMetrics.pagePad,
            display: "flex",
            flexDirection: "column",
            gap: theme.layoutMetrics.contentGap,
            overflow: "hidden",
        };
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
                opacity: studentName ? 1 : 0,
                transition: "opacity 0.3s",
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
                gap: 2,
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

            contentFull,

            content: {
                marginLeft: theme.layoutMetrics.sidebarWidth,
                ...contentFull,
            },

            outletWrap: {
                flex: 1,
                minHeight: 0,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            },
        };
    }, [studentName]);

    // We want to let students access the page anonymously
    // if (!loading && !teacher?.first_name) {
    //     return (
    //         <div style={styles.page}>
    //             <main style={styles.contentFull}>
    //                 <SignInPage nextPath={nextPath} />
    //             </main>
    //         </div>
    //     );
    // }

    if (loading) {
        return <div style={styles.page}></div>;
    }

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
                            <div style={styles.teacherName}>{studentName}</div>
                            <div style={styles.teacherHint}>Student</div>
                        </div>
                    </div>
                </div>
            </aside>

            <main style={styles.content}>
                <div style={styles.outletWrap}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
