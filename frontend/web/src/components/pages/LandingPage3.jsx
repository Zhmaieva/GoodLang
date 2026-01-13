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

export default function LandingPage3({theme}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState("");

    const hasScrolledRef = useRef(false);

    const [touOpen, setTouOpen] = React.useState(false);

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

    const startUsing = async () => {
        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_USING);

        setTimeout(() => {
            navigate("/");
        }, 200);
    }

    const submitEmail = async () => {
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

    return (
        <>
            <style>{`
        * { box-sizing: border-box; }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          overflow-y: auto;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        }
        
        html {
  scroll-behavior: smooth;
}

        /* ---------- HERO ---------- */
        .landing {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100vw;
          min-height: 100vh;
        }

        .left {
          background: #fe6037;
          padding: 56px 48px;
          display: flex;
          align-items: center;
        }

        .textBlock { max-width: 520px; }

        .right {
          position: relative;
          background: #fff4de;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 52px;
        }

        .title {
          margin: 0;
          font-size: clamp(24px, 6vw, 52px);
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #111;
        }

        .title em {
          font-family: Nunito, ui-sans-serif, system-ui;
          font-style: italic;
          font-weight: 200;
        }
        
        .ctaTitle em {
          font-family: Nunito, ui-sans-serif, system-ui;
          font-style: italic;
          font-weight: 200;
        }

        .ctaWrap {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
        }

        .cta {
          font-size: 24px;
          font-weight: 700;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 6px;
          color: #111;
          z-index: 2;
        }

        .hand {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(12px);
          height: 250px;
          pointer-events: none;
        }
        
        /* ---------- TOP NAV (RIGHT HERO) ---------- */
.topNav {
  position: absolute;
  top: 24px;
  right: 32px;
  display: flex;
  gap: 20px;
  z-index: 3;
}

.topNavBtn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  font-size: 14px;
  font-weight: 500;              /* 👈 не такі жирні */
  font-family: Nunito, ui-sans-serif, system-ui;

  color: #111;
  text-decoration: underline;
  text-underline-offset: 5px;
  text-decoration-thickness: 1px;

  opacity: 0.85;
}

.topNavBtn:hover {
  opacity: 1;
}

.topNavBtn:focus-visible {
  outline: 2px solid rgba(0,0,0,0.3);
  outline-offset: 4px;
}


        /* ---------- BLACK DIVIDER ---------- */
        .divider {
          width: 100%;
          height: 2px;
          background: #000;
        }

        /* ---------- FEATURES ---------- */
        .features {
          width: 100%;
          background: #fff4de;
          display: flex;
          justify-content: center;
          padding: 56px 16px;
        }

        .featuresInner {
          width: min(1100px, 100%);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .featureCard {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          width: 70%;
          margin: 0 auto;
        }

        .featureIcon {
          height: clamp(56px, 6vw, 88px);
          width: 70%;
          object-fit: contain;
          margin: 0 auto 4px auto;
        }

        .featureTitle {
          font-weight: 800;
          font-size: 18px;
          font-family: Nunito;
        }

        .featureText {
          margin: 0;
          color: #3a2a1d;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.3;
          font-family: Nunito;
        }

        /* ---------- ORANGE BLOCK ---------- */
        .orangeBlock {
          width: 100%;
          background: #fe6037;
          display: flex;
          justify-content: center;
          padding: 64px 16px;
        }

        .testimonialsInner {
  width: min(1100px, 100%);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  justify-items: center;            /* ✅ центрує картки в колонках */
}

.testimonialCard {
  position: relative;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 15px;

  width: min(350px, 100%);          /* ✅ “фіксована” ширина в межах */
  max-width: 330px;                 /* ✅ щоб не роздувалось */
}

.bubbleBg {
  position: absolute;
  inset: -18px -22px;        /* “поля” бульбашки */
  width: calc(100% + 44px);
  height: calc(100% + 36px);
  object-fit: fill;          /* ✅ розтягує картинку під висоту/ширину */
  z-index: 0;
  pointer-events: none;
}

/* весь контент поверх */
.testimonialCard > .content {
  position: relative;
  z-index: 1;
}

/* ---------- DIVIDER ---------- */
.sectionDivider {
  width: 100%;
  height: 2px;
  background: #000;
}

/* ---------- CTA SECTION ---------- */
.ctaSection {
  background: #fff4de;
  display: flex;
  justify-content: center;
  padding: 56px 16px;
  text-align: left;
}

.ctaInner {
  width: min(1100px, 100%);
}

.ctaContent {
  width: 100%;
  max-width: 1100px;   /* 👈 зроби 900/1000/1100 як хочеш */
  margin: 0 auto;      /* 👈 щоб виглядало акуратно, коли дуже широко */
  display: flex;
  flex-direction: column;
  gap: 18px;
}


/* щоб інпут точно не роздував ряд */
.promoRow .emailInput { min-width: 0; }

/* ---------- MOBILE ---------- */
@media (max-width: 600px) {
  .ctaSection { padding: 40px 16px; }
  .ctaInner { justify-content: center; }   /* на мобілці приємніше */
}
@media (max-width: 820px) {
  .secondaryBtn { width: 100%; }
}

/* Typography tweaks (optional, “доросліше”) */
.ctaTitle {
  max-width: 560px;
}

.ctaButtons,
.promoRow {
  max-width: 1160px;
  width: 100%;
}

.ctaButtons { width: 100%; }

.primaryBtn { width: 100%; text-align: left; }  /* якщо хочеш “доросліше” */
.primaryBtn { justify-content: flex-start; }     /* якщо зробиш display:flex */

/* PROMO ROW already ok, just ensure full width in this column */
.promoRow { width: 100%; }

/* ---------- MOBILE ---------- */
@media (max-width: 600px) {
  .ctaSection { padding: 40px 16px; }
  .ctaInner { justify-content: center; }   /* ✅ щоб не було “прилипання” до краю */
  .ctaContent { width: min(520px, 100%); }
}

.ctaSubtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.85;
}

/* ---------- BUTTONS (GOODLANG STYLE) ---------- */
.ctaButtons {
  display: flex;
  width: 100%;          /* 👈 важливо */
}

.promoBtn {
  background: #fe6037;
  color: #000;
  border: 2px solid #000;
  border-radius: 14px;
  padding: 12px 20px;
  font-family: Nunito, ui-sans-serif, system-ui;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 3px 0 #000;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.promoBtn:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 0 #000;
}

.promoBtn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #000;
}

.ctaButtons .primaryBtn {
  width: 100%;          /* 👈 кнопка на всю ширину */
  text-align: center;
}
.primaryBtn,
.secondaryBtn {
  height: 100%;
  border: 2px solid #000;
  border-radius: 14px;
  padding: 12px 20px;
  font-family: Nunito, ui-sans-serif, system-ui;
  font-weight: 800;
  letter-spacing: 0.2px;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
  box-shadow: 0 3px 0 #000;           /* “pressed print” */
  user-select: none;
}

.primaryBtn {
  background: #fe6037;
  color: #000;
  padding: 13px 26px;                 /* трохи більша як головна CTA */
  font-size: 16px;
}

.primaryBtn:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #000; }
.primaryBtn:active { transform: translateY(3px); box-shadow: 0 1px 0 #000; }

.secondaryBtn {
  background: #fff;
  color: #111;
  font-size: 14px;
}

.secondaryBtn:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #000; }
.secondaryBtn:active { transform: translateY(3px); box-shadow: 0 1px 0 #000; }

.primaryBtn:focus-visible,
.secondaryBtn:focus-visible {
  outline: 3px solid rgba(0,0,0,0.35);
  outline-offset: 3px;
}

/* disabled state (на майбутнє) */
.primaryBtn:disabled,
.secondaryBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 3px 0 #000;
}

.emailInput {
  padding: 12px 14px;
  font-family: Nunito, ui-sans-serif, system-ui;
  font-weight: 800;
  border: 2px solid #000;
  border-radius: 14px;
  min-width: 160px;
  box-shadow: 0 3px 0 #000;
}

.emailInput:focus {
  outline: none;
}

.emailInput:focus-visible {
  outline: 3px solid rgba(0,0,0,0.35);
  outline-offset: 3px;
}

/* ---------- PROMO ROW ---------- */
.promoRow {
  display: flex;
  gap: 12px;
  width: 100%;          /* 👈 важливо */
  align-items: stretch;
}

.promoRow .emailInput {
  flex: 1;              /* 👈 інпут займає весь доступний простір */
  min-width: 0;         /* 👈 щоб не ламав flex */
}

.promoRow .promoBtn {
  flex-shrink: 0;       /* 👈 кнопка НЕ стискається */
  white-space: nowrap; /* 👈 текст не ламається */
}

.emailInput {
  padding: 12px 14px;
  font-size: 16px;
  border: 2px solid #000;
}

.secondaryBtn {
  background: #fff;
  border: 2px solid #000;
  padding: 12px 20px;
  font-size: 14px;
  cursor: pointer;
}

.secondaryBtn:hover {
  background: #f2f2f2;
}

/* ---------- FOOTER ---------- */
.footer {
  width: 100%;
  background: #fe6037;
  display: flex;
  justify-content: center;
  padding: 14px 16px;        /* 👈 вузенький */
  border-top: 2px solid #000;
}

.footerInner {
  width: min(1100px, 100%);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-family: Nunito, ui-sans-serif, system-ui;
  color: #000;
}

.footerLeft {
  opacity: 0.9;
}

.footerLink {
  font-weight: 800;          /* 👈 жирним */
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
}

.footerLink:hover {
  opacity: 0.8;
}

/* ---------- MOBILE ---------- */
@media (max-width: 600px) {
  .footerInner {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}

/* ---------- MOBILE ---------- */
@media (max-width: 600px) {
  .ctaTitle {
    font-size: 22px;
  }

  .promoRow {
    width: 100%;
  }

  .emailInput {
    max-width: 320px;
    min-width: 0px;
  }
  
  .secondaryBtn {
    max-width: 150px;
  }
}

        /* 👇 message bubble behind */
        .testimonialCard::before {
  content: "";
  position: absolute;
  inset: -18px -22px;
  background-repeat: no-repeat;
  background-size: contain;
  z-index: 0;
  pointer-events: none;
}

/* LEFT */
.testimonialCard.isLeft::before {
  background-image: url(${messageLeft2});
  background-position: top left;
}

/* CENTER */
.testimonialCard.isCenter::before {
  background-image: url(${messageCenter2});
  background-position: top center;
}

/* RIGHT */
.testimonialCard.isRight::before {
  background-image: url(${messageRight2});
  background-position: top right;
}

        .testimonialCard > * {
          position: relative;
          z-index: 1;
        }

        .tHead {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .plainLink {
            color: inherit;
            text-decoration: none;
        }

        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #111;
          color: #fff;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 13px;
          font-family: Nunito;
        }

        .tName {
          font-weight: 800;
          font-size: 14px;
          font-family: Nunito;
        }

        .tQuote {
          margin: 0;
          font-size: 14px;
          line-height: 1.35;
          font-family: Nunito;
          font-weight: 300;
        }

        .tQuote em { font-style: italic; }

        /* ---------- Responsive ---------- */
        @media (max-width: 1050px) {
  .featuresInner,
  .testimonialsInner {
    grid-template-columns: repeat(2, 1fr);
  }
}

        @media (max-width: 900px) {
          .landing { grid-template-columns: 1fr; }

          .featuresInner,
          .testimonialsInner {
    grid-template-columns: 1fr;
    justify-items: center;          /* ✅ картка по центру */
  }

  .testimonialCard {
    width: min(360px, 92vw);        /* ✅ на мобілці не ширше bubble */
    max-width: 360px;
  }

          .hand { height: 180px; }
          
          .right { 
            min-height: 200px; 
            align-items: start;
          }
          
          .ctaWrap {
            margin-top: 24px;
        }

      `}</style>

            {/* HERO */}
            <section className="landing">
                <div className="left">
                    <div className="textBlock">
                        <h1 className="title">
                            Твій особистий<br/>
                            репетитор<br/>
                            з англійської,<br/>
                            <em>який завжди з тобою.</em>
                        </h1>
                    </div>
                </div>

                <div className="right">
                    <div className="topNav">
                        <button
                            className="topNavBtn"
                            onClick={() => {
                                document.getElementById("approach")?.scrollIntoView({behavior: "smooth"});
                            }}
                        >
                            наш підхід
                        </button>

                        <button
                            className="topNavBtn"
                            onClick={() => {
                                document.getElementById("testimonials")?.scrollIntoView({behavior: "smooth"});
                            }}
                        >
                            відгуки
                        </button>

                        <button
                            className="topNavBtn"
                            onClick={() => {
                                document.getElementById("join")?.scrollIntoView({behavior: "smooth"});
                            }}
                        >
                            приєднатися
                        </button>
                    </div>

                    <div className="ctaWrap">
                        <button
                            onClick={startUsing}
                            className="cta"
                        >
                            почати зараз
                        </button>
                        <img src={handPict} alt="" className="hand"/>
                    </div>

                </div>
            </section>

            <div className="divider"/>

            {/* FEATURES */}
            <section className="features" id="approach">
                <div className="featuresInner">
                    <div className="featureCard">
                        <img src={hand3} className="featureIcon"/>
                        <div className="featureTitle">Переклад</div>
                        <p className="featureText">Перекладай речення з<br/>української на англійську</p>
                    </div>

                    <div className="featureCard">
                        <img src={hand1} className="featureIcon"/>
                        <div className="featureTitle">Фідбек</div>
                        <p className="featureText">Дізнайся, де саме ти помилився,<br/>з поясненням і прикладами</p>
                    </div>

                    <div className="featureCard">
                        <img src={hand2} className="featureIcon"/>
                        <div className="featureTitle">Нове речення</div>
                        <p className="featureText">Наступне речення підібране<br/>з урахуванням твого рівня</p>
                    </div>
                </div>
            </section>

            <div className="divider"/>

            {/* TESTIMONIALS */}
            <section className="orangeBlock" id="testimonials">
                <div className="testimonialsInner">
                    <div className="testimonialCard isLeft">
                        <div className="tHead">
                            <div className="avatar">І</div>
                            <div className="tName">Іванна</div>
                        </div>
                        <p className="tQuote">
                            <em>"Мені не вистачає занять з репетитором. А з GoodLang я додатково практикуюся
                                самостійно."</em>
                        </p>
                    </div>

                    <div className="testimonialCard isCenter">
                        <div className="tHead">
                            <div className="avatar">В</div>
                            <div className="tName">Влад</div>
                        </div>
                        <p className="tQuote">
                            <em>"Займаюся щодня по дорозі на роботу. Не маю часу на репетитора, GoodLang дає фідбек і
                                розуміння, що практикувати."</em>
                        </p>
                    </div>

                    <div className="testimonialCard isRight">
                        <div className="tHead">
                            <div className="avatar">М</div>
                            <div className="tName">Максим</div>
                        </div>
                        <p className="tQuote">
                            <em>"Подобається, бо переклад — складно, але дуже ефективно. Використовував GoodLang для
                                підготовки до IELTS."</em>
                        </p>
                    </div>
                </div>
            </section>
            <div className="sectionDivider"/>

            {/* ---------- CTA SECTION ---------- */}
            <section className="ctaSection" id="join">
                <div className="ctaInner">
                    <div className="ctaContent">
                        <h2 className="ctaTitle">
                            Приєднуйся до <em>GoodLang</em> вже сьогодні
                        </h2>

                        <div className="ctaButtons">
                            <button onClick={startUsing} className="primaryBtn">
                                Почни вчитися зараз — без реєстрації
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
                                className="secondaryBtn"
                                disabled={sending}
                            >
                                {sending ? "Відправляю..." : "Отримати промокод"}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {/* ---------- FOOTER ---------- */}
            <footer className="footer">
                <div className="footerInner">
                    <div className="footerLeft">
                        © 2025–2026 GoodLang • <a className="plainLink" href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a>
                    </div>

                    <div
                        className="footerLink"
                        onClick={() => setTouOpen(true)}
                    >
                        Умови використання і політика приватності
                    </div>
                </div>
            </footer>

            {touOpen && (
                <TermsOfUseModal
                    readOnly
                    theme={theme}
                    onClose={() => setTouOpen(false)}
                />
            )}
        </>
    );
}
