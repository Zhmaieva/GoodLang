// ✅ Changes:
// - Added email input + validation
// - CTA button now calls a stubbed async API (no mailto)
// - Shows loading + success/error message
// - Keeps everything inline const styles (no CSS)

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** ---------- Theme (GoodLang style) ---------- */
const THEME = {
    bg: "#fff3df",
    card: "rgba(255,255,255,0.70)",
    cardSolid: "#ffffff",
    accent: "#ff6138",
    accentDark: "#d74e2a",
    green: "#4ba36e",
    blue: "#3a6ea5",
    text: "#3a2a1d",
    muted: "#a47856",
    border: "rgba(58,42,29,0.18)",
    shadow: "0 14px 40px rgba(58,42,29,0.12)",
    radius: 20,
    mono:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    sans:
        'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
};

const S = {
    page: {
        minHeight: "100vh",
        background: THEME.bg,
        color: THEME.text,
        fontFamily: THEME.sans,
        overflowX: "hidden",
    },
    container: {
        width: "min(1120px, calc(100% - 40px))",
        margin: "0 auto",
    },
    topBar: {
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        background: "rgba(255,243,223,0.72)",
        borderBottom: `1px solid ${THEME.border}`,
    },
    nav: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 0",
        gap: 14,
    },
    brand: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        textDecoration: "none",
        color: THEME.text,
    },
    logo: {
        width: 36,
        height: 36,
        borderRadius: 12,
        border: `2px solid ${THEME.text}`,
        background: THEME.cardSolid,
        display: "grid",
        placeItems: "center",
        boxShadow: "0 8px 20px rgba(58,42,29,0.12)",
        fontFamily: THEME.mono,
        fontWeight: 900,
    },
    brandText: {
        display: "flex",
        flexDirection: "column",
        lineHeight: 1.1,
    },
    brandTitle: { fontWeight: 900, letterSpacing: -0.2 },
    brandSub: { fontSize: 12, color: THEME.muted, fontFamily: THEME.mono },
    navLinks: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
    pill: {
        borderRadius: 999,
        border: `1px solid ${THEME.border}`,
        background: "rgba(255,255,255,0.55)",
        padding: "10px 14px",
        fontFamily: THEME.mono,
        fontSize: 13,
        color: THEME.text,
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 10px 26px rgba(58,42,29,0.08)",
        userSelect: "none",
    },
    pillPrimary: {
        borderRadius: 999,
        border: `2px solid ${THEME.text}`,
        background: THEME.accent,
        padding: "10px 14px",
        fontFamily: THEME.mono,
        fontSize: 13,
        color: "#fff",
        cursor: "pointer",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        boxShadow: "0 16px 34px rgba(255,97,56,0.26)",
        userSelect: "none",
    },

    heroWrap: { position: "relative", padding: "64px 0 24px" },
    heroGrid: {
        display: "grid",
        gridTemplateColumns: "1.05fr 0.95fr",
        gap: 22,
        alignItems: "stretch",
    },
    heroCard: {
        position: "relative",
        borderRadius: THEME.radius,
        border: `1px solid ${THEME.border}`,
        background: "rgba(255,255,255,0.62)",
        boxShadow: THEME.shadow,
        overflow: "hidden",
    },
    heroLeft: { padding: 28 },
    badgeRow: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        border: `1px solid ${THEME.border}`,
        background: "rgba(255,255,255,0.68)",
        padding: "8px 12px",
        fontFamily: THEME.mono,
        fontSize: 12,
    },
    h1: {
        margin: 0,
        fontSize: "clamp(34px, 4.4vw, 56px)",
        letterSpacing: -1.2,
        lineHeight: 1.03,
        fontWeight: 950,
    },
    h1Accent: { display: "inline-block", position: "relative", color: THEME.accentDark },
    pLead: {
        marginTop: 14,
        marginBottom: 18,
        fontSize: 16,
        lineHeight: 1.6,
        color: "rgba(58,42,29,0.85)",
        maxWidth: 560,
    },
    heroCtas: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 },

    heroRight: { padding: 18 },
    bento: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    bentoCard: {
        borderRadius: 16,
        border: `1px solid ${THEME.border}`,
        background: "rgba(255,255,255,0.70)",
        padding: 14,
        minHeight: 118,
        boxShadow: "0 10px 28px rgba(58,42,29,0.08)",
        position: "relative",
        overflow: "hidden",
    },
    bentoTitle: { fontFamily: THEME.mono, fontWeight: 900, fontSize: 13, margin: 0 },
    bentoText: {
        margin: "8px 0 0",
        fontSize: 13,
        color: "rgba(58,42,29,0.82)",
        lineHeight: 1.5,
    },

    section: { padding: "44px 0" },
    sectionHeader: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 14,
    },
    h2: {
        margin: 0,
        fontSize: "clamp(22px, 2.4vw, 32px)",
        letterSpacing: -0.6,
        fontWeight: 950,
    },
    h2Sub: { marginTop: 10, color: THEME.muted, lineHeight: 1.6, maxWidth: 740 },

    grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 16 },
    card: {
        borderRadius: THEME.radius,
        border: `1px solid ${THEME.border}`,
        background: THEME.card,
        boxShadow: "0 12px 34px rgba(58,42,29,0.10)",
        padding: 18,
    },
    cardKicker: { fontFamily: THEME.mono, fontSize: 12, color: THEME.muted, margin: 0 },
    cardTitle: { margin: "8px 0 8px", fontSize: 16, fontWeight: 950, letterSpacing: -0.3 },
    cardBody: { margin: 0, color: "rgba(58,42,29,0.86)", lineHeight: 1.6 },

    steps: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 },
    stepCard: {
        borderRadius: THEME.radius,
        border: `1px solid ${THEME.border}`,
        background: "rgba(255,255,255,0.62)",
        padding: 18,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 12px 34px rgba(58,42,29,0.10)",
    },
    stepNum: {
        width: 34,
        height: 34,
        borderRadius: 12,
        border: `2px solid ${THEME.text}`,
        display: "grid",
        placeItems: "center",
        fontFamily: THEME.mono,
        fontWeight: 900,
        background: THEME.cardSolid,
    },
    stepTop: { display: "flex", gap: 12, alignItems: "center" },

    split: { display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 14, marginTop: 16 },
    statGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
    stat: {
        borderRadius: 16,
        border: `1px solid ${THEME.border}`,
        background: "rgba(255,255,255,0.70)",
        padding: 14,
        boxShadow: "0 10px 28px rgba(58,42,29,0.08)",
    },
    statVal: { fontFamily: THEME.mono, fontSize: 20, fontWeight: 950, margin: 0 },
    statLbl: { marginTop: 6, fontSize: 12, color: THEME.muted, lineHeight: 1.5 },

    cta: {
        borderRadius: THEME.radius,
        border: `2px solid ${THEME.text}`,
        background: THEME.accent,
        color: "#fff",
        padding: 22,
        boxShadow: "0 18px 44px rgba(255,97,56,0.28)",
        overflow: "hidden",
        position: "relative",
    },
    ctaRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
    },
    ctaTitle: { margin: 0, fontSize: 20, fontWeight: 950, letterSpacing: -0.3 },
    ctaText: { margin: "10px 0 0", opacity: 0.92, lineHeight: 1.6, maxWidth: 700 },

    // ✅ input styles
    input: {
        width: "min(340px, 100%)",
        borderRadius: 999,
        border: "2px solid rgba(255,255,255,0.55)",
        background: "rgba(0,0,0,0.10)",
        color: "#fff",
        padding: "10px 12px",
        fontFamily: THEME.mono,
        fontSize: 13,
        outline: "none",
    },
    inputRow: { display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" },
    help: { marginTop: 10, fontFamily: THEME.mono, fontSize: 12, opacity: 0.9 },
    helpOk: { color: "rgba(255,255,255,0.92)" },
    helpErr: { color: "rgba(0,0,0,0.80)", background: "rgba(255,255,255,0.78)", padding: "6px 10px", borderRadius: 12 },

    footer: {
        padding: "26px 0 44px",
        borderTop: `1px solid ${THEME.border}`,
        color: THEME.muted,
        fontFamily: THEME.mono,
        fontSize: 12,
    },
};

