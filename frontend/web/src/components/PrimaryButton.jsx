import React from "react";
import {motion, useReducedMotion} from "framer-motion";

export default function PrimaryButton({
                                        label,
                                        selected,
                                        loading = false,
                                        onPressed = (_) => {},
                                        theme,
                                        style= {},
                                    }) {
    const shouldReduceMotion = useReducedMotion();

    // base visual styles (layout-stable — fixed padding)
    const baseBtn = () => ({
        ...style,
        padding: style?.padding ?? '8px 14px',
        fontWeight: style?.fontWeight ?? '800',
        fontSize: style?.fontSize ?? '18px',
        lineHeight: style?.lineHeight ?? 1,
        color: style?.color ?? theme.primaryText,
        background: !selected && !loading ? (style?.background ?? theme.selected) : theme.accent,

        appearance: "none",
        WebkitAppearance: "none",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 999,
        cursor: selected ? 'default' : (loading ? "not-allowed" : "pointer"),
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        backdropFilter: "blur(3px) brightness(1) grayscale(0)",
        border: theme.borderGlass,
        boxShadow: theme.boxShadowGlass,
    });

    // spring config (tweak stiffness/damping to taste)
    const spring = shouldReduceMotion
        ? {duration: 0.82}
        : {type: "spring", stiffness: 300, damping: 20};

    return (
        <button
            key={label}
            style={baseBtn(selected)}
            // whileHover={shouldReduceMotion || selected ? {} : {scale: 1.02, y: 0}}
            // whileTap={shouldReduceMotion || selected ? {} : {scale: 0.98, y: 0}}
            //transition={spring}
            onClick={() => !loading && onPressed(label)}
            aria-pressed={selected}
            disabled={loading}
        >
            {label}
        </button>
    );
}