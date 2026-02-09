// Breadcrumbs.jsx — FULL DROP-IN (autonomous, basePrefix only)
import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { theme } from "../../../App.jsx";

function normalizePrefix(p) {
    const s = String(p || "").trim();
    if (!s) return "";
    // allow "teacher/assignments" or "/teacher/assignments"
    const withSlash = s.startsWith("/") ? s : `/${s}`;
    // remove trailing slashes
    return withSlash.replace(/\/+$/, "");
}

function titleFromSegment(seg) {
    if (!seg) return "";
    const s = decodeURIComponent(String(seg)).trim();
    if (!s) return "";
    const parts = s
        .split(/[-_]+/g)
        .filter(Boolean)
        .map((w) => w.toLowerCase());
    if (!parts.length) return s;
    return parts.map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w)).join(" ");
}

/**
 * Props:
 * - basePrefix: string, required, e.g. "teacher/assignments" or "/teacher/assignments"
 *
 * Behavior:
 * - If current route is exactly basePrefix -> shows: "Assignments" (big title only)
 * - If current route is basePrefix + "/my/path" -> shows: "Assignments > My > Path"
 * - Clickable: first + previous (if present). Current is NOT clickable. Middle collapsed -> "..."
 * - No transitions/animations (instant update on route changes)
 */
export default function Breadcrumbs({ basePrefix }) {
    const location = useLocation();

    const crumbs = useMemo(() => {
        const base = normalizePrefix(basePrefix);
        const pathRaw = location?.pathname || "/";
        const path = pathRaw.startsWith("/") ? pathRaw : `/${pathRaw}`;

        if (!base) return [];

        // Only render when inside the basePrefix scope
        if (!(path === base || path.startsWith(base + "/"))) return [];

        // tail after basePrefix
        let tail = path.slice(base.length);
        if (!tail.startsWith("/")) tail = "/" + tail;
        const tailSegs = tail.split("/").filter(Boolean);

        // Base segments define the first crumb label and href
        const baseSegs = base.split("/").filter(Boolean);
        const baseLabelSeg = baseSegs[baseSegs.length - 1] || "";
        const baseLabel = titleFromSegment(baseLabelSeg);

        const out = [];
        out.push({ label: baseLabel, to: base });

        if (tailSegs.length) {
            let acc = base;
            for (const seg of tailSegs) {
                acc += "/" + seg;
                out.push({ label: titleFromSegment(seg), to: acc });
            }
        }

        return out;
    }, [location?.pathname, basePrefix]);

    const model = useMemo(() => {
        if (!crumbs.length) return null;

        if (crumbs.length === 1) {
            // only base -> show only big title
            return { first: null, prev: null, current: crumbs[0], showEllipsis: false };
        }

        const first = crumbs[0];
        const current = crumbs[crumbs.length - 1];
        const prev = crumbs[crumbs.length - 2];

        // collapse middle if more than: first + prev + current
        const showEllipsis = crumbs.length > 3;

        return { first, prev, current, showEllipsis };
    }, [crumbs]);

    const styles = useMemo(() => {
        return {
            wrap: {
                width: "100%",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "flex-start",
                gap: "0.55rem",
                fontFamily: theme.fontFamily,
                color: theme.textDark,
                userSelect: "none",
            },
            smallLink: {
                fontSize: "clamp(0.82rem, 0.80rem + 0.25vw, 0.92rem)",
                fontWeight: theme.weights.normal,
                color: theme.textDark,
                textDecoration: "none",
                whiteSpace: "nowrap",
                maxWidth: "18rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                cursor: "pointer",
            },
            sep: {
                fontSize: "clamp(0.78rem, 0.76rem + 0.25vw, 0.90rem)",
                color: theme.textMutedDark,
                lineHeight: 1,
            },
            dots: {
                fontSize: "clamp(0.82rem, 0.80rem + 0.25vw, 0.92rem)",
                fontWeight: theme.weights.normal,
                color: theme.textMutedDark,
            },
            current: {
                marginLeft: "0.25rem",
                fontSize: "clamp(1.25rem, 1.10rem + 0.9vw, 1.70rem)",
                fontWeight: theme.weights.selectedBoost,
                color: theme.textDark,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            },
        };
    }, []);

    if (!model) return null;

    const LinkCrumb = ({ to, children }) => (
        <NavLink to={to} style={styles.smallLink} title={String(children)}>
            {children}
        </NavLink>
    );

    const showPrev =
        model.prev && model.first && model.prev.to !== model.first.to && model.prev.label !== model.first.label;

    return (
        <div style={styles.wrap}>
            {/* first + ... + prev + current (big) */}
            {model.first ? (
                <>
                    <LinkCrumb to={model.first.to}>{model.first.label}</LinkCrumb>
                    <span style={styles.sep}>&gt;</span>
                </>
            ) : null}

            {model.showEllipsis && model.first ? (
                <>
                    <span style={styles.dots}>...</span>
                    <span style={styles.sep}>&gt;</span>
                </>
            ) : null}

            {showPrev ? (
                <>
                    <LinkCrumb to={model.prev.to}>{model.prev.label}</LinkCrumb>
                    <span style={styles.sep}>&gt;</span>
                </>
            ) : null}

            <div style={styles.current} title={model.current.label}>
                {model.current.label}
            </div>
        </div>
    );
}
