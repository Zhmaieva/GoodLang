export const RULE_PAGE_TO_BE = {
    id: "TO_BE",
    title: "To be (am / is / are)",
    subtitle:
        "Learning the rule",

    sections: [
        {
            type: "meaning",
            title: "What does be mean",
            html:
                "<strong>Be</strong> = <em>to be / exist / be located</em>. " +
                "We use it to say <strong>who</strong> I/he/she is, <strong>where</strong> I/we are, or <strong>what someone/something is like</strong>.",
        },
        {
            type: "usage",
            title: "When we use to be",
            badges: [
                "🆔 Identity: <strong>I’m a student.</strong>",
                "🙂 Description: <strong>She’s happy.</strong>",
                "📍 Location: <strong>We’re at home.</strong>",
                "🕰️ Time / weather / age: <strong>It’s Monday. I’m 7.</strong>",
            ]},
        {
            type: "forms",
            title: "Forms in Present Simple",
            headers: ["Person", "Affirmative", "Negative", "Question", "Short answers"],
            rows: [
                ["I", "I am → I’m", "I am not → I’m not", "Am I…?", "Yes, I am. / No, I’m not."],
                ["He / She / It", "He is → He’s", "He is not → He isn’t / He’s not", "Is he…?", "Yes, he is. / No, he isn’t."],
                ["You / We / They", "They are → They’re", "They are not → They aren’t / They’re not", "Are they…?", "Yes, they are. / No, they aren’t."],
            ],
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’m from Spain."],
                ["Is he at school?"],
                ["They aren’t ready."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I are / I is</em> → ✅ <strong>I am</strong>",
                "❌ <em>I have 7 years</em> → ✅ <strong>I’m 7 (years old)</strong>",
                "❌ <em>She very happy</em> → ✅ <strong>She is very happy</strong>",
            ],
            note:
                "In Present Simple, questions and negatives with <em>to be</em> are formed <strong>without</strong> the auxiliary verbs <em>do/does</em>.",
        },
        {
            type: "trainer",
            title: "Mini trainer (To be)",
        },
    ],
};

// A1 rule pages (following same structure as RULE_PAGE_TO_BE)

export const RULE_PAGE_THERE_IS_ARE = {
    id: "THERE_IS_ARE",
    title: "There is / There are",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it means",
            html: "<strong>There is / There are</strong> is used to say that something exists or is present in a certain place."
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "Singular: <strong>There is a book on the table.</strong>",
                "Plural: <strong>There are two cats.</strong>",
                "Question: <strong>Is there a problem?</strong>"
            ],
            hint: "In short answers: Yes, there is. / No, there isn’t. / Yes, there are. / No, there aren’t."
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Type", "Example"],
            rows: [
                ["Affirmative (singular)", "There is a dog."],
                ["Affirmative (plural)", "There are three chairs."],
                ["Negative", "There isn't a pen. / There aren't any pens."],
                ["Question", "Are there any apples?"]
            ],
            hint: "For quantities we use <strong>any</strong> in negatives and questions."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["There is a supermarket near my house."],
                ["Are there any buses tonight?"]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>There is three cats</em> → ✅ <strong>There are three cats</strong>.",
                "❌ <em>There aren't any informations</em> → ✅ <strong>information</strong> (uncountable)."
            ],
            note: "Remember subject–verb agreement (is — singular, are — plural)."
        },
        { type: "trainer", title: "Mini trainer (There is / There are)" }
    ]
};

export const RULE_PAGE_HAVE_HAVE_GOT = {
    id: "HAVE_HAVE_GOT",
    title: "Have / have got",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it means",
            html: "<strong>Have / have got</strong> is used to talk about possession or things someone has (I have a car / I've got a car)."
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "Possession: <strong>I have a sister.</strong>",
                "British style: <strong>I've got a bike.</strong>",
                "State/symptom: <strong>I have a cold.</strong>"
            ],
            hint: "In American English people usually use 'have'. In British English, 'have got' is common in everyday speech."
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Person", "Affirmative", "Negative", "Question"],
            rows: [
                ["I", "I have / I've got", "I don't have / I haven't got", "Do I have? / Have I got?"],
                ["He / She / It", "He has / He's got", "He doesn't have / He hasn't got", "Does he have? / Has he got?"]
            ],
            hint: "'Have got' forms questions using inversion: 'Have you got...?'"
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I have two brothers."],
                ["Has she got a car?"]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I have got two childrens</em> → ✅ <strong>children</strong> (irregular plural).",
                "❌ Using 'have got' too often in formal writing."
            ],
            note: "In negatives you can use either 'haven't got' or 'don't have' (both are correct, but the style is slightly different)."
        },
        { type: "trainer", title: "Mini trainer (Have / have got)" }
    ]
};

export const RULE_PAGE_POSSESSIVE_S = {
    id: "POSSESSIVE_S",
    title: "Possessive 's",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it means",
            html: "<strong>'s</strong> shows possession or belonging (Mary's book = the book of Mary)."
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "Personal possession: <strong>John's phone</strong>",
                "Time expressions: <strong>today's news</strong>",
                "Groups: <strong>people's opinion</strong>"
            ],
            hint: "For plural nouns ending in -s, we add only an apostrophe: <em>the boys' room</em>."
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Case", "Example"],
            rows: [
                ["One person", "Anna's bag"],
                ["Plural (-s)", "The students' classroom"],
                ["Irregular plural", "Children's toys"]
            ],
            hint: "Do not use 'of' and 's' together: 'the leg of the table' or 'the table's leg' (both possible but different styles)."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["The teacher's book."],
                ["The children's playground."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>the childrens' toys</em> → ✅ <strong>children's toys</strong>.",
                "❌ <em>Johns car</em> → ✅ <strong>John's car</strong> (apostrophe required)."
            ],
            note: "The apostrophe is important — it changes the meaning."
        },
        { type: "trainer", title: "Mini trainer (Possessive 's)" }
    ]
};

export const RULE_PAGE_POSSESSIVE_ADJECTIVES = {
    id: "POSSESSIVE_ADJECTIVES",
    title: "Possessive Adjectives",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it means",
            html: "<strong>Possessive adjectives</strong> show who something belongs to and always come <strong>before a noun</strong>: <em>my book</em>, <em>her bag</em>."
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "To talk about possession: <strong>my phone</strong>",
                "For people and things: <strong>his sister</strong>, <strong>their house</strong>",
                "When it is important <em>whose</em> something is, not <em>what</em> it is: <strong>our plan</strong>"
            ],
            hint: "A possessive adjective depends on the <strong>owner</strong>, not on the object."
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Person", "Form", "Example"],
            rows: [
                ["I", "my", "my bag"],
                ["you", "your", "your idea"],
                ["he", "his", "his jacket"],
                ["she", "her", "her phone"],
                ["it", "its", "its tail"],
                ["we", "our", "our home"],
                ["they", "their", "their car"]
            ],
            hint: "<strong>Its</strong> — without an apostrophe. <em>It's</em> = <em>it is</em>."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["This is my seat."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            note: "Possessive adjectives <strong>are never used alone</strong> — they must always be followed by a noun."
        },
        { type: "trainer", title: "Mini trainer (Possessive Adjectives)" }
    ]
};

export const RULE_PAGE_ARTICLES = {
    id: "ARTICLES",
    title: "Articles (a / an / the)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What articles mean",
            html: "<strong>a / an</strong> — indefinite article (one of many). <strong>the</strong> — definite article (specific)."
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "Something new or any: <strong>a dog / an apple</strong>",
                "Something known or specific: <strong>the sun / the book I read</strong>"
            ],
            hint: "'a' is used before a consonant sound, 'an' before a vowel sound."
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Situation", "Example"],
            rows: [
                ["Indefinite (mentioned for the first time)", "I saw a dog."],
                ["Definite (we know which one)", "The dog is black."],
                ["No article (plural or uncountable nouns in general meaning)", "Cats are friendly. Milk is white."]
            ],
            hint: "Names of most cities and countries are used without 'the' (with some exceptions)."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I need an umbrella."],
                ["The teacher is late."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I have the car</em> (when talking about any car) → ✅ <strong>I have a car</strong>.",
                "❌ <em>an university</em> (the word starts with /juː/) → ✅ <strong>a university</strong>."
            ],
            note: "Remember: the sound at the beginning of the word matters, not the letter."
        },
        { type: "trainer", title: "Mini trainer (Articles)" }
    ]
};

export const RULE_PAGE_DEMONSTRATIVES = {
    id: "DEMONSTRATIVES",
    title: "Demonstratives (this, that, these, those)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they mean",
            html: "Demonstratives are used to point to things, people, or ideas and show <strong>which ones</strong> we mean.\n" +
                "They depend on <strong>distance</strong> (near / far) and <strong>number</strong> (singular / plural).\n"
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "One thing near: <strong>this book</strong>",
                "Many things near: <strong>these books</strong>",
                "One thing far: <strong>that tree</strong>",
                "Many things far: <strong>those trees</strong>"
            ],
            hint: "this/these — singular/plural for things that are near; that/those — for things that are far."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["This is my phone."],
                ["Those are my friends."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>this books</em> → ✅ <strong>these books</strong>.",
                "❌ <em>those is</em> → ✅ <strong>those are</strong>."
            ]
        },
        { type: "trainer", title: "Mini trainer (Demonstratives)" }
    ]
};

export const RULE_PAGE_PERSONAL_PRONOUNS = {
    id: "PERSONAL_PRONOUNS",
    title: "Personal pronouns",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: "Personal pronouns replace nouns: <strong>I, you, he, she, it, we, they</strong>."
        },
        {
            type: "usage",
            title: "When they are used",
            badges: [
                "Used to replace a noun so we do not repeat it."
            ],
            hint: "Remember the difference between subject and object forms (I → me, he → him)."
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Subject", "Object"],
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
            title: "Examples",
            items: [
                ["She likes him."],
                ["They saw us."]
            ]
        },
        { type: "trainer", title: "Mini trainer (Personal pronouns)" }
    ]
};

export const RULE_PAGE_SIMPLE_ADJ = {
    id: "SIMPLE_ADJ",
    title: "Simple adjectives",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: `
        <p>
          <strong>Adjectives</strong> describe a person or a thing:
          <strong>big, small, happy, sad, tall, nice</strong>.
        </p>
        <p>
          In English, adjectives <strong>do not change</strong> for gender or number:
          ✅ <em>a big house</em> / ✅ <em>two big houses</em>
        </p>
      `
        },
        {
            type: "usage",
            title: "Where we place them",
            badges: [
                "Before a noun: <strong>a big house</strong>",
                "After <strong>to be</strong>: <strong>She is happy.</strong>",
                "After feel / look / seem: <strong>I feel tired.</strong>"
            ],
            hint: "We do not say: ❌ <em>a house big</em>. In English, adjectives usually come before the noun."
        },
        {
            type: "form",
            title: "Form",
            html: `
        <ul>
          <li>
            <strong>Adj + noun:</strong><br>
            <em>a small dog</em>, <em>a new phone</em>
          </li>
          <li>
            <strong>Subject + be + adj:</strong><br>
            <em>He is tall.</em> / <em>The coffee is hot.</em>
          </li>
          <li>
            <strong>Very</strong> makes the adjective stronger:<br>
            <em>very big</em>, <em>very nice</em>
          </li>
        </ul>
      `
        },
        {
            type: "clarification",
            title: "Order of adjectives",
            html: `
        <p>
          If there are two adjectives, the opinion usually comes before size or color:
        </p>
        <ul>
          <li>✅ <em>a nice big house</em></li>
          <li>✅ <em>a small red bag</em></li>
        </ul>
        <p>
          (For A1 learners it is enough to remember: <strong>nice</strong> → <strong>big/small</strong> → <strong>color</strong>.)
        </p>
      `
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["A small cat."],
                ["He is tall."],
                ["I feel tired today."]
            ]
        },
        { type: "trainer", title: "Mini trainer (Simple adjectives)" }
    ]
};

export const RULE_PAGE_PRESENT_SIMPLE_FREQ = {
    id: "PRESENT_SIMPLE_FREQ",
    title: "Present Simple",
    subtitle: "Tense for habits, facts, and regular actions",
    sections: [
        {
            type: "meaning",
            title: "What it is",
            html: "<strong>Present Simple is a grammatical tense in English.</strong> It is used to talk about facts, habits, regular actions, and schedules."
        },

        {
            type: "usage",
            title: "When we use it",
            badges: [
                "Habits: <strong>I get up at 7.</strong>",
                "Regular actions: <strong>She works every day.</strong>",
                "Frequency: <strong>They often travel.</strong>"
            ],
            hint: "Adverbs of frequency usually come before the main verb, but after 'to be'."
        },

        {
            type: "forms",
            title: "Present Simple forms",
            headers: ["Type", "I / You / We / They", "He / She / It"],
            rows: [
                ["Affirmative", "I work.", "She works."],
                ["Negative", "I do not (don't) work.", "She does not (doesn't) work."],
                ["Question", "Do you work?", "Does she work?"]
            ],
            hint: "In negatives and questions after do/does, the verb is always in the base form (without -s)."
        },

        {
            type: "examples",
            title: "Examples",
            items: [
                ["I always drink water in the morning."],
                ["She doesn't eat meat."],
                ["Do they work on Sundays?"]
            ]
        },

        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>He don't work</em> → ✅ <strong>He doesn't work</strong>",
                "❌ <em>She doesn't works</em> → ✅ <strong>She doesn't work</strong>",
                "❌ <em>Does she works?</em> → ✅ <strong>Does she work?</strong>"
            ]
        },

        { type: "trainer", title: "Mini trainer (Present Simple)" }
    ]
};

export const RULE_PAGE_YES_NO_Q = {
    id: "YES_NO_Q",
    title: "Yes/No questions",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: `
        <p>
          <strong>Yes/No questions</strong> are questions that can be answered with
          <strong>Yes</strong> or <strong>No</strong>.
        </p>
        <p>
          In English, most of these questions need an <strong>auxiliary verb</strong>:
          <strong>Do/Does</strong>, <strong>Am/Is/Are</strong>, or the modal verb <strong>Can</strong>.
        </p>
      `
        },
        {
            type: "usage",
            title: "How to form them",
            badges: [
                "🟧 Present Simple: <strong>Do/Does + subject + verb?</strong>",
                "🟧 To be: <strong>Am/Is/Are + subject + ...?</strong>",
                "🟧 Can: <strong>Can + subject + verb?</strong>"
            ],
            hint:
                "Main rule: in questions the auxiliary verb comes first (Do/Does/Am/Is/Are/Can)."
        },
        {
            type: "short_answers",
            title: "Short answers",
            html: `
        <p>
          Short answers repeat the same auxiliary verb:
        </p>
        <ul>
          <li>
            <strong>Do/Does:</strong><br>
            ✅ <em>Yes, I do.</em> / ✅ <em>No, she doesn't.</em>
          </li>
          <li>
            <strong>Am/Is/Are:</strong><br>
            ✅ <em>Yes, he is.</em> / ✅ <em>No, I’m not.</em>
          </li>
          <li>
            <strong>Can:</strong><br>
            ✅ <em>Yes, we can.</em> / ✅ <em>No, I can’t.</em>
          </li>
        </ul>
        <p>
          In polite conversation, it is better not to answer only <em>Yes</em> or <em>No</em> — a short form is usually added.
        </p>
      `
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Can you help me? — Yes, I can."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>You like pizza?</em> → ✅ <strong>Do you like pizza?</strong>",
                "❌ <em>Does she likes tea?</em> → ✅ <strong>Does she like tea?</strong>"
            ]
        },
        { type: "trainer", title: "Mini trainer (Yes/No questions)" }
    ]
};

export const RULE_PAGE_WH_Q = {
    id: "WH_Q",
    title: "Wh-questions",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: "Questions that begin with a question word: who, what, where, when, why, how."
        },
        {
            type: "usage",
            title: "How they are used",
            badges: [
                "When the wh-word is NOT the subject, we use an auxiliary verb: do / does / did / is / are / was / were",
                "If the wh-word IS the subject, we do not use an auxiliary verb"
            ]
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Where do you live?"],
                ["What is your name?"],
                ["Who called you yesterday?"],
                ["What makes you happy?"]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Who did call you?</em> → ✅ <strong>Who called you?</strong>",
                "❌ <em>What does make you happy?</em> → ✅ <strong>What makes you happy?</strong>"
            ]
        },
        { type: "trainer", title: "Mini trainer (Wh-questions)" }
    ]
};

export const RULE_PAGE_IMPERATIVES = {
    id: "IMPERATIVES",
    title: "Imperatives",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: "Imperatives are used for commands, instructions, advice, or requests."
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "Commands: <strong>Sit down!</strong>",
                "Advice: <strong>Try this.</strong>",
                "Negative commands: <strong>Don't be late.</strong>"
            ],
            hint: "The base verb form (infinitive without 'to') is used in imperatives."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Please, sit down."],
                ["Don't smoke here."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>You close the door.</em> → ✅ <strong>Close the door.</strong>",
                "❌ <em>You don’t be late.</em> → ✅ <strong>Don’t be late.</strong>"
            ]
        },
        { type: "trainer", title: "Mini trainer (Imperatives)" }
    ]
};

