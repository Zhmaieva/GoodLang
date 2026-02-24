import React, { useMemo, useState } from "react";
import { theme } from "../../App.jsx";
import { isLightColor } from "../../utils/uiUtils.js";

export default function ItemCard({
                                     title,
                                     subtitle,
                                     overTitle = null,
                                     rightBigText = null,
                                     variant = 'regular',
                                     imageUrl,
                                     onClick,
                                     selected = false,
                                     selectedShift = true,
                                     suppressHand = false,
                                     style = {}
                                 }) {

    const [hovered, setHovered] = useState(false);

    const baseBg = selected ? theme.accentDark : theme.surface; //selected || hovered ? (theme.accentSelected) : theme.surface;

    const bgIsLight = useMemo(() => isLightColor(baseBg), [baseBg]);

    const titleColor = bgIsLight ? theme.textDark : theme.textOnColor;
    const subColor = bgIsLight ? theme.textMutedDark : theme.textMutedOnColor;

    const transform = useMemo(() => {
        if (!selectedShift || theme.accessibility.reduceMotion) return "translateX(0) scaleX(1)";
        if (selected) return "translateX(5%) scaleX(1.05)";
        if (hovered) return "translateX(5%) scaleX(1.05)";
        return "translateX(0) scaleX(1)";
    }, [hovered, selected, selectedShift]);

    const overlayOpacity = useMemo(() => {
        return selected ? 1 : 0;
    }, [hovered, selected]);

    const styles = useMemo(() => {
        const card = {
            position: "relative",
            width: selectedShift && (selected || hovered) && !theme.accessibility.reduceMotion ? "110%" : "100%",
            boxSizing: "border-box",
            borderRadius: theme.radius.card,
            border: (hovered || selected) ? theme.borders.cardSelected : theme.borders.card,
            cursor: "pointer",
            userSelect: "none",
            padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
            transform,
            willChange: "transform",
            overflow: "hidden",
            transition: [
                `transform ${theme.motion.normal} ${theme.motion.ease}`,
                `width ${theme.motion.normal} ${theme.motion.ease}`,
                `background ${theme.motion.normal} ${theme.motion.ease}`,
            ].join(", "),
        };

        const overlay = {
            position: "absolute",
            inset: 0,
            background: baseBg,
            opacity: overlayOpacity,
            pointerEvents: "none",
            transition: `opacity ${theme.motion.fast} ${theme.motion.ease}`,
        };

        const row = {
            display: "flex",
            alignItems: theme.layout.rowAlign,
            justifyContent: theme.layout.rowJustify,
            gap: theme.spacing.gap,
            position: "relative",
            zIndex: 1,
        };

        const textCol = {
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: variant === 'minimal' ? 'initial' : theme.sizes.img,
            gap: "0.25rem",
        };

        const titleStyle = {
            fontFamily: theme.fontFamily,
            fontWeight: selected ? theme.weights.selectedBoost : theme.weights.title,
            color: titleColor,
            fontSize: theme.type.title,
            lineHeight: theme.type.titleLineHeight,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transition: `font-weight ${theme.motion.fast} ${theme.motion.ease}, color ${theme.motion.fast} ${theme.motion.ease}`,
        };

        const subtitleStyle = {
            fontFamily: theme.fontFamily,
            fontWeight: theme.weights.normal,
            color: subColor,
            fontSize: theme.type.subtitle,
            lineHeight: theme.type.subtitleLineHeight,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transition: `font-weight ${theme.motion.fast} ${theme.motion.ease}, color ${theme.motion.fast} ${theme.motion.ease}`,
        };

        const imgWrap = {
            width: theme.sizes.img,
            height: theme.sizes.img,
            borderRadius: theme.radius.img,
            overflow: theme.imgSlot.overflow,
            display: theme.imgSlot.display,
            alignItems: theme.imgSlot.alignItems,
            justifyContent: theme.imgSlot.justifyContent,
            flex: "0 0 auto",
        };

        const img = {
            width: "100%",
            height: "100%",
            objectFit: theme.imgSlot.objectFit,
            display: "block",
            filter: 'grayscale(1)',
            opacity: selected || hovered ? theme.imgSlot.defaultOpacity :  theme.imgSlot.inactiveOpacity,
        };

        const overTitleStyle = {
            fontFamily: theme.fontFamily,
            fontWeight: theme.weights.normal,
            color: subColor,
            fontSize: theme.smallType?.hint || Math.max(11, theme.type.subtitle - 2),
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            opacity: 0.85,
        };

        const rightCol = {
            flex: "0 0 auto",
            display: "flex",
            alignItems: theme.layout.rowAlign,
            justifyContent: "center",
            minWidth: 28,
        };

        const rightBigTextStyle = {
            fontFamily: theme.fontFamily,
            fontWeight: theme.weights.title,
            color: titleColor,
            fontSize: theme.type?.title || 18,
            lineHeight: theme.type?.titleLineHeight || 1.2,
            opacity: 0.95,
            userSelect: "none",
        };


        return {
            card,
            overlay,
            row,
            textCol,
            overTitleStyle,
            titleStyle,
            subtitleStyle,
            rightCol,
            rightBigTextStyle,
            imgWrap,
            img,
        };

    }, [baseBg, overlayOpacity, titleColor, subColor, transform, selected, hovered]);

    return (
        <>
            <div style={{
                ...style
            }}>
                <div
                    style={styles.card}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    onClick={onClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") onClick?.(e);
                    }}
                >
                    <div style={styles.overlay}/>
                    <div style={styles.row}>
                        <div style={styles.textCol}>
                            {overTitle ? (
                                <div style={styles.overTitleStyle} title={String(overTitle)}>
                                    {overTitle}
                                </div>
                            ) : null}

                            <div style={styles.titleStyle} title={title}>
                                {title}
                            </div>

                            {variant !== 'minimal' && (
                                <div style={styles.subtitleStyle} title={subtitle}>
                                    {subtitle}
                                </div>
                            )}
                        </div>

                        {rightBigText != null && rightBigText !== "" ? (
                            <div style={styles.rightCol}>
                                <div style={styles.rightBigTextStyle}>{rightBigText}</div>
                            </div>
                        ) : null}

                        {imageUrl ? (
                            <div style={styles.imgWrap}>
                                <img src={imageUrl} alt="" style={styles.img}/>
                            </div>
                        ) : null}
                    </div>
                </div>
                {
                    !suppressHand && selectedShift && (selected || hovered) ? (
                        <div style={{...theme.images.handWrapper}}>
                            <img src={'/handPict.PNG'} style={theme.images.handNav}/>
                        </div>

                    ) : null
                }
            </div>
        </>
    );
}
