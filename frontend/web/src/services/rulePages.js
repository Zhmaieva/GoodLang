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
            ]},
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

// A1 rule pages (following same structure as RULE_PAGE_TO_BE)

export const RULE_PAGE_THERE_IS_ARE = {
    id: "THERE_IS_ARE",
    title: "There is / There are",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає",
            html: "<strong>There is / There are</strong> використовуємо, щоб сказати, що щось є або існує в певному місці."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Є однина: <strong>There is a book on the table.</strong>",
                "Є множина: <strong>There are two cats.</strong>",
                "Питання: <strong>Is there a problem?</strong>"
            ],
            hint: "У коротких відповідях: Yes, there is. / No, there isn’t. / Yes, there are. / No, there aren’t."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Вид", "Приклад"],
            rows: [
                ["Ствердження (однина)", "There is a dog."],
                ["Ствердження (множина)", "There are three chairs."],
                ["Заперечення", "There isn't a pen. / There aren't any pens."],
                ["Питання", "Are there any apples?"]
            ],
            hint: "Для кількостей використовуємо any у запереченнях/питаннях."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["There is a supermarket near my house.", "Поруч з моїм домом є супермаркет."],
                ["Are there any buses tonight?", "Чи є сьогодні ввечері автобуси?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>There is three cats</em> → ✅ <strong>There are three cats</strong>.",
                "❌ <em>There aren't any informations</em> → ✅ <strong>information</strong> (uncountable)."
            ],
            note: "Пам'ятай узгодження дієслова з кількістю (is — однина, are — множина)."
        },
        { type: "trainer", title: "Міні-тренажер (There is / There are)" }
    ]
};

export const RULE_PAGE_HAVE_HAVE_GOT = {
    id: "HAVE_HAVE_GOT",
    title: "Have / have got",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає",
            html: "<strong>Have / have got</strong> — спосіб говорити про наявність або приналежність (I have a car / I've got a car)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Володіння: <strong>I have a sister.</strong>",
                "Британський стиль: <strong>I've got a bike.</strong>",
                "Стан/симптом: <strong>I have a cold.</strong>"
            ],
            hint: "В американській англійській частіше використовують 'have', в британській — 'have got' у розмовній мові."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання"],
            rows: [
                ["I", "I have / I've got", "I don't have / I haven't got", "Do I have? / Have I got?"],
                ["He/She/It", "He has / He's got", "He doesn't have / He hasn't got", "Does he have? / Has he got?"]
            ],
            hint: "'have got' використовує інвертовану форму 'Have you got...?'"
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I have two brothers.", "У мене двоє братів."],
                ["Has she got a car?", "У неї є машина?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I have got two childrens</em> → ✅ <strong>children</strong> (plural irregular).",
                "❌ Вживати 'have got' у формальному письмі надто часто."
            ],
            note: "У запереченнях: 'haven't got' або 'don't have' (обидва правильні, нюанс стилю)."
        },
        { type: "trainer", title: "Міні-тренажер (Have / have got)" }
    ]
};

export const RULE_PAGE_POSSESSIVE_S = {
    id: "POSSESSIVE_S",
    title: "Possessive 's",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає",
            html: "<strong>'s</strong> вказує на належність (Mary's book = книга Марі)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Особиста власність: <strong>John's phone</strong>",
                "Часи/відрізки: <strong>today's news</strong>",
                "Групи: <strong>people's opinion</strong>"
            ],
            hint: "Для множини, що закінчується на -s, додаємо лише апостроф: <em>the boys' room</em>."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Кейc", "Приклад"],
            rows: [
                ["One person", "Anna's bag"],
                ["Plural (-s)", "The students' classroom"],
                ["Irregular plural", "Children's toys"]
            ],
            hint: "Не використовувати 'of' і 's' одночасно: 'the leg of the table' або 'the table's leg' (обидва можливі, але різний стиль)."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The teacher's book.", "Книга вчителя."],
                ["The children's playground.", "Дитячий майданчик."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>the childrens' toys</em> → ✅ <strong>children's toys</strong>.",
                "❌ <em>Johns car</em> → ✅ <strong>John's car</strong> (потрібен апостроф)."
            ],
            note: "Апостроф важливий — він змінює значення."
        },
        { type: "trainer", title: "Міні-тренажер (Possessive 's)" }
    ]
};

export const RULE_PAGE_ARTICLES = {
    id: "ARTICLES",
    title: "Articles (a / an / the)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають артиклі",
            html: "<strong>a / an</strong> — невизначений артикль (one of many). <strong>the</strong> — означений (specific)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Новий/будь-який: <strong>a dog / an apple</strong>",
                "Відомий/особливий: <strong>the sun / the book I read</strong>"
            ],
            hint: "'a' перед приголосним звуком, 'an' перед голосним звуком."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Ситуація", "Приклад"],
            rows: [
                ["Неозначений (вперше згадується)", "I saw a dog."],
                ["Означений (відомо, про що йдеться)", "The dog is black."],
                ["Без артикля (іменники у множині/uncount при загальній згадці)", "Cats are friendly. Milk is white."]
            ],
            hint: "Іменники з назвами міст/країн зазвичай без 'the' (except some)."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I need an umbrella.", "Мені потрібна парасолька."],
                ["The teacher is late.", "Вчитель запізнюється."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I have the car</em> (коли мова про будь-який автомобіль) → ✅ <strong>I have a car</strong>.",
                "❌ <em>an university</em> (звучить як /juː/) → ✅ <strong>a university</strong>."
            ],
            note: "Пам'ятай про звучання на початку слова, а не про букву."
        },
        { type: "trainer", title: "Міні-тренажер (Articles)" }
    ]
};

export const RULE_PAGE_DEMONSTRATIVES = {
    id: "DEMONSTRATIVES",
    title: "Demonstratives (this, that, these, those)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають",
            html: "Вказівні займенники використовуються, щоб вказувати на предмети, людей або ідеї і показувати, <strong>які саме</strong> ми маємо на увазі.\n" +
                "Вони залежать від <strong>відстані</strong> (близько / далеко) та <strong>кількості</strong> (однина / множина).\n"
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Один предмет близько: <strong>this book</strong>",
                "Багато предметів близько: <strong>these books</strong>",
                "Один далеко: <strong>that tree</strong>",
                "Багато далеко: <strong>those trees</strong>"
            ],
            hint: "this/these — однина/множина для близьких речей; that/those — для далеких."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["This is my phone.", "Це мій телефон (поруч)."],
                ["Those are my friends.", "Ось мої друзі (далеко / показую на відстані)."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>this books</em> → ✅ <strong>these books</strong>.",
                "❌ <em>those is</em> → ✅ <strong>those are</strong>."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Demonstratives)" }
    ]
};

export const RULE_PAGE_PERSONAL_PRONOUNS = {
    id: "PERSONAL_PRONOUNS",
    title: "Personal pronouns",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Особові займенники замінюють іменники: <strong>I, you, he, she, it, we, they</strong>."
        },
        {
            type: "usage",
            title: "Коли вживаються",
            badges: [
                "Вживаються коли потрібно замінити іменник, щоб не повторювати його."
            ],
            hint: "Пам'ятай розрізняти форму підмета й форму об'єкта (I → me, he → him)."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Підмет", "Об'єкт"],
            rows: [
                ["I", "me"],
                ["you", "you"],
                ["he", "him"],
                ["she", "her"],
                ["it", "it"],
                ["we", "us"],
                ["they", "them"]
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She likes him.", "Вона йому подобається."],
                ["They saw us.", "Вони побачили нас."]
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Personal pronouns)" }
    ]
};

export const RULE_PAGE_SIMPLE_ADJ = {
    id: "SIMPLE_ADJ",
    title: "Simple adjectives",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Прикметники описують предмет або людину: <strong>big, small, happy, sad</strong>."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Перед іменником: <strong>a big house</strong>",
                "Після дієслова to be: <strong>She is happy</strong>"
            ],
            hint: "Прикметники не змінюються за родом/числом в англійській."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["A small cat.", "Маленький кіт."],
                ["He is tall.", "Він високий."]
            ]
        },

        { type: "trainer", title: "Міні-тренажер (Simple adjectives)" }
    ]
};

export const RULE_PAGE_PRESENT_SIMPLE_FREQ = {
    id: "PRESENT_SIMPLE_FREQ",
    title: "Present Simple",
    subtitle: "Час для звичок, фактів і регулярних дій",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "<strong>Present Simple — це граматичний час в англійській мові.</strong> Він використовується, щоб говорити про факти, звички, регулярні дії та розклад."
        },

        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Звички: <strong>I get up at 7.</strong>",
                "Регулярні дії: <strong>She works every day.</strong>",
                "Частота: <strong>They often travel.</strong>"
            ],
            hint: "Прислівники частоти зазвичай стоять перед основним дієсловом, але після 'to be'."
        },

        {
            type: "forms",
            title: "Форми Present Simple",
            headers: ["Тип", "I / You / We / They", "He / She / It"],
            rows: [
                ["Ствердження", "I work.", "She works."],
                ["Заперечення", "I do not (don't) work.", "She does not (doesn't) work."],
                ["Питання", "Do you work?", "Does she work?"]
            ],
            hint: "У запереченнях і питаннях після do/does дієслово завжди в базовій формі (без -s)."
        },

        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I always drink water in the morning.", "Я завжди пʼю воду вранці."],
                ["She doesn't eat meat.", "Вона не їсть мʼяса."],
                ["Do they work on Sundays?", "Вони працюють по неділях?"]
            ]
        },

        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He don't work</em> → ✅ <strong>He doesn't work</strong>",
                "❌ <em>She doesn't works</em> → ✅ <strong>She doesn't work</strong>",
                "❌ <em>Does she works?</em> → ✅ <strong>Does she work?</strong>"
            ]
        },

        { type: "trainer", title: "Міні-тренажер (Present Simple)" }
    ]
};
``

export const RULE_PAGE_NEGATION_DONT_DOESNT = {
    id: "NEGATION_DONT_DOESNT",
    title: "Negation with don’t / doesn’t",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Для утворення заперечення в Present Simple використовуємо <strong>do not / don't</strong> або <strong>does not / doesn't</strong>."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "I/You/We/They + don't + V",
                "He/She/It + doesn't + V"
            ],
            hint: "В основному дієслові повертається форма без -s після допоміжного don't/doesn't."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I don't like coffee.", "Мені не подобається кава."],
                ["She doesn't work on Sundays.", "Вона не працює по неділях."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He don't</em> → ✅ <strong>He doesn't</strong>.",
                "❌ <em>She doesn't likes</em> → ✅ <strong>She doesn't like</strong>."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Negation with don't/doesn't)" }
    ]
};

export const RULE_PAGE_YES_NO_Q = {
    id: "YES_NO_Q",
    title: "Yes/No questions",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Питання, на які відповідають 'Yes' або 'No'. Часто потребують допоміжного дієслова (Do/Does/Am/Is/Are)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Do/Does + підмет + V... ?",
                "Am/Is/Are + підмет + ... ?"
            ],
            hint: "Відповіді: Yes, I do. / No, she doesn't. / Yes, he is."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Do you like pizza? — Yes, I do.", "Ти любиш піцу? — Так."],
                ["Is he at home? — No, he isn't.", "Він вдома? — Ні."]
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Yes/No questions)" }
    ]
};

export const RULE_PAGE_WH_Q = {
    id: "WH_Q",
    title: "Wh-questions",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Питання із словом-інформаційним маркером: who, what, where, when, why, how."
        },
        {
            type: "usage",
            title: "Як вживається",
            badges: [
                "Коли wh-слово не є підметом, ми використовуємо допоміжне дієслово: do / does / did / is / are / was / were",
                "Якщо wh-слово є підметом — допоміжне дієслово не використовується"
            ]},
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Where do you live? (wh-слово НЕ є підметом)", "Де ти живеш?"],
                ["What is your name? (wh-слово НЕ є підметом)", "Як тебе звати?"],
                ["Who called you yesterday? (wh-слово Є підметом)", "Хто подзвонив тобі вчора?"],
                ["What makes you happy? (wh-слово Є підметом)", "Що робить тебе щасливим?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Who did call you?</em> → ✅ <strong>Who called you?</strong>",
                "❌ <em>What does make you happy?</em> → ✅ <strong>What makes you happy?</strong>"
            ]},
        { type: "trainer", title: "Міні-тренажер (Wh-questions)" }
    ]
};

export const RULE_PAGE_IMPERATIVES = {
    id: "IMPERATIVES",
    title: "Imperatives",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Наказовий спосіб: інструкції, поради, прохання."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Команди: <strong>Sit down!</strong>",
                "Поради: <strong>Try this.</strong>",
                "Заперечення: <strong>Don't be late.</strong>"
            ],
            hint: "Інфінітив без 'to' у формі наказу."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Please, sit down.", "Будь ласка, сідай."],
                ["Don't smoke here.", "Не паліть тут."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>You close the door.</em> → ✅ <strong>Close the door.</strong>",
                "❌ <em>You don’t be late.</em> → ✅ <strong>Don’t be late.</strong>"
            ]},
        { type: "trainer", title: "Міні-тренажер (Imperatives)" }
    ]
};

export const RULE_PAGE_CAN_CANT = {
    id: "CAN_CANT",
    title: "Can / can't",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "<strong>Can</strong> виражає вміння або можливість; <strong>can't</strong> — відсутність вміння/заборона."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Вміння: <strong>I can swim.</strong>",
                "Можливість/дозвіл: <strong>Can I open the window?</strong>",
                "Заперечення: <strong>I can't come.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She can speak English.", "Вона вміє говорити англійською."],
                ["No, you can't park here.", "Ні, тут паркуватися не можна."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I can to swim.</em> → ✅ <strong>I can swim.</strong>",
                "❌ <em>He cans drive.</em> → ✅ <strong>He can drive.</strong>"
            ]},
        { type: "trainer", title: "Міні-тренажер (Can / can't)" }
    ]
};

export const RULE_PAGE_THERE_ISNT_ARENT_ANY = {
    id: "THERE_ISNT_ARENT_ANY",
    title: "There isn’t / aren’t any",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Заперечні форми 'there isn't' / 'there aren't' або 'there are no' для відсутності чогось."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Заперечення однини: <strong>There isn't a shop.</strong>",
                "Заперечення множини: <strong>There aren't any eggs.</strong>",
                "Або: <strong>There are no problems.</strong>"
            ],
            hint: "'any' часто використовується в запитаннях і запереченнях."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["There aren't any bananas.", "Бананів немає."],
                ["There is no milk in the fridge.", "У холодильнику немає молока."]
            ]
        },
        { type: "trainer", title: "Міні-тренажер (There isn't / aren't any)" }
    ]
};

export const RULE_PAGE_COUNT_UNCOUNT = {
    id: "COUNT_UNCOUNT",
    title: "Countable / uncountable nouns",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Деякі іменники можна порахувати (apples), інші — ні (water, information)."
        },
        {
            type: "usage",
            title: "Як вживати",
            badges: [
                "Countable: many / a few / two apples",
                "Uncountable: much / a little / some water"
            ],
            hint: "Обережно з 'a' — його не використовують з uncountable."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I have three books.", "У мене три книжки."],
                ["There is some sugar.", "Є трохи цукру."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I need a advice.</em> → ✅ <strong>I need advice.</strong>",
                "❌ <em>Two advices</em> → ✅ <strong>Two pieces of advice</strong>",
                "❌ <em>Many money</em> → ✅ <strong>Much money</strong>"
            ]},
        { type: "trainer", title: "Міні-тренажер (Countable / Uncountable)" }
    ]
};

export const RULE_PAGE_BE_FROM = {
    id: "BE_FROM_NATIONALITY",
    title: "Be from (nationality)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "<strong>Be from</strong> використовується для вказівки походження/національності: <em>I am from Ukraine.</em>"
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Країна/місто: <strong>She is from Ukraine.</strong>",
                "Національність через 'be' + adjective: <strong>He is Ukrainian.</strong>"
            ],
            hint: "Для національності можна використовувати 'from' або прикметник (I'm Ukrainian)."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I'm from Spain.", "Я з Іспанії."],
                ["Are you from London?", "Ти з Лондона?"]
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Be from / nationality)" }
    ]
};

export const RULE_PAGE_PRESENT_CONT_NOW = {
    id: "PRESENT_CONT_NOW",
    title: "Present Continuous",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: [
                "<strong>Present Continuous</strong> описує <strong>дію</strong>, що відбувається <strong>зараз</strong>.<br>" +
                "<strong>Present Continuous</strong> також використовують для <strong>запланованих майбутніх планів</strong>, " +
                "якщо це вже <strong>точні домовленості</strong> (arrangements)."
            ]
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "⏳ Дія зараз: <strong>She is talking on the phone.</strong>",
                "📅 Особисті плани: <strong>I’m meeting my friend tomorrow.</strong>",
                "🚂 Розклад, якщо це «моя» організована подія: <strong>We’re leaving at 6.</strong>",
                "👥 Домовленість з кимось: <strong>She’s having dinner with her parents on Sunday.</strong>",
            ],
            hint:
                "Контекст (future time) робить Present Continuous «майбутнім»."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Ствердження", "Заперечення", "Питання"],
            rows: [
                ["I am working.", "I am not working.", "Am I working?"],
                ["You are working.", "You are not working.", "Are you working?"],
                ["He is working.", "He is not working.", "Is he working?"],
                ["She is working.", "She is not working.", "Is she working?"],
                ["It is working.", "It is not working.", "Is it working?"],
                ["We are working.", "We are not working.", "Are we working?"],
                ["They are working.", "They are not working.", "Are they working?"]
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["They are playing football now.", "Вони зараз грають у футбол."],
                ["We’re having a party on Friday.", "У нас вечірка в п’ятницю."],
                ["Are you meeting him tomorrow?", "Ти зустрічаєшся з ним завтра?"],
                ["She isn’t working this weekend.", "Вона не працює цього вікенду."],
            ]
        },
        {
            type: "mistakes",
            title: "Present Continuous VS will",
            bullets: [
                "<em>Дія вже йде?</em> → ✅ <strong>Present Continuous</strong>",
                "<em>Це спонтанне рішення / обіцянка?</em> → ✅ <strong>will</strong>",
                "<em>Є домовленість на майбутнє?</em> → ✅ <strong>Present Continuous</strong>",
                "<em>Є слово now?</em> → ✅ <strong>Present Continuous</strong>"
            ],
            note:
                "Завжди додавай <strong>future time</strong> (tomorrow, next week…), щоб було зрозуміло, що це про майбутнє.",
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I read now.</em> → ✅ <strong>I am reading now.</strong>",
                "❌ <em>I can reading.</em> → ✅ <strong>I can read.</strong>",
                "❌ <em>She is liking this movie.</em> → ✅ <strong>She likes this movie.</strong>",
                "❌ <em>You are working now?</em> → ✅ <strong>Are you working now?</strong>",
                "❌ <em>I am living in Ukraine.</em> → ✅ <strong>I live in Ukraine.</strong>",
                "❌ <em>You are working now?</em> → ✅ <strong>Are you working now?</strong>",
                "❌ <em>I meet my friend tomorrow.</em> → ✅ <strong>I’m meeting my friend tomorrow.</strong>.",
            ],
        },
        { type: "trainer", title: "Міні-тренажер (Present Continuous)" }
    ]
};

export const RULE_PAGE_PREP_PLACE = {
    id: "PREP_PLACE",
    title: "Prepositions of place",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Прийменники місця вказують розташування."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Межі всередині → IN (in the box)",
                "Контакт із поверхнею → ON (on the table)",
                "Де саме відбувається дія, не “всередині” і не “на поверхні” → AT (at the door)",
                "Два об’єкти поруч (безпосередньо, майже впритул) → NEXT TO / BESIDE (next to the house)",
                "Два об’єкти поруч (є відстань, але це все ще близько) → NEAR / CLOSE TO (near the park)",
                "Між двома об’єктами → BETWEEN (between the houses)",
                "Серед багатьох / серед натовпу → AMONG (among the people)",
                "Вище об’єкта → ABOVE (above the clouds)",
                "Нижче об’єкта → BELOW (below the surface)",
                "Над об’єктом → OVER (over the bridge)",
                "Під об’єктом → UNDER (under the table)",
                "Перед об’єктом → IN FRONT OF (in front of the house)",
                "Позаду об’єкта → BEHIND (behind the car)",
                "Всередині з чіткими межами → WITHIN (within the city limits)",
                "Рух усередину (уяви вхід у межі) → INTO (go into the room)",
                "Рух на поверхню (уяви приземлення) → ONTO (jump onto the bed)",
                "Рух назовні (уяви вихід із меж) → OUT OF (out of the box)"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The cat is on the roof.", "Кіт на даху."],
                ["The keys are in my bag.", "Ключі в моїй сумці."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I am in the street.</em> → ✅ <strong>I am on the street.</strong>",
                "❌ <em>The picture is in the wall.</em> → ✅ <strong>The picture is on the wall.</strong>",
                "❌ <em>I am at the room.</em> → ✅ <strong>I am in the room.</strong>",
                "❌ <em>She is in the bus.</em> → ✅ <strong>She is on the bus.</strong> ON the bus, train, plane = публічний транспорт як платформа / сервіс, а не “коробка”.",
                "❌ <em>He is on the car.</em> → ✅ <strong>He is in the car.</strong> IN the car, taxi = контейнер.",
                "❌ <em>The keys are on my bag.</em> → ✅ <strong>The keys are in my bag.</strong>",
                "❌ <em>The shop is in the corner.</em> → ✅ <strong>The shop is at the corner.</strong>",
                "❌ <em>There is a mirror at the wall.</em> → ✅ <strong>There is a mirror on the wall.</strong>",
                "❌ <em>I live at Poland.</em> → ✅ <strong>I live in Ukraine.</strong>",
                "❌ <em>The cat is under of the table.</em> → ✅ <strong>The cat is under the table.</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Prepositions of place)" }
    ]
};

export const RULE_PAGE_PREP_TIME = {
    id: "PREP_TIME",
    title: "Prepositions of time",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Прийменники часу вказують, <strong>коли</strong> щось відбувається."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Точний момент / година / конкретний час → AT (at 5 o’clock, at night)",
                "Дні, дати, конкретні дні тижня → ON (on Monday, on July 5th)",
                "Довгі періоди часу → IN (in the morning, in 2025, in summer)",
                "Через певний час від зараз → IN (in two hours)",
                "Початок періоду → FROM (from Monday)",
                "Кінець періоду → TO / TILL / UNTIL (to Friday, until 6 pm)",
                "Тривалість (як довго) → FOR (for two hours)",
                "Початок і тривалість до тепер → SINCE (since 2020)",
                "До певного моменту (не пізніше) → BY (by tomorrow)",
                "Під час процесу / події → DURING (during the meeting)",
                "Одразу після → AFTER (after work)",
                "Раніше ніж → BEFORE (before lunch)",
                "Приблизний час → AROUND / ABOUT (around 7 pm)"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The meeting starts at 9.", "Зустріч починається о 9."],
                ["I work on Mondays.", "Я працюю по понеділках."],
                ["She was born in 1998.", "Вона народилася у 1998 році."],
                ["We will finish in two hours.", "Ми закінчимо через дві години."],
                ["He has lived here since 2015.", "Він живе тут з 2015 року."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>In Monday</em> → ✅ <strong>On Monday</strong>",
                "❌ <em>On 5 o’clock</em> → ✅ <strong>At 5 o’clock</strong>",
                "❌ <em>At the morning</em> → ✅ <strong>In the morning</strong>",
                "❌ <em>I will call you after 2 hours.</em> → ✅ <strong>I will call you in 2 hours.</strong>",
                "❌ <em>I live here from 5 years.</em> → ✅ <strong>I have lived here for 5 years.</strong>",
                "❌ <em>I study here since two years.</em> → ✅ <strong>I have studied here for two years.</strong>",
                "❌ <em>We finished until 6 pm.</em> → ✅ <strong>We finished by 6 pm.</strong>",
                "❌ <em>I was tired on the meeting.</em> → ✅ <strong>I was tired during the meeting.</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Prepositions of time)" }
    ]
};


