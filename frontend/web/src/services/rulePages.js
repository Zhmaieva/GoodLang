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
                "Завжди додавай <strong>future time</strong> (tomorrow, next week…), щоб було зрозуміло, що це про майбутнє.",},
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
            ],
            hint:
                "У Present Simple: <strong>I/you/we/they have to</strong>, <strong>he/she/it has to</strong>.",
        },
        {
            type: "forms",
            title: "Форми have to",
            headers: ["Особа", "Ствердження", "Заперечення", "Питання", "Короткі відповіді"],
            rows: [
                [
                    "I / You / We / They",
                    "have to work",
                    "don’t have to work",
                    "Do you have to work?",
                    "Yes, I do. / No, I don’t.",
                ],
                [
                    "He / She / It",
                    "has to work",
                    "doesn’t have to work",
                    "Does he have to work?",
                    "Yes, he does. / No, he doesn’t.",
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
            ],
            hint:
                "Структура: <strong>may / might + V1</strong>. Не додаємо <em>to</em>.",
        },
        {
            type: "forms",
            title: "Форми may / might",
            headers: ["Тип", "Ствердження / Заперечення", "Питання", "Короткі відповіді", "Примітка"],
            rows: [
                [
                    "Можливість",
                    "She may be at home.",
                    "May she be at home?",
                    "Yes, she may. / No, she may not.",
                    "May = можливо.",
                ],
                [
                    "Можливість (менш ймовірно)",
                    "He might come later.",
                    "Might he come later?",
                    "Yes, he might. / No, he might not.",
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
                    "На -y",
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
                "більш ніж двох предметів/людей: <strong>the tallest, the most interesting</strong>.",
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
                    "На -y",
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
                    "Негативний відтінок.",
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
            headers: ["Структура", "Приклад", "Переклад", "Примітка", "Ще приклад"],
            rows: [
                [
                    "like + V-ing",
                    "I like swimming.",
                    "Мені подобається плавати.",
                    "",
                    "We like cooking.",
                ],
                [
                    "love + V-ing",
                    "She loves singing.",
                    "Вона обожнює співати.",
                    "",
                    "They love playing football.",
                ],
                [
                    "hate + V-ing",
                    "He hates getting up early.",
                    "Він ненавидить рано вставати.",
                    "",
                    "I hate waiting in queues.",
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
    title: "If + Present Simple, Present Simple (Zero Conditional)",
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
    title: "If + Present, will + V (1st Conditional)",
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
            ],
            hint:
                "Структура: <strong>If + Present Simple, will + V</strong>. If-частина в Present, результат — з will.",
        },
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
                "🕒 Після <strong>when</strong>: <strong>When I get home, I’ll call you.</strong>",
                "⏳ Після <strong>before/after</strong>: <strong>Before you go to bed, brush your teeth.</strong>",
                "⚡ Після <strong>as soon as</strong>: <strong>I’ll text you as soon as I arrive.</strong>",
            ],
            hint:
                "Часова частина: <strong>when/while/before/after + Present</strong>. Головна частина: часто <strong>will + V</strong>.",
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
            title: "Питання про кількість, тривалість, частоту",
            html:
                "<strong>How often</strong> — «як часто», <strong>How long</strong> — «як довго», " +
                "<strong>How much</strong> — «скільки» (незлічуване / гроші / ціна).",
        },
        {
            type: "usage",
            title: "Коли що використовувати",
            badges: [
                "📅 Частота: <strong>How often do you go to the gym?</strong>",
                "⏱️ Тривалість: <strong>How long does the lesson last?</strong>",
                "💰 Кількість/ціна: <strong>How much water / money / is it?</strong>",
            ],
            hint:
                "Пам’ятай: <strong>How much</strong> + uncountable / money / price, <strong>How many</strong> + countable.",
        },
        {
            type: "forms",
            title: "Структура запитань",
            headers: ["Питання", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "How often",
                    "How often + do/does + S + V?",
                    "How often do you travel?",
                    "Як часто ти подорожуєш?",
                    "",
                ],
                [
                    "How long",
                    "How long + do/does + S + V?",
                    "How long does the film last?",
                    "Як довго триває фільм?",
                    "",
                ],
                [
                    "How much (кількість)",
                    "How much + uncountable noun",
                    "How much sugar do you need?",
                    "Скільки цукру тобі потрібно?",
                    "",
                ],
                [
                    "How much (ціна)",
                    "How much + is/are + …?",
                    "How much is this T-shirt?",
                    "Скільки коштує ця футболка?",
                    "",
                ],
            ],
            hint:
                "Після <strong>How often/How long</strong> часто йде <strong>Present Simple</strong>.",
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
                "❌ Використовувати <em>how much</em> з злічуваними: <em>How much apples?</em> → ✅ <strong>How many apples?</strong>",
            ],
            note:
                "Спершу виріши: це частота, тривалість чи кількість/ціна — і обери правильне <strong>how…</strong>.",
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
                "Після <strong>before</strong> та <strong>after</strong> ми можемо використовувати <strong>V-ing</strong>, " +
                "щоб коротко описати дію: <strong>Before going to bed…</strong>.",
        },
        {
            type: "usage",
            title: "Коли + -ing, коли речення",
            badges: [
                "🧾 Повне речення: <strong>Before I go to bed, I read.</strong>",
                "✂ Коротше: <strong>Before going to bed, I read.</strong>",
                "⏳ Те саме з <strong>after</strong>: <strong>After having dinner, we watch TV.</strong>",
            ],
            hint:
                "<strong>Before/after + V-ing</strong> = той самий підмет, що й у головному реченні.",
        },
        {
            type: "forms",
            title: "Структури з before / after",
            headers: ["Спосіб", "Структура", "Приклад", "Переклад", "Примітка"],
            rows: [
                [
                    "Повне речення",
                    "Before + S + V",
                    "Before I go out, I check the weather.",
                    "Перед тим як вийти, я перевіряю погоду.",
                    "",
                ],
                [
                    "V-ing",
                    "Before + V-ing",
                    "Before going out, I check the weather.",
                    "Перед виходом я перевіряю погоду.",
                    "",
                ],
                [
                    "After + S + V",
                    "After we finished, we went home.",
                    "Після того як ми закінчили, ми пішли додому.",
                    "",
                ],
                [
                    "After + V-ing",
                    "After finishing, we went home.",
                    "Після завершення ми пішли додому.",
                    "",
                ],
            ],
            hint:
                "Якщо підмет різний — краще використовувати повне речення (<strong>Before he arrives, I’ll…</strong>).",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Before going to bed, I brush my teeth.", "Перед тим як лягти спати, я чищу зуби."],
                ["After having breakfast, she goes to work.", "Після сніданку вона йде на роботу."],
                ["Before you start, read the instructions.", "Перед тим як почати, прочитай інструкцію."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Before go to bed</em> → ✅ <strong>Before going to bed</strong> / <strong>Before I go to bed</strong>",
            ],
            note:
                "Після <strong>before/after</strong> потрібен або <strong>V-ing</strong>, або повне речення з підметом.",
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
            headers: ["Структура", "Приклад", "Переклад", "Примітка", "Ще приклад"],
            rows: [
                [
                    "be good at + V-ing",
                    "I’m good at singing.",
                    "Я добре співаю.",
                    "",
                    "She’s good at using computers.",
                ],
                [
                    "be bad at + V-ing",
                    "He’s bad at drawing.",
                    "Він погано малює.",
                    "",
                    "I’m bad at remembering names.",
                ],
                [
                    "be interested in + V-ing",
                    "We’re interested in travelling.",
                    "Нас цікавлять подорожі.",
                    "",
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
    title: "Make / do difference",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Коли make, а коли do",
            html:
                "Обидва дієслова можуть означати «робити», але вживаються з різними словами. " +
                "<strong>Do</strong> — про <em>дії/роботу/завдання</em>. <strong>Make</strong> — про <em>створення/результат</em>.",
        },
        {
            type: "usage",
            title: "Типові поєднання",
            badges: [
                "🧹 <strong>do</strong> homework, the dishes, the shopping, a job",
                "🎂 <strong>make</strong> a cake, a mistake, a decision, a plan",
                "😊 <strong>make</strong> friends, money, a phone call",
            ],
            hint:
                "<strong>Do</strong> — «виконувати»; <strong>make</strong> — «створювати / спричиняти щось нове».",
        },
        {
            type: "forms",
            title: "Порівняння make vs do",
            headers: ["Дієслово", "Тип поєднань", "Приклади", "Переклад", "Примітка"],
            rows: [
                [
                    "do",
                    "робота/завдання",
                    "do homework, do the dishes, do sport",
                    "робити домашнє, мити посуд, займатися спортом",
                    "",
                ],
                [
                    "make",
                    "створення/результат",
                    "make a cake, make a plan, make a mistake",
                    "спекти торт, скласти план, зробити помилку",
                    "",
                ],
            ],
            hint:
                "Багато виразів потрібно просто запам’ятати як готові фрази.",
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I always do my homework in the evening.", "Я завжди роблю домашнє ввечері."],
                ["She’s making a cake for her friend.", "Вона готує торт для подруги."],
                ["Don’t make the same mistake again.", "Не роби ту саму помилку знову."],
                ["We did the shopping yesterday.", "Ми зробили покупки вчора."],
            ],
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>make homework</em> → ✅ <strong>do homework</strong>",
                "❌ <em>do a mistake</em> → ✅ <strong>make a mistake</strong>",
            ],
            note:
                "Якщо сумніваєшся, перевір у словнику типові <strong>collocations</strong> із make/do.",
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
            title: "Що означає since / for",
            html: "<strong>Since</strong> = з конкретного моменту. <strong>For</strong> = протягом певного періоду."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>Since 2010</strong> — з 2010 року",
                "<strong>Since Monday</strong> — з понеділка",
                "<strong>For two years</strong> — протягом двох років",
                "<strong>For a long time</strong> — тривалий час"
            ],
            hint: "Часто вживається з Present Perfect."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["We’ve lived here since 2015.", "Ми живемо тут з 2015 року."],
                ["I’ve known her for years.", "Я знаю її багато років."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>for 2010</em> → конкретний момент → <strong>since 2010</strong>",
                "❌ <em>since two years</em> → період → <strong>for two years</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Since / For)" }
    ]
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
            html: "Описує дію, що почалась у минулому і триває до тепер або щойно завершилася."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "⏳ Тривалість: <strong>I’ve been studying for 3 hours.</strong>",
                "😓 Нещодавня дія: <strong>She’s been crying.</strong>",
                "🏃 Дії, що тривають: <strong>They’ve been working all day.</strong>"
            ],
            hint: "Форма: <strong>have/has been + -ing</strong>"
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’ve been waiting for you.", "Я чекаю на тебе (вже тривалий час)."],
                ["Has he been running?", "Він бігав?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He has being working</em> → <strong>He has been working</strong>",
                "❌ Використання з дієсловами стану (know, love)."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Present Perfect Continuous)" }
    ]
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
            html: "<strong>Already</strong> — вже. <strong>Yet</strong> — вже? / ще не. <strong>Just</strong> — щойно."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>Already</strong> у ствердженнях",
                "<strong>Yet</strong> у запереченнях і питаннях",
                "<strong>Just</strong> = щойно"
            ],
            hint: "Часто вживається з Present Perfect."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’ve already finished.", "Я вже закінчив."],
                ["Have you finished yet?", "Ти вже закінчив?"],
                ["She’s just left.", "Вона щойно пішла."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>Did you finish yet?</em> → Present Perfect",
                "❌ <em>I just have finished</em> → <strong>I’ve just finished</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Already / Yet / Just)" }
    ]
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
            html: "<strong>Past Perfect</strong> описує дію, яка сталася <em>до</em> іншої дії в минулому."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "⏱️ Раніше минулої дії: <strong>She had left before I arrived.</strong>",
                "📚 Причина: <strong>I was tired because I had worked all day.</strong>"
            ],
            hint: "Форма: <strong>had + V3</strong>"
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["They had finished the project before Monday.", "Вони завершили проєкт до понеділка."],
                ["Had you seen him before?", "Ти бачив його раніше?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Плутанина з Past Simple без контексту часу.",
                "❌ <em>had went</em> → <strong>had gone</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Past Perfect)" }
    ]
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
            html: "<strong>Used to</strong> описує минулі звички або стани, які більше не актуальні."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "🧒 Минулі звички: <strong>I used to play outside.</strong>",
                "🏠 Минулі стани: <strong>We used to live in Kyiv.</strong>"
            ],
            hint: "Форма ствердження: <strong>used to + V</strong>"
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Форма", "Ствердження", "Заперечення", "Питання"],
            rows: [
                ["—", "I used to smoke.", "I didn’t use to smoke.", "Did you use to smoke?"]
            ],
            hint: "У негативі та питанні — <strong>use</strong> без -d."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I used to have long hair.", "У мене раніше було довге волосся."],
                ["Did you use to swim?", "Ти раніше плавав?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>didn’t used to</em> → <strong>didn’t use to</strong>",
                "❌ Плутання з <em>be used to</em>."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Used to)" }
    ]
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
            html: "<strong>Be used to</strong> = бути звиклим. <strong>Get used to</strong> = звикати."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>I'm used to cold weather.</strong> — я звик до холоду",
                "<strong>She's getting used to her new job.</strong> — вона звикає"
            ],
            hint: "Після to → іменник або <strong>V-ing</strong>."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’m used to waking up early.", "Я звик рано прокидатися."],
                ["He got used to driving on the left.", "Він звик їздити лівою стороною."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Плутання з used to (минула звичка).",
                "❌ <em>I'm used to eat</em> → <strong>I'm used to eating</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Be used to / Get used to)" }
    ]
};


