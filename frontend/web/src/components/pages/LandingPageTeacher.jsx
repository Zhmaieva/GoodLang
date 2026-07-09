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
import { Button } from "../Buttons.jsx";

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
            setMsg("Enter a valid email");
            return;
        }
        try {
            setSending(true);
            setMsg("");
            await callSendPromoCodeApi({ email: v });
            setMsg("Done! We sent a promo code to the specified email address.");
            setEmail("");
        } catch {
            setMsg("Oops, an error occurred... We are already fixing it.");
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

  --font: var(--font-family-base);
  --font-soft: var(--font-family-base);
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
                            Free PDF worksheets<br/>
                            with English translation exercises<br/>
                            <em>for lessons</em><br/>
                            <em>and homework</em>
                        </h1>

                        <p className="subtitle">
                            If you are currently teaching a specific grammar structure and need ready-made
                            “Ukr → Eng” translation exercises — simply download them from GoodLang. Free.
                        </p>
                    </div>
                </div>

                <div className="right">
                    <div className="topNav">
                        <Button className="topNavBtn"
                                onClick={() => document.getElementById("inside")?.scrollIntoView({behavior: "smooth"})}>
                            What's inside
                        </Button>

                        <Button className="topNavBtn"
                                onClick={() => document.getElementById("download")?.scrollIntoView({behavior: "smooth"})}>
                        How to download
                        </Button>

                        <Button className="topNavBtn"
                                onClick={() => document.getElementById("join")?.scrollIntoView({behavior: "smooth"})}>
                            Get started
                        </Button>
                    </div>

                    <div className="heroStack">
                        <div className="heroCard">
                            <h3 className="heroCardTitle">1700+ grammar exercises</h3>
                            <p className="heroCardText">
                                Choose a rule → download the PDF → have your students translate from Ukrainian to
                                English.
                                The file includes answer keys for quick checking.
                            </p>

                            <div className="heroBtns">
                                <Button
                                    className="primaryBtn"
                                    onClick={goToRules}
                                >
                                    Download
                                </Button>
                                <Button
                                    className="secondaryBtn"
                                    onClick={() =>
                                        document
                                            .getElementById("download")
                                            ?.scrollIntoView({behavior: "smooth"})
                                    }
                                >
                                    Learn more
                                </Button>
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
                    <h2 className="sectionTitle">What’s inside each PDF</h2>
                    <p className="sectionLead">
                        Each file is a ready-to-use package of materials for a specific grammar topic. Just 3 pages:
                        theory,
                        practice, and answers.
                    </p>

                    <div className="featuresGrid">
                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand3} className="featureIcon" alt=""/>
                                <div className="featureTitle">Grammar rule + examples</div>
                            </div>
                            <p className="featureText">
                                A concise explanation of the grammar structure with examples of correct sentences.
                            </p>
                        </div>

                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand1} className="featureIcon" alt=""/>
                                <div className="featureTitle">Common student mistakes</div>
                            </div>
                            <p className="featureText">
                                The most common “traps” for this topic — helping students quickly understand what to
                                watch out for.
                            </p>
                        </div>

                        <div className="featureCard">
                            <div className="featureIconRow">
                                <img src={hand2} className="featureIcon" alt=""/>
                                <div className="featureTitle">Exercises + answer key</div>
                            </div>
                            <p className="featureText">
                                Ukrainian sentences to translate into English + English answer keys for self-checking or
                                quick
                                teacher review.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="divider"/>

            {/* HOW TO DOWNLOAD */}
            <section className="section" id="download">
                <div className="sectionInner">
                    <h2 className="sectionTitle">How to download a PDF (2 simple ways)</h2>
                    <p className="sectionLead">
                        You can download it either from the rules list or from an individual rule page.
                    </p>

                    <div className="howGrid">
                        <div className="stepsCard">
                            <div className="step">
                                <div className="stepNum">1</div>
                                <div>
                                    <p className="stepTitle">From the rules list page</p>
                                    <p className="stepText">
                                        Go to the rules list and click the “download” icon next to the rule you need.
                                    </p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="stepNum">2</div>
                                <div>
                                    <p className="stepTitle">From a specific rule page</p>
                                    <p className="stepText">
                                        Open a rule → click the <strong>“Print tasks”</strong> button (the PDF will be
                                        generated and downloaded).
                                    </p>
                                </div>
                            </div>

                            <div className="step">
                                <div className="stepNum">✓</div>
                                <div>
                                    <p className="stepTitle">Done</p>
                                    <p className="stepText">
                                        Use it as homework or a classroom activity — no preparation required.
                                    </p>
                                </div>
                            </div>

                            <div style={{marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap"}}>
                                <Button className="primaryBtn" onClick={goToRules}>
                                    Get started
                                </Button>
                                {/*<Button className="secondaryBtn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>*/}
                                {/*    Back to top*/}
                                {/*</Button>*/}
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
                            Want more learning materials in <em>GoodLang</em>?
                        </h2>

                        <p className="ctaSubtitle">
                            If your students need extra daily practice, they can use GoodLang for independent study.
                        </p>

                        <div className="ctaButtons">
                            <Button onClick={startUsing} className="primaryBtn">
                                Start practicing
                            </Button>
                            <Button onClick={goToRules} className="secondaryBtn">
                                View rules and PDFs
                            </Button>
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
                        Terms of Use and Privacy Policy
                    </div>
                </div>
            </footer>

            {touOpen && (
                <TermsOfUseModal readOnly theme={theme} onClose={() => setTouOpen(false)}/>
            )}
        </>
    );
}