export const RULE_PAGE_CAN_CANT = {
    id: "CAN_CANT",
    title: "Can / can't",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it is",
            html: `
        <p>
          <strong>Can</strong> is used to say that someone
          <strong>is able</strong> to do something or that something is
          <strong>possible / allowed</strong>.
        </p>
        <p>
          <strong>Can't</strong> means that the ability or possibility
          <strong>does not exist</strong>, or that something is
          <strong>not allowed</strong>.
        </p>
      `
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "Ability: <strong>I can swim.</strong>",
                "Possibility: <strong>I can come tomorrow.</strong>",
                "Permission / request: <strong>Can I open the window?</strong>",
                "Prohibition: <strong>You can't park here.</strong>"
            ],
            hint: "After <strong>can</strong>, the verb is always in the base form (without <em>to</em>)."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["She can speak English."],
                ["Can we sit here?"],
                ["No, you can't park here."]
            ]
        },
        {
            type: "clarification",
            title: "Important",
            html: `
        <ul>
          <li>
            <strong>Can</strong> does not change with different subjects:<br>
            ✅ I can / He can / They can
          </li>
          <li>
            For past ability or a specific achievement, it is often better
            to use <strong>was / were able to</strong>.
          </li>
        </ul>
      `
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I can to swim.</em> → ✅ <strong>I can swim.</strong>",
                "❌ <em>Do you can help me?</em> → ✅ <strong>Can you help me?</strong>"
            ]
        },
        {
            type: "trainer",
            title: "Mini trainer (Can / can't)"
        }
    ]
};

export const RULE_PAGE_COUNT_UNCOUNT = {
    id: "COUNT_UNCOUNT",
    title: "Countable / uncountable nouns",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: `
        <p>
          <strong>Countable nouns</strong> are nouns that we can count:
          <em>one apple, two apples</em>.
        </p>
        <p>
          <strong>Uncountable nouns</strong> are nouns that we do not count individually:
          <em>water, money, information</em>.
        </p>
      `
        },
        {
            type: "usage",
            title: "How to use them",
            badges: [
                "Countable (singular): <strong>a / an</strong>, one, two books",
                "Countable (plural): <strong>many</strong>, a few, these apples",
                "Uncountable: <strong>much</strong>, a little, some water"
            ],
            hint: "If you can add a number (1, 2, 3), the noun is countable."
        },
        {
            type: "form",
            title: "Form",
            html: `
        <ul>
          <li>
            <strong>Countable:</strong><br>
            a book / two books / many books
          </li>
          <li>
            <strong>Uncountable:</strong><br>
            water / some water / much water
          </li>
          <li>
            For uncountable nouns we often use containers:<br>
            <em>a piece of</em>, <em>a glass of</em>, <em>a bottle of</em>
          </li>
        </ul>
      `
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I have three books."],
                ["Can I have a glass of water?"],
                ["How much time do we have?"]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Two advices.</em> → ✅ <strong>Two pieces of advice.</strong>",
                "❌ <em>Many money.</em> → ✅ <strong>Much money.</strong>",
                "❌ <em>These informations.</em> → ✅ <strong>This information.</strong>"
            ]
        },
        {
            type: "trainer",
            title: "Mini trainer (Countable / Uncountable)"
        }
    ]
};

export const RULE_PAGE_BE_FROM_NATIONALITY = {
    id: "BE_FROM_NATIONALITY",
    title: "Be from (nationality)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it is",
            html: `
        <p>
          <strong>Be from</strong> is used to say
          <strong>where a person comes from</strong> (country or city).
        </p>
        <p>
          For <strong>nationality</strong>, we often use an adjective:
          <em>I am Ukrainian.</em>
        </p>
      `
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "Origin (country/city): <strong>I am from Ukraine.</strong>",
                "Nationality (adjective): <strong>She is Polish.</strong>",
                "Question: <strong>Are you from Spain?</strong>",
                "Negative: <strong>I am not from Italy.</strong>"
            ],
            hint: "Both forms are correct: <em>I am from Ukraine</em> or <em>I am Ukrainian</em>."
        },
        {
            type: "clarification",
            title: "Important to remember",
            html: `
        <ul>
          <li>
            <strong>from</strong> + <strong>country / city</strong><br>
            ✅ I am from Poland.<br>
            ❌ I am from Polish.
          </li>
          <li>
            <strong>be</strong> + <strong>nationality adjective</strong><br>
            ✅ She is Italian.<br>
            ❌ She is an Italian.
          </li>
          <li>
            Nationality words <strong>do not use an article</strong>.
          </li>
        </ul>
      `
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I'm from Spain."],
                ["She is Finnish."],
                ["They are not from France."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>She is a Polish.</em> → ✅ <strong>She is Polish.</strong>",
                "❌ <em>He is from the France.</em> → ✅ <strong>He is from France.</strong>"
            ]
        },
        {
            type: "trainer",
            title: "Mini trainer (Be from / nationality)"
        }
    ]
};

export const RULE_PAGE_PRESENT_CONT_NOW = {
    id: "PRESENT_CONT_NOW",
    title: "Present Continuous",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it is",
            html: [
                "<strong>Present Continuous</strong> describes an <strong>action</strong> happening <strong>right now</strong>.<br>" +
                "<strong>Present Continuous</strong> is also used for <strong>planned future arrangements</strong>, " +
                "when the plan is already a <strong>clear arrangement</strong>."
            ]
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "⏳ Action happening now: <strong>She is talking on the phone.</strong>",
                "📅 Personal plans: <strong>I’m meeting my friend tomorrow.</strong>",
                "🚂 Scheduled event (organized by you): <strong>We’re leaving at 6.</strong>",
                "👥 Arrangement with someone: <strong>She’s having dinner with her parents on Sunday.</strong>",
            ],
            hint:
                "Future time words in the context make Present Continuous refer to the future."
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Affirmative", "Negative", "Question"],
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
            title: "Examples",
            items: [
                ["We’re having a party on Friday."],
                ["She isn’t working this weekend."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I read now.</em> → ✅ <strong>I am reading now.</strong>",
                "❌ <em>She is liking this movie.</em> → ✅ <strong>She likes this movie.</strong>",
                "❌ <em>I am living in Indonesia.</em> → ✅ <strong>I live in Indonesia.</strong>",
                "❌ <em>I meet my friend tomorrow.</em> → ✅ <strong>I’m meeting my friend tomorrow.</strong>"
            ]
        },
        { type: "trainer", title: "Mini trainer (Present Continuous)" }
    ]
};

export const RULE_PAGE_PREP_PLACE = {
    id: "PREP_PLACE",
    title: "Prepositions of place",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: "Prepositions of place show the position or location of something."
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "Inside boundaries → IN (in the box)",
                "Touching a surface → ON (on the table)",
                "Exact point/location → AT (at the door)",
                "Two objects very close → NEXT TO / BESIDE (next to the house)",
                "Two objects close but with some distance → NEAR / CLOSE TO (near the park)",
                "Between two objects → BETWEEN (between the houses)",
                "In the middle of many things → AMONG (among the people)",
                "Higher than something → ABOVE (above the clouds)",
                "Lower than something → BELOW (below the surface)",
                "Above or covering something → OVER (over the bridge)",
                "Under something → UNDER (under the table)",
                "Before something → IN FRONT OF (in front of the house)",
                "Behind something → BEHIND (behind the car)",
                "Inside clear limits → WITHIN (within the city limits)",
                "Movement inside → INTO (go into the room)",
                "Movement onto a surface → ONTO (jump onto the bed)",
                "Movement outside → OUT OF (out of the box)"
            ]
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["The cat is on the roof."],
                ["The keys are in my bag."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>The picture is in the wall.</em> → ✅ <strong>The picture is on the wall.</strong>",
                "❌ <em>She is in the bus.</em> → ✅ <strong>She is on the bus.</strong> (public transport is treated as a platform/service)",
                "❌ <em>He is on the car.</em> → ✅ <strong>He is in the car.</strong>",
                "❌ <em>The shop is in the corner.</em> → ✅ <strong>The shop is at the corner.</strong>",
                "❌ <em>A bird is sitting on a tree.</em> → ✅ <strong>A bird is sitting in a tree.</strong> (inside branches)"
            ]
        },
        { type: "trainer", title: "Mini trainer (Prepositions of place)" }
    ]
};

export const RULE_PAGE_PREP_TIME = {
    id: "PREP_TIME",
    title: "Prepositions of time",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: "Prepositions of time show <strong>when</strong> something happens."
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "Exact time / hour / specific moment → AT (at 5 o’clock, at night)",
                "Days, dates, specific weekdays → ON (on Monday, on July 5th)",
                "Longer periods of time → IN (in the morning, in 2025, in summer)",
                "Time from now → IN (in two hours)",
                "Beginning of a period → FROM (from Monday)",
                "End of a period → TO / TILL / UNTIL (to Friday, until 6 pm)",
                "Duration (how long) → FOR (for two hours)",
                "Starting point continuing until now → SINCE (since 2020)",
                "Deadline (not later than) → BY (by tomorrow)",
                "During an event or process → DURING (during the meeting)",
                "Immediately after → AFTER (after work)",
                "Earlier than → BEFORE (before lunch)",
                "Approximate time → AROUND / ABOUT (around 7 pm)"
            ]
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["The meeting starts at 9."],
                ["I work on Mondays."],
                ["She was born in 1998."],
                ["We will finish in two hours."],
                ["He has lived here since 2015."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
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
        { type: "trainer", title: "Mini trainer (Prepositions of time)" }
    ]
};

export const RULE_PAGE_ORDINALS_DATES = {
    id: "ORDINALS_DATES",
    title: "Ordinal numbers + dates",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What they are",
            html: "Ordinal numbers (first, second, third...) are used for dates, order, and positions in a sequence."
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "Dates: <strong>May 1st / the first of May</strong>",
                "Position/order: <strong>She is first in line.</strong>"
            ],
            hint: "Notice the written forms: 1st, 2nd, 3rd."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["My exam is on the 21st of June."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>My birthday is on 21 May</em> → ✅ <strong>My birthday is on the 21st of May</strong>",
                "❌ <em>Today is 1 May</em> → ✅ <strong>Today is the 1st of May</strong>",
                "❌ <em>He was born in 3 July</em> → ✅ <strong>He was born on 3rd July</strong>",
                "❌ <em>We met on May the five</em> → ✅ <strong>We met on May the fifth</strong>"
            ]
        },
        { type: "trainer", title: "Mini trainer (Ordinals & dates)" }
    ]
};

export const RULE_PAGE_WOULD_LIKE_TO = {
    id: "WOULD_LIKE_TO",
    title: "Would like to + verb",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it is",
            html: "<strong>Would like to</strong> is used to express a polite wish or request."
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "Ordering something: <strong>I would like a coffee, please.</strong>",
                "Plans or wishes: <strong>He would like to visit Paris.</strong>"
            ],
            hint: "Short form: <strong>I'd like...</strong>"
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I'd like some water."],
                ["Would you like to come?"]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I would like eat.</em> → ✅ <strong>I would like to eat.</strong>",
                "❌ <em>I want to order coffee.</em> → ✅ <strong>I would like to order coffee.</strong> (both are grammatically correct, but 'would like' is more polite)",
                "❌ <em>I would like that you come.</em> → ✅ <strong>I would like you to come.</strong>",
                "❌ <em>Would you like come with us?</em> → ✅ <strong>Would you like to come with us?</strong>"
            ]
        },
        { type: "trainer", title: "Mini trainer (Would like to)" }
    ]
};

export const RULE_PAGE_LETS = {
    id: "LETS",
    title: "Let's + verb",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it is",
            html: "<strong>Let's</strong> is used to make suggestions."
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "Suggestion: <strong>Let's have lunch.</strong>",
                "Polite instruction for a group: <strong>Let's be quiet.</strong>"
            ],
            hint: "After 'Let's' we always use the base verb (infinitive without 'to')."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Let's watch a movie."],
                ["Let's not argue."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Let’s to go home.</em> → ✅ <strong>Let’s go home.</strong>",
                "❌ <em>Let’s going to the park.</em> → ✅ <strong>Let’s go to the park.</strong>",
                "❌ <em>Let us go?</em> → ✅ <strong>Let’s go.</strong>",
                "❌ <em>Let’s we start now.</em> → ✅ <strong>Let’s start now.</strong>",
                "❌ <em>Let’s don’t talk about it.</em> → ✅ <strong>Let’s not talk about it.</strong>"
            ]
        },
        { type: "trainer", title: "Mini trainer (Let's)" }
    ]
};

export const RULE_PAGE_TOO_VERY = {
    id: "TOO_VERY",
    title: "Too / very",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What it is",
            html: "'Very' strengthens an adjective (very good). 'Too' means excessive (too hot — more than acceptable)."
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "Very + adj: <strong>very interesting</strong>",
                "Too + adj: <strong>too expensive</strong> (often with 'to' + infinitive: too hot to touch)"
            ],
            hint: "'Too' usually has a negative meaning or means something is excessive enough to cause a problem."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["It's very cold today."],
                ["This soup is too salty."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "<span style='font-weight: 350'>× It’s too cold for me, I like it.</span> → <span style='font-weight: 700;'>It’s very cold, but I like it.</span>",
                "<span style='font-weight: 350'>× This coffee is very hot to drink.</span> → <span style='font-weight: 700;'>This coffee is too hot to drink.</span>",
                "<span style='font-weight: 350'>× She is too beautiful.</span> → <span style='font-weight: 700;'>She is very beautiful.</span>",
                "<span style='font-weight: 350'>× The bag is very heavy to carry.</span> → <span style='font-weight: 700;'>The bag is too heavy to carry.</span>",
                "<span style='font-weight: 350'>× It’s too interesting!</span> → <span style='font-weight: 700;'>It’s very interesting!</span>"
            ]
        },
        { type: "trainer", title: "Mini trainer (Too / Very)" }
    ]
};

// --- A2 RULE PAGES ---

export const RULE_PAGE_PAST_SIMPLE = {
    id: "PAST_SIMPLE",
    title: "Past Simple",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What Past Simple is",
            html:
                "<strong>Past Simple</strong> is a tense used for <em>completed actions in the past</em>. " +
                "The event happened and finished at a specific time in the past. " +
                "For <strong>questions and negatives</strong> in Past Simple we usually use the auxiliary verb <strong>did</strong>.",
        },
        {
            type: "usage",
            title: "When we use Past Simple",
            badges: [
                "📅 Completed actions: <strong>I watched a film yesterday.</strong>",
                "🕰️ Specific time in the past: <strong>She visited Rome last year.</strong>",
                "🔁 Sequence of actions: <strong>He came home, ate dinner and went to bed.</strong>",
                "❓ Questions about the past: <strong>Did you call him?</strong>",
                "🚫 Negatives in the past: <strong>I didn’t understand the question.</strong>",
            ],
            hint:
                "Common time markers: <em>yesterday, last week, two days ago, in 2010, when I was a child</em>.",
        },
        {
            type: "forms",
            title: "Past Simple forms",
            headers: ["Type", "Structure", "Example", "Note"],
            rows: [
                [
                    "Affirmative",
                    "Subject + V2 / V-ed",
                    "She worked yesterday.",
                    "Irregular verbs use V2 (went, saw).",
                ],
                [
                    "Question",
                    "Did + subject + V1?",
                    "Did they arrive on time?",
                    "After 'did' we always use the base form.",
                ],
                [
                    "Negative",
                    "Subject + didn’t + V1",
                    "She didn’t like the movie.",
                    "No -ed or V2 after didn’t.",
                ],
            ],
            hint:
                "⚠️ The verb <strong>to be</strong> has its own Past Simple forms — <strong>was / were</strong> (without <strong>did</strong>). " +
                "For other verbs: <strong>V2 / V-ed</strong> appears only in affirmative sentences, while with <strong>did / didn’t</strong> we use <strong>V1</strong>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["We played football after school."],
                ["Did you enjoy the trip?"],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Did you finished?</em> → ✅ <strong>Did you finish?</strong>",
                "❌ <em>He didn’t went</em> → ✅ <strong>He didn’t go</strong>",
                "❌ <em>She not worked yesterday</em> → ✅ <strong>She didn’t work yesterday</strong>",
                "❌ <em>Did you were at home?</em> → ✅ <strong>Were you at home?</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Past Simple)",
        },
    ],
};

export const RULE_PAGE_WAS_WERE = {
    id: "WAS_WERE",
    title: "Was / were",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What was / were are",
            html:
                "<strong>Was / were</strong> are the past forms of the verb <strong>to be</strong>. " +
                "<em>Was</em> is used with singular subjects, and <em>were</em> with plural subjects and 'you'.",
        },
        {
            type: "usage",
            title: "When we use was / were",
            badges: [
                "🆔 Identity in the past: <strong>He was a teacher.</strong>",
                "🙂 State/feelings: <strong>They were tired.</strong>",
                "📍 Location: <strong>We were at home.</strong>",
                "🕰️ Age/time in the past: <strong>I was 10 years old.</strong>",
            ],
            hint:
                "<strong>Was</strong>: I, he, she, it. <strong>Were</strong>: you, we, they.",
        },
        {
            type: "forms",
            title: "Forms of was / were",
            headers: ["Person", "Affirmative", "Negative", "Question", "Short answers"],
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
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I was very busy yesterday."],
                ["They were at the concert."],
                ["Was she happy?"],
                ["We weren’t late."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Did you was?</em> → ✅ <strong>Were you?</strong>",
                "❌ <em>He didn’t was</em> → ✅ <strong>He wasn’t</strong>",
            ],
            note:
                "Questions and negatives with <strong>was / were</strong> are formed <strong>without did / didn’t</strong>.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Was / were)",
        },
    ],
};