/* ============================
   SECOND CONDITIONAL
============================ */
export const RULE_PAGE_SECOND_CONDITIONAL = {
    id: "SECOND_CONDITIONAL",
    title: "2nd Conditional (If + Past, would + V)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає 2nd Conditional",
            html: "Використовуємо для нереальних, уявних або малоймовірних ситуацій у теперішньому чи майбутньому."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>If I had more time, I would travel.</strong>",
                "<strong>If he were taller, he would play basketball.</strong>",
                "<strong>If I won a billion dollars tomorrow, I would quit my job immediately.</strong> - малоймовірна ситуація"
            ],
            hint: "У всіх особах можливе <strong>were</strong>."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["If-clause", "Result"],
            rows: [
                ["If + Past Simple", "would / could / might + V (infinitive)"]
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["If I won the lottery, I’d buy a house.", "Якби я виграв у лотерею..."],
                ["Would you help me if I asked?", "Допоміг би ти мені?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>If I will...</em> → <strong>If + Past</strong>",
                "❌ <em>would</em> в обох частинах речення."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (2nd Conditional)" }
    ]
};


/* ============================
   THIRD CONDITIONAL
============================ */
export const RULE_PAGE_THIRD_CONDITIONAL = {
    id: "THIRD_CONDITIONAL",
    title: "3rd Conditional",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає 3rd Conditional",
            html: "Говоримо про нереальні ситуації у минулому (жаль, альтернативи)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>If I had known, I would have helped.</strong>",
                "<strong>If they had left earlier, they wouldn’t have missed the bus.</strong>"
            ],
            hint: "Форма: <strong>If + Past Perfect → would have + V3</strong>"
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["If she had studied, she would have passed.", "Якби вона вчилася..."],
                ["Would you have gone if I had invited you?", "Ти б пішов, якби я запросив?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Переплутання з 2nd Conditional.",
                "❌ <em>would had</em> → <strong>would have</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (3rd Conditional)" }
    ]
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
            html: "<strong>Wish + Past</strong> = жаль про теперішнє. <strong>Wish + Past Perfect</strong> = жаль про минуле."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>I wish I knew.</strong> — шкода, що не знаю",
                "<strong>I wish I had studied.</strong> — шкода, що не вчився"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I wish I were taller.", "Шкода, що я не вищий."],
                ["I wish I hadn’t said that.", "Шкода, що я це сказав."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>I wish I would know</em> → <strong>I wish I knew</strong>",
                "❌ <em>wish + will</em> у таких реченнях не використовується."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Wish)" }
    ]
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
            html: "<strong>Should have</strong> = треба було. <strong>Could have</strong> = міг би, але не сталося."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>You should have told me.</strong> — треба було сказати",
                "<strong>He could have won.</strong> — він міг би виграти"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I should have studied more.", "Мені треба було більше вчитися."],
                ["She could have been hurt.", "Вона могла постраждати."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>should had</em> → <strong>should have</strong>",
                "❌ Плутанина з простими модальними формами."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Modal Perfects)" }
    ]
};


