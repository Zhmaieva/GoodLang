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

export default function LandingCrossword({theme}) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [msg, setMsg] = useState("");
    const [touOpen, setTouOpen] = React.useState(false);

    const hasScrolledRef = useRef(false);

    // ✅ spinner state (RulesTable-style)
    const [isDownloading, setIsDownloading] = useState(false);

    const startUsing = async () => {
        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_USING_TEACHER_APP);
        setTimeout(() => navigate("/"), 200);
    };

    // ✅ button handler with spinner
    const onDownloadCrosswordClick = async () => {
        if (isDownloading) return;

        try {
            setIsDownloading(true);

            // keep your tracking
            await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_USING_TEACHER_PDF);

            // if you actually download a file here later, call your API here
            // await dowloadPdf("CROSSWORD_FOOD_A2") // example

            setTimeout(() => navigate("/analytics"), 200);
        } catch (e) {
            // optional: show message
            setMsg("Ой, помилка... Ми вже її виправляємо.");
        } finally {
            // if you navigate away immediately, this might not matter,
            // but still keeps state correct if navigation is blocked for any reason
            setIsDownloading(false);
        }
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

/* ✅ spinner keyframes (RulesTable-style) */
@keyframes spin-pause {
  0% { transform: rotate(0deg); }
  80% { transform: rotate(360deg); }
  100% { transform: rotate(360deg); }
}

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
  min-height: min(60vh, 530px);
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
  font-size: 16px;
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
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
  box-shadow: var(--shadow-btn);
  user-select: none;
  font-size: 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
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

/* ✅ disabled download state */
.primaryBtn[disabled]{
  cursor: default;
  opacity: 0.75;
  transform: none !important;
  box-shadow: var(--shadow-btn) !important;
}

/* ✅ inline spinner icon */
.btnIcon{
  width: 18px;
  height: 18px;
  display: block;
}
.btnIconSpinning{
  animation: spin-pause .9s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
  transform-origin: 50% 50%;
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
}

@media (max-width: 600px){
  .left{ padding: 44px 18px; }
  .ctaButtons{ flex-direction: column; }
  .footerInner{ flex-direction: column; align-items: flex-start; gap: 6px; }

      `}</style>

            {/* HERO */}
            <section className="landing">
                <div className="left">
                    <div className="textBlock">
                        <h1 className="title">
                            Безкоштовний кросворд<br/>
                            у високій якості<br/>
                            <em>готовий для друку</em>
                        </h1>

                        <p className="subtitle">
                            Якщо ви зараз проходите конкретну тему і потребуєте готовий кросворд
                            — просто скачайте його у GoodLang.
                        </p>
                    </div>
                </div>

                <div className="right">
                    <div className="topNav">
                        <button
                            className="topNavBtn"
                            onClick={() => document.getElementById("join")?.scrollIntoView({behavior: "smooth"})}
                        >
                            прокачати англійську
                        </button>
                    </div>

                    <div className="heroStack">
                        <button
                            className="primaryBtn"
                            onClick={onDownloadCrosswordClick}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <>
                                    <img
                                        src="/loading-icon.svg"
                                        alt="Loading"
                                        className="btnIcon btnIconSpinning"
                                    />
                                    Завантажую…
                                </>
                            ) : (
                                "Скачати кросворд"
                            )}
                        </button>

                        <div className="handPointerWrap">
                            <img src={handPict} className="handPointer" alt=""/>
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
                            Якщо вашим учням потрібна додаткова практика англійської <em>— GoodLang</em> ідеально підходить для самостійної роботи.
                        </h2>

                        <p className="ctaSubtitle">
                            Учні перекладають з української на англійську та одразу отримують фідбек.
                        </p>

                        <div className="ctaButtons">
                            <button onClick={startUsing} className="primaryBtn">
                                Спробувати практику
                            </button>
                        </div>

                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footerInner">
                    <div className="footerLeft">
                        © 2026 GoodLang •{" "}
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
