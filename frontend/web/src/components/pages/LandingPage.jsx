import React, {useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../AppShell";
import Header from "../Header";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import Trainer from "../training/Trainer.jsx";
import FooterBar from "../FooterBar.jsx";

import bgImage from "../../../public/goodlang.png";

export default function LandingPage({ theme }) {

    const closeBtnStyle = {
        appearance: "none",
        padding: "10px 18px",
        fontWeight: 800,
        fontSize: "2rem",
        lineHeight: 1,
        borderRadius: 999,
        fontFamily: "Nunito, system-ui, sans-serif",

        background: "#fffdf8",
        color: theme.text,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,

        cursor: "pointer",
        transition: "transform 120ms ease",
    };

    const wrap = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        paddingBottom: 12,
        marginBottom: 20,
        border: 'none',
        flexWrap: "wrap",

        /* ✔ На мобільних — кнопка падає вниз */
        rowGap: 12,
    };

    const leftWrap = {
        display: "flex",
        alignItems: "center",
        gap: 12,
        flex: "1 1 auto",
        minWidth: 0,
    };

    const logo = (size) => ({
        flex: "0 0 auto",        // НЕ СТИСКАЄТЬСЯ
        width: size,
        height: size,
        borderRadius: 12,
        background: theme.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 800,
        fontSize: size * 0.45,
        boxShadow: `0 2px 0 ${theme.accentDark}`,
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

    const navigate = useNavigate();
    const handleStart = () => navigate('/');

    return (
        <AppShell noPadding theme={theme}>
            <div style={{
                paddingLeft: "28px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "space-between",
                height: "100vh",
            }}>

                <div style={{
                    position: "fixed",
                    height: "15vh",
                    width: "100vw",
                    backgroundColor: theme.bg,
                    paddingTop: "20px"
                }}>
                    <div style={{
                        width: "80%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}>
                        <header style={wrap}>
                            <div style={leftWrap}>
                                <div style={logo(64)}>GL</div>
                            </div>
                        </header>

                    </div>
                </div>


                <div style={{
                    height: "80vh",
                    width: "100%",
                    alignItems: "center",
                    background: bgImage,
                }}>

                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: "120%", // shift right by 50%
                            width: "100%",
                            height: "100%",
                            backgroundColor: theme.accent,
                            // backgroundImage: `url(${bgImage})`,
                            // backgroundSize: "cover",
                            backgroundPosition: "center",
                            transform: "translateX(-50%)",
                            filter: "blur(4px)",
                            //opacity: 0.5,
                            //zIndex: 0,
                            pointerEvents: "none",
                        }}
                    />

                    {/*Main body split*/}
                    <div style={{
                        height: "80vh",
                        width: "80%",
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                        <div style={{
                            width: '50%',
                            height: "100%",
                            display: "flex", flexDirection: "column"
                        }}>

                            <div style={{
                                width: "100%",
                                height: "80%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"
                            }}>
                                <h1 style={{
                                    color: theme.accentDark,
                                    fontSize: "3rem",
                                    overflow: "initial",
                                    font: "IvyPresto Headline"
                                }}>
                                    Вивчи 2nd Conditional <br/>
                                    (і всі інші правила) з GoodLang
                                </h1>
                                <h2 style={{
                                    overflow: "initial",
                                    width: "200%",
                                    color: theme.accentDark,
                                    fontSize: "1.5rem",
                                    fontWeight: 500
                                }}>
                                    А також перестанеш казати: "У мене наче B2, але іноді - А1", <br/>
                                    користуючись з персонального AI тренажера. Безкоштовно.
                                </h2>
                            </div>

                            <div style={{display: "flex", justifyContent: "space-around"}}>
                                <p style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 900,
                                }}>
                                    1265 речень перекладено
                                </p>
                                <p style={{
                                    fontSize: "1.5rem",
                                    fontWeight: 900,
                                }}>
                                    284 правила вивчено
                                </p>
                            </div>

                        </div>

                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: "75%", // shift right by 50%
                            width: '20%',
                            height: "100%",
                            display: "flex", flexDirection: "column",
                            justifyContent: "center",
                            paddingBottom: "10vh"
                        }}>
                            <button onClick={handleStart} style={closeBtnStyle}>
                                Почати навчання
                            </button>
                        </div>
                    </div>

                </div>


            </div>

        </AppShell>
    );
}
