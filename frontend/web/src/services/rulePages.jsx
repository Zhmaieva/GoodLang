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
            html: "<strong>Have / have got</strong> — спосіб говорити про володіння (I have a car / I've got a car)."
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
                "Відомий/особливий: <strong>the sun / the book I read</strong>",
                "Перед голосним звуком: <strong>an hour</strong> (звук важливіший за букву)."
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
            html: "<strong>this / these</strong> — близько до мовця; <strong>that / those</strong> — далеко від мовця."
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
                "Підмет: <strong>I/you/he/she/it/we/they</strong>",
                "Об'єкт: <strong>me/you/him/her/it/us/them</strong>"
            ],
            hint: "Пам'ятай розрізняти форму підмета й форму об'єкта (I → me, he → him)."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Підмет", "Об'єкт", "Присвійна"],
            rows: [
                ["I", "me", "my"],
                ["you", "you", "your"],
                ["he", "him", "his"]
            ],
            hint: "There are also possessive adjectives (my, your, his...)."
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
        {
            type: "mistakes",
            title: "Типові помилки",
            bullets: [
                "❌ <em>She very pretty</em> → ✅ <strong>She is very pretty</strong>."
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Simple adjectives)" }
    ]
};

export const RULE_PAGE_PRESENT_SIMPLE_FREQ = {
    id: "PRESENT_SIMPLE_FREQ",
    title: "Present Simple + frequency adverbs",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Present Simple описує звички; прислівники частоти (always, often, sometimes) показують, як часто."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Звички: <strong>I get up at 7.</strong>",
                "Частота: <strong>She often goes to work.</strong>"
            ],
            hint: "Прислівники частоти стоять перед основним дієсловом, але після 'to be'."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Підмет", "Ствердження"],
            rows: [
                ["I/You/We/They", "I eat breakfast."],
                ["He/She/It", "He eats breakfast."]
            ],
            hint: "Додаємо -s для 3-ї особи однини."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I always brush my teeth.", "Я завжди чищу зуби."],
                ["They sometimes go to the cinema.", "Вони іноді ходять у кіно."]
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Present Simple + frequency)" }
    ]
};

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
                ["Do you like pizza?", "Ти любиш піцу?"],
                ["Is he at home?", "Він вдома?"]
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
            title: "Коли вживаємо",
            badges: [
                "Who — особа, What — що, Where — де, When — коли",
                "How — як / скільки"
            ],
            hint: "Після wh-слова часто йде допоміжне дієслово (Do/Does/Is/Are)."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["Where do you live?", "Де ти живеш?"],
                ["What is your name?", "Як тебе звати?"]
            ]
        },
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
            html: "Наказовий спосіб: інструкції, поради, прохання (Be quiet! Open the door!)."
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
            title: "Коли вживаємо",
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
        { type: "trainer", title: "Міні-тренажер (Countable / Uncountable)" }
    ]
};

export const RULE_PAGE_LIKE_ING = {
    id: "LIKE_ING",
    title: "Like + -ing",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "<strong>Like + -ing</strong> використовується для опису захоплень / діяльності, що подобається (I like swimming)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Після like: <strong>I like reading.</strong>",
                "Після enjoy, love, hate також: <strong>She enjoys dancing.</strong>"
            ],
            hint: "Після 'like' можна ставити і інфінітив, але з іншим відтінком значення."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["He likes playing football.", "Він любить грати у футбол."],
                ["Do you like cooking?", "Ти любиш готувати?"]
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Like + -ing)" }
    ]
};

export const RULE_PAGE_BE_FROM = {
    id: "BE_FROM",
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
                "Країна/місто: <strong>She is from Poland.</strong>",
                "Національність через 'be' + adjective: <strong>He is Polish.</strong>"
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
    title: "Present Continuous (now)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Present Continuous описує дію, що відбувається зараз: <strong>I am reading now.</strong>"
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "Дія зараз: <strong>She is talking on the phone.</strong>",
                "План на майбутнє (короткі домовленості): <strong>I'm meeting him tomorrow.</strong>"
            ],
            hint: "Форма: am/is/are + V-ing."
        },
        {
            type: "forms",
            title: "Форми",
            headers: ["Ствердження", "Заперечення", "Питання"],
            rows: [
                ["I am working.", "I am not working.", "Are you working?"]
            ]
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["They are playing football now.", "Вони зараз грають у футбол."]
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Present Continuous)" }
    ]
};

export const RULE_PAGE_PREP_PLACE = {
    id: "PREP_PLACE",
    title: "Prepositions of place (in/on/under/next to)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Прийменники місця вказують розташування: in, on, under, next to, between, behind тощо."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "in — всередині (in the box)",
                "on — поверхня (on the table)",
                "under — під (under the bed)",
                "next to — поряд (next to the school)"
            ],
            hint: "Візуалізація допомагає краще запам'ятати різницю (in vs on)."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["The cat is on the roof.", "Кіт на даху."],
                ["The keys are in my bag.", "Ключі в моїй сумці."]
            ]
        },
        { type: "trainer", title: "Міні-тренажер (Prepositions of place)" }
    ]
};

export const RULE_PAGE_PREP_TIME = {
    id: "PREP_TIME",
    title: "Prepositions of time (in/on/at)",
    subtitle: "Вивчення правила",
    sections: [
        {
            type: "meaning",
            title: "Що це",
            html: "Прийменники часу: <strong>in</strong> (місяці, роки, частини дня), <strong>on</strong> (дні, дати), <strong>at</strong> (точний час, свята як point)."
        },
        {
            type: "usage",
            title: "Коли вживаємо",
            badges: [
                "in July / in 2020 / in the morning",
                "on Monday / on 1st May",
                "at 7 o'clock / at night"
            ],
            hint: "Запам'ятай шаблони: in (longer periods), on (days), at (specific time)."
        },
        {
            type: "examples",
            title: "Приклади",
            items: [
                ["I was born in 1990.", "Я народився в 1990."],
                ["My birthday is on June 5th.", "Мій день народження — 5 червня."]
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
                "Dates: <strong>May 1st / the first of May</strong>",
                "Position: <strong>She is first in line.</strong>"
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
            html: "<strong>Would like to</strong> — ввічливе бажання або прохання (I would like to have coffee)."
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
            html: "<strong>Let's</strong> використовується для пропозицій: <em>Let's go!</em> — Давайте підемо!"
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
        { type: "trainer", title: "Міні-тренажер (Too / Very)" }
    ]
};