export const RULE_PAGE_PAST_CONTINUOUS = {
    id: "PAST_CONTINUOUS",
    title: "Past Continuous",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What Past Continuous is",
            html:
                "<strong>Past Continuous</strong> describes an <em>ongoing action at a specific moment in the past</em>.",
        },
        {
            type: "usage",
            title: "When we use Past Continuous",
            badges: [
                "⏱️ Action at a specific moment: <strong>At 7 p.m. I was cooking.</strong>",
                "📚 Background action when something happened: <strong>He was reading when I called.</strong>",
                "🔁 Annoying repeated action in the past (with always): <strong>She was always losing her keys.</strong>",
            ],
            hint:
                "Often used with <em>when / while</em>: <strong>While I was studying, they were watching TV.</strong>",
        },
        {
            type: "forms",
            title: "Past Continuous forms",
            headers: ["Person", "Affirmative", "Negative", "Question", "Short answers"],
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
                "Add <strong>-ing</strong>: <em>play → playing, write → writing, swim → swimming</em>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I was watching TV at 9 o’clock."],
                ["They were playing football when it started to rain."],
                ["Was she sleeping at that time?"],
                ["He wasn’t listening to the teacher."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>They was playing</em> → ✅ <strong>They were playing</strong>",
                "❌ <em>Was you working?</em> → ✅ <strong>Were you working?</strong>",
            ],
            note:
                "Remember correct use of <strong>was / were</strong> and the <strong>-ing</strong> form.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Past Continuous)",
        },
    ],
};

export const RULE_PAGE_GOING_TO_PLANS = {
    id: "GOING_TO_PLANS",
    title: "Going to (plans)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What be going to is",
            html:
                "<strong>Be going to</strong> is used for <em>future plans</em> and <em>obvious predictions</em>.",
        },
        {
            type: "usage",
            title: "When we use going to",
            badges: [
                "🗓️ Plan (decision already made): <strong>I’m going to visit my friend.</strong>",
                "📌 Intention: <strong>She’s going to start a new job.</strong>",
                "🔮 Obvious prediction: <strong>Look at the clouds – it’s going to rain.</strong>",
            ],
            hint:
                "Important: the decision was made <em>before the moment of speaking</em>.",
        },
        {
            type: "forms",
            title: "Forms of be going to",
            headers: ["Person", "Affirmative", "Negative", "Question"],
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
                "Remember to use <strong>am / is / are</strong> before <strong>going to</strong>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’m going to buy a new phone."],
                ["Is she going to move to London?"],
                ["They aren’t going to work today."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>He going to study</em> → ✅ <strong>He is going to study</strong>",
                "❌ <em>Are you going study?</em> → ✅ <strong>Are you going to study?</strong>",
            ],
            note: "Do not forget <strong>to</strong> after <strong>going</strong>.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Going to – plans)",
        },
    ],
};

export const RULE_PAGE_WILL_PREDICTIONS = {
    id: "WILL_PREDICTIONS",
    title: "Will (predictions)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What will is",
            html:
                "<strong>Will</strong> is used for <em>decisions made at the moment of speaking</em>, <em>simple predictions</em>, and <em>promises</em>.",
        },
        {
            type: "usage",
            title: "When we use will",
            badges: [
                "💡 Decision made now: <strong>I’m thirsty. I’ll make some tea.</strong>",
                "🔮 Predictions: <strong>I think it’ll be cold tomorrow.</strong>",
                "🤝 Promises / offers: <strong>I’ll help you.</strong>",
            ],
            hint:
                "Common contractions: <strong>I’ll, you’ll, he’ll</strong>. Negative form: <strong>won’t</strong> (will not).",
        },
        {
            type: "forms",
            title: "Forms with will",
            headers: ["Person", "Affirmative", "Negative", "Question"],
            rows: [
                [
                    "All persons",
                    "will + V: She will come.",
                    "will not (won’t) + V: She won’t come.",
                    "Will + subject + V?: Will she come?",
                ],
            ],
            hint: "Will does not change with different subjects.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’ll call you later."],
                ["It’ll rain tomorrow."],
                ["Will they come to the party?"],
                ["He won’t like this movie."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>He will to go</em> → ✅ <strong>He will go</strong>",
                "❌ <em>Won’t he will come?</em> → ✅ <strong>Won’t he come?</strong>",
            ],
            note: "After <strong>will / won’t</strong> we always use the base verb (<strong>V1</strong>).",
        },
        {
            type: "trainer",
            title: "Mini trainer (Will – predictions)",
        },
    ],
};

export const RULE_PAGE_BE_GOING_TO_VS_WILL = {
    id: "BE_GOING_TO_VS_WILL",
    title: "Be going to vs will",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What the difference is",
            html:
                "<strong>Be going to</strong> is usually used for <em>plans or intentions</em> and <em>obvious predictions</em>. " +
                "<strong>Will</strong> is more often used for <em>decisions made at the moment of speaking</em>, <em>opinions/beliefs</em>, and <em>promises</em>.",
        },
        {
            type: "usage",
            title: "When to choose each",
            badges: [
                "🗓️ Plan made in advance: <strong>I’m going to visit my grandma.</strong>",
                "💡 Decision made now: <strong>OK, I’ll visit my grandma.</strong>",
                "🔮 Obvious prediction: <strong>Look at the clouds. It’s going to rain.</strong>",
                "🤔 Opinion/belief: <strong>I think it’ll rain.</strong>",
            ],
            hint:
                "In spoken English both forms are often interchangeable, but context usually shows which one fits better.",
        },
        {
            type: "examples",
            title: "Comparison examples",
            items: [
                ["I’m going to start a diet on Monday."],
                ["I’m hungry. I think I’ll make a sandwich."],
                ["Look at that car! It’s going to hit the tree."],
                ["I’m sure you’ll pass the exam."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Using <em>will</em> for events that were already planned → better: <strong>be going to</strong>.",
                "❌ Using <em>be going to</em> for spontaneous decisions → better: <strong>will</strong>.",
            ],
            note:
                "Ask yourself: was this planned earlier or decided <em>right now</em>?",
        },
        {
            type: "trainer",
            title: "Mini trainer (Going to vs will)",
        },
    ],
};

export const RULE_PAGE_MUST_MUSTNT = {
    id: "MUST_MUSTNT",
    title: "Must / mustn’t",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What must / mustn’t mean",
            html:
                "<strong>Must</strong> expresses a <em>strong obligation or necessity</em>. " +
                "<strong>Mustn’t</strong> expresses a <em>strict prohibition</em> (something is not allowed at all).",
        },
        {
            type: "usage",
            title: "When we use must / mustn’t",
            badges: [
                "📏 Rules / instructions: <strong>You must wear a seat belt.</strong>",
                "🧠 Personal obligation: <strong>I must finish this today.</strong>",
                "⛔ Prohibition: <strong>You mustn’t smoke here.</strong>",
            ],
        },
        {
            type: "forms",
            title: "Forms of must / mustn’t",
            headers: ["Type", "Affirmative / Negative", "Question", "Short answers", "Note"],
            rows: [
                [
                    "Obligation",
                    "You must do it.",
                    "Must I do it?",
                    "Yes, you must. / No, you don’t have to.",
                    "More formal and stronger than 'have to'.",
                ],
                [
                    "Prohibition",
                    "You mustn’t park here.",
                    "Must we stay here?",
                    "Yes, you must. / No, you don’t have to.",
                    "Mustn’t = not allowed.",
                ],
            ],
            hint:
                "<strong>Must</strong> does not change with different subjects: <em>I/you/he/she… must</em>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["You must do your homework."],
                ["I must call my mom."],
                ["You mustn’t use your phone in the exam."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>You must to go</em> → ✅ <strong>You must go</strong>",
                "❌ Confusing <strong>mustn’t</strong> (prohibition) with <strong>don’t have to</strong> (not necessary).",
            ],
            note:
                "<strong>Mustn’t</strong> = prohibited. <strong>Don’t have to</strong> = optional / not necessary.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Must / mustn’t)",
        },
    ],
};

export const RULE_PAGE_SHOULD_SHOULDNT = {
    id: "SHOULD_SHOULDNT",
    title: "Should / shouldn’t",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What should means",
            html:
                "<strong>Should</strong> is used for <em>advice</em>, recommendations, or a <em>mild obligation</em>. " +
                "<strong>Shouldn’t</strong> means it is better not to do something.",
        },
        {
            type: "usage",
            title: "When we use should",
            badges: [
                "🩺 Health advice: <strong>You should drink more water.</strong>",
                "📚 Recommendations: <strong>He should study harder.</strong>",
                "⚠️ Warnings: <strong>You shouldn’t drive so fast.</strong>",
            ],
            hint:
                "We do not say <em>should to</em>.",
        },
        {
            type: "forms",
            title: "Forms with should",
            headers: ["Type", "Affirmative / Negative", "Question", "Short answers"],
            rows: [
                [
                    "Advice",
                    "You should go to bed earlier.",
                    "Should I go to bed earlier?",
                    "Yes, you should. / No, you shouldn’t."
                ],
                [
                    "Negative advice",
                    "You shouldn’t eat so much sugar.",
                    "Should we eat less sugar?",
                    "Yes, you should. / No, you shouldn’t."
                ],
            ],
            hint:
                "In conversation, <strong>should</strong> sounds less strong than <strong>must</strong>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["You should see this film."],
                ["Should I call her?"],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>You should to go</em> → ✅ <strong>You should go</strong>",
                "❌ <em>I don’t should</em> → ✅ <strong>I shouldn’t</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Should / shouldn’t)",
        },
    ],
};

export const RULE_PAGE_HAVE_TO_DONT_HAVE_TO = {
    id: "HAVE_TO_DONT_HAVE_TO",
    title: "Have to / don’t have to",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What have to means",
            html:
                "<strong>Have to</strong> expresses an <em>obligation</em>, often because of an external rule. " +
                "<strong>Don’t/doesn’t have to</strong> means <em>there is no need / it is not necessary</em> (but it is allowed).",
        },
        {
            type: "usage",
            title: "When we use have to",
            badges: [
                "📏 Rules/laws: <strong>We have to wear uniforms at school.</strong>",
                "📅 Everyday obligations: <strong>I have to get up early.</strong>",
                "😌 Lack of necessity: <strong>You don’t have to come.</strong>",
            ]
        },
        {
            type: "forms",
            title: "Forms of have to",
            headers: ["Person", "Affirmative", "Negative", "Question"],
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
                "<strong>Don’t/doesn’t have to</strong> ≠ <strong>mustn’t</strong>. It means 'not necessary', not 'forbidden'.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I have to clean my room."],
                ["She has to work on Saturdays."],
                ["You don’t have to pay now."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Confusing <strong>don’t have to</strong> with <strong>mustn’t</strong>.",
                "❌ <em>He don’t has to</em> → ✅ <strong>He doesn’t have to</strong>",
            ],
            note:
                "Remember: <strong>mustn’t</strong> = forbidden, while <strong>don’t have to</strong> = optional / not necessary.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Have to / don’t have to)",
        },
    ],
};

export const RULE_PAGE_MAY_MIGHT = {
    id: "MAY_MIGHT",
    title: "May / might",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What may / might mean",
            html:
                "<strong>May</strong> and <strong>might</strong> express <em>possibility</em> (something is possible or probable). " +
                "In everyday conversation they are often used almost interchangeably.",
        },
        {
            type: "usage",
            title: "When we use may / might",
            badges: [
                "🤔 Uncertain prediction: <strong>It may rain later.</strong>",
                "🔮 Even less certain: <strong>It might rain later.</strong>",
                "🙏 Polite permission (often may): <strong>May I open the window?</strong>",
            ]
        },
        {
            type: "forms",
            title: "Forms with may / might",
            headers: ["Type", "Affirmative / Negative", "Question", "Note"],
            rows: [
                [
                    "Possibility",
                    "She may be at home.",
                    "May she be at home?",
                    "May expresses possibility.",
                ],
                [
                    "Less certain possibility",
                    "He might come later.",
                    "Might he come later?",
                    "Might often suggests weaker certainty.",
                ],
            ],
            hint:
                "<strong>May</strong> and <strong>might</strong> do not change with the subject.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I may go to the party."],
                ["She might be busy now."],
                ["May I use your phone?"],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>He may to come</em> → ✅ <strong>He may come</strong>",
                "❌ <em>She don’t may</em> → ✅ <strong>She may not</strong>",
            ],
            note:
                "We do not use <strong>do/does</strong> with <em>may/might</em>.",
        },
        {
            type: "trainer",
            title: "Mini trainer (May / might)",
        },
    ],
};

export const RULE_PAGE_COMPARATIVES = {
    id: "COMPARATIVES",
    title: "Comparatives (adj + -er / more)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What a comparative is",
            html:
                "<strong>Comparatives</strong> are used when we compare <em>two things</em>: " +
                "<strong>taller, more interesting</strong>, etc.",
        },
        {
            type: "usage",
            title: "When we use comparatives",
            badges: [
                "👫 Comparing two people/things: <strong>My brother is taller than me.</strong>",
                "📚 Longer adjectives: <strong>more interesting, more expensive</strong>",
                "↔️ Use <strong>than</strong> in comparisons: <strong>smaller than</strong>",
            ],
            hint:
                "Short adjectives: <strong>adj + -er</strong> (taller, bigger). Long adjectives: <strong>more + adj</strong> (more beautiful).",
        },
        {
            type: "forms",
            title: "Forming comparatives",
            headers: ["Adjective type", "Form", "Example", "Meaning"],
            rows: [
                [
                    "Short (1 syllable)",
                    "adj + -er",
                    "cheap → cheaper",
                    "comparative form",
                    "",
                ],
                [
                    "Ends with -y",
                    "y → ier",
                    "happy → happier",
                    "comparative form",
                    "",
                ],
                [
                    "Long (2+ syllables)",
                    "more + adj",
                    "more interesting",
                    "comparative form",
                    "",
                ],
                [
                    "Irregular",
                    "good → better",
                    "bad → worse",
                    "irregular forms",
                    "",
                ],
            ],
            hint:
                "Remember to use <strong>than</strong>: <strong>He is taller than me.</strong>",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["This book is shorter than that one."],
                ["Math is more difficult than English."],
                ["He is better at football than me."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>more cheap</em> → ✅ <strong>cheaper</strong>",
                "❌ <em>beautifuler</em> → ✅ <strong>more beautiful</strong>",
            ],
            note: "Check if the adjective is short or long before using -er or more.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Comparatives)",
        },
    ],
};

export const RULE_PAGE_SUPERLATIVES = {
    id: "SUPERLATIVES",
    title: "Superlatives (adj + -est / most)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What a superlative is",
            html:
                "<strong>Superlatives</strong> are used when we talk about the <em>highest degree</em> of something " +
                "among more than two people or things.",
        },
        {
            type: "usage",
            title: "When we use superlatives",
            badges: [
                "🏆 The best / worst: <strong>This is the best day.</strong>",
                "📊 Comparing many things: <strong>He is the tallest in the class.</strong>",
                "📌 Usually with <strong>the</strong>: <strong>the most expensive, the oldest</strong>",
            ],
            hint:
                "Short adjectives: <strong>the adj + -est</strong>. Long adjectives: <strong>the most + adj</strong>.",
        },
        {
            type: "forms",
            title: "Forming superlatives",
            headers: ["Adjective type", "Form", "Example", "Meaning", "Note"],
            rows: [
                [
                    "Short (1 syllable)",
                    "the adj + -est",
                    "cheap → the cheapest",
                    "superlative form",
                    "",
                ],
                [
                    "Ends with -y",
                    "y → iest",
                    "happy → the happiest",
                    "superlative form",
                    "",
                ],
                [
                    "Long (2+ syllables)",
                    "the most + adj",
                    "the most interesting",
                    "superlative form",
                    "",
                ],
                [
                    "Irregular",
                    "good → the best",
                    "bad → the worst",
                    "irregular forms",
                    "",
                ],
            ],
            hint:
                "We usually use <strong>the</strong> before superlatives: <strong>the smallest, the most beautiful</strong>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["This is the longest river in the country."],
                ["Summer is the hottest season."],
                ["He is the most patient teacher."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>the most cheap</em> → ✅ <strong>the cheapest</strong>",
                "❌ <em>beautifulest</em> → ✅ <strong>the most beautiful</strong>",
            ],
            note:
                "Do not combine <strong>more + -er</strong> or <strong>most + -est</strong>.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Superlatives)",
        },
    ],
};

export const RULE_PAGE_ENOUGH_TOO_MUCH_MANY = {
    id: "ENOUGH_TOO_MUCH_MANY",
    title: "Too / enough",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What too / enough mean",
            html:
                "<strong>Too</strong> means <em>more than necessary</em> (often with a negative result). " +
                "<strong>Enough</strong> means <em>sufficient</em> or the right amount.",
        },
        {
            type: "usage",
            title: "When we use too / enough",
            badges: [
                "⚠️ Excess: <strong>This bag is too heavy.</strong>",
                "✅ Sufficient amount: <strong>It’s warm enough.</strong>",
            ]
        },
        {
            type: "forms",
            title: "Word order",
            headers: ["Structure", "Example", "Meaning", "Note", "Another example"],
            rows: [
                [
                    "too + adj / adv",
                    "too big",
                    "excessive degree",
                    "usually negative meaning",
                    "too quickly",
                ],
                [
                    "adj + enough",
                    "warm enough",
                    "sufficient degree",
                    "",
                    "old enough",
                ],
                [
                    "enough + noun",
                    "enough time",
                    "sufficient quantity",
                    "",
                    "enough water",
                ],
            ],
            hint:
                "With verbs we often say: <strong>verb + enough</strong> (sleep enough, eat enough).",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["The coffee is too hot."],
                ["This room isn’t big enough."],
                ["We have enough chairs."]
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em><strong style='color:red'>too enough</strong></em> — this structure does not exist.",
                "❌ <em>This chair is <strong style='color:red'>enough big.</strong></em> → ✅ <strong>big enough</strong>",
                "❌ <em>She spoke English <strong style='color:red'>enough well</strong>.</em> → ✅ <strong>well enough</strong>",
                "❌ <em>This coffee is <strong style='color:red'>enough hot</strong>.</em> → ✅ <strong>hot enough</strong>",
                "❌ <em>We have <strong style='color:red'>money enough</strong>.</em> → ✅ <strong>enough money</strong>",
            ],
            note:
                "Ask yourself: is it 'too much' or 'enough'? Then choose the correct structure.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Too / enough)",
        },
    ],
};

