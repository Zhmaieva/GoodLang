import React, { useMemo } from "react";
import AppShell from "../AppShell";
import BrandHeader from "../BrandHeader";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import Card from "../Card";
import Badge from "../Badge";
import ConjugationTable from "../ConjugationTable";
import Examples from "../Examples";
import Note from "../Note";
import Footer from "../Footer";
import TrainerToBe from "../TrainerToBe";

export default function RuleToBePage() {
    const theme = useMemo(() => ({
        bg: "#fff3df",
        card: "#fffdf8",
        accent: "#ff6138",
        accentDark: "#d74e2a",
        green: "#4ba36e",
        greenDark: "#2d6f48",
        blue: "#3a6ea5",
        text: "#3a2a1d",
        muted: "#a47856",
        bad: "#ef476f",
        warn: "#ffd166",
        good: "#4ba36e",
        radius: 20,
    }), []);

    const container = { maxWidth: 980, width: "100%", padding: "36px 20px 80px", margin: "0 auto" };
    const grid = { display: "grid", gridTemplateColumns: "1fr", gap: 16 };

    const handleStartPractice = () => {
        alert("Запуск тренування по правилу: To be (am/is/are). Підʼєднай навігацію до екрана практики.");
    };

    return (
        <AppShell theme={theme}>
            <div style={container}>
                <BrandHeader
                    theme={theme}
                    title="To be (am / is / are)"
                    subtitle={<>
                        Стиль <em>Essential Grammar in Use</em>: просто, з прикладами і мінімумом термінів
                    </>}
                    right={
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <SecondaryButton theme={theme} onClick={() => history.back()}>← Назад</SecondaryButton>
                            <PrimaryButton theme={theme} onClick={handleStartPractice}>
                                Тренувати це правило
                            </PrimaryButton>
                        </div>
                    }
                />

                <section style={grid}>
                    {/* 0. Що означає be */}
                    <Card theme={theme}>
                        <SectionTitle theme={theme}>Що означає <em>be</em></SectionTitle>
                        <p><strong>Be</strong> = <em>бути / є / знаходитись</em>. Використовуємо, щоб сказати <strong>хто</strong> я/він/вона, <strong>де</strong> я/ми, або <strong>який</strong>(а) я/щось.</p>
                    </Card>

                    {/* 1. Коли вживаємо to be */}
                    <Card theme={theme}>
                        <SectionTitle theme={theme}>Коли вживаємо <em>to be</em></SectionTitle>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                            <Badge theme={theme}>🆔 Я — хтось: <strong>I’m a student.</strong></Badge>
                            <Badge theme={theme}>🙂 Який(а): <strong>She’s happy.</strong></Badge>
                            <Badge theme={theme}>📍 Де: <strong>We’re at home.</strong></Badge>
                            <Badge theme={theme}>🕰️ Час/погода/вік: <strong>It’s Monday. I’m 7.</strong></Badge>
                        </div>
                        <p style={{ color: theme.muted, fontSize: 13 }}>
                            Про вік англійською кажуть із <em>to be</em>: <strong>I’m 7 (years old)</strong>, а не <em>I have 7 years</em>.
                        </p>
                    </Card>

                    {/* 2. Форми в Present Simple */}
                    <Card theme={theme}>
                        <SectionTitle theme={theme}>Форми в Present Simple</SectionTitle>
                        <ConjugationTable
                            theme={theme}
                            rows={[
                                ["I", "I am → I’m", "I am not → I’m not", "Am I…?", "Yes, I am. / No, I’m not."],
                                ["He / She / It", "He is → He’s", "He is not → He isn’t / He’s not", "Is he…?", "Yes, he is. / No, he isn’t."],
                                ["You / We / They", "They are → They’re", "They are not → They aren’t / They’re not", "Are they…?", "Yes, they are. / No, they aren’t."],
                            ]}
                        />
                        <div style={{ color: theme.muted, fontSize: 13 }}>
                            Питання: <strong>Am/Is/Are + підмет + … ?</strong> Заперечення: <strong>am not / isn’t / aren’t</strong>.
                            <u> Не використовуємо</u> <em>do/does</em> з <em>to be</em>.
                        </div>
                    </Card>

                    {/* 3. Приклади */}
                    <Card theme={theme}>
                        <SectionTitle theme={theme}>Приклади</SectionTitle>
                        <Examples
                            items={[
                                ["I’m from Ukraine.", "Я з України."],
                                ["She’s a doctor.", "Вона лікар."],
                                ["We’re tired but happy.", "Ми втомлені, але щасливі."],
                                ["Is he at school?", "Він у школі?"],
                                ["They aren’t ready.", "Вони не готові."],
                            ]}
                            theme={theme}
                        />
                    </Card>

                    {/* 4. Типові помилки */}
                    <Card theme={theme}>
                        <SectionTitle theme={theme}>Типові помилки</SectionTitle>
                        <ul>
                            <li>❌ <em>I are / I is</em> → ✅ <strong>I am</strong></li>
                            <li>❌ <em>He don’t is</em> → ✅ <strong>He isn’t</strong> (без <em>do/does</em>)</li>
                            <li>❌ <em>I have 7 years</em> → ✅ <strong>I’m 7 (years old)</strong></li>
                            <li>❌ <em>She very happy</em> → ✅ <strong>She is very happy</strong></li>
                        </ul>
                        <Note theme={theme}>
                            У Present Simple для <em>to be</em> питання й заперечення будуються <strong>без</strong> допоміжних <em>do/does</em>.
                        </Note>
                    </Card>

                    {/* 5. Тренажер (локальний) */}
                    <div style={{marginTop: 7}}>
                        <SectionTitle theme={theme}>Міні-тренажер (To be)</SectionTitle>
                    </div>
                    <TrainerToBe theme={theme} />
                </section>

                <Footer theme={theme}>© 2025 StepLang • Пояснення правила <em>to be</em></Footer>
            </div>
        </AppShell>
    );
}

function SectionTitle({ children, theme }) {
    return (
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
}
