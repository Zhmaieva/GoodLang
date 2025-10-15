import React from "react";
import AppShell from "../AppShell";
import BrandHeader from "../BrandHeader";
import Card from "../Card";
import Badge from "../Badge";
import ConjugationTable from "../ConjugationTable";
import Examples from "../Examples";
import Note from "../Note";
import Footer from "../Footer";
import TrainerToBe from "../TrainerToBe";

export default function RulePage({ data, theme }) {
    const container = { maxWidth: 980, width: "100%", padding: "36px 20px 80px", margin: "0 auto" };
    const grid = { display: "grid", gridTemplateColumns: "1fr", gap: 16 };

    const SectionTitle = ({ children }) => (
        <div style={{
            margin: "4px 2px 8px",
            fontSize: 16,
            letterSpacing: ".05em",
            textTransform: "uppercase",
            fontWeight: 800
        }}>
            {children}
        </div>
    );

    const renderSection = (section) => {
        switch (section.type) {
            case "meaning":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <p dangerouslySetInnerHTML={{ __html: section.html }} />
                    </Card>
                );

            case "usage":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            {section.badges.map((b, i) => (
                                <Badge key={i} theme={theme}>
                                    <span dangerouslySetInnerHTML={{ __html: b }} />
                                </Badge>
                            ))}
                        </div>
                        {section.hint && (
                            <p style={{ color: theme.muted, fontSize: 13 }} dangerouslySetInnerHTML={{ __html: section.hint }} />
                        )}
                    </Card>
                );

            case "forms":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <ConjugationTable theme={theme} headers={section.headers} rows={section.rows} />
                        {section.hint && (
                            <div style={{ color: theme.muted, fontSize: 13 }} dangerouslySetInnerHTML={{ __html: section.hint }} />
                        )}
                    </Card>
                );

            case "examples":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <Examples theme={theme} items={section.items} />
                    </Card>
                );

            case "mistakes":
                return (
                    <Card theme={theme}>
                        <SectionTitle>{section.title}</SectionTitle>
                        <ul>
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
                        <div style={{ marginTop: 7 }}>
                            <SectionTitle>{section.title}</SectionTitle>
                        </div>
                        <TrainerToBe theme={theme} bank={section.bank} />
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <AppShell theme={theme}>
            <div style={container}>
                <BrandHeader theme={theme} title={data.title} subtitle={<>{data.subtitle}</>} />
                <section style={grid}>
                    {data.sections.map((section, i) => (
                        <div key={i}>{renderSection(section)}</div>
                    ))}
                </section>
                <Footer theme={theme}>
                    © 2025 StepLang • Пояснення правила <em>{data.title}</em>
                </Footer>
            </div>
        </AppShell>
    );
}
