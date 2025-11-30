export const RULE_PAGE_TO_BE = {
    id: "TO_BE",
    title: "To be (am / is / are)",
    subtitle:
        "Вивчення правила",

    sections: [
        {
            type: "meaning",
            title: "Що означає be",
            html:
                "<strong>Be</strong> = <em>бути / є / знаходитись</em>. " +
                "Використовуємо, щоб сказати <strong>хто</strong> я/він/вона, <strong>де</strong> я/ми, або <strong>який</strong>(а) я/щось.",
        },
        {
            type: "usage",
            title: "Коли вживаємо to be",
            badges: [
                "🆔 Я — хтось: <strong>I’m a student.</strong>",
                "🙂 Який(а): <strong>She’s happy.</strong>",
                "📍 Де: <strong>We’re at home.</strong>",
                "🕰️ Час/погода/вік: <strong>It’s Monday. I’m 7.</strong>",
            ],
            hint:
                "Про вік англійською кажуть із <em>to be</em>: <strong>I’m 7 (years old)</strong>, а не <em>I have 7 years</em>.",
        },
        {
            type: "forms",
            title: "Форми в Present Simple",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання", "Короткі відповіді"],
            rows: [
                ["I", "I am → I’m", "I am not → I’m not", "Am I…?", "Yes, I am. / No, I’m not."],
                ["He / She / It", "He is → He’s", "He is not → He isn’t / He’s not", "Is he…?", "Yes, he is. / No, he isn’t."],
                ["You / We / They", "They are → They’re", "They are not → They aren’t / They’re not", "Are they…?", "Yes, they are. / No, they aren’t."],
            ],
            hint:
                "Питання: <strong>Am/Is/Are + підмет + … ?</strong> Заперечення: <strong>am not / isn’t / aren’t</strong>. " +
                "<u>Не використовуємо</u> <em>do/does</em> з <em>to be</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’m from Ukraine.", "Я з України."],
                ["She’s a doctor.", "Вона лікар."],
                ["We’re tired but happy.", "Ми втомлені, але щасливі."],
                ["Is he at school?", "Він у школі?"],
                ["They aren’t ready.", "Вони не готові."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I are / I is</em> → ✅ <strong>I am</strong>",
                "❌ <em>He don’t is</em> → ✅ <strong>He isn’t</strong> (без <em>do/does</em>)",
                "❌ <em>I have 7 years</em> → ✅ <strong>I’m 7 (years old)</strong>",
                "❌ <em>She very happy</em> → ✅ <strong>She is very happy</strong>",
            ],
            note:
                "У Present Simple для <em>to be</em> питання й заперечення будуються <strong>без</strong> допоміжних <em>do/does</em>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (To be)",
        },
    ],
};
