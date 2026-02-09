import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Loader (GoodLang)
 *
 * Fix: uses transform: scaleX() instead of width+transition,
 * so the bar moves smoothly and matches the percent without “jumping to 92%”.
 */
export default function Loader({
                                   load,
                                   estimateMs = 1400,
                                   minVisibleMs = 400,
                                   description = "Завантаження...",
                                   doneText = "Готово!",
                                   onDone,
                                   children,
                                   style,
                                   barHeight = 12,
                               }) {
    const [phase, setPhase] = useState("loading"); // loading | finishing | done
    const [progress, setProgress] = useState(0);
    const [isDoneText, setIsDoneText] = useState(false);

    const startRef = useRef(0);
    const rafRef = useRef(null);
    const settledRef = useRef(false);

    const est = useMemo(() => Math.max(300, Number(estimateMs) || 1400), [estimateMs]);
    const minVis = useMemo(() => Math.max(0, Number(minVisibleMs) || 400), [minVisibleMs]);

    const stopRaf = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    };

    const tick = () => {
        const now = performance.now();
        const elapsed = Math.max(0, now - startRef.current);

        // cap at 92% until load() settles (classic UX)
        const cap = settledRef.current ? 100 : 92;
        const target = Math.min(cap, (elapsed / est) * 100);

        // smooth approach (no backward movement)
        setProgress((p) => {
            const next = Math.max(p, target);
            const eased = p + (next - p) * 0.14 + 0.12;
            return Math.min(cap, Math.max(p, eased));
        });

        rafRef.current = requestAnimationFrame(tick);
    };

    useEffect(() => {
        let alive = true;

        if (typeof load !== "function") {
            setProgress(100);
            setIsDoneText(true);
            setPhase("done");
            onDone?.();
            return () => {};
        }

        startRef.current = performance.now();
        setPhase("loading");
        setProgress(0);
        setIsDoneText(false);
        settledRef.current = false;

        rafRef.current = requestAnimationFrame(tick);

        const run = async () => {
            const startedAt = performance.now();

            try {
                await load();
            } finally {
                // Ensure minimum visible time
                const elapsed = performance.now() - startedAt;
                const waitMore = Math.max(0, minVis - elapsed);
                if (waitMore) await new Promise((r) => setTimeout(r, waitMore));

                if (!alive) return;

                settledRef.current = true;
                stopRaf();

                // finishing: jump close to end, then to 100
                setPhase("finishing");
                setProgress((p) => Math.max(p, 96));

                setTimeout(() => {
                    if (!alive) return;
                    setProgress(100);
                    setIsDoneText(true);

                    // show content quickly after reaching 100
                    setTimeout(() => {
                        if (!alive) return;
                        setPhase("done");
                        onDone?.();
                    }, 800);
                }, 140);
            }
        };

        run();

        return () => {
            alive = false;
            stopRaf();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (phase === "done") {
        return <div style={{ ...styles.contentFadeIn, ...style }}>{children}</div>;
    }

    const label = isDoneText ? doneText : description;
    const pct = Math.max(0, Math.min(100, Math.round(progress)));

    // ✅ bar uses scaleX — always matches progress smoothly
    const scale = Math.max(0, Math.min(1, progress / 100));

    return (
        <div style={{ ...styles.wrap, ...style }}>
            <div style={styles.card}>
                <div style={styles.topRow}>
                    <div style={styles.percent}>{pct}%</div>
                </div>

                <div style={{ ...styles.barTrack, height: barHeight }}>
                    <div
                        style={{
                            ...styles.barFill,
                            transform: `scaleX(${scale})`,
                            // optional: give a tiny ease only for the final “finish” feel
                            transition: phase === "finishing" ? "transform 180ms ease" : "none",
                        }}
                    />
                </div>

                <div style={styles.desc}>{label}</div>
            </div>
        </div>
    );
}

const styles = {
    wrap: {
        width: "100%",
        minWidth: 0,
        minHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
    },

    card: {
        width: "min(520px, 100%)",
        background: "var(--card, #fffdf8)",
        border: "2px solid rgba(0,0,0,0.10)",
        boxShadow: "3px 3px 0 rgba(0,0,0,0.08)",
        borderRadius: 18,
        padding: 14,
    },

    topRow: {
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 10,
    },

    percent: {
        fontWeight: 1000,
        color: "var(--text, #3a2a1d)",
        fontSize: 18,
        lineHeight: 1,
    },

    barTrack: {
        width: "100%",
        background: "rgba(0,0,0,0.10)",
        borderRadius: 999,
        overflow: "hidden",
        position: "relative",
    },

    barFill: {
        height: "100%",
        width: "100%", // ✅ full width; we animate via scaleX
        transformOrigin: "left center",
        borderRadius: 999,
        background: "linear-gradient(90deg, var(--accent, #ff6138), rgba(255,97,56,0.70))",
        boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.15)",
        willChange: "transform",
    },

    desc: {
        marginTop: 10,
        fontWeight: 900,
        color: "var(--muted, #a47856)",
        fontSize: 14,
        lineHeight: 1.25,
        textAlign: "center",
        minHeight: 18,
    },

    contentFadeIn: {
        animation: "glFadeIn 170ms ease both",
    },
};

// Inject keyframes once (safe)
(function ensureKeyframes() {
    if (typeof document === "undefined") return;
    const id = "gl_loader_keyframes";
    if (document.getElementById(id)) return;

    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
@keyframes glFadeIn {
  from { opacity: 0; transform: translateY(3px); }
  to   { opacity: 1; transform: translateY(0px); }
}
`;
    document.head.appendChild(style);
})();