/* ============================
   GERUND VS INFINITIVE
============================ */
export const RULE_PAGE_GERUND_VS_INFINITIVE = {
    id: "GERUND_VS_INFINITIVE",
    title: "Gerund vs infinitive",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає gerund / infinitive",
            html: "Герундій = <strong>V-ing</strong>. Інфінітив = <strong>to + V</strong>."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Після деяких дієслів — V-ing: <strong>enjoy, mind, finish</strong>",
                "Після інших — to + V: <strong>want, need, plan</strong>",
                "Після stop / remember — різний зміст"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I enjoy reading.", "Я люблю читати."],
                ["She wants to go home.", "Вона хоче піти додому."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>He suggested to go</em> → <strong>going</strong>",
                "❌ <em>I decided going</em> → <strong>to go</strong>"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Gerund vs Infinitive)" }
    ]
};


/* ============================
   PASSIVE VOICE (all tenses)
============================ */
export const RULE_PAGE_PASSIVE_VOICE_ALL_TENSES = {
    id: "PASSIVE_VOICE_ALL_TENSES",
    title: "Passive Voice (all tenses)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає Passive Voice",
            html: "Акцент на <strong>дії</strong> або її <strong>результаті</strong>, а не на виконавці."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "📦 Продукція: <strong>The phones are made in China.</strong>",
                "📌 Невідомий виконавець: <strong>The window was broken.</strong>"
            ],
            hint: "Форма: <strong>be + V3</strong>"
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The room is cleaned every day.", "Кімнату прибирають щодня."],
                ["The letter was sent yesterday.", "Листа відправили вчора."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Неправильна форма be.",
                "❌ Забувають додати by + виконавець (коли потрібно)."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Passive Voice)" }
    ]
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
            html: "<strong>Get + V3</strong> = стати / потрапити в стан (часто неформально)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>get married</strong> — одружитися",
                "<strong>get lost</strong> — загубитися",
                "<strong>get dressed</strong> — вдягатися"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She got hired last month.", "Вона отримала роботу минулого місяця."],
                ["Don’t get hurt.", "Не поранись."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Плутанина з пасивом: це окрема конструкція."]
        },
        { type: "trainer", title: "Міні-тренажер (Get + V3)" }
    ]
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
            html: "Коли передаємо чиїсь слова без цитування."
        },
        {
            type: "usage",
            title: "Основні правила",
            badges: [
                "Часи зсуваються назад",
                "<strong>say</strong> / <strong>tell</strong>",
                "Зміна займенників"
            ],
            hint: "Напр.: “I am tired” → He said he was tired."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She said she was busy.", "Вона сказала, що була зайнята."],
                ["He told me he had finished.", "Він сказав мені, що закінчив."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ say + object → використовуємо <strong>tell</strong>",
                "❌ Не зсовують часи"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Reported Speech)" }
    ]
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
            html: "Короткі запитання в кінці речення для уточнення."
        },
        {
            type: "usage",
            title: "Правило",
            badges: [
                "Позитивне речення → негативний tag",
                "Негативне речення → позитивний tag"
            ],
            hint: "You’re tired, <strong>aren’t you?</strong>"
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He’s a doctor, isn’t he?", "Він лікар, чи не так?"],
                ["They aren’t ready, are they?", "Вони не готові, так?"]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Неправильний допоміжний дієслово."]
        },
        { type: "trainer", title: "Міні-тренажер (Question Tags)" }
    ]
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
            html: "<strong>Too</strong> = надто. <strong>Enough</strong> = достатньо. <strong>So / such</strong> = дуже."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "too + adj",
                "adj + enough",
                "so + adj",
                "such + (adj) + noun"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It’s too late.", "Занадто пізно."],
                ["He isn’t tall enough.", "Він недостатньо високий."],
                ["She is such a good friend.", "Вона така хороша подруга."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Плутанина між so / such."]
        },
        { type: "trainer", title: "Міні-тренажер (Too / enough / so / such)" }
    ]
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
            html: "Описують людей, речі або місця за допомогою <strong>who, which, that</strong>."
        },
        {
            type: "usage",
            title: "Приклади вживання",
            badges: [
                "<strong>who</strong> — для людей",
                "<strong>which</strong> — для речей",
                "<strong>that</strong> — універсальне"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["This is the man who helped us.", "Це чоловік, який нам допоміг."],
                ["I like the book that you gave me.", "Мені подобається книга, яку ти дав."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Пропускають who / which у середині речення."]
        },
        { type: "trainer", title: "Міні-тренажер (Relative Clauses)" }
    ]
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
            html: "Вказують, що дія повертається на того самого виконавця."
        },
        {
            type: "usage",
            title: "Приклади вживання",
            badges: [
                "<strong>He hurt himself.</strong>",
                "<strong>We enjoyed ourselves.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Be careful! Don’t cut yourself.", "Обережно! Не поріж себе."],
                ["They introduced themselves.", "Вони представилися."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Не використовують -self/-selves коли треба."]
        },
        { type: "trainer", title: "Міні-тренажер (Reflexive Pronouns)" }
    ]
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
            html: "Показують, <strong>як</strong> відбувається дія (quickly, slowly)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Додаємо -ly до прикметників",
                "<strong>fast</strong>, <strong>hard</strong> — винятки"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She sings beautifully.", "Вона красиво співає."],
                ["He works hard.", "Він багато працює."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Плутають adj та adv."]
        },
        { type: "trainer", title: "Міні-тренажер (Adverbs of manner)" }
    ]
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
            html: "<strong>In order to + V</strong> = щоб. <strong>So that + clause</strong> = щоб (з підметом)."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>I work to earn money.</strong>",
                "<strong>I work in order to earn money.</strong>",
                "<strong>I left early so that I wouldn’t be late.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She studies hard to pass the exam.", "Вона вчиться, щоб скласти іспит."],
                ["He spoke loudly so that everyone could hear.", "Він говорив голосно, щоб всі чули."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Плутання in order to / so that."]
        },
        { type: "trainer", title: "Міні-тренажер (In order to / So that)" }
    ]
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
            html: "<strong>must</strong> = впевненість; <strong>might</strong> = можливо; <strong>can’t</strong> = неможливо."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>He must be tired.</strong>",
                "<strong>She might come.</strong>",
                "<strong>He can’t be serious.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It must be cold outside.", "Напевно холодно."],
                ["She might be at work.", "Вона можливо на роботі."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ mustn't = заборона, НЕ ймовірність!"]
        },
        { type: "trainer", title: "Міні-тренажер (Modals of Probability)" }
    ]
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
            html: "Означає <strong>повинність / очікування</strong>."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>I’m supposed to start at 9.</strong>",
                "<strong>He wasn’t supposed to be here.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["You’re supposed to clean your room.", "Ти повинен прибрати кімнату."],
                ["We weren’t supposed to leave early.", "Ми не мали йти рано."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Плутанина з must / have to."]
        },
        { type: "trainer", title: "Міні-тренажер (Be supposed to)" }
    ]
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
            html: "<strong>let</strong> = дозволяти, <strong>make</strong> = змушувати, <strong>allow</strong> = дозволяти (формально)."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>Let me go.</strong>",
                "<strong>They made me do it.</strong>",
                "<strong>Smoking isn’t allowed.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["My parents let me stay out late.", "Батьки дозволяли мені гуляти довше."],
                ["The teacher made us repeat it.", "Вчитель змусив нас повторити."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>allowed to me</em> → <strong>allowed me</strong>",
                "❌ let без to"
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Let / Make / Allow)" }
    ]
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
            html: "Запитання у непрямій мові, без <strong>do/does/did</strong>."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>Where is he?</strong> → He asked where he was.",
                "<strong>Do you like it?</strong> → She asked if I liked it."
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He asked where I lived.", "Він запитав, де я живу."],
                ["She asked if I could help.", "Вона запитала, чи можу я допомогти."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Питальний порядок слів не використовується."]
        },
        { type: "trainer", title: "Міні-тренажер (Reported Questions)" }
    ]
};


