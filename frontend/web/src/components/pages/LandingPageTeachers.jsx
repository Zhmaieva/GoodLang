import handPict from "../../../public/handPict.PNG";
import hand2 from "../../../public/hand2.PNG";
import hand1 from "../../../public/hand1.PNG";
import hand3 from "../../../public/hand3.PNG";
import messageRight from "../../../public/messageRight.png";
import messageCenter from "../../../public/messageCenter.png";
import messageLeft from "../../../public/messageLeft.png";
import {useNavigate} from "react-router-dom";


export default function Landing() {
    const navigate = useNavigate();

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
        }

        .testimonialCard {
  position: relative;
  padding: 22px 24px;        /* трохи більше повітря */
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
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
  background-image: url(${messageLeft});
  background-position: top left;
}

/* CENTER */
.testimonialCard.isCenter::before {
  background-image: url(${messageCenter});
  background-position: top center;
}

/* RIGHT */
.testimonialCard.isRight::before {
  background-image: url(${messageRight});
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
        @media (max-width: 900px) {
          .landing { grid-template-columns: 1fr; }

          .featuresInner,
          .testimonialsInner {
            grid-template-columns: 1fr;
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
                    <div className="ctaWrap">
                        <button onClick={() => {
                            navigate('/');
                        }} className="cta">почати зараз</button>
                        <img src={handPict} alt="" className="hand"/>
                    </div>
                </div>
            </section>

            <div className="divider"/>

            {/* FEATURES */}
            <section className="features">
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
            <section className="orangeBlock">
                <div className="testimonialsInner">
                    <div className="testimonialCard isLeft">
                        <div className="tHead">
                            <div className="avatar">І</div>
                            <div className="tName">Іванна</div>
                        </div>
                        <p className="tQuote">
                            <em>"Для мене, на відміну від усіх інших форм завдань, повторюваний переклад дійсно
                                працює."</em>
                        </p>
                    </div>

                    <div className="testimonialCard isCenter">
                        <div className="tHead">
                            <div className="avatar">В</div>
                            <div className="tName">Влад</div>
                        </div>
                        <p className="tQuote">
                            <em>"У мене раніше було відчуття, що іноді я знаю англійську на C1, а інколи два слова не
                                можу зв'язати."</em>
                        </p>
                    </div>

                    <div className="testimonialCard isRight">
                        <div className="tHead">
                            <div className="avatar">М</div>
                            <div className="tName">Максим</div>
                        </div>
                        <p className="tQuote">
                            <em>"Я реально бачу прогрес, а не гадаю, чи став кращим в англійській."</em>
                        </p>
                    </div>
                </div>
            </section>

        </>
    );
}
