// Breadcrumbs.jsx — FULL DROP-IN (autonomous, basePrefix only) — THEME-ONLY NUMBERS + HOVER/FOCUS A11Y
import React, { useMemo, useState, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { theme } from "../../../App.jsx";

function normalizePrefix(p) {
    const s = String(p || "").trim();
    if (!s) return "";
    const withSlash = s.startsWith("/") ? s : `/${s}`;
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

export default function Breadcrumbs({ basePrefix }) {
    const location = useLocation();
    const [hotKey, setHotKey] = useState(null); // hover or focus

    const crumbs = useMemo(() => {
        const base = normalizePrefix(basePrefix);
        const pathRaw = location?.pathname || "/";
        const path = pathRaw.startsWith("/") ? pathRaw : `/${pathRaw}`;

        if (!base) return [];
        if (!(path === base || path.startsWith(base + "/"))) return [];

        let tail = path.slice(base.length);
        if (!tail.startsWith("/")) tail = "/" + tail;
        const tailSegs = tail.split("/").filter(Boolean);

        const baseSegs = base.split("/").filter(Boolean);
        const baseLabelSeg = baseSegs[baseSegs.length - 1] || "";
        const baseLabel = titleFromSegment(baseLabelSeg);

        const out = [];
        out.push({ key: base, label: baseLabel, to: base });

        if (tailSegs.length) {
            let acc = base;
            for (const seg of tailSegs) {
                acc += "/" + seg;
                out.push({ key: acc, label: titleFromSegment(seg), to: acc });
            }
        }

        return out;
    }, [location?.pathname, basePrefix]);

    const model = useMemo(() => {
        if (!crumbs.length) return null;

        if (crumbs.length === theme.breadcrumbs.singleCrumbCount) {
            return { first: null, prev: null, current: crumbs[0], showEllipsis: false };
        }

        const first = crumbs[0];
        const current = crumbs[crumbs.length - 1];
        const prev = crumbs[crumbs.length - 2];

        const showEllipsis = crumbs.length > theme.breadcrumbs.collapseAfterCrumbs;
        return { first, prev, current, showEllipsis };
    }, [crumbs]);

    const styles = useMemo(() => {
        const reduceMotion = !!theme?.accessibility?.reduceMotion;
        return {
            wrap: {
                width: "100%",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "flex-start",
                gap: theme.breadcrumbs.gap,
                fontFamily: theme.fontFamily,
                color: theme.textDark,
                userSelect: "none",
            },

            linkBase: {
                fontSize: theme.breadcrumbs.fontSize,
                fontWeight: theme.weights.normal,
                color: theme.textDark,
                opacity: theme.breadcrumbs.linkOpacity,
                textDecoration: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "center",
                cursor: "pointer",

                transform: theme.breadcrumbs.idleScale,
                transformOrigin: "left center",
                transition: reduceMotion
                    ? "none"
                    : `transform ${theme.breadcrumbs.hoverTransition} ${theme.motion.ease}, opacity ${theme.breadcrumbs.hoverTransition} ${theme.motion.ease}`,
            },

            linkHot: {
                opacity: theme.breadcrumbs.linkHoverOpacity,
                textDecorationThickness: theme.breadcrumbs.underlineThickness,
                textUnderlineOffset: theme.breadcrumbs.underlineOffset,
                // transform: reduceMotion ? theme.breadcrumbs.idleScale : theme.breadcrumbs.hoverScale,
            },

            linkFocus: {
                borderRadius: theme.breadcrumbs.focusRadius,
                outline: "none",
            },

            sep: {
                fontSize: theme.breadcrumbs.fontSize,
                color: theme.textDark,
                opacity: theme.breadcrumbs.sepOpacity,
                lineHeight: "1",
            },

            dots: {
                fontSize: theme.breadcrumbs.fontSize,
                fontWeight: theme.weights.normal,
                color: theme.textDark,
                opacity: theme.breadcrumbs.dotsOpacity,
            },

            current: {
                fontSize: theme.breadcrumbs.fontSize,
                fontWeight: theme.weights.selectedBoost,
                color: theme.textDark,
                opacity: "1",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
            },
        };
    }, []);

    const setHot = useCallback((key) => setHotKey(key), []);
    const clearHot = useCallback((key) => {
        setHotKey((prev) => (prev === key ? null : prev));
    }, []);

    if (!model) return null;

    const LinkCrumb = ({ crumb }) => {
        const isHot = hotKey === crumb.key;

        return (
            <NavLink
                to={crumb.to}
                title={String(crumb.label)}
                style={{
                    ...styles.linkBase,
                    ...(isHot ? styles.linkHot : null),
                }}
                onMouseEnter={() => setHot(crumb.key)}
                onMouseLeave={() => clearHot(crumb.key)}
                onFocus={() => setHot(crumb.key)}
                onBlur={() => clearHot(crumb.key)}
            >
                {/* focus ring wrapper via inline boxShadow (a11y) */}
                <span style={isHot ? styles.linkFocus : null}>{crumb.label}</span>
            </NavLink>
        );
    };

    const showPrev =
        model.prev &&
        model.first &&
        model.prev.to !== model.first.to &&
        model.prev.label !== model.first.label;

    return (
        <nav style={styles.wrap} aria-label="Breadcrumb">
            {model.first ? (
                <>
                    <LinkCrumb crumb={model.first} />
                    <span style={styles.sep}>▶</span>
                </>
            ) : null}

            {model.showEllipsis && model.first ? (
                <>
                    <span style={styles.dots}>...</span>
                    <span style={styles.sep}>▶</span>
                </>
            ) : null}

            {showPrev ? (
                <>
                    <LinkCrumb crumb={model.prev} />
                    <span style={styles.sep}>▶</span>
                </>
            ) : null}

            <div style={styles.current} title={model.current.label} aria-current="page">
                {model.current.label}
            </div>
        </nav>
    );
}