/* ============================
   CAUSATIVE HAVE/GET
============================ */
export const RULE_PAGE_CAUSATIVE_HAVE_GET = {
    id: "CAUSATIVE_HAVE_GET",
    title: "Causative have/get",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що означає causative",
            html: "Ми організовуємо, щоб інші зробили щось для нас."
        },
        {
            type: "usage",
            title: "Форми",
            badges: [
                "<strong>have + object + V3</strong>",
                "<strong>get + object + V3</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I had my hair cut.", "Мені підстригли волосся."],
                ["We got the car repaired.", "Ми відремонтували авто (для нас)."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Плутанина з пасивом."]
        },
        { type: "trainer", title: "Міні-тренажер (Causative)" }
    ]
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
            html: "Дієслова + частки (up, out, off), що мають нове значення."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>look after</strong> — доглядати",
                "<strong>turn off</strong> — вимкнути",
                "<strong>pick up</strong> — підняти"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Can you pick me up?", "Підвезеш мене?"],
                ["Turn off the light.", "Вимкни світло."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Дослівний переклад не працює."]
        },
        { type: "trainer", title: "Міні-тренажер (Phrasal Verbs)" }
    ]
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
            title: "Що означають ці фрази",
            html: "Позначають взаємну дію: <strong>один одного</strong>."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>They love each other.</strong>",
                "<strong>They talked to one another.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["We help each other.", "Ми допомагаємо один одному."],
                ["The students listened to one another.", "Учні слухали одне одного."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Плутання з reflexive pronouns."]
        },
        { type: "trainer", title: "Міні-тренажер (Each other)" }
    ]
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
            html: "<strong>So do I</strong> = я теж (позитив). <strong>Neither do I</strong> = я теж ні."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>I like coffee. — So do I.</strong>",
                "<strong>I don’t like tea. — Neither do I.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’m tired. — So am I.", "Я втомлений — я теж."],
                ["I’m not ready. — Neither am I.", "Я не готовий — я теж ні."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Використання me too / me neither у формальних ситуаціях."]
        },
        { type: "trainer", title: "Міні-тренажер (So do I)" }
    ]
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
            html: "Це конструкції для виділення важливої інформації: <strong>It is/was … that …</strong> або <strong>What … is …</strong>."
        },
        {
            type: "usage",
            title: "Типові структури",
            badges: [
                "<strong>It was John who called.</strong>",
                "<strong>What I need is a break.</strong>"
            ],
            hint: "Використовуються для наголосу і більш природні в розмовній та письмовій мові, ніж просте підкреслення голосом."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It was yesterday that we met.", "Саме вчора ми зустрілися."],
                ["What I like most is your honesty.", "Найбільше мені подобається твоя чесність."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Занадто часте використання — текст стає важким.",
                "❌ Неправильний час після <em>It was</em>."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Cleft sentences)" }
    ]
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
            html: "Це умовні речення, де час у <strong>if-clause</strong> і результаті різний (минуле + теперішнє або теперішнє + минуле)."
        },
        {
            type: "usage",
            title: "Основні типи",
            badges: [
                "Минуле → теперішнє: <strong>If I had studied, I would speak better now.</strong>",
                "Теперішнє → минуле: <strong>If I were taller, I would have become a pilot.</strong>"
            ],
            hint: "Змішуємо 2nd і 3rd conditional, щоб показати різні часові площини."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["If she had left earlier, she wouldn’t be late now.", "Якби вона пішла раніше, зараз не запізнилася б."],
                ["If I were more careful, I wouldn’t have made that mistake.", "Якби я був уважнішим, не зробив би тієї помилки."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Використання однакових часів там, де потрібні різні.",
                "❌ Плутанина з простим 2nd / 3rd conditional."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Mixed conditionals)" }
    ]
};