export const RULE_PAGE_ADVERBS_FREQUENCY_OFTEN_NEVER = {
    id: "ADVERBS_FREQUENCY_OFTEN_NEVER",
    title: "Adverbs of frequency (often, never)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What adverbs of frequency are",
            html:
                "<strong>Adverbs of frequency</strong> show <em>how often</em> something happens: " +
                "<strong>always, usually, often, sometimes, rarely, never</strong>.",
        },
        {
            type: "usage",
            title: "Where to place frequency adverbs",
            badges: [
                "👤 Usually before the main verb: <strong>We often play tennis.</strong>",
                "🧱 After the verb <strong>to be</strong>: <strong>She is always late.</strong>",
                "❓ In questions — after the subject: <strong>Do you often read?</strong>",
            ],
            hint:
                "Typical Present Simple order: <strong>subject + adverb + verb</strong>: <em>I usually get up at 7.</em>",
        },
        {
            type: "forms",
            title: "Position in a sentence",
            headers: ["Structure", "Example", "Meaning", "Note", "Another example"],
            rows: [
                [
                    "After to be",
                    "She is never angry.",
                    "frequency placement",
                    "is/am/are + adverb",
                    "They are often busy.",
                ],
                [
                    "Before the main verb",
                    "They usually cook dinner.",
                    "frequency placement",
                    "adverb + verb",
                    "I always walk to school.",
                ],
                [
                    "After an auxiliary verb",
                    "You can always ask me.",
                    "frequency placement",
                    "can/could/will + adverb + verb",
                    "I will never forget this day.",
                ],
            ],
            hint:
                "<strong>Never</strong> already contains a negative meaning, so we do not use <em>don’t/doesn’t</em> with it.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I always have breakfast."],
                ["He usually goes to bed at 11."],
                ["She is never late."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>She always is late</em> → ✅ <strong>She is always late</strong>",
                "❌ <em>I don’t never go</em> → ✅ <strong>I never go</strong>",
            ],
            note:
                "Avoid double negatives: <strong>never</strong> already means 'not ever'.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Adverbs of frequency)",
        },
    ],
};

export const RULE_PAGE_QUANTIFIERS_SOME_ANY_A_LOT_MUCH_MANY = {
    id: "QUANTIFIERS_SOME_ANY_A_LOT_MUCH_MANY",
    title: "Quantifiers (some, any, a lot of, much, many)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Words of quantity",
            html:
                "<strong>Some, any, a lot of, much, many</strong> show <em>how much or how many</em> of something there is. " +
                "They are used with nouns, especially <strong>countable and uncountable</strong> nouns.",
        },
        {
            type: "forms",
            title: "Countable vs uncountable",
            headers: ["Quantifier", "Example", "Meaning"],
            rows: [
                [
                    "some",
                    "some milk / some apples",
                    "an unspecified amount",
                ],
                [
                    "any",
                    "any sugar / any friends",
                    "used mainly in questions and negatives",
                ],
                [
                    "a lot of",
                    "a lot of people / a lot of money",
                    "a large amount or number",
                ],
                [
                    "much",
                    "much time, much water",
                    "a large amount",
                ],
                [
                    "many",
                    "many cars, many ideas",
                    "a large number",
                ],
            ],
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Do you have any questions?"],
                ["We don’t have much time."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>much apples</em> → ✅ <strong>many apples</strong> or <strong>a lot of apples</strong>",
            ],
            note:
                "First decide if the noun is countable or uncountable, then choose <strong>much</strong> or <strong>many</strong>.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Quantifiers)",
        },
    ],
};

export const RULE_PAGE_LIKE_LOVE_HATE_ING = {
    id: "LIKE_LOVE_HATE_ING",
    title: "Like / love / hate + -ing",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Talking about preferences",
            html:
                "After the verbs <strong>like, love, hate, enjoy, prefer</strong> we often use the <strong>V-ing</strong> form " +
                "to talk about general preferences or habits.",
        },
        {
            type: "usage",
            title: "When we use -ing",
            badges: [
                "💚 General preference: <strong>I like reading.</strong>",
                "❤️ Strong liking: <strong>She loves dancing.</strong>",
                "💔 Dislike: <strong>He hates waiting.</strong>",
            ],
            hint:
                "Structure: <strong>like/love/hate + V-ing</strong> or <strong>like/love/hate + noun</strong>.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Structure", "Example", "Meaning"],
            rows: [
                [
                    "like + V-ing",
                    "I like swimming.",
                    "expressing enjoyment of an activity"
                ],
                [
                    "love + V-ing",
                    "She loves singing.",
                    "expressing strong enjoyment"
                ],
                [
                    "hate + V-ing",
                    "He hates getting up early.",
                    "expressing strong dislike"
                ],
            ],
            hint:
                "Common question pattern: <strong>Do you like…?</strong> + <strong>V-ing</strong> or <strong>noun</strong>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I like watching films in English."],
                ["We love travelling."],
                ["He hates doing homework."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I like to reading</em> → ✅ <strong>I like reading</strong>",
                "❌ <em>She loves sing</em> → ✅ <strong>She loves singing</strong>",
            ],
            note:
                "After these verbs we do not use <em>to</em> when the next verb is in the <strong>V-ing</strong> form.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Like / love / hate + -ing)",
        },
    ],
};

export const RULE_PAGE_ZERO_CONDITIONAL = {
    id: "ZERO_CONDITIONAL",
    title: "Zero Conditional",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What the Zero Conditional is",
            html:
                "<strong>Zero Conditional</strong> describes <em>general truths</em>, <em>laws</em>, and <em>routines</em>: things that always happen when a certain condition is true.",
        },
        {
            type: "usage",
            title: "When we use the Zero Conditional",
            badges: [
                "🌍 Laws of nature: <strong>If you heat water, it boils.</strong>",
                "📅 Habits: <strong>If I’m tired, I go to bed early.</strong>",
                "📏 Rules: <strong>If you don’t wear a helmet, you get a fine.</strong>",
            ],
            hint:
                "Structure: <strong>If + Present Simple, Present Simple</strong>. The order can be reversed.",
        },
        {
            type: "forms",
            title: "Zero Conditional structure",
            headers: ["If position", "Structure", "Example", "Note"],
            rows: [
                [
                    "If at the beginning",
                    "If + Present, Present",
                    "If you mix red and blue, you get purple.",
                    "Use a comma after the if-clause.",
                ],
                [
                    "If in the middle",
                    "Present if + Present",
                    "You get purple if you mix red and blue.",
                    "No comma is needed.",
                ],
            ],
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["If it rains, the grass gets wet."],
                ["If I drink coffee at night, I can’t sleep."],
                ["You feel better if you sleep enough."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Using <em>will</em> in either clause → Zero Conditional does not use <strong>will</strong>.",
            ],
            note:
                "The Zero Conditional expresses something that is always true, not a specific future situation.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Zero Conditional)",
        },
    ],
};

export const RULE_PAGE_FIRST_CONDITIONAL = {
    id: "FIRST_CONDITIONAL",
    title: "1st Conditional",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What the First Conditional is",
            html:
                "<strong>First Conditional</strong> describes <em>real</em> or <em>likely</em> situations in the future: " +
                "what will happen if a certain condition is met.",
        },
        {
            type: "usage",
            title: "When we use the 1st Conditional",
            badges: [
                "🔮 Real plans: <strong>If it is sunny, we’ll go to the park.</strong>",
                "⚠️ Warnings: <strong>If you are late, you’ll miss the bus.</strong>",
                "💬 Promises: <strong>If you help me, I’ll help you.</strong>",
            ]
        },
        {
            type: "forms",
            title: "First Conditional structure",
            headers: ["If position", "Structure", "Example", "Meaning", "Note"],
            rows: [
                [
                    "If at the beginning",
                    "If + Present, will + V",
                    "If it rains, we’ll stay at home.",
                    "future result",
                    "Use a comma after the if-clause.",
                ],
                [
                    "If in the middle",
                    "Will + V if + Present",
                    "We’ll stay at home if it rains.",
                    "future result",
                    "No comma is needed.",
                ],
            ],
            hint:
                "Do not use <strong>will</strong> after <strong>if</strong> in this structure.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["If I have time, I’ll call you."],
                ["We won’t go out if it’s cold."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>If it will rain, we’ll stay</em> → ✅ <strong>If it rains, we’ll stay</strong>",
            ],
            note:
                "The if-clause always uses <strong>Present Simple</strong>, even when talking about the future.",
        },
        {
            type: "trainer",
            title: "Mini trainer (First Conditional)",
        },
    ],
};

export const RULE_PAGE_TIME_CLAUSE_FUTURE = {
    id: "TIME_CLAUSE_FUTURE",
    title: "Time clause future",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Future meaning in time clauses",
            html:
                "After words like <strong>when, while, before, after, as soon as, until</strong> in <em>time clauses</em>, we use " +
                "<strong>Present Simple</strong>, even when the meaning refers to the future.",
        },
        {
            type: "forms",
            title: "Structure",
            headers: ["Connector", "Time clause (Present)", "Main clause (Future)", "Example", "Meaning"],
            rows: [
                [
                    "when",
                    "When I finish",
                    "I’ll call you",
                    "When I finish work, I’ll call you.",
                    "future sequence of actions",
                ],
                [
                    "before",
                    "Before you leave",
                    "send me a message",
                    "Before you leave, send me a message.",
                    "action happens earlier",
                ],
                [
                    "after",
                    "After he arrives",
                    "we’ll have dinner",
                    "After he arrives, we’ll have dinner.",
                    "action happens later",
                ],
            ],
            hint:
                "In the time clause we <strong>do not use will</strong>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’ll call you when I get home."],
                ["We’ll start after everyone arrives."],
                ["Before you go to bed, open the window."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>When I will finish, I’ll call you</em> → ✅ <strong>When I finish, I’ll call you</strong>",
            ],
            note:
                "Remember: after <strong>when / before / after / as soon as</strong> we use <strong>Present Simple</strong>, even when talking about the future.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Time clauses – future)",
        },
    ],
};

export const RULE_PAGE_HOW_OFTEN_LONG_MUCH = {
    id: "HOW_OFTEN_LONG_MUCH",
    title: "How often / How long / How much",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What these questions ask about",
            html:
                "These phrases help ask about <strong>frequency</strong> (how often), <strong>duration</strong> (how long), " +
                "or <strong>quantity/price</strong> (how much).",
        },
        {
            type: "usage",
            title: "How to choose the correct “how…” question",
            badges: [
                "📅 Frequency: <strong>How often</strong> → <strong>How often do you travel?</strong>",
                "⏱️ Duration: <strong>How long</strong> → <strong>How long does the meeting last?</strong>",
                "🥛 Quantity (uncountable nouns): <strong>How much</strong> → <strong>How much water do you drink?</strong>",
                "💸 Price: <strong>How much</strong> + <strong>is/are</strong> → <strong>How much is this T-shirt?</strong>",
            ],
            hint:
                "If you ask about countable things (books, apples, cars), use <strong>How many</strong>, not <strong>How much</strong>.",
        },
        {
            type: "forms",
            title: "Question structure",
            headers: ["Type", "Structure", "Example", "Meaning"],
            rows: [
                [
                    "How often",
                    "How often + do/does + S + V?",
                    "How often do you travel?",
                    "asking about frequency",
                ],
                [
                    "How long (duration)",
                    "How long + do/does + S + V?",
                    "How long does the film last?",
                    "asking about duration",
                ],
                [
                    "How long (length)",
                    "How long + is/are + …?",
                    "How long is the bridge?",
                    "asking about length",
                ],
                [
                    "How much (quantity)",
                    "How much + uncountable noun + …?",
                    "How much sugar do you need?",
                    "asking about quantity",
                ],
                [
                    "How much (price)",
                    "How much + is/are + …?",
                    "How much is this T-shirt?",
                    "asking about price",
                ],
            ],
            hint:
                "In <strong>How much is…?</strong> we ask about price. In <strong>How much … do/does …?</strong> we ask about quantity.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["How often do you wash your car?"],
                ["How much is this book?"],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>How much apples?</em> → ✅ <strong>How many apples?</strong>",
            ],
            note:
                "First decide whether the question is about <strong>frequency</strong>, <strong>duration</strong>, or <strong>quantity/price</strong>, then choose the correct <strong>how…</strong> form.",
        },
        {
            type: "trainer",
            title: "Mini trainer (How often / How long / How much)",
        },
    ],
};

export const RULE_PAGE_BECAUSE_SO_BUT_ALTHOUGH = {
    id: "BECAUSE_SO_BUT_ALTHOUGH",
    title: "Because / so / but / although",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Conjunctions for connecting ideas",
            html:
                "<strong>Because</strong> introduces a reason, <strong>so</strong> introduces a result, " +
                "<strong>but</strong> shows contrast, and <strong>although</strong> means 'despite the fact that' " +
                "and introduces a stronger or more formal contrast.",
        },
        {
            type: "usage",
            title: "When to use each conjunction",
            badges: [
                "🤔 Reason: <strong>I stayed at home because I was tired.</strong>",
                "➡️ Result: <strong>I was tired, so I stayed at home.</strong>",
                "⚖️ Contrast: <strong>It’s cold, but it’s sunny.</strong>",
                "🎭 Formal contrast: <strong>Although it was cold, we went out.</strong>",
            ],
        },
        {
            type: "forms",
            title: "Example structures",
            headers: ["Conjunction", "Structure", "Example", "Meaning"],
            rows: [
                [
                    "because",
                    "Clause + because + reason",
                    "I went to bed early because I was tired.",
                    "reason for the action",
                ],
                [
                    "so",
                    "Clause, so + result",
                    "I was tired, so I went to bed early.",
                    "result of the situation",
                ],
                [
                    "but",
                    "Clause + but + clause",
                    "It’s cold but sunny.",
                    "contrast between ideas",
                ],
                [
                    "although",
                    "Although + clause, clause",
                    "Although it was cold, we went out.",
                    "contrast despite the condition",
                ],
            ],
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["It was raining, so we stayed at home."],
                ["Although he was tired, he finished the project."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Mixing up <strong>because</strong> and <strong>so</strong> in the sentence structure.",
                "❌ <em>Although but…</em> — do not combine these two conjunctions together.",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Because / so / but / although)",
        },
    ],
};

export const RULE_PAGE_BEFORE_AFTER_ING = {
    id: "BEFORE_AFTER_ING",
    title: "Before / after + -ing",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Events before and after",
            html:
                "<strong>Before</strong> and <strong>after</strong> show the order of events. " +
                "After them we can use either a <strong>full clause</strong> or a shorter form with <strong>V-ing</strong>.",
        },
        {
            type: "usage",
            title: "When to use -ing or a full clause",
            badges: [
                "✅ If the <strong>same subject</strong> performs both actions → we can use <strong>before/after + V-ing</strong>.",
                "✅ If the <strong>subjects are different</strong> → use a <strong>full clause</strong> (before/after + S + V).",
                "🧠 Test: can the same person perform both actions? If yes, the V-ing form works.",
            ],
            hint:
                "<strong>Before/after + V-ing</strong> usually implies the same subject performing both actions.",
        },
        {
            type: "forms",
            title: "Structures with before / after",
            headers: ["Type", "Structure", "Example", "Note"],
            rows: [
                [
                    "Full clause (same or different subject)",
                    "Before + S + V, ...",
                    "Before I go out, I check the weather.",
                    "Works in all cases.",
                ],
                [
                    "Short form (same subject)",
                    "Before + V-ing, ...",
                    "Before going out, I check the weather.",
                    "Same subject performs both actions.",
                ],
                [
                    "Full clause (same or different subject)",
                    "After + S + V, ...",
                    "After we finished, we went home.",
                    "Works in all cases.",
                ],
                [
                    "Short form (same subject)",
                    "After + V-ing, ...",
                    "After finishing, we went home.",
                    "Same subject performs both actions.",
                ],
            ],
            hint:
                "If the subjects are different, do not shorten the clause: " +
                "✅ <strong>Before he arrives, I’ll…</strong> (not <em>Before arriving…</em>).",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Before going to bed, I brush my teeth."],
                ["After having breakfast, she goes to work."],
                ["Before you start, read the instructions."],
                ["After he arrives, we’ll start."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Before go to bed</em> → ✅ <strong>Before going to bed</strong> or <strong>Before I go to bed</strong>",
                "❌ <em>After eat, we left</em> → ✅ <strong>After eating, we left</strong> or <strong>After we ate, we left</strong>",
                "❌ <em>Before arriving, I’ll call him</em> (unclear subject) → ✅ <strong>Before he arrives, I’ll call him</strong>",
            ],
            note:
                "After <strong>before/after</strong> use either <strong>V-ing</strong> or a <strong>full clause with a subject</strong>. " +
                "Use V-ing only when the subject is clearly the same.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Before / after + -ing)",
        },
    ],
};