function useIsNarrow() {
    const [narrow, setNarrow] = useState(() => (typeof window !== "undefined" ? window.innerWidth < 940 : false));
    useEffect(() => {
        const onResize = () => setNarrow(window.innerWidth < 940);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return narrow;
}

/** ---------- background (canvas) ---------- */
function CustomBackground({ density = 70, tint = THEME.accent, style }) {
    const canvasRef = useRef(null);
    const reducedMotion = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let raf = 0;

        const state = {
            w: 1,
            h: 1,
            dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
            particles: [],
            t: 0,
        };

        const resize = () => {
            const parent = canvas.parentElement;
            const w = Math.max(1, parent?.clientWidth || 1);
            const h = Math.max(1, parent?.clientHeight || 1);
            state.w = w;
            state.h = h;
            canvas.width = Math.floor(w * state.dpr);
            canvas.height = Math.floor(h * state.dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

            const target = Math.floor((density * w * h) / (920 * 520));
            const next = [];
            for (let i = 0; i < target; i++) next.push(makeParticle(w, h));
            state.particles = next;
        };

        const makeParticle = (w, h) => {
            const base = Math.random();
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.06,
                vy: (Math.random() - 0.5) * 0.06,
                r: 0.8 + Math.random() * 1.8,
                a: 0.15 + Math.random() * 0.45,
                tw: 0.6 + Math.random() * 1.8,
                ph: Math.random() * Math.PI * 2,
                kind: base < 0.14 ? "plus" : "dot",
            };
        };

        const drawPlus = (x, y, s, alpha) => {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x - s, y);
            ctx.lineTo(x + s, y);
            ctx.moveTo(x, y - s);
            ctx.lineTo(x, y + s);
            ctx.stroke();
            ctx.restore();
        };

        const tick = () => {
            state.t += 0.016;
            ctx.clearRect(0, 0, state.w, state.h);

            // soft glow haze
            ctx.save();
            ctx.globalAlpha = 0.12;
            const g = ctx.createRadialGradient(
                state.w * 0.72,
                state.h * 0.35,
                0,
                state.w * 0.72,
                state.h * 0.35,
                Math.max(state.w, state.h)
            );
            g.addColorStop(0, "rgba(255,97,56,0.22)");
            g.addColorStop(1, "rgba(255,243,223,0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, state.w, state.h);
            ctx.restore();

            ctx.strokeStyle = tint;
            ctx.fillStyle = tint;

            for (const p of state.particles) {
                p.x += p.vx * (reducedMotion ? 0.35 : 1);
                p.y += p.vy * (reducedMotion ? 0.35 : 1);

                if (p.x < -10) p.x = state.w + 10;
                if (p.x > state.w + 10) p.x = -10;
                if (p.y < -10) p.y = state.h + 10;
                if (p.y > state.h + 10) p.y = -10;

                const tw = 0.55 + 0.45 * Math.sin(state.t * p.tw + p.ph);
                const alpha = p.a * tw;

                if (p.kind === "plus") drawPlus(p.x, p.y, p.r * 2.2, alpha);
                else {
                    ctx.save();
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
            }

            raf = requestAnimationFrame(tick);
        };

        resize();
        tick();

        const onResize = () => resize();
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, [density, tint, reducedMotion]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                ...style,
            }}
        />
    );
}