/* ============================
   THIRD CONDITIONAL VARIATIONS
============================ */
export const RULE_PAGE_THIRD_CONDITIONAL_VARIATIONS = {
    id: "THIRD_CONDITIONAL_VARIATIONS",
    title: "Third conditional variations",
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
        { type: "trainer", title: "Міні-тренажер (Third conditional variations)" }
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
            html: "Пасивні структури з дієсловами <strong>say, believe, think, report, expect</strong> тощо."
        },
        {
            type: "usage",
            title: "Два основні типи",
            badges: [
                "<strong>It is said that…</strong>",
                "<strong>He is said to…</strong>"
            ],
            hint: "Часто використовується в новинах та формальному стилі."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["It is believed that the crisis is over.", "Вважається, що криза закінчилася."],
                ["He is said to be very rich.", "Кажуть, що він дуже багатий."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Забувають інфінітив після <em>be said / thought</em>.",
                "❌ Неправильний час у підрядному реченні."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Advanced passives with reporting verbs)" }
    ]
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
            html: "Скорочені підрядні речення з <strong>V-ing</strong> або <strong>V3</strong>, які дають додаткову інформацію."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Причина / час: <strong>Feeling tired, he went to bed.</strong>",
                "Пасивне значення: <strong>Built in 1990, the house…</strong>"
            ],
            hint: "Підмет участкового звороту = підмет головного речення."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Walking down the street, she met an old friend.", "Ідучи вулицею, вона зустріла старого друга."],
                ["Seen from above, the city looks tiny.", "Якщо дивитися згори, місто здається крихітним."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Dangling participles — коли підмет не збігається."]
        },
        { type: "trainer", title: "Міні-тренажер (Participle clauses)" }
    ]
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
            title: "Скорочені відносні речення",
            html: "Можемо скоротити <strong>who is/that are</strong> до <strong>V-ing</strong> або <strong>V3</strong>."
        },
        {
            type: "usage",
            title: "Приклади скорочення",
            badges: [
                "<strong>People who live here</strong> → <strong>People living here</strong>",
                "<strong>The cars that were produced</strong> → <strong>The cars produced</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Students living in the dorm must register.", "Студенти, які живуть у гуртожитку, мають зареєструватися."],
                ["The book written by my friend is popular.", "Книга, написана моїм другом, популярна."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Неправильний час або дієвідмінювання при скороченні."]
        },
        { type: "trainer", title: "Міні-тренажер (Reduced relative clauses)" }
    ]
};


