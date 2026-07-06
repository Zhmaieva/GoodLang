// console.js (Node 18+, console app)
import OpenAI from "openai";
import {LEVEL_RULES} from "./rules.js";
import {ALL_RULES_SAMPLES} from "./allRulesSamples.js";

const client = new OpenAI({ apiKey: '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' });

const languagesMap = {
    "Ukrainian": "ua",
    "English": "en",
}

export const localeTranslationKeys = Object.freeze({
    "uk-UA": "ua",
    "ru-RU": "ru",
    "pl-PL": "pl",
    "de-DE": "de",
    "fr-FR": "fr",
    "es-ES": "es",
    "it-IT": "it",
    "pt-PT": "pt",
    "nl-NL": "nl",
    "sv-SE": "sv",
    "no-NO": "no",
    "da-DK": "da",
    "fi-FI": "fi",
    "cs-CZ": "cs",
    "sk-SK": "sk",
    "hu-HU": "hu",
    "ro-RO": "ro",
    "bg-BG": "bg",
    "el-GR": "el",
    "tr-TR": "tr",
    "zh-CN": "zh",
    "ja-JP": "ja",
    "ko-KR": "ko",
    "th-TH": "th",
    "vi-VN": "vi",
    "id-ID": "id",
    "ms-MY": "ms",
    "he-IL": "he",
    "ar-SA": "ar",
});

const localePrefixTranslationKeys = Object.freeze(
    Object.fromEntries(
        Object.entries(localeTranslationKeys).map(([locale, key]) => [
            locale.slice(0, 2).toLowerCase(),
            key,
        ])
    )
);

export function getTranslationKeyForLocale(locale = "uk-UA") {
    const normalizedLocale = String(locale || "uk-UA").toLowerCase();
    const exactLocale = Object.keys(localeTranslationKeys).find(
        (supportedLocale) => supportedLocale.toLowerCase() === normalizedLocale
    );

    if (exactLocale) return localeTranslationKeys[exactLocale];

    return localePrefixTranslationKeys[normalizedLocale.slice(0, 2)] || "ua";
}

export function getDeterministicSampleTranslation(sample, locale = "uk-UA") {
    const translationKey = getTranslationKeyForLocale(locale);
    const translations = sample?.translations;
    const normalizedLocale = String(locale || "uk-UA").toLowerCase();
    const exactTranslationLocale = translations
        ? Object.keys(translations).find((key) => key.toLowerCase() === normalizedLocale)
        : null;

    return (
        (exactTranslationLocale ? translations[exactTranslationLocale] : null) ||
        translations?.[translationKey] ||
        sample?.[translationKey] ||
        null
    );
}

// Hash function to convert any string/number into a good 32-bit seed
function xmur3(str) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
            h = (h << 13) | (h >>> 19);
    return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

// Stronger seeded RNG (sfc32)
function sfc32(a, b, c, d) {
    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
        var t = (a + b) | 0;
        a = b ^ (b >>> 9);
        b = (c + (c << 3)) | 0;
        c = (c << 21) | (c >>> 11);
        d = (d + 1) | 0;
        t = (t + d) | 0;
        c = (c + t) | 0;
        return (t >>> 0) / 4294967296;
    };
}

