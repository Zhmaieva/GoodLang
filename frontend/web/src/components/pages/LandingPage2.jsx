import React, { useEffect, useMemo, useState } from "react";
import FooterBar from "../FooterBar.jsx";
import {PrimaryButton} from "../Buttons.jsx";
import FaqModal from "../subscription/FaqModal.jsx";
import {useNavigate} from "react-router-dom";
import {callAccountVerifyApi, callSendPromoCodeApi} from "../../services/api.js";
import {acceptCookies, getCookieConsent, rejectCookies} from "../../services/settingsService.js";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import TermsOfUseModal from "../subscription/TermsOfUseModal.jsx";
import {ensureAnalytics, trackMetaCustomEvent, trackPageView} from "../../services/gaService.js";
import {ACTION_TYPES} from "../../utils/constants.js";

/**
 * Landing page (Tea-style layout) adapted to your GoodLang theme + Nunito font
 * - Uses your colors: bg/accent/accentDark/green/blue/text/muted/radius
 * - Uses pill + shadow buttons like your PrimaryButton/TaskCard
 *
 * Optional props:
 * - onPrimaryCta: () => void
 * - onEmailSubmit: async (email) => void
 * - heroScreens: [{src, alt}, ...] (3 recommended)
 * - brand, communityCount, etc.
 */