export const RULE_PAGE_POSSESSIVE_ADJECTIVES = {
    id: "POSSESSIVE_ADJECTIVES",
    title: "Possessive adjectives",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке possessive adjectives",
            html:
                "<strong>Possessive adjectives</strong> показують, <em>кому щось належить</em>. " +
                "Вони <em>завжди стоять перед іменником</em> і не вживаються самостійно.",
        },
        {
            type: "usage",
            title: "Коли й як вживаємо",
            badges: [
                "👤 Належність → <strong>my book, her phone</strong>",
                "🧍 Залежить від власника, не від предмета",
                "📍 Стоять <em>перед</em> іменником: <strong>my house</strong>",
            ],
            hint:
                "Не плутай з <em>possessive pronouns</em> (mine, yours) — " +
                "вони використовуються <em>без іменника</em>.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Особа", "Присвійний прикметник", "Приклад"],
            rows: [
                ["I", "my", "my bag"],
                ["you", "your", "your keys"],
                ["he", "his", "his car"],
                ["she", "her", "her idea"],
                ["it", "its", "its color"],
                ["we", "our", "our plan"],
                ["they", "their", "their friends"],
            ],
            hint:
                "<strong>Its</strong> — присвійний прикметник. " +
                "<strong>It’s</strong> = <em>it is</em> (❌ не плутати).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["This is my laptop.", "Це мій ноутбук."],
                ["She forgot her keys.", "Вона забула свої ключі."],
                ["The dog hurt its leg.", "Собака поранив свою лапу."],
                ["We like our new apartment.", "Нам подобається наша нова квартира."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He lost his phone</em> → правильно (НЕ <em>her</em>) — залежить від власника",
                "❌ <em>its</em> vs <em>it’s</em> → <strong>its</strong> (присвійний), <strong>it’s</strong> = it is",
                "❌ Подвійна належність → <em>my the book</em> → ❌",
                "❌ Використання без іменника → <em>This is my.</em> → ❌ (потрібно <em>mine</em>)",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Possessive adjectives)",
        },
    ],
};


export const RULE_PAGE_ORDINALS_DATES = {
    id: "ORDINALS_DATES",
    title: "Ordinal numbers + dates",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Порядкові числа (first, second, third...) використовуються для дат, порядку та порядкових позицій."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Дати: <strong>May 1st / the first of May</strong>",
                "Місце: <strong>She is first in line.</strong>"
            ],
            hint: "Зверни увагу на написання 1st, 2nd, 3rd у англійському форматі."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["My exam is on the 21st of June.", "Мій іспит — 21 червня."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>My birthday is on 21 May</em> → ✅ <strong>My birthday is on the 21st of May</strong>",
                "❌ <em>Today is 1 May</em> → ✅ <strong>Today is the 1st of May</strong>",
                "❌ <em>He was born in 3 July</em> → ✅ <strong>He was born on 3rd July</strong>",
                "❌ <em>We met on May the five</em> → ✅ <strong>We met on May the fifth</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Ordinals & dates)" }
    ]
};

export const RULE_PAGE_WOULD_LIKE_TO = {
    id: "WOULD_LIKE_TO",
    title: "Would like to + verb",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "<strong>Would like to</strong> — ввічливе бажання або прохання."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Замовляння: <strong>I would like a coffee, please.</strong>",
                "Плани: <strong>He would like to visit Paris.</strong>"
            ],
            hint: "Стислий варіант: <strong>I'd like...</strong>"
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I'd like some water.", "Я б хотів трохи води."],
                ["Would you like to come?", "Хочеш прийти?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I would like eat.</em> → ✅ <strong>I would like to eat.</strong>",
                "❌ <em>I want to order coffee.</em> → ✅ <strong>I would like to order coffee.</strong> - граматично ок, але want = факт бажання, would like - ввічливо замовити",
                "❌ <em>I would like that you come.</em> → ✅ <strong>I would like you to come.</strong>",
                "❌ <em>Would you like come with us?</em> → ✅ <strong>Would you like to come with us?</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Would like to)" }
    ]
};

export const RULE_PAGE_LETS = {
    id: "LETS",
    title: "Let's + verb",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "<strong>Let's</strong> використовується для пропозицій."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Пропозиція: <strong>Let's have lunch.</strong>",
                "Ввічлива команда для групи: <strong>Let's be quiet.</strong>"
            ],
            hint: "Після 'Let's' завжди інфінітив без 'to'."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Let's watch a movie.", "Давайте подивимося фільм."],
                ["Let's not argue.", "Давайте не сперечатися."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Let’s to go home.</em> → ✅ <strong>Let’s go home.</strong>",
                "❌ <em>Let’s going to the park.</em> → ✅ <strong>Let’s go to the park.</strong>",
                "❌ <em>Let us go?</em> → ✅ <strong>Let’s go.</strong>",
                "❌ <em>Let’s we start now.</em> → ✅ <strong>Let’s start now.</strong>",
                "❌ <em>Let’s don’t talk about it.</em> → ✅ <strong>Let’s not talk about it.</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Let's)" }
    ]
};

export const RULE_PAGE_TOO_VERY = {
    id: "TOO_VERY",
    title: "Too / very",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "'Very' підсилює прикметник (very good). 'Too' означає надмір (too hot — занадто гаряче)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Very + adj: <strong>very interesting</strong>",
                "Too + adj: <strong>too expensive</strong> (часто з 'to' + infinitive: too hot to touch)"
            ],
            hint: "'Too' зазвичай має негативний відтінок або означає «достатньо, щоб перешкоджати»."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It's very cold today.", "Сьогодні дуже холодно."],
                ["This soup is too salty.", "Цей суп занадто солоний."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>It’s too cold for me, I like it.</em> → ✅ <strong>It’s very cold, but I like it.</strong>",
                "❌ <em>This coffee is very hot to drink.</em> → ✅ <strong>This coffee is too hot to drink.</strong>",
                "❌ <em>She is too beautiful.</em> → ✅ <strong>She is very beautiful.</strong>",
                "❌ <em>The bag is very heavy to carry.</em> → ✅ <strong>The bag is too heavy to carry.</strong>",
                "❌ <em>It’s too interesting!</em> → ✅ <strong>It’s very interesting!</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Too / Very)" }
    ]
};

// --- A2 RULE PAGES ---

export const RULE_PAGE_PAST_SIMPLE = {
    id: "PAST_SIMPLE",
    title: "Past Simple",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке Past Simple",
            html:
                "<strong>Past Simple</strong> — це граматичний час для <em>завершених дій у минулому</em>. " +
                "Подія відбулася і закінчилася в конкретний момент у минулому. " +
                "Для <strong>питань і заперечень</strong> у Past Simple зазвичай використовується допоміжне дієслово <strong>did</strong>.",
        },
        {
            type: "usage",
            title: "Коли вживаємо Past Simple",
            badges: [
                "📅 Завершені події: <strong>I watched a film yesterday.</strong>",
                "🕰️ Чіткий час у минулому: <strong>She visited Rome last year.</strong>",
                "🔁 Послідовність подій: <strong>He came home, ate dinner and went to bed.</strong>",
                "❓ Питання про минуле: <strong>Did you call him?</strong>",
                "🚫 Заперечення в минулому: <strong>I didn’t understand the question.</strong>",
            ],
            hint:
                "Типові маркери часу: <em>yesterday, last week, two days ago, in 2010, when I was a child</em>.",
        },
        {
            type: "forms",
            title: "Форми Past Simple",
            headers: ["Тип", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "Ствердження",
                    "Підмет + V2 / V-ed",
                    "She worked yesterday.",
                    "Вона працювала вчора.",
                    "Неправильні дієслова мають V2 (went, saw).",
                ],
                [
                    "Питання",
                    "Did + підмет + V1?",
                    "Did they arrive on time?",
                    "Вони приїхали вчасно?",
                    "Після did завжди базова форма.",
                ],
                [
                    "Заперечення",
                    "Підмет + didn’t + V1",
                    "She didn’t like the movie.",
                    "Їй не сподобався фільм.",
                    "Без -ed і без V2.",
                ],
            ],
            hint:
                "⚠️ Дієслово <strong>to be</strong> має <strong>окремі форми</strong> у Past Simple — <strong>was / were</strong> " +
                "(без <strong>did</strong>). " +
                "Для інших дієслів: <strong>V2 / V-ed</strong> — лише у ствердженнях, а з <strong>did / didn’t</strong> завжди <strong>V1</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I visited my grandparents last weekend.", "Я відвідала бабусю й дідуся минулих вихідних."],
                ["We played football after school.", "Ми грали у футбол після школи."],
                ["Did you enjoy the trip?", "Тобі сподобалася поїздка?"],
                ["She didn’t work yesterday.", "Вона не працювала вчора."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Did you finished?</em> → ✅ <strong>Did you finish?</strong>",
                "❌ <em>He didn’t went</em> → ✅ <strong>He didn’t go</strong>",
                "❌ <em>She not worked yesterday</em> → ✅ <strong>She didn’t work yesterday</strong>",
                "❌ <em>Did you were at home?</em> → ✅ <strong>Were you at home?</strong>",
            ],
            note:
                "Пам’ятай: <strong>did / didn’t</strong> використовуються з усіма дієсловами, <strong>крім to be</strong>. " +
                "Для <strong>to be</strong> у минулому вживаємо <strong>was / were</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Past Simple)",
        },
    ],
};

export const RULE_PAGE_DID_QUEST_NEG = {
    id: "DID_QUEST_NEG",
    title: "Did + base form (questions/negations)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що робить did",
            html:
                "<strong>Did</strong> — допоміжне дієслово для <em>питань і заперечень</em> у Past Simple. " +
                "Після <strong>did / didn’t</strong> основне дієслово завжди у <strong>базовій формі (V1)</strong>.",
        },
        {
            type: "usage",
            title: "Коли вживаємо did",
            badges: [
                "❓ Питання в минулому: <strong>Did you call him?</strong>",
                "🚫 Заперечення в минулому: <strong>I didn’t eat breakfast.</strong>",
                "ℹ️ Для всіх осіб: <strong>Did he…? Did they…?</strong>",
            ],
            hint:
                "Структура: <strong>Did + підмет + V1?</strong> / <strong>Підмет + didn’t + V1</strong>.",
        },
        {
            type: "forms",
            title: "Форми з did",
            headers: ["Тип", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "Питання",
                    "Did + підмет + V1?",
                    "Did they arrive on time?",
                    "Вони приїхали вчасно?",
                    "Did завжди попереду.",
                ],
                [
                    "Заперечення",
                    "Підмет + didn’t + V1",
                    "She didn’t like the movie.",
                    "Їй не сподобався фільм.",
                    "V1 без -ed.",
                ],
            ],
            hint:
                "У реченнях із <strong>did/didn’t</strong> не використовуємо <em>V2 / V-ed</em> чи додаткові допоміжні дієслова.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Did you finish your homework?", "Ти закінчив домашнє завдання?"],
                ["I didn’t understand the question.", "Я не зрозумів запитання."],
                ["Did she call you yesterday?", "Вона телефонувала тобі вчора?"],
                ["They didn’t go to the party.", "Вони не пішли на вечірку."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Did you finished?</em> → ✅ <strong>Did you finish?</strong>",
                "❌ <em>I didn’t went</em> → ✅ <strong>I didn’t go</strong>",
            ],
            note: "Пам’ятай: після <strong>did/didn’t</strong> завжди йде <strong>V1</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Did – питання й заперечення)",
        },
    ],
};

export const RULE_PAGE_WAS_WERE = {
    id: "WAS_WERE",
    title: "Was / were",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке was / were",
            html:
                "<strong>Was / were</strong> — форми дієслова <strong>to be</strong> у минулому. " +
                "<em>Was</em> ≈ «був / була / було», <em>were</em> ≈ «були».",
        },
        {
            type: "usage",
            title: "Коли вживаємо was / were",
            badges: [
                "🆔 Хто/що в минулому: <strong>He was a teacher.</strong>",
                "🙂 Стан/почуття: <strong>They were tired.</strong>",
                "📍 Місце: <strong>We were at home.</strong>",
                "🕰️ Час/вік: <strong>I was 10 years old.</strong>",
            ],
            hint:
                "<strong>Was</strong>: I, he, she, it. <strong>Were</strong>: you, we, they.",
        },
        {
            type: "forms",
            title: "Форми was / were",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання", "Короткі відповіді"],
            rows: [
                [
                    "I / He / She / It",
                    "was",
                    "was not → wasn’t",
                    "Was he…?",
                    "Yes, he was. / No, he wasn’t.",
                ],
                [
                    "You / We / They",
                    "were",
                    "were not → weren’t",
                    "Were they…?",
                    "Yes, they were. / No, they weren’t.",
                ],
            ],
            hint:
                "Як і в Present: для <em>to be</em> <strong>не використовуємо did/didn’t</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I was very busy yesterday.", "Я був дуже зайнятий учора."],
                ["They were at the concert.", "Вони були на концерті."],
                ["Was she happy?", "Вона була щаслива?"],
                ["We weren’t late.", "Ми не запізнилися."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Did you was?</em> → ✅ <strong>Were you?</strong>",
                "❌ <em>He didn’t was</em> → ✅ <strong>He wasn’t</strong>",
            ],
            note:
                "Для <strong>was / were</strong> питання й заперечення будуємо <strong>без did/didn’t</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Was / were)",
        },
    ],
};

export const RULE_PAGE_PAST_CONTINUOUS = {
    id: "PAST_CONTINUOUS",
    title: "Past Continuous",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке Past Continuous",
            html:
                "<strong>Past Continuous</strong> описує <em>тривалу дію в певний момент у минулому.",
        },
        {
            type: "usage",
            title: "Коли вживаємо Past Continuous",
            badges: [
                "⏱️ Дія в конкретний момент: <strong>At 7 p.m. I was cooking.</strong>",
                "📚 Фонова дія, коли щось сталося: <strong>He was reading when I called.</strong>",
                "🔁 Дратівлива звичка в минулому (з always): <strong>She was always losing her keys.</strong>",
            ],
            hint:
                "Часто з <em>when / while</em>: <strong>While I was studying, they were watching TV.</strong>",
        },
        {
            type: "forms",
            title: "Форми Past Continuous",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання", "Короткі відповіді"],
            rows: [
                [
                    "I / He / She / It",
                    "was + V-ing",
                    "wasn’t + V-ing",
                    "Was he + V-ing?",
                    "Yes, he was. / No, he wasn’t.",
                ],
                [
                    "You / We / They",
                    "were + V-ing",
                    "weren’t + V-ing",
                    "Were they + V-ing?",
                    "Yes, they were. / No, they weren’t.",
                ],
            ],
            hint:
                "Додаємо <strong>-ing</strong>: <em>play → playing, write → writing, swim → swimming</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I was watching TV at 9 o’clock.", "Я дивився телевізор о 9 годині."],
                ["They were playing football when it started to rain.", "Вони грали у футбол, коли почався дощ."],
                ["Was she sleeping at that time?", "Вона спала в той час?"],
                ["He wasn’t listening to the teacher.", "Він не слухав учителя."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>They was playing</em> → ✅ <strong>They were playing</strong>",
                "❌ <em>Was you working?</em> → ✅ <strong>Were you working?</strong>",
            ],
            note:
                "Пам’ятай про <strong>was/were</strong> і правильне додавання <strong>-ing</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Past Continuous)",
        },
    ],
};

export const RULE_PAGE_GOING_TO_PLANS = {
    id: "GOING_TO_PLANS",
    title: "Going to (plans)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке be going to",
            html:
                "<strong>Be going to</strong> використовуємо для <em>планів на майбутнє</em> і <em>очевидних прогнозів</em>. ",
        },
        {
            type: "usage",
            title: "Коли вживаємо going to",
            badges: [
                "🗓️ План, рішення вже є: <strong>I’m going to visit my friend.</strong>",
                "📌 Намір: <strong>She’s going to start a new job.</strong>",
                "🔮 Очевидний прогноз: <strong>Look at the clouds – it’s going to rain.</strong>",
            ],
            hint:
                "Важливо: рішення прийнято <em>до моменту мовлення</em>.",
        },
        {
            type: "forms",
            title: "Форми be going to",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання"],
            rows: [
                [
                    "I",
                    "I’m going to go",
                    "I’m not going to go",
                    "Am I going to go?",
                ],
                [
                    "He / She / It",
                    "He’s going to travel",
                    "He isn’t going to travel",
                    "Is he going to travel?",
                ],
                [
                    "You / We / They",
                    "They’re going to study",
                    "They aren’t going to study",
                    "Are they going to study?",
                ],
            ],
            hint:
                "Пам’ятай про <strong>am / is / are</strong> перед <strong>going to</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’m going to buy a new phone.", "Я збираюся купити новий телефон."],
                ["We’re going to visit our cousins.", "Ми збираємося відвідати наших двоюрідних братів/сестер."],
                ["Is she going to move to London?", "Вона збирається переїхати до Лондона?"],
                ["They aren’t going to work today.", "Вони не збираються працювати сьогодні."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He going to study</em> → ✅ <strong>He is going to study</strong>",
                "❌ <em>Are you going study?</em> → ✅ <strong>Are you going to study?</strong>",
            ],
            note: "Не забувай <strong>to</strong> після <strong>going</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Going to – плани)",
        },
    ],
};

export const RULE_PAGE_WILL_PREDICTIONS = {
    id: "WILL_PREDICTIONS",
    title: "Will (predictions)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке will",
            html:
                "<strong>Will</strong> використовуємо для <em>рішень у момент мовлення</em>, <em>простих прогнозів</em> і <em>обіцянок</em>. ",
        },
        {
            type: "usage",
            title: "Коли вживаємо will",
            badges: [
                "💡 Рішення зараз: <strong>I’m thirsty. I’ll make some tea.</strong>",
                "🔮 Прогнози: <strong>I think it’ll be cold tomorrow.</strong>",
                "🤝 Обіцянки / пропозиції: <strong>I’ll help you.</strong>",
            ],
            hint:
                "Скорочення: <strong>I’ll, you’ll, he’ll</strong>. Заперечення: <strong>won’t</strong> (will not).",
        },
        {
            type: "forms",
            title: "Форми з will",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання"],
            rows: [
                [
                    "Усі особи",
                    "will + V: She will come.",
                    "will not (won’t) + V: She won’t come.",
                    "Will + підмет + V?: Will she come?",
                ],
            ],
            hint: "Will не змінюється за особами.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’ll call you later.", "Я подзвоню тобі пізніше."],
                ["It’ll rain tomorrow.", "Завтра, мабуть, буде дощ."],
                ["Will they come to the party?", "Вони прийдуть на вечірку?"],
                ["He won’t like this movie.", "Йому не сподобається цей фільм."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He will to go</em> → ✅ <strong>He will go</strong>",
                "❌ <em>Won’t he will come?</em> → ✅ <strong>Won’t he come?</strong>",
            ],
            note: "Після <strong>will / won’t</strong> завжди <strong>V1</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Will – прогнози)",
        },
    ],
};

export const RULE_PAGE_BE_GOING_TO_VS_WILL = {
    id: "BE_GOING_TO_VS_WILL",
    title: "Be going to vs will",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "У чому різниця",
            html:
                "<strong>Be going to</strong> зазвичай про <em>плани/наміри</em> та <em>очевидні</em> прогнози. " +
                "<strong>Will</strong> частіше про <em>рішення «зараз»</em>, <em>думки/віру</em> та <em>обіцянки</em>.",
        },
        {
            type: "usage",
            title: "Коли що обрати",
            badges: [
                "🗓️ План заздалегідь: <strong>I’m going to visit my grandma.</strong>",
                "💡 Рішення зараз: <strong>OK, I’ll visit my grandma.</strong>",
                "🔮 Очевидний прогноз: <strong>Look at the clouds. It’s going to rain.</strong>",
                "🤔 Думка/віра: <strong>I think it’ll rain.</strong>",
            ],
            hint:
                "У розмовній мові обидві форми часто взаємозамінні, але контекст допомагає обрати «кращу».",
        },
        {
            type: "examples",
            title: "Порівняльні приклади",
            items: [
                [
                    "I’m going to start a diet on Monday.",
                    "Я збираюся сісти на дієту в понеділок (план).",
                ],
                [
                    "I’m hungry. I think I’ll make a sandwich.",
                    "Я голодний. Думаю, зроблю бутерброд (рішення зараз).",
                ],
                [
                    "Look at that car! It’s going to hit the tree.",
                    "Подивись на ту машину! Вона зараз вріжеться в дерево.",
                ],
                [
                    "I’m sure you’ll pass the exam.",
                    "Я впевнений, ти складеш іспит.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Використовувати <em>will</em> для вже запланованих подій → краще <strong>be going to</strong>.",
                "❌ Використовувати <em>be going to</em> для спонтанних рішень → краще <strong>will</strong>.",
            ],
            note:
                "Подумай: ти вже планував це раніше чи вирішив <em>прямо зараз</em>?",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Going to vs will)",
        },
    ],
};

export const RULE_PAGE_MUST_MUSTNT = {
    id: "MUST_MUSTNT",
    title: "Must / mustn’t",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає must / mustn’t",
            html:
                "<strong>Must</strong> означає <em>сильний обов’язок / необхідність</em>. " +
                "<strong>Mustn’t</strong> означає <em>строгову заборону</em> (не можна взагалі).",
        },
        {
            type: "usage",
            title: "Коли вживаємо must / mustn’t",
            badges: [
                "📏 Правила / інструкції: <strong>You must wear a seat belt.</strong>",
                "🧠 Особистий обов’язок: <strong>I must finish this today.</strong>",
                "⛔ Заборона: <strong>You mustn’t smoke here.</strong>",
            ],
            hint:
                "Структура: <strong>must / mustn’t + V1</strong>. Не додаємо <em>to</em> перед дієсловом.",
        },
        {
            type: "forms",
            title: "Форми must / mustn’t",
            headers: ["Тип", "Ствердження / Заперечення", "Питання", "Короткі відповіді", "Примітка"],
            rows: [
                [
                    "Обов’язок",
                    "You must do it.",
                    "Must I do it?",
                    "Yes, you must. / No, you don’t have to.",
                    "Офіційно, трохи сильніше, ніж have to.",
                ],
                [
                    "Заборона",
                    "You mustn’t park here.",
                    "Must we stay here?",
                    "Yes, you must. / No, you don’t have to.",
                    "Mustn’t = не можна.",
                ],
            ],
            hint:
                "<strong>Must</strong> не змінюється за особами: <em>I/you/he/she… must</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["You must do your homework.", "Ти повинен зробити домашнє завдання."],
                ["I must call my mom.", "Я мушу подзвонити мамі."],
                ["You mustn’t use your phone in the exam.", "Не можна користуватися телефоном на іспиті."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>You must to go</em> → ✅ <strong>You must go</strong>",
                "❌ Плутати <strong>mustn’t</strong> (заборона) з <strong>don’t have to</strong> (не обов’язково).",
            ],
            note:
                "<strong>Mustn’t</strong> = заборонено. <strong>Don’t have to</strong> = можна, але не обов’язково.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Must / mustn’t)",
        },
    ],
};

export const RULE_PAGE_SHOULD_SHOULDNT = {
    id: "SHOULD_SHOULDNT",
    title: "Should / shouldn’t",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає should",
            html:
                "<strong>Should</strong> використовуємо для <em>поради</em>, рекомендації або <em>м’якого обов’язку</em>. " +
                "<strong>Shouldn’t</strong> — порада так не робити.",
        },
        {
            type: "usage",
            title: "Коли вживаємо should",
            badges: [
                "🩺 Поради про здоров’я: <strong>You should drink more water.</strong>",
                "📚 Рекомендації: <strong>He should study harder.</strong>",
                "⚠️ Попередження: <strong>You shouldn’t drive so fast.</strong>",
            ],
            hint:
                "Структура: <strong>should / shouldn’t + V1</strong>. Не використовуємо <em>to</em>.",
        },
        {
            type: "forms",
            title: "Форми should",
            headers: ["Тип", "Ствердження / Заперечення", "Питання", "Короткі відповіді", "Примітка"],
            rows: [
                [
                    "Порада",
                    "You should go to bed earlier.",
                    "Should I go to bed earlier?",
                    "Yes, you should. / No, you shouldn’t.",
                    "Для всіх осіб одна форма.",
                ],
                [
                    "Негативна порада",
                    "You shouldn’t eat so much sugar.",
                    "Should we eat less sugar?",
                    "Yes, you should. / No, you shouldn’t.",
                    "М’яке «краще не робити».",
                ],
            ],
            hint:
                "У розмові <strong>should</strong> звучить менш сильним, ніж <strong>must</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["You should see this film.", "Тобі варто подивитися цей фільм."],
                ["He shouldn’t work so much.", "Йому не варто так багато працювати."],
                ["Should I call her?", "Чи варто мені їй подзвонити?"],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>You should to go</em> → ✅ <strong>You should go</strong>",
                "❌ <em>I don’t should</em> → ✅ <strong>I shouldn’t</strong>",
            ],
            note: "Не додаємо <strong>do/does</strong> із <em>should</em>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Should / shouldn’t)",
        },
    ],
};

