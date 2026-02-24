import React from "react";
import { theme } from "../../App.jsx";

function isEligible(step) {
    return typeof step.when === "function" ? !!step.when() : true;
}
function firstEligibleKey(steps) {
    const s = steps.find(isEligible);
    return s ? s.key : "";
}
function nextEligibleKey(steps, fromKey, dir) {
    const idx = steps.findIndex((s) => s.key === fromKey);
    if (idx < 0) return "";
    for (let i = idx + dir; i >= 0 && i < steps.length; i += dir) {
        if (isEligible(steps[i])) return steps[i].key;
    }
    return "";
}

export default function Flow({
                                 steps = [],
                                 onDone,
                                 activeKey: controlledActiveKey = null,
                                 onActiveKeyChange,
                                 initialKey = null,
                                 style = {},
                             }) {
    const t = theme.flow;


    const isControlled = controlledActiveKey != null;

    const [uncontrolledKey, setUncontrolledKey] = React.useState(() => {
        const init = initialKey ? String(initialKey) : "";
        return init || firstEligibleKey(steps);
    });

    const activeKey = isControlled
        ? String(controlledActiveKey || "")
        : uncontrolledKey;

    const setActiveKey = React.useCallback(
        (k) => {
            const key = String(k || "");
            if (isControlled) {
                onActiveKeyChange?.(key);
            } else {
                setUncontrolledKey(key);
                onActiveKeyChange?.(key);
            }
        },
        [isControlled, onActiveKeyChange]
    );
    const [phase, setPhase] = React.useState("shown");
    const pendingRef = React.useRef(null);

    React.useEffect(() => {
        const cur = steps.find((s) => s.key === activeKey);
        if (!cur || !isEligible(cur)) {
            const first = firstEligibleKey(steps);
            if (first) setActiveKey(first);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeKey, steps]);

    React.useEffect(() => () => pendingRef.current && clearTimeout(pendingRef.current), []);

    const goTo = React.useCallback(
        (key) => {
            if (!key || key === activeKey) return;

            setPhase("hidden");
            if (pendingRef.current) clearTimeout(pendingRef.current);

            const ms = Number.parseInt(String(t.ms || theme.motion?.normal || "220ms"), 10);
            pendingRef.current = setTimeout(() => {
                setActiveKey(key);
                setPhase("shown");
            }, Number.isFinite(ms) ? ms : 0);
        },
        [activeKey, t.ms]
    );

    const goNext = React.useCallback(() => {
        const next = nextEligibleKey(steps, activeKey, +1);
        if (next) return goTo(next);
        onDone?.();
    }, [steps, activeKey, goTo, onDone]);

    const goPrev = React.useCallback(() => {
        const prev = nextEligibleKey(steps, activeKey, -1);
        if (prev) goTo(prev);
    }, [steps, activeKey, goTo]);

    const active = steps.find((s) => s.key === activeKey);
    if (!active) return null;

    const opacity = phase === "hidden" ? t.opacity.hidden : t.opacity.shown;


    const fadeWrapStyle = {
        ...t.fade,
        transition: `opacity ${theme.motion.normal} ${theme.motion.ease}`,
        opacity,

        display: t.content?.display || "flex",
        flexDirection: t.content?.flexDirection || "column",
        gap: t.content?.gap,
    };


    return (
        <div style={{
            ...t.wrap,
            ...style
        }}>
            <div style={t.content}>
                <div style={fadeWrapStyle}>
                    {active.title ? <h3 style={t.title}>{active.title}</h3> : null}
                    {active.render({ goNext, goPrev, goTo })}
                </div>
            </div>
        </div>
    );
}