export const RULE_PAGE_BE_GOOD_AT_INTERESTED_IN_ING = {
    id: "BE_GOOD_AT_INTERESTED_IN_ING",
    title: "Be good at / interested in + -ing",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Adjective + preposition phrases",
            html:
                "After expressions like <strong>be good at</strong>, <strong>be bad at</strong>, and <strong>be interested in</strong>, " +
                "we often use the <strong>V-ing</strong> form to talk about abilities or interests.",
        },
        {
            type: "usage",
            title: "Structure",
            badges: [
                "🎯 Ability: <strong>She is good at drawing.</strong>",
                "🔧 Difficulty: <strong>He is bad at cooking.</strong>",
                "✨ Interest: <strong>They are interested in learning English.</strong>",
            ],
            hint:
                "Remember to use <strong>am/is/are</strong> before the adjective: <em>I’m good at…</em>",
        },
        {
            type: "forms",
            title: "Forms with be good at / interested in",
            headers: ["Structure", "Example", "Meaning", "Another example"],
            rows: [
                [
                    "be good at + V-ing",
                    "I’m good at singing.",
                    "expressing ability",
                    "She’s good at using computers.",
                ],
                [
                    "be bad at + V-ing",
                    "He’s bad at drawing.",
                    "expressing difficulty",
                    "I’m bad at remembering names.",
                ],
                [
                    "be interested in + V-ing",
                    "We’re interested in travelling.",
                    "expressing interest",
                    "She’s interested in learning Spanish.",
                ],
            ],
            hint:
                "In questions the verb <strong>to be</strong> changes position: <strong>Are you good at…?</strong>",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’m good at solving puzzles."],
                ["She’s interested in studying biology."]
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I good at sing</em> → ✅ <strong>I’m good at singing</strong>",
                "❌ <em>interested of English</em> → ✅ <strong>interested in English</strong>",
            ]
        },
        {
            type: "trainer",
            title: "Mini trainer (Be good at / interested in + -ing)",
        },
    ],
};

export const RULE_PAGE_MAKE_DO_DIFFERENCE = {
    id: "MAKE_DO_DIFFERENCE",
    title: "Make / do / take (difference)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Basic idea",
            html:
                "<strong>Do</strong> = perform an action or work. " +
                "<strong>Make</strong> = create a result or cause something to happen.",
        },
        {
            type: "usage",
            title: "How to choose quickly",
            badges: [
                "✅ If it is a <strong>task / job / routine</strong> → <strong>do</strong> (homework, chores, work).",
                "✅ If it is a <strong>result</strong> (something created) → <strong>make</strong> (a cake, a plan, a decision).",
                "✅ If it is an <strong>effect / impact</strong> → <strong>make</strong>: <strong>make a difference</strong>.",
            ],
            hint:
                "Do not translate the idea of “робити” literally. Think: <em>perform</em> (do) or <em>create / cause</em> (make).",
        },
        {
            type: "forms",
            title: "Most common collocations",
            headers: ["Do (perform)", "Make (create/cause)", "Comment"],
            rows: [
                [
                    "do homework / do the dishes / do the shopping",
                    "make a cake / make a plan / make a decision",
                    "Routine vs result",
                ],
                [
                    "do a job / do some work / do exercise",
                    "make a mistake / make money / make a call",
                    "Common fixed phrases",
                ],
                [
                    "—",
                    "make a difference",
                    "Used when talking about impact",
                ],
            ],
            hint:
                "These are <strong>collocations</strong> — it is best to learn them as fixed word pairs.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I always do my homework in the evening."],
                ["We did the shopping yesterday."],
                ["Don’t make the same mistake again."],
                ["Even small actions can make a difference."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>make homework</em> → ✅ <strong>do homework</strong>",
                "❌ <em>do a mistake</em> → ✅ <strong>make a mistake</strong>",
                "❌ <em>do a difference</em> → ✅ <strong>make a difference</strong>",
            ],
            note:
                "If you see nouns like <em>mistake / decision / plan / difference</em>, they usually go with <strong>make</strong>.",
        },
        {
            type: "trainer",
            title: "Mini trainer (Make / do)",
        },
    ],
};

/* ============================
   B1 — PRESENT PERFECT
============================ */
export const RULE_PAGE_PRESENT_PERFECT = {
    id: "PRESENT_PERFECT",
    title: "Present Perfect (have + V3)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What Present Perfect means",
            html:
                "<strong>Present Perfect</strong> describes experiences, actions with a result in the present, or actions that have just finished."
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "📌 Experience: <strong>I’ve been to Italy.</strong>",
                "🎯 Result now: <strong>She has lost her keys.</strong>",
                "🕒 Recently finished: <strong>We’ve just finished.</strong>",
                "📅 Actions up to now: <strong>They’ve lived here for years.</strong>"
            ],
            hint:
                "We don’t say <em>I have done/finished/watched something yesterday</em>."
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Form", "Positive", "Negative", "Question"],
            rows: [
                ["I / You / We / They", "have worked", "haven’t worked", "Have they worked?"],
                ["He / She / It", "has worked", "hasn’t worked", "Has he worked?"]
            ],
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’ve already eaten."],
                ["She hasn’t called yet."],
                ["Have you ever tried sushi?"]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Using it with a specific past time (<em>yesterday, last year</em>)."
            ],
            note:
                "Do not use Present Perfect with specific past time markers."
        },
        {
            type: "trainer",
            title: "Mini trainer (Present Perfect)"
        }
    ]
};


/* ============================
   SINCE / FOR
============================ */
export const RULE_PAGE_SINCE_FOR = {
    id: "SINCE_FOR",
    title: "Since / For",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What since and for mean",
            html:
                "<strong>Since</strong> shows the <em>starting point in time</em> (when something began).<br/>" +
                "<strong>For</strong> shows the <em>duration</em> (how long something lasts).",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "📍 Starting point → <strong>since 2010 / since Monday / since I was a child</strong>",
                "⏳ Period of time → <strong>for two years / for a long time / for three hours</strong>",
                "🕒 Often used with <strong>Present Perfect</strong>: <strong>I’ve lived here since 2015.</strong>",
            ],
            hint:
                "Ask yourself: <em>when did it start?</em> → <strong>since</strong>; " +
                "<em>how long?</em> → <strong>for</strong>.",
        },
        {
            type: "forms",
            title: "Typical structures",
            headers: ["Structure", "Example", "Explanation"],
            rows: [
                [
                    "Present Perfect + since + starting point",
                    "She has worked here since 2018.",
                    "Starting point in time.",
                ],
                [
                    "Present Perfect + for + duration",
                    "They have lived here for five years.",
                    "Length of time.",
                ],
            ],
            hint:
                "<strong>Since</strong> is not used with periods of time, " +
                "and <strong>for</strong> is not used with specific dates.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["We’ve lived here since 2015."],
                ["I’ve known her for years."],
                ["He has been tired since the morning."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I live here since 2015.</em> → missing Perfect → ✅ <strong>I have lived here since 2015.</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Since / For)",
        },
    ],
};

/* ============================
   PRESENT PERFECT CONTINUOUS
============================ */
export const RULE_PAGE_PRESENT_PERFECT_CONT = {
    id: "PRESENT_PERFECT_CONT",
    title: "Present Perfect Continuous",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What Present Perfect Continuous means",
            html:
                "<strong>Present Perfect Continuous</strong> describes an <em>action that started in the past</em> " +
                "and <em>continues until now</em> or <em>has just finished</em>, " +
                "but its result or effect is still visible.",
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "⏳ Duration of an action → <strong>I’ve been studying for three hours.</strong>",
                "😓 Recent action with visible result → <strong>She’s been crying.</strong>",
                "🏃 Process (focus on the action, not the result) → <strong>They’ve been working all day.</strong>",
            ],
            hint:
                "The focus is on the <em>process</em> or <em>duration</em> of the action, not only the result.",
        },
        {
            type: "forms",
            title: "Form of the tense",
            headers: ["Type", "Structure", "Example"],
            rows: [
                [
                    "Positive",
                    "have / has + been + V-ing",
                    "I have been working all day.",
                ],
                [
                    "Negative",
                    "have / has + not + been + V-ing",
                    "She hasn’t been sleeping well.",
                ],
                [
                    "Question",
                    "Have / Has + subject + been + V-ing?",
                    "Have you been waiting long?",
                ],
            ],
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’ve been waiting for you."],
                ["She has been studying since morning."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I am working here for 5 years</em> → ✅ <strong>I have been working here for 5 years</strong>",
                "❌ Using it with <em>stative verbs</em> (know, like, love) → ✅ <strong>I’ve known her for years</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Present Perfect Continuous)",
        },
    ],
};

/* ============================
   ALREADY / YET / JUST
============================ */
export const RULE_PAGE_ALREADY_YET_JUST = {
    id: "ALREADY_YET_JUST",
    title: "Already / Yet / Just",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What already / yet / just mean",
            html: [
                "<strong>Already</strong> — mostly used in positive sentences",
                "<strong> Yet</strong> — used in questions and negatives",
                "<strong> Just</strong> — means “a very short time ago”",
            ],
        },
        {
            type: "forms",
            title: "Position in the sentence",
            headers: ["Word", "Position", "Example"],
            rows: [
                ["already", "have/has + already + V3", "I have already finished."],
                ["just", "have/has + just + V3", "She has just arrived."],
                ["yet", "usually at the end (questions/negatives)", "Have you finished yet? / I haven’t finished yet."],
            ],
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’ve already finished."],
                ["We haven’t decided yet."],
                ["She’s just left."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Did you finish yet?</em> → ✅ <strong>Have you finished yet?</strong> (when the result matters)",
                "❌ <em>I just have finished</em> → ✅ <strong>I’ve just finished</strong>",
                "❌ <em>I haven’t already done it.</em> → ✅ <strong>I haven’t done it yet.</strong>",
                "❌ <em>She has left just.</em> → ✅ <strong>She has just left.</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Already / Yet / Just)",
        },
    ],
};

/* ============================
   PAST PERFECT
============================ */
export const RULE_PAGE_PAST_PERFECT = {
    id: "PAST_PERFECT",
    title: "Past Perfect",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What Past Perfect means",
            html:
                "<strong>Past Perfect</strong> is used to show that one action " +
                "happened <em>before another action in the past</em>. " +
                "It is often called the tense of the «past before the past».",
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "⏱️ An action that happened before another past action: <strong>She had left before I arrived.</strong>",
                "📚 Cause or background: <strong>I was tired because I had worked all day.</strong>",
                "📖 In stories when it is important to show the order of past events.",
            ],
        },
        {
            type: "forms",
            title: "Form of the tense",
            headers: ["Type", "Structure", "Example"],
            rows: [
                [
                    "Positive",
                    "had + V3",
                    "They had finished the project.",
                ],
                [
                    "Negative",
                    "had not (hadn’t) + V3",
                    "She hadn’t seen him before.",
                ],
                [
                    "Question",
                    "Had + subject + V3?",
                    "Had you met her before?",
                ],
            ],
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["They had finished the project before Monday."],
                ["By the time we arrived, the movie had started."],
                ["I realized I had left my phone at home."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Incorrect verb form: <em>had went</em> → ✅ had + V3: <strong>had gone</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Past Perfect)",
        },
    ],
};

/* ============================
   USED TO
============================ */
export const RULE_PAGE_USED_TO = {
    id: "USED_TO",
    title: "Used to + V",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What “used to” means",
            html:
                "<strong>Used to</strong> is used to talk about <em>habits or states in the past</em> " +
                "that <em>are no longer true now</em>.",
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "🧒 Past habits (that stopped): <strong>I used to play outside every day.</strong>",
                "🏠 Past states: <strong>We used to live in Kyiv.</strong>",
                "🚬 Contrast between past and present: <strong>I used to smoke, but I don’t anymore.</strong>",
            ],
            hint:
                "If you can mentally add <em>“but not anymore”</em>, " +
                "it’s a good candidate for <strong>used to</strong>.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Type", "Structure", "Example"],
            rows: [
                [
                    "Affirmative",
                    "used to + V1",
                    "I used to work at night.",
                ],
                [
                    "Negative",
                    "did not (didn’t) + use to + V1",
                    "I didn’t use to like coffee.",
                ],
                [
                    "Question",
                    "Did + subject + use to + V1?",
                    "Did you use to live here?",
                ],
            ],
            hint:
                "In negatives and questions we write <strong>use</strong> without <em>-d</em>, " +
                "because <strong>did</strong> already shows the past tense.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I used to have long hair."],
                ["Did you use to play football?"],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>didn’t used to</em> → ✅ <strong>didn’t use to</strong>",
                "❌ Confusing it with <em>be used to</em> → ✅ <strong>I am used to waking up early.</strong> (this means “I am accustomed to it”).",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Used to)",
        },
    ],
};

/* ============================
   BE USED TO / GET USED TO
============================ */
export const RULE_PAGE_BE_USED_TO_GET_USED_TO = {
    id: "BE_USED_TO_GET_USED_TO",
    title: "Be used to / Get used to",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What “be used to” and “get used to” mean",
            html:
                "<strong>Be used to</strong> means <em>to be accustomed to something</em> (a state).<br/>" +
                "<strong>Get used to</strong> means <em>the process of becoming accustomed</em> to something (a change of state).",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "🟢 State (“already accustomed”) → <strong>I’m used to cold weather.</strong>",
                "🔄 Process (“becoming accustomed”) → <strong>She’s getting used to her new job.</strong>",
                "🕒 They can be used in different tenses: <strong>I was used to… / I will get used to…</strong>",
            ],
            hint:
                "The word <strong>to</strong> here is a <em>preposition</em>, " +
                "so it is followed by a <strong>noun</strong> or <strong>V-ing</strong>.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Construction", "Structure", "Example"],
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
                "<strong>Be used to</strong> is different from <strong>used to + V</strong> (past habit).",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I’m used to waking up early."],
                ["He got used to driving on the left."],
                ["You’ll get used to it."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I’m used to eat early.</em> → ✅ <strong>I’m used to eating early.</strong>",
                "❌ <em>I used to waking up early.</em> → ✅ <strong>I used to wake up early.</strong>"
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Be used to / Get used to)",
        },
    ],
};

/* ============================
   SECOND CONDITIONAL
============================ */
export const RULE_PAGE_SECOND_CONDITIONAL = {
    id: "SECOND_CONDITIONAL",
    title: "If + Past, would + V (2nd Conditional)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What the Second Conditional is",
            html:
                "<strong>Second Conditional</strong> is used for <em>unreal</em>, <em>imaginary</em>, or <em>unlikely</em> situations " +
                "in the <strong>present</strong> or <strong>future</strong>.",
        },
        {
            type: "usage",
            title: "When to use the 2nd Conditional",
            badges: [
                "💭 Imaginary situation: <strong>If I had more time, I would travel.</strong>",
                "🎯 Advice / hypothetical situation: <strong>If I were you, I’d talk to her.</strong>",
                "🎲 Unlikely situation: <strong>If I won the lottery, I’d buy a house.</strong>",
            ],
        },
        {
            type: "forms",
            title: "Structure of the Second Conditional",
            headers: ["Position of if", "Structure", "Example","Note"],
            rows: [
                [
                    "If at the beginning",
                    "If + Past Simple, would + V",
                    "If I knew her number, I’d call her.",
                    "Comma after the if-clause.",
                ],
                [
                    "If in the middle",
                    "Would + V if + Past Simple",
                    "I’d call her if I knew her number.",
                    "No comma.",
                ],
            ],
            hint:
                "We do not use <em>would</em> after <strong>if</strong>.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                [
                    "If I were rich, I’d travel around the world."
                ],
                [
                    "Would you help me if I asked?"
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>If I will have time…</em> → ✅ <strong>If I had time…</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Second Conditional)",
        },
    ],
};


/* ============================
   THIRD CONDITIONAL
============================ */
export const RULE_PAGE_THIRD_CONDITIONAL = {
    id: "THIRD_CONDITIONAL",
    title: "If + Past Perfect, would have + V3 (3rd Conditional)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What the Third Conditional is",
            html:
                "<strong>Third Conditional</strong> is used to talk about the <em>past</em> that <strong>cannot be changed</strong>.</em>",
        },
        {
            type: "usage",
            title: "When to use the 3rd Conditional",
            badges: [
                "😔 Regret: <strong>If I had known, I would have helped.</strong>",
                "🔍 Analyzing a mistake: <strong>If we had left earlier, we wouldn’t have missed the bus.</strong>",
                "🎯 Imagining an alternative outcome: <strong>If she had studied, she would have passed the exam.</strong>",
            ],
            hint:
                "Simple idea: <strong>a past condition</strong> → <strong>a different past result</strong> (but it is already too late to change it).",
        },
        {
            type: "forms",
            title: "Structure of the Third Conditional",
            headers: ["Structure", "Example", "Note"],
            rows: [
                [
                    "If + Past Perfect, would have + V3",
                    "If I had studied, I would have passed.",
                    "Comma after the if-clause.",
                ],
                [
                    "Would have + V3 if + Past Perfect",
                    "I would have passed if I had studied.",
                    "No comma.",
                ],
            ],
            hint:
                "We do not use <em>would</em> in the if-clause: ✅ <strong>If I had…</strong> (not <em>If I would have…</em>).",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                [
                    "If I had known about the meeting, I would have come."
                ],
                [
                    "She wouldn’t have been late if she had taken a taxi."
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>If I would have known…</em> → ✅ <strong>If I had known…</strong>",
                "❌ <em>would had</em> → ✅ <strong>would have</strong>",
                "❌ Confusing it with the 2nd Conditional (imaginary present/future) → ✅ 3rd Conditional = <strong>regret about the past</strong>",
            ],
            note:
                "Quick check: if the situation is about the past and cannot be changed anymore, it is almost always the <strong>Third Conditional</strong>.",
        },
        {
            type: "trainer",
            title: "Mini trainer (3rd Conditional)",
        },
    ],
};

