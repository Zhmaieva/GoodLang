import handPict from "../../../public/handPict.PNG";
import {useNavigate} from "react-router-dom";
import TermsOfUseModal from "../subscription/TermsOfUseModal.jsx";
import React, {useEffect, useRef, useState} from "react";
import {callAccountVerifyApi, callSendPromoCodeApi} from "../../services/api.js";
import {ACTION_TYPES} from "../../utils/constants.js";
import {logError} from "../../services/logger.js";

import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import {acceptCookies, getCookieConsent, rejectCookies} from "../../services/settingsService.js";
import InfoModal from "../modals/InfoModal.jsx";
import {downloadCrossword} from "../../services/api.js"; // adjust path if needed
import {useLocation} from "react-router-dom";
import {ensureAnalytics, trackMetaCustomEvent, trackPageView} from "../../services/gaService.js";
import { Button } from "../Buttons.jsx";
import { SpinnerGap } from "@phosphor-icons/react";


export default function LandingCrossword({theme}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [touOpen, setTouOpen] = React.useState(false);

    const hasScrolledRef = useRef(false);

    // ✅ spinner state (RulesTable-style)
    const [isDownloading, setIsDownloading] = useState(false);

    // ✅ cookie gate (Tea-style)
    const [cookieOpen, setCookieOpen] = useState(false);
    const [pendingDownload, setPendingDownload] = useState(false);

    // ✅ code from URL
    const [code, setCode] = useState("");
    const [filename, setFilename] = useState("");


    // ✅ info modal on download error
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoMsg, setInfoMsg] = useState(null); // string | JSX

    useEffect(() => {
        const qs = new URLSearchParams(location.search);

        const c = String(qs.get("code") ?? "").trim();
        const f = String(qs.get("filename") ?? "").trim();

        if (!c || !f) {
            navigate("/trainer", { replace: true });
            return;
        }

        setCode(c);

        // optional filename (safe fallback)
        setFilename(f || `crossword_${c}`);
    }, [location.search, navigate]);


    const startUsing = async () => {
        trackMetaCustomEvent("StartUsing");

        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_START_USING_TEACHER_APP);
        setTimeout(() => navigate("/"), 200);
    };

    const getSafeFileName = () => {
        return filename
            ? filename.replace(/[^\w\d-_]+/g, "_")
            : `crossword_${code}`;
    }

    const doDownload = async () => {
        if (isDownloading) return;
        if (!code) return; // safety

        try {
            setIsDownloading(true);

            const { blob } = await downloadCrossword(code);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");

            a.href = url;
            a.download = `GoodLang_crossword_${getSafeFileName()}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setTimeout(() => {
                setIsDownloading(false);
            }, 1000)
        } catch (e) {
            logError(e);

            setInfoMsg(
                <>
                    Не вдалося завантажити кросворд.

                    <div style={{ opacity: 0.9 }}>
                        Напишіть нам на{" "}
                        <a
                            href="mailto:goodlang.app@gmail.com"
                            style={{ color: theme.accentDark, textDecoration: 'none', fontWeight: 900}}
                        >
                            goodlang.app@gmail.com
                        </a>{" "}
                        і ми допоможемо.
                    </div>
                </>
            );
            setInfoOpen(true);
            setIsDownloading(false);
        }
    };

    // ✅ button handler with cookie gating + modal conflict rules
    const onDownloadCrosswordClick = async () => {
        if (isDownloading) return;

        // If cookie modal should be shown, do it, and remember we need to download after
        if (!getCookieConsent()) {
            setTouOpen(false);          // avoid conflict like Tea landing
            setCookieOpen(true);
            setPendingDownload(true);

            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);
            return;
        }

        await doDownload();
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
                        <Button
                            className="topNavBtn"
                            onClick={() => document.getElementById("join")?.scrollIntoView({behavior: "smooth"})}
                        >
                            прокачати англійську
                        </Button>
                    </div>

                    <div className="heroStack">
                        <Button
                            className="primaryBtn"
                            onClick={onDownloadCrosswordClick}
                            disabled={isDownloading}
                        >
                            {isDownloading ? (
                                <>
                                    <SpinnerGap
                                        size={18}
                                        weight="bold"
                                        className="btnIcon btnIconSpinning"
                                        aria-label="Loading"
                                    />
                                    Завантажую…
                                </>
                            ) : (
                                `Скачати кросворд ${getSafeFileName()}.pdf`
                            )}
                        </Button>

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
                            If your students need extra English practice, <em>GoodLang</em> is perfect for independent
                            learning.
                        </h2>

                        <p className="ctaSubtitle">
                            Students translate from Ukrainian to English and receive instant feedback.
                        </p>

                        <div className="ctaButtons">
                            <Button onClick={startUsing} className="primaryBtn">
                                Try the practice
                            </Button>
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

                    <div
                        className="footerLink"
                        onClick={async () => {
                            setCookieOpen(false); // ✅ conflict rule like Tea landing
                            setTouOpen(true);
                            await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_TOU);
                        }}
                    >
                        Terms of Use and Privacy Policy
                    </div>
                </div>
            </footer>

            {/* ✅ Terms modal (only if cookie isn't open) */}
            {touOpen && !cookieOpen && (
                <TermsOfUseModal readOnly theme={theme} onClose={() => setTouOpen(false)}/>
            )}

            {/* ✅ Cookie modal (Tea-style conflict rule) */}
            {cookieOpen && !touOpen && (
                <CookieConsentModal
                    theme={theme}
                    onAccept={async () => {
                        setCookieOpen(false);

                        acceptCookies();
                        ensureAnalytics();
                        trackPageView(window.location.pathname);

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);

                        if (pendingDownload) {
                            setPendingDownload(false);
                            await doDownload();
                        }
                    }}
                    onReject={async () => {
                        setCookieOpen(false);

                        rejectCookies();

                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);

                        if (pendingDownload) {
                            setPendingDownload(false);
                            await doDownload();
                        }
                    }}
                    onOpenPolicy={async () => {
                        setCookieOpen(false);
                        setTouOpen(true);
                        await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_TOU);
                    }}
                />
            )}

            {/* ✅ Info modal on errors */}
            {infoOpen && (
                <InfoModal
                    theme={theme}
                    title="Ой..."
                    message={infoMsg}
                    buttonText="OK"
                    onClose={() => setInfoOpen(false)}
                />
            )}
        </>
    );
}
