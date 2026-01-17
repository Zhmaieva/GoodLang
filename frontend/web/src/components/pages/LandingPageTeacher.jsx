import handPict from "../../../public/handPict.PNG";
import hand2 from "../../../public/hand2.PNG";
import hand1 from "../../../public/hand1.PNG";
import hand3 from "../../../public/hand3.PNG";
import messageRight2 from "../../../public/messageRight2.png";
import messageCenter2 from "../../../public/messageCenter2.png";
import messageLeft2 from "../../../public/messageLeft2.png";
import {useNavigate} from "react-router-dom";
import TermsOfUseModal from "../subscription/TermsOfUseModal.jsx";
import React, {useEffect, useRef, useState} from "react";
import {callAccountVerifyApi, callSendPromoCodeApi} from "../../services/api.js";
import {ACTION_TYPES} from "../../utils/constants.js";

export default function LandingPageTeacher({theme}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState("");
    const [touOpen, setTouOpen] = React.useState(false);

    const hasScrolledRef = useRef(false);

    const startUsing = async () => {
        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_USING_TEACHER_APP);
        setTimeout(() => navigate("/"), 200);
    };

    const goToRules = async () => {
        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_USING_TEACHER_PDF);
        setTimeout(() => navigate("/analytics"), 200);
    };

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
.divider,
.sectionDivider{
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
  background: var(--accent);
  padding: 56px 48px;
  display: flex;
  align-items: center;
}
.textBlock{ max-width: 560px; }

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
  color: var(--muted);
  max-width: 520px;
}