export default function GoodLangLandingTeaStyleThemed({
                                                          theme = {
                                                              bg: "#fff3df",
                                                              accent: "#ff6138",
                                                              accentDark: "#d74e2a",
                                                              green: "#4ba36e",
                                                              greenDark: "#2d6f48",
                                                              blue: "#3a6ea5",
                                                              text: "#3a2a1d",
                                                              muted: "#a47856",
                                                              radius: 20,
                                                          },
                                                          brand = "GoodLang",
                                                          navLinks = [
                                                              { id: "about", label: `Наш підхід` },
                                                              { id: "testimonials", label: "Відгуки" },
                                                              { id: "join", label: "Приєднатися" },
                                                          ],

                                                          heroLines = ["Почни", "розмовляти", "англійською"],
                                                          heroAccentWord = "правильно",
                                                          heroBadge = "безкоштовно",

                                                          communityCount = "1581 речення перекладено",
                                                          subStat = "299 правил засвоєно",

                                                          useTitle = `ВИКОРИСТОВУЙ ${brand.toUpperCase()}, ЩОБ`,
                                                          hashtags = [
                                                              "# ПРАКТИКУВАТИ ЩОДНЯ",
                                                              "# ПІДТЯГУВАТИ СЛАБКІ ПРАВИЛА",
                                                              "# ПИСАТИ ВПЕВНЕНО",
                                                          ],

                                                          toolsTitle = "НАШІ ІНСТРУМЕНТИ НАВЧАННЯ",
                                                          tools = [
                                                              {
                                                                  title: "Перекладай речення з української на англійську",
                                                                  url: "../../../1.PNG"
                                                              },
                                                              {
                                                                  title: "Дізнайся, де саме ти помилився — з поясненням і прикладами",
                                                                  url: "../../../2.PNG"
                                                              },
                                                              {
                                                                  title: "Отримай список правил до вивчення",
                                                                  url: "../../../3.PNG"
                                                              },
                                                              {
                                                                  title: "Наступне речення підібране з урахуванням твого рівня",
                                                                  url: "../../../4.PNG"
                                                              },
                                                          ],

                                                          movementTitle = "НАШ ПІДХІД",

                                                          testimonialsTitle = `ЩО КАЖУТЬ КОРИСТУВАЧІ ${brand.toUpperCase()}`,
                                                          testimonials = [
                                                              {
                                                                  quote:
                                                                      "Для мене, на відміну від усіх інших форм завдань, повторюваний переклад дійсно працює.",
                                                                  name: "Іванна",
                                                                  url: "../../../u1.jpg"
                                                              },
                                                              {
                                                                  quote:
                                                                      "У мене раніше було відчуття, що іноді я знаю англійську на С1, а інколи два слова не можу зв'язати. Зараз я почав впевнено розмовляти.",
                                                                  name: "Влад",
                                                                  url: "../../../u2.jpg"
                                                              },
                                                              {
                                                                  quote:
                                                                    "Я реально бачу прогрес, а не гадаю, чи став кращим в англійській.",
                                                                  name: "Максим",
                                                                  url: "../../../u3.jpg"
                                                              },
                                                          ],

                                                          joinTitle = `ПРИЄДНУЙСЯ ДО ${brand.toUpperCase()} СЬОГОДНІ`,
                                                          joinSubtitle = "Почни вчитися зараз - без реєстрації.",
                                                          primaryCtaText = "Навчатися безкоштовно",
                                                          secondaryCtaText = "Дізнатись більше",
                                                          onPrimaryCta,
                                                          onSecondaryCta,

                                                          showEmailCapture = true,
                                                          onEmailSubmit,
                                                          emailPlaceholder = "you@example.com",

                                                          heroScreens = [
                                                              { src: "../../../shot1.png", alt: "Екран застосунку 1" },
                                                              { src: "../../../shot2.png", alt: "Екран застосунку 2" },
                                                              // { src: "../../../public/shot3.png", alt: "Екран застосунку 3" },
                                                          ],

                                                          maxWidth = 1120,
                                                      }) {
    const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState("");
    const [pressedId, setPressedId] = useState(null);

    const [faqVisible, setFaqVisible] = useState(false);
    const [cookieOpen, setCookieOpen] = useState(false);
    const [isStartingUsingApp, setIsStartingUsingApp] = useState(false);
    const [isGettingPromoCode, setIsGettingPromoCode] = useState(false);
    const [touOpen, setTouOpen] = useState(false);

    // useEffect(() => {
    //     if (getCookieConsent()) return;
    //
    //     const t = setTimeout(async () => {
    //         setCookieOpen(true);
    //         await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);
    //     }, 4000); // ⏱ 4 seconds after load
    //
    //     return () => clearTimeout(t);
    // }, []);

    useEffect(() => {
        const onResize = () => setW(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const styles = useMemo(() => {
        const border = `3px solid ${theme.accent}`;
        const cardBg = "#fffdf8";
        const softBg = "#fffaf3";

        const shadow = `4px 4px 0 ${theme.accentDark}`;
        const shadowSmall = `3px 3px 0 ${theme.accentDark}`;
        const font = "Nunito, system-ui, sans-serif";

        const isNarrow = w < 980;

        const btnBase = {
            border: "none",
            borderRadius: 999,
            fontWeight: 800,
            fontSize: "1rem",
            fontFamily: font,
            cursor: "pointer",
            transition: "transform .1s, background .15s",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
        };

        return {
            page: {
                minHeight: "100vh",
                background: theme.bg,
                color: theme.text,
                fontFamily: font,
            },
            wrap: {
                maxWidth,
                margin: "0 auto",
                padding: "22px 16px 60px",
            },

            // Nav
            nav: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
                paddingBottom: 14,
                marginBottom: 18,
                borderBottom: `2px solid ${theme.accent}`,
            },
            brand: { display: "flex", alignItems: "center", gap: 12, minWidth: 0 },
            logo: {
                flex: "0 0 auto",        // НЕ СТИСКАЄТЬСЯ
                width: 64,
                height: 64,
                borderRadius: 12,
                background: theme.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 64 * 0.45,
                boxShadow: `0 2px 0 ${theme.accentDark}`,
            },
            brandName: { fontWeight: 900, letterSpacing: 0.2 },
            navLinks: { display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" },
            navBtn: {
                ...btnBase,
                background: theme.accent,
                color: "#fff",
                border: `2px solid ${theme.accent}`,
                padding: "8px 12px",
                boxShadow: `2px 2px 0 ${theme.accentDark}`,
                fontSize: "0.95rem",
            },

            // Hero
            heroCard: {
                background: cardBg,
                border,
                borderRadius: theme.radius,
                boxShadow: shadow,
                padding: 18,
            },
            heroGrid: {
                display: "grid",
                gridTemplateColumns: isNarrow ? "1fr" : "1.12fr 0.88fr",
                gap: 14,
                alignItems: "center",
            },
            kicker: {
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: softBg,
                border: `2px dashed ${theme.accent}`,
                padding: "6px 12px",
                borderRadius: 999,
                fontWeight: 800,
                color: theme.text,
            },
            dot: { minWidth: 10, height: 10, borderRadius: 999, background: theme.green },
            heroStack: { marginTop: 14, lineHeight: 0.92, letterSpacing: -0.8 },
            heroLine: () => ({
                margin: 0,
                fontWeight: 900,
                // ✅ адаптивний розмір: на iPhone буде менше, на desktop — як було
                fontSize: "clamp(38px, 8.5vw, 58px)",
            }),            accentWord: { color: theme.accent },
            heroMetaRow: {
                marginTop: 14,
                paddingTop: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 12,
                flexWrap: "wrap",
            },
            stat: { fontSize: "1.25rem", fontWeight: 900 },
            statSmall: { marginTop: 4, color: theme.muted, fontWeight: 800, fontSize: "0.9rem" },
            freeBadge: {
                background: theme.accent,
                color: "#fff",
                borderRadius: 999,
                padding: "8px 12px",
                fontWeight: 900,
                boxShadow: shadowSmall,
            },

            // Buttons (Primary-like + Secondary)
            primaryBtn: (pressed) => ({
                ...btnBase,
                background: theme.accent,
                color: "#fff",
                padding: "12px 18px",
                boxShadow: `3px 3px 0 ${theme.accentDark}`,
                transform: pressed ? "translateY(1px)" : "none",
                opacity: pressed ? 0.95 : 1,
            }),
            secondaryBtn: (pressed) => ({
                ...btnBase,
                background: theme.green,
                color: "#fff",
                border: `3px solid ${theme.green}`,
                padding: "12px 18px",
                boxShadow: `3px 3px 0 ${theme.greenDark}`,
                transform: pressed ? "translateY(1px)" : "none",
            }),
            ctaRow: {                 borderTop: `2px solid ${theme.accent}`, paddingTop: "1rem",
                display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 },

            // Screens
            screensRow: {
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 14,              // a bit more air
                maxWidth: 520,        // keeps them big but not crazy
                margin: "0 auto",
            },
            screen: {
                aspectRatio: "9 / 16",
                borderRadius: theme.radius,
                border: `3px solid ${theme.accent}`,
                background: theme.bg,
                boxShadow: shadowSmall,
                overflow: "hidden",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
            screenImg: { width: "95%", height: "95%",  objectFit: "contain", display: "block" },
            screenPlaceholder: {
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                color: theme.muted,
                fontWeight: 900,
                textAlign: "center",
                padding: 10,
            },

            // Sections
            section: { marginTop: 18 },
            sectionTitle: {
                fontWeight: 900,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                fontSize: "0.9rem",
                marginBottom: 10,
                color: theme.text,
            },
            card: {
                background: cardBg,
                border,
                borderRadius: theme.radius,
                boxShadow: shadow,
                padding: 18,
            },

            useTitle: { margin: 0, fontWeight: 900, fontSize: "1.7rem", letterSpacing: -0.4 },
            hashtags: { display: "grid", gap: 8, marginTop: 12 },
            hash: { margin: 0, fontWeight: 900, fontSize: "1.55rem", letterSpacing: -0.3 },

            toolsGrid: {
                display: "grid",
                gridTemplateColumns: isNarrow ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
                gap: 10,
                marginTop: 12,
                width: "100%",
            },
            testimonialCard: {
                border: `3px solid ${theme.accent}`,
                borderRadius: theme.radius,
                boxShadow: shadowSmall,
                background: softBg,
                padding: 12,
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: "1rem"
            },
            tool: {
                border: `3px solid ${theme.accent}`,
                borderRadius: theme.radius,
                boxShadow: shadowSmall,
                background: softBg,
                padding: 12,
                minHeight: 80,
                display: "flex",
                justifyContent: "center",
                flexDirection: isNarrow ? "column" : "row",
            },
            toolTitle: { textAlign: "center", margin: 0, fontWeight: 900, alignContent: "center", fontSize: "1rem" },
            toolDesc: { margin: "8px 0 0", color: theme.muted, fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.35 },
            toolImg: {
                width: 80,
                maxWidth: "100%",
                height: "auto",
                flexShrink: 0,
                objectFit: "contain",
                display: "block",
            },
            split: {
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 12,
                alignItems: "start",
            },
            storyHead: { margin: 0, fontWeight: 900, fontSize: "1.8rem", letterSpacing: -0.5, lineHeight: 1.05 },
            story: { margin: 0, whiteSpace: "pre-line", color: theme.muted, fontWeight: 800, lineHeight: 1.6 },

            trustHead: { margin: 0, fontWeight: 900, fontSize: isNarrow ? "1.7rem" : "2.2rem", letterSpacing: -0.8, lineHeight: 1.05 },
            trustAccent: { color: theme.accent },
            badgeRow: { display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "repeat(3, 1fr)", gap: 10, marginTop: 12 },
            badge: {
                border: `3px solid ${theme.accent}`,
                borderRadius: theme.radius,
                boxShadow: shadowSmall,
                background: "#fff",
                padding: 12,
                minHeight: 80,
                display: "flex",
                justifyContent: "center",
            },
            badgeTitle:  { textAlign: "center", margin: 0, fontWeight: 900, alignContent: "center", fontSize: "1rem" },
            badgeDesc: { margin: "8px 0 0", color: theme.muted, fontWeight: 800, fontSize: "0.95rem", lineHeight: 1.35 },

            testimonialsGrid: { display: "grid", gridTemplateColumns: isNarrow ? "1fr" : "repeat(3, 1fr)", gap: 10, marginTop: 12 },
            quote: { margin: 0, fontWeight: 600, lineHeight: 1.5, fontStyle: "italic" },
            who: { marginTop: 10, color: theme.text, fontWeight: 900 },

            // Email
            emailRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12, alignItems: "center" },
            input: {
                fontFamily: "Nunito, system-ui, sans-serif",
                fontWeight: 800,
                padding: "12px 14px",
                borderRadius: 999,
                border: `3px solid ${theme.accent}`,
                background: "#fff",
                color: theme.text,
                fontSize: "1rem",
                outline: "none",
                minWidth: 220,
                flex: "1 1 240px",
            },
            msg: { marginTop: 10, color: theme.muted, fontWeight: 900 },

            footer: {
                marginTop: 18,
                paddingTop: 14,
                borderTop: `2px solid ${theme.accent}`,
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
                color: theme.muted,
                fontWeight: 800,
                fontSize: "0.95rem",
            },
        };
    }, [theme, w, maxWidth]);

    const navigate = useNavigate();
    const handleStart = async () => {
        if (!getCookieConsent()) {
            setCookieOpen(true);
            setIsStartingUsingApp(true);
            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);

            return;
        }

        trackMetaCustomEvent("StartUsing");

        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_USING);

        navigate('/');
    }

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const submitEmail = async () => {
        if (!getCookieConsent()) {
            setCookieOpen(true);
            setIsGettingPromoCode(true);
            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);

            return;
        }

        const v = String(email || "").trim();
        if (!/^\S+@\S+\.\S+$/.test(v)) {
            setMsg("Введіть правильний імейл");
            return;
        }
        try {
            setSending(true);
            setMsg("");
            await callSendPromoCodeApi({email:v});
            setMsg("Готово! Ми відправили промо код на вказану адресу.");
            setEmail("");
        } catch {
            setMsg("Ой, помилка... Ми вже її виправляємо.");
        } finally {
            setSending(false);
        }
    };

    const pressHandlers = (id) => ({
        onMouseDown: () => setPressedId(id),
        onMouseUp: () => setPressedId(null),
        onMouseLeave: () => setPressedId(null),
        onTouchStart: () => setPressedId(id),
        onTouchEnd: () => setPressedId(null),
    });


    const titleBox = {
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
    };

    const h1 = {
        margin: 0,
        color: theme.accentDark,
        fontSize: "2rem",
        fontWeight: 900,
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };

    const sub = {
        color: theme.muted,
        fontSize: "1rem",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    };

    return (
        <div style={styles.page}>
            <div style={styles.wrap}>
                {/* NAV */}
                <div style={styles.nav}>
                    <div style={styles.brand}>
                        <div style={styles.logo}>GL</div>
                        <div style={titleBox}>

                            <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                <h1 style={styles.h1}>GoodLang</h1>
                                <PrimaryButton theme={theme} onClick={async () => {
                                    setFaqVisible(true);
                                    await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_FAQ);
                                }}>FAQ</PrimaryButton>
                            </div>

                            <div style={sub}>Перекладай, поки не вивчиш</div>
                        </div>
                    </div>

                    <div style={styles.navLinks}>
                        {navLinks.map((l) => (
                            <button key={l.id} style={styles.navBtn} onClick={() => scrollTo(l.id)} type="button">
                                {l.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* HERO */}
                <div style={{ ...styles.heroCard, ...styles.heroGrid }}>
                    <div>
                        <div style={styles.kicker}>
                            <span style={styles.dot}/>
                            Практика перекладу + миттєвий фідбек на базі AI
                        </div>

                        {/*<div style={{marginTop: 6, color: theme.muted, fontWeight: 700, fontSize: "0.9rem"}}>*/}
                        {/*    Розумні пояснення та фідбек на базі AI*/}
                        {/*</div>*/}

                        <div style={styles.heroStack}>
                            {heroLines.map((line, idx) => (
                                <p
                                    key={idx}
                                    style={styles.heroLine(idx === 0 ? 54 : idx === 1 ? 58 : idx === 2 ? 54 : 56)}
                                >
                                    {line}{" "}
                                    {idx === heroLines.length - 1 ? (
                                        <span style={styles.accentWord}>{heroAccentWord}</span>
                                    ) : null}
                                </p>
                            ))}
                        </div>

                        <div style={styles.ctaRow}>
                            <button
                                type="button"
                                style={styles.primaryBtn(pressedId === "heroPrimary")}
                                {...pressHandlers("heroPrimary")}
                                onClick={async () => {
                                    onPrimaryCta ? onPrimaryCta() : scrollTo("join");

                                    await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_LEARNING);
                                }}
                            >
                                {primaryCtaText}
                            </button>

                            <button
                                type="button"
                                style={styles.secondaryBtn(pressedId === "heroSecondary")}
                                {...pressHandlers("heroSecondary")}
                                onClick={async () => {
                                    onSecondaryCta ? onSecondaryCta() : scrollTo("about");

                                    await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_LEARN_MORE);
                                }}
                            >
                                {secondaryCtaText}
                            </button>
                        </div>

                        <div style={styles.heroMetaRow}>
                            <div>
                                <div style={styles.stat}>{communityCount}</div>
                                <div style={styles.statSmall}>{subStat}</div>
                            </div>
                            {/*<div style={styles.freeBadge}>{heroBadge}</div>*/}
                        </div>

                        <div style={{marginTop: 10, color: theme.text, opacity: 0.5, fontWeight: 600}}>
                            Зроблено для україномовних учнів, які втомилися від “я знаю правило… але все одно роблю ту
                            саму помилку”.
                        </div>
                    </div>

                    <div>
                        <div style={styles.screensRow}>
                            {heroScreens.slice(0, 3).map((s, i) => {
                                return (
                                    <div key={i} style={styles.screen}>
                                        {s?.src ? (
                                            <img src={s.src} alt={s.alt || `Screen ${i + 1}`} style={styles.screenImg} />
                                        ) : (
                                            <div style={styles.screenPlaceholder}>
                                                Add screenshot {i + 1}
                                                <br />
                                                <span style={{ fontSize: 12, fontWeight: 800 }}>(heroScreens[{i}].src)</span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* MOVEMENT / STORY */}
                <div id="about" style={{ ...styles.section, ...styles.card }}>
                    <div style={styles.sectionTitle}>{movementTitle}</div>
                    <div style={styles.split}>
                        <div>
                            <p style={styles.storyHead}>
                                Ти не “погано знаєш граматику”.{" "}<br/>
                                <span style={{color: theme.green}}>Тобі просто потрібна регулярна практика</span>
                            </p>
                            <div style={styles.ctaRow}>

                                <div style={styles.toolsGrid}>
                                    {tools.map((tool) => (
                                        <div key={tool.title} style={{...styles.tool, gap: 12, alignItems: "center"}}>
                                            <p style={styles.toolTitle}>{tool.title}</p>
                                            <img style={styles.toolImg} alt={tool.title} src={tool.url}/>
                                        </div>
                                    ))}
                                </div>
                            </div>


                        </div>

                    </div>
                </div>

                {/* TESTIMONIALS */}
                <div id="testimonials" style={{ ...styles.section, ...styles.card }}>
                    <div style={styles.sectionTitle}>{testimonialsTitle}</div>
                    <div style={styles.testimonialsGrid}>
                        {testimonials.map((x, i) => (
                            <div key={i} style={{...styles.testimonialCard, minHeight: "auto"}}>

                                <div style={{display: "flex", gap: "12px"}}>
                                    <img alt={x.name} src={x.url} style={{
                                        objectFit: "cover",
                                        position: "relative",
                                        top: "0.25rem",
                                        borderRadius: "0.5rem",
                                        border: `2px solid ${theme.accentDark}`,
                                        height: "2rem",
                                        width: "2rem",
                                    }}/>
                                    <div style={styles.who}>{x.name}</div>
                                </div>

                                <p style={styles.quote}>"{x.quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* JOIN */}
                <div id="join" style={{...styles.section, ...styles.card}}>
                    <div style={styles.sectionTitle}>{joinTitle}</div>
                    <div style={{fontWeight: 900, fontSize: "1.8rem", letterSpacing: -0.5}}>
                        {joinSubtitle}
                    </div>

                    <div style={styles.ctaRow}>
                        <button
                            type="button"
                            style={styles.primaryBtn(pressedId === "joinPrimary")}
                            {...pressHandlers("joinPrimary")}
                            onClick={handleStart}
                        >
                            Почати навчання
                        </button>
                    </div>

                    {showEmailCapture && (
                        <>
                            <div style={styles.emailRow}>
                                <input
                                    style={styles.input}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={emailPlaceholder}
                                    inputMode="email"
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();      // ⛔ prevent accidental form submit / reload
                                            await submitEmail();           // ✅ same logic as button click
                                        }
                                    }}
                                />
                                <button
                                    type="button"
                                    style={styles.secondaryBtn(pressedId === "emailBtn")}
                                    {...pressHandlers("emailBtn")}
                                    disabled={sending}
                                    onClick={submitEmail}
                                >
                                    {sending ? "Відправляю..." : "Отримати промо код"}
                                </button>
                            </div>
                            {msg ? <div style={styles.msg}>{msg}</div> : null}
                        </>
                    )}
                </div>

                {faqVisible && !cookieOpen && (
                    <FaqModal
                        theme={theme}
                        onClose={() => setFaqVisible(false)}
                    />
                )}

                {touOpen && (
                    <TermsOfUseModal
                        readOnly
                        theme={theme}
                        onClose={() => setTouOpen(false)}
                    />
                )}

                {cookieOpen && !touOpen && (
                    <CookieConsentModal
                        theme={theme}
                        onAccept={async () => {
                            setCookieOpen(false);

                            acceptCookies();
                            ensureAnalytics();
                            trackPageView(window.location.pathname);

                            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);

                            if (isStartingUsingApp) {
                                await handleStart();
                            } else if (isGettingPromoCode) {
                                await submitEmail();
                            }
                        }}
                        onReject={async () => {
                            setCookieOpen(false);

                            rejectCookies();

                            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);

                            if (isStartingUsingApp) {
                                await handleStart();
                            } else if (isGettingPromoCode) {
                                await submitEmail();
                            }
                        }}
                        onOpenPolicy={async () => {
                            // reuse your existing Terms modal
                            // this keeps UX consistent
                            setTouOpen(true);

                            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_TOU);
                            // or open TermsOfUseModal if you prefer
                        }}
                    />
                )}

                {/* FOOTER */}
                <FooterBar theme={theme} />
            </div>

        </div>
    );
}