/** ---------- helpers ---------- */
function GlowCorner({ color = THEME.blue, opacity = 0.22 }) {
    return (
        <div
            style={{
                position: "absolute",
                width: 260,
                height: 260,
                right: -90,
                top: -90,
                background: `radial-gradient(circle, ${hexToRgba(color, opacity)} 0%, rgba(0,0,0,0) 70%)`,
                pointerEvents: "none",
            }}
        />
    );
}

function Icon({ kind }) {
    const base = { width: 18, height: 18, display: "inline-block" };
    const stroke = THEME.text;

    if (kind === "check") {
        return (
            <span style={base} aria-hidden>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
        );
    }
    if (kind === "spark") {
        return (
            <span style={base} aria-hidden>
        <svg viewBox="0 0 24 24" fill="none">
          <path
              d="M12 2l1.5 6.2L20 10l-6.5 1.8L12 18l-1.5-6.2L4 10l6.5-1.8L12 2z"
              stroke={stroke}
              strokeWidth="2"
              strokeLinejoin="round"
          />
        </svg>
      </span>
        );
    }
    if (kind === "bolt") {
        return (
            <span style={base} aria-hidden>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M13 2L3 14h7l-1 8 12-14h-7l-1-6z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      </span>
        );
    }
    return null;
}

function hexToRgba(hex, a) {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r},${g},${b},${a})`;
}

function MotionIn({ children, delay = 0 }) {
    const reducedMotion = useReducedMotion();
    return (
        <motion.div
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
            whileInView={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
        >
            {children}
        </motion.div>
    );
}

// ✅ stub: replace with your real API call
async function apiBookDemoLead({ email }) {
    // Example:
    // return fetch("/api/leads/book-demo", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email }),
    // }).then(async (r) => {
    //   if (!r.ok) throw new Error("Request failed");
    //   return r.json();
    // });

    await new Promise((r) => setTimeout(r, 650)); // simulate latency
    return { ok: true };
}

function isValidEmail(email) {
    // simple + safe
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email || "").trim());
}

/** ---------- Main Landing ---------- */
export default function GoodLangSchoolsLanding() {
    const narrow = useIsNarrow();

    // ✅ CTA form state
    const [email, setEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState(null); // null | {type:'ok'|'err', text:string}

    const heroGrid = useMemo(
        () => ({ ...S.heroGrid, gridTemplateColumns: narrow ? "1fr" : S.heroGrid.gridTemplateColumns }),
        [narrow]
    );
    const grid3 = useMemo(
        () => ({ ...S.grid3, gridTemplateColumns: narrow ? "1fr" : S.grid3.gridTemplateColumns }),
        [narrow]
    );
    const steps = useMemo(
        () => ({ ...S.steps, gridTemplateColumns: narrow ? "1fr" : S.steps.gridTemplateColumns }),
        [narrow]
    );
    const split = useMemo(
        () => ({ ...S.split, gridTemplateColumns: narrow ? "1fr" : S.split.gridTemplateColumns }),
        [narrow]
    );

    const canSubmit = isValidEmail(email) && !submitting;

    const onSubmit = async () => {
        const clean = String(email || "").trim();
        if (!isValidEmail(clean)) {
            setStatus({ type: "err", text: "Please enter a valid email." });
            return;
        }

        setSubmitting(true);
        setStatus(null);

        try {
            await apiBookDemoLead({ email: clean });
            setStatus({ type: "ok", text: "Thanks! We’ll reach out shortly to schedule a demo." });
            setEmail("");
        } catch (e) {
            setStatus({ type: "err", text: "Something went wrong. Please try again." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={S.page}>
            {/* Top bar */}
            <div style={S.topBar}>
                <div style={S.container}>
                    <div style={S.nav}>
                        <a href="/" style={S.brand}>
                            <div style={S.logo}>GL</div>
                            <div style={S.brandText}>
                                <div style={S.brandTitle}>GoodLang</div>
                                <div style={S.brandSub}>automated grading for schools</div>
                            </div>
                        </a>

                        <div style={S.navLinks}>
                            <a href="#how" style={S.pill}>
                                <Icon kind="spark" /> How it works
                            </a>
                            <a href="#what" style={S.pill}>
                                <Icon kind="bolt" /> What you get
                            </a>
                            <a href="#cta" style={S.pillPrimary}>
                                <Icon kind="check" /> Book a demo
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div style={S.heroWrap}>
                <div style={S.container}>
                    <div style={heroGrid}>
                        <motion.div
                            style={{ ...S.heroCard, ...S.heroLeft }}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <CustomBackground density={95} tint={THEME.accent} />
                            <GlowCorner color={THEME.blue} />

                            <div style={S.badgeRow}>
                <span style={S.badge}>
                  <Icon kind="spark" /> Replace manual checking
                </span>
                                <span style={S.badge}>
                  <Icon kind="bolt" /> Visibility per student
                </span>
                                <span style={S.badge}>
                  <Icon kind="check" /> Built for language schools
                </span>
                            </div>

                            <h1 style={S.h1}>
                                Automated grading{" "}
                                <span style={S.h1Accent}>
                  that scales
                  <span
                      style={{
                          position: "absolute",
                          left: -6,
                          right: -6,
                          bottom: 6,
                          height: 12,
                          borderRadius: 999,
                          background: hexToRgba(THEME.accent, 0.18),
                          zIndex: -1,
                      }}
                  />
                </span>{" "}
                                your school.
                            </h1>

                            <p style={S.pLead}>
                                GoodLang replaces manual homework checking and gives schools a transparent picture of each student’s progress —
                                without growing operational chaos as you add more learners.
                            </p>

                            <div style={S.heroCtas}>
                                <a href="#cta" style={S.pillPrimary}>
                                    <Icon kind="check" /> Book a demo
                                </a>
                                <a href="#how" style={S.pill}>
                                    <Icon kind="spark" /> See the flow
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ ...S.heroCard, ...S.heroRight }}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <CustomBackground density={70} tint={THEME.blue} style={{ opacity: 0.65 }} />
                            <div style={S.bento}>
                                <div style={{ ...S.bentoCard, gridColumn: "1 / span 2", minHeight: 136 }}>
                                    <GlowCorner color={THEME.accent} opacity={0.18} />
                                    <p style={S.bentoTitle}>The problem</p>
                                    <p style={S.bentoText}>
                                        Schools can’t scale easily because manual checking grows with every new student — higher costs, slower feedback, and
                                        a constant “catch-up” mode.
                                    </p>
                                </div>

                                <div style={S.bentoCard}>
                                    <p style={S.bentoTitle}>Automated grading</p>
                                    <p style={S.bentoText}>AI checks tasks consistently, detects weak areas, and produces actionable scores.</p>
                                </div>

                                <div style={S.bentoCard}>
                                    <p style={S.bentoTitle}>Full visibility</p>
                                    <p style={S.bentoText}>Dashboards show progress by student, group, teacher, rule, and time window.</p>
                                </div>

                                <div style={{ ...S.bentoCard, gridColumn: "1 / span 2" }}>
                                    <p style={S.bentoTitle}>Operational win</p>
                                    <p style={S.bentoText}>
                                        Teachers focus on teaching. Managers get a decision tool. The school grows without hiring more “checkers”.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* What you get */}
            <div id="what" style={S.section}>
                <div style={S.container}>
                    <MotionIn>
                        <div style={S.sectionHeader}>
                            <div>
                                <h2 style={S.h2}>What GoodLang gives your school</h2>
                                <div style={S.h2Sub}>
                                    Replace manual checking with software — and finally see what’s happening across all students, classes, and teachers.
                                </div>
                            </div>
                        </div>
                    </MotionIn>

                    <div style={grid3}>
                        <MotionIn delay={0.02}>
                            <div style={S.card}>
                                <p style={S.cardKicker}>01</p>
                                <div style={S.cardTitle}>Automated, consistent grading</div>
                                <p style={S.cardBody}>Same rubric every time. Fast feedback. No teacher-to-teacher variability that breaks trust in grades.</p>
                            </div>
                        </MotionIn>

                        <MotionIn delay={0.05}>
                            <div style={S.card}>
                                <p style={S.cardKicker}>02</p>
                                <div style={S.cardTitle}>Progress visibility that managers need</div>
                                <p style={S.cardBody}>
                                    Know who is improving, who is stuck, and which grammar rules are failing — without asking teachers for spreadsheets.
                                </p>
                            </div>
                        </MotionIn>

                        <MotionIn delay={0.08}>
                            <div style={S.card}>
                                <p style={S.cardKicker}>03</p>
                                <div style={S.cardTitle}>Scale without operational chaos</div>
                                <p style={S.cardBody}>When you add students, checking time doesn’t explode. Your margins and pace stay predictable.</p>
                            </div>
                        </MotionIn>
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div id="how" style={{ ...S.section, paddingTop: 18 }}>
                <div style={S.container}>
                    <MotionIn>
                        <div style={S.sectionHeader}>
                            <div>
                                <h2 style={S.h2}>How it works</h2>
                                <div style={S.h2Sub}>A simple flow: assign tasks → students submit → GoodLang grades → dashboards show what matters.</div>
                            </div>
                        </div>
                    </MotionIn>

                    <div style={steps}>
                        <MotionIn delay={0.02}>
                            <div style={S.stepCard}>
                                <GlowCorner color={THEME.accent} opacity={0.14} />
                                <div style={S.stepTop}>
                                    <div style={S.stepNum}>1</div>
                                    <div>
                                        <div style={{ ...S.cardTitle, margin: 0 }}>Assign</div>
                                        <div style={{ ...S.cardKicker, marginTop: 6 }}>Tasks aligned to level + focus rules</div>
                                    </div>
                                </div>
                                <p style={{ ...S.cardBody, marginTop: 12 }}>
                                    Teachers pick what students practice (translation, gap-fills, mixed sets). No complicated setup.
                                </p>
                            </div>
                        </MotionIn>

                        <MotionIn delay={0.05}>
                            <div style={S.stepCard}>
                                <GlowCorner color={THEME.blue} opacity={0.14} />
                                <div style={S.stepTop}>
                                    <div style={S.stepNum}>2</div>
                                    <div>
                                        <div style={{ ...S.cardTitle, margin: 0 }}>Submit</div>
                                        <div style={{ ...S.cardKicker, marginTop: 6 }}>Students do homework in minutes</div>
                                    </div>
                                </div>
                                <p style={{ ...S.cardBody, marginTop: 12 }}>
                                    Students complete tasks. GoodLang captures attempts, accuracy, weak rules, and learning dynamics.
                                </p>
                            </div>
                        </MotionIn>

                        <MotionIn delay={0.08}>
                            <div style={S.stepCard}>
                                <GlowCorner color={THEME.green} opacity={0.14} />
                                <div style={S.stepTop}>
                                    <div style={S.stepNum}>3</div>
                                    <div>
                                        <div style={{ ...S.cardTitle, margin: 0 }}>Grade</div>
                                        <div style={{ ...S.cardKicker, marginTop: 6 }}>Automatic scoring + feedback</div>
                                    </div>
                                </div>
                                <p style={{ ...S.cardBody, marginTop: 12 }}>
                                    Consistent grading and explanation. Teachers can focus on teaching — not repetitive checking.
                                </p>
                            </div>
                        </MotionIn>

                        <MotionIn delay={0.11}>
                            <div style={S.stepCard}>
                                <GlowCorner color={THEME.accent} opacity={0.14} />
                                <div style={S.stepTop}>
                                    <div style={S.stepNum}>4</div>
                                    <div>
                                        <div style={{ ...S.cardTitle, margin: 0 }}>See</div>
                                        <div style={{ ...S.cardKicker, marginTop: 6 }}>Dashboards for teachers + managers</div>
                                    </div>
                                </div>
                                <p style={{ ...S.cardBody, marginTop: 12 }}>
                                    Track progress per student, class, teacher. Spot stagnation early. Improve outcomes systematically.
                                </p>
                            </div>
                        </MotionIn>
                    </div>

                    <div style={split}>
                        <MotionIn delay={0.03}>
                            <div style={{ ...S.card, position: "relative", overflow: "hidden" }}>
                                <CustomBackground density={55} tint={THEME.blue} style={{ opacity: 0.35 }} />
                                <div style={S.cardTitle}>Why schools adopt this</div>
                                <p style={S.cardBody}>Manual checking scales linearly with students. That means:</p>
                                <ul style={{ margin: "10px 0 0", paddingLeft: 18, lineHeight: 1.7, color: "rgba(58,42,29,0.86)" }}>
                                    <li>More students → more checking hours → higher costs.</li>
                                    <li>Checking backlog → slower feedback → worse learning outcomes.</li>
                                    <li>No unified data → managers can’t see what’s really happening.</li>
                                </ul>
                            </div>
                        </MotionIn>

                        <MotionIn delay={0.06}>
                            <div style={{ ...S.card, position: "relative", overflow: "hidden" }}>
                                <CustomBackground density={55} tint={THEME.accent} style={{ opacity: 0.35 }} />
                                <div style={S.cardTitle}>What changes with GoodLang</div>
                                <p style={S.cardBody}>Software absorbs the checking workload and turns it into measurable progress signals.</p>
                            </div>
                        </MotionIn>
                    </div>
                </div>
            </div>

            {/* ✅ CTA with email input */}
            <div id="cta" style={{ ...S.section, paddingBottom: 54 }}>
                <div style={S.container}>
                    <MotionIn>
                        <div style={S.cta}>
                            <CustomBackground density={85} tint={"#ffffff"} style={{ opacity: 0.22 }} />
                            <div style={S.ctaRow}>
                                <div>
                                    <div style={S.ctaTitle}>Want to remove manual checking from your school?</div>
                                    <div style={S.ctaText}>
                                        Leave your email — we’ll reach out to schedule a quick demo and map your workflow.
                                    </div>

                                    {status?.type === "ok" && <div style={{ ...S.help, ...S.helpOk }}>{status.text}</div>}
                                    {status?.type === "err" && <div style={{ ...S.help, ...S.helpErr }}>{status.text}</div>}
                                </div>

                                <div style={S.inputRow}>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@school.com"
                                        inputMode="email"
                                        autoComplete="email"
                                        style={{
                                            ...S.input,
                                            borderColor:
                                                status?.type === "err" ? "rgba(0,0,0,0.45)" : "2px solid rgba(255,255,255,0.55)",
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") onSubmit();
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={onSubmit}
                                        disabled={!canSubmit}
                                        style={{
                                            ...S.pillPrimary,
                                            background: "#fff",
                                            color: THEME.text,
                                            border: `2px solid ${THEME.text}`,
                                            opacity: canSubmit ? 1 : 0.65,
                                            cursor: canSubmit ? "pointer" : "not-allowed",
                                        }}
                                    >
                                        <Icon kind="check" /> {submitting ? "Sending..." : "Book a demo"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </MotionIn>
                </div>
            </div>

            {/* Footer */}
            <div style={S.footer}>
                <div style={S.container}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                        <div>© {new Date().getFullYear()} GoodLang</div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <a href="/privacy" style={{ color: THEME.muted, textDecoration: "none" }}>
                                Privacy
                            </a>
                            <a href="/terms" style={{ color: THEME.muted, textDecoration: "none" }}>
                                Terms
                            </a>
                            <a href="https://goodlang.app/marathon" style={{ color: THEME.muted, textDecoration: "none" }}>
                                GoodLang style ref
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