export const RULE_PAGE_HAVE_TO_DONT_HAVE_TO = {
    id: "HAVE_TO_DONT_HAVE_TO",
    title: "Have to / don’t have to",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає have to",
            html:
                "<strong>Have to</strong> — це <em>обов’язок</em>, часто зовнішнє правило. " +
                "<strong>Don’t/doesn’t have to</strong> — <em>немає потреби / не обов’язково</em> (але можна).",
        },
        {
            type: "usage",
            title: "Коли вживаємо have to",
            badges: [
                "📏 Правила/закони: <strong>We have to wear uniforms at school.</strong>",
                "📅 Повсякденні обов’язки: <strong>I have to get up early.</strong>",
                "😌 Відсутність необхідності: <strong>You don’t have to come.</strong>",
            ]},
        {
            type: "forms",
            title: "Форми have to",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання"],
            rows: [
                [
                    "I / You / We / They",
                    "have to work",
                    "don’t have to work",
                    "Do you have to work?"
                ],
                [
                    "He / She / It",
                    "has to work",
                    "doesn’t have to work",
                    "Does he have to work?"
                ],
            ],
            hint:
                "<strong>Don’t/doesn’t have to</strong> ≠ <strong>mustn’t</strong>. Це «не обов’язково», а не «заборонено».",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I have to clean my room.", "Я повинен прибрати свою кімнату."],
                ["She has to work on Saturdays.", "Вона мусить працювати по суботах."],
                ["You don’t have to pay now.", "Тобі не обов’язково платити зараз."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Плутати <strong>don’t have to</strong> із <strong>mustn’t</strong>.",
                "❌ <em>He don’t has to</em> → ✅ <strong>He doesn’t have to</strong>",
            ],
            note:
                "Пам’ятай: <strong>mustn’t</strong> = «заборонено», а <strong>don’t have to</strong> = «можеш не робити».",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Have to / don’t have to)",
        },
    ],
};

export const RULE_PAGE_MAY_MIGHT = {
    id: "MAY_MIGHT",
    title: "May / might",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає may / might",
            html:
                "<strong>May</strong> і <strong>might</strong> виражають <em>можливість</em> (може бути, ймовірно). " +
                "У розмовній мові часто майже однакові.",
        },
        {
            type: "usage",
            title: "Коли вживаємо may / might",
            badges: [
                "🤔 Невпевнені прогнози: <strong>It may rain later.</strong>",
                "🔮 Ще менш впевнено: <strong>It might rain later.</strong>",
                "🙏 Ввічливий дозвіл (частіше may): <strong>May I open the window?</strong>",
            ]},
        {
            type: "forms",
            title: "Форми may / might",
            headers: ["Тип", "Ствердження / Заперечення", "Питання", "Примітка"],
            rows: [
                [
                    "Можливість",
                    "She may be at home.",
                    "May she be at home?",
                    "May = можливо.",
                ],
                [
                    "Можливість (менш ймовірно)",
                    "He might come later.",
                    "Might he come later?",
                    "Might = ще менш впевнено.",
                ],
            ],
            hint:
                "<strong>May</strong> і <strong>might</strong> не змінюються за особами.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I may go to the party.", "Можливо, я піду на вечірку."],
                ["She might be busy now.", "Можливо, вона зараз зайнята."],
                ["May I use your phone?", "Чи можна я скористаюся твоїм телефоном?"],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He may to come</em> → ✅ <strong>He may come</strong>",
                "❌ <em>She don’t may</em> → ✅ <strong>She may not</strong>",
            ],
            note:
                "Не використовуємо <strong>do/does</strong> із <em>may/might</em>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (May / might)",
        },
    ],
};

export const RULE_PAGE_COMPARATIVES = {
    id: "COMPARATIVES",
    title: "Comparatives (adj + -er / more)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке ступінь порівняння",
            html:
                "<strong>Comparative</strong> (вищий ступінь прикметника) використовуємо, коли порівнюємо <em>дві речі</em>: " +
                "<strong>taller, more interesting</strong> тощо.",
        },
        {
            type: "usage",
            title: "Коли вживаємо comparative",
            badges: [
                "👫 Порівняння двох людей/предметів: <strong>My brother is taller than me.</strong>",
                "📚 Більш «довгі» прикметники: <strong>more interesting, more expensive</strong>",
                "↔️ Використовуємо <strong>than</strong>: <strong>smaller than</strong>",
            ],
            hint:
                "Короткі прикметники: <strong>adj + -er</strong> (taller, bigger). Довгі: <strong>more + adj</strong> (more beautiful).",
        },
        {
            type: "forms",
            title: "Утворення comparative",
            headers: ["Тип прикметника", "Форма", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "Короткі (1 склад)",
                    "adj + -er",
                    "cheap → cheaper",
                    "дешевий → дешевший",
                    "",
                ],
                [
                    "Закінчується на -y",
                    "y → ier",
                    "happy → happier",
                    "щасливий → щасливіший",
                    "",
                ],
                [
                    "Довгі (2+ склади)",
                    "more + adj",
                    "more interesting",
                    "цікавіший",
                    "",
                ],
                [
                    "Нерегулярні",
                    "good → better",
                    "bad → worse",
                    "добрий → кращий; поганий → гірший",
                    "",
                ],
            ],
            hint:
                "Завжди пам’ятай про <strong>than</strong>: <strong>He is taller than me.</strong>",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["This book is shorter than that one.", "Ця книга коротша за ту."],
                ["Math is more difficult than English.", "Математика складніша, ніж англійська."],
                ["He is better at football than me.", "Він грає у футбол краще за мене."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>more cheap</em> → ✅ <strong>cheaper</strong>",
                "❌ <em>beautifuler</em> → ✅ <strong>more beautiful</strong>",
            ],
            note: "Перевір, чи прикметник короткий, чи довгий, перш ніж додавати -er або more.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Comparatives)",
        },
    ],
};

export const RULE_PAGE_SUPERLATIVES = {
    id: "SUPERLATIVES",
    title: "Superlatives (adj + -est / most)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке найвищий ступінь",
            html:
                "<strong>Superlative</strong> (найвищий ступінь прикметника) використовуємо, коли говоримо про <em>най-</em> серед " +
                "більш ніж двох предметів/людей.",
        },
        {
            type: "usage",
            title: "Коли вживаємо superlative",
            badges: [
                "🏆 Найкращий/найгірший: <strong>This is the best day.</strong>",
                "📊 Порівнюємо багато речей: <strong>He is the tallest in the class.</strong>",
                "📌 Часто з the: <strong>the most expensive, the oldest</strong>",
            ],
            hint:
                "Короткі прикметники: <strong>the adj + -est</strong>. Довгі: <strong>the most + adj</strong>.",
        },
        {
            type: "forms",
            title: "Утворення superlative",
            headers: ["Тип прикметника", "Форма", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "Короткі (1 склад)",
                    "the adj + -est",
                    "cheap → the cheapest",
                    "дешевий → найдешевший",
                    "",
                ],
                [
                    "Закінчується на -y",
                    "y → iest",
                    "happy → the happiest",
                    "щасливий → найщасливіший",
                    "",
                ],
                [
                    "Довгі (2+ склади)",
                    "the most + adj",
                    "the most interesting",
                    "найцікавіший",
                    "",
                ],
                [
                    "Нерегулярні",
                    "good → the best",
                    "bad → the worst",
                    "добрий → найкращий; поганий → найгірший",
                    "",
                ],
            ],
            hint:
                "Зазвичай перед superlative ставимо <strong>the</strong>: <strong>the smallest, the most beautiful</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["This is the longest river in the country.", "Це найдовша річка в країні."],
                ["Summer is the hottest season.", "Літо — найспекотніша пора року."],
                ["He is the most patient teacher.", "Він — найтерплячіший учитель."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>the most cheap</em> → ✅ <strong>the cheapest</strong>",
                "❌ <em>beautifulest</em> → ✅ <strong>the most beautiful</strong>",
            ],
            note:
                "Не поєднуй <strong>more + -er</strong> або <strong>most + -est</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Superlatives)",
        },
    ],
};

export const RULE_PAGE_ENOUGH_TOO_MUCH_MANY = {
    id: "ENOUGH_TOO_MUCH_MANY",
    title: "Too / enough",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає too / enough",
            html:
                "<strong>Too</strong> = «занадто, надто» (негативний відтінок). " +
                "<strong>Enough</strong> = «достатньо» (якраз ок).",
        },
        {
            type: "usage",
            title: "Коли вживаємо too / enough",
            badges: [
                "⚠️ Занадто багато/мало: <strong>This bag is too heavy.</strong>",
                "✅ Достатньо: <strong>It’s warm enough.</strong>",
                ]},
        {
            type: "forms",
            title: "Порядок слів",
            headers: ["Структура", "Приклад", "Переклад", "Примітка", "Ще приклад"],
            rows: [
                [
                    "too + adj / adv",
                    "too big",
                    "занадто великий",
                    "негативний відтінок",
                    "too quickly",
                ],
                [
                    "adj + enough",
                    "warm enough",
                    "достатньо теплий",
                    "",
                    "old enough",
                ],
                [
                    "enough + noun",
                    "enough time",
                    "достатньо часу",
                    "",
                    "enough water",
                ],
            ],
            hint:
                "З дієсловами частіше: <strong>verb + enough</strong> (eat enough, sleep enough).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The coffee is too hot.", "Кава занадто гаряча."],
                ["This room isn’t big enough.", "Ця кімната недостатньо велика."],
                ["We have enough chairs.", "У нас достатньо стільців."]
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em><strong style='color:red'>too enough</strong></em> (разом) — таких конструкцій нема.",
                "❌ <em>This chair is <strong style='color:red'>enough big.</strong></em> → ✅ <strong>big enough</strong>",
                "❌ <em>She spoke English <strong style='color:red'>enough well</strong> to get the job.</em> → ✅ well enough",
                "❌ <em>This coffee is <strong style='color:red'>enough hot</strong> to drink.</em> → ✅ hot enough",
                "❌ <em>We have <strong style='color:red'>money enough</strong> to buy a car.</em> → ✅ enough money",
                ],
            note:
                "Подумай: це «надто» (too) чи «достатньо» (enough)? І вже тоді обирай структуру.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Too / enough)",
        },
    ],
};

export const RULE_PAGE_ADVERBS_FREQUENCY_OFTEN_NEVER = {
    id: "ADVERBS_FREQUENCY_OFTEN_NEVER",
    title: "Adverbs of frequency (often, never)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке прислівники частотності",
            html:
                "<strong>Adverbs of frequency</strong> показують, <em>як часто</em> щось відбувається: " +
                "<strong>always, usually, often, sometimes, rarely, never</strong>.",
        },
        {
            type: "usage",
            title: "Куди ставити прислівники",
            badges: [
                "👤 Зазвичай перед основним дієсловом: <strong>We often play tennis.</strong>",
                "🧱 Після to be: <strong>She is always late.</strong>",
                "❓ В запитаннях — після підмета: <strong>Do you often read?</strong>",
            ],
            hint:
                "Типовий порядок у Present Simple: <strong>subject + adverb + verb</strong>: <em>I usually get up at 7.</em>",
        },
        {
            type: "forms",
            title: "Позиція в реченні",
            headers: ["Структура", "Приклад", "Переклад", "Примітка", "Ще приклад"],
            rows: [
                [
                    "Після to be",
                    "She is never angry.",
                    "Вона ніколи не сердиться.",
                    "is/am/are + adverb",
                    "They are often busy.",
                ],
                [
                    "Перед основним дієсловом",
                    "They usually cook dinner.",
                    "Вони зазвичай готують вечерю.",
                    "adverb + V",
                    "I always walk to school.",
                ],
                [
                    "Після допоміжного",
                    "You can always ask me.",
                    "Ти завжди можеш мене запитати.",
                    "can/could/will + adverb + V",
                    "I will never forget this day.",
                ],
            ],
            hint:
                "<strong>Never</strong> уже несе заперечення, тому з ним не потрібне <em>don’t/doesn’t</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I always have breakfast.", "Я завжди снідаю."],
                ["He usually goes to bed at 11.", "Він зазвичай лягає спати о 11."],
                ["We sometimes watch films in English.", "Ми іноді дивимося фільми англійською."],
                ["She is never late.", "Вона ніколи не запізнюється."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>She always is late</em> → ✅ <strong>She is always late</strong>",
                "❌ <em>I don’t never go</em> → ✅ <strong>I never go</strong>",
            ],
            note:
                "Не дублюй заперечення: <strong>never</strong> вже означає «ніколи».",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Adverbs of frequency)",
        },
    ],
};

export const RULE_PAGE_QUANTIFIERS_SOME_ANY_A_LOT_MUCH_MANY = {
    id: "QUANTIFIERS_SOME_ANY_A_LOT_MUCH_MANY",
    title: "Quantifiers (some, any, a lot of, much, many)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Слова кількості",
            html:
                "<strong>Some, any, a lot of, much, many</strong> показують, <em>скільки</em> чогось є. " +
                "Вони працюють з іменниками, особливо з <strong>countable / uncountable</strong>.",
        },
        {
            type: "usage",
            title: "Коли що вживати",
            badges: [
                "🍏 <strong>some</strong> — ствердження: <strong>some apples, some water</strong>",
                "❓ <strong>any</strong> — питання/заперечення: <strong>any apples, any water</strong>",
                "📦 <strong>a lot of</strong> — багато (для всіх): <strong>a lot of books / money</strong>",
                "📚 <strong>many</strong> — багато + countable: <strong>many books</strong>",
                "💧 <strong>much</strong> — багато + uncountable: <strong>much water</strong>",
            ],
            hint:
                "У розмовній мові <strong>a lot of</strong> частіше, ніж <strong>much/many</strong> у ствердженнях.",
        },
        {
            type: "forms",
            title: "Countable vs uncountable",
            headers: ["Квантифікатор", "З ким", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "some",
                    "обидва",
                    "some milk / some apples",
                    "трохи молока / кілька яблук",
                    "звичайно в ствердженнях",
                ],
                [
                    "any",
                    "обидва",
                    "any sugar / any friends",
                    "будь-який цукор / якісь друзі",
                    "заперечення/питання",
                ],
                [
                    "a lot of",
                    "обидва",
                    "a lot of people / money",
                    "багато людей / грошей",
                    "універсальне «багато»",
                ],
                [
                    "much",
                    "uncountable",
                    "much time, much water",
                    "багато часу, води",
                    "часто в запереченнях/питаннях",
                ],
                [
                    "many",
                    "countable",
                    "many cars, many ideas",
                    "багато машин, ідей",
                    "часто в запереченнях/питаннях",
                ],
            ],
            hint:
                "Пам’ятай: <strong>how much</strong> + uncountable, <strong>how many</strong> + countable.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["We have some bread.", "У нас є трохи хліба."],
                ["Do you have any questions?", "У тебе є запитання?"],
                ["There are a lot of children in the park.", "У парку багато дітей."],
                ["We don’t have much time.", "У нас немає багато часу."],
                ["How many apples do you need?", "Скільки яблук тобі потрібно?"],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>many money</em> → ✅ <strong>much money / a lot of money</strong>",
                "❌ <em>much apples</em> → ✅ <strong>many apples / a lot of apples</strong>",
            ],
            note:
                "Спочатку подумай: іменник злічуваний чи ні? Потім обирай <strong>much/many</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Quantifiers)",
        },
    ],
};

export const RULE_PAGE_FUTURE_WITH_PRESENT_CONT = {
    id: "FUTURE_WITH_PRESENT_CONT",
    title: "Future with Present Continuous (arrangements)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Майбутнє через Present Continuous",
            html:
                "Форму <strong>Present Continuous</strong> (<em>am/is/are + V-ing</em>) можна використовувати для <em>майбутніх планів</em>, " +
                "якщо це вже <strong>точні домовленості</strong> (arrangements).",
        },
        {
            type: "usage",
            title: "Коли так говорити про майбутнє",
            badges: [
                "📅 Особисті плани: <strong>I’m meeting my friend tomorrow.</strong>",
                "🚂 Розклад, якщо це «моя» організована подія: <strong>We’re leaving at 6.</strong>",
                "👥 Домовленість з кимось: <strong>She’s having dinner with her parents on Sunday.</strong>",
            ],
            hint:
                "Часто є конкретний час/дата: <strong>this evening, on Monday, at 7 o’clock</strong>.",
        },
        {
            type: "forms",
            title: "Структура",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання", "Примітка"],
            rows: [
                [
                    "Усі особи",
                    "am/is/are + V-ing + future time",
                    "am/is/are not + V-ing",
                    "Am/Is/Are + підмет + V-ing?",
                    "the train is leaving at 9",
                ],
            ],
            hint:
                "Зовні це звичайний Present Continuous, але контекст (future time) робить його «майбутнім».",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’m flying to London next week.", "Я лечу до Лондона наступного тижня."],
                ["We’re having a party on Friday.", "У нас вечірка в п’ятницю."],
                ["Are you meeting him tomorrow?", "Ти зустрічаєшся з ним завтра?"],
                ["She isn’t working this weekend.", "Вона не працює цього вікенду."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I meet my friend tomorrow</em> (як звичка) → краще ✅ <strong>I’m meeting my friend tomorrow</strong>.",
                "❌ Забувати час → речення може звучати як теперішній момент.",
            ],
            note:
                "Завжди додавай <strong>future time</strong> (tomorrow, next week…), щоб було зрозуміло, що це про майбутнє.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Future with Present Continuous)",
        },
    ],
};

export const RULE_PAGE_LIKE_LOVE_HATE_ING = {
    id: "LIKE_LOVE_HATE_ING",
    title: "Like / love / hate + -ing",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Говоримо про вподобання",
            html:
                "Після дієслів <strong>like, love, hate, enjoy, prefer</strong> часто використовуємо форму <strong>V-ing</strong>, " +
                "щоб говорити про загальні вподобання/звички.",
        },
        {
            type: "usage",
            title: "Коли вживаємо -ing",
            badges: [
                "💚 Загальні вподобання: <strong>I like reading.</strong>",
                "❤️ Сильна симпатія: <strong>She loves dancing.</strong>",
                "💔 Неприязнь: <strong>He hates waiting.</strong>",
            ],
            hint:
                "Структура: <strong>like/love/hate + V-ing</strong> або <strong>like/love/hate + noun</strong>.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Структура", "Приклад", "Переклад"],
            rows: [
                [
                    "like + V-ing",
                    "I like swimming.",
                    "Мені подобається плавати."
                ],
                [
                    "love + V-ing",
                    "She loves singing.",
                    "Вона обожнює співати."
                ],
                [
                    "hate + V-ing",
                    "He hates getting up early.",
                    "Він ненавидить рано вставати."
                ],
            ],
            hint:
                "Часті питання: <strong>Do you like…?</strong> + <strong>V-ing</strong> або <strong>noun</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I like watching films in English.", "Мені подобається дивитися фільми англійською."],
                ["We love travelling.", "Ми любимо подорожувати."],
                ["He hates doing homework.", "Він ненавидить робити домашні завдання."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I like to reading</em> → ✅ <strong>I like reading</strong>",
                "❌ <em>She loves sing</em> → ✅ <strong>She loves singing</strong>",
            ],
            note:
                "Після цих дієслів не потрібне <em>to</em>, якщо далі йде <strong>V-ing</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Like / love / hate + -ing)",
        },
    ],
};

export const RULE_PAGE_ZERO_CONDITIONAL = {
    id: "ZERO_CONDITIONAL",
    title: "Zero Conditional",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке Zero Conditional",
            html:
                "<strong>Zero Conditional</strong> описує <em>загальні істини</em>, <em>закони</em>, <em>рутини</em>: те, що завжди відбувається, " +
                "коли є певна умова.",
        },
        {
            type: "usage",
            title: "Коли використовувати Zero Conditional",
            badges: [
                "🌍 Закони природи: <strong>If you heat water, it boils.</strong>",
                "📅 Звички: <strong>If I’m tired, I go to bed early.</strong>",
                "📏 Правила: <strong>If you don’t wear a helmet, you get a fine.</strong>",
            ],
            hint:
                "Структура: <strong>If + Present Simple, Present Simple</strong>. Порядок можна міняти.",
        },
        {
            type: "forms",
            title: "Структура Zero Conditional",
            headers: ["Позиція if", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "If на початку",
                    "If + Present, Present",
                    "If you mix red and blue, you get purple.",
                    "Якщо змішати червоний і синій, виходить фіолетовий.",
                    "Кома після if-частини.",
                ],
                [
                    "If в середині",
                    "Present if + Present",
                    "You get purple if you mix red and blue.",
                    "Ти отримуєш фіолетовий, якщо змішати червоний і синій.",
                    "Коми немає.",
                ],
            ],
            hint:
                "Обидві частини в <strong>Present Simple</strong>, навіть якщо говоримо про майбутнє як загальне правило.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["If it rains, the grass gets wet.", "Якщо йде дощ, трава намокає."],
                ["If I drink coffee at night, I can’t sleep.", "Якщо я п’ю каву вночі, я не можу заснути."],
                ["You feel better if you sleep enough.", "Якщо ти достатньо спиш, почуваєшся краще."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Використовувати <em>will</em> у будь-якій частині → Zero Conditional не потребує will.",
            ],
            note:
                "Zero Conditional ≈ «завжди так»: не про одну конкретну ситуацію, а про правило.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Zero Conditional)",
        },
    ],
};

export const RULE_PAGE_FIRST_CONDITIONAL = {
    id: "FIRST_CONDITIONAL",
    title: "1st Conditional",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке First Conditional",
            html:
                "<strong>First Conditional</strong> описує <em>реальні</em> або <em>ймовірні</em> ситуації в майбутньому: " +
                "що станеться, якщо умова виконається.",
        },
        {
            type: "usage",
            title: "Коли використовувати 1st Conditional",
            badges: [
                "🔮 Реальні плани: <strong>If it is sunny, we’ll go to the park.</strong>",
                "⚠️ Попередження: <strong>If you are late, you’ll miss the bus.</strong>",
                "💬 Обіцянки: <strong>If you help me, I’ll help you.</strong>",
            ]},
        {
            type: "forms",
            title: "Структура First Conditional",
            headers: ["Позиція if", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "If на початку",
                    "If + Present, will + V",
                    "If it rains, we’ll stay at home.",
                    "Якщо піде дощ, ми залишимося вдома.",
                    "Кома після if-частини.",
                ],
                [
                    "If в середині",
                    "Will + V if + Present",
                    "We’ll stay at home if it rains.",
                    "Ми залишимося вдома, якщо піде дощ.",
                    "Коми немає.",
                ],
            ],
            hint:
                "Не використовуй <strong>will</strong> після <strong>if</strong> у цій конструкції.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["If I have time, I’ll call you.", "Якщо в мене буде час, я тобі подзвоню."],
                ["If they study hard, they’ll pass the exam.", "Якщо вони добре вчитимуться, вони складуть іспит."],
                ["We won’t go out if it’s cold.", "Ми не підемо гуляти, якщо буде холодно."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>If it will rain, we’ll stay</em> → ✅ <strong>If it rains, we’ll stay</strong>",
            ],
            note:
                "Умовна частина завжди в <strong>Present Simple</strong>, навіть якщо мова про майбутнє.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (First Conditional)",
        },
    ],
};

