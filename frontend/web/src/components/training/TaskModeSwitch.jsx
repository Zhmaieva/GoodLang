import {useEffect, useRef, useState} from "react";
import { Button } from "../Buttons.jsx";

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

    const lockedTooltipText = "Choose task format after the level assessment";

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

    const note = {
        fontWeight: 800,
        fontSize: "0.9rem",
        color: theme.text,
        opacity: 0.8,
        whiteSpace: "pre-wrap",
    };

    const options = [
        { value: "translations", label: "Translation only" },
        { value: "gaps", label: "Multiple choice only" },
        { value: "combined", label: "All" },
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
        if (!compact) return !expanded ? `Tasks: ${label}` : label;
        if (expanded) return label;
        if (label === "all") return "All tasks";
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
                <Button
                    key={value}
                    variant="segmented"
                    compact={compact}
                    theme={{ ...theme, accent: theme.green, accentDark: theme.greenDark }}
                    active={taskMode === value || !expanded}
                    onMouseEnter={() => {
                        if (locked && !compact) {
                            setTipOpen(true);
                            setTipVisible(true);
                        }
                    }}
                    onMouseLeave={() => {
                        if (locked && !compact) {
                            setTipVisible(false);
                            setTipOpen(false);
                        }
                    }}
                    style={{
                        fontFamily: 'var(--font-family-base)',
                        whiteSpace: "nowrap",
                        flex: "0 0 auto",
                        position: "relative",
                        filter: locked ? "saturate(0.5)" : undefined,
                        cursor: locked ? "not-allowed" : undefined,
                    }}
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
                </Button>
            ))}

            {taskModeLocked && (
                <div style={note}>
                    {taskModeLockReason || "Only translations available for this level."}
                </div>
            )}
        </div>
    );
}