/* right hero */
.right{
  position: relative;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* ✅ відступ під topNav без "200px" */
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

/* hand under card */
.handPointerWrap{
  width: 100%;
  margin-top: 8px;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.handPointer{
  width: 74px;     /* ✅ менша рука */
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
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
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
.primaryBtn:focus-visible,
.secondaryBtn:focus-visible{
  outline: 3px solid rgba(0,0,0,0.35);
  outline-offset: 3px;
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
  max-width: 760px;
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
   HOW TO DOWNLOAD
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

.gifPlaceholder{
  border: var(--border);
  box-shadow: var(--shadow);
  background: #000;            /* better behind video */
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: var(--radius);
  overflow: hidden;            /* ✅ important */
  display: flex;
}

.howVideo{
  width: 100%;
  height: 100%;
  object-fit: cover;           /* or "contain" if you want full video visible */
  display: block;
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
}

.ctaButtons{
  display: flex;
  width: 100%;
  gap: 10px;
  align-items: stretch;
}
.ctaButtons > button{ flex: 1; }

/* promo row */
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
   RESPONSIVE (ONE PLACE)
========================= */
@media (max-width: 1050px){
  .featuresGrid{ grid-template-columns: repeat(2, 1fr); }
  .howGrid{ grid-template-columns: 1fr; }
  .gifPlaceholder{ aspect-ratio: 1 / 1; }
}

@media (max-width: 1150px){
  .landing{ grid-template-columns: 1fr; }
  .right{
    align-items: center;
    padding: 72px 16px 24px 16px; /* ✅ компактніше */
  }
  .topNav{
    right: 18px;
    left: 18px;
    justify-content: space-between;
    gap: 12px;
  }
  .handPointer{ width: 64px; }
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
                <div className="left">
                    <div className="textBlock">
                        <h1 className="title">
                            Безкоштовні PDF<br />
                            з вправами<br/>
                            на переклад<br />
                            англійською<br />
                            <em>для уроків</em><br />
                            <em>і домашніх завдань</em>
                        </h1>

                        <p className="subtitle">
                            Якщо ви зараз проходите конкретну граматичну конструкцію і потребуєте готових завдань
                            “укр → англ” — просто скачайте їх у GoodLang. Безкоштовно.
                        </p>
                    </div>
                </div>

                <div className="right">
                    <div className="topNav">
                        <button
                            className="topNavBtn"
                            onClick={() => document.getElementById("inside")?.scrollIntoView({behavior: "smooth"})}
                        >
                            що всередині
                        </button>

                        <button
                            className="topNavBtn"
                            onClick={() => document.getElementById("download")?.scrollIntoView({behavior: "smooth"})}
                        >
                            як скачати
                        </button>

                        <button
                            className="topNavBtn"
                            onClick={() => document.getElementById("join")?.scrollIntoView({behavior: "smooth"})}
                        >
                            приєднатися
                        </button>
                    </div>

                    <div className="heroStack">
                        <div className="heroCard">
                            <h3 className="heroCardTitle">Понад 700 завдань з граматики</h3>
                            <p className="heroCardText">
                                Оберіть правило → скачайте PDF → дайте учням перекладати з української на англійську.
                                У файлі є ключі для швидкої перевірки.
                            </p>

                            <div className="heroBtns">
                                <button className="primaryBtn"
                                        onClick={goToRules}>
                                    Скачати
                                </button>
                                <button className="secondaryBtn"
                                        onClick={() => document.getElementById("download")?.scrollIntoView({behavior: "smooth"})}>
                                    Дізнатися більше
                                </button>
                            </div>
                        </div>
                        <div className="handPointerWrap">
                            <img src={handPict} className="handPointer" alt=""/>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider"/>

            {/* WHAT'S INSIDE */}
            <section className="section" id="inside">
                <div className="sectionInner">
                    <h2 className="sectionTitle">Що всередині кожного PDF</h2>
                    <p className="sectionLead">
                        Кожен файл — це готовий пакет матеріалів для конкретної граматики. Всього 3 аркуші: теорія, практика і відповіді.
                    </p>

                    <div className="featuresGrid">
                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand3} className="featureIcon" alt=""/>
                                <div className="featureTitle">Правило + приклади</div>
                            </div>
                            <p className="featureText">
                            Стисле пояснення граматичної конструкції та зразки правильних речень.
                            </p>
                        </div>

                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand1} className="featureIcon" alt="" />
                                <div className="featureTitle">Типові помилки учнів</div>
                            </div>
                            <p className="featureText">
                                Найчастіші “пастки” саме для цієї теми — щоб швидко підсвітити учням, на що звернути увагу.
                            </p>
                        </div>

                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand2} className="featureIcon" alt="" />
                                <div className="featureTitle">Вправи + ключі</div>
                            </div>
                            <p className="featureText">
                                Українські речення для перекладу на англійську + англійські ключі для самоперевірки або швидкої перевірки вчителем.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* HOW TO DOWNLOAD */}
            <section className="section" id="download">
                <div className="sectionInner">
                    <h2 className="sectionTitle">Як скачати PDF (2 зручні способи)</h2>
                    <p className="sectionLead">
                        Обирайте як зручніше: з загального списку правил або зі сторінки конкретного правила.
                    </p>

                    <div className="howGrid">
                        <div className="stepsCard">
                            <div className="step">
                                <div className="stepNum">1</div>
                                <div>
                                    <p className="stepTitle">Зі сторінки списку правил</p>
                                    <p className="stepText">
                                        Перейдіть у список правил і натисніть на іконку “скачати” біля потрібного
                                        правила.
                                    </p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="stepNum">2</div>
                                <div>
                                    <p className="stepTitle">Зі сторінки конкретного правила</p>
                                    <p className="stepText">
                                        Відкрийте правило → натисніть кнопку <strong>“Роздрукувати
                                        завдання”</strong> (PDF сформується та стягнеться).
                                    </p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="stepNum">✓</div>
                                <div>
                                    <p className="stepTitle">Готово</p>
                                    <p className="stepText">
                                        Використовуйте як домашку або роботу в класі — без підготовки з вашого боку.
                                    </p>
                                </div>
                            </div>

                            <div style={{marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap"}}>
                                <button className="primaryBtn" onClick={goToRules}>
                                    Почати користуватися
                                </button>
                                {/*<button className="secondaryBtn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>*/}
                                {/*    На початок*/}
                                {/*</button>*/}
                            </div>
                        </div>

                        {/* ✅ PINK PLACEHOLDER FOR GIF */}
                        <div className="gifPlaceholder">
                            <video
                                className="howVideo"
                                src="https://d1bhp94ins4f62.cloudfront.net/goodlang/HowToPdf2.mp4"
                                poster="../../../public/poster.png"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        </div>

                    </div>
                </div>
            </section>

            <div className="divider"/>

            {/* CTA SECTION */}
            <section className="ctaSection" id="join">
                <div className="ctaInner">
                    <div className="ctaContent">
                        <h2 className="ctaTitle">
                            Хочете ще більше матеріалів у <em>GoodLang</em>
                        </h2>

                        <p className="ctaSubtitle">
                            Якщо вашим учням потрібна додаткова щоденна практика, вони можуть користуватися GoodLang для самостійної роботи.
                        </p>

                        <div className="ctaButtons">
                            <button onClick={startUsing} className="primaryBtn">
                                Почати тренування на сайті
                            </button>
                            <button onClick={goToRules} className="secondaryBtn">
                                Перейти до правил і PDF
                            </button>
                        </div>

                        <div className="promoRow">
                            <div style={{flex: 1, display: "flex", flexDirection: "column", gap: 6}}>
                                <input
                                    type="email"
                                    placeholder="Введи email для промокоду"
                                    className="emailInput"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    inputMode="email"
                                    onKeyDown={async (e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            await submitEmail();
                                        }
                                    }}
                                    disabled={sending}
                                />

                                {msg ? (
                                    <p style={{
                                        margin: 0,
                                        fontFamily: "Nunito",
                                        fontWeight: 800,
                                        fontSize: 13,
                                        opacity: 0.9
                                    }}>
                                        {msg}
                                    </p>
                                ) : null}
                            </div>

                            <button
                                onClick={submitEmail}
                                className="secondaryBtn promoBtnOrange"
                                disabled={sending}
                            >
                                {sending ? "Відправляю..." : "Отримати промокод"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footerInner">
                    <div className="footerLeft">
                        © 2025–2026 GoodLang •{" "}
                        <a className="plainLink" href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a>
                    </div>

                    <div className="footerLink" onClick={() => setTouOpen(true)}>
                        Умови використання і політика приватності
                    </div>
                </div>
            </footer>

            {touOpen && (
                <TermsOfUseModal readOnly theme={theme} onClose={() => setTouOpen(false)} />
            )}
        </>
    );
}
