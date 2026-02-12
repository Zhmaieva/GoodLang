const theme = {
    fontFamily: `"Merriweather", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`,
    pageSizeHeight: '100vh',
    pageSizeHeightRelative: '100%',
    weights: {
        normal: 500,
        thin: 200,
        title: 900,
        selectedBoost: 950,
        subtitleSelected: 650,
    },

    radius: {
        card: 7,
        img: 10,
    },

    spacing: {
        cardPadY: 12,
        cardPadX: 14,
        // list
        listPad: 8,
        listInnerRightPad: 18,
        rowGap: 10,
        // card
        gap: 12,
    },

    sizes: {
        img: 56,
    },

    motion: {
        fast: "160ms",
        normal: "220ms",
        ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    },

    // typography (rem + clamp)
    type: {
        title: "clamp(0.90rem, 0.86rem + 0.25vw, 0.98rem)",
        subtitle: "clamp(0.78rem, 0.76rem + 0.20vw, 0.86rem)",
        empty: "clamp(0.85rem, 0.82rem + 0.25vw, 0.95rem)",
        titleLineHeight: 1.15,
        subtitleLineHeight: 1.15,
    },

    // neutrals
    surface: "#ffffff",
    surfaceSoft: "#fbfbfc",
    border: "rgba(0,0,0,0.10)",
    hoverDarken: "rgba(0,0,0,0.08)",

    // brand
    accent: "#a6a6a6",
    accentDark: "#656565",

    accentSelected: "#ff6138",
    accentDarkSelected: "#d74e2a",

    // text
    textDark: "#4e4646",
    textMutedDark: "rgba(41,37,37,0.72)",
    textOnColor: "#ffffff",
    textMutedOnColor: "rgba(255,255,255,0.86)",

    images: {
        handWrapper: {
            height: '0',
            width: '0'
        },
        handNav: {
            position: 'relative',
            overflow: 'visible',
            height: 120,
            transform: `rotate(270deg) scaleY(-1)`,
            top: -110,
            left: -60,
        },
        handEmptyContent: {
            position: 'fixed',
            overflow: 'visible',
            height: 400,
            transform: `rotate(180) scaleY(-1)`,
            top: '70vh',
            left: '55vw',
        }
    },

    // layout defaults (so you can reuse in other components)
    layout: {
        rowAlign: "center",
        rowJustify: "space-between",
    },

    accessibility: {
        reduceMotion: false,
    },

    // breadcrumbs (no hardcoded numbers in component)
    breadcrumbs: {
        fontSize: "clamp(2.10rem, 1.85rem + 0.75vw, 2.50rem)",
        gap: "0.55rem",
        maxLabelWidth: "18rem",
        linkOpacity: 0.75,
        sepOpacity: 0.35,
        dotsOpacity: 0.45,
        collapseAfterCrumbs: 3,
        singleCrumbCount: 1,

        // ✅ hover + a11y (no numbers in component)
        hoverScale: "scale(1.03)",
        idleScale: "scale(1)",
        hoverTransition: "140ms",
        focusTransition: "0ms", // instant if you prefer; or reuse hoverTransition
        focusRadius: "6px",
        underlineThickness: "2px",
        underlineOffset: "3px",
        linkHoverOpacity: 0.95,
    },


    // borders
    borders: {
        card: "1px solid rgba(0,0,0,0.1)",
        cardSelected: "1px solid rgba(0,0,0,0.9)",
        img: "1px solid rgba(0,0,0,0.08)",
    },

    // image square (whole style)
    imgSlot: {
        bg: "#ffffff",
        border: "1px solid rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        objectFit: "contain",
        defaultOpacity: 0.8,
        inactiveOpacity: 0.4,
    },

    // ✅ app surfaces
    bg: "#fff9ef",

    // ✅ shared “soft panel” look
    panel: {
        none: "transparent",
        soft: "rgba(255,255,255,0.6)",
    },

    // ✅ layout metrics (moves SIDEBAR_WIDTH / paddings / gaps / heights into theme)
    layoutMetrics: {
        sidebarWidth: 300,
        pagePad: 14,
        sidebarPad: 16,
        sidebarGap: 16,
        contentGap: 12,
        breadcrumbRowMinH: 44,
    },

    // ✅ teacher badge / avatar chip (moves sizes + borders + background)
    avatar: {
        size: 42,
        radius: 3,
        border: "2px solid rgba(0,0,0,.1)",
        bg: "#656565",
    },

    // ✅ small text styles used in layout (moves 14/12 and opacity into theme)
    smallType: {
        name: "clamp(0.85rem, 0.82rem + 0.25vw, 0.95rem)",
        hint: "clamp(0.75rem, 0.72rem + 0.20vw, 0.85rem)",
        hintColor: "rgba(18,18,18,0.72)", // reuse your muted concept for “hint”
    },
};