export const RULE_PAGE_TIME_CLAUSE_FUTURE = {
    id: "TIME_CLAUSE_FUTURE",
    title: "Time clause future",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Майбутнє в часових підрядних",
            html:
                "Після слів <strong>when, while, before, after, as soon as, until</strong> у <em>часових підрядних</em> ми " +
                "використовуємо <strong>Present Simple</strong>, навіть якщо йдеться про майбутнє.",
        },
        {
            type: "usage",
            title: "Коли й як",
            badges: [
                "🔎 Шукай в українській зв’язку: <em>«коли…», «перед тим як…», «після того як…», «як тільки…», «поки не…», «доки…»</em> — це сигнал <strong>time clause</strong>.",
                "🧩 Це зазвичай <strong>2 частини</strong>: (1) часова умова + (2) головна дія. Часова умова відповідає на питання <em>«коли?»</em>.",
                "📌 Time clause може стояти <strong>на початку</strong> або <strong>в кінці</strong>: <em>Коли я прийду додому, …</em> / <em>… коли я прийду додому</em>.",
                "⚠️ Не плутай з питанням <em>«Коли ти прийдеш?»</em> — це вже <strong>просто питання</strong>, не time clause в реченні з двох частин.",
            ],
            hint:
                "Якщо в українській є «коли/після того як/перед тим як…» і далі ще одна дія — значить це конструкція з <strong>time clause</strong>.",
        },
        {
            type: "forms",
            title: "Структура",
            headers: ["Сполучник", "Time clause (Present)", "Main clause (Future)", "Приклад", "Переклад"],
            rows: [
                [
                    "when",
                    "When I finish",
                    "I’ll call you",
                    "When I finish work, I’ll call you.",
                    "Коли я закінчу роботу, я тобі подзвоню.",
                ],
                [
                    "before",
                    "Before you leave",
                    "send me a message",
                    "Before you leave, send me a message.",
                    "Перед тим як ти підеш, надішли мені повідомлення.",
                ],
                [
                    "after",
                    "After he arrives",
                    "we’ll have dinner",
                    "After he arrives, we’ll have dinner.",
                    "Після того як він приїде, ми повечеряємо.",
                ],
            ],
            hint:
                "У часовій частині <strong>не використовуємо will</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’ll call you when I get home.", "Я подзвоню тобі, коли прийду додому."],
                ["We’ll start after everyone arrives.", "Ми почнемо після того, як усі приїдуть."],
                ["Before you go to bed, open the window.", "Перед тим як лягати спати, відкрий вікно."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>When I will finish, I’ll call you</em> → ✅ <strong>When I finish, I’ll call you</strong>",
            ],
            note:
                "Запам’ятай «магію»: після <strong>when/before/after/as soon as</strong> → <strong>Present Simple</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Time clauses – future)",
        },
    ],
};

export const RULE_PAGE_HOW_OFTEN_LONG_MUCH = {
    id: "HOW_OFTEN_LONG_MUCH",
    title: "How often / How long / How much",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Про що ці питання",
            html:
                "Ці фрази допомагають уточнити: <strong>частоту</strong> (how often), <strong>тривалість</strong> (how long) " +
                "або <strong>кількість/ціну</strong> (how much).",
        },
        {
            type: "usage",
            title: "Як обрати правильне how… (з української)",
            badges: [
                "📅 Якщо в українській «<em>як часто</em>» / «<em>скільки разів</em>» → ✅ <strong>How often</strong>",
                "⏱️ Якщо «<em>як довго</em>» / «<em>скільки триває</em>» → ✅ <strong>How long</strong>",
                "🥛 Якщо «<em>скільки</em>» про речовину/масу (вода, молоко, час, гроші) → ✅ <strong>How much</strong>",
                "💸 Якщо «<em>скільки коштує</em>» → ✅ <strong>How much</strong> + <strong>is/are</strong>",
            ],
            hint:
                "Якщо «скільки» про предмети, які можна порахувати (яблука, книги) — це вже <strong>How many</strong>, не <strong>How much</strong>.",
        },
        {
            type: "forms",
            title: "Структура запитань",
            headers: ["Тип", "Структура", "Приклад", "Переклад"],
            rows: [
                [
                    "How often",
                    "How often + do/does + S + V?",
                    "How often do you travel?",
                    "Як часто ти подорожуєш?",
                ],
                [
                    "How long (тривалість дії)",
                    "How long + do/does + S + V?",
                    "How long does the film last?",
                    "Як довго триває фільм?",
                ],
                [
                    "How long (довжина)",
                    "How long + is/are + …?",
                    "How long is the bridge?",
                    "Яка довжина мосту?",
                ],
                [
                    "How much (кількість)",
                    "How much + uncountable noun + …?",
                    "How much sugar do you need?",
                    "Скільки цукру тобі потрібно?",
                ],
                [
                    "How much (ціна)",
                    "How much + is/are + …?",
                    "How much is this T-shirt?",
                    "Скільки коштує ця футболка?",
                ],
            ],
            hint:
                "У <strong>How much is…?</strong> ми питаємо ціну. У <strong>How much … do/does …?</strong> — кількість.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["How often do you wash your car?", "Як часто ти миєш свою машину?"],
                ["How long is the break?", "Скільки триває перерва?"],
                ["How much milk is in the fridge?", "Скільки молока в холодильнику?"],
                ["How much is this book?", "Скільки коштує ця книга?"],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>How much apples?</em> → ✅ <strong>How many apples?</strong>",
                "❌ <em>How often does the lesson last?</em> → ✅ <strong>How long does the lesson last?</strong>",
                "❌ <em>How long do you go to the gym?</em> (про частоту) → ✅ <strong>How often do you go to the gym?</strong>",
            ],
            note:
                "Спочатку визнач: <strong>частота</strong> / <strong>тривалість</strong> / <strong>кількість або ціна</strong> — і лише потім обирай <strong>how…</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (How often / How long / How much)",
        },
    ],
};

export const RULE_PAGE_BECAUSE_SO_BUT_ALTHOUGH = {
    id: "BECAUSE_SO_BUT_ALTHOUGH",
    title: "Because / so / but / although",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Сполучники для зв’язку ідей",
            html:
                "<strong>Because</strong> — причина, <strong>so</strong> — результат, <strong>but</strong> — протиставлення, " +
                "<strong>although</strong> — «хоча» (контраст більш формально).",
        },
        {
            type: "usage",
            title: "Коли який сполучник",
            badges: [
                "🤔 Причина: <strong>I stayed at home because I was tired.</strong>",
                "➡️ Результат: <strong>I was tired, so I stayed at home.</strong>",
                "⚖️ Контраст: <strong>It’s cold, but it’s sunny.</strong>",
                "🎭 Формальний контраст: <strong>Although it was cold, we went out.</strong>",
            ],
            hint:
                "<strong>Because</strong> відповідає на «чому?». <strong>So</strong> — «тому» / «тому що» (результат).",
        },
        {
            type: "forms",
            title: "Приклади структури",
            headers: ["Сполучник", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "because",
                    "Main + because + reason",
                    "I went to bed early because I was tired.",
                    "Я рано ліг спати, тому що був втомлений.",
                    "",
                ],
                [
                    "so",
                    "Reason, so + result",
                    "I was tired, so I went to bed early.",
                    "Я був втомлений, тому я рано ліг спати.",
                    "кома перед so",
                ],
                [
                    "but",
                    "Clause but clause",
                    "It’s cold but sunny.",
                    "Холодно, але сонячно.",
                    "",
                ],
                [
                    "although",
                    "Although + clause, clause",
                    "Although it was cold, we went out.",
                    "Хоча було холодно, ми пішли гуляти.",
                    "кома після although-частини",
                ],
            ],
            hint:
                "На письмі не починай речення з <strong>so</strong> занадто часто — краще поєднувати речення.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["We stayed at home because it was raining.", "Ми залишилися вдома, бо йшов дощ."],
                ["It was raining, so we stayed at home.", "Йшов дощ, тому ми залишилися вдома."],
                ["She is very busy, but she always helps me.", "Вона дуже зайнята, але завжди допомагає мені."],
                ["Although he was tired, he finished the project.", "Хоча він був втомлений, він закінчив проєкт."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Плутати <strong>because</strong> та <strong>so</strong> у структурі.",
                "❌ <em>Although but…</em> — не поєднувати ці два сполучники разом.",
            ],
            note:
                "Одна пара: <strong>because → причина</strong>, інша: <strong>so → результат</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Because / so / but / although)",
        },
    ],
};

export const RULE_PAGE_BEFORE_AFTER_ING = {
    id: "BEFORE_AFTER_ING",
    title: "Before / after + -ing",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Події до і після",
            html:
                "<strong>Before</strong> і <strong>after</strong> показують порядок подій. " +
                "Після них можна сказати або <strong>повне речення</strong>, або коротку форму з <strong>V-ing</strong>.",
        },
        {
            type: "usage",
            title: "Коли -ing, а коли повне речення",
            badges: [
                "✅ Якщо <strong>той самий виконавець</strong> у двох діях → можна <strong>before/after + V-ing</strong>.",
                "✅ Якщо <strong>виконавці різні</strong> → краще <strong>повне речення</strong> (before/after + S + V).",
                "🧠 Тест: можна підставити «<em>я</em>» у обидві дії? Якщо так — V-ing ок.",
            ],
            hint:
                "<strong>Before/after + V-ing</strong> зазвичай означає: «перед/після того як <em>я/вона/ми</em> зробили…» (той самий підмет).",
        },
        {
            type: "forms",
            title: "Структури з before / after",
            headers: ["Спосіб", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "Повне речення (same/different subject)",
                    "Before + S + V, ...",
                    "Before I go out, I check the weather.",
                    "Перед тим як я виходжу, я перевіряю погоду.",
                    "Підходить завжди.",
                ],
                [
                    "Коротко (same subject)",
                    "Before + V-ing, ...",
                    "Before going out, I check the weather.",
                    "Перед виходом я перевіряю погоду.",
                    "Той самий виконавець.",
                ],
                [
                    "Повне речення (same/different subject)",
                    "After + S + V, ...",
                    "After we finished, we went home.",
                    "Після того як ми закінчили, ми пішли додому.",
                    "Підходить завжди.",
                ],
                [
                    "Коротко (same subject)",
                    "After + V-ing, ...",
                    "After finishing, we went home.",
                    "Після завершення ми пішли додому.",
                    "Той самий виконавець.",
                ],
            ],
            hint:
                "Якщо підмет різний, не скорочуй: ✅ <strong>Before he arrives, I’ll…</strong> (а не <em>Before arriving…</em>, бо незрозуміло хто).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Before going to bed, I brush my teeth.", "Перед тим як лягти спати, я чищу зуби."],
                ["After having breakfast, she goes to work.", "Після сніданку вона йде на роботу."],
                ["Before you start, read the instructions.", "Перед тим як почати, прочитай інструкцію."],
                ["After he arrives, we’ll start.", "Після того як він приїде, ми почнемо."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Before go to bed</em> → ✅ <strong>Before going to bed</strong> / <strong>Before I go to bed</strong>",
                "❌ <em>After eat, we left</em> → ✅ <strong>After eating, we left</strong> / <strong>After we ate, we left</strong>",
                "❌ <em>Before arriving, I’ll call him</em> (хто прибуває?) → ✅ <strong>Before he arrives, I’ll call him</strong>",
            ],
            note:
                "Після <strong>before/after</strong> має бути або <strong>V-ing</strong>, або <strong>повне речення з підметом</strong>. " +
                "V-ing використовуй тільки коли виконавець очевидно той самий.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Before / after + -ing)",
        },
    ],
};

export const RULE_PAGE_BE_GOOD_AT_INTERESTED_IN_ING = {
    id: "BE_GOOD_AT_INTERESTED_IN_ING",
    title: "Be good at / interested in + -ing",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Фрази з be + прикметник + прийменник",
            html:
                "Після конструкцій <strong>be good at</strong>, <strong>be bad at</strong>, <strong>be interested in</strong> " +
                "часто використовуємо <strong>V-ing</strong>, щоб говорити про вміння чи інтереси.",
        },
        {
            type: "usage",
            title: "Структура",
            badges: [
                "🎯 Вміння: <strong>She is good at drawing.</strong>",
                "🔧 Складності: <strong>He is bad at cooking.</strong>",
                "✨ Інтереси: <strong>They are interested in learning English.</strong>",
            ],
            hint:
                "Пам’ятай про <strong>am/is/are</strong> перед прикметником: <em>I’m good at…</em>",
        },
        {
            type: "forms",
            title: "Форми з be good at / interested in",
            headers: ["Структура", "Приклад", "Переклад", "Ще приклад"],
            rows: [
                [
                    "be good at + V-ing",
                    "I’m good at singing.",
                    "Я добре співаю.",
                    "She’s good at using computers.",
                ],
                [
                    "be bad at + V-ing",
                    "He’s bad at drawing.",
                    "Він погано малює.",
                    "I’m bad at remembering names.",
                ],
                [
                    "be interested in + V-ing",
                    "We’re interested in travelling.",
                    "Нас цікавлять подорожі.",
                    "She’s interested in learning Spanish.",
                ],
            ],
            hint:
                "У запитаннях змінюється <strong>to be</strong>: <strong>Are you good at…?</strong>",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’m good at solving puzzles.", "Я добре розв’язую головоломки."],
                ["She’s interested in studying biology.", "Їй цікаво вивчати біологію."],
                ["They are bad at keeping secrets.", "Вони погано вміють зберігати секрети."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I good at sing</em> → ✅ <strong>I’m good at singing</strong>",
                "❌ Забувати прийменник: <em>interested English</em> → ✅ <strong>interested in English</strong>",
            ],
            note:
                "Фіксовані поєднання: <strong>good at</strong>, <strong>bad at</strong>, <strong>interested in</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Be good at / interested in + -ing)",
        },
    ],
};

export const RULE_PAGE_MAKE_DO_DIFFERENCE = {
    id: "MAKE_DO_DIFFERENCE",
    title: "Make / do (difference)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Короткий сенс",
            html:
                "<strong>Do</strong> = виконувати дію / роботу. " +
                "<strong>Make</strong> = створювати результат або «робити так, що щось стається».",
        },
        {
            type: "usage",
            title: "Як швидко обрати",
            badges: [
                "✅ Якщо це <strong>завдання/робота/рутина</strong> → <strong>do</strong> (homework, chores, work).",
                "✅ Якщо це <strong>результат</strong> (щось «готове») → <strong>make</strong> (a cake, a plan, a decision).",
                "✅ Якщо це <strong>ефект/вплив</strong> → <strong>make</strong>: <strong>make a difference</strong>.",
            ],
            hint:
                "Не перекладай буквально «робити». Думай: <em>виконую</em> (do) чи <em>створюю/спричиняю</em> (make).",
        },
        {
            type: "forms",
            title: "Найчастіші зв’язки (якорі)",
            headers: ["Do (виконувати)", "Make (створювати/спричиняти)", "Коментар"],
            rows: [
                [
                    "do homework / do the dishes / do the shopping",
                    "make a cake / make a plan / make a decision",
                    "Рутина vs результат",
                ],
                [
                    "do a job / do some work / do exercise",
                    "make a mistake / make money / make a call",
                    "Типові стійкі фрази",
                ],
                [
                    "—",
                    "make a difference",
                    "Коли говоримо про вплив",
                ],
            ],
            hint:
                "Це <strong>готові поєднання</strong> (collocations) — їх краще вчити як слова-«пари».",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I always do my homework in the evening.", "Я завжди роблю домашнє ввечері."],
                ["We did the shopping yesterday.", "Ми зробили покупки вчора."],
                ["Don’t make the same mistake again.", "Не роби ту саму помилку знову."],
                ["Even small actions can make a difference.", "Навіть маленькі дії можуть змінити ситуацію."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>make homework</em> → ✅ <strong>do homework</strong>",
                "❌ <em>do a mistake</em> → ✅ <strong>make a mistake</strong>",
                "❌ <em>do a difference</em> → ✅ <strong>make a difference</strong>",
            ],
            note:
                "Якщо бачиш іменник типу <em>mistake / decision / plan / difference</em> — майже завжди це <strong>make</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Make / do)",
        },
    ],
};

/* ============================
   B1 — PRESENT PERFECT
============================ */
export const RULE_PAGE_PRESENT_PERFECT = {
    id: "PRESENT_PERFECT",
    title: "Present Perfect (have + V3)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає Present Perfect",
            html: "<strong>Present Perfect</strong> описує досвід, дії з результатом у теперішньому або щойно завершені дії."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "📌 Досвід: <strong>I’ve been to Italy.</strong>",
                "🎯 Результат зараз: <strong>She has lost her keys.</strong>",
                "🕒 Нещодавно: <strong>We’ve just finished.</strong>",
                "📅 Дії до тепер: <strong>They’ve lived here for years.</strong>"
            ],
            hint: "Ставимо <em>have/has + V3</em>. Не кажемо <em>I have finished yesterday</em>."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Форма", "Ствердження", "Заперечення", "Питання"],
            rows: [
                ["I / You / We / They", "have worked", "haven’t worked", "Have they worked?"],
                ["He / She / It", "has worked", "hasn’t worked", "Has he worked?"]
            ],
            hint: "Питання: <strong>Have/Has + підмет + V3?</strong>"
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’ve already eaten.", "Я вже поїв."],
                ["She hasn’t called yet.", "Вона ще не подзвонила."],
                ["Have you ever tried sushi?", "Ти коли-небудь пробував суші?"]
            ]
        },
        {
            type: "mistakes",
            title: "Present Perfect vs Past Simple — як обрати",
            bullets: [
                "<em>Є конкретний час у минулому?</em><br/>(вчора, минулого року, у 2020, дві години тому) → ✅ <strong>Past Simple</strong>",
                "<em>Важливо, що це означає зараз, а не коли саме?</em> → ✅ <strong>Present Perfect</strong>",
                "<em>Мова про життєвий досвід?</em><br/>(колись / ніколи / вже / ще не) → ✅ <strong>Present Perfect</strong>",
                "<em>Просто розповідаю подію в минулому?</em> → ✅ <strong>Past Simple</strong>",
                "<em>Можна додати «і це важливо зараз»?</em> → ✅ <strong>Present Perfect</strong>"
            ],
            note:
                "Коротко: <strong>коли саме в минулому → Past Simple</strong>, <strong>результат або досвід зараз → Present Perfect</strong>.",
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I have saw</em> → ✅ <strong>I have seen</strong>",
                "❌ <em>He have done</em> → ✅ <strong>He has done</strong>",
                "❌ Використання з конкретним минулим часом (<em>yesterday</em>)."
            ],
            note: "Не використовуємо Present Perfect з часовими маркерами минулого."
        },
        { type: "trainer", title: "Міні-тренажер (Present Perfect)" }
    ]
};


/* ============================
   SINCE / FOR
============================ */
export const RULE_PAGE_SINCE_FOR = {
    id: "SINCE_FOR",
    title: "Since / For",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають since і for",
            html:
                "<strong>Since</strong> вказує на <em>початковий момент у часі</em> (коли щось почалося).<br/>" +
                "<strong>For</strong> вказує на <em>тривалість</em> (як довго це триває).",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "📍 Початкова точка → <strong>since 2010 / since Monday / since I was a child</strong>",
                "⏳ Період часу → <strong>for two years / for a long time / for three hours</strong>",
                "🕒 Часто разом із <strong>Present Perfect</strong>: <strong>I’ve lived here since 2015.</strong>",
            ],
            hint:
                "Запитай себе: <em>коли почалося?</em> → <strong>since</strong>; " +
                "<em>як довго?</em> → <strong>for</strong>.",
        },
        {
            type: "forms",
            title: "Типові структури",
            headers: ["Конструкція", "Приклад", "Пояснення"],
            rows: [
                [
                    "Present Perfect + since + момент",
                    "She has worked here <strong>since 2018</strong>.",
                    "З 2018 року (точка початку).",
                ],
                [
                    "Present Perfect + for + період",
                    "They have lived here <strong>for five years</strong>.",
                    "Протягом 5 років (тривалість).",
                ],
            ],
            hint:
                "<strong>Since</strong> не використовується з періодами часу, " +
                "а <strong>for</strong> — з конкретними датами.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["We’ve lived here since 2015.", "Ми живемо тут з 2015 року."],
                ["I’ve known her for years.", "Я знаю її багато років."],
                ["He has been tired since the morning.", "Він втомлений з ранку."],
                ["She has worked here for a long time.", "Вона працює тут уже давно."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>for 2010</em> → це конкретний момент → ✅ <strong>since 2010</strong>",
                "❌ <em>since two years</em> → це період → ✅ <strong>for two years</strong>",
                "❌ <em>I live here since 2015.</em> → бракує Perfect → ✅ <strong>I have lived here since 2015.</strong>",
                "❌ <em>for Monday</em> → день = точка → ✅ <strong>since Monday</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Since / For)",
        },
    ],
};

/* ============================
   PRESENT PERFECT CONTINUOUS
============================ */
export const RULE_PAGE_PRESENT_PERFECT_CONT = {
    id: "PRESENT_PERFECT_CONT",
    title: "Present Perfect Continuous",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає Present Perfect Continuous",
            html:
                "<strong>Present Perfect Continuous</strong> описує <em>дію, що почалася в минулому</em> " +
                "і <em>триває до теперішнього моменту</em> або <em>щойно закінчилась</em>, " +
                "але її результат або ефект усе ще помітний.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "⏳ Тривалість дії → <strong>I’ve been studying for three hours.</strong>",
                "😓 Нещодавня дія з видимим результатом → <strong>She’s been crying.</strong>",
                "🏃 Процес (фокус на дії, не на результаті) → <strong>They’ve been working all day.</strong>",
            ],
            hint:
                "Фокус не на <em>результаті</em>, а на <em>процесі</em> або <em>тривалості</em> дії.",
        },
        {
            type: "forms",
            title: "Форма часу",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "Ствердження",
                    "have / has + been + V-ing",
                    "I <strong>have been working</strong> all day.",
                ],
                [
                    "Заперечення",
                    "have / has + not + been + V-ing",
                    "She <strong>hasn’t been sleeping</strong> well.",
                ],
                [
                    "Питання",
                    "Have / Has + підмет + been + V-ing?",
                    "<strong>Have</strong> you <strong>been waiting</strong> long?",
                ],
            ],
            hint:
                "<strong>Been</strong> — це форма дієслова <em>be</em>, а не <em>being</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’ve been waiting for you.", "Я чекаю на тебе вже деякий час."],
                ["She has been studying since morning.", "Вона навчається з ранку."],
                ["They’ve been arguing all evening.", "Вони сперечаються весь вечір."],
                ["Have you been working here long?", "Ти давно тут працюєш?"],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He has being working</em> → ✅ <strong>He has been working</strong>",
                "❌ <em>I am working here for 5 years</em> → ✅ <strong>I have been working here for 5 years</strong>",
                "❌ Використання зі <em>стативними дієсловами</em> (know, like, love) → ✅ <strong>I’ve known her for years</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Present Perfect Continuous)",
        },
    ],
};

/* ============================
   ALREADY / YET / JUST
============================ */
export const RULE_PAGE_ALREADY_YET_JUST = {
    id: "ALREADY_YET_JUST",
    title: "Already / Yet / Just",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають already / yet / just",
            html:
                "<strong>Already</strong> = <em>вже</em> (раніше, ніж очікували).<br/>" +
                "<strong>Yet</strong> = <em>вже?</em> (у питанні) / <em>ще не</em> (у запереченні).<br/>" +
                "<strong>Just</strong> = <em>щойно</em> (дуже недавно).",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "✅ <strong>Already</strong> — переважно у ствердженнях: <strong>I’ve already eaten.</strong>",
                "✅ <strong>Yet</strong> — у питаннях і запереченнях: <strong>Have you finished yet?</strong> / <strong>I haven’t finished yet.</strong>",
                "✅ <strong>Just</strong> — «щойно» (дуже недавно): <strong>She’s just left.</strong>",
                "🧠 Найчастіше разом із <strong>Present Perfect</strong> (have/has + V3).",
            ],
            hint:
                "Типове місце в реченні: <strong>already / just</strong> — між <em>have/has</em> і <em>V3</em>; " +
                "<strong>yet</strong> — зазвичай <em>в кінці</em> речення.",
        },
        {
            type: "forms",
            title: "Позиція в реченні",
            headers: ["Слово", "Де стоїть", "Приклад"],
            rows: [
                ["already", "have/has + already + V3", "I have <strong>already</strong> finished."],
                ["just", "have/has + just + V3", "She has <strong>just</strong> arrived."],
                ["yet", "зазвичай у кінці (questions/negatives)", "Have you finished <strong>yet</strong>? / I haven’t finished <strong>yet</strong>."],
            ],
            hint:
                "У розмовній мові <strong>already</strong> інколи буває наприкінці: <strong>Have you finished already?</strong> (здивування).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’ve already finished.", "Я вже закінчив."],
                ["We haven’t decided yet.", "Ми ще не вирішили."],
                ["Have you called her yet?", "Ти вже їй подзвонив?"],
                ["She’s just left.", "Вона щойно пішла."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Did you finish yet?</em> → ✅ <strong>Have you finished yet?</strong> (коли важливий результат «вже/ще ні»)",
                "❌ <em>I just have finished</em> → ✅ <strong>I’ve just finished</strong>",
                "❌ <em>I haven’t already done it.</em> → ✅ <strong>I haven’t done it yet.</strong> (ще не)",
                "❌ <em>She has left just.</em> → ✅ <strong>She has just left.</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Already / Yet / Just)",
        },
    ],
};