// Shuffle using string or number seed
export function shuffleBySeed(array, seedInput) {
    try {
        const seedStr = String(seedInput);
        const seedFn = xmur3(seedStr);
        const rand = sfc32(seedFn(), seedFn(), seedFn(), seedFn());
        const arr = [...array];

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(rand() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    } catch (e) {
        throw e;
    }
}

export function randomRule(level) {
    const values = LEVEL_RULES[level];
    return values[Math.floor(Math.random() * values.length)];
}

export const clearText = (text) => text?.toLowerCase()
    .split('.').join('')
    .split('’').join('\'')
    .split(',').join('')

    .split('wouldn\'t').join('would not')
    .split('wouldnt').join('would not')

    .split(' won\'t ').join(' will not ')
    .split(' wont ').join(' will not ')

    .split('couldn\'t').join('could not')
    .split('couldnt').join('could not')

    .split(' arent ').join(' are not ')
    .split('aren\'t').join('are not')

    .split(' isnt ').join(' is not ')
    .split('isn\'t').join('is not')

    .split(' werent ').join(' were not ')
    .split('weren\'t').join('were not')

    .split('wasnt').join('was not')
    .split('wasn\'t').join('was not')

    .split(' doesnt ').join(' does not ')
    .split('doesn\'t').join('does not')

    .split('didnt').join('did not')
    .split('didn\'t').join('did not')

    .split(' hasnt ').join(' has not ')
    .split('hasn\'t').join('has not')

    .split(' havent ').join(' have not ')
    .split('haven\'t').join('have not')

    .split(' cant ').join(' can not ')
    .split('can\'t').join('can not');

export function preEvaluate({
                                      rules = [],
                                      userEnglish = "",                // learner's translation attempt (English)
                                      textToTranslateOriginal = ""
                                  }) {
    const targetRule = rules[0];
    const languageCode = languagesMap["Ukrainian"];
    const targetSample = ALL_RULES_SAMPLES[targetRule].find(x => x[languageCode] === textToTranslateOriginal || Array.isArray(x[languageCode]) && x[languageCode].find(xx => xx === textToTranslateOriginal));
    const validTranslation = Array.isArray(targetSample[languagesMap["English"]])
        ? targetSample[languagesMap["English"]].find((expectedTranslation) => {
            return clearText(expectedTranslation) === clearText(userEnglish);
        })
        : clearText(targetSample[languagesMap["English"]]) === clearText(userEnglish);

    const result = !!validTranslation;

    return {
        answer_is_correct: result,
        scores: rules.map(() => (result ? 1 : 0)),
        hint: targetSample.hint || '',
        sampleTranslation: Array.isArray(targetSample[languagesMap["English"]])
            ? targetSample[languagesMap["English"]][0] : targetSample[languagesMap["English"]]
    };
}


export async function evaluateAndCoach({
                                           rules = [],
                                           targetLocale = 'uk-UA',       // the learner’s L1 for prompts
                                           userEnglish = "",                // learner's translation attempt (English)
                                           textToTranslate = "",
                                           hint = "",
                                       }) {


    const systemPrompt = `
You are a friendly but precise ESL grammar tutor. You never invalidate informal speech.
Return JSON only.
Schema:
{
  "answer_is_correct": boolean,
  "correct_answer": string,
  "tip_if_wrong": string,
  "scores": number[]
}
  `;

    const userPrompt = `
TARGET_LANGUAGE: ${targetLocale}
GRAMMAR_RULES: [${rules.join(', ')}]
TEXT_TO_TRANSLATE: ${textToTranslate}
HINT: ${hint}

TASKS:
1) Evaluate if LEARNER_ENGLISH is correct according to English rules and, if when HINT is present, first and foremost according to HINT and also referring to GRAMMAR_RULES[0] as the target rule, and if it is a correct translation from TEXT_TO_TRANSLATE. Pay extra attention to accurate translation. Never evaluate correctness of TEXT_TO_TRANSLATE itself. 
2) If wrong, give a helpful human tip in TARGET_LANGUAGE. Address user informally a omitting gender, yet assertive way to express the tip.
3) Also, give correct translation from TARGET_LANGUAGE to English.
4) For each of GRAMMAR_RULES, give score in output array accordingly: if LEARNER_ENGLISH is full grammatical mismatch of correct translation -> 0; ELSE if this exact particular specific rule was violated anywhere in LEARNER_ENGLIS -> 0; ELSE if absolutely correct -> 1; ELSE if 1 misused word or typo -> 0.95; ELSE if 2-3 misused words or typos -> 0.85; ELSE 0.75

LEARNER_ENGLISH: ${userEnglish || "(none)"}
`;

    const resp = await client.responses.create({
        model: "gpt-4.1-mini",
        temperature: 0.2,

        text: { format: { type: "json_object" } },

        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user",   content: [{ type: "input_text", text: userPrompt }] },
        ],
    });


    // The Responses API returns structured items; easiest is to read the top-level output_text
    const txt = resp.output_text; // SDK helper that concatenates text parts
    const parsed = JSON.parse(txt);

    return parsed;
}