theme.emptyContent = {
    maxWidth: "65%",
    stackGap: theme.spacing.gap,
    buttonTopGap: theme.spacing.gap,
    giantCtaMaxLen: 14,
};

theme.rectangleGroup = {
    background: theme.panel?.soft || theme.surfaceSoft,
    border: theme.borders?.card || `1px solid ${theme.border}`,
    radius: theme.radius.card,

    padY: theme.spacing.cardPadY,
    padX: theme.spacing.cardPadX,
    gap: theme.spacing.gap,

    titleGap: theme.spacing.gap,
    titleFontSize: "clamp(1.2rem, 1.15rem + 0.25vw, 1.5rem)",
    titleFontWeight: theme.weights.selectedBoost,
};

// theme.js — add this block (all visuals live here)
theme.numberSlider = {
    // layout
    wrap: {
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.gap,
        padding: theme.spacing.cardPadX,
    },

    header: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.rowGap,
    },

    // "10 tasks in the assignment"
    valueLine: {
        display: "flex",
        alignItems: "baseline",
        gap: theme.spacing.rowGap,
        width: "100%",
        minWidth: 0,
    },

    valueNumber: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.title,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textDark,
        whiteSpace: "nowrap",
    },

    valueWord: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textDark,
        whiteSpace: "nowrap",
    },

    valuePost: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textDark,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    subtitle: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textMutedDark,
        opacity: 0.95,
    },

    // slider wrap
    sliderWrap: {
        width: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: "center",
    },

    // range input styling (vertical-bar thumb)
    // NOTE: range thumb/track styling needs pseudo-elements in CSS.
    // We keep the *tokens* here and provide a global CSS snippet below.
    slider: {
        width: "100%",
        appearance: "none",
        background: "transparent",
        margin: 0,
        padding: 0,
        outline: "none",
        opacity: 1,
        pointerEvents: "auto",
    },

    sliderDisabledOpacity: 0.5,

    // tokens used by global CSS
    css: {
        trackHeight: 2,
        trackRadius: 999,
        trackBg: theme.border,
        trackBgActive: theme.accentSelected,

        thumbWidth: 6,          // vertical bar
        thumbHeight: 18,
        thumbRadius: 2,
        thumbBg: theme.textDark,
        thumbBorder: theme.borders.card,

        focusRing: `0 0 0 2px ${theme.accentSelected}`,
    },

    a11y: {
        sliderLabel: "Slider",
    },
};

// ✅ Add to theme.js (NO changes required in component once these exist)
// Try to reuse what you already have; this only groups the “drawer/card” styling in one place.