/* ============================
   PAST PERFECT
============================ */
export const RULE_PAGE_PAST_PERFECT = {
    id: "PAST_PERFECT",
    title: "Past Perfect",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає Past Perfect",
            html:
                "<strong>Past Perfect</strong> використовується, щоб показати, що одна дія " +
                "відбулася <em>раніше за іншу дію в минулому</em>. " +
                "Це «минуле до минулого».",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "⏱️ Дія, що сталася раніше іншої минулої дії: <strong>She had left before I arrived.</strong>",
                "📚 Причина / передумова: <strong>I was tired because I had worked all day.</strong>",
                "📖 Розповіді, історії (коли важливо показати порядок подій).",
            ],
            hint:
                "Форма: <strong>had + V3</strong>. " +
                "Часто використовується з <em>before, after, when, by the time</em>.",
        },
        {
            type: "forms",
            title: "Форма часу",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "Ствердження",
                    "had + V3",
                    "They <strong>had finished</strong> the project.",
                ],
                [
                    "Заперечення",
                    "had not (hadn’t) + V3",
                    "She <strong>hadn’t seen</strong> him before.",
                ],
                [
                    "Питання",
                    "Had + підмет + V3?",
                    "<strong>Had</strong> you <strong>met</strong> her before?",
                ],
            ],
            hint:
                "<strong>Had</strong> однакове для всіх осіб.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                [
                    "They had finished the project before Monday.",
                    "Вони завершили проєкт до понеділка.",
                ],
                [
                    "By the time we arrived, the movie had started.",
                    "На момент нашого приходу фільм уже почався.",
                ],
                [
                    "I realized I had left my phone at home.",
                    "Я зрозумів, що залишив телефон удома.",
                ],
                [
                    "Had you seen him before?",
                    "Ти бачив його раніше?",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Використання <em>Past Perfect</em> без другої минулої дії або чіткого контексту.",
                "❌ <em>had went</em> → ✅ <strong>had gone</strong>",
                "❌ <em>After she had arrived, he left.</em> → зайве <em>had</em> → ✅ <strong>After she arrived, he left.</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Past Perfect)",
        },
    ],
};

/* ============================
   USED TO
============================ */
export const RULE_PAGE_USED_TO = {
    id: "USED_TO",
    title: "Used to + V",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає used to",
            html:
                "<strong>Used to</strong> використовується, щоб говорити про <em>звички або стани в минулому</em>, " +
                "які <em>більше не є правдою зараз</em>.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🧒 Минулі звички (які припинились): <strong>I used to play outside every day.</strong>",
                "🏠 Минулі стани: <strong>We used to live in Kyiv.</strong>",
                "🚬 Контраст «раніше vs зараз»: <strong>I used to smoke, but I don’t anymore.</strong>",
            ],
            hint:
                "Якщо можна додати в думках <em>«але тепер — ні»</em>, " +
                "це хороший кандидат для <strong>used to</strong>.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "Ствердження",
                    "used to + V1",
                    "I <strong>used to work</strong> at night.",
                ],
                [
                    "Заперечення",
                    "did not (didn’t) + use to + V1",
                    "I <strong>didn’t use to like</strong> coffee.",
                ],
                [
                    "Питання",
                    "Did + підмет + use to + V1?",
                    "<strong>Did</strong> you <strong>use to live</strong> here?",
                ],
            ],
            hint:
                "У запереченнях і питаннях пишемо <strong>use</strong> без <em>-d</em>, " +
                "бо <strong>did</strong> уже показує минулий час.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I used to have long hair.", "У мене раніше було довге волосся."],
                ["She used to be very shy.", "Вона раніше була дуже сором’язливою."],
                ["We didn’t use to eat out often.", "Раніше ми нечасто їли поза домом."],
                ["Did you use to play football?", "Ти раніше грав у футбол?"],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>didn’t used to</em> → ✅ <strong>didn’t use to</strong>",
                "❌ <em>Did you used to…?</em> → ✅ <strong>Did you use to…?</strong>",
                "❌ Плутанина з <em>be used to</em> → ✅ <strong>I am used to waking up early.</strong> (це вже про «звик»)",
                "❌ Використання для теперішніх звичок → ❌ <em>I use to drink coffee every day.</em>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Used to)",
        },
    ],
};

/* ============================
   BE USED TO / GET USED TO
============================ */
export const RULE_PAGE_BE_USED_TO_GET_USED_TO = {
    id: "BE_USED_TO_GET_USED_TO",
    title: "Be used to / Get used to",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають be used to / get used to",
            html:
                "<strong>Be used to</strong> означає <em>бути звиклим</em> до чогось (стан).<br/>" +
                "<strong>Get used to</strong> означає <em>процес звикання</em> (зміна стану).",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🟢 Стан («вже звик») → <strong>I’m used to cold weather.</strong>",
                "🔄 Процес («звикаю») → <strong>She’s getting used to her new job.</strong>",
                "🕒 Можуть вживатися в різних часах: <strong>I was used to… / I will get used to…</strong>",
            ],
            hint:
                "Слово <strong>to</strong> тут — це <em>прийменник</em>, " +
                "тому після нього вживаємо <strong>іменник</strong> або <strong>V-ing</strong>.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Конструкція", "Структура", "Приклад"],
            rows: [
                [
                    "Be used to",
                    "be (am/is/are/was/were) + used to + N / V-ing",
                    "I am used to waking up early.",
                ],
                [
                    "Get used to",
                    "get (get / gets / got / getting) + used to + N / V-ing",
                    "He got used to driving on the left.",
                ],
            ],
            hint:
                "<strong>Be used to</strong> ≠ <strong>used to + V</strong> (минула звичка).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’m used to waking up early.", "Я звик рано прокидатися."],
                ["She isn’t used to spicy food.", "Вона не звикла до гострої їжі."],
                ["He got used to driving on the left.", "Він звик їздити лівою стороною."],
                ["You’ll get used to it.", "Ти до цього звикнеш."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I’m used to eat early.</em> → ✅ <strong>I’m used to eating early.</strong>",
                "❌ <em>I used to waking up early.</em> → ✅ <strong>I used to wake up early.</strong>",
                "❌ Плутанина значень: <em>used to</em> (раніше) vs <em>be/get used to</em> (звик / звикаю).",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Be used to / Get used to)",
        },
    ],
};

/* ============================
   SECOND CONDITIONAL
============================ */
export const RULE_PAGE_SECOND_CONDITIONAL = {
    id: "SECOND_CONDITIONAL",
    title: "If + Past, would + V (2nd Conditional)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке Second Conditional",
            html:
                "<strong>Second Conditional</strong> використовують для <em>нереальних</em>, <em>уявних</em> або <em>малоймовірних</em> ситуацій " +
                "в <strong>теперішньому</strong> або <strong>майбутньому</strong>.",
        },
        {
            type: "usage",
            title: "Коли використовувати 2nd Conditional",
            badges: [
                "💭 Уявна ситуація: <strong>If I had more time, I would travel.</strong>",
                "🎯 Порада / мрія: <strong>If I were you, I’d talk to her.</strong>",
                "🎲 Малоймовірне: <strong>If I won the lottery, I’d buy a house.</strong>",
            ],
            hint:
                "Форма <strong>were</strong> можлива для всіх осіб, особливо після <em>If I / If he / If she</em>.",
        },
        {
            type: "forms",
            title: "Структура Second Conditional",
            headers: ["Позиція if", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "If на початку",
                    "If + Past Simple, would + V",
                    "If I knew her number, I’d call her.",
                    "Якби я знав її номер, я б їй подзвонив.",
                    "Кома після if-частини.",
                ],
                [
                    "If в середині",
                    "Would + V if + Past Simple",
                    "I’d call her if I knew her number.",
                    "Я б їй подзвонив, якби знав її номер.",
                    "Коми немає.",
                ],
            ],
            hint:
                "Після <strong>if</strong> не використовуємо <em>would</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                [
                    "If I were rich, I’d travel around the world.",
                    "Якби я був багатий, я б подорожував світом.",
                ],
                [
                    "Would you help me if I asked?",
                    "Ти б допоміг мені, якби я попросив?",
                ],
                [
                    "She wouldn’t be so tired if she slept more.",
                    "Вона б не була такою втомленою, якби більше спала.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Second vs Third Conditional — як обрати",
            bullets: [
                "<em>Це про тепер або майбутнє?</em><br/>(уявляю іншу ситуацію зараз / потім) → ✅ <strong>Second Conditional</strong>",
                "<em>Це про минуле, яке вже не змінити?</em> → ✅ <strong>Third Conditional</strong>",
                "<em>Можна подумки додати фразу «але цього вже не можна змінити»?</em> → ✅ <strong>Third Conditional</strong>",
                "<em>Є відчуття жалю або докору?</em> → ✅ <strong>Third Conditional</strong>",
                "<em>Це просто фантазія або уява, без жалю?</em> → ✅ <strong>Second Conditional</strong>"
            ],
            note:
                "Коротко: <strong>уявляю інше тепер / майбутнє → Second</strong>, <strong>шкодую про минуле → Third</strong>.",
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>If I will have time…</em> → ✅ <strong>If I had time…</strong>",
                "❌ <em>If I would know…</em> → ✅ <strong>If I knew…</strong>",
            ],
            note:
                "Умовна частина завжди в <strong>Past Simple</strong>, навіть якщо мова про теперішнє або майбутнє.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Second Conditional)",
        },
    ],
};


/* ============================
   THIRD CONDITIONAL
============================ */
export const RULE_PAGE_THIRD_CONDITIONAL = {
    id: "THIRD_CONDITIONAL",
    title: "If + Past Perfect, would have + V3 (3rd Conditional)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке Third Conditional",
            html:
                "<strong>Third Conditional</strong> використовують, щоб говорити про <em>минуле</em>, яке вже <strong>неможливо змінити</strong>. " +
                "Ми уявляємо інший результат: <em>«якби тоді…», «я шкодую», «могло бути інакше»</em>.",
        },
        {
            type: "usage",
            title: "Коли використовувати 3rd Conditional",
            badges: [
                "😔 Жаль: <strong>If I had known, I would have helped.</strong>",
                "🔍 Аналіз помилки: <strong>If we had left earlier, we wouldn’t have missed the bus.</strong>",
                "🎯 Альтернатива: <strong>If she had studied, she would have passed the exam.</strong>",
            ],
            hint:
                "Простий сенс: <strong>умова в минулому</strong> → <strong>інший результат у минулому</strong> (але вже пізно змінювати).",
        },
        {
            type: "forms",
            title: "Структура Third Conditional",
            headers: ["Позиція if", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "If на початку",
                    "If + Past Perfect, would have + V3",
                    "If I had studied, I would have passed.",
                    "Якби я вчився, я б склав (іспит).",
                    "Кома після if-частини.",
                ],
                [
                    "If в середині",
                    "Would have + V3 if + Past Perfect",
                    "I would have passed if I had studied.",
                    "Я б склав (іспит), якби я вчився.",
                    "Коми немає.",
                ],
            ],
            hint:
                "У if-частині не використовуємо <em>would</em>: ✅ <strong>If I had…</strong> (не <em>If I would have…</em>).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                [
                    "If I had known about the meeting, I would have come.",
                    "Якби я знав про зустріч, я б прийшов.",
                ],
                [
                    "She wouldn’t have been late if she had taken a taxi.",
                    "Вона б не запізнилась, якби взяла таксі.",
                ],
                [
                    "Would you have gone if I had invited you?",
                    "Ти б пішов, якби я тебе запросив?",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Second vs Third Conditional — як обрати",
            bullets: [
                "<em>Це про тепер або майбутнє?</em><br/>(уявляю іншу ситуацію зараз / потім) → ✅ <strong>Second Conditional</strong>",
                "<em>Це про минуле, яке вже не змінити?</em> → ✅ <strong>Third Conditional</strong>",
                "<em>Можна подумки додати фразу «але цього вже не можна змінити»?</em> → ✅ <strong>Third Conditional</strong>",
                "<em>Є відчуття жалю або докору?</em> → ✅ <strong>Third Conditional</strong>",
                "<em>Це просто фантазія або уява, без жалю?</em> → ✅ <strong>Second Conditional</strong>"
            ],
            note:
                "Коротко: <strong>уявляю інше тепер / майбутнє → Second</strong>, <strong>шкодую про минуле → Third</strong>.",
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>If I would have known…</em> → ✅ <strong>If I had known…</strong>",
                "❌ <em>would had</em> → ✅ <strong>would have</strong>",
                "❌ Плутанина з 2nd Conditional (уявне тепер/майбутнє) → ✅ 3rd Conditional = <strong>жаль про минуле</strong>",
            ],
            note:
                "Як перевірка: якщо це про минуле і вже нічого не зміниш — майже завжди це <strong>Third Conditional</strong>.",
        },
        {
            type: "trainer",
            title: "Міні-тренажер (3rd Conditional)",
        },
    ],
};

/* ============================
   WISH + PAST / PAST PERFECT
============================ */
export const RULE_PAGE_WISH_PAST_PAST_PERFECT = {
    id: "WISH_PAST_PAST_PERFECT",
    title: "Wish + Past / Past Perfect",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає конструкція wish",
            html:
                "<strong>Wish + Past Simple</strong> використовується, щоб висловити <em>жаль або нереальну ситуацію в теперішньому</em>.<br/>" +
                "<strong>Wish + Past Perfect</strong> — щоб висловити <em>жаль про минуле</em> (те, що вже неможливо змінити).",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "😔 Жаль про теперішнє → <strong>I wish I knew the answer.</strong>",
                "⏳ Жаль про минуле → <strong>I wish I had studied more.</strong>",
                "⚠️ Часто з емоціями: regret, disappointment, sadness.",
            ],
            hint:
                "<strong>Wish</strong> не описує реальність — після нього вживаємо форми минулого, " +
                "навіть якщо говоримо про тепер.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Тип жалю", "Структура", "Приклад"],
            rows: [
                [
                    "Теперішнє",
                    "wish + Past Simple",
                    "I wish I knew what to do.",
                ],
                [
                    "Теперішнє (to be)",
                    "wish + were",
                    "I wish I were taller.",
                ],
                [
                    "Минуле",
                    "wish + had + V3",
                    "She wishes she had told him the truth.",
                ],
            ],
            hint:
                "У формальній та нейтральній англійській після <strong>wish</strong> часто використовують <strong>were</strong> для всіх осіб.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I wish I were taller.", "Шкода, що я не вищий."],
                ["I wish I knew her phone number.", "Шкода, що я не знаю її номер."],
                ["I wish I had studied harder.", "Шкода, що я вчився недостатньо."],
                ["He wishes he hadn’t said that.", "Він шкодує, що це сказав."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I wish I would know.</em> → ✅ <strong>I wish I knew.</strong>",
                "❌ <em>I wish I will go there.</em> → ✅ <strong>I wish I could go there.</strong>",
                "❌ <em>I wish I didn’t say that yesterday.</em> → для минулого → ✅ <strong>I wish I hadn’t said that.</strong>",
                "❌ <em>wish + will</em> для жалю → не використовується.",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Wish + Past / Past Perfect)",
        },
    ],
};

/* ============================
   MODAL PERFECTS (should have / could have)
============================ */
export const RULE_PAGE_MODAL_PERFECTS = {
    id: "MODAL_PERFECTS",
    title: "Modal perfects (should have / could have)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають modal perfects",
            html:
                "<strong>Modal perfects</strong> — це модальні дієслова з <em>have + V3</em>, " +
                "які використовуються, щоб говорити про <em>минулі події, що не відбулися або оцінюються після факту</em>.<br/>" +
                "<strong>Should have</strong> = «треба було, але не зробив».<br/>" +
                "<strong>Could have</strong> = «могло статися / міг би, але не сталося».",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🧭 Порада або жаль про минуле → <strong>You should have told me.</strong>",
                "🎯 Нереалізована можливість → <strong>He could have won.</strong>",
                "⚠️ Критика після факту → <strong>They should have known better.</strong>",
            ],
            hint:
                "Форма: <strong>modal + have + V3</strong> " +
                "(should / could / might + have + V3).",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Модальне", "Структура", "Приклад"],
            rows: [
                [
                    "should have",
                    "should + have + V3",
                    "You should have called me.",
                ],
                [
                    "could have",
                    "could + have + V3",
                    "She could have missed the train.",
                ],
                [
                    "might have",
                    "might + have + V3",
                    "He might have forgotten about it.",
                ],
            ],
            hint:
                "<strong>Have</strong> завжди в базовій формі, незалежно від часу.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I should have studied more.", "Мені треба було більше вчитися."],
                ["She could have been hurt.", "Вона могла постраждати."],
                ["We might have made a mistake.", "Ми, можливо, зробили помилку."],
                ["You shouldn’t have said that.", "Тобі не варто було цього казати."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>should had</em> → ✅ <strong>should have</strong>",
                "❌ <em>could had gone</em> → ✅ <strong>could have gone</strong>",
                "❌ Плутанина з теперішніми модальними: <em>You should go</em> ≠ <strong>You should have gone</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Modal Perfects)",
        },
    ],
};


/* ============================
   GERUND VS INFINITIVE
============================ */
export const RULE_PAGE_GERUND_VS_INFINITIVE = {
    id: "GERUND_VS_INFINITIVE",
    title: "Gerund vs Infinitive",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке gerund і infinitive",
            html:
                "<strong>Gerund</strong> — це форма дієслова з <em>-ing</em> (<strong>V-ing</strong>), " +
                "яка поводиться як іменник.<br/>" +
                "<strong>Infinitive</strong> — це форма <strong>to + V</strong>, яка часто показує мету, намір або рішення.",
        },
        {
            type: "usage",
            title: "Коли що вживати",
            badges: [
                "🟢 Після деяких дієслів — <strong>V-ing</strong>: <strong>enjoy, mind, finish, suggest, avoid</strong>",
                "🔵 Після інших — <strong>to + V</strong>: <strong>want, need, decide, plan, hope</strong>",
                "⚠️ Після деяких дієслів форма змінює значення: <strong>stop / remember / try</strong>",
            ],
            hint:
                "Форму <strong>не вибирають «за відчуттям»</strong> — її потрібно запам’ятовувати разом із дієсловом.",
        },
        {
            type: "forms",
            title: "Типові моделі",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "Gerund",
                    "verb + V-ing",
                    "I enjoy reading before bed.",
                ],
                [
                    "Infinitive",
                    "verb + to + V",
                    "She decided to leave early.",
                ],
                [
                    "Різний зміст",
                    "stop / remember / try + V-ing / to + V",
                    "He stopped smoking / He stopped to smoke.",
                ],
            ],
            hint:
                "<strong>V-ing</strong> часто говорить про саму дію або досвід, " +
                "а <strong>to + V</strong> — про мету або наступну дію.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I enjoy reading.", "Я люблю читати."],
                ["She wants to go home.", "Вона хоче піти додому."],
                ["He stopped smoking.", "Він кинув курити."],
                ["He stopped to smoke.", "Він зупинився, щоб покурити."],
                ["I remember meeting her.", "Я пам’ятаю, як зустрів її."],
                ["Remember to lock the door.", "Не забудь зачинити двері."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He suggested to go.</em> → ✅ <strong>He suggested going.</strong>",
                "❌ <em>I decided going.</em> → ✅ <strong>I decided to go.</strong>",
                "❌ <em>She enjoys to read.</em> → ✅ <strong>She enjoys reading.</strong>",
                "❌ Плутанина значень: <em>stop doing</em> ≠ <em>stop to do</em>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Gerund vs Infinitive)",
        },
    ],
};


/* ============================
   PASSIVE VOICE (all tenses)
============================ */
export const RULE_PAGE_PASSIVE_VOICE_ALL_TENSES = {
    id: "PASSIVE_VOICE_ALL_TENSES",
    title: "Passive Voice",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає Passive Voice",
            html:
                "<strong>Passive Voice</strong> використовується, коли важливі <em>дія</em> або її <em>результат</em>, " +
                "а не той, хто її виконує. Підмет <em>отримує</em> дію.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "📦 Загальні факти, виробництво: <strong>The phones are made in China.</strong>",
                "❓ Виконавець невідомий або неважливий: <strong>The window was broken.</strong>",
                "📑 Офіційний / формальний стиль: <strong>The document has been signed.</strong>",
                "🎯 Фокус на результаті: <strong>The work is done.</strong>",
            ],
            hint:
                "Базова формула пасиву: <strong>be + V3</strong>. " +
                "Час визначається формою <em>be</em>.",
        },
        {
            type: "forms",
            title: "Форми в різних часах",
            headers: ["Час", "Структура", "Приклад"],
            rows: [
                [
                    "Present Simple",
                    "am / is / are + V3",
                    "The room is cleaned every day.",
                ],
                [
                    "Past Simple",
                    "was / were + V3",
                    "The letter was sent yesterday.",
                ],
                [
                    "Future (will)",
                    "will be + V3",
                    "The results will be announced tomorrow.",
                ],
                [
                    "Present Perfect",
                    "have / has been + V3",
                    "The work has been finished.",
                ],
                [
                    "Modal verbs",
                    "modal + be + V3",
                    "The problem can be solved.",
                ],
            ],
            hint:
                "Актив → пасив: <em>object</em> стає <em>subject</em>. " +
                "Виконавця додаємо через <strong>by</strong>, лише якщо це важливо.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The room is cleaned every day.", "Кімнату прибирають щодня."],
                ["The letter was sent yesterday.", "Листа відправили вчора."],
                ["The house has been built recently.", "Будинок нещодавно збудували."],
                ["The rules must be followed.", "Правил потрібно дотримуватися."],
                ["The book was written by Orwell.", "Книгу написав Орвелл."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Неправильна форма <em>be</em> → час не узгоджений.",
                "❌ <em>is build</em> → ✅ <strong>is built</strong> (потрібен V3).",
                "❌ Зайвий <strong>by</strong>, коли виконавець очевидний або неважливий.",
                "❌ Неможливо утворити пасив від неперехідних дієслів (<em>arrive, happen</em>).",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Passive Voice)",
        },
    ],
};


/* ============================
   GET + PAST PARTICIPLE
============================ */
export const RULE_PAGE_GET_PAST_PARTICIPLE = {
    id: "GET_PAST_PARTICIPLE",
    title: "Get + past participle",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає конструкція get + V3",
            html:
                "<strong>Get + past participle (V3)</strong> використовується, щоб показати, " +
                "що хтось <em>стає</em> або <em>потрапляє в певний стан</em>. " +
                "Часто має <em>неформальний</em> або <em>розмовний</em> відтінок.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🔄 Зміна стану: <strong>get married / get lost / get dressed</strong>",
                "⚠️ Часто несподіваний або небажаний результат: <strong>get hurt / get fired</strong>",
                "🗣️ Розмовна альтернатива пасиву: <strong>She got hired.</strong>",
            ],
            hint:
                "На відміну від класичного пасиву (<em>be + V3</em>), " +
                "<strong>get + V3</strong> звучить менш формально і динамічніше.",
        },
        {
            type: "forms",
            title: "Форма",
            headers: ["Структура", "Приклад", "Пояснення"],
            rows: [
                [
                    "get + V3",
                    "He got injured.",
                    "Став травмованим (результат).",
                ],
                [
                    "get + V3 (у різних часах)",
                    "She is getting promoted.",
                    "Форма get змінюється за часами.",
                ],
            ],
            hint:
                "<strong>Get</strong> може стояти в будь-якому часі: " +
                "<em>get / gets / got / is getting / has got</em> тощо.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She got hired last month.", "Вона отримала роботу минулого місяця."],
                ["Don’t get hurt.", "Не поранись."],
                ["He got fired because he was late.", "Його звільнили, бо він запізнювався."],
                ["The kids got excited.", "Діти збудилися."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Плутанина з класичним пасивом → <em>get + V3</em> ≠ <em>be + V3</em> (різний стиль).",
                "❌ <em>get married with</em> → ✅ <strong>get married to</strong>",
                "❌ Використання в офіційних текстах → краще <strong>be + V3</strong>.",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Get + past participle)",
        },
    ],
};