export async function evaluateGapAndCoach({
                                              task,
                                              userAnswer = "",
                                              targetLocale = "uk-UA"
                                          }) {
    const { rules = [], en = [], options = [], correct } = task;

    targetLocale = targetLocale === 'null' ? null : targetLocale;

    targetLocale = !targetLocale ? 'uk-UA' : targetLocale;

    const sentence = Array.isArray(en) ? (en[0] ?? "") : String(en ?? "");
    const normalizedUser = clearText(String(userAnswer ?? "").trim());
    const normalizedCorrect = clearText(String(correct ?? "").trim());

    const isCorrect = normalizedUser === normalizedCorrect;

    const filledCorrectSentence = String(sentence).replaceAll(
        "{GAP}",
        String(correct ?? "")
    );

    if (isCorrect) {
        return {
            sample_in_target_language: filledCorrectSentence,
            answer_is_correct: true,
            correct_answer: String(correct ?? ""),
            tip_if_wrong: "",
            scores: rules.map(() => 1)
        };
    }

    const systemPrompt = `
You are a friendly but precise ESL grammar tutor.
Return JSON only.
Schema:
{
  "tip_if_wrong": string
}
`;

    const userPrompt = `
TARGET_LANGUAGE: ${targetLocale}
GRAMMAR_RULES: [${rules.join(", ")}]

TASK_TYPE: GAP_CHOICE
SENTENCE_TEMPLATE: ${sentence}
OPTIONS: ${JSON.stringify(options)}
CORRECT_OPTION: ${correct}

LEARNER_CHOICE: ${userAnswer || "(none)"}

INSTRUCTIONS:
1) Give a short, helpful tip in TARGET_LANGUAGE explaining why LEARNER_CHOICE is wrong and why CORRECT_OPTION fits.
2) Never mention the grammar rule names (GRAMMAR_RULES) as they are.
3) Keep it practical and short (1-3 sentences).
4) Do NOT include any other keys besides tip_if_wrong.
5) Also if you use English words, explaining the mistake, specify TARGET_LANGUAGE translations next to them
`;

    const resp = await client.responses.create({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        text: { format: { type: "json_object" } },
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] }
        ]
    });

    const txt = resp.output_text;
    let parsed;
    try {
        parsed = JSON.parse(txt);
    } catch (e) {
        parsed = {};
    }

    return {
        // deterministic composition (not LLM)
        answer_is_correct: false,
        correct_answer: filledCorrectSentence,
        scores: rules.map(() => 0),

        // LLM-only explanation
        tip_if_wrong: String(parsed.tip_if_wrong ?? "")
    };
}


export async function translateIfNeeded({
                                            value = "",
                                            locale = null,
                                        }) {
    locale = locale === 'null' ? null : locale;

    const safeValue = String(value ?? "");

    // skip translation if no locale
    if (!locale) {
        return safeValue;
    }

    // skip if Ukrainian
    if (locale.toLowerCase().startsWith("uk")) {
        return safeValue;
    }

    const systemPrompt = `
You are a precise translator.
Return JSON only.

Schema:
{
  "translation": string
}
`;

    const userPrompt = `
Translate the following text from Ukrainian to locale "${locale}".

Rules:
1. Translate only part of the TEXT that is in Ukrainian. Never translate English part and preserve it as is
2. Preserve meaning exactly.
3. Keep tone natural.
4. Do not add explanations.
5. Return only JSON.

TEXT:
${safeValue}
`;

    const resp = await client.responses.create({
        model: "gpt-4.1-mini",
        temperature: 0.2,
        text: { format: { type: "json_object" } },
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    });

    const txt = resp.output_text;

    try {
        const parsed = JSON.parse(txt);
        return String(parsed.translation ?? safeValue);
    } catch {
        return safeValue;
    }
}

export async function translateSampleIfNeeded({
                                                  sample = null,
                                                  locale = null,
                                                  sourceKey = "ua",
                                              }) {
    const deterministicTranslation = getDeterministicSampleTranslation(sample, locale);

    if (deterministicTranslation) {
        return String(deterministicTranslation);
    }

    return translateIfNeeded({
        value: sample?.[sourceKey] ?? "",
        locale,
    });
}
