import {useEffect, useRef, useState} from "react";

export default function TaskModeSwitch({
                                           theme,
                                           taskMode = "combined", // "translations" | "gaps" | "combined"
                                           setTaskMode = (_) => {},
                                           loading = false,

                                           taskModeLocked = false,
                                           taskModeLockReason = "",
                                           compact = false,

                                           // ✅ NEW
                                           onExpandedChange = (_) => {},

                                           // ✅ NEW: visual lock for the switch (separate from "taskModeLocked")
                                           locked = false,
                                       }) {
    const [hovered, setHovered] = useState(false);
    const [expanded, setExpanded] = useState(false);

    // tooltip (for locked)
    const [tipOpen, setTipOpen] = useState(false);
    const [tipVisible, setTipVisible] = useState(false); // opacity
    const tipTimerRef = useRef(null);

    const showTipForASecond = () => {
        if (tipTimerRef.current) clearTimeout(tipTimerRef.current);

        setTipOpen(true);
        setTipVisible(true);

        tipTimerRef.current = setTimeout(() => {
            setTipVisible(false); // start fade
            tipTimerRef.current = setTimeout(() => {
                setTipOpen(false); // unmount after fade
            }, 300); // match CSS transition duration
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
        };
    }, []);

    useEffect(() => {
        onExpandedChange(!!expanded);
    }, [expanded, onExpandedChange]);

    // close tooltip on outside click / esc
    useEffect(() => {
        if (!tipOpen) return;

        const onDown = (e) => {
            // close on any click; we stopPropagation on the button
            setTipOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") setTipOpen(false);
        };

        window.addEventListener("mousedown", onDown);
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("keydown", onKey);
        };
    }, [tipOpen]);

    const lockedTooltipText = "Обирай формат завдань після оцінки рівня";

    const iconBase = {
        width: 12, // layout box stays small
        height: 12,
        display: "inline-block",
        flex: "0 0 auto",
        marginRight: ".5rem",

        // mask props (colorable)
        backgroundColor: "#fff",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
    };

    const gearIcon = {
        ...iconBase,
        maskImage: "url(/gear-icon.svg)",
        WebkitMaskImage: "url(/gear-icon.svg)",
        transform: "rotate(30deg) scale(2)",
        transformOrigin: "center",
    };

    const lockIcon = {
        ...iconBase,
        maskImage: "url(/lock-icon.svg)",
        WebkitMaskImage: "url(/lock-icon.svg)",
        // ✅ no rotate when locked
        transform: "scale(1.5)",
        transformOrigin: "center",
    };

    const wrap = {
        display: "flex",
        gap: 10,
        alignItems: "flex-start",
        flexWrap: "wrap",
        justifyContent: (compact && window.innerWidth < 600) ? "flex-start" : "flex-end",
        width: "100%",
        minWidth: 0,
    };

    const btn = (selected, isHover) => {
        const disabled = taskModeLocked || loading || locked;

        return {
            appearance: "none",
            padding: compact ? "8px 14px" : "10px 16px",
            fontWeight: 800,
            fontSize: "1rem",
            lineHeight: 1,
            borderRadius: 999,

            cursor: disabled ? "not-allowed" : "pointer",

            // ✅ less saturated when locked
            background: (selected || !expanded) ? theme.green : "#fffdf8",
            color: (selected || !expanded) ? "#fff" : theme.text,
            //opacity: disabled ? 0.55 : 1,
            filter: disabled ? "saturate(0.5)" : isHover ? "brightness(0.95)" : "none",

            border: "2px solid rgba(0,0,0,0.12)",
            boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
            fontFamily: "Nunito, system-ui, sans-serif",
            whiteSpace: "nowrap",
            flex: "0 0 auto",

            // keep your hover press effect only when enabled
            transform: !disabled && isHover ? "translateY(1px)" : "none",
            transition: "transform 120ms ease, filter 120ms ease, opacity 120ms ease",
            position: "relative", // for tooltip anchor
        };
    };

    const note = {
        fontWeight: 800,
        fontSize: "0.9rem",
        color: theme.text,
        opacity: 0.8,
        whiteSpace: "pre-wrap",
    };

    const options = [
        { value: "translations", label: "лише переклад" },
        { value: "gaps", label: "лише «обери варіант»" },
        { value: "combined", label: "всі" },
    ];

    const selectedOption = options.find((o) => o.value === taskMode) ?? options[2];

    const handleClick = (value) => {
        // ✅ locked: show tooltip, do nothing else
        if (locked) {
            if (compact) {
                showTipForASecond(); // ✅ tap -> show then dissolve
            } else {
                setTipOpen(true);    // desktop click can keep it open (hover handles it anyway)
            }
            return;
        }


        if (taskModeLocked || loading) return;

        if (!expanded) {
            setExpanded(true);
            return;
        }

        setTaskMode(value);
        setExpanded(false);
    };

    const visibleOptions = expanded ? options : [selectedOption];

    const getLabel = (label) => {
        if (!compact) return !expanded ? `Завдання: ${label}` : label;
        if (expanded) return label;
        if (label === "всі") return "Всі завдання";
        return label;
    };

    const tooltipStyle = {
        position: "absolute",
        top: "calc(100% + 10px)",
        right: compact ? "auto" : 0,
        left: compact ? 0 : "auto",
        zIndex: 50,

        background: theme.muted,
        color: "#fff",
        padding: "10px 12px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 800,
        lineHeight: 1.25,
        width: 310,
        boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
        whiteSpace: "normal",
        textAlign: "left",

        opacity: tipVisible ? 1 : 0,
        transition: "opacity 300ms ease",
        pointerEvents: "none", // ✅ prevents accidental hover loops
    };


    const tooltipArrow = {
        position: "absolute",
        top: -6,
        right: compact ? "auto" : 16,
        left: compact ? 16 : "auto",
        width: 12,
        height: 12,
        background: theme.muted,
        transform: "rotate(45deg)",
    };

    return (
        <div style={wrap} role="group" aria-label="Task mode">
            {visibleOptions.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    onMouseEnter={() => {
                        setHovered(value);
                        if (locked && !compact) {
                            setTipOpen(true);
                            setTipVisible(true);
                        }
                    }}
                    onMouseLeave={() => {
                        setHovered(false);
                        if (locked && !compact) {
                            setTipVisible(false);
                            setTipOpen(false);
                        }
                    }}


                    style={btn(taskMode === value, hovered === value)}
                    aria-pressed={taskMode === value}
                    disabled={taskModeLocked || loading}
                    onClick={(e) => {
                        e.stopPropagation(); // so outside click handler won't immediately close it
                        handleClick(value);
                    }}
                >
                    {!expanded && <span style={locked ? lockIcon : gearIcon} aria-hidden />}

                    {getLabel(label)}

                    {/* ✅ tooltip (locked only) */}
                    {locked && tipOpen && (
                        <span style={tooltipStyle} role="tooltip">
              <span style={tooltipArrow} aria-hidden />
                            {lockedTooltipText}
            </span>
                    )}
                </button>
            ))}

            {taskModeLocked && (
                <div style={note}>
                    {taskModeLockReason || "Only translations available for this level."}
                </div>
            )}
        </div>
    );
}