/* ============================
   COMPLEX PREPOSITIONS
============================ */
export const RULE_PAGE_COMPLEX_PREPOSITIONS = {
    id: "COMPLEX_PREPOSITIONS",
    title: "Complex prepositions (due to, thanks to)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке complex prepositions",
            html: "Це прийменникові фрази: <strong>due to, thanks to, in front of, in spite of, because of</strong> тощо."
        },
        {
            type: "usage",
            title: "Приклади вживання",
            badges: [
                "<strong>Due to</strong> = через (нейтрально/негативно)",
                "<strong>Thanks to</strong> = завдяки (позитивно)",
                "<strong>Because of</strong> = через (нейтрально)"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The match was cancelled due to the rain.", "Матч скасували через дощ."],
                ["Thanks to your help, we finished on time.", "Завдяки твоїй допомозі ми встигли."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Заміна <em>thanks to</em> у негативних ситуаціях."]
        },
        { type: "trainer", title: "Міні-тренажер (Complex prepositions)" }
    ]
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
            title: "Різниця despite / in spite of",
            html: "<strong>Despite</strong> і <strong>in spite of</strong> означають «незважаючи на» і вживаються з іменником або <strong>V-ing</strong>."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>Despite being tired</strong>, he worked late.",
                "<strong>In spite of the rain</strong>, we went out."
            ],
            hint: "Після них <u>не</u> використовуємо <strong>of</strong> з despite: ❌ despite of."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Despite feeling ill, she went to work.", "Незважаючи на те, що почувалася погано, вона пішла на роботу."],
                ["In spite of losing, they were happy.", "Незважаючи на поразку, вони були щасливі."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ despite of, ❌ in spite of that + full clause (краще: although)."]
        },
        { type: "trainer", title: "Міні-тренажер (Despite / In spite of)" }
    ]
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
            html: "<strong>Would rather</strong> і <strong>prefer</strong> виражають уподобання, але по-різному будують речення."
        },
        {
            type: "usage",
            title: "Основні структури",
            badges: [
                "<strong>I’d rather + V</strong>",
                "<strong>I prefer + noun/V-ing</strong>",
                "<strong>I’d rather you + Past Simple</strong> (я б хотів, щоб ти...)"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I’d rather stay at home.", "Я краще залишуся вдома."],
                ["I’d rather you didn’t smoke here.", "Я б волів, щоб ти тут не курив."],
                ["I prefer coffee to tea.", "Я більше люблю каву, ніж чай."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ <em>I’d rather you to go</em> → <strong>I’d rather you went</strong>."]
        },
        { type: "trainer", title: "Міні-тренажер (Would rather / prefer)" }
    ]
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
            html: "<strong>Had better</strong> = краще зробити (інакше будуть наслідки)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "<strong>You’d better leave now.</strong>",
                "Часто про поради з попередженням"
            ],
            hint: "Форма: <strong>had better + V (без to)</strong>. У розмові — <strong>'d better</strong>."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["You’d better not be late.", "Краще не спізнюйся."],
                ["We’d better call them.", "Нам краще їм подзвонити."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ <em>had better to go</em> → <strong>had better go</strong>."]
        },
        { type: "trainer", title: "Міні-тренажер (Had better)" }
    ]
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
            html: "Використовуємо <strong>must, may, might, can’t, could</strong> у різних часах для вираження ступеня впевненості."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>He must have left.</strong> — напевно пішов (минуле)",
                "<strong>She can’t have done it.</strong> — вона точно цього не робила",
                "<strong>They may/might have forgotten.</strong> — можливо, забули"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She must be working now.", "Вона, напевно, зараз працює."],
                ["He might have missed the bus.", "Можливо, він пропустив автобус."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Переклад <em>mustn’t</em> як «напевно ні» (це заборона, а не припущення)."]
        },
        { type: "trainer", title: "Міні-тренажер (Advanced modals of deduction)" }
    ]
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
            title: "Що таке складні іменникові фрази",
            html: "Іменник з кількома прикметниками, додатками, прийменниковими фразами та відносними реченнями."
        },
        {
            type: "usage",
            title: "Приклади структури",
            badges: [
                "det + adj + noun + prep phrase",
                "noun + relative clause"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The long, narrow road to the village was empty.", "Довга вузька дорога до села була порожньою."],
                ["The decision made by the committee was unexpected.", "Рішення, ухвалене комітетом, було неочікуваним."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Надто складні фрази без ком або без чіткої структури."]
        },
        { type: "trainer", title: "Міні-тренажер (Complex noun phrases)" }
    ]
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
            html: "У непрямій мові запитання мають <strong>звичайний порядок слів</strong>, без інверсії."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>Where is he?</strong> → She asked where he was.",
                "<strong>Did you see her?</strong> → He asked if I had seen her."
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["She wondered what he was doing.", "Вона цікавилася, що він робить."],
                ["He asked whether we could wait.", "Він запитав, чи можемо ми почекати."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Залишають інверсію: <em>She asked where was he</em>.",
                "❌ Плутають if / whether."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Indirect speech question forms)" }
    ]
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
    title: "Correlative conjunctions (either...or / neither...nor / both...and)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке correlative conjunctions",
            html: "Парні сполучники, які працюють разом: <strong>either … or, neither … nor, both … and, not only … but also</strong>."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>Either you come, or I go.</strong>",
                "<strong>Neither he nor she was there.</strong>",
                "<strong>Both Tom and Anna are here.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Either call me or send a message.", "Або подзвони мені, або напиши повідомлення."],
                ["Neither my parents nor my friends knew about it.", "Ні батьки, ні друзі про це не знали."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Порушення узгодження дієслова з найближчим підметом у neither…nor."]
        },
        { type: "trainer", title: "Міні-тренажер (Correlative conjunctions)" }
    ]
};