/* ============================
   WISH + PAST / PAST PERFECT
============================ */
export const RULE_PAGE_WISH_PAST_PAST_PERFECT = {
    id: "WISH_PAST_PAST_PERFECT",
    title: "Wish + Past / Past Perfect",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What the wish construction means",
            html:
                "<strong>Wish + Past Simple</strong> is used to express <em>regret or an unreal situation in the present</em>.<br/>" +
                "<strong>Wish + Past Perfect</strong> is used to express <em>regret about the past</em> (something that cannot be changed anymore).",
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "😔 Regret about the present → <strong>I wish I knew the answer.</strong>",
                "⏳ Regret about the past → <strong>I wish I had studied more.</strong>",
                "⚠️ Often used with emotions: regret, disappointment, sadness.",
            ],
            hint:
                "<strong>Wish</strong> does not describe reality — after it we use past forms, " +
                "even when we talk about the present.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Type of regret", "Structure", "Example"],
            rows: [
                [
                    "Present",
                    "wish + Past Simple",
                    "I wish I knew what to do.",
                ],
                [
                    "Present (to be)",
                    "wish + were",
                    "I wish I were taller.",
                ],
                [
                    "Past",
                    "wish + had + V3",
                    "She wishes she had told him the truth.",
                ],
            ],
            hint:
                "In formal and neutral English, <strong>were</strong> is often used after <strong>wish</strong> for all persons.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["I wish I had studied harder."],
                ["He wishes he hadn’t said that."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I wish I would know.</em> → ✅ <strong>I wish I knew.</strong>",
                "❌ <em>I wish I will go there.</em> → ✅ <strong>I wish I could go there.</strong>",
                "❌ <em>I wish I didn’t say that yesterday.</em> → for past regret → ✅ <strong>I wish I hadn’t said that.</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Wish + Past / Past Perfect)",
        },
    ],
};
/* ============================
   MODAL PERFECTS (should have / could have)
============================ */
export const RULE_PAGE_MODAL_PERFECTS = {
    id: "MODAL_PERFECTS",
    title: "Modal perfects (should have / could have)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What modal perfects mean",
            html:
                "<strong>Modal perfects</strong> are modal verbs combined with <em>have + V3</em>. " +
                "They are used to talk about <em>past events that did not happen or are evaluated after the fact</em>.<br/>" +
                "<strong>Should have</strong> = something that was the right thing to do, but did not happen.<br/>" +
                "<strong>Could have</strong> = something that was possible in the past, but did not happen.",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "🧭 Advice or regret about the past → <strong>You should have told me.</strong>",
                "🎯 Missed opportunity → <strong>He could have won.</strong>",
                "⚠️ Criticism after the fact → <strong>They should have known better.</strong>",
            ],
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Modal", "Structure", "Example"],
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
                "<strong>Have</strong> is always in the base form.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Confusing present modals with modal perfects: <em>You should go</em> ≠ <strong>You should have gone</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Modal Perfects)",
        },
    ],
};

/* ============================
   GERUND VS INFINITIVE
============================ */
export const RULE_PAGE_GERUND_VS_INFINITIVE = {
    id: "GERUND_VS_INFINITIVE",
    title: "Gerund vs Infinitive",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What gerund and infinitive are",
            html:
                "<strong>Gerund</strong> is the verb form with <em>-ing</em> (<strong>V-ing</strong>) " +
                "that functions like a noun.<br/>" +
                "<strong>Infinitive</strong> is the form <strong>to + V</strong>, often used to express purpose, intention, or a decision.",
        },
        {
            type: "usage",
            title: "When to use each form",
            badges: [
                "🟢 After some verbs — <strong>V-ing</strong>: <strong>enjoy, mind, finish, suggest, avoid</strong>",
                "🔵 After other verbs — <strong>to + V</strong>: <strong>want, need, decide, plan, hope</strong>",
                "⚠️ With some verbs the form changes the meaning: <strong>stop / remember / try</strong>",
            ],
        },
        {
            type: "forms",
            title: "Common patterns",
            headers: ["Type", "Structure", "Example"],
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
                    "Different meaning",
                    "stop / remember / try + V-ing / to + V",
                    "He stopped smoking / He stopped to smoke.",
                ],
            ],
        },

        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>He suggested to go.</em> → ✅ <strong>He suggested going.</strong>",
                "❌ <em>She enjoys to read.</em> → ✅ <strong>She enjoys reading.</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Gerund vs Infinitive)",
        },
    ],
};

/* ============================
   PASSIVE VOICE (all tenses)
============================ */
export const RULE_PAGE_PASSIVE_VOICE_ALL_TENSES = {
    id: "PASSIVE_VOICE_ALL_TENSES",
    title: "Passive Voice",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What Passive Voice means",
            html:
                "<strong>Passive Voice</strong> is used when the <em>action</em> or its <em>result</em> is more important " +
                "than the person who performs it. The subject <em>receives</em> the action.",
        },
        {
            type: "forms",
            title: "Forms in different tenses",
            headers: ["Tense", "Structure", "Example"],
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
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Incorrect form of <em>be</em> → the tense does not match.",
                "❌ <em>is build</em> → ✅ <strong>is built</strong> (V3 is required)."
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Passive Voice)",
        },
    ],
};


/* ============================
   GET + PAST PARTICIPLE
============================ */
export const RULE_PAGE_GET_PAST_PARTICIPLE = {
    id: "GET_PAST_PARTICIPLE",
    title: "Get + past participle",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What the construction get + V3 means",
            html:
                "<strong>Get + past participle (V3)</strong> is used to show that someone <em>becomes</em> " +
                "or <em>ends up in a certain state</em>. " +
                "It often has an <em>informal</em> or <em>conversational</em> tone.",
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "🔄 Change of state: <strong>get married / get lost / get dressed</strong>",
                "⚠️ Often an unexpected or unwanted result: <strong>get hurt / get fired</strong>",
                "🗣️ Informal alternative to the passive: <strong>She got hired.</strong>",
            ],
            hint:
                "Unlike the classic passive (<em>be + V3</em>), " +
                "<strong>get + V3</strong> sounds less formal and more dynamic.",
        },
        {
            type: "forms",
            title: "Form",
            headers: ["Structure", "Example", "Explanation"],
            rows: [
                [
                    "get + V3",
                    "He got injured.",
                    "Shows the resulting state.",
                ],
                [
                    "get + V3 (in different tenses)",
                    "She is getting promoted.",
                    "The verb get changes depending on the tense.",
                ],
            ],
            hint:
                "<strong>Get</strong> can appear in different tenses: " +
                "<em>get / gets / got / is getting / has got</em>, etc.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Confusing it with the classic passive → <em>get + V3</em> ≠ <em>be + V3</em> (different style).",
                "❌ <em>get married with</em> → ✅ <strong>get married to</strong>",
                "❌ Using it in very formal writing → it is better to use <strong>be + V3</strong>.",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Get + past participle)",
        },
    ],
};

/* ============================
   REPORTED SPEECH
============================ */
export const RULE_PAGE_REPORTED_SPEECH = {
    id: "REPORTED_SPEECH",
    title: "Reported speech",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What reported speech is",
            html:
                "<strong>Reported speech</strong> (indirect speech) is used " +
                "when we <em>report what someone said</em> without quoting their exact words.",
        },
        {
            type: "usage",
            title: "Basic rules",
            badges: [
                "⏪ Backshift of tenses: <em>am → was, did → had done</em>",
                "🕒 Change of time and place words (now → then, today → that day)",
            ],
            hint:
                "Example: <em>“I am tired.”</em> → <strong>He said he was tired.</strong>",
        },
        {
            type: "forms",
            title: "Typical changes",
            headers: ["Direct speech", "Reported speech", "Comment"],
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
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["She said she was busy."],
                ["He told me he had finished."],
                ["I told her I didn’t know."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ No tense shift → <em>He said he is tired</em> → ✅ <strong>he was tired</strong>",
                "❌ Pronouns not changed → <em>She said I was late</em> (when it should be <em>he / she</em>)"
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Reported Speech)",
        },
    ],
};

/* ============================
   QUESTION TAGS
============================ */
export const RULE_PAGE_QUESTION_TAGS = {
    id: "QUESTION_TAGS",
    title: "Question tags",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What question tags are",
            html:
                "<strong>Question tags</strong> are short questions added to the end of a sentence " +
                "to <em>confirm, check, or clarify information</em>.",
        },
        {
            type: "usage",
            title: "Basic rule",
            badges: [
                "➕ Positive statement → ❓ negative tag: <strong>You’re tired, aren’t you?</strong>",
                "➖ Negative statement → ❓ positive tag: <strong>You aren’t tired, are you?</strong>",
                "🧩 The auxiliary verb in the tag depends on the tense and structure of the sentence",
            ],
        },
        {
            type: "forms",
            title: "Common patterns",
            headers: ["Sentence tense", "Question tag", "Example"],
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
                    "will / can / should, etc.",
                    "You can drive, can’t you?",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Incorrect auxiliary verb → <em>You like it, do you?</em> → ✅ <strong>don’t you</strong>",
                "❌ Incorrect pronoun → <em>Anna is here, isn’t Anna?</em> → ✅ <strong>isn’t she</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Question tags)",
        },
    ],
};
/* ============================
   TOO / ENOUGH / SO / SUCH
============================ */
export const RULE_PAGE_TOO_ENOUGH_SO_SUCH = {
    id: "TOO_ENOUGH_SO_SUCH",
    title: "Too / enough / so / such",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What these words mean",
            html:
                "<strong>Too</strong> expresses <em>excess</em> (more than necessary, often with a negative result).<br/>" +
                "<strong>Enough</strong> expresses a <em>sufficient amount or degree</em>.<br/>" +
                "<strong>So / such</strong> are used for <em>emphasis</em> (“very / this kind of”).",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "⚠️ Excess → <strong>too + adjective / adverb</strong>: <strong>too expensive</strong>",
                "✅ Sufficiency → <strong>adjective + enough</strong>: <strong>old enough</strong>",
                "📏 Quantity → <strong>too much / too many</strong>",
                "🔥 Emphasis → <strong>so + adjective</strong>, <strong>such + (adjective) + noun</strong>",
            ],
            hint:
                "If the meaning is “a problem / excessive” → <strong>too</strong>. " +
                "If it means “sufficient” → <strong>enough</strong>. " +
                "If it shows intensity → <strong>so / such</strong>.",
        },
        {
            type: "forms",
            title: "Common structures",
            headers: ["Construction", "Example", "Explanation"],
            rows: [
                [
                    "too + adj / adv",
                    "It’s too late.",
                    "Indicates excess (a problem).",
                ],
                [
                    "adj / adv + enough",
                    "He isn’t tall enough.",
                    "Indicates insufficient degree.",
                ],
                [
                    "too much / too many",
                    "Too much work / too many people.",
                    "Much with uncountable nouns, many with countable nouns.",
                ],
                [
                    "so + adjective",
                    "She is so tired.",
                    "Emphasizes an adjective.",
                ],
                [
                    "such + (adj) + noun",
                    "It’s such a good idea.",
                    "Emphasizes a noun phrase.",
                ],
            ],
            hint:
                "<strong>Enough</strong> comes <em>after</em> the adjective, " +
                "while <strong>too</strong> and <strong>so</strong> come <em>before</em> it.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>enough big</em> → ✅ <strong>big enough</strong>",
                "❌ <em>too many money</em> → ✅ <strong>too much money</strong>",
                "❌ <em>so a good idea</em> → ✅ <strong>such a good idea</strong>",
                "❌ Confusing meanings: <em>too</em> (negative excess) ≠ <em>very</em> (neutral emphasis)",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Too / enough / so / such)",
        },
    ],
};

/* ============================
   RELATIVE CLAUSES
============================ */
export const RULE_PAGE_RELATIVE_CLAUSES = {
    id: "RELATIVE_CLAUSES",
    title: "Relative clauses (who, which, that)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What relative clauses are",
            html:
                "<strong>Relative clauses</strong> are subordinate clauses that <em>describe or give more information about</em> " +
                "people, things, or places.",
        },
        {
            type: "forms",
            title: "Basic structure",
            headers: ["Type", "Structure", "Example"],
            rows: [
                [
                    "For people",
                    "noun + who / that + verb",
                    "She is the teacher who helped me.",
                ],
                [
                    "For things",
                    "noun + which / that + verb",
                    "This is the phone that I lost.",
                ],
                [
                    "Can be omitted",
                    "noun + (that / who / which) + subject + verb",
                    "The book I’m reading is interesting.",
                ],
            ],
            hint:
                "If <strong>who / which / that</strong> is the <em>subject</em> of the relative clause, " +
                "it <strong>cannot</strong> be omitted.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Omitting <em>who / which</em> when it is the subject → <em>The man helped us</em>",
                "❌ Using <em>which</em> for people → ✅ <strong>who</strong>",
                "❌ Relative clause placed far from the noun → unclear what it describes",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Relative Clauses)",
        },
    ],
};

/* ============================
   REFLEXIVE PRONOUNS
============================ */
export const RULE_PAGE_REFLEXIVE_PRONOUNS = {
    id: "REFLEXIVE_PRONOUNS",
    title: "Reflexive pronouns (myself, yourself)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What reflexive pronouns mean",
            html:
                "<strong>Reflexive pronouns</strong> are used when <em>the action returns to the same person who performs it</em>. " +
                "In other words, the subject and the object of the action are the same person.",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "🔁 The action is directed at oneself: <strong>He hurt himself.</strong>",
                "🧍‍♂️ After certain verbs (hurt, blame, introduce, enjoy)",
                "⚠️ For emphasis (“on one’s own”): <strong>I did it myself.</strong>",
            ],
        },
        {
            type: "forms",
            title: "Pronoun forms",
            headers: ["Person", "Pronoun", "Example"],
            rows: [
                ["I", "myself", "I taught myself English."],
                ["you (singular)", "yourself", "Take care of yourself."],
                ["he / she / it", "himself / herself / itself", "She hurt herself."],
                ["we", "ourselves", "We prepared ourselves."],
                ["you (plural)", "yourselves", "Help yourselves."],
                ["they", "themselves", "They introduced themselves."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Unnecessary reflexive pronoun → <em>I washed myself my hands.</em> → ✅ <strong>I washed my hands.</strong>",
                "❌ Confusing reflexive and personal pronouns → <em>She blamed her.</em> (someone else, not herself)",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Reflexive Pronouns)",
        },
    ],
};

/* ============================
   ADVERBS OF MANNER
============================ */
export const RULE_PAGE_ADVERBS_OF_MANNER = {
    id: "ADVERBS_OF_MANNER",
    title: "Adverbs of manner",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What adverbs of manner are",
            html:
                "<strong>Adverbs of manner</strong> describe <em>how</em> an action is performed. " +
                "They answer the question <em>“How?”</em>.",
        },
        {
            type: "usage",
            title: "When and how we use them",
            badges: [
                "🧩 Often formed from adjectives: <strong>quick → quickly</strong>",
                "⚠️ Some words do not change: <strong>fast, hard, late, early</strong>",
                "📍 Usually placed <em>after the verb</em> or <em>after the object</em>",
            ],
        },
        {
            type: "forms",
            title: "Formation",
            headers: ["Type", "Rule", "Example"],
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
                    "no -ly",
                    "fast / hard / late",
                ],
            ],
            hint:
                "Not all words ending in <strong>-ly</strong> are adverbs of manner " +
                "(friendly, lovely are adjectives).",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["She sings beautifully."],
                ["They spoke quietly."]
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>She sings beautiful.</em> → ✅ <strong>beautifully</strong>"
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Adverbs of manner)",
        },
    ],
};

/* ============================
   IN ORDER TO / SO THAT
============================ */
export const RULE_PAGE_IN_ORDER_TO_SO_THAT = {
    id: "IN_ORDER_TO_SO_THAT",
    title: "In order to / so that",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What these constructions mean",
            html:
                "<strong>In order to + V</strong> is used to show the <em>purpose of an action</em> without a separate subject.<br/>" +
                "<strong>So that + clause</strong> is used when we need a <em>full clause with a subject</em>.",
        },
        {
            type: "usage",
            title: "When to use each",
            badges: [
                "🎯 Purpose without a subject → <strong>(in order) to + V</strong>: <strong>I work to earn money.</strong>",
                "👥 Purpose with a subject → <strong>so that + subject + verb</strong>: <strong>I left early so that I wouldn’t be late.</strong>",
                "🗣️ <strong>To</strong> is neutral; <strong>in order to</strong> is more formal",
            ],
            hint:
                "If the clause has its own subject, use <strong>so that</strong>.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Construction", "Structure", "Example"],
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
                "After <strong>to / in order to</strong>, we do not include a subject.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I work in order to I earn money.</em> → ✅ <strong>I work in order to earn money.</strong>",
                "❌ <em>I left early to I wouldn’t be late.</em> → ✅ <strong>I left early so that I wouldn’t be late.</strong>",
                "❌ Overusing <em>in order to</em> in casual speech (it can sound too formal)",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (In order to / So that)",
        },
    ],
};

