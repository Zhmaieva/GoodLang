import React from "react";
import AppShell from "../AppShell";
import BrandHeader from "../BrandHeader";
import Card from "../Card";
import Badge from "../Badge";
import ConjugationTable from "../ConjugationTable";
import Examples from "../Examples";
import Note from "../Note";
import Footer from "../Footer";
import Trainer from "../training/Trainer.jsx";
import {useNavigate} from "react-router-dom";
import FooterBar from "../FooterBar.jsx";

export default function RulePage({ data, theme }) {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 600;

    const container = {
        maxWidth: 980,
        width: "100%",
        padding: isMobile ? "20px 14px 60px" : "36px 20px 80px",
        margin: "0 auto"
    };

    const SectionTitle = ({ children }) => (
        <div
            style={{
                margin: "4px 2px 8px",
                fontSize: isMobile ? 15 : 16,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                fontWeight: 800
            }}
        >
            {children}
        </div>
    );

    const textStyle = {
        fontSize: isMobile ? 14 : 15,
        lineHeight: 1.45
    };

    const renderSection = (section) => {
        switch (section.type) {

            case "meaning":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <p style={textStyle} dangerouslySetInnerHTML={{ __html: section.html }} />
                    </Card>
                );

            case "usage":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <div
                            style={{
                                display: "flex",
                                gap: 10,
                                flexWrap: "wrap",
                            }}
                        >
                            {section.badges.map((b, i) => (
                                <Badge key={i} theme={theme}>
                                    <span dangerouslySetInnerHTML={{ __html: b }} />
                                </Badge>
                            ))}
                        </div>
                        {section.hint && (
                            <p
                                style={{
                                    color: theme.muted,
                                    fontSize: isMobile ? 12 : 13,
                                    marginTop: 6
                                }}
                                dangerouslySetInnerHTML={{ __html: section.hint }}
                            />
                        )}
                    </Card>
                );

            case "forms":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <ConjugationTable
                            theme={theme}
                            headers={section.headers}
                            rows={section.rows}
                        />
                        {section.hint && (
                            <div
                                style={{
                                    color: theme.muted,
                                    fontSize: isMobile ? 12 : 13,
                                    marginTop: 6
                                }}
                                dangerouslySetInnerHTML={{ __html: section.hint }}
                            />
                        )}
                    </Card>
                );

            case "examples":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <Examples
                            theme={theme}
                            items={section.items}
                        />
                    </Card>
                );

            case "mistakes":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>

                        <ul style={{ ...textStyle, paddingLeft: 20 }}>
                            {section.bullets.map((b, i) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                            ))}
                        </ul>

                        {section.note && (
                            <Note theme={theme}>
                                <span dangerouslySetInnerHTML={{ __html: section.note }} />
                            </Note>
                        )}
                    </Card>
                );

            case "trainer":
                return (
                    <>
                        <SectionTitle>{section.title}</SectionTitle>
                        <Trainer notFocused nextRule={data.id} theme={theme} />
                    </>
                );

            default:
                return null;
        }
    };

    const navigate = useNavigate();
    const handleAnalyticsClick = () => navigate('/analytics');

    return (
        <AppShell theme={theme}>
            <div style={container}>
                <BrandHeader
                    theme={theme}
                    title={"GoodLang"}
                    subtitle={<>{data.title}</>}
                    right={
                        <button style={{
                            appearance: "none",
                            padding: "10px 14px",
                            fontWeight: 800,
                            fontSize: "0.95rem",
                            lineHeight: 1,
                            borderRadius: 999,
                            cursor: "pointer",

                            background: theme.accent ?? "#4ba36e",
                            color: "#fff",
                            border: "2px solid rgba(0,0,0,0.12)",
                            boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
                            fontFamily: "Nunito, system-ui, sans-serif",

                            /* 👇 REQUIRED for ellipsis */
                            maxWidth: 280,              // ← adjust (px) to fit your layout
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",

                            transition: "transform 120ms ease, filter 120ms ease",
                        }} onClick={handleAnalyticsClick}>
                            ← До списку правил
                        </button>
                    }
                />

                <section style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {data.sections.map((section, i) => (
                        <div key={i}>{renderSection(section)}</div>
                    ))}
                </section>

                <FooterBar theme={theme} />
            </div>
        </AppShell>
    );
}
