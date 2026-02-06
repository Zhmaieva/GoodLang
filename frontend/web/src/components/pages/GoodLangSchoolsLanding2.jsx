import React, { useMemo, useRef, useState } from "react";
import {callSendInquiry} from "../../services/api.js";

// Uses /public/handPict.png
// In Vite/CRA, "/handPict.png" resolves to public asset.
const handSrc = "/handPict.png";

const TOKENS = {
    bg0: "#fff3df",
    bg1: "#fff0d6",
    bg2: "#ffedd0",
    bg3: "#fff6e8",
    accent: "#ff6138",
    accentDark: "#d74e2a",
    green: "#4ba36e",
    blue: "#3a6ea5",
    text: "#3a2a1d",
    muted: "#a47856",
    border: "#000000",
    radius: 22,
    shadow: "0 0px 0 rgba(0,0,0,0.08)",
    shadowSoft: "0 18px 40px rgba(0,0,0,0.10)",
};

function clsx(...xs) {
    return xs.filter(Boolean).join(" ");
}

function Section({
                     id,
                     bg,
                     nextBg,
                     prevBg,
                     title,
                     kicker,
                     children,
                     align = "center",
                     headerStyle,
                     sectionStyle,
                     innerStyle,
                 }) {
    // “dissolve” effect via top/bottom gradients blending to prev/next bg
    const style = {
        "--bg": bg,
        "--nextBg": nextBg ?? bg,
        "--prevBg": prevBg ?? bg,
    };

    return (
        <section id={id} className={clsx("gl-section", align)} style={{...style, ...sectionStyle}}>
            <div className="gl-inner" style={innerStyle}>
                {(kicker || title) && (
                    <header style={headerStyle} className="gl-sectionHeader">
                        {kicker && <div className="gl-kicker">{kicker}</div>}
                        {title && <h2 className="gl-h2">{title}</h2>}
                    </header>
                )}
                {children}
            </div>
        </section>
    );
}

function PlanRow({ label, free, tutor, school, emphasis = false }) {
    return (
        <div className={clsx("gl-planRow", !emphasis && "emphasis")}>
            <div className="gl-planCell gl-planLabel">{label}</div>
            <div className="gl-planCell">{free}</div>
            <div className="gl-planCell">{tutor}</div>
            <div className="gl-planCell">{school}</div>
        </div>
    );
}