/* ============================
   REPORTED SPEECH
============================ */
export const RULE_PAGE_REPORTED_SPEECH = {
    id: "REPORTED_SPEECH",
    title: "Reported speech",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке reported speech",
            html:
                "<strong>Reported speech</strong> (непряма мова) використовується, " +
                "коли ми <em>передаємо чиїсь слова</em> без точного цитування.",
        },
        {
            type: "usage",
            title: "Основні правила",
            badges: [
                "⏪ Зсув часів назад (backshift): <em>am → was, did → had done</em>",
                "🗣️ <strong>say</strong> / <strong>tell</strong> (tell + object)",
                "👤 Зміна займенників і присвійних",
                "🕒 Зміна слів часу й місця (now → then, today → that day)",
            ],
            hint:
                "Приклад: <em>“I am tired.”</em> → <strong>He said he was tired.</strong>",
        },
        {
            type: "forms",
            title: "Типові зміни",
            headers: ["Пряма мова", "Непряма мова", "Коментар"],
            rows: [
                [
                    "Present Simple",
                    "Past Simple",
                    "I work → he said he worked",
                ],
                [
                    "Present Continuous",
                    "Past Continuous",
                    "I am working → he said he was working",
                ],
                [
                    "Past Simple",
                    "Past Perfect",
                    "I finished → he said he had finished",
                ],
                [
                    "will",
                    "would",
                    "I will call → he said he would call",
                ],
            ],
            hint:
                "Зсув часу зазвичай відбувається, якщо дієслово повідомлення стоїть у минулому.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She said she was busy.", "Вона сказала, що була зайнята."],
                ["He told me he had finished.", "Він сказав мені, що закінчив."],
                ["They said they would come later.", "Вони сказали, що прийдуть пізніше."],
                ["I told her I didn’t know.", "Я сказав їй, що не знаю."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He said me</em> → ✅ <strong>He told me</strong>",
                "❌ Відсутній зсув часу → <em>He said he is tired</em> → ✅ <strong>he was tired</strong>",
                "❌ Не змінюють займенники → <em>She said I was late</em> (коли треба <em>he / she</em>)",
                "❌ Механічний backshift, коли він не потрібен (загальні факти).",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Reported Speech)",
        },
    ],
};

/* ============================
   QUESTION TAGS
============================ */
export const RULE_PAGE_QUESTION_TAGS = {
    id: "QUESTION_TAGS",
    title: "Question tags",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке question tags",
            html:
                "<strong>Question tags</strong> — це короткі запитання в кінці речення, " +
                "які використовуються для <em>підтвердження, уточнення або перевірки інформації</em>.",
        },
        {
            type: "usage",
            title: "Основне правило",
            badges: [
                "➕ Ствердження → ❓ негативний tag: <strong>You’re tired, aren’t you?</strong>",
                "➖ Заперечення → ❓ позитивний tag: <strong>You aren’t tired, are you?</strong>",
                "🧩 Допоміжне дієслово в tag залежить від часу та форми речення",
            ],
            hint:
                "Tag = <em>допоміжне дієслово + займенник</em>.",
        },
        {
            type: "forms",
            title: "Типові моделі",
            headers: ["Речення", "Question tag", "Приклад"],
            rows: [
                [
                    "Present Simple",
                    "do / does",
                    "You like coffee, don’t you?",
                ],
                [
                    "Past Simple",
                    "did",
                    "She finished early, didn’t she?",
                ],
                [
                    "To be",
                    "am / is / are / was / were",
                    "He’s a doctor, isn’t he?",
                ],
                [
                    "Modal verbs",
                    "will / can / should тощо",
                    "You can drive, can’t you?",
                ],
            ],
            hint:
                "Якщо в реченні вже є допоміжне або модальне дієслово — " +
                "воно ж використовується і в tag.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He’s a doctor, isn’t he?", "Він лікар, чи не так?"],
                ["They aren’t ready, are they?", "Вони не готові, так?"],
                ["You finished the report, didn’t you?", "Ти закінчив звіт, так?"],
                ["She can swim, can’t she?", "Вона вміє плавати, правда?"],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Неправильне допоміжне дієслово → <em>You like it, isn’t you?</em> → ✅ <strong>don’t you</strong>",
                "❌ Неправильний займенник → <em>Anna is here, isn’t Anna?</em> → ✅ <strong>isn’t she</strong>",
                "❌ Забувають інверсію позитив/негатив у tag",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Question tags)",
        },
    ],
};

/* ============================
   TOO / ENOUGH / SO / SUCH
============================ */
export const RULE_PAGE_ENOUGH_TOO_MUCH_MANY_SO_SUCH = {
    id: "ENOUGH_TOO_MUCH_MANY_SO_SUCH",
    title: "Too / enough / so / such",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають ці слова",
            html:
                "<strong>Too</strong> означає <em>надмір</em> (більше, ніж потрібно, часто з негативним результатом).<br/>" +
                "<strong>Enough</strong> означає <em>достатню кількість або ступінь</em>.<br/>" +
                "<strong>So / such</strong> використовуються для <em>підсилення</em> значення («дуже / такий»).",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "⚠️ Надмір → <strong>too + adjective / adverb</strong>: <strong>too expensive</strong>",
                "✅ Достатність → <strong>adjective + enough</strong>: <strong>old enough</strong>",
                "📏 Кількість → <strong>too much / too many</strong>",
                "🔥 Підсилення → <strong>so + adjective</strong>, <strong>such + (adjective) + noun</strong>",
            ],
            hint:
                "Якщо значення = «проблема / занадто» → <strong>too</strong>. " +
                "Якщо «достатньо» → <strong>enough</strong>. " +
                "Якщо «наскільки сильно» → <strong>so / such</strong>.",
        },
        {
            type: "forms",
            title: "Типові структури",
            headers: ["Конструкція", "Приклад", "Пояснення"],
            rows: [
                [
                    "too + adj / adv",
                    "It’s too late.",
                    "Надто пізно (проблема).",
                ],
                [
                    "adj / adv + enough",
                    "He isn’t tall enough.",
                    "Недостатній ступінь.",
                ],
                [
                    "too much / too many",
                    "Too much work / too many people.",
                    "Much — з незлічуваними, many — зі злічуваними.",
                ],
                [
                    "so + adjective",
                    "She is so tired.",
                    "Підсилення прикметника.",
                ],
                [
                    "such + (adj) + noun",
                    "It’s such a good idea.",
                    "Підсилення іменника.",
                ],
            ],
            hint:
                "<strong>Enough</strong> стоїть <em>після</em> прикметника, " +
                "а <strong>too / so</strong> — <em>перед</em> ним.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It’s too cold to swim.", "Надто холодно, щоб плавати."],
                ["She doesn’t have enough time.", "У неї недостатньо часу."],
                ["There are too many people here.", "Тут занадто багато людей."],
                ["The movie was so interesting.", "Фільм був дуже цікавий."],
                ["He is such a kind person.", "Він така добра людина."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>enough big</em> → ✅ <strong>big enough</strong>",
                "❌ <em>too many money</em> → ✅ <strong>too much money</strong>",
                "❌ <em>so a good idea</em> → ✅ <strong>such a good idea</strong>",
                "❌ Плутанина значень: <em>too</em> (негатив) ≠ <em>very</em> (нейтральне підсилення)",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Too / enough / so / such)",
        },
    ],
};


/* ============================
   RELATIVE CLAUSES
============================ */
export const RULE_PAGE_RELATIVE_CLAUSES = {
    id: "RELATIVE_CLAUSES",
    title: "Relative clauses (who, which, that)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке relative clauses",
            html:
                "<strong>Relative clauses</strong> — це підрядні речення, які <em>описують або уточнюють</em> " +
                "людей, речі чи місця. Вони відповідають на питання <em>який? яка? яке?</em>",
        },
        {
            type: "usage",
            title: "Коли і як вживаємо",
            badges: [
                "👤 <strong>who</strong> — для людей: <strong>The woman who lives next door.</strong>",
                "📦 <strong>which</strong> — для речей і тварин: <strong>The book which I bought.</strong>",
                "🔗 <strong>that</strong> — універсальне (people + things): <strong>The movie that we watched.</strong>",
                "✂️ <strong>that / who / which</strong> можна пропустити, якщо це не підмет",
            ],
            hint:
                "Relative clause зазвичай стоїть <em>одразу після слова</em>, яке вона описує.",
        },
        {
            type: "forms",
            title: "Базова структура",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "Для людей",
                    "noun + who / that + verb",
                    "She is the teacher who helped me.",
                ],
                [
                    "Для речей",
                    "noun + which / that + verb",
                    "This is the phone that I lost.",
                ],
                [
                    "Можна пропустити",
                    "noun + (that / who / which) + subject + verb",
                    "The book I’m reading is interesting.",
                ],
            ],
            hint:
                "Якщо <strong>who / which / that</strong> є <em>підметом</em> підрядного речення — " +
                "його <strong>не можна</strong> пропускати.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["This is the man who helped us.", "Це чоловік, який нам допоміг."],
                ["I like the book that you gave me.", "Мені подобається книга, яку ти дав."],
                ["She’s the person who knows the answer.", "Вона та людина, яка знає відповідь."],
                ["The house we bought is old.", "Будинок, який ми купили, старий."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Пропускають <em>who / which</em>, коли це підмет → <em>The man helped us</em>",
                "❌ <em>which</em> для людей → ✅ <strong>who</strong>",
                "❌ Relative clause далеко від іменника → незрозуміло, що саме описується",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Relative Clauses)",
        },
    ],
};


/* ============================
   REFLEXIVE PRONOUNS
============================ */
export const RULE_PAGE_REFLEXIVE_PRONOUNS = {
    id: "REFLEXIVE_PRONOUNS",
    title: "Reflexive pronouns (myself, yourself)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають reflexive pronouns",
            html:
                "<strong>Reflexive pronouns</strong> використовуються, коли <em>дія повертається на того самого виконавця</em>. " +
                "Тобто суб’єкт і об’єкт дії — одна й та сама особа.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🔁 Дія спрямована на себе: <strong>He hurt himself.</strong>",
                "😊 Дія для власного задоволення: <strong>We enjoyed ourselves.</strong>",
                "🧍‍♂️ Після деяких дієслів (hurt, blame, introduce, enjoy)",
                "⚠️ Для підсилення («сам»): <strong>I did it myself.</strong>",
            ],
            hint:
                "Reflexive pronoun зазвичай стоїть <em>після дієслова</em> або <em>після об’єкта</em>.",
        },
        {
            type: "forms",
            title: "Форми займенників",
            headers: ["Особа", "Займенник", "Приклад"],
            rows: [
                ["I", "myself", "I taught myself English."],
                ["you (singular)", "yourself", "Take care of yourself."],
                ["he / she / it", "himself / herself / itself", "She hurt herself."],
                ["we", "ourselves", "We prepared ourselves."],
                ["you (plural)", "yourselves", "Help yourselves."],
                ["they", "themselves", "They introduced themselves."],
            ],
            hint:
                "<strong>-self</strong> — однина, <strong>-selves</strong> — множина.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Be careful! Don’t cut yourself.", "Обережно! Не поріж себе."],
                ["They introduced themselves.", "Вони представилися."],
                ["I don’t want to blame myself.", "Я не хочу звинувачувати себе."],
                ["She made the cake herself.", "Вона сама зробила торт."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Відсутній reflexive pronoun → <em>He hurt.</em> → ✅ <strong>He hurt himself.</strong>",
                "❌ Зайвий reflexive pronoun → <em>I washed myself my hands.</em> → ✅ <strong>I washed my hands.</strong>",
                "❌ Плутанина з особовими займенниками → <em>She blamed her.</em> (не себе)",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Reflexive Pronouns)",
        },
    ],
};

/* ============================
   ADVERBS OF MANNER
============================ */
export const RULE_PAGE_ADVERBS_OF_MANNER = {
    id: "ADVERBS_OF_MANNER",
    title: "Adverbs of manner",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке adverbs of manner",
            html:
                "<strong>Adverbs of manner</strong> показують, <em>як саме</em> виконується дія. " +
                "Вони відповідають на питання <em>«як?»</em>.",
        },
        {
            type: "usage",
            title: "Коли й як вживаємо",
            badges: [
                "🧩 Найчастіше утворюємо від прикметників: <strong>quick → quickly</strong>",
                "⚠️ Деякі слова не змінюються: <strong>fast, hard, late, early</strong>",
                "📍 Зазвичай стоять <em>після дієслова</em> або <em>після обʼєкта</em>",
            ],
            hint:
                "Adverb of manner описує <em>дію</em>, а не іменник.",
        },
        {
            type: "forms",
            title: "Утворення",
            headers: ["Тип", "Правило", "Приклад"],
            rows: [
                [
                    "Regular",
                    "adjective + -ly",
                    "slow → slowly",
                ],
                [
                    "Ending in -y",
                    "y → i + -ly",
                    "easy → easily",
                ],
                [
                    "Irregular / same form",
                    "без -ly",
                    "fast / hard / late",
                ],
            ],
            hint:
                "Не всі слова з <strong>-ly</strong> — прислівники способу " +
                "(friendly, lovely — це прикметники).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She sings beautifully.", "Вона красиво співає."],
                ["He works hard.", "Він багато / наполегливо працює."],
                ["They spoke quietly.", "Вони говорили тихо."],
                ["The driver was driving fast.", "Водій їхав швидко."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>She sings beautiful.</em> → ✅ <strong>beautifully</strong>",
                "❌ <em>He works hardly.</em> → ✅ <strong>hard</strong> (hardly = «ледве»)",
                "❌ <em>He runs fastly.</em> → ✅ <strong>fast</strong>",
                "❌ Використання прикметника замість прислівника після дієслова",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Adverbs of manner)",
        },
    ],
};

/* ============================
   IN ORDER TO / SO THAT
============================ */
export const RULE_PAGE_IN_ORDER_TO_SO_THAT = {
    id: "IN_ORDER_TO_SO_THAT",
    title: "In order to / so that",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають ці конструкції",
            html:
                "<strong>In order to + V</strong> використовується, щоб показати <em>мету дії</em> без окремого підмета.<br/>" +
                "<strong>So that + clause</strong> використовується, коли потрібне <em>повне речення з підметом</em>.",
        },
        {
            type: "usage",
            title: "Коли що вживати",
            badges: [
                "🎯 Мета без підмета → <strong>(in order) to + V</strong>: <strong>I work to earn money.</strong>",
                "👥 Мета з підметом → <strong>so that + subject + verb</strong>: <strong>I left early so that I wouldn’t be late.</strong>",
                "🗣️ <strong>To</strong> — нейтрально; <strong>in order to</strong> — формальніше",
            ],
            hint:
                "Якщо після «щоб» в українській <em>є підмет</em> → використовуй <strong>so that</strong>.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Конструкція", "Структура", "Приклад"],
            rows: [
                [
                    "to / in order to",
                    "to + V / in order to + V",
                    "She studies hard to pass the exam.",
                ],
                [
                    "so that",
                    "so that + subject + verb",
                    "He spoke loudly so that everyone could hear.",
                ],
            ],
            hint:
                "Після <strong>to / in order to</strong> не ставимо підмет.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She studies hard to pass the exam.", "Вона вчиться, щоб скласти іспит."],
                ["She studies hard in order to pass the exam.", "Вона вчиться, щоб скласти іспит."],
                ["He spoke loudly so that everyone could hear.", "Він говорив голосно, щоб усі чули."],
                ["I’m whispering so that the baby doesn’t wake up.", "Я шепочу, щоб дитина не прокинулась."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I work in order to I earn money.</em> → ✅ <strong>I work in order to earn money.</strong>",
                "❌ <em>I left early to I wouldn’t be late.</em> → ✅ <strong>I left early so that I wouldn’t be late.</strong>",
                "❌ Плутанина формальності: <em>in order to</em> у простій розмові — зайве",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (In order to / So that)",
        },
    ],
};

/* ============================
   MODALS OF PROBABILITY (must, might, can't)
============================ */
export const RULE_PAGE_MODALS_OF_PROBABILITY = {
    id: "MODALS_OF_PROBABILITY",
    title: "Modal verbs of probability",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають модальні дієслова ймовірності",
            html:
                "<strong>Modals of probability</strong> використовуються, щоб висловити <em>ступінь впевненості</em> " +
                "у припущенні.<br/>" +
                "<strong>must</strong> — майже впевнені (логічний висновок).<br/>" +
                "<strong>might / may / could</strong> — можливо (є шанс).<br/>" +
                "<strong>can’t</strong> — неможливо (логічно виключено).",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🔍 Логічний висновок → <strong>He must be tired.</strong>",
                "🤔 Невпевнене припущення → <strong>She might be at work.</strong>",
                "🚫 Неможливість → <strong>He can’t be serious.</strong>",
                "🕒 Для теперішнього та минулого (з have + V3)",
            ],
            hint:
                "Це <em>припущення</em>, а не факт. Ми оцінюємо ситуацію за наявними доказами.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Значення", "Структура", "Приклад"],
            rows: [
                [
                    "Висока ймовірність",
                    "must + V / must + be",
                    "She must be at home.",
                ],
                [
                    "Можливість",
                    "might / may / could + V",
                    "They might arrive late.",
                ],
                [
                    "Неможливо",
                    "can’t + V / can’t + be",
                    "It can’t be true.",
                ],
                [
                    "Про минуле",
                    "modal + have + V3",
                    "He must have forgotten.",
                ],
            ],
            hint:
                "Для минулих припущень завжди використовуємо <strong>have + V3</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It must be cold outside.", "Напевно надворі холодно."],
                ["She might be at work.", "Вона, можливо, на роботі."],
                ["They could be wrong.", "Вони можуть помилятися."],
                ["He can’t be serious.", "Це не може бути серйозно."],
                ["She must have left already.", "Вона, напевно, вже пішла."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>mustn’t</em> як припущення → ❌ ні (це заборона) → ✅ <strong>can’t</strong> для «неможливо»",
                "❌ <em>He must to be tired</em> → ✅ <strong>He must be tired</strong>",
                "❌ Пропускають <em>have</em> у минулому → <em>must forgot</em> → ✅ <strong>must have forgotten</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Modals of Probability)",
        },
    ],
};

/* ============================
   BE SUPPOSED TO
============================ */
export const RULE_PAGE_BE_SUPPOSED_TO = {
    id: "BE_SUPPOSED_TO",
    title: "Be supposed to",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає be supposed to",
            html:
                "<strong>Be supposed to</strong> використовується, щоб говорити про <em>очікування, правило або домовленість</em>, " +
                "а не про особисту волю мовця. Часто має відтінок «так було заплановано».",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "📅 Розклад / план: <strong>I’m supposed to start at 9.</strong>",
                "📜 Правило / інструкція: <strong>You’re supposed to wear a helmet.</strong>",
                "⚠️ Порушене очікування: <strong>He wasn’t supposed to be here.</strong>",
            ],
            hint:
                "<strong>Be supposed to</strong> ≠ <strong>must</strong>: " +
                "тут немає тиску чи наказу, лише очікування.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Час", "Структура", "Приклад"],
            rows: [
                [
                    "Present",
                    "am / is / are supposed to + V",
                    "I am supposed to finish today.",
                ],
                [
                    "Past",
                    "was / were supposed to + V",
                    "We were supposed to meet at 6.",
                ],
                [
                    "Negative",
                    "be not supposed to + V",
                    "You aren’t supposed to park here.",
                ],
            ],
            hint:
                "Після <strong>to</strong> завжди базова форма дієслова (V1).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["You’re supposed to clean your room.", "Ти повинен прибрати кімнату."],
                ["We weren’t supposed to leave early.", "Ми не мали йти рано."],
                ["She’s supposed to call me later.", "Вона має подзвонити пізніше."],
                ["I was supposed to be there by noon.", "Я мав бути там до обіду."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I suppose to go now.</em> → ✅ <strong>I’m supposed to go now.</strong>",
                "❌ <em>You are supposed for do this.</em> → ✅ <strong>You’re supposed to do this.</strong>",
                "❌ Плутанина з <em>must / have to</em> → <em>be supposed to</em> = очікування, не наказ",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Be supposed to)",
        },
    ],
};

/* ============================
   LET / MAKE / ALLOW
============================ */
export const RULE_PAGE_LET_MAKE_ALLOW = {
    id: "LET_MAKE_ALLOW",
    title: "Let / make / allow",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Різниця між let / make / allow",
            html:
                "<strong>Let</strong> означає <em>дозволяти</em> (неформально, без примусу).<br/>" +
                "<strong>Make</strong> означає <em>змушувати</em> (примус, тиск).<br/>" +
                "<strong>Allow</strong> означає <em>дозволяти</em> (більш формально, правила).",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Дієслово", "Структура", "Приклад"],
            rows: [
                [
                    "let",
                    "let + object + V1",
                    "My parents let me stay out late.",
                ],
                [
                    "make",
                    "make + object + V1",
                    "The teacher made us repeat it.",
                ],
                [
                    "allow",
                    "allow + object + to + V1",
                    "They allowed him to leave early.",
                ],
                [
                    "allow (passive)",
                    "be allowed to + V1",
                    "Smoking is not allowed here.",
                ],
            ],
            hint:
                "Після <strong>let / make</strong> <em>ніколи</em> не ставимо <strong>to</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["My parents let me stay out late.", "Батьки дозволяли мені гуляти довше."],
                ["The teacher made us repeat it.", "Вчитель змусив нас повторити."],
                ["They allowed her to work from home.", "Вони дозволили їй працювати з дому."],
                ["Smoking isn’t allowed here.", "Тут не дозволено палити."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>They allowed me go.</em> → ✅ <strong>allowed me to go</strong>",
                "❌ <em>He made me to do it.</em> → ✅ <strong>made me do it</strong>",
                "❌ <em>Let to go.</em> → ✅ <strong>Let me go.</strong>",
                "❌ <em>allowed to me</em> → ✅ <strong>allowed me</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Let / Make / Allow)",
        },
    ],
};

/* ============================
   REPORTED QUESTIONS
============================ */
export const RULE_PAGE_REPORTED_QUESTIONS = {
    id: "REPORTED_QUESTIONS",
    title: "Reported questions",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке reported questions",
            html:
                "<strong>Reported questions</strong> — це <em>запитання в непрямій мові</em>. " +
                "Ми передаємо питання як частину речення, <em>без питального порядку слів</em> " +
                "і <em>без do / does / did</em>.",
        },
        {
            type: "usage",
            title: "Основні правила",
            badges: [
                "❓ Wh-питання → <strong>asked + wh-word</strong>: <strong>He asked where I lived.</strong>",
                "❓ Yes/No → <strong>asked if / whether</strong>: <strong>She asked if I liked it.</strong>",
                "⏪ Часто відбувається зсув часу (backshift)",
                "🔀 Порядок слів як у ствердженні",
            ],
            hint:
                "У reported questions <em>немає інверсії</em>: " +
                "<strong>where he was</strong>, а не <em>where was he</em>.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Тип питання", "Структура", "Приклад"],
            rows: [
                [
                    "Wh-question",
                    "asked + wh-word + subject + verb",
                    "He asked where she lived.",
                ],
                [
                    "Yes / No",
                    "asked + if / whether + subject + verb",
                    "She asked if I could help.",
                ],
                [
                    "З backshift",
                    "present → past",
                    "Where is he? → He asked where he was.",
                ],
            ],
            hint:
                "<strong>If</strong> і <strong>whether</strong> означають «чи». " +
                "У більшості випадків вони взаємозамінні.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He asked where I lived.", "Він запитав, де я живу."],
                ["She asked if I could help.", "Вона запитала, чи можу я допомогти."],
                ["They asked what time it was.", "Вони запитали, котра година."],
                ["I asked whether she had finished.", "Я запитав, чи вона закінчила."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He asked where did I live.</em> → ✅ <strong>where I lived</strong>",
                "❌ <em>She asked do I like it.</em> → ✅ <strong>if I liked it</strong>",
                "❌ Залишають питальний порядок слів → ❌",
                "❌ Забувають про backshift, коли він потрібен",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Reported Questions)",
        },
    ],
};