theme.mediaPreview = {
    // behavior
    kinds: { auto: "auto", image: "image", video: "video" },
    phases: { hidden: "hidden", enter: "enter", exit: "exit" },
    keyJoiner: "||",
    fallbackMs: 220,

    // responsive (keep query in theme, not in component)
    mobileQuery: "(max-width: 760px)",

    // events/keys/a11y
    events: { keydown: "keydown" },
    keys: { escape: "Escape" },
    a11y: {
        role: "dialog",
        ariaModal: true,
        ariaLabel: "Media preview",
        closeLabel: "Close",
        mediaAlt: "Preview",
    },

    // overlay (monochromous)
    overlayStyle: {
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: theme.panel.none,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        pointerEvents: "auto",
    },

    // card styles
    cardStyles: {
        desktop: {
            background: theme.panel.soft,
            border: theme.borders.card,
            borderRadius: theme.radius.card,
            boxSizing: "border-box",

            // “drawer card” hovering above without shifting content
            position: "fixed",
            top: theme.layoutMetrics.pagePad,
            right: theme.layoutMetrics.pagePad,

            width: "min(38vw, 540px)",
            maxHeight: "min(76vh, 640px)",
            overflow: "hidden",

            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.gap,
            padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
        },
        mobile: {
            background: theme.panel.soft,
            border: theme.borders.card,
            borderRadius: theme.radius.card,
            boxSizing: "border-box",

            position: "fixed",
            left: theme.layoutMetrics.pagePad,
            right: theme.layoutMetrics.pagePad,
            bottom: theme.layoutMetrics.pagePad,

            width: "auto",
            maxHeight: "88vh",
            overflow: "hidden",

            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.gap,
            padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
        },
    },

    // motion (put transforms as strings here, not in component)
    motionStyles: {
        reduce: { transform: "none", transition: "none" },
        desktop: {
            in: {
                transform: "translate3d(0,0,0)",
                transition: `transform ${theme.motion.normal} ${theme.motion.ease}`,
            },
            out: {
                transform: "translate3d(120%,0,0)",
                transition: `transform ${theme.motion.normal} ${theme.motion.ease}`,
            },
        },
        mobile: {
            in: {
                transform: "translate3d(0,0,0)",
                transition: `transform ${theme.motion.normal} ${theme.motion.ease}`,
            },
            out: {
                transform: "translate3d(0,120%,0)",
                transition: `transform ${theme.motion.normal} ${theme.motion.ease}`,
            },
        },
    },

    // layout bits
    headerStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.spacing.gap,
    },

    titleStyle: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.title,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textDark,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    closeSymbol: "✕",
    closeButtonStyle: {
        appearance: "none",
        border: "none",
        background: "transparent",
        color: theme.textDark,
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.title,
        lineHeight: theme.type.titleLineHeight,
        cursor: "pointer",
        padding: theme.spacing.listPad,
        borderRadius: theme.radius.card,
    },

    mediaWrapStyle: {
        width: "100%",
        borderRadius: theme.radius.card,
        overflow: "hidden",
        border: theme.borders.card,
        background: theme.surfaceSoft,
        flex: "0 0 auto",
    },

    mediaStyle: {
        display: "block",
        width: "100%",
        height: "auto",
        objectFit: "cover",
        background: theme.surfaceSoft,
    },

    media: { draggable: false },
    video: { controls: true, playsInline: true },

    textStyle: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textMutedDark,
        overflow: "auto",
        flex: "1 1 auto",
    },

    ctaRowStyle: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: theme.spacing.gap,
        flex: "0 0 auto",
    },

    // button config
    ctaVariant: "accent",
    ctaSizes: {
        desktop: "regular",
        mobile: "regular",
    },
};

// theme.js — add at the bottom (or near other page presets)
theme.createGrammarChooseOption = {
    // layout
    rowGap: theme.spacing?.gap ?? 14, // was: theme.spacing?.gap ?? 14
    leftWidth: "60%",                // was: "60%"
    rightMaxWidth: "40%",            // was: "40%"
    rightHeight: "90%",              // was: "90%"

    // footer spacing
    footerPadTop: 12,                // was: 12
    footerPadBottom: 24,             // was: 24
    footerPadRight: 24,              // was: 24

    // chosen group
    chosenGroupHeight: "100%",       // was: "100%"

    // chosen list layout
    chosenList: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        flexWrap: "wrap",
    },

    // empty state
    emptyOpacity: 0.75,              // was: 0.75

    // misc layout guards
    full: "100%",                    // used for height/width where you had "100%"
    minH0: 0,                        // used for minHeight: 0
};

theme.input = {
    width: "100%",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing.gap,

    // label row
    labelRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.spacing.gap,
    },

    // text styles (reuse your existing tokens)
    label: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.title,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textDark,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    // input field styles (bottom line look)
    input: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textDark,

        background: "transparent",
        border: "none",
        outline: "none",
        borderBottom: theme.borders.card,

        padding: `${theme.spacing.listPad}px 0px`,
        paddingRight: 20,
        boxSizing: "border-box",
    },

    // clear button
    clearSymbol: "×",
    clearBtn: {
        appearance: "none",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.title,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textMutedDark,
        padding: 0,
        opacity: 1,
        pointerEvents: "auto",
    },
    clearBtnDisabledOpacity: 0,

    // input behavior tokens (still theme-owned)
    typeRaw: "text",
    typeEmail: "email",
    inputModeEmail: "email",
    autoCompleteEmail: "email",
    autoCompleteRaw: "off",

    a11y: {
        clearLabel: "Clear",
        inputLabel: "Input",
    },
};