export default function GoodLangSchoolsLanding2() {
    const waitlistRef = useRef(null);
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    // ✅ 1) Add this state near your other useState's (inside GoodLangSchoolsLanding2)
    const [faqOpen, setFaqOpen] = useState(-1);

    const FAQS = useMemo(
        () => [
            {
                q: "How does it reduce teacher workload?",
                a: "GoodLang generates tasks in different forms: L1/L2 translations, choose a correct option, etc. and checks them instantly giving a short feedback and analytics. It enables teachers to spend time on teaching, instead of doing assignments routine.",
            },
            {
                q: "How does it help retain students?",
                a: "One of the main reasons why students leave language schools, is that they can't see the progress. By giving precise progress and weak spots data, GoodLang eliminates confusion to let your students know what they are paying for.",
            },
            {
                q: "Does GoodLang provide a learning plan?",
                a: "This is no exactly what GoodLang was made for. Teachers are the ones who adopt and shape the learning path. GoodLang is there for them to pinpoint learning gaps and instantly generate assignments based on grammar rule, vocabulary or subject.",
            },
            {
                q: "How is it better than AI chats / spreadsheets?",
                a: "Everything has it's applications. But none such tools can't massively track progress and produce / check assignments at the same time. Teachers would spend tens of hours per week trying to put it all together.",
            },
            {
                q: "Unlimited assignment generations* - why the asterisk?",
                a: "Don't worry - it's unlimited as long as it falls under fair use policy and users don't try to abuse the system by sharing accounts with other people.",
            },
        ],
        []
    );

    const sections = useMemo(
        () => [
            { id: "top", bg: TOKENS.bg0 },
            { id: "problem", bg: TOKENS.bg1 },
            { id: "solution", bg: TOKENS.bg2 },
            { id: "visibility", bg: TOKENS.bg3 },
            { id: "faq", bg: TOKENS.bg1 },
            { id: "pricing", bg: TOKENS.bg2 },
            { id: "waitlist", bg: TOKENS.bg0 },
        ],
        []
    );

    const bgByIndex = (i) => sections[i]?.bg ?? TOKENS.bg0;

    const scrollToWaitlist = () => {
        waitlistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const v = String(email || "").trim();
        if (!v.includes("@")) return;
        // Hook your API here
        await callSendInquiry({email: v});
        setSent(true);
    };

    return (
        <div className="gl-page">
            <style>{css}</style>

            {/* Top nav */}
            <div className="gl-navWrap">
                <div className="gl-nav">
                    <a className="gl-brand" href="#top" style={{
                        textDecoration: "none",
                    }}>
                        <span className="gl-logo">GL</span>
                        <span className="gl-brandText">
              <span className="gl-brandName">GoodLang</span>
              <span className="gl-brandSub">ESL teaching tools</span>
            </span>
                    </a>

                    <nav className="gl-navLinks">
                        <a href="#problem">Schools pain</a>
                        <a href="#solution">Our solution</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#faq">FAQ</a>
                    </nav>

                    <div className="gl-navRight">
                        <button className="gl-btn gl-btnPrimary" onClick={scrollToWaitlist}>
                            Join waitlist
                        </button>
                    </div>
                </div>
            </div>

            <img className="gl-hand-right" src={'handPict.PNG'} />
            <img className="gl-hand-left" src={'handPict.PNG'} />

            {/* HERO */}
            <Section
                id="top"
                bg={bgByIndex(0)}
                nextBg={bgByIndex(1)}
                title="ESL teaching at scale, transparent and frugal"
                kicker="Scale • Save • Retain"
                align="center"
                sectionStyle={{
                    minHeight: "60vh",
                }}
                innerStyle={{
                    paddingTop: "30vh",
                }}
            >
                <div className="gl-hero">
                    <button className="gl-btn gl-btnPrimary" onClick={scrollToWaitlist}>
                        Request early access
                    </button>
                    <a className="gl-btn gl-btnGhost" style={{
                        textDecoration: "none",
                    }} href="#solution">
                        How it works
                    </a>
                </div>
            </Section>

            {/* PROBLEM */}
            <Section
                id="problem"
                bg={bgByIndex(2)}
                prevBg={bgByIndex(1)}
                nextBg={bgByIndex(1)}
                title="Schools pain"
                align="left"
                headerStyle={{
                }}
            >
                <div className="gl-twoCol" style={{
                    width: "100%",
                }}>
                    <div className="gl-bullet">
                        <div style={{
                            display: 'flex',
                            justifyContent: "space-between",
                        }}>
                            <div className="gl-painTitle" style={{
                                fontSize: '1.5rem',
                                fontWeight: 900
                            }}>
                                Busy teaching staff
                            </div>
                            <div style={{
                                height: 0,
                            }}>
                                <img className={'gl-card-img'} src={'1list.PNG'}/>
                            </div>
                        </div>
                        <div className="gl-bulletText">
                            Has no time to handle more students. And hiring is expensive
                            and risky
                        </div>
                    </div>
                    <div className="gl-bullet">
                        <div style={{
                            display: 'flex',
                            justifyContent: "space-between",
                        }}>
                            <div className="gl-painTitle" style={{
                                fontSize: '1.5rem',
                                fontWeight: 900
                            }}>
                                Lack of expertise
                            </div>
                            <div style={{
                                height: 0,
                            }}>
                                <img className={'gl-card-img'} src={'1lamp.PNG'}/>
                            </div>
                        </div>
                        <div className="gl-bulletText">
                            The higher the CEFR level, the more time consuming are assignments.
                        </div>
                    </div>
                    <div className="gl-bullet">
                        <div style={{
                            display: 'flex',
                            justifyContent: "space-between",
                        }}>
                            <div className="gl-painTitle" style={{
                                fontSize: '1.5rem',
                                fontWeight: 900
                            }}>
                                Students attrition
                            </div>
                            <div style={{
                                height: 0,
                            }}>
                                <img className={'gl-card-img'} src={'hand3.PNG'}/>
                            </div>
                        </div>
                        <div className="gl-bulletText">
                            Students leave when feedback is missing or unclear.
                        </div>
                    </div>

                </div>
            </Section>

            {/* SOLUTION */}
            <Section
                id="solution"
                bg={bgByIndex(0)}
                prevBg={bgByIndex(1)}
                nextBg={bgByIndex(1)}
                title="The solution: optimize teaching workflow"
                align="left"
                headerStyle={{
                }}
            >
                <div className="gl-twoCol">
                    <div className="gl-solutionGrid">
                        <div style={{
                            display: "flex",
                            gap: 12,
                        }}>
                            <div className="gl-solutionCard">
                                <div className="gl-solutionTitle">Scale with no friction</div>
                                <div className="gl-solutionText">
                                    GoodLang generates tasks and instantly checks them to reduce operational cost. Start
                                    more
                                    classes with less effort.
                                </div>
                            </div>

                            <div className="gl-solutionCard" style={{
                                width: '80%'
                            }}>
                                <div className="gl-solutionTitle">Stronger retention</div>
                                <div className="gl-solutionText">
                                    Give transparent and data-driven feedback to your students — catch weak cohorts
                                    before
                                    refunds or churn happen.
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: "flex",
                            gap: 12,
                        }}>
                            <div className="gl-solutionCard" style={{
                                width: '80%'
                            }}>
                                <div className="gl-solutionTitle">Market value</div>
                                <div className="gl-solutionText">
                                    With automated checking, invest more time to focus on quality — put your school in a
                                    stronger position among
                                    competitors.
                                </div>
                            </div>

                            <div className="gl-solutionCard">
                                <div className="gl-solutionTitle">Easy to start</div>
                                <div className="gl-solutionText">
                                    We know that onboarding brings a lot of struggle. That's why GoodLang enables
                                    teachers
                                    to
                                    setup classes and start giving assignments within a minute.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CARDS WITH IMAGE (handPict) */}
            <Section
                id="pricing"
                bg={bgByIndex(2)}
                prevBg={bgByIndex(1)}
                nextBg={bgByIndex(4)}
                title="Plans"
                align="left"
                headerStyle={{
                }}
            >
                <div className="gl-cardGrid" style={{
                    width: "90%",
                }}>
                    <div className="gl-painCard">
                        {/*<div className="gl-painMedia">*/}
                        {/*    <img className="gl-handImg" src={handSrc} alt=""/>*/}
                        {/*</div>*/}
                        <div className="gl-painBody" style={{
                            minHeight: 400
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                                gap: 20,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                    <div className="gl-painTitle" style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 900
                                    }}>Trial
                                    </div>
                                    <div style={{
                                        height: 0,
                                    }}>
                                        <img style={{
                                            width: 42,
                                            position: "relative",
                                            top: -10,
                                        }} src={'hand3.PNG'}/>
                                    </div>

                                </div>

                                <div style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}>
                                    <div>
                                        <div className="gl-painText">1 student</div>
                                        <div className="gl-painText">up to 5 drills / assignment</div>
                                        <div className="gl-painText">3 assignments generations / month</div>
                                        <div className="gl-painText">3 automatic assignment checks / month</div>
                                        <div className="gl-painText">Progress analytics</div>
                                        <div className="gl-painText">Basic support</div>
                                    </div>
                                    <button className="gl-btn gl-btnGhost" onClick={scrollToWaitlist}>
                                        Learn more
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="gl-painCard">
                        {/*<div className="gl-painMedia">*/}
                        {/*    <img className="gl-handImg" src={handSrc} alt=""/>*/}
                        {/*</div>*/}
                        <div className="gl-painBody" style={{
                            minHeight: 400
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                                gap: 20,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                    <div className="gl-painTitle" style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 900
                                    }}>School
                                    </div>
                                    <div style={{
                                        height: 0,
                                    }}>
                                        <img style={{
                                            width: 42,
                                            position: "relative",
                                            top: -10,
                                        }} src={'1message.PNG'}/>
                                    </div>

                                </div>

                                <div style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}>
                                    <div>
                                        <div className="gl-painText">up to 50 students</div>
                                        <div className="gl-painText">up to 30 drills / assignment</div>
                                        <div className="gl-painText">Unlimited assignment generations*</div>
                                        <div className="gl-painText">Unlimited assignment checks</div>
                                        <div className="gl-painText">Cross-class analytics</div>
                                        <div className="gl-painText">Priority support</div>
                                        <div className="gl-painText">Principal dashboard</div>
                                    </div>
                                    <button className="gl-btn gl-btnGhost" onClick={scrollToWaitlist}>
                                        Learn more
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="gl-painCard">
                        {/*<div className="gl-painMedia">*/}
                        {/*    <img className="gl-handImg" src={handSrc} alt=""/>*/}
                        {/*</div>*/}
                        <div className="gl-painBody" style={{
                            minHeight: 400
                        }}>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "100%",
                                gap: 20,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: "space-between",
                                }}>
                                    <div className="gl-painTitle" style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 900
                                    }}>School+
                                    </div>
                                    <div style={{
                                        height: 0,
                                    }}>
                                        <img style={{
                                            width: 42,
                                            position: "relative",
                                            top: -10,
                                        }} src={'1lamp.PNG'}/>
                                    </div>

                                </div>

                                <div style={{
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}>
                                    <div>
                                        <div className="gl-painText">50+ students</div>
                                        <div className="gl-painText">up to 50 drills / assignment</div>
                                        <div className="gl-painText">Unlimited assignment generations*</div>
                                        <div className="gl-painText">Unlimited assignment checks</div>
                                        <div className="gl-painText">Cross-class analytics</div>
                                        <div className="gl-painText">Unlimited support</div>
                                        <div className="gl-painText">Principal dashboard</div>
                                    </div>
                                    <button className="gl-btn gl-btnGhost" onClick={scrollToWaitlist}>
                                        Learn more
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* WAITLIST */}
            <Section
                id="waitlist"
                bg={bgByIndex(4)}
                prevBg={bgByIndex(4)}
                nextBg={bgByIndex(6)}
                title="Join the waitlist"
                align="center"
            >
                <div ref={waitlistRef} className="gl-waitlist">
                    <div className="gl-waitCard">
                        <div className="gl-waitTitle">Get early access for your school or classes</div>

                        <form className="gl-form" onSubmit={onSubmit}>

                            <div className="gl-inputRow">
                                <input
                                    id="email"
                                    className="gl-input"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setSent(false);
                                    }}
                                    placeholder="name@school.com"
                                    inputMode="email"
                                    autoComplete="email"
                                />
                                <button className="gl-btn gl-btnPrimary" style={{
                                    minWidth: 120,
                                    cursor: !email?.trim()?.includes('@') ? 'not-allowed' : 'pointer',
                                }} type="submit">
                                    Join
                                </button>
                            </div>

                            {sent && (
                                <div className="gl-success">
                                    Thanks — we’ll contact you soon.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </Section>

            <Section
                id="faq"
                bg={bgByIndex(6)}
                prevBg={bgByIndex(6)}
                nextBg={bgByIndex(6)}
                title="Frequently asked questions"
                align="left"
            >
                <div className="gl-twoCol" style={{ justifyContent: "center" }}>
                    <div className="gl-faqStack">

                        {FAQS.map((item, idx) => {
                            const open = faqOpen === idx;

                            return (
                                <button
                                    key={item.q}
                                    type="button"
                                    className={clsx("gl-faqCard", open && "open")}
                                    onClick={() => setFaqOpen((v) => (v === idx ? -1 : idx))}
                                >
                                    <div className="gl-faqTop">
                                        <div className="gl-faqQ">{item.q}</div>

                                        <div className={clsx("gl-faqArrow", open && "open")} aria-hidden="true">
                                            ▾
                                        </div>
                                    </div>

                                    {/* ✅ Animated body (always mounted) */}
                                    <div className={clsx("gl-faqBody", open ? "open" : "closed")}>
                                        <div className="gl-faqA">{item.a}</div>
                                    </div>
                                </button>
                            );
                        })}

                    </div>
                </div>
            </Section>

            <footer style={{
                borderTop: '2px solid rgba(0,0,0,0.08)'
            }} className="gl-footer">
                <div className="gl-footerInner">
                    <div className="gl-footerBrand">
                        <span className="gl-logo">GL</span>
                        <span className="gl-footerText">
                2026 All rights reserved. For all inquiries, write us at: <a href={'mailto:support@goodlang.app'}>support@goodlang.app</a>
              </span>
                    </div>
                    <div className="gl-footerLinks">
                        <a href="#problem">Schools pain</a>
                        <a href="#solution">Our solution</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#top">Top</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const css = `
  :root{
    --bg0:${TOKENS.bg0};
    --bg1:${TOKENS.bg1};
    --bg2:${TOKENS.bg2};
    --bg3:${TOKENS.bg3};
    --accent:${TOKENS.accent};
    --accentDark:${TOKENS.accentDark};
    --text:${TOKENS.text};
    --muted:${TOKENS.muted};
    --border:${TOKENS.border};
    --radius:${TOKENS.radius}px;
    --shadow:${TOKENS.shadow};
    --shadowSoft:${TOKENS.shadowSoft};
  }
html, body, #root, .gl-page {
  width: 100%;
  overflow-x: hidden;
}

  
  /* Page */
  .gl-page{
    background: var(--bg0);
    color: var(--text);
    font-family: Nunito, ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, "Apple Color Emoji", "Segoe UI Emoji";
    letter-spacing: -0.01em;
  }
  a{ color: inherit; text-decoration: none; }
  a:hover{ text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }

  /* Nav */
  .gl-navWrap{
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 50;
    background: rgba(255,243,223,0.75);
    backdrop-filter: blur(10px);
    border-bottom: 2px solid rgba(0,0,0,0.08);
  }
  .gl-nav{
    // max-width: 1180px;
    margin: 0 auto;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }
  .gl-brand{
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .gl-card-img {
    width: 64px;
    position: relative;
    top: -6px;
  }
  
  .gl-logo{
    min-width: 38px;
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: var(--accent);
    border: 2px solid var(--accentDark);
    box-shadow: var(--shadow);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: 900;
    letter-spacing: -0.04em;
  }
  .gl-brandText{ display: flex; flex-direction: column; line-height: 1.05; }
  .gl-brandName{ font-weight: 900; }
  .gl-brandSub{ color: var(--muted); font-size: 12px; font-weight: 800; }

  .gl-hand-right {
    position: absolute;
    right: -0vw;
    top: 55vh;
    height: 500px;
    z-index: 9;
    rotate: 270deg;
  }
  
  .gl-hand-left {
    position: absolute;
    left: -5vw;
    top: 100vh;
    height: 500px;
    z-index: 1;
    rotate: 90deg;
  }
  
  @media (max-width: 1600px) {
    .gl-hand-left {
      display: none;
    }
  }
  
  @media (max-width: 1600px) {
    .gl-hand-right {
      right: -5vw;
      top: 40vh;
      transform: scale(.35);
      rotate: 240deg;
    }
  }
  
  @media (max-width: 760px) {
    .gl-hand-right {
      right: -14vw;
      transform: scale(.25);
      rotate: 240deg;
    }
    .gl-hand-left {
      left: -14vw;
      top: 145vh;
      rotate: 120deg;
      transform: scale(.25);
    }
  }
 
  @media (max-height: 750px) {
    .gl-hand-right {
      display: none !important;
    }
    
    .gl-hand-left {
      display: none !important;
    }
  }

  .gl-bullet {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .gl-navLinks{
    display: flex;
    gap: 18px;
    align-items: center;
    font-weight: 800;
    color: rgba(58,42,29,0.85);
  }
  .gl-navLinks a{ opacity: 0.9; }
  .gl-navLinks a:hover{ opacity: 1; }
  .gl-navRight{ display:flex; gap:10px; align-items:center; }

  /* Buttons */
  .gl-btn{
    border-radius: 999px;
    border: 2px solid var(--border);
    padding: 11px 16px;
    font-weight: 900;
    background: #fff;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    font-size: 1rem;
    color: var(--text);
  }
  .gl-btn:hover{ transform: translateY(-1px); }
  .gl-btn:active{ transform: translateY(1px); }
  .gl-btnPrimary{ background: var(--accent); }
  .gl-btnPrimary:hover{ background: #ff734f; }
  .gl-btnGhost:hover{ background: rgba(0,0,0,0.05); }
  .gl-btnGhost{ background: rgba(255,255,255,0.65); }

  /* Sections */
  .gl-section{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--bg);
  }
  .gl-section::before{
    content:"";
    position:absolute;
    inset:0;
    pointer-events:none;
    /* gradient “dissolve” to prev & next section */
    background:
      linear-gradient(to bottom, var(--prevBg) 0%, rgba(0,0,0,0) 18%),
      linear-gradient(to top, var(--nextBg) 0%, rgba(0,0,0,0) 18%);
    opacity: 0.9;
    mix-blend-mode: normal;
  }
  .gl-inner{
    position: relative;
    z-index: 1;
    width: 100%;
   // max-width: 1180px;
    padding: 90px 18px 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gl-sectionHeader{ margin-bottom: 18px; text-align: center; }
  .gl-kicker{
    display: inline-block;
    padding: 6px 12px;
    border-radius: 999px;
    border: 2px solid rgba(0,0,0,0.15);
    background: rgba(255,255,255,0.55);
    font-weight: 900;
    color: rgba(58,42,29,0.9);
    margin-bottom: 12px;
  }
  .gl-h2{
    font-size: clamp(30px, 3.6vw, 54px);
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin: 0;
    font-weight: 950;
  }

  /* Hero */
  .gl-hero{
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 28px;
    //align-items: center;
    max-width: 1180px;
    margin-top: 110px;
  }
  .gl-heroBadge{
    background: rgba(255,255,255,0.7);
    border: 2px solid rgba(0,0,0,0.14);
    border-radius: var(--radius);
    padding: 14px 16px;
    font-weight: 800;
  }
  .gl-lead{
    font-size: 18px;
    line-height: 1.55;
    margin: 14px 0 0;
    color: rgba(58,42,29,0.9);
    font-weight: 750;
    text-align: left;
  }
  .gl-heroCtas{
    display:flex;
    gap: 12px;
    margin-top: 16px;
    flex-wrap: wrap;
  }
  .gl-micro{
    display:grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 10px;
    margin-top: 18px;
  }
  .gl-microItem{
    background: rgba(255,255,255,0.65);
    border: 2px solid rgba(0,0,0,0.12);
    border-radius: 18px;
    padding: 12px 12px;
    box-shadow: var(--shadowSoft);
  }
  .gl-microTitle{ font-weight: 950; }
  .gl-microText{ color: rgba(58,42,29,0.78); font-weight: 800; font-size: 13px; margin-top: 4px; }

  .gl-heroRight{
    position: relative;
    display:flex;
    flex-direction: column;
    gap: 14px;
  }

  .gl-bigLogo{
    position: absolute;
    top: -10px;
    right: 0;
    width: 220px;
    height: 220px;
    border-radius: 32px;
    background: var(--accent);
    border: 2px solid rgba(0,0,0,0.18);
    box-shadow: var(--shadowSoft);
    transform: rotate(-2deg);
    overflow: hidden;
    opacity: 0.95;
  }
  .gl-bigLogoGlow{
    position:absolute;
    inset: -30%;
    background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(255,255,255,0));
    filter: blur(10px);
  }
  .gl-bigLogoText{
    position:absolute;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight: 900;
    letter-spacing: -0.06em;
    font-size: 92px;
    color: rgba(27,18,12,0.95);
  }

  .gl-heroCard{
//    margin-top: 110px;
    background: rgba(255,255,255,0.75);
    border: 2px solid rgba(0,0,0,0.16);
    border-radius: calc(var(--radius) + 6px);
    box-shadow: var(--shadowSoft);
    padding: 16px;
  }
  .gl-heroCardTop{
    display:flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }
  .gl-cardTitle{ font-weight: 900; }
  .gl-cardNote{ color: rgba(58,42,29,0.75); font-weight: 850; font-size: 13px; }

  .gl-kpiGrid{
    display:grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 10px;
  }
  .gl-kpi{
    border-radius: 18px;
    border: 2px solid rgba(0,0,0,0.12);
    background: rgba(255,243,223,0.7);
    padding: 12px;
  }
  .gl-kpiLabel{ color: rgba(58,42,29,0.75); font-weight: 900; font-size: 12px; }
  .gl-kpiValue{ font-weight: 1100; font-size: 26px; letter-spacing: -0.03em; margin-top: 6px; }
  .gl-kpiHint{ color: rgba(58,42,29,0.75); font-weight: 850; font-size: 12px; margin-top: 2px; }

  .gl-heroCardFooter{
    margin-top: 12px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .gl-footNote{ color: rgba(58,42,29,0.72); font-weight: 850; font-size: 13px; }

  /* Layout helpers */
  .gl-twoCol{
    display:flex;
    flex-direction: row;
    gap: 42px;
    align-items: start;
    max-width: 1180px;
    width: 90%;
  }
  @media (max-width: 980px){
    .gl-twoCol{
        flex-direction: column;
        align-items: center;
    }
    
    .gl-bullet{
        width: 90% !important;
    }
  }
  
  @media (max-width: 400px){
      .gl-bullet{
        height: 178px !important;
    }
  }
  
  .gl-copy{ }
  .gl-p{ font-size: 17px; line-height: 1.6; font-weight: 780; color: rgba(58,42,29,0.92); margin: 0 0 12px; }

  .gl-bullets{
    display:grid;
    gap: 10px;
    margin-top: 10px;
  }
  .gl-bullet{
    background: rgba(255,255,255,0.6);
    border: 2px solid rgba(0,0,0,0.12);
    border-radius: 18px;
    box-shadow: var(--shadowSoft);
    padding: 12px 14px;
    width: 30%;
    height: 160px;
  }
  .gl-bulletTitle{ font-weight: 900; margin-bottom: 4px; font-size: 1.5rem; }
  .gl-bulletText{ color: rgba(58,42,29,0.76); font-size: clamp(1rem, 1vw, 1.2rem); }

  .gl-contrast{
    margin-top: 14px;
    background: rgba(255,255,255,0.55);
    border: 2px solid rgba(0,0,0,0.12);
    border-radius: 18px;
    padding: 14px;
  }
  .gl-contrastTitle{ font-weight: 900; margin-bottom: 10px; }
  .gl-contrastGrid{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .gl-contrastBox{
    border-radius: 16px;
    border: 2px solid rgba(0,0,0,0.12);
    padding: 12px;
  }
  .gl-contrastBox.bad{ background: rgba(255,255,255,0.55); }
  .gl-contrastBox.good{ background: rgba(255,97,56,0.14); }
  .gl-contrastHead{ font-weight: 900; margin-bottom: 6px; }
  .gl-contrastText{ color: rgba(58,42,29,0.78); font-weight: 850; font-size: 13px; }

  .gl-sideCard{
    background: rgba(255,255,255,0.7);
    border: 2px solid rgba(0,0,0,0.15);
    border-radius: calc(var(--radius) + 6px);
    box-shadow: var(--shadowSoft);
    padding: 16px;
  }
  .gl-sideCardHeader{ margin-bottom: 10px; }
  .gl-sideTitle{ font-weight: 1100; }
  .gl-sideSub{ color: rgba(58,42,29,0.72); font-weight: 850; font-size: 13px; margin-top: 4px; }
  .gl-decisionList{ display:grid; gap: 10px; margin-top: 12px; }
  .gl-decisionItem{
    border-radius: 16px;
    border: 2px solid rgba(0,0,0,0.12);
    background: rgba(255,243,223,0.7);
    padding: 12px 12px;
    font-weight: 950;
  }
  .gl-sideCardFooter{
    margin-top: 12px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
  }
  .gl-miniCallout{
    font-weight: 950;
    color: rgba(58,42,29,0.85);
  }

  /* Solution grid */
  .gl-solutionGrid{
    display:flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 10px;
    max-width: 1180px;
  }
  .gl-solutionCard{
    background: rgba(255,255,255,0.65);
    border: 2px solid rgba(0,0,0,0.12);
    border-radius: 18px;
    padding: 14px;
    box-shadow: var(--shadowSoft);
  }
  .gl-solutionTitle{ font-weight: 900; margin-bottom: 6px; font-size: 1.5rem; }
  .gl-solutionText{ color: rgba(58,42,29,0.78); font-size: 1.1rem; line-height: 1.55; }

  .gl-wideCallout{
    margin-top: 14px;
    border-radius: calc(var(--radius) + 8px);
    border: 2px solid rgba(0,0,0,0.15);
    background: rgba(255,255,255,0.72);
    box-shadow: var(--shadowSoft);
    padding: 16px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .gl-wideTitle{ font-weight: 1100; }
  .gl-wideText{ color: rgba(58,42,29,0.75); font-weight: 900; margin-top: 3px; }

  /* Cards with image */
  .gl-cardGrid{
    display:grid;
    grid-template-columns: repeat(3, minmax(0,1fr));
    gap: 12px;
    margin-top: 12px;
    max-width: 1180px;
  }
  .gl-painCard{
    background: rgba(255,255,255,0.72);
    border: 2px solid rgba(0,0,0,0.15);
    border-radius: calc(var(--radius) + 8px);
    box-shadow: var(--shadowSoft);
    overflow:hidden;
    display:flex;
    flex-direction: column;
  }
  .gl-painMedia{
    background: rgba(255,97,56,0.12);
    border-bottom: 2px solid rgba(0,0,0,0.12);
    height: 160px;
    display:flex;
    align-items:center;
    justify-content:center;
    padding: 12px;
  }
  .gl-handImg{
    max-height: 160px;
    width: auto;
    filter: drop-shadow(0 16px 18px rgba(0,0,0,0.12));
    opacity: 0.95;
  }
  .gl-painBody{ padding: 24px; display:flex; flex-direction: column; gap: 10px; }
  .gl-painTitle{ font-weight: 900; }
  .gl-painText{ color: rgba(58,42,29,0.78); font-size: 1.1rem; line-height: 1.55; }

  /* FAQ details */
  .gl-faq{ display:grid; gap: 10px; margin-top: 12px; }
  .gl-details{
    background: rgba(255,255,255,0.7);
    border: 2px solid rgba(0,0,0,0.14);
    border-radius: calc(var(--radius) + 6px);
    padding: 10px 12px;
  }
  .gl-details summary{
    cursor: pointer;
    list-style: none;
    font-weight: 1050;
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 6px;
  }
  .gl-details summary::-webkit-details-marker{ display:none; }
  .gl-detailsHint{
    font-weight: 900;
    color: rgba(58,42,29,0.68);
    font-size: 12px;
    border: 2px solid rgba(0,0,0,0.10);
    border-radius: 999px;
    padding: 4px 10px;
    background: rgba(255,243,223,0.8);
    white-space: nowrap;
  }
  .gl-detailsBody{
    padding: 8px 6px 10px;
    color: rgba(58,42,29,0.78);
    font-weight: 850;
    line-height: 1.6;
  }

  /* Pricing */
  .gl-pricingWrap{
    background: rgba(255,255,255,0.7);
    border: 2px solid rgba(0,0,0,0.15);
    border-radius: calc(var(--radius) + 10px);
    box-shadow: var(--shadowSoft);
    padding: 16px;
    margin-top: 10px;
  }
  .gl-pricingHeader{ margin-bottom: 12px; }
  .gl-pricingTitle{ font-weight: 1100; font-size: 18px; }
  .gl-pricingSub{ color: rgba(58,42,29,0.72); font-weight: 850; margin-top: 4px; }

  .gl-planTable{
    border-radius: 18px;
    overflow:hidden;
    border: 2px solid rgba(0,0,0,0.12);
    background: rgba(255,243,223,0.55);
  }
  .gl-planHead{
    display:grid;
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
    gap: 0;
    border-bottom: 2px solid rgba(0,0,0,0.12);
    background: rgba(255,255,255,0.55);
  }
  .gl-planHeadCell{
    padding: 14px 12px;
    border-left: 2px solid rgba(0,0,0,0.10);
    display:flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  .gl-planHeadCell.featured{
    background: rgba(255,97,56,0.16);
  }
  .gl-planName{ font-weight: 1100; }
  .gl-planPrice{ color: rgba(58,42,29,0.78); font-weight: 950; }

  .gl-planRow{
    display:grid;
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
    border-bottom: 2px solid rgba(0,0,0,0.08);
  }
  .gl-planRow:last-child{ border-bottom: none; }
  .gl-planRow.emphasis{ background: rgba(255,255,255,0.35); }
  .gl-planCell{
    padding: 12px;
    border-left: 2px solid rgba(0,0,0,0.08);
    font-weight: 900;
    color: rgba(58,42,29,0.86);
  }
  .gl-planLabel{
    border-left: none;
    font-weight: 1100;
    color: rgba(58,42,29,0.92);
  }

  .gl-pricingFoot{
    margin-top: 12px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .gl-pricingNote{
    color: rgba(58,42,29,0.78);
    font-weight: 850;
    //max-width: 720px;
    line-height: 1.5;
  }

  /* Waitlist */
  .gl-waitlist{
    display:flex;
    align-items:center;
    justify-content:center;
    width: 90%;
    max-width: 1180px;
  }
  .gl-waitCard{
    width: 100%;
    background: rgba(255,255,255,0.78);
    border: 2px solid rgba(0,0,0,0.16);
    border-radius: calc(var(--radius) + 12px);
    box-shadow: var(--shadowSoft);
    padding: 18px;
  }
  .gl-waitTitle{ font-weight: 1150; font-size: 20px; }
  .gl-waitText{ margin-top: 8px; color: rgba(58,42,29,0.78); font-weight: 850; line-height: 1.55; }

  .gl-form{ margin-top: 14px; }
  .gl-label{ display:block; font-weight: 900; margin-bottom: 8px; }
  .gl-inputRow{
    display:flex;
    gap: 10px;
    align-items: stretch;
    flex-wrap: wrap;
  }
  .gl-input{
    flex: 1;
    min-width: 240px;
    border-radius: 18px;
    border: 2px solid var(--border);
    padding: 14px 14px;
    font-weight: 900;
    font-size: 1rem;
    font-family: var(--font-family-mono);
    background: rgba(255,243,223,0.85);
    text-align: left;
    outline: none;
  }
  .gl-input:focus{
    background: rgba(255,243,223,1);
  }
  .gl-formHint{
    margin-top: 10px;
    color: rgba(58,42,29,0.70);
    font-weight: 850;
    font-size: 13px;
  }
  .gl-success{
    margin-top: 12px;
    border-radius: 16px;
    border: 2px solid rgba(0,0,0,0.12);
    background: rgba(75,163,110,0.18);
    padding: 10px 12px;
    font-weight: 900;
  }
  
  .gl-faqStack{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Kill Safari tap highlight + focus box */
.gl-faqCard {
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

.gl-faqCard:focus {
  outline: none;
}

.gl-faqCard{
  font-family: var(--font-family-mono);
  width: 100%;
  text-align: left;
  border: 2px solid rgba(0,0,0,0.14);
  background: rgba(255,255,255,0.72);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadowSoft);
  padding: 14px 14px;
  cursor: pointer;
  transition: transform 120ms ease, background 120ms ease;
}

.gl-faqCard:hover{
  transform: translateY(-1px);
  background: rgba(255,255,255,0.80);
}

.gl-faqTop{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.gl-faqQ{
  color: var(--text) !important;
  font-weight: 900;
  font-size: 1.15rem;
  line-height: 1.25;
}

.gl-faqArrow{
  color: var(--text) !important;
  min-width: 34px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 2px solid rgba(0,0,0,0.12);
  background: rgba(255,243,223,0.8);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 1100;
  transition: transform 160ms ease;
}

.gl-faqArrow.open{
  transform: rotate(180deg);
}

.gl-faqA{
  margin-top: 10px;
  border-top: 2px solid rgba(0,0,0,0.08);
  padding-top: 10px;
  color: rgba(58,42,29,0.78);
  line-height: 1.6;
  font-size: 1.02rem;
}

/* ✅ Add ONLY these CSS updates */

/* body animation wrapper */
.gl-faqBody{
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    max-height 260ms ease,
    opacity 200ms ease,
    transform 220ms ease;
  will-change: max-height, opacity, transform;
}

/* open state */
.gl-faqBody.open{
  max-height: 220px; /* adjust if some answers are longer */
  opacity: 1;
  transform: translateY(0);
}

/* spacing + divider should appear only when opening */
.gl-faqA{
  margin-top: 10px;
  border-top: 2px solid rgba(0,0,0,0.08);
  padding-top: 10px;
  line-height: 1.6;
  font-size: 1.02rem;
}


  /* Footer */
  .gl-footer{
    margin-top: 24px;
    padding-top: 16px;
  }
  .gl-footerInner{
    //max-width: 1180px;
    margin: 0 auto;
    padding: 0 18px 30px;
    display:flex;
    align-items:center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .gl-footerBrand{ display:flex; align-items:center; gap: 10px; }
  .gl-footerText{ color: rgba(58,42,29,0.75); font-weight: 900; }
  .gl-footerLinks{ display:flex; gap: 16px; font-weight: 900; color: rgba(58,42,29,0.78); }

  /* Alignments */
  .gl-section.left .gl-inner{ text-align: left; }
  .gl-section.center .gl-inner{ text-align: center; }

  /* Responsive */
  @media (max-width: 980px){
    .gl-navLinks{ display:none; }
    .gl-hero{ grid-template-columns: 1fr; }
    .gl-heroCard{ margin-top: 240px; }
    .gl-bigLogo{ top: 0; right: 0; width: 180px; height: 180px; }
    .gl-micro{ grid-template-columns: 1fr; }
    .gl-twoCol{ grid-template-columns: 1fr; }
    .gl-solutionGrid{ flex-direction: column; }
    .gl-solutionGrid>div{ flex-direction: column;}
    .gl-solutionGrid>div>div{ flex-direction: column; width: 100% !important; }
    .gl-cardGrid{ grid-template-columns: 1fr; }
    .gl-contrastGrid{ grid-template-columns: 1fr; }
    .gl-planHead, .gl-planRow{ grid-template-columns: 1fr; }
    .gl-planHead > div:first-child{ display:none; }
    .gl-planRow .gl-planLabel{ background: rgba(255,255,255,0.35); }
    .gl-planCell{ border-left: none; border-top: 2px solid rgba(0,0,0,0.06); }
    .gl-planRow{ border-bottom: 2px solid rgba(0,0,0,0.12); }
    .gl-btn{ width: 100%; }
    .gl-inner { padding: 20px 18px 60px; }
    .gl-hero { margin-top: 20px; }
    .gl-footerLinks { justify-content: end; width: 100%; }
  }

  @media (prefers-reduced-motion: reduce){
    .gl-btn{ transition:none; }
  }
`;