/* ============================
   CAUSATIVE HAVE/GET
============================ */
export const RULE_PAGE_CAUSATIVE_HAVE_GET = {
    id: "CAUSATIVE_HAVE_GET",
    title: "Causative have / get",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає causative",
            html:
                "<strong>Causative have / get</strong> використовується, коли <em>ми організовуємо або домовляємося</em>, " +
                "щоб <em>хтось інший</em> зробив щось для нас. Ми <em>не виконуємо дію самі</em>.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "✂️ Послуги / сервіс: <strong>I had my hair cut.</strong>",
                "🔧 Ремонт / технічні роботи: <strong>We got the car repaired.</strong>",
                "🗣️ <strong>have</strong> — нейтрально; <strong>get</strong> — більш розмовно",
            ],
            hint:
                "Фокус не на виконавці, а на <em>результаті</em> дії.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Конструкція", "Структура", "Приклад"],
            rows: [
                [
                    "have (causative)",
                    "have + object + V3",
                    "I had my hair cut.",
                ],
                [
                    "get (causative)",
                    "get + object + V3",
                    "We got the car repaired.",
                ],
                [
                    "З виконавцем",
                    "have / get + object + V3 + by",
                    "I had my phone fixed by a technician.",
                ],
            ],
            hint:
                "<strong>Have / get</strong> змінюються за часами: " +
                "<em>have / had / will have; get / got / will get</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I had my hair cut.", "Мені підстригли волосся."],
                ["We got the car repaired.", "Ми відремонтували авто (для нас)."],
                ["She is getting her house painted.", "Їй фарбують будинок."],
                ["He had his laptop fixed yesterday.", "Йому полагодили ноутбук учора."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Плутанина з пасивом → <em>I had my hair cut</em> ≠ <em>My hair was cut</em> (різний фокус).",
                "❌ <em>I cut my hair</em> (інше значення: зробив сам).",
                "❌ <em>have my hair to cut</em> → ✅ <strong>have my hair cut</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Causative have / get)",
        },
    ],
};


/* ============================
   PHRASAL VERBS (common)
============================ */
export const RULE_PAGE_PHRASAL_VERBS_COMMON = {
    id: "PHRASAL_VERBS_COMMON",
    title: "Phrasal verbs (common)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке phrasal verbs",
            html:
                "<strong>Phrasal verbs</strong> — це поєднання <em>дієслова</em> з <em>часткою</em> " +
                "(up, out, off, on тощо), яке утворює <em>нове значення</em>, " +
                "часто <em>нелогічне з дослівного перекладу</em>.",
        },
        {
            type: "usage",
            title: "Як вони працюють",
            badges: [
                "🔗 Значення ≠ сума частин: <strong>give up</strong> = здатися",
                "↔️ Деякі розділяються: <strong>turn off the light / turn the light off</strong>",
                "🚫 Деякі НЕ розділяються: <strong>look after the child</strong>",
                "🧍‍♂️ Займенник завжди між: <strong>pick it up</strong>",
            ],
            hint:
                "Phrasal verbs — це <em>лексика</em>, їх потрібно вчити як окремі слова.",
        },
        {
            type: "forms",
            title: "Типи phrasal verbs",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "Нероздільні",
                    "verb + particle + object",
                    "look after the baby",
                ],
                [
                    "Роздільні",
                    "verb + object + particle / verb + particle + object",
                    "turn off the TV / turn the TV off",
                ],
                [
                    "Займенник",
                    "verb + pronoun + particle",
                    "pick it up (НЕ pick up it)",
                ],
            ],
            hint:
                "Якщо обʼєкт — <em>займенник</em> (me, it, them) — " +
                "він <strong>завжди</strong> стоїть між дієсловом і часткою.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Can you pick me up?", "Підвезеш мене?"],
                ["Turn off the light.", "Вимкни світло."],
                ["She looks after her little brother.", "Вона доглядає за молодшим братом."],
                ["He gave up smoking.", "Він кинув курити."],
                ["Please put it down.", "Будь ласка, поклади це."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Дослівний переклад → значення неправильне",
                "❌ <em>pick up it</em> → ✅ <strong>pick it up</strong>",
                "❌ Розділяють нероздільні → <em>look the child after</em> → ❌",
                "❌ Вважають phrasal verb «тимчасовим» → його треба вчити як одне слово",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Phrasal Verbs)",
        },
    ],
};


/* ============================
   EACH OTHER / ONE ANOTHER
============================ */
export const RULE_PAGE_EACH_OTHER_ONE_ANOTHER = {
    id: "EACH_OTHER_ONE_ANOTHER",
    title: "Each other / one another",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають each other / one another",
            html:
                "<strong>Each other</strong> і <strong>one another</strong> використовуються, " +
                "щоб показати <em>взаємну дію</em> між двома або більше людьми — «<em>один одного</em>».",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🤝 Взаємна дія → <strong>They help each other.</strong>",
                "👥 Традиційно: <strong>each other</strong> — для двох, <strong>one another</strong> — для багатьох",
                "🗣️ У сучасній англійській часто взаємозамінні",
            ],
            hint:
                "Якщо дія <em>не повертається на ту саму особу</em>, а відбувається між людьми — " +
                "це <strong>each other / one another</strong>.",
        },
        {
            type: "forms",
            title: "Форма в реченні",
            headers: ["Конструкція", "Приклад", "Пояснення"],
            rows: [
                [
                    "verb + each other",
                    "They respect each other.",
                    "Взаємна дія між двома.",
                ],
                [
                    "verb + one another",
                    "The team members trust one another.",
                    "Взаємна дія між кількома.",
                ],
                [
                    "з прийменником",
                    "They talked to each other.",
                    "Прийменник залишається перед фразою.",
                ],
            ],
            hint:
                "<strong>Each other / one another</strong> — це <em>обʼєкт</em> у реченні.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["We help each other.", "Ми допомагаємо один одному."],
                ["The students listened to one another.", "Учні слухали одне одного."],
                ["They looked at each other and smiled.", "Вони подивилися один на одного й усміхнулися."],
                ["The two friends support each other.", "Двоє друзів підтримують один одного."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Плутанина з reflexive pronouns → <em>They helped themselves</em> ≠ <strong>each other</strong>",
                "❌ <em>each others</em> → ❌ (без множини)",
                "❌ Пропуск прийменника → <em>They talked each other</em> → ✅ <strong>talked to each other</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Each other / one another)",
        },
    ],
};

/* ============================
   SO DO I / NEITHER DO I
============================ */
export const RULE_PAGE_SO_DO_I_NEITHER_DO_I = {
    id: "SO_DO_I_NEITHER_DO_I",
    title: "So do I / Neither do I",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають ці конструкції",
            html:
                "<strong>So do I</strong> означає <em>«я теж»</em> після <em>позитивного</em> твердження.<br/>" +
                "<strong>Neither do I</strong> означає <em>«я теж ні»</em> після <em>негативного</em> твердження.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "➕ Позитив → <strong>So + auxiliary + subject</strong>: <strong>I like coffee. — So do I.</strong>",
                "➖ Негатив → <strong>Neither + auxiliary + subject</strong>: <strong>I don’t like tea. — Neither do I.</strong>",
                "🔁 Допоміжне дієслово залежить від часу та форми",
            ],
            hint:
                "Це інверсія: <em>auxiliary + subject</em> (do/am/can/have тощо).",
        },
        {
            type: "forms",
            title: "Типові моделі",
            headers: ["Тип речення", "Модель відповіді", "Приклад"],
            rows: [
                [
                    "Present Simple",
                    "So do I / Neither do I",
                    "I work here. — So do I.",
                ],
                [
                    "To be",
                    "So am I / Neither am I",
                    "I’m tired. — So am I.",
                ],
                [
                    "Past Simple",
                    "So did I / Neither did I",
                    "I finished early. — So did I.",
                ],
                [
                    "Modal verbs",
                    "So can I / Neither can I",
                    "I can drive. — So can I.",
                ],
            ],
            hint:
                "Використовуй <em>те саме допоміжне дієслово</em>, що й у першому реченні.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’m tired. — So am I.", "Я втомлений — я теж."],
                ["I’m not ready. — Neither am I.", "Я не готовий — я теж ні."],
                ["I don’t like fish. — Neither do I.", "Я не люблю рибу — я теж ні."],
                ["She can swim. — So can I.", "Вона вміє плавати — я теж."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>So I do.</em> → ✅ <strong>So do I.</strong> (потрібна інверсія)",
                "❌ <em>Neither I do.</em> → ✅ <strong>Neither do I.</strong>",
                "❌ Неправильний auxiliary → <em>I’m tired. — So do I.</em> → ✅ <strong>So am I.</strong>",
                "⚠️ <em>Me too / Me neither</em> — розмовно; <em>So do I / Neither do I</em> — нейтрально/формальніше",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (So do I / Neither do I)",
        },
    ],
};

/* ============================
   NOT ONLY … BUT ALSO
============================ */
export const RULE_PAGE_NOT_ONLY_BUT_ALSO = {
    id: "NOT_ONLY_BUT_ALSO",
    title: "Not only … but also",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає not only … but also",
            html: "Конструкція для підсилення: <strong>не тільки … але й …</strong>."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>Not only</strong> + частина 1, <strong>but also</strong> + частина 2",
                "У формальному стилі після <strong>Not only</strong> часто → інверсія"
            ],
            hint: "Слідкуй за паралельною структурою: однакові частини мови після обох частин."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Not only is she smart, but she’s also very kind.", "Вона не тільки розумна, але й дуже добра."],
                ["He not only plays the guitar but also writes songs.", "Він не тільки грає на гітарі, а й пише пісні."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Різні граматичні структури після not only / but also.",
                "❌ Відсутність інверсії в дуже формальному письмі після початкового <em>Not only</em>."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Not only … but also)" }
    ]
};


/* ============================
   CLEFT SENTENCES
============================ */
export const RULE_PAGE_CLEFT_SENTENCES = {
    id: "CLEFT_SENTENCES",
    title: "Cleft sentences (It is / What … is …)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке cleft sentences",
            html:
                "<strong>Cleft sentences</strong> — це спеціальні конструкції, які використовуються, " +
                "щоб <em>виділити або підкреслити</em> певну частину речення (особу, час, місце, причину тощо).<br/>" +
                "Найпоширеніші типи: <strong>It is/was … that/who …</strong> та <strong>What … is …</strong>.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🎯 Фокус на конкретній частині → <strong>It was John who called.</strong>",
                "🧩 Фокус на ідеї / дії → <strong>What I need is a break.</strong>",
                "✍️ Письмова та нейтральна розмовна мова (для наголосу без інтонації)",
            ],
            hint:
                "Cleft sentences відповідають на приховане питання: <em>хто саме? коли саме? що саме?</em>",
        },
        {
            type: "forms",
            title: "Основні типи",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "It-cleft",
                    "It + is/was + focus + that/who + clause",
                    "It was John who called.",
                ],
                [
                    "It-cleft (time/place)",
                    "It + is/was + time/place + that + clause",
                    "It was yesterday that we met.",
                ],
                [
                    "What-cleft",
                    "What + clause + is/was + focus",
                    "What I need is a break.",
                ],
            ],
            hint:
                "<strong>Who</strong> використовується для людей, <strong>that</strong> — універсальне. " +
                "Час у cleft-реченні залежить від основної події.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It was yesterday that we met.", "Саме вчора ми зустрілися."],
                ["It’s her voice that I remember.", "Саме її голос я пам’ятаю."],
                ["What I like most is your honesty.", "Найбільше мені подобається твоя чесність."],
                ["What surprised me was his reaction.", "Мене здивувала саме його реакція."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Неправильний час → <em>It is yesterday that we met</em> → ✅ <strong>It was yesterday that we met</strong>",
                "❌ Зайвий cleft без потреби → текст звучить перевантажено",
                "❌ Плутанина з простим порядком слів → cleft потрібен лише для наголосу",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Cleft sentences)",
        },
    ],
};

/* ============================
   MIXED CONDITIONALS
============================ */
export const RULE_PAGE_MIXED_CONDITIONALS = {
    id: "MIXED_CONDITIONALS",
    title: "Mixed conditionals",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке mixed conditionals",
            html:
                "<strong>Mixed conditionals</strong> — це умовні речення, у яких " +
                "<em>час в умові (if-clause)</em> і <em>час у результаті</em> різні. " +
                "Вони поєднують логіку <strong>2nd</strong> і <strong>3rd conditional</strong>.",
        },
        {
            type: "usage",
            title: "Основні типи",
            badges: [
                "⏳ Минуле → теперішнє (причина в минулому, результат зараз): " +
                "<strong>If I had studied, I would speak better now.</strong>",
                "⏳ Теперішнє → минуле (постійна риса, наслідок у минулому): " +
                "<strong>If I were taller, I would have become a pilot.</strong>",
            ],
            hint:
                "Подумай: <em>коли сталася причина?</em> і <em>коли бачимо результат?</em>",
        },
        {
            type: "forms",
            title: "Структури",
            headers: ["Тип", "If-clause", "Main clause"],
            rows: [
                [
                    "Past → Present",
                    "if + Past Perfect",
                    "would + V (now / today)",
                ],
                [
                    "Present → Past",
                    "if + Past Simple / were",
                    "would have + V3",
                ],
            ],
            hint:
                "<strong>Now / today / at the moment</strong> часто сигналізують " +
                "результат у теперішньому.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                [
                    "If she had left earlier, she wouldn’t be late now.",
                    "Якби вона пішла раніше, зараз не запізнилася б.",
                ],
                [
                    "If I were more careful, I wouldn’t have made that mistake.",
                    "Якби я був уважнішим, не зробив би тієї помилки.",
                ],
                [
                    "If he hadn’t missed the bus, he would be here now.",
                    "Якби він не пропустив автобус, він був би тут зараз.",
                ],
                [
                    "If we were more organized, we would have finished on time.",
                    "Якби ми були більш організовані, ми б закінчили вчасно.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Однакові часи в обох частинах → ❌ не mixed conditional",
                "❌ <em>If I had studied, I would have a job now.</em> → ✅ <strong>would have had</strong> / або перебудувати речення",
                "❌ Забувають, що <em>were</em> використовується для всіх осіб у нереальних умовах",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Mixed conditionals)",
        },
    ],
};

/* ============================
   THIRD CONDITIONAL VARIATIONS
============================ */
export const RULE_PAGE_THIRD_CONDITIONAL_VARIATIONS = {
    id: "THIRD_CONDITIONAL_VARIATIONS",
    title: "3rd Conditional variations",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це за варіації",
            html: "Різні форми 3-го кондишеналу: скорочення, модальні дієслова, зміна порядку частин."
        },
        {
            type: "usage",
            title: "Приклади варіацій",
            badges: [
                "<strong>If you’d told me, I would’ve helped.</strong>",
                "<strong>If he had tried, he might have succeeded.</strong>",
                "<strong>Had I known, I would have left earlier.</strong> (без if)"
            ],
            hint: "Форма з <strong>Had I known…</strong> = інверсія замість if."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Had we left on time, we wouldn’t have missed the train.", "Якби ми вийшли вчасно, не запізнилися б на потяг."],
                ["If she had asked, I could have explained everything.", "Якби вона запитала, я міг би все пояснити."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Неправильні скорочення: <em>would of</em> замість <strong>would have</strong>.",
                "❌ Неправильний порядок слів після інверсії з <em>Had</em>."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (3rd Conditional variations)" }
    ]
};


/* ============================
   ADVANCED PASSIVES WITH REPORTING VERBS
============================ */
export const RULE_PAGE_ADV_PASSIVES_REPORTING_VERBS = {
    id: "ADV_PASSIVES_REPORTING_VERBS",
    title: "Advanced passives (with reporting verbs)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це за конструкції",
            html:
                "<strong>Advanced passives with reporting verbs</strong> — це пасивні структури з дієсловами " +
                "<em>say, think, believe, report, expect, know, consider</em>, " +
                "які використовують, коли <em>важлива інформація</em>, а не джерело.",
        },
        {
            type: "usage",
            title: "Два основні типи",
            badges: [
                "📰 Загальна думка / чутки → <strong>It is said that…</strong>",
                "👤 Фокус на людині → <strong>He is said to…</strong>",
                "✍️ Формальний стиль (новини, звіти, академічні тексти)",
            ],
            hint:
                "Обидві конструкції передають <em>непряму інформацію</em> без називання автора.",
        },
        {
            type: "forms",
            title: "Типові структури",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "It-passive",
                    "It + be + V3 + that + clause",
                    "It is believed that the crisis is over.",
                ],
                [
                    "Person-passive (present)",
                    "subject + be + V3 + to + V",
                    "He is said to be very rich.",
                ],
                [
                    "Person-passive (past)",
                    "subject + be + V3 + to have + V3",
                    "She is thought to have left early.",
                ],
            ],
            hint:
                "Для теперішнього значення — <strong>to + V</strong>, " +
                "для минулого — <strong>to have + V3</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It is believed that the crisis is over.", "Вважається, що криза закінчилася."],
                ["The minister is expected to resign.", "Очікується, що міністр піде у відставку."],
                ["She is reported to have won the election.", "Повідомляють, що вона виграла вибори."],
                ["The company is said to be expanding.", "Кажуть, що компанія розширюється."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He is said that he is rich.</em> → ❌ (потрібна інфінітивна форма)",
                "❌ <em>He is said to is rich.</em> → ✅ <strong>to be rich</strong>",
                "❌ Неправильний час → <em>is said to leave yesterday</em> → ✅ <strong>to have left</strong>",
                "❌ Надмірне використання в розмовній мові — звучить неприродно",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Advanced passives with reporting verbs)",
        },
    ],
};


/* ============================
   PARTICIPLE CLAUSES
============================ */
export const RULE_PAGE_PARTICIPLE_CLAUSES = {
    id: "PARTICIPLE_CLAUSES",
    title: "Participle clauses",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке participle clauses",
            html:
                "<strong>Participle clauses</strong> — це <em>скорочені підрядні речення</em>, " +
                "які використовують форму <strong>V-ing</strong> або <strong>V3</strong>, " +
                "щоб додати інформацію про <em>час, причину, умову або результат</em>.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "⏱️ Час / причина → <strong>Feeling tired, he went to bed.</strong>",
                "📄 Пасивне значення → <strong>Built in 1990, the house looks old.</strong>",
                "✂️ Скорочення підрядних речень (when / because / if)",
            ],
            hint:
                "Підмет participle clause має бути <em>тим самим</em>, що й підмет головного речення.",
        },
        {
            type: "forms",
            title: "Основні типи",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "Active",
                    "V-ing, + main clause",
                    "Walking down the street, she met an old friend.",
                ],
                [
                    "Passive",
                    "V3, + main clause",
                    "Seen from above, the city looks tiny.",
                ],
                [
                    "Perfect",
                    "Having + V3, + main clause",
                    "Having finished the work, he went home.",
                ],
            ],
            hint:
                "<strong>Having + V3</strong> підкреслює, що одна дія <em>завершилася раніше</em> за іншу.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                [
                    "Walking down the street, she met an old friend.",
                    "Ідучи вулицею, вона зустріла старого друга.",
                ],
                [
                    "Seen from above, the city looks tiny.",
                    "Якщо дивитися згори, місто здається крихітним.",
                ],
                [
                    "Having missed the bus, he was late for work.",
                    "Пропустивши автобус, він запізнився на роботу.",
                ],
                [
                    "Not knowing what to say, she stayed silent.",
                    "Не знаючи, що сказати, вона мовчала.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Dangling participle → <em>Walking down the street, the house appeared.</em>",
                "❌ Різні підмети в частинах речення → participle clause стає нелогічним",
                "❌ Надмірне використання — краще іноді повне підрядне речення",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Participle clauses)",
        },
    ],
};

/* ============================
   REDUCED RELATIVE CLAUSES
============================ */
export const RULE_PAGE_REDUCED_RELATIVE_CLAUSES = {
    id: "REDUCED_RELATIVE_CLAUSES",
    title: "Reduced relative clauses",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке reduced relative clauses",
            html:
                "<strong>Reduced relative clauses</strong> — це <em>скорочені відносні речення</em>, " +
                "у яких ми прибираємо <em>relative pronoun</em> та <em>форму дієслова to be</em>, " +
                "залишаючи <strong>V-ing</strong> (актив) або <strong>V3</strong> (пасив).",
        },
        {
            type: "usage",
            title: "Як скорочуємо",
            badges: [
                "🟢 Актив: <strong>who / that + V</strong> → <strong>V-ing</strong>",
                "🔵 Пасив: <strong>which / that + be + V3</strong> → <strong>V3</strong>",
                "⚠️ Підмет залишається тим самим",
            ],
            hint:
                "Скорочуємо лише тоді, коли відносне речення <em>описує іменник</em>, " +
                "а не ціле речення.",
        },
        {
            type: "forms",
            title: "Типові перетворення",
            headers: ["Повна форма", "Скорочена форма", "Тип"],
            rows: [
                [
                    "People who live here",
                    "People living here",
                    "Active",
                ],
                [
                    "The cars that were produced",
                    "The cars produced",
                    "Passive",
                ],
                [
                    "The woman who is talking",
                    "The woman talking",
                    "Active (to be)",
                ],
            ],
            hint:
                "Якщо у relative clause <em>немає to be</em>, " +
                "можемо скоротити лише relative pronoun.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                [
                    "Students living in the dorm must register.",
                    "Студенти, які живуть у гуртожитку, мають зареєструватися.",
                ],
                [
                    "The book written by my friend is popular.",
                    "Книга, написана моїм другом, популярна.",
                ],
                [
                    "Anyone interested in the job should apply.",
                    "Усі, хто зацікавлений у роботі, мають подати заявку.",
                ],
                [
                    "The documents sent yesterday are missing.",
                    "Документи, надіслані вчора, зникли.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Неправильний час → <em>The people lived here</em> (інше значення)"
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Reduced relative clauses)",
        },
    ],
};

/* ============================
   COMPLEX PREPOSITIONS
============================ */
export const RULE_PAGE_COMPLEX_PREPOSITIONS = {
    id: "COMPLEX_PREPOSITIONS",
    title: "Complex prepositions (due to, thanks to, because of)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке complex prepositions",
            html:
                "<strong>Complex prepositions</strong> — це <em>стійкі прийменникові фрази</em>, " +
                "які складаються з двох або більше слів і працюють як один прийменник. " +
                "Вони пояснюють <em>причину, позицію або обставини</em>.",
        },
        {
            type: "usage",
            title: "Коли й як вживаємо",
            badges: [
                "⚠️ Причина (часто формально) → <strong>due to</strong>",
                "😊 Позитивна причина → <strong>thanks to</strong>",
                "🔹 Нейтральна причина → <strong>because of</strong>",
                "📍 Місце / позиція → <strong>in front of, next to, on top of</strong>",
                "🚫 Контраст → <strong>in spite of</strong>",
            ],
            hint:
                "Після complex prepositions завжди йде <em>іменник</em> або <em>V-ing</em>, " +
                "а не повне речення.",
        },
        {
            type: "forms",
            title: "Типові моделі",
            headers: ["Прийменник", "Значення", "Приклад"],
            rows: [
                [
                    "due to",
                    "через (часто формально)",
                    "The delay was due to bad weather.",
                ],
                [
                    "thanks to",
                    "завдяки (позитив)",
                    "Thanks to her advice, we succeeded.",
                ],
                [
                    "because of",
                    "через (нейтрально)",
                    "The flight was cancelled because of fog.",
                ],
                [
                    "in spite of",
                    "незважаючи на",
                    "In spite of the rain, we went out.",
                ],
            ],
            hint:
                "<strong>Because of</strong> ≠ <strong>because</strong>: " +
                "<em>because of</em> + noun / V-ing, <em>because</em> + clause.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The match was cancelled due to the rain.", "Матч скасували через дощ."],
                ["Thanks to your help, we finished on time.", "Завдяки твоїй допомозі ми встигли."],
                ["She stayed at home because of the flu.", "Вона залишилася вдома через грип."],
                ["In spite of the traffic, they arrived early.", "Незважаючи на затори, вони приїхали рано."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Thanks to the accident, he was late.</em> → ❌ (негативна ситуація)",
                "❌ <em>Because of he was tired</em> → ✅ <strong>because of being tired</strong>",
                "❌ <em>Due to he missed the train</em> → ❌ (потрібен іменник або V-ing)",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Complex prepositions)",
        },
    ],
};