/* ============================
   MODALS OF PROBABILITY (must, might, can't)
============================ */
export const RULE_PAGE_MODALS_OF_PROBABILITY = {
    id: "MODALS_OF_PROBABILITY",
    title: "Modal verbs of probability",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What modal verbs of probability mean",
            html:
                "<strong>Modals of probability</strong> are used to express the <em>degree of certainty</em> " +
                "when making a guess or logical conclusion.<br/>" +
                "<strong>must</strong> — almost certain (logical conclusion).<br/>" +
                "<strong>might / may / could</strong> — possible (there is a chance).<br/>" +
                "<strong>can’t</strong> — impossible (logically excluded).",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "🔍 Logical conclusion → <strong>He must be tired.</strong>",
                "🤔 Uncertain guess → <strong>She might be at work.</strong>",
                "🚫 Impossibility → <strong>He can’t be serious.</strong>",
                "🕒 Used for present and past (with have + V3)",
            ],
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Meaning", "Structure", "Example"],
            rows: [
                [
                    "High probability",
                    "must + V / must + be",
                    "She must be at home.",
                ],
                [
                    "Possibility",
                    "might / may / could + V",
                    "They might arrive late.",
                ],
                [
                    "Impossibility",
                    "can’t + V / can’t + be",
                    "It can’t be true.",
                ],
                [
                    "About the past",
                    "modal + have + V3",
                    "He must have forgotten.",
                ],
            ],
            hint:
                "For past assumptions, we always use <strong>have + V3</strong>.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Using <em>mustn’t</em> for assumptions → ❌ (it means prohibition) → ✅ use <strong>can’t</strong> for impossibility",
                "❌ Omitting <em>have</em> in past assumptions → <em>must forgot</em> → ✅ <strong>must have forgotten</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Modals of Probability)",
        },
    ],
};

/* ============================
   BE SUPPOSED TO
============================ */
export const RULE_PAGE_BE_SUPPOSED_TO = {
    id: "BE_SUPPOSED_TO",
    title: "Be supposed to",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What “be supposed to” means",
            html:
                "<strong>Be supposed to</strong> is used to talk about an <em>expectation, rule, or arrangement</em>, " +
                "rather than the speaker’s personal desire. It often has the meaning of “this is what was planned or expected.”",
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "📅 Schedule / plan: <strong>I’m supposed to start at 9.</strong>",
                "📜 Rule / instruction: <strong>You’re supposed to wear a helmet.</strong>",
                "⚠️ Broken expectation: <strong>He wasn’t supposed to be here.</strong>",
            ],
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Tense", "Structure", "Example"],
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
                "After <strong>to</strong> we always use the base form of the verb (V1).",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I’m supposed of going now.</em> → ✅ <strong>I’m supposed to go now.</strong>",
                "❌ <em>You’re supposed for doing this.</em> → ✅ <strong>You’re supposed to do this.</strong>"
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Be supposed to)",
        },
    ],
};

/* ============================
   LET / MAKE / ALLOW
============================ */
export const RULE_PAGE_LET_MAKE_ALLOW = {
    id: "LET_MAKE_ALLOW",
    title: "Let / make / allow",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Difference between let / make / allow",
            html:
                "<strong>Let</strong> means <em>to permit</em> (informal, without force).<br/>" +
                "<strong>Make</strong> means <em>to force or cause someone to do something</em> (pressure or obligation).<br/>" +
                "<strong>Allow</strong> means <em>to permit</em> (more formal, often used with rules).",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Verb", "Structure", "Example"],
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
                "After <strong>let</strong> and <strong>make</strong> we <em>never</em> use <strong>to</strong>.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>They allowed me go.</em> → ✅ <strong>allowed me to go</strong>",
                "❌ <em>He made me to do it.</em> → ✅ <strong>made me do it</strong>",
                "❌ <em>Let to go.</em> → ✅ <strong>Let me go.</strong>",
                "❌ <em>allowed to me</em> → ✅ <strong>allowed me</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Let / Make / Allow)",
        },
    ],
};

/* ============================
   REPORTED QUESTIONS
============================ */
export const RULE_PAGE_REPORTED_QUESTIONS = {
    id: "REPORTED_QUESTIONS",
    title: "Reported questions",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What reported questions are",
            html:
                "<strong>Reported questions</strong> are <em>questions in indirect speech</em>. " +
                "We report the question as part of a sentence, <em>without question word order</em> " +
                "and <em>without do / does / did</em>.",
        },
        {
            type: "usage",
            title: "Basic rules",
            badges: [
                "❓ Wh-questions → <strong>asked + wh-word</strong>: <strong>He asked where I lived.</strong>",
                "❓ Yes/No questions → <strong>asked if / whether</strong>: <strong>She asked if I liked it.</strong>",
                "⏪ Tense shift (backshift) often happens",
                "🔀 Word order becomes the same as in statements",
            ],
            hint:
                "In reported questions there is <em>no inversion</em>: " +
                "<strong>where he was</strong>, not <em>where was he</em>.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Question type", "Structure", "Example"],
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
                    "With backshift",
                    "present → past",
                    "Where is he? → He asked where he was.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>He asked where did I live.</em> → ✅ <strong>where I lived</strong>",
                "❌ <em>She asked do I like it.</em> → ✅ <strong>if I liked it</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Reported Questions)",
        },
    ],
};

/* ============================
   CAUSATIVE HAVE/GET
============================ */
export const RULE_PAGE_CAUSATIVE_HAVE_GET = {
    id: "CAUSATIVE_HAVE_GET",
    title: "Causative have / get",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What the causative means",
            html:
                "<strong>Causative have / get</strong> is used when <em>we arrange or ask for someone else</em> " +
                "to do something for us. We <em>do not perform the action ourselves</em>.",
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "✂️ Services: <strong>I had my hair cut.</strong>",
                "🔧 Repairs / technical work: <strong>We got the car repaired.</strong>",
                "🗣️ <strong>have</strong> — neutral; <strong>get</strong> — more conversational",
            ],
            hint:
                "The focus is not on the person who performs the action, but on the <em>result</em>.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Construction", "Structure", "Example"],
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
                    "With the performer",
                    "have / get + object + V3 + by",
                    "I had my phone fixed by a technician.",
                ],
            ],
            hint:
                "<strong>Have</strong> and <strong>get</strong> change according to the tense: " +
                "<em>have / had / will have; get / got / will get</em>.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Confusing it with the passive → <em>I had my hair cut</em> ≠ <em>My hair was cut</em> (different focus).",
                "❌ <em>I cut my hair</em> (different meaning: you did it yourself).",
                "❌ <em>have my hair to cut</em> → ✅ <strong>have my hair cut</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Causative have / get)",
        },
    ],
};

/* ============================
   PHRASAL VERBS (common)
============================ */
export const RULE_PAGE_PHRASAL_VERBS_COMMON = {
    id: "PHRASAL_VERBS_COMMON",
    title: "Phrasal verbs (common)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What phrasal verbs are",
            html:
                "<strong>Phrasal verbs</strong> are combinations of a <em>verb</em> and a <em>particle</em> " +
                "(up, out, off, on, etc.) that create a <em>new meaning</em>, " +
                "often <strong>not predictable from the literal meaning</strong>.",
        },
        {
            type: "usage",
            title: "How they work",
            badges: [
                "🔗 Meaning ≠ sum of parts: <strong>give up</strong> = stop trying",
                "↔️ Some are separable: <strong>turn off the light / turn the light off</strong>",
                "🚫 Some are inseparable: <strong>look after the child</strong>",
                "🧍‍♂️ Pronouns always go in the middle: <strong>pick it up</strong>",
            ],
        },
        {
            type: "forms",
            title: "Types of phrasal verbs",
            headers: ["Type", "Structure", "Example"],
            rows: [
                [
                    "Inseparable",
                    "verb + particle + object",
                    "look after the baby",
                ],
                [
                    "Separable",
                    "verb + object + particle / verb + particle + object",
                    "turn off the TV / turn the TV off",
                ],
                [
                    "With pronoun",
                    "verb + pronoun + particle",
                    "pick it up (NOT pick up it)",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>pick up it</em> → ✅ <strong>pick it up</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Phrasal Verbs)",
        },
    ],
};


/* ============================
   EACH OTHER / ONE ANOTHER
============================ */
export const RULE_PAGE_EACH_OTHER_ONE_ANOTHER = {
    id: "EACH_OTHER_ONE_ANOTHER",
    title: "Each other / one another",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What each other / one another mean",
            html:
                "<strong>Each other</strong> and <strong>one another</strong> are used to show a <em>reciprocal action</em> " +
                "between two or more people.",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "🤝 Reciprocal action → <strong>They help each other.</strong>",
                "👥 Traditionally: <strong>each other</strong> — for two people, <strong>one another</strong> — for more",
                "🗣️ In modern English they are often interchangeable",
            ],
            hint:
                "If the action happens <em>between people</em>, not to the same person, " +
                "use <strong>each other</strong> or <strong>one another</strong>.",
        },
        {
            type: "forms",
            title: "Form in a sentence",
            headers: ["Construction", "Example", "Explanation"],
            rows: [
                [
                    "verb + each other",
                    "They respect each other.",
                    "Reciprocal action between two people.",
                ],
                [
                    "verb + one another",
                    "The team members trust one another.",
                    "Reciprocal action between several people.",
                ],
                [
                    "with a preposition",
                    "They talked to each other.",
                    "The preposition stays before the phrase.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Confusing with reflexive pronouns → <em>They helped themselves</em> ≠ <strong>each other</strong>",
                "❌ <em>each others</em> → ❌ (no plural form)"
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Each other / one another)",
        },
    ],
};

/* ============================
   SO DO I / NEITHER DO I
============================ */
export const RULE_PAGE_SO_DO_I_NEITHER_DO_I = {
    id: "SO_DO_I_NEITHER_DO_I",
    title: "So do I / Neither do I",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What these constructions mean",
            html:
                "<strong>So do I</strong> means <em>“I do too”</em> after a <em>positive</em> statement.<br/>" +
                "<strong>Neither do I</strong> means <em>“I don’t either”</em> after a <em>negative</em> statement.",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "➕ Positive → <strong>So + auxiliary + subject</strong>: <strong>I like coffee. — So do I.</strong>",
                "➖ Negative → <strong>Neither + auxiliary + subject</strong>: <strong>I don’t like tea. — Neither do I.</strong>",
                "🔁 The auxiliary verb depends on the tense and structure",
            ],
        },
        {
            type: "forms",
            title: "Common patterns",
            headers: ["Sentence type", "Response pattern", "Example"],
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
                "Use the <strong>same auxiliary verb</strong> as in the first sentence.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Neither I do.</em> → ✅ <strong>Neither do I.</strong>",
                "❌ Wrong auxiliary → <em>I’m tired. — So do I.</em> → ✅ <strong>So am I.</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (So do I / Neither do I)",
        },
    ],
};

/* ============================
   NOT ONLY … BUT ALSO
============================ */
export const RULE_PAGE_NOT_ONLY_BUT_ALSO = {
    id: "NOT_ONLY_BUT_ALSO",
    title: "Not only … but also",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What “not only … but also” means",
            html: "This construction is used for emphasis: <strong>not only … but also …</strong>."
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "<strong>Not only</strong> + part 1, <strong>but also</strong> + part 2",
                "In formal style, <strong>Not only</strong> at the beginning often causes inversion"
            ],
            hint: "Keep a parallel structure: the same grammatical form should follow both parts."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Not only is she smart, but she’s also very kind."],
                ["He not only plays the guitar but also writes songs."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Different grammatical structures after <em>not only</em> and <em>but also</em>.",
                "❌ Missing inversion in very formal writing when the sentence begins with <em>Not only</em>."
            ]
        },
        { type: "trainer", title: "Mini trainer (Not only … but also)" }
    ]
};


/* ============================
   CLEFT SENTENCES
============================ */
export const RULE_PAGE_CLEFT_SENTENCES = {
    id: "CLEFT_SENTENCES",
    title: "Cleft sentences (It is / What … is …)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What cleft sentences are",
            html:
                "<strong>Cleft sentences</strong> are special constructions used " +
                "to <em>highlight or emphasize</em> a particular part of a sentence " +
                "(a person, time, place, reason, etc.).<br/>" +
                "The most common types are <strong>It is/was … that/who …</strong> and <strong>What … is …</strong>.",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "🎯 Focus on a specific element → <strong>It was John who called.</strong>",
                "🧩 Focus on an idea or action → <strong>What I need is a break.</strong>",
                "✍️ Often used in writing or neutral speech to add emphasis without relying on intonation",
            ],
        },
        {
            type: "forms",
            title: "Main types",
            headers: ["Type", "Structure", "Example"],
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
                "<strong>Who</strong> is used for people, while <strong>that</strong> can be used more generally. " +
                "The tense in a cleft sentence depends on the main event being described.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Incorrect tense → <em>It is yesterday that we met</em> → ✅ <strong>It was yesterday that we met</strong>",
                "❌ Using cleft structure unnecessarily when simple word order is enough",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Cleft sentences)",
        },
    ],
};

/* ============================
   MIXED CONDITIONALS
============================ */
export const RULE_PAGE_MIXED_CONDITIONALS = {
    id: "MIXED_CONDITIONALS",
    title: "Mixed conditionals",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What mixed conditionals are",
            html:
                "<strong>Mixed conditionals</strong> are conditional sentences where " +
                "the <em>time in the if-clause</em> and the <em>time in the result clause</em> are different. " +
                "They combine the logic of the <strong>2nd</strong> and <strong>3rd conditional</strong>.",
        },
        {
            type: "usage",
            title: "Main types",
            badges: [
                "⏳ Past → present (cause in the past, result now): " +
                "<strong>If I had studied, I would speak better now.</strong>",
                "⏳ Present → past (a general condition affecting the past): " +
                "<strong>If I were taller, I would have become a pilot.</strong>",
            ],
            hint:
                "Ask yourself: <em>When did the cause happen?</em> and <em>When do we see the result?</em>",
        },
        {
            type: "forms",
            title: "Structures",
            headers: ["Type", "If-clause", "Main clause"],
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
                "<strong>Now / today / at the moment</strong> often signal " +
                "a present result.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["If she had left earlier, she wouldn’t be late now."],
                ["If I were more careful, I wouldn’t have made that mistake."],
                ["If he hadn’t missed the bus, he would be here now."],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Using the same time reference in both clauses → not a mixed conditional",
                "❌ <em>If I had studied, I would have a job now.</em> → restructure or use <strong>would have had</strong>",
                "❌ Forgetting that <em>were</em> is used for all persons in unreal conditions",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Mixed conditionals)",
        },
    ],
};

/* ============================
   THIRD CONDITIONAL VARIATIONS
============================ */
export const RULE_PAGE_THIRD_CONDITIONAL_VARIATIONS = {
    id: "THIRD_CONDITIONAL_VARIATIONS",
    title: "3rd Conditional variations",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What these variations are",
            html: "Different forms of the 3rd conditional: contractions, modal verbs, and changes in clause order."
        },
        {
            type: "usage",
            title: "Examples of variations",
            badges: [
                "<strong>If you’d told me, I would’ve helped.</strong>",
                "<strong>If he had tried, he might have succeeded.</strong>",
                "<strong>Had I known, I would have left earlier.</strong> (without if)"
            ],
            hint: "The form <strong>Had I known…</strong> is an inversion used instead of <em>if</em>."
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Had we left on time, we wouldn’t have missed the train."],
                ["If she had asked, I could have explained everything."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Incorrect contraction: <em>would of</em> instead of <strong>would have</strong>.",
                "❌ Incorrect word order after inversion with <em>Had</em>."
            ]
        },
        { type: "trainer", title: "Mini trainer (3rd Conditional variations)" }
    ]
};


/* ============================
   ADVANCED PASSIVES WITH REPORTING VERBS
============================ */
export const RULE_PAGE_ADV_PASSIVES_REPORTING_VERBS = {
    id: "ADV_PASSIVES_REPORTING_VERBS",
    title: "Advanced passives (with reporting verbs)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What these constructions are",
            html:
                "<strong>Advanced passives with reporting verbs</strong> are passive structures used with verbs like " +
                "<em>say, think, believe, report, expect, know, consider</em>, " +
                "when the <em>information itself</em> is more important than the source.",
        },
        {
            type: "usage",
            title: "Two main types",
            badges: [
                "📰 General opinion or reports → <strong>It is said that…</strong>",
                "👤 Focus on the person → <strong>He is said to…</strong>",
                "✍️ Common in formal style (news, reports, academic writing)",
            ],
            hint:
                "Both constructions report <em>indirect information</em> without naming the source.",
        },
        {
            type: "forms",
            title: "Common structures",
            headers: ["Type", "Structure", "Example"],
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
                "For present meaning use <strong>to + V</strong>, " +
                "for past meaning use <strong>to have + V3</strong>.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>He is said that he is rich.</em> → ❌ (use the infinitive form instead)",
                "❌ <em>He is said to is rich.</em> → ✅ <strong>to be rich</strong>",
                "❌ Incorrect tense → <em>is said to leave yesterday</em> → ✅ <strong>to have left</strong>"
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Advanced passives with reporting verbs)",
        },
    ],
};


/* ============================
   PARTICIPLE CLAUSES
============================ */
export const RULE_PAGE_PARTICIPLE_CLAUSES = {
    id: "PARTICIPLE_CLAUSES",
    title: "Participle clauses",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What participle clauses are",
            html:
                "<strong>Participle clauses</strong> are <em>shortened subordinate clauses</em> " +
                "that use the forms <strong>V-ing</strong> or <strong>V3</strong> " +
                "to add information about <em>time, reason, condition, or result</em>.",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "⏱️ Time / reason → <strong>Feeling tired, he went to bed.</strong>",
                "📄 Passive meaning → <strong>Built in 1990, the house looks old.</strong>",
                "✂️ To shorten clauses with <strong>when / because / if</strong>",
            ],
            hint:
                "The subject of the participle clause must be <em>the same</em> as the subject of the main clause.",
        },
        {
            type: "forms",
            title: "Main types",
            headers: ["Type", "Structure", "Example"],
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
                "<strong>Having + V3</strong> emphasizes that one action " +
                "<em>was completed before</em> another.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Dangling participle → <em>Walking down the street, the house appeared.</em>",
                "❌ Different subjects in the clauses → the participle clause becomes illogical",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Participle clauses)",
        },
    ],
};

