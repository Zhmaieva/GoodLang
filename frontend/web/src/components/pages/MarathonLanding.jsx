import handPict from "../../../public/handPict.PNG";
import marathonPict from "../../../public/marathon-img.png";
import hand2 from "../../../public/hand2.PNG";
import hand1 from "../../../public/hand1.PNG";
import hand3 from "../../../public/hand3.PNG";
import { useNavigate } from "react-router-dom";
import TermsOfUseModal from "../subscription/TermsOfUseModal.jsx";
import React, { useEffect, useRef, useState } from "react";
import { callAccountVerifyApi, callSendPromoCodeApi } from "../../services/api.js";
import { ACTION_TYPES } from "../../utils/constants.js";

export default function LandingPageMarathon({ theme }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState("");
    const [touOpen, setTouOpen] = React.useState(false);

    const [ctaLoading, setCtaLoading] = useState(false);

    const hasScrolledRef = useRef(false);

    const startFreeDay1 = async () => {
        try {
            setCtaLoading(true);
            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_MARATHON_START_FREE_DAY1);

            // ✅ adjust route as needed
            // e.g. /marathon?start=1 or /marathon/day/1
            setTimeout(() => navigate("/"), 150);
        } finally {
            setCtaLoading(false);
        }
    };

    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => {
        setTimeout(async () => {
            await callAccountVerifyApi(ACTION_TYPES.LANDING_WAIT_3_SECONDS);
        }, 3000);

        setTimeout(async () => {
            await callAccountVerifyApi(ACTION_TYPES.LANDING_WAIT_10_SECONDS);
        }, 10000);

        setTimeout(async () => {
            await callAccountVerifyApi(ACTION_TYPES.LANDING_WAIT_20_SECONDS);
        }, 20000);
    }, []);

    useEffect(() => {
        const onScroll = async () => {
            if (!hasScrolledRef.current) {
                hasScrolledRef.current = true;
                await callAccountVerifyApi(ACTION_TYPES.LANDING_SCROLL_START);
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const submitEmail = async () => {
        const v = String(email || "").trim();
        if (!/^\S+@\S+\.\S+$/.test(v)) {
            setMsg("Введіть правильний імейл");
            return;
        }
        try {
            setSending(true);
            setMsg("");
            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_MARATHON_PROMO_REQUEST);
            await callSendPromoCodeApi({ email: v });
            setMsg("Готово! Ми відправили промо код на вказану адресу.");
            setEmail("");
        } catch {
            setMsg("Ой, помилка... Ми вже її виправляємо.");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <style>{`/* =========================
   RESET + TOKENS
========================= */
* { box-sizing: border-box; }

:root{
  --bg: #fff4de;
  --accent: #fe6037;
  --ink: #000;
  --text: #111;
  --muted: rgba(0,0,0,0.88);

  --card-bg: #fff;
  --shadow: 0 4px 0 var(--ink);
  --shadow-btn: 0 3px 0 var(--ink);
  --border: 2px solid var(--ink);

  --radius: 14px;
  --container: 1100px;
  --heroCard: 520px;

  --font: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  --font-soft: Nunito, ui-sans-serif, system-ui;
}

html, body{
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;
  overflow-y: auto;
  font-family: var(--font);
}

html{ scroll-behavior: smooth; }

/* =========================
   LAYOUT
========================= */
.divider{
  width: 100%;
  height: 2px;
  background: var(--ink);
}

.section{
  width: 100%;
  background: var(--bg);
  display: flex;
  justify-content: center;
  padding: 56px 16px;
}

.sectionInner,
.ctaInner{
  width: min(var(--container), 100%);
}

/* =========================
   HERO
========================= */
.landing{
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  min-height: 100vh;
}

/* left hero */
.left{
  background: #f24f13;
  padding: 56px 48px;
  display: flex;
  align-items: center;
}
.textBlock{ max-width: 580px; }

.title{
  margin: 0;
  font-size: clamp(24px, 6vw, 44px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
}
.title em{
  font-family: var(--font-soft);
  font-style: italic;
  font-weight: 200;
}

.subtitle{
  margin: 16px 0 0 0;
  font-family: var(--font-soft);
  font-size: 16px;
  line-height: 1.35;
  font-weight: 300;
  color: var(--bg);
  max-width: 560px;
}

.badgeRow{
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.pill{
  border: var(--border);
  box-shadow: var(--shadow-btn);
  border-radius: 999px;
  background: rgba(255,255,255,0.25);
  padding: 8px 12px;
  font-family: var(--font-soft);
  font-weight: 900;
  font-size: 13px;
}

/* right hero */
.right{
  position: relative;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: clamp(84px, 10vw, 120px) 24px 24px 24px;
}

/* top nav */
.topNav{
  position: absolute;
  top: 24px;
  right: 32px;
  display: flex;
  gap: 20px;
  z-index: 3;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.topNavBtn{
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-soft);
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;
  opacity: 0.85;
  white-space: nowrap;
}
.topNavBtn:hover{ opacity: 1; }
.topNavBtn:focus-visible{
  outline: 2px solid rgba(0,0,0,0.3);
  outline-offset: 4px;
}

/* hero stack (card + hand) */
.heroStack{
  width: min(var(--heroCard), 92vw);
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

/* hero card */
.heroCard{
  width: 100%;
  border: var(--border);
  box-shadow: var(--shadow);
  background: var(--card-bg);
  padding: 22px;
}

.heroCardTitle{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 900;
  font-size: 18px;
  letter-spacing: 0.2px;
}
.heroCardText{
  margin: 10px 0 0 0;
  font-family: var(--font-soft);
  font-weight: 300;
  line-height: 1.35;
  font-size: 15px;
  color: #3a2a1d;
}

.miniList{
  margin: 12px 0 0 0;
  padding: 0 0 0 18px;
  font-family: var(--font-soft);
  font-weight: 300;
  color: #3a2a1d;
  line-height: 1.35;
  font-size: 14px;
}
.miniList li{ margin: 6px 0; }

.noticeLine{
  margin-top: 10px;
  font-family: var(--font-soft);
  font-weight: 800;
  font-size: 13px;
  color: #3a2a1d;
  opacity: 0.9;
}

/* hand under card */
.handPointerWrap{
  width: 100%;
  margin-top: 8px;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.handPointer{
  width: 74px;
  height: auto;
}

/* =========================
   BUTTONS
========================= */
.primaryBtn,
.secondaryBtn{
  border: var(--border);
  border-radius: var(--radius);
  padding: 12px 18px;
  font-family: var(--font-soft);
  font-weight: 800;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease, opacity 120ms ease;
  box-shadow: var(--shadow-btn);
  user-select: none;
  font-size: 14px;
}

.primaryBtn{
  background: var(--accent);
  color: var(--ink);
}
.secondaryBtn{
  background: #fff;
  color: var(--text);
}

.primaryBtn:hover,
.secondaryBtn:hover{
  transform: translateY(-1px);
  box-shadow: 0 5px 0 var(--ink);
}
.primaryBtn:active,
.secondaryBtn:active{
  transform: translateY(3px);
  box-shadow: 0 1px 0 var(--ink);
}
.primaryBtn:disabled,
.secondaryBtn:disabled{
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: var(--shadow-btn);
}
.heroBtns{
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.heroBtns > button{ width: 100%; }

/* =========================
   SECTION: TEXT
========================= */
.sectionTitle{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 900;
  font-size: 26px;
  letter-spacing: -0.01em;
}
.sectionLead{
  margin: 10px 0 0 0;
  font-family: var(--font-soft);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.45;
  color: #3a2a1d;
  max-width: 860px;
}

/* =========================
   FEATURES
========================= */
.featuresGrid{
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.featureCard{
  border: var(--border);
  box-shadow: var(--shadow);
  background: var(--card-bg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 170px;
}

.featureIconRow{
  display: flex;
  align-items: center;
  gap: 10px;
}
.featureIcon{
  height: 42px;
  width: 42px;
  object-fit: contain;
}
.featureTitle{
  font-weight: 900;
  font-size: 16px;
  font-family: var(--font-soft);
}
.featureText{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.35;
  color: #3a2a1d;
}

/* =========================
   HOW
========================= */
.howGrid{
  margin-top: 26px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 22px;
  align-items: start;
}

.stepsCard{
  border: var(--border);
  box-shadow: var(--shadow);
  background: var(--card-bg);
  padding: 18px;
}

.step{
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(0,0,0,0.12);
}
.step:last-child{ border-bottom: none; }

.stepNum{
  width: 30px;
  height: 30px;
  border: var(--border);
  border-radius: 10px;
  box-shadow: var(--shadow-btn);
  display: grid;
  place-items: center;
  font-family: var(--font-soft);
  font-weight: 900;
  background: var(--bg);
}

.stepTitle{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 900;
  font-size: 15px;
}
.stepText{
  margin: 6px 0 0 0;
  font-family: var(--font-soft);
  font-weight: 300;
  line-height: 1.35;
  color: #3a2a1d;
  font-size: 14px;
}

.videoBox{
  border: var(--border);
  box-shadow: var(--shadow);
  background: #000;
  width: 100%;
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
}
.videoBox img{
  width: 100%;
  height: auto;
  display: block;
}

.howVideo{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* =========================
   MODES
========================= */
.modesGrid{
  margin-top: 26px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
}
.modeCard{
  border: var(--border);
  box-shadow: var(--shadow);
  background: var(--card-bg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.modeBadge{
  display: inline-flex;
  align-self: flex-start;
  border: var(--border);
  box-shadow: var(--shadow-btn);
  border-radius: 999px;
  padding: 7px 10px;
  font-family: var(--font-soft);
  font-weight: 900;
  font-size: 13px;
  background: var(--bg);
}
.modeTitle{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 900;
  font-size: 16px;
}
.modeText{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 300;
  line-height: 1.35;
  color: #3a2a1d;
}

/* =========================
   TESTIMONIALS
========================= */
.testimonialsGrid{
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}
.quoteCard{
  border: var(--border);
  box-shadow: var(--shadow);
  background: var(--card-bg);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.quote{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 300;
  font-size: 15px;
  line-height: 1.35;
  color: #3a2a1d;
}
.quoteAuthor{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 900;
  font-size: 13px;
  opacity: 0.9;
}

/* =========================
   CTA
========================= */
.ctaSection{
  background: var(--bg);
  display: flex;
  justify-content: center;
  padding: 56px 16px;
  text-align: left;
}
.ctaContent{
  width: 100%;
  max-width: var(--container);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.ctaTitle{
  margin: 0;
  font-family: var(--font-soft);
  font-weight: 900;
  font-size: 26px;
}
.ctaTitle em{ font-style: italic; font-weight: 200; }
.ctaSubtitle{
  margin: 0;
  font-size: 16px;
  opacity: 0.85;
  font-family: var(--font-soft);
  font-weight: 300;
  max-width: 900px;
}

.ctaButtons{
  display: flex;
  width: 100%;
  gap: 10px;
  align-items: stretch;
}
.ctaButtons > button{ flex: 1; }

.promoRow{
  display: flex;
  gap: 12px;
  width: 100%;
  align-items: stretch;
}

.emailInput{
  padding: 12px 14px;
  font-family: var(--font-soft);
  font-weight: 800;
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-btn);
  flex: 1;
  min-width: 0;
  font-size: 16px;
}
.emailInput:focus{ outline: none; }
.emailInput:focus-visible{
  outline: 3px solid rgba(0,0,0,0.35);
  outline-offset: 3px;
}
.promoBtnOrange{
  background: var(--accent);
  color: var(--ink);
  border: var(--border);
  height: 100%;
}
.hint-text {
  font-size: 0.7em; /* або 13px / 14px */
}

/* =========================
   FOOTER
========================= */
.footer{
  width: 100%;
  background: var(--accent);
  display: flex;
  justify-content: center;
  padding: 14px 16px;
  border-top: 2px solid var(--ink);
}
.footerInner{
  width: min(var(--container), 100%);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-family: var(--font-soft);
  color: var(--ink);
}
.footerLeft{ opacity: 0.9; }
.footerLink{
  font-weight: 800;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.footerLink:hover{ opacity: 0.8; }
.plainLink{
  color: inherit;
  text-decoration: none;
}

/* =========================
   RESPONSIVE
========================= */
@media (max-width: 1050px){
  .featuresGrid{ grid-template-columns: repeat(1, 1fr); }
  .howGrid{ grid-template-columns: 1fr; }
  .modesGrid{ grid-template-columns: 1fr; }
  .testimonialsGrid{ grid-template-columns: 1fr; }
}

@media (max-width: 1150px){
  .landing{ grid-template-columns: 1fr; }
  .right{
    align-items: center;
    padding: 72px 16px 24px 16px;
  }
  .topNav{
    right: 18px;
    left: 18px;
    justify-content: space-between;
    gap: 12px;
  }
  .handPointer{ width: 64px; }
    .desktop{display: none}
}

@media (min-width: 1150px){
  .mobile{display: none}
}

@media (max-width: 600px){
  .left{ padding: 44px 18px; }
  .promoRow{ flex-direction: column; }
  .ctaButtons{ flex-direction: column; }
  .footerInner{ flex-direction: column; align-items: flex-start; gap: 6px; }
}

      `}</style>

            {/* HERO */}
            <section className="landing">
                <div className="left" style={{zIndex: 10}}>
                    <div className="textBlock">
                        <h1 className="title">
                            ➤ марафон перекладу<br/>
                            ➤ 16-34 речення в день<br/>
                            ➤ 7 правил граматики<br/>
                            <em class="hint-text">Пропуск дня = кінець марафону.<br/>
                                Стартуй знову в наступному циклі.</em>
                        </h1>

                        <p className="subtitle">
                            Інтенсив англійської 7 днів поспіль → відпрацьовуєш grammar до автомату
                        </p>
                    </div>
                </div>

                <div className="handPointerWrap mobile" style={{
                    position: "absolute",
                    rotate: '180deg',
                    top: window.innerWidth < 400 ? '25vh' : '40vh',
                    left: '-40px',
                    zIndex: 9
                }}>
                    <img src={handPict} className="handPointer" alt=""/>
                </div>

                <div className="right">
                    <div className="topNav">
                        <button className="topNavBtn" onClick={() => scrollTo("inside")}>
                            що всередині
                        </button>
                        <button className="topNavBtn" onClick={() => scrollTo("how")}>
                            як працює
                        </button>
                        <button className="topNavBtn" onClick={() => scrollTo("price")}>
                            ціна
                        </button>
                    </div>

                    <div className="heroStack">
                        <div className="heroCard">
                            <p className="heroCardText">
                                <strong style={{fontWeight: 800}}>Марафон</strong> побудований як “наростаюча хвиля”:
                                щодня новий набір речень підібраних під <strong style={{fontWeight: 800}}>твій
                                рівень</strong>.
                            </p>

                            <p className="heroCardText">
                                <strong style={{fontWeight: 800}}>Це складно</strong>, але ефективність цього методу
                                доведена
                            </p>
                            <ul className="miniList">
                                <li><strong style={{fontWeight: 800}}>День 1</strong> → Оцінка рівня + Правило 1</li>
                                <li><strong style={{fontWeight: 800}}>День 2</strong> → Правило 2 + повторення
                                    попередніх
                                </li>
                                <li>…</li>
                                <li><strong style={{fontWeight: 800}}>День 7</strong> → Правило 7 + мікс з попередніх
                                    правил
                                </li>
                            </ul>

                            <div className="heroBtns">
                                <button className="primaryBtn" onClick={startFreeDay1} disabled={ctaLoading}>
                                    {ctaLoading ? "Відкриваю..." : "Оцінити рівень і почати марафон"}
                                </button>
                                <button className="secondaryBtn" onClick={() => scrollTo("how")}>
                                    Як це працює?
                                </button>
                            </div>
                        </div>

                        <div className="handPointerWrap desktop" style={{}}>
                            <img src={handPict} className="handPointer" alt=""/>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider"/>

            {/* INSIDE */}
            <section className="section" id="inside">
                <div className="sectionInner">
                    <h2 className="sectionTitle">Що всередині марафону</h2>
                    <p className="sectionLead">
                        Кожен день — 16-34 речення на переклад з української на англійську. Миттєвий фідбек по помилкам.
                        Також додаткова практика там, де часто помиляєшся: маєш закрити прогалини до дедлайну. Після виконання завдань, можеш тренуватися скільки завгодно до кінця дня у вільному режимі.
                    </p>

                    <div className="featuresGrid">
                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand3} className="featureIcon" alt="" />
                                <div className="featureTitle">Вивчені правила</div>
                            </div>
                            <p className="featureText">
                                По 1 новому правилу щодня - кожне має бути надійно вивчене, інакше вибуваєш з марафону.
                            </p>
                        </div>

                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand1} className="featureIcon" alt="" />
                                <div className="featureTitle">Практика перекладу</div>
                            </div>
                            <p className="featureText">
                                Українська → англійська. Миттєвий фідбек і пояснення “чому так”, щоб помилка більше не повторювалась.
                            </p>
                        </div>

                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand2} className="featureIcon" alt="" />
                                <div className="featureTitle">Повторення щодня</div>
                            </div>
                            <p className="featureText">
                                Кожен наступний день містить короткий мікс попередніх правил — інтервальна методика з доведеною ефективністю.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* HOW */}
            <section className="section" id="how">
                <div className="sectionInner">
                    <h2 className="sectionTitle">Як працює марафон</h2>
                    <p className="sectionLead">
                        Ти не просто “робиш” якісь завдання. Ти перекладаєш, з української на англійську — і відпрацьовуєш кожне правило на практиці поки не запамʼятаєш як правильно.
                    </p>

                    <div className="howGrid">

                        <div className="stepsCard">
                            <div className="step">
                                <div className="stepNum">1</div>
                                <div>
                                    <p className="stepTitle">День 1</p>
                                    <p className="stepText">Оцінка рівня і правило #1: <strong
                                        style={{fontWeight: 800}}>16+ речень</strong> для перекладу</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="stepNum">2</div>
                                <div>
                                    <p className="stepTitle">День 2</p>
                                    <p className="stepText">Правило #2: <strong style={{fontWeight: 800}}>16+ речень</strong> і
                                        повторення</p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="stepNum">…</div>
                                <div>
                                    <p className="stepTitle">Дні 4–7</p>
                                    <p className="stepText">Нове правило + мікс попередніх</p>
                                </div>
                            </div>

                            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <button className="primaryBtn" onClick={startFreeDay1} disabled={ctaLoading}>
                                    {ctaLoading ? "Відкриваю..." : "Оцінити рівень і почати марафон"}
                                </button>
                                <button className="secondaryBtn" onClick={() => scrollTo("price")}>
                                    Ціна і умови
                                </button>
                            </div>
                        </div>

                        <div className="videoBox">
                            {/* Replace with your marathon preview video if you have one */}
                            <img
                                src={marathonPict}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider" />

             {/*PRICE + TERMS */}
            <section className="section" id="price">
                <div className="sectionInner">
                    <h2 className="sectionTitle">Скільки це коштує</h2>

                    <div style={{marginTop: 18}} className="stepsCard">
                        <p className="stepTitle" style={{margin: 0}}>
                            Умови коротко
                        </p>
                        <ul className="miniList" style={{marginTop: 10}}>
                            <li>Безкоштовна оцінка рівня і коротка щоденна практика</li>
                            <li>Інтенсивний марафон: 500 грн / 7 днів.</li>
                            <li>Пропуск дня закриває марафон - навчання безкомпромісне але дієве; можна стартувати з наступного циклу.
                            </li>
                        </ul>

                        <div style={{marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap"}}>
                            <button className="primaryBtn" onClick={startFreeDay1} disabled={ctaLoading}>
                                {ctaLoading ? "Відкриваю..." : "Оцінити рівень і почати марафон"}
                            </button>
                            <button className="secondaryBtn" onClick={() => setTouOpen(true)}>
                                Умови використання
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider"/>

            {/* SOCIAL PROOF */}
            <section className="section" id="proof">
                <div className="sectionInner">
                    <h2 className="sectionTitle">Що кажуть учасники</h2>

                    <div className="testimonialsGrid">
                        <div className="quoteCard">
                            <p className="quote">“Було важко, але я реально стала краще розмовляти!”</p>
                            <p className="quoteAuthor">— Оля</p>
                        </div>

                        <div className="quoteCard">
                            <p className="quote">“Як на мене, переклад — це найдієвіше. Ще супер, що показує аналітику і можеш працювати з помилками”</p>
                            <p className="quoteAuthor">— Андрій</p>
                        </div>

                        <div className="quoteCard">
                            <p className="quote">“Я задоволена! Хоч іноді було дійсно складно, я почуваюся значно впевненіше в деяких заплутаних правилах, типу second/third conditional”</p>
                            <p className="quoteAuthor">— Марина</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footerInner">
                    <div className="footerLeft">
                        © 2026 GoodLang •{" "}
                        <a className="plainLink" href="mailto:goodlang.app@gmail.com">
                            goodlang.app@gmail.com
                        </a>
                    </div>

                    <div className="footerLink" onClick={() => setTouOpen(true)}>
                        Умови використання і політика приватності
                    </div>
                </div>
            </footer>

            {touOpen && <TermsOfUseModal readOnly theme={theme} onClose={() => setTouOpen(false)} />}
        </>
    );
}

/**
 * ✅ ACTION_TYPES you should add (or map to existing ones):
 *
 * BUTTON_CLICK_MARATHON_START_FREE_DAY1
 * BUTTON_CLICK_MARATHON_PROMO_REQUEST
 */