theme.bottomDynamicList = {
    // layout behavior
    minHeight: 0,
    width: "100%",
    justify: "flex-end",
    height: "100%",

    // scrolling
    overflowY: "auto",
    overflowX: "hidden",

    // spacing
    topMargin: theme.spacing.gap,
    gap: theme.spacing.gap,

    // paddings
    padTop: theme.spacing.gap,
    padBottom: theme.spacing.gap * 4,
    padX: theme.spacing.cardPadX,
};

theme.link = {
    wrap: {
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.gap,
    },

    title: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.title,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textDark,
    },

    row: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.rowGap,
        width: "100%",
        minWidth: 0,
    },

    link: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textDark,
        textDecoration: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "100%",
        minWidth: 0,
    },

    linkHoverOpacity: 0.85,

    icon: {
        size: 16,
        bg: theme.textDark,
        opacity: 1,
    },

    a11y: {
        ariaLabel: "External link",
    },
};

theme.tabSwitcher = {
    wrap: {
        width: "100%",
        minWidth: 0,
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
    },

    bar: {
        position: "relative",
        display: "flex",
        width: "100%",
        borderBottom: theme.borders.card,
        // ...whatever else you have
    },

    tab: {
        flex: "1 1 0",
        position: "relative",
        cursor: "pointer",
        padding: `${theme.spacing.listPad}px ${theme.spacing.cardPadX}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 0,
    },

    label: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.normal,
        color: theme.textDark,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    content: {
        flex: "1 1 auto",
        minHeight: 0,
        display: "flex",
    },

    fade: {
        flex: "1 1 auto",
        minHeight: 0,
        transition: `opacity ${theme.motion.normal} ${theme.motion.ease}`,
    },

    indicator: {
        height: 2,
        radius: 0,
        transition: `left ${theme.motion.normal} ${theme.motion.ease}, width ${theme.motion.normal} ${theme.motion.ease}, opacity ${theme.motion.fast} ${theme.motion.ease}`,
    },

    fadeMs: 220,

    divider: { width: 1, color: theme.border },

    a11y: { role: "tablist" },
};


theme.chooseOptionReadonlyTask = {
    wrap: {
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.gap,
    },

    card: {
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        borderRadius: theme.radius.card,
        border: theme.borders.card,
        padding: `${theme.spacing.cardPadY}px ${theme.spacing.cardPadX}px`,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.gap,
        overflow: "hidden",
    },

    metaLine: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textMutedDark,
        opacity: 0.9,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    question: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.title,
        fontWeight: theme.weights.title,
        lineHeight: theme.type.titleLineHeight,
        color: theme.textDark,
        wordBreak: "break-word",
    },

    optionsWrap: {
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexWrap: "wrap",
        gap: theme.spacing.rowGap,
        alignItems: "flex-start",
    },

    chip: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: `${Math.max(6, Math.floor(theme.spacing.listPad * 0.8))}px ${theme.spacing.cardPadX}px`,
        borderRadius: theme.radius.card,
        border: theme.borders.card,
        background: theme.surfaceSoft,
        maxWidth: "100%",
        minWidth: 0,
    },

    chipText: {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textDark,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    chipCorrect: {
        background: theme.accentDark, // ✅ contrast, not “selected” orange
        border: theme.borders.cardSelected,
    },

    chipTextCorrect: {
        color: theme.textOnColor,
        fontWeight: theme.weights.subtitleSelected,
    },

    chipSubLabel: {
        fontFamily: theme.fontFamily,
        fontSize: "clamp(0.70rem, 0.68rem + 0.15vw, 0.78rem)",
        fontWeight: theme.weights.normal,
        lineHeight: 1.1,
        opacity: 0.85,
        color: theme.textMutedDark,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    chipSubLabelCorrect: {
        color: theme.textMutedOnColor,
        opacity: 0.92,
    },

    gapToken: "____",
};

export const themeStyles = theme;

