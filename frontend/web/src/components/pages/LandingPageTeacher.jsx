import handPict from "../../../public/handPict.PNG";
import hand2 from "../../../public/hand2.PNG";
import hand1 from "../../../public/hand1.PNG";
import hand3 from "../../../public/hand3.PNG";
import messageRight2 from "../../../public/messageRight2.png";
import messageCenter2 from "../../../public/messageCenter2.png";
import messageLeft2 from "../../../public/messageLeft2.png";
import {useNavigate} from "react-router-dom";
import TermsOfUseModal from "../subscription/TermsOfUseModal.jsx";
import React, {useState} from "react";
import {callAccountVerifyApi, callSendPromoCodeApi} from "../../services/api.js";
import {ACTION_TYPES} from "../../utils/constants.js";

export default function LandingPageTeacher({theme}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState("");
    const [touOpen, setTouOpen] = React.useState(false);

    const startUsing = async () => {
        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_USING);
        setTimeout(() => navigate("/"), 200);
    };

    const goToRules = () => {
        // ✅ зміни маршрут, якщо в тебе інший
        navigate("/rules");
    };

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

        html { scroll-behavior: smooth; }

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

        .textBlock { max-width: 560px; }

        .right {
          position: relative;
          background: #fff4de;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 52px 24px 24px 24px;
        }

        .title {
          margin: 0;
          font-size: clamp(24px, 6vw, 44px);
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

        .subtitle {
          margin: 16px 0 0 0;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-size: 16px;
          line-height: 1.35;
          font-weight: 300;
          color: rgba(0,0,0,0.88);
          max-width: 520px;
        }

        /* ---------- TOP NAV (RIGHT HERO) ---------- */
        .topNav {
          position: absolute;
          top: 24px;
          right: 32px;
          display: flex;
          gap: 20px;
          z-index: 3;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .topNavBtn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          font-family: Nunito, ui-sans-serif, system-ui;
          color: #111;
          text-decoration: underline;
          text-underline-offset: 5px;
          text-decoration-thickness: 1px;
          opacity: 0.85;
          white-space: nowrap;
        }

        .topNavBtn:hover { opacity: 1; }

        .topNavBtn:focus-visible {
          outline: 2px solid rgba(0,0,0,0.3);
          outline-offset: 4px;
        }

        /* ---------- HERO CTA (right) ---------- */
        .heroCard {
          width: min(520px, 92vw);
          border: 2px solid #000;
          box-shadow: 0 4px 0 #000;
          background: #fff;
          padding: 22px 22px;
        }

        .heroCardTitle {
          margin: 0;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 900;
          font-size: 18px;
          letter-spacing: 0.2px;
        }

        .heroCardText {
          margin: 10px 0 0 0;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 300;
          line-height: 1.35;
          font-size: 15px;
          color: #3a2a1d;
        }

        .heroBtns {
  margin-top: 14px;
  display: flex;
  flex-direction: column; /* ✅ щоб кнопка була рядком */
  gap: 10px;
  width: 100%;
}

.heroBtns > button {
  width: 100%;            /* ✅ на всю ширину heroCard */
}

        .primaryBtn,
        .secondaryBtn {
          border: 2px solid #000;
          border-radius: 14px;
          padding: 12px 18px;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 800;
          cursor: pointer;
          transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
          box-shadow: 0 3px 0 #000;
          user-select: none;
        }

        .primaryBtn {
          background: #fe6037;
          color: #000;
          font-size: 14px;
        }

        .secondaryBtn {
          background: #fff;
          color: #111;
          font-size: 14px;
          height: 100%;
        }

        .primaryBtn:hover,
        .secondaryBtn:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #000; }
        .primaryBtn:active,
        .secondaryBtn:active { transform: translateY(3px); box-shadow: 0 1px 0 #000; }

        .primaryBtn:focus-visible,
        .secondaryBtn:focus-visible {
          outline: 3px solid rgba(0,0,0,0.35);
          outline-offset: 3px;
        }

        /* ---------- DIVIDER ---------- */
        .divider { width: 100%; height: 2px; background: #000; }

        /* ---------- SECTIONS BASE ---------- */
        .section {
          width: 100%;
          background: #fff4de;
          display: flex;
          justify-content: center;
          padding: 56px 16px;
        }

        .sectionInner {
          width: min(1100px, 100%);
        }

        .sectionTitle {
          margin: 0;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 900;
          font-size: 26px;
          letter-spacing: -0.01em;
        }

        .sectionLead {
          margin: 10px 0 0 0;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 300;
          font-size: 16px;
          line-height: 1.45;
          color: #3a2a1d;
          max-width: 760px;
        }

        /* ---------- FEATURES GRID ---------- */
        .featuresGrid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .featureCard {
          border: 2px solid #000;
          box-shadow: 0 4px 0 #000;
          background: #fff;
          padding: 18px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-height: 170px;
        }

        .featureIconRow {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .featureIcon {
          height: 42px;
          width: 42px;
          object-fit: contain;
        }

        .featureTitle {
          font-weight: 900;
          font-size: 16px;
          font-family: Nunito, ui-sans-serif, system-ui;
        }

        .featureText {
          margin: 0;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 300;
          font-size: 15px;
          line-height: 1.35;
          color: #3a2a1d;
        }

        /* ---------- HOW TO DOWNLOAD ---------- */
        .howGrid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 22px;
          align-items: start;
        }

        .stepsCard {
          border: 2px solid #000;
          box-shadow: 0 4px 0 #000;
          background: #fff;
          padding: 18px 18px;
        }

        .step {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0,0,0,0.12);
        }

        .step:last-child { border-bottom: none; }

        .stepNum {
          width: 30px;
          height: 30px;
          border: 2px solid #000;
          border-radius: 10px;
          box-shadow: 0 3px 0 #000;
          display: grid;
          place-items: center;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 900;
          background: #fff4de;
        }

        .stepTitle {
          margin: 0;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 900;
          font-size: 15px;
        }

        .stepText {
          margin: 6px 0 0 0;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 300;
          line-height: 1.35;
          color: #3a2a1d;
          font-size: 14px;
        }

        .gifPlaceholder {
          border: 2px solid #000;
          box-shadow: 0 4px 0 #000;
          background: #ff73c6; /* ✅ рожевий квадрат */
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 14px;
        }

        .gifHint {
          margin-top: 10px;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 800;
          font-size: 13px;
          opacity: 0.85;
        }

        /* ---------- TESTIMONIALS ---------- */
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
          justify-items: center;
        }

        .testimonialCard {
          position: relative;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          width: min(350px, 100%);
          max-width: 330px;
        }

        .testimonialCard::before {
          content: "";
          position: absolute;
          inset: -18px -22px;
          background-repeat: no-repeat;
          background-size: contain;
          z-index: 0;
          pointer-events: none;
        }

        .testimonialCard.isLeft::before { background-image: url(${messageLeft2}); background-position: top left; }
        .testimonialCard.isCenter::before { background-image: url(${messageCenter2}); background-position: top center; }
        .testimonialCard.isRight::before { background-image: url(${messageRight2}); background-position: top right; }

        .testimonialCard > * { position: relative; z-index: 1; }

        .tHead {
          display: flex;
          align-items: center;
          gap: 10px;
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

        .tName { font-weight: 800; font-size: 14px; font-family: Nunito; }

        .tQuote {
          margin: 0;
          font-size: 14px;
          line-height: 1.35;
          font-family: Nunito;
          font-weight: 300;
        }

        .sectionDivider { width: 100%; height: 2px; background: #000; }

        /* ---------- CTA (reuse your style) ---------- */
        .ctaSection {
          background: #fff4de;
          display: flex;
          justify-content: center;
          padding: 56px 16px;
          text-align: left;
        }

        .ctaInner { width: min(1100px, 100%); }

        .ctaContent {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .ctaTitle { margin: 0; font-family: Nunito; font-weight: 900; font-size: 26px; }
        .ctaTitle em { font-style: italic; font-weight: 200; }

        .ctaSubtitle { margin: 0; font-size: 16px; opacity: 0.85; font-family: Nunito; font-weight: 300; }

        .ctaButtons{
  display: flex;
  width: 100%;
  gap: 10px;
  flex-wrap: nowrap;      /* ✅ не переносити на десктопі */
  align-items: stretch;
}
.ctaButtons > button{
  flex: 1;                /* ✅ 50/50 */
  width: auto;            /* ✅ важливо, щоб flex працював нормально */
}

@media (max-width: 600px){
  .ctaButtons{
    flex-direction: column;
  }
  .ctaButtons > button{
    width: 100%;
  }
}

        .promoRow {
          display: flex;
          gap: 12px;
          width: 100%;
          align-items: stretch;
        }

        .emailInput {
          padding: 12px 14px;
          font-family: Nunito, ui-sans-serif, system-ui;
          font-weight: 800;
          border: 2px solid #000;
          border-radius: 14px;
          box-shadow: 0 3px 0 #000;
          flex: 1;
          min-width: 0;
          font-size: 16px;
        }

        .emailInput:focus { outline: none; }
        .emailInput:focus-visible { outline: 3px solid rgba(0,0,0,0.35); outline-offset: 3px; }

        /* ---------- FOOTER ---------- */
        .footer {
          width: 100%;
          background: #fe6037;
          display: flex;
          justify-content: center;
          padding: 14px 16px;
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

        .footerLeft { opacity: 0.9; }

        .footerLink {
          font-weight: 800;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 4px;
        }

        .footerLink:hover { opacity: 0.8; }

        .plainLink {
          color: inherit;
          text-decoration: none;
        }
        .promoBtnOrange {
  background: #fe6037;
  color: #000;
  border: 2px solid #000;
}

.promoBtnOrange:hover { transform: translateY(-1px); box-shadow: 0 5px 0 #000; }
.promoBtnOrange:active { transform: translateY(3px); box-shadow: 0 1px 0 #000; }

        /* ---------- Responsive ---------- */
        @media (max-width: 1050px) {
          .featuresGrid { grid-template-columns: repeat(2, 1fr); }
          .testimonialsInner { grid-template-columns: repeat(2, 1fr); }
          .howGrid { grid-template-columns: 1fr; }
          .gifPlaceholder { aspect-ratio: 16 / 10; }
        }

        @media (max-width: 900px) {
          .landing { grid-template-columns: 1fr; }
          .right { align-items: start; }
          .testimonialsInner { grid-template-columns: 1fr; justify-items: center; }
          .testimonialCard { width: min(360px, 92vw); max-width: 360px; }
          .topNav { right: 18px; left: 18px; justify-content: space-between; gap: 12px; }
        }

        @media (max-width: 600px) {
          .left { padding: 44px 18px; }
          .right { padding: 62px 16px 24px 16px; }
          .promoRow { flex-direction: column; }
          .footerInner { flex-direction: column; align-items: flex-start; gap: 6px; }
        }
      `}</style>

            {/* HERO */}
            <section className="landing">
                <div className="left">
                    <div className="textBlock">
                        <h1 className="title">
                            Безкоштовні PDF<br />
                            з вправами на переклад<br />
                            <em>для уроків і домашки</em>
                        </h1>

                        <p className="subtitle">
                            Якщо ви зараз проходите конкретну граматичну конструкцію і не маєте готових завдань
                            “укр → англ” — просто скачайте їх у GoodLang. Безкоштовно.
                        </p>
                    </div>
                </div>

                <div className="right">
                    <div className="topNav">
                        <button
                            className="topNavBtn"
                            onClick={() => document.getElementById("inside")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            що всередині
                        </button>

                        <button
                            className="topNavBtn"
                            onClick={() => document.getElementById("download")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            як скачати
                        </button>

                        <button
                            className="topNavBtn"
                            onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            приєднатися
                        </button>
                    </div>

                    <div className="heroCard">
                        <h3 className="heroCardTitle">Скачати завдання під конкретне правило</h3>
                        <p className="heroCardText">
                            Оберіть правило → скачайте PDF → дайте учням перекладати з української на англійську.
                            У файлі є ключі для швидкої перевірки.
                        </p>

                        <div className="heroBtns">
                            <button className="primaryBtn" onClick={() => document.getElementById("download")?.scrollIntoView({ behavior: "smooth" })}>
                                Подивитися як скачати
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider" />

            {/* WHAT'S INSIDE */}
            <section className="section" id="inside">
                <div className="sectionInner">
                    <h2 className="sectionTitle">Що всередині кожного PDF</h2>
                    <p className="sectionLead">
                        Кожен файл — це готовий пакет матеріалів для конкретної граматики: коротко, практично і без зайвого.
                    </p>

                    <div className="featuresGrid">
                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand3} className="featureIcon" alt="" />
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
                    <h2 className="sectionTitle">Як скачати PDF (2 способи)</h2>
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
                                        Перейдіть у список правил і натисніть на іконку “скачати” біля потрібного правила.
                                    </p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="stepNum">2</div>
                                <div>
                                    <p className="stepTitle">Зі сторінки конкретного правила</p>
                                    <p className="stepText">
                                        Відкрийте правило → натисніть кнопку <strong>“Роздрукувати завдання”</strong> (PDF сформується та завантажиться).
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

                            <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <button className="primaryBtn" onClick={goToRules}>
                                    Відкрити список правил
                                </button>
                                <button className="secondaryBtn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                                    На початок
                                </button>
                            </div>
                        </div>

                        {/* ✅ PINK PLACEHOLDER FOR GIF */}
                        <div>
                            <div className="gifPlaceholder" />
                            </div>
                    </div>
                </div>
            </section>

            <div className="divider" />

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