/* ============================
   REDUCED RELATIVE CLAUSES
============================ */
export const RULE_PAGE_REDUCED_RELATIVE_CLAUSES = {
    id: "REDUCED_RELATIVE_CLAUSES",
    title: "Reduced relative clauses",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What reduced relative clauses are",
            html:
                "<strong>Reduced relative clauses</strong> are <em>shortened relative clauses</em> " +
                "in which we remove the <em>relative pronoun</em> and the <em>verb to be</em>, " +
                "leaving <strong>V-ing</strong> (active) or <strong>V3</strong> (passive).",
        },
        {
            type: "usage",
            title: "How we reduce them",
            badges: [
                "🟢 Active: <strong>who / that + V</strong> → <strong>V-ing</strong>",
                "🔵 Passive: <strong>which / that + be + V3</strong> → <strong>V3</strong>",
                "⚠️ The subject remains the same",
            ],
            hint:
                "We reduce a relative clause only when it <em>describes a noun</em>, " +
                "not a whole sentence.",
        },
        {
            type: "forms",
            title: "Common transformations",
            headers: ["Full form", "Reduced form", "Type"],
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
                "If there is <em>no form of to be</em> in the relative clause, " +
                "we can usually remove only the relative pronoun.",
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                [
                    "Students living in the dorm must register.",
                ],
                [
                    "The book written by my friend is popular.",
                ],
                [
                    "Anyone interested in the job should apply.",
                ],
                [
                    "The documents sent yesterday are missing.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Incorrect tense or form → <em>The people lived here</em> (this has a different meaning)"
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Reduced relative clauses)",
        },
    ],
};

/* ============================
   COMPLEX PREPOSITIONS
============================ */
export const RULE_PAGE_COMPLEX_PREPOSITIONS = {
    id: "COMPLEX_PREPOSITIONS",
    title: "Complex prepositions (due to, thanks to, because of)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What complex prepositions are",
            html:
                "<strong>Complex prepositions</strong> are <em>fixed prepositional phrases</em> " +
                "that consist of two or more words but function as a single preposition. " +
                "They explain <em>reason, position, or circumstances</em>.",
        },
        {
            type: "usage",
            title: "When and how we use them",
            badges: [
                "⚠️ Cause (often formal) → <strong>due to</strong>",
                "😊 Positive cause → <strong>thanks to</strong>",
                "🔹 Neutral cause → <strong>because of</strong>",
                "📍 Position / place → <strong>in front of, next to, on top of</strong>",
                "🚫 Contrast → <strong>in spite of</strong>",
            ]
        },
        {
            type: "forms",
            title: "Common patterns",
            headers: ["Preposition", "Meaning", "Example"],
            rows: [
                [
                    "due to",
                    "cause (often formal)",
                    "The delay was due to bad weather.",
                ],
                [
                    "thanks to",
                    "positive cause",
                    "Thanks to her advice, we succeeded.",
                ],
                [
                    "because of",
                    "neutral cause",
                    "The flight was cancelled because of fog.",
                ],
                [
                    "in spite of",
                    "contrast",
                    "In spite of the rain, we went out.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>Because of he was tired</em> → ✅ <strong>because of being tired</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Complex prepositions)",
        },
    ],
};

/* ============================
   DESPITE / IN SPITE OF + -ING
============================ */
export const RULE_PAGE_DESPITE_IN_SPITE_OF_ING = {
    id: "DESPITE_IN_SPITE_OF_ING",
    title: "Despite / in spite of + -ing",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What despite / in spite of mean",
            html:
                "<strong>Despite</strong> and <strong>in spite of</strong> mean <em>“although / regardless of”</em> " +
                "and are used to show <em>contrast</em>: something happens even though the situation suggests otherwise.",
        },
        {
            type: "usage",
            title: "How we use them",
            badges: [
                "📌 Before a noun → <strong>despite the rain</strong>",
                "📌 Before a verb → <strong>despite / in spite of + V-ing</strong>",
                "🟰 <strong>Despite</strong> and <strong>in spite of</strong> have the same meaning",
                "✍️ <strong>Despite</strong> is slightly shorter and more commonly used",
            ],
            hint:
                "After <strong>despite / in spite of</strong> we cannot use a full clause with a subject and verb.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Structure", "Example"],
            rows: [
                [
                    "despite + noun",
                    "Despite the rain, we went out.",
                ],
                [
                    "in spite of + noun",
                    "In spite of the rain, we went out.",
                ],
                [
                    "despite / in spite of + -ing",
                    "Despite being tired, he worked late.",
                ],
            ],
            hint:
                "<strong>Despite</strong> ≠ <strong>despite of</strong> (❌). " +
                "<strong>In spite of</strong> always includes <strong>of</strong>.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>despite of the rain</em> → ✅ <strong>despite the rain</strong>",
                "❌ <em>despite she was tired</em> → ✅ <strong>despite being tired</strong> / <strong>although she was tired</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Despite / In spite of)",
        },
    ],
};

/* ============================
   WOULD RATHER / PREFER
============================ */
export const RULE_PAGE_WOULD_RATHER_PREFER = {
    id: "WOULD_RATHER_PREFER",
    title: "Would rather / prefer",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What would rather / prefer mean",
            html:
                "<strong>Would rather</strong> and <strong>prefer</strong> are used to talk about <em>preferences</em>, " +
                "but they follow <em>different grammatical structures</em> and have slightly different usage.",
        },
        {
            type: "forms",
            title: "Main structures",
            headers: ["Construction", "Structure", "Example"],
            rows: [
                [
                    "would rather (self)",
                    "would rather + V1",
                    "I’d rather stay at home.",
                ],
                [
                    "would rather (other person)",
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
                "After <strong>would rather</strong> we never use <em>to</em>. " +
                "After <strong>prefer</strong>, several structures are possible.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>I’d rather you to go.</em> → ✅ <strong>I’d rather you went.</strong>",
                "❌ <em>I’d rather stayed.</em> → ✅ <strong>I’d rather stay.</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Would rather / prefer)",
        },
    ],
};

/* ============================
   HAD BETTER
============================ */
export const RULE_PAGE_HAD_BETTER = {
    id: "HAD_BETTER",
    title: "Had better + verb",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What had better means",
            html:
                "<strong>Had better</strong> is used to give <em>strong advice or a warning</em>. " +
                "The idea is that <em>negative consequences may happen if the advice is not followed</em>.",
        },
        {
            type: "usage",
            title: "When we use it",
            badges: [
                "⚠️ Warning → <strong>You’d better leave now.</strong>",
                "⏰ Urgent advice → <strong>We’d better hurry.</strong>",
                "🚨 Possible consequences (often implied)",
            ],
            hint:
                "<strong>Had better</strong> sounds stronger than <em>should</em> and can feel like insistence.",
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Type", "Structure", "Example"],
            rows: [
                [
                    "Affirmative",
                    "had better + V1",
                    "You had better tell the truth.",
                ],
                [
                    "Negative",
                    "had better not + V1",
                    "You’d better not be late.",
                ],
                [
                    "Spoken form",
                    "’d better + V1",
                    "We’d better call them.",
                ],
            ],
            hint:
                "After <strong>had better</strong> we always use the base form of the verb (V1) <em>without to</em>.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>had better to go</em> → ✅ <strong>had better go</strong>",
                "❌ <em>had better went</em> → ✅ <strong>had better go</strong>"
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Had better)",
        },
    ],
};

/* ============================
   ADVANCED MODALS OF DEDUCTION
============================ */
export const RULE_PAGE_ADVANCED_MODALS_OF_DEDUCTION = {
    id: "ADVANCED_MODALS_OF_DEDUCTION",
    title: "Advanced modals of deduction",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Modal verbs for deduction",
            html:
                "<strong>Advanced modals of deduction</strong> are used to express " +
                "<em>logical assumptions</em> with different levels of certainty about the present or the past.",
        },
        {
            type: "usage",
            title: "When we use them",
            badges: [
                "🔍 Logical conclusion → <strong>must</strong>",
                "🤔 Possibility → <strong>may / might / could</strong>",
                "🚫 Impossibility → <strong>can’t</strong>",
                "🕒 For past deductions → <strong>modal + have + V3</strong>",
            ],
        },
        {
            type: "forms",
            title: "Forms by time reference",
            headers: ["Time", "Structure", "Example"],
            rows: [
                [
                    "Present",
                    "modal + V / modal + be",
                    "She must be tired.",
                ],
                [
                    "Present (ongoing action)",
                    "modal + be + V-ing",
                    "He may be sleeping.",
                ],
                [
                    "Past",
                    "modal + have + V3",
                    "They might have forgotten.",
                ],
                [
                    "Past impossibility",
                    "can’t + have + V3",
                    "She can’t have done it.",
                ],
            ],
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>He must left</em> → ✅ <strong>must have left</strong>",
                "❌ Incorrect tense → for past deductions always use <strong>have + V3</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Advanced modals of deduction)",
        },
    ],
};


/* ============================
   COMPLEX NOUN PHRASES
============================ */
export const RULE_PAGE_COMPLEX_NOUN_PHRASES = {
    id: "COMPLEX_NOUN_PHRASES",
    title: "Complex noun phrases",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What complex noun phrases are",
            html:
                "<strong>Complex noun phrases</strong> are noun phrases where the <em>main noun</em> " +
                "is modified by several elements such as <em>adjectives, other nouns, prepositional phrases</em> " +
                "or <em>relative clauses</em>.",
        },
        {
            type: "usage",
            title: "How they are built",
            badges: [
                "🧩 Before the noun → <strong>det + adj + noun</strong>",
                "🔗 After the noun → <strong>prepositional phrase / relative clause</strong>",
                "📚 Common in formal and written language",
            ],
            hint:
                "In English, most descriptive elements appear <em>before</em> the noun, " +
                "while additional details often appear <em>after</em> it.",
        },
        {
            type: "forms",
            title: "Common structures",
            headers: ["Structure", "Explanation", "Example"],
            rows: [
                [
                    "det + adj + noun + prep phrase",
                    "basic description with extra detail",
                    "The long, narrow road to the village",
                ],
                [
                    "noun + V3 phrase",
                    "passive modifier",
                    "The decision made by the committee",
                ],
                [
                    "noun + relative clause",
                    "additional information",
                    "The book that you recommended",
                ],
            ],
            hint:
                "Commas depend on whether the information is <em>restrictive</em> (no commas) " +
                "or <em>non-restrictive</em> (with commas).",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Using too many adjectives without a logical order",
                "❌ Missing commas in a list of adjectives",
                "❌ Overly long phrases that are difficult to read",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Complex noun phrases)",
        },
    ],
};

/* ============================
   INDIRECT SPEECH QUESTION FORMS
============================ */
export const RULE_PAGE_INDIRECT_SPEECH_QUESTION_FORMS = {
    id: "INDIRECT_SPEECH_QUESTION_FORMS",
    title: "Question forms in indirect speech",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "Questions in indirect speech",
            html:
                "<strong>Indirect questions</strong> are questions embedded inside a sentence. " +
                "They use the <em>normal statement word order</em> and there is <em>no inversion</em> " +
                "and no auxiliary <em>do / does / did</em>.",
        },
        {
            type: "usage",
            title: "Main rules",
            badges: [
                "❓ Wh-questions → <strong>wh-word + subject + verb</strong>",
                "❓ Yes/No questions → <strong>if / whether + subject + verb</strong>",
                "⏪ Backshift often occurs (present → past)",
                "🔗 Often used after <em>ask, wonder, want to know</em>",
            ],
        },
        {
            type: "forms",
            title: "Forms",
            headers: ["Question type", "Structure", "Example"],
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
                "<strong>If</strong> and <strong>whether</strong> are usually interchangeable, " +
                "but <strong>whether</strong> is more common in formal style.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>She asked where was he.</em> → ✅ <strong>where he was</strong>",
                "❌ <em>He asked did I see her.</em> → ✅ <strong>if I had seen her</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Indirect speech question forms)",
        },
    ],
};

/* ============================
   COMPOUND SENTENCES
============================ */
export const RULE_PAGE_COMPOUND_SENTENCES = {
    id: "COMPOUND_SENTENCES",
    title: "Compound sentences",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What compound sentences are",
            html:
                "A <strong>compound sentence</strong> contains two or more <strong>independent clauses</strong> " +
                "connected by coordinating conjunctions such as <strong>and, but, or, so</strong>.",
        },
        {
            type: "usage",
            title: "Examples of usage",
            badges: [
                "<strong>I was tired, but I finished my work.</strong>",
                "<strong>She called me, and we talked for an hour.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["He wanted to go out, but it was raining."],
                ["You can stay here, or you can leave."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Comma splice: two clauses joined only by a comma without a conjunction."
            ]
        },
        {
            type: "trainer",
            title: "Mini trainer (Compound sentences)",
        }
    ]
};


/* ============================
   COMPLEX SENTENCES
============================ */
export const RULE_PAGE_COMPLEX_SENTENCES = {
    id: "COMPLEX_SENTENCES",
    title: "Complex sentences",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What complex sentences are",
            html:
                "A <strong>complex sentence</strong> contains a <strong>main clause</strong> and at least one <strong>subordinate clause</strong>, " +
                "connected by subordinating conjunctions such as <strong>because, although, when, if</strong>.",
        },
        {
            type: "usage",
            title: "Examples of usage",
            badges: [
                "<strong>Although it was late, we kept talking.</strong>",
                "<strong>When I arrived, they were eating.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["Because it was raining, we stayed at home."],
                ["I’ll call you when I get there."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Missing commas after introductory subordinate clauses in writing."
            ]
        },
        {
            type: "trainer",
            title: "Mini trainer (Complex sentences)",
        }
    ]
};


/* ============================
   COMPOUND–COMPLEX SENTENCES
============================ */
export const RULE_PAGE_COMPOUND_COMPLEX_SENTENCES = {
    id: "COMPOUND_COMPLEX_SENTENCES",
    title: "Compound–complex sentences",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What compound–complex sentences are",
            html:
                "A <strong>compound–complex sentence</strong> combines <strong>multiple independent clauses</strong> " +
                "and <strong>one or more subordinate clauses</strong> in a single sentence."
        },
        {
            type: "usage",
            title: "Examples of usage",
            badges: [
                "<strong>I was tired, but I finished the report because it was important.</strong>",
                "<strong>When he arrived, we started cooking, and the guests came soon after.</strong>"
            ]
        },
        {
            type: "examples",
            title: "Examples",
            items: [
                ["While I was studying, my phone rang, and I missed the call."],
                ["She didn’t come because she was ill, and nobody called her."]
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Very long sentences without clear punctuation or logical pauses."
            ]
        },
        {
            type: "trainer",
            title: "Mini trainer (Compound–complex sentences)"
        }
    ]
};

/* ============================
   CORRELATIVE CONJUNCTIONS
============================ */
export const RULE_PAGE_CORRELATIVE_CONJUNCTIONS = {
    id: "CORRELATIVE_CONJUNCTIONS",
    title: "Correlative conjunctions (either…or / neither…nor / both…and)",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What correlative conjunctions are",
            html:
                "<strong>Correlative conjunctions</strong> are <em>paired conjunctions</em> " +
                "that always work together to connect equal parts of a sentence:<br/>" +
                "<strong>either … or</strong>, <strong>neither … nor</strong>, <strong>both … and</strong>, <strong>not only … but also</strong>.",
        },
        {
            type: "usage",
            title: "When and how we use them",
            badges: [
                "🔀 Choice between two options → <strong>either … or</strong>",
                "🚫 Negative for both → <strong>neither … nor</strong>",
                "➕ Both options → <strong>both … and</strong>",
                "✨ Emphasis → <strong>not only … but also</strong>",
            ],
        },
        {
            type: "forms",
            title: "Common patterns",
            headers: ["Construction", "Structure", "Example"],
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
            ]
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ Breaking parallel structure → <em>both reading and write</em> → ❌",
                "❌ Incorrect agreement → <em>Neither you nor I is ready</em> → ✅ <strong>am ready</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Correlative conjunctions)",
        },
    ],
};

/* ============================
   PREPOSITIONS OF DIRECTION
============================ */
export const RULE_PAGE_PREP_DIRECTION = {
    id: "PREP_DIRECTION",
    title: "Prepositions of direction",
    subtitle: "Learning the rule",
    sections: [
        {
            type: "meaning",
            title: "What prepositions of direction are",
            html:
                "<strong>Prepositions of direction</strong> show <em>movement and direction</em> — " +
                "where someone or something is moving.",
        },
        {
            type: "forms",
            title: "Common patterns",
            headers: ["Preposition", "Usage", "Example"],
            rows: [
                [
                    "to",
                    "movement toward a place",
                    "She went to the office.",
                ],
                [
                    "into",
                    "movement inside something",
                    "He walked into the room.",
                ],
                [
                    "towards",
                    "movement in the direction of something",
                    "They moved towards the exit.",
                ],
                [
                    "onto",
                    "movement to a surface",
                    "The cat jumped onto the sofa.",
                ],
            ],
            hint:
                "<strong>To</strong> ≠ <strong>into</strong>: " +
                "<em>to</em> shows direction only, while <em>into</em> means movement <em>inside</em> something.",
        },
        {
            type: "mistakes",
            title: "Common mistakes",
            bullets: [
                "❌ <em>go into school</em> (for general direction) → ✅ <strong>go to school</strong>",
                "❌ <em>walk to the room</em> (when meaning inside) → ✅ <strong>walk into the room</strong>",
            ],
        },
        {
            type: "trainer",
            title: "Mini trainer (Prepositions of direction)",
        },
    ],
};