/* ============================
   DESPITE / IN SPITE OF + -ING
============================ */
export const RULE_PAGE_DESPITE_IN_SPITE_OF_ING = {
    id: "DESPITE_IN_SPITE_OF_ING",
    title: "Despite / in spite of + -ing",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають despite / in spite of",
            html:
                "<strong>Despite</strong> і <strong>in spite of</strong> означають <em>«незважаючи на»</em> " +
                "і використовуються, щоб показати <em>контраст</em>: щось сталося всупереч обставинам.",
        },
        {
            type: "usage",
            title: "Як вживаємо",
            badges: [
                "📌 Перед іменником → <strong>despite the rain</strong>",
                "📌 Перед дієсловом → <strong>despite / in spite of + V-ing</strong>",
                "🟰 <strong>Despite</strong> і <strong>in spite of</strong> мають однакове значення",
                "✍️ <strong>Despite</strong> — трохи коротше й частіше вживається",
            ],
            hint:
                "Після <strong>despite / in spite of</strong> НЕ може стояти повне речення з підметом і присудком.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Конструкція", "Структура", "Приклад"],
            rows: [
                [
                    "despite + noun",
                    "despite + noun",
                    "Despite the rain, we went out.",
                ],
                [
                    "in spite of + noun",
                    "in spite of + noun",
                    "In spite of the rain, we went out.",
                ],
                [
                    "despite / in spite of + -ing",
                    "despite / in spite of + V-ing",
                    "Despite being tired, he worked late.",
                ],
            ],
            hint:
                "<strong>Despite</strong> ≠ <strong>despite of</strong> (❌). " +
                "<strong>In spite of</strong> — завжди з <strong>of</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                [
                    "Despite feeling ill, she went to work.",
                    "Незважаючи на те, що почувалася погано, вона пішла на роботу.",
                ],
                [
                    "In spite of losing, they were happy.",
                    "Незважаючи на поразку, вони були щасливі.",
                ],
                [
                    "Despite his age, he runs marathons.",
                    "Незважаючи на вік, він бігає марафони.",
                ],
                [
                    "In spite of the traffic, we arrived on time.",
                    "Незважаючи на затори, ми приїхали вчасно.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>despite of the rain</em> → ✅ <strong>despite the rain</strong>",
                "❌ <em>despite she was tired</em> → ✅ <strong>despite being tired</strong> / <strong>although she was tired</strong>",
                "❌ <em>in spite that</em> → ❌ (краще <strong>although</strong>)",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Despite / In spite of)",
        },
    ],
};

/* ============================
   WOULD RATHER / PREFER
============================ */
export const RULE_PAGE_WOULD_RATHER_PREFER = {
    id: "WOULD_RATHER_PREFER",
    title: "Would rather / prefer",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означають would rather / prefer",
            html:
                "<strong>Would rather</strong> і <strong>prefer</strong> використовуються, щоб говорити про <em>уподобання</em>, " +
                "але мають <em>різні структури</em> та відтінки значення.",
        },
        {
            type: "usage",
            title: "Коли й що вживати",
            badges: [
                "🎯 Конкретна ситуація → <strong>would rather</strong>",
                "🔁 Загальні вподобання → <strong>prefer</strong>",
                "👥 Бажання щодо іншої людини → <strong>would rather + subject + Past Simple</strong>",
            ],
            hint:
                "<strong>Would rather</strong> частіше про <em>зараз або конкретний вибір</em>, " +
                "<strong>prefer</strong> — про <em>загальні смаки</em>.",
        },
        {
            type: "forms",
            title: "Основні структури",
            headers: ["Конструкція", "Структура", "Приклад"],
            rows: [
                [
                    "would rather (self)",
                    "would rather + V1",
                    "I’d rather stay at home.",
                ],
                [
                    "would rather (other)",
                    "would rather + subject + Past Simple",
                    "I’d rather you didn’t smoke here.",
                ],
                [
                    "prefer (noun)",
                    "prefer + noun + to + noun",
                    "I prefer coffee to tea.",
                ],
                [
                    "prefer (verb)",
                    "prefer + V-ing",
                    "She prefers working at night.",
                ],
                [
                    "prefer (choice)",
                    "prefer + to V + rather than + V",
                    "I prefer to walk rather than drive.",
                ],
            ],
            hint:
                "Після <strong>would rather</strong> ніколи не ставимо <em>to</em>. " +
                "Після <strong>prefer</strong> можливі різні моделі.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’d rather stay at home.", "Я краще залишуся вдома."],
                ["I’d rather you didn’t smoke here.", "Я б волів, щоб ти тут не курив."],
                ["I prefer coffee to tea.", "Я більше люблю каву, ніж чай."],
                ["She prefers working from home.", "Вона віддає перевагу роботі з дому."],
                ["I prefer to read rather than watch TV.", "Я краще почитаю, ніж дивитимусь телевізор."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I’d rather you to go.</em> → ✅ <strong>I’d rather you went.</strong>",
                "❌ <em>I’d rather to stay.</em> → ✅ <strong>I’d rather stay.</strong>",
                "❌ <em>I prefer coffee than tea.</em> → ✅ <strong>prefer coffee to tea</strong>",
                "❌ Змішування структур <em>would rather</em> і <em>prefer</em>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Would rather / prefer)",
        },
    ],
};

/* ============================
   HAD BETTER
============================ */
export const RULE_PAGE_HAD_BETTER = {
    id: "HAD_BETTER",
    title: "Had better + verb",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає had better",
            html:
                "<strong>Had better</strong> використовується, щоб дати <em>сильну пораду або попередження</em>. " +
                "Ідея така: <em>якщо цього не зробити, можливі негативні наслідки</em>.",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "⚠️ Попередження → <strong>You’d better leave now.</strong>",
                "⏰ Нагальна порада → <strong>We’d better hurry.</strong>",
                "🚨 Потенційні наслідки (часто не сказані прямо)",
            ],
            hint:
                "<strong>Had better</strong> звучить сильніше, ніж <em>should</em>, " +
                "і може сприйматись як наполягання.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Тип", "Структура", "Приклад"],
            rows: [
                [
                    "Ствердження",
                    "had better + V1",
                    "You had better tell the truth.",
                ],
                [
                    "Заперечення",
                    "had better not + V1",
                    "You’d better not be late.",
                ],
                [
                    "Розмовна форма",
                    "’d better + V1",
                    "We’d better call them.",
                ],
            ],
            hint:
                "Після <strong>had better</strong> завжди базова форма дієслова (V1), <em>без to</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["You’d better not be late.", "Краще не спізнюйся."],
                ["We’d better call them.", "Нам краще їм подзвонити."],
                ["He’d better see a doctor.", "Йому краще звернутися до лікаря."],
                ["You had better back up your files.", "Тобі краще зробити резервну копію файлів."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>had better to go</em> → ✅ <strong>had better go</strong>",
                "❌ <em>had better went</em> → ✅ <strong>had better go</strong>",
                "❌ Плутанина з <em>should</em> → <strong>had better</strong> = сильніше, з наслідками",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Had better)",
        },
    ],
};

/* ============================
   ADVANCED MODALS OF DEDUCTION
============================ */
export const RULE_PAGE_ADVANCED_MODALS_OF_DEDUCTION = {
    id: "ADVANCED_MODALS_OF_DEDUCTION",
    title: "Advanced modals of deduction",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Модальні дієслова для припущень",
            html:
                "<strong>Advanced modals of deduction</strong> використовуються, щоб висловити " +
                "<em>логічні припущення</em> з різним ступенем впевненості про теперішнє або минуле.<br/>" +
                "Основні дієслова: <strong>must</strong> (майже впевнені), " +
                "<strong>may / might / could</strong> (можливо), " +
                "<strong>can’t</strong> (логічно неможливо).",
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🔍 Логічний висновок → <strong>must</strong>",
                "🤔 Можливість → <strong>may / might / could</strong>",
                "🚫 Неможливість → <strong>can’t</strong>",
                "🕒 Для минулого → <strong>modal + have + V3</strong>",
            ],
            hint:
                "Це <em>не факти</em>, а припущення на основі доказів.",
        },
        {
            type: "forms",
            title: "Форми за часами",
            headers: ["Час", "Структура", "Приклад"],
            rows: [
                [
                    "Теперішнє",
                    "modal + V / modal + be",
                    "She must be tired.",
                ],
                [
                    "Теперішнє (процес)",
                    "modal + be + V-ing",
                    "He may be sleeping.",
                ],
                [
                    "Минуле",
                    "modal + have + V3",
                    "They might have forgotten.",
                ],
                [
                    "Неможливо (минуле)",
                    "can’t + have + V3",
                    "She can’t have done it.",
                ],
            ],
            hint:
                "<strong>Mustn’t</strong> ≠ deduction. " +
                "Для «неможливо» завжди використовуємо <strong>can’t</strong>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She must be working now.", "Вона, напевно, зараз працює."],
                ["He could be at home.", "Він може бути вдома."],
                ["They might have missed the train.", "Можливо, вони пропустили потяг."],
                ["He can’t have said that.", "Він не міг цього сказати."],
                ["It must have rained last night.", "Напевно, вночі був дощ."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>mustn’t</em> як припущення → ❌ (це заборона)",
                "❌ <em>He must have to leave</em> → ❌ (змішування значень)",
                "❌ <em>He must left</em> → ✅ <strong>must have left</strong>",
                "❌ Неправильний час → для минулого завжди <strong>have + V3</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Advanced modals of deduction)",
        },
    ],
};


/* ============================
   COMPLEX NOUN PHRASES
============================ */
export const RULE_PAGE_COMPLEX_NOUN_PHRASES = {
    id: "COMPLEX_NOUN_PHRASES",
    title: "Complex noun phrases",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке complex noun phrases",
            html:
                "<strong>Complex noun phrases</strong> — це іменникові фрази, у яких <em>головний іменник</em> " +
                "уточнюється кількома елементами: <em>прикметниками, іншими іменниками, прийменниковими фразами</em> " +
                "та <em>відносними реченнями</em>.",
        },
        {
            type: "usage",
            title: "Як вони будуються",
            badges: [
                "🧩 Перед іменником → <strong>det + adj + noun</strong>",
                "🔗 Після іменника → <strong>prepositional phrase / relative clause</strong>",
                "📚 Часто вживаються в письмовій та формальній мові",
            ],
            hint:
                "В англійській більшість опису стоїть <em>перед</em> іменником, " +
                "а деталі — <em>після</em> нього.",
        },
        {
            type: "forms",
            title: "Типові структури",
            headers: ["Структура", "Пояснення", "Приклад"],
            rows: [
                [
                    "det + adj + noun + prep phrase",
                    "базовий опис + уточнення",
                    "The long, narrow road to the village",
                ],
                [
                    "noun + V3 phrase",
                    "пасивне уточнення",
                    "The decision made by the committee",
                ],
                [
                    "noun + relative clause",
                    "додаткова інформація",
                    "The book that you recommended",
                ],
            ],
            hint:
                "Коми залежать від того, чи інформація <em>обмежувальна</em> (без ком) " +
                "чи <em>додаткова</em> (з комами).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                [
                    "The long, narrow road to the village was empty.",
                    "Довга вузька дорога до села була порожньою.",
                ],
                [
                    "The decision made by the committee was unexpected.",
                    "Рішення, ухвалене комітетом, було неочікуваним.",
                ],
                [
                    "A small wooden house with a red roof stood near the river.",
                    "Невеликий дерев’яний будинок з червоним дахом стояв біля річки.",
                ],
                [
                    "The report that was published last week caused debate.",
                    "Звіт, опублікований минулого тижня, викликав дискусію.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Занадто багато прикметників без логічного порядку",
                "❌ Відсутність ком у переліку прикметників",
                "❌ Перевантажені фрази, які важко читати",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Complex noun phrases)",
        },
    ],
};

/* ============================
   INDIRECT SPEECH QUESTION FORMS
============================ */
export const RULE_PAGE_INDIRECT_SPEECH_QUESTION_FORMS = {
    id: "INDIRECT_SPEECH_QUESTION_FORMS",
    title: "Question forms in indirect speech",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Запитання в непрямій мові",
            html:
                "<strong>Indirect questions</strong> — це запитання, вбудовані в речення. " +
                "У них використовується <em>звичайний порядок слів</em> (як у ствердженні) " +
                "і <em>немає інверсії</em> або допоміжних <em>do / does / did</em>.",
        },
        {
            type: "usage",
            title: "Основні правила",
            badges: [
                "❓ Wh-запитання → <strong>wh-word + subject + verb</strong>",
                "❓ Yes/No → <strong>if / whether + subject + verb</strong>",
                "⏪ Часто відбувається зсув часу (backshift)",
                "🔗 Часто після <em>ask, wonder, want to know</em>",
            ],
            hint:
                "Уяви, що ти робиш <em>ствердження</em>, а не питання.",
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Тип питання", "Структура", "Приклад"],
            rows: [
                [
                    "Wh-question",
                    "… + wh-word + subject + verb",
                    "She asked where he was.",
                ],
                [
                    "Yes / No",
                    "… + if / whether + subject + verb",
                    "He asked if I had seen her.",
                ],
                [
                    "Present → Past",
                    "backshift",
                    "Where is he? → where he was",
                ],
            ],
            hint:
                "<strong>If</strong> і <strong>whether</strong> зазвичай взаємозамінні; " +
                "<strong>whether</strong> частіше вживається у формальному стилі.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She wondered what he was doing.", "Вона цікавилася, що він робить."],
                ["He asked whether we could wait.", "Він запитав, чи можемо ми почекати."],
                ["I don’t know where she lives.", "Я не знаю, де вона живе."],
                ["Can you tell me if this is correct?", "Ти можеш сказати, чи це правильно?"],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>She asked where was he.</em> → ✅ <strong>where he was</strong>",
                "❌ <em>He asked did I see her.</em> → ✅ <strong>if I had seen her</strong>",
                "❌ Інверсія після <em>if / whether</em> → ❌",
                "❌ Зайві допоміжні дієслова <em>do / did</em>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Indirect speech question forms)",
        },
    ],
};

/* ============================
   COMPOUND SENTENCES
============================ */
export const RULE_PAGE_COMPOUND_SENTENCES = {
    id: "COMPOUND_SENTENCES",
    title: "Compound sentences",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке compound sentences",
            html: "Речення, що складаються з двох (або більше) <strong>незалежних</strong> частин, з’єднаних сполучниками <strong>and, but, or, so</strong>."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>I was tired, but I finished my work.</strong>",
                "<strong>She called me, and we talked for an hour.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He wanted to go out, but it was raining.", "Він хотів піти гуляти, але йшов дощ."],
                ["You can stay here, or you can leave.", "Ти можеш залишитися тут або піти."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Кома splice без сполучника: дві частини, з’єднані лише комою."]
        },
        { type: "trainer", title: "Міні-тренажер (Compound sentences)" }
    ]
};


/* ============================
   COMPLEX SENTENCES
============================ */
export const RULE_PAGE_COMPLEX_SENTENCES = {
    id: "COMPLEX_SENTENCES",
    title: "Complex sentences",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке complex sentences",
            html: "Речення з <strong>головною</strong> та <strong>підрядною</strong> частиною, з’єднані сполучниками <strong>because, although, when, if</strong> тощо."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>Although it was late, we kept talking.</strong>",
                "<strong>When I arrived, they were eating.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Because it was raining, we stayed at home.", "Тому що йшов дощ, ми залишилися вдома."],
                ["I’ll call you when I get there.", "Я подзвоню, коли дістануся."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Відсутні коми при початкових підрядних реченнях у письмі."]
        },
        { type: "trainer", title: "Міні-тренажер (Complex sentences)" }
    ]
};


/* ============================
   COMPOUND–COMPLEX SENTENCES
============================ */
export const RULE_PAGE_COMPOUND_COMPLEX_SENTENCES = {
    id: "COMPOUND_COMPLEX_SENTENCES",
    title: "Compound–complex sentences",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке compound–complex sentences",
            html: "Речення, що поєднують <strong>кілька незалежних</strong> і <strong>одну чи більше підрядних</strong> частин."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>I was tired, but I finished the report because it was important.</strong>",
                "<strong>When he arrived, we started cooking, and the guests came soon after.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["While I was studying, my phone rang, and I missed the call.", "Поки я вчився, задзвонив телефон, і я пропустив дзвінок."],
                ["She didn’t come because she was ill, and nobody called her.", "Вона не прийшла, бо була хвора, і ніхто їй не подзвонив."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Дуже довгі речення без логічних пауз і ком."]
        },
        { type: "trainer", title: "Міні-тренажер (Compound–complex sentences)" }
    ]
};


/* ============================
   DECLARATIVE SENTENCES
============================ */
export const RULE_PAGE_DECLARATIVE_SENTENCES = {
    id: "DECLARATIVE_SENTENCES",
    title: "Declarative sentences",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке declarative sentences",
            html: "Звичайні <strong>стверджувальні/заперечні</strong> речення, які просто дають інформацію."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "Порядок слів: <strong>підмет + присудок</strong>",
                "Інтонація вниз у кінці речення"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She works in a bank.", "Вона працює в банку."],
                ["They don’t like coffee.", "Вони не люблять каву."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Інверсія без потреби, наче в питанні."]
        },
        { type: "trainer", title: "Міні-тренажер (Declarative sentences)" }
    ]
};


/* ============================
   CORRELATIVE CONJUNCTIONS
============================ */
export const RULE_PAGE_CORRELATIVE_CONJUNCTIONS = {
    id: "CORRELATIVE_CONJUNCTIONS",
    title: "Correlative conjunctions (either…or / neither…nor / both…and)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке correlative conjunctions",
            html:
                "<strong>Correlative conjunctions</strong> — це <em>парні сполучники</em>, " +
                "які завжди працюють разом і з’єднують рівноправні частини речення:<br/>" +
                "<strong>either … or</strong>, <strong>neither … nor</strong>, <strong>both … and</strong>, <strong>not only … but also</strong>.",
        },
        {
            type: "usage",
            title: "Коли й як вживаємо",
            badges: [
                "🔀 Вибір між двома → <strong>either … or</strong>",
                "🚫 Заперечення обох → <strong>neither … nor</strong>",
                "➕ Обидва варіанти → <strong>both … and</strong>",
                "✨ Підсилення → <strong>not only … but also</strong>",
            ],
            hint:
                "Частини після обох елементів пари мають бути <em>граматично однаковими</em> " +
                "(іменник + іменник, дієслово + дієслово тощо).",
        },
        {
            type: "forms",
            title: "Типові моделі",
            headers: ["Конструкція", "Структура", "Приклад"],
            rows: [
                [
                    "either … or",
                    "either + A + or + B",
                    "Either you come or I go.",
                ],
                [
                    "neither … nor",
                    "neither + A + nor + B",
                    "Neither he nor she was there.",
                ],
                [
                    "both … and",
                    "both + A + and + B",
                    "Both Tom and Anna are here.",
                ],
                [
                    "not only … but also",
                    "not only + A + but also + B",
                    "She is not only smart but also kind.",
                ],
            ],
            hint:
                "У <strong>either…or</strong> та <strong>neither…nor</strong> " +
                "дієслово узгоджується з <em>найближчим підметом</em>.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Either call me or send a message.", "Або подзвони мені, або напиши повідомлення."],
                ["Neither my parents nor my friends knew about it.", "Ні батьки, ні друзі про це не знали."],
                ["Both the manager and the staff agree.", "І менеджер, і персонал згодні."],
                ["She is not only talented but also hardworking.", "Вона не лише талановита, а й працьовита."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Порушення паралельної структури → <em>both reading and to write</em> → ❌",
                "❌ Неправильне узгодження → <em>Neither you nor I is ready</em> → ✅ <strong>am ready</strong>",
                "❌ Пропуск другої частини → <em>either you come</em> → потрібно <strong>or</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Correlative conjunctions)",
        },
    ],
};

/* ============================
   ORDER OF ADJECTIVES
============================ */
export const RULE_PAGE_ORDER_OF_ADJECTIVES = {
    id: "ORDER_OF_ADJECTIVES",
    title: "Order of adjectives (opinion, size, age, color, origin, material, purpose)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Порядок прикметників перед іменником",
            html: "Типовий порядок: <strong>opinion → size → age → shape → color → origin → material → purpose → noun</strong>."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>a nice small old brown Italian leather bag</strong>",
                "<strong>a beautiful big new white wooden table</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She bought a lovely little red French car.", "Вона купила чудову маленьку червону французьку машину."],
                ["He lives in a big modern grey apartment building.", "Він живе у великому сучасному сірому багатоквартирному будинку."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Неприродний порядок, який звучить «по-іноземному», хоч і граматично можливий."]
        },
        { type: "trainer", title: "Міні-тренажер (Order of adjectives)" }
    ]
};


/* ============================
   PREPOSITIONS OF DIRECTION
============================ */
export const RULE_PAGE_PREP_DIRECTION = {
    id: "PREP_DIRECTION",
    title: "Prepositions of direction",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке prepositions of direction",
            html:
                "<strong>Prepositions of direction</strong> показують <em>рух і напрямок</em> — " +
                "куди хтось або щось рухається.",
        },
        {
            type: "usage",
            title: "Основні прийменники",
            badges: [
                "➡️ <strong>to</strong> — рух у напрямку місця (без акценту на «всередину»): <strong>go to school</strong>",
                "⬇️ <strong>into</strong> — рух <em>всередину</em>: <strong>walk into the room</strong>",
                "↗️ <strong>towards</strong> — у бік, у напрямку (не обовʼязково досягти): <strong>run towards the park</strong>",
                "↘️ <strong>onto</strong> — рух <em>на поверхню</em>: <strong>jump onto the table</strong>",
            ],
            hint:
                "Постав питання: <em>чи є рух?</em> і <em>чи є вхід всередину / на поверхню?</em>",
        },
        {
            type: "forms",
            title: "Типові моделі",
            headers: ["Прийменник", "Коли вживаємо", "Приклад"],
            rows: [
                [
                    "to",
                    "напрямок до місця",
                    "She went to the office.",
                ],
                [
                    "into",
                    "рух всередину",
                    "He walked into the room.",
                ],
                [
                    "towards",
                    "рух у бік (напрямок)",
                    "They moved towards the exit.",
                ],
                [
                    "onto",
                    "рух на поверхню",
                    "The cat jumped onto the sofa.",
                ],
            ],
            hint:
                "<strong>To</strong> ≠ <strong>into</strong>: " +
                "<em>to</em> — просто напрямок, <em>into</em> — обовʼязково «всередину».",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He threw the ball into the basket.", "Він кинув м’яч у кошик."],
                ["She walked towards the station.", "Вона пішла в напрямку вокзалу."],
                ["We went to the cinema.", "Ми пішли до кінотеатру."],
                ["The child ran into the house.", "Дитина забігла в будинок."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>go into school</em> (як звичайний напрямок) → ✅ <strong>go to school</strong>",
                "❌ <em>walk to the room</em> (коли мається на увазі «всередину») → ✅ <strong>walk into the room</strong>",
                "❌ Плутанина <em>towards</em> (напрямок) з <em>to</em> (ціль)",
            ],
        },
        {
            type: "trainer",
            title: "Міні-тренажер (Prepositions of direction)",
        },
    ],
};