/* ============================
   PARALLELISM
============================ */
export const RULE_PAGE_PARALLELISM = {
    id: "PARALLELISM",
    title: "Parallelism (balanced grammatical structures)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що таке parallelism",
            html: "Коли однорідні елементи мають <strong>однакову граматичну форму</strong>: списки, порівняння, парні структури."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>She likes reading, writing, and painting.</strong>",
                "<strong>to learn, to grow, and to improve</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He wants to study hard and to get good grades.", "Він хоче наполегливо вчитися і отримувати хороші оцінки."],
                ["They were exhausted but happy and proud.", "Вони були виснажені, але щасливі й горді."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ Змішування форм: <em>to read, writing and to listen</em>.",
                "❌ Непослідовність у довгих списках."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Parallelism)" }
    ]
};


/* ============================
   MODIFIERS
============================ */
export const RULE_PAGE_MODIFIERS = {
    id: "MODIFIERS",
    title: "Modifiers (placement and clarity)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Хто такі modifiers",
            html: "Це слова/фрази, які уточнюють інші: прикметники, прислівники, фрази. Важливо їх <strong>правильно розміщувати</strong>."
        },
        {
            type: "usage",
            title: "Приклади правильного розміщення",
            badges: [
                "<strong>She almost failed every exam.</strong> (майже провалила всі)",
                "<strong>She failed almost every exam.</strong> (провалила майже всі)"
            ],
            hint: "Розташування modifier може змінити сенс."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Only I saw him yesterday.", "Лише я бачив його вчора."],
                ["I only saw him yesterday.", "Я лише бачив його вчора (і більше нічого не робив)."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Dangling modifiers — коли незрозуміло, що саме описується."]
        },
        { type: "trainer", title: "Міні-тренажер (Modifiers)" }
    ]
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
    title: "Prepositions of direction (to, into, towards)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Прийменники напрямку",
            html: "<strong>To</strong> — у напрямку до; <strong>into</strong> — всередину; <strong>towards</strong> — у бік."
        },
        {
            type: "usage",
            title: "Приклади",
            badges: [
                "<strong>go to school</strong>",
                "<strong>walk into the room</strong>",
                "<strong>run towards the park</strong>"
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He threw the ball into the basket.", "Він кинув м’яч у кошик."],
                ["She walked towards the station.", "Вона пішла в напрямку вокзалу."]
            ]
        },
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: ["❌ Плутанина to / into, коли є або немає руху всередину."]
        },
        { type: "trainer", title: "Міні-тренажер (Prepositions of direction)" }
    ]
};
