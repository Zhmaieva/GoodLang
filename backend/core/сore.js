// console.js (Node 18+, console app)
import OpenAI from "openai";
import {LEVEL_RULES} from "./rules.js";
import {ALL_RULES_SAMPLES} from "./allRulesSamples.js";

const client = new OpenAI({ apiKey: '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' });

const languagesMap = {
    "Ukrainian": "ua",
    "English": "en",
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

// Generates topic vocabulary words (English) for a given CEFR level.
// - topic: string up to 64 symbols
// - level: A1..C2
// - numberOfWords: clamped 5..30
export async function generateTopicWords({
                                             topic = "",
                                             level = "A2",
                                             numberOfWords = 12,
                                         }) {
    const t = String(topic ?? "").trim().slice(0, 64);
    if (!t) throw new Error("topic required");

    const lvl = String(level ?? "").trim().toUpperCase();
    const allowed = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
    if (!allowed.has(lvl)) throw new Error("level must be A1..C2");

    const n = Math.max(5, Math.min(30, Number.parseInt(String(numberOfWords ?? ""), 10) || 12));

    const systemPrompt = `
You generate English vocabulary lists for language learners.
Return JSON only.
Schema:
{
  "words": string[]
}
Rules:
- Return exactly N unique items.
- Items must be English vocabulary suitable for CEFR LEVEL.
- Only single words.
- No punctuation at the end, no numbering, no extra keys.
`;

    const userPrompt = `
TOPIC: ${t}
LEVEL: ${lvl}
N: ${n}

Generate a list of N useful English vocabulary items for this topic and level.
`;

    const resp = await client.responses.create({
        model: "gpt-4.1-mini",
        temperature: 0.3,
        text: { format: { type: "json_object" } },
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    });

    const txt = resp.output_text;
    let parsed;
    try {
        parsed = JSON.parse(txt);
    } catch {
        parsed = {};
    }

    const wordsRaw = Array.isArray(parsed.words) ? parsed.words : [];
    // Post-sanitize to be safe and deterministic
    const cleaned = [];
    const seen = new Set();
    for (const w of wordsRaw) {
        const s = String(w ?? "").trim();
        if (!s) continue;
        const norm = s.toLowerCase();
        if (seen.has(norm)) continue;
        seen.add(norm);
        cleaned.push(s);
        if (cleaned.length >= n) break;
    }

    // If model returned fewer than requested, hard fail (so caller can retry/log)
    if (cleaned.length !== n) {
        throw new Error(`MODEL_RETURNED_${cleaned.length}_WORDS_EXPECTED_${n}`);
    }

    return cleaned;
}

// Create a factual mini-story using ALL provided words.
// Each word must appear exactly once wrapped in curly braces: {word}
// Then we replace them with {GAP} and return the final text + answers in order.
export async function generateGapStoryFromWords({
                                                    words = [],
                                                    level = "A2", // optional: influences sentence complexity
                                                    topicHint = "", // optional: helps anchor the story
                                                }) {
    const raw = Array.isArray(words) ? words : [];
    const cleanedWords = raw
        .map((w) => String(w ?? "").trim())
        .filter(Boolean);

    if (!cleanedWords.length) throw new Error("words must be a non-empty array");

    // de-dup by lowercase (keep first)
    const seen = new Set();
    const uniqWords = [];
    for (const w of cleanedWords) {
        const k = w.toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        uniqWords.push(w);
    }

    if (uniqWords.length < 3) throw new Error("need at least 3 unique words");
    if (uniqWords.length > 40) throw new Error("too many words (max 40)");

    const lvl = String(level ?? "").trim().toUpperCase();
    const allowed = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
    const safeLevel = allowed.has(lvl) ? lvl : "A2";

    const safeHint = String(topicHint ?? "").trim().slice(0, 80);

    const systemPrompt = `
You write short factual mini-stories for ESL learners.
Return JSON only.
Schema:
{
  "text": string
}
Rules:
- The story MUST be based on exactly ONE real fact story (science article/history/person/place/event).
- The story MUST reference a name of a famous person/work of art/landmark/brand in at least every second sentence.
- The story MUST come with a surprise fact in at least every third sentence.
- Use EVERY provided WORD exactly once, and ONLY once.
- Each provided WORD must appear wrapped in curly braces: {WORD}
- Story MUST develop into a few paragraphs: start with a hook, then intro, then main theme, then conclusion or open question.
- Split paragraphs with [[p]]
- You MUST use connecting sentences and connecting words to add intermediate context between each sentence with the WORD.
- Do NOT use braces for anything else.
- Do NOT add extra brace words beyond the list.
`;

    const userPrompt = `
LEVEL: ${safeLevel}

WORDS (use each exactly once, wrapped in braces):
${uniqWords.map((w) => `- ${w}`).join("\n")}

Return JSON with "text".
`;

    const resp = await client.responses.create({
        model: "gpt-5.1",
        temperature: 0.35,
        text: { format: { type: "json_object" } },
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    });

    const txt = resp.output_text;
    let parsed;
    try {
        parsed = JSON.parse(txt);
    } catch {
        parsed = {};
    }

    const storyText = String(parsed.text ?? "").trim();
    if (!storyText) throw new Error("MODEL_RETURNED_EMPTY_TEXT");

    // --- Extract {word} placeholders in appearance order ---
    // We only consider braces that match one of our required words (case-insensitive)
    const requiredMap = new Map(uniqWords.map((w) => [w.toLowerCase(), w]));
    const found = [];
    const counts = new Map(); // lower -> count

    const re = /\{([^{}]+)\}/g;
    let m;
    while ((m = re.exec(storyText)) !== null) {
        const inside = String(m[1] ?? "").trim();
        if (!inside) continue;
        const key = inside.toLowerCase();
        if (requiredMap.has(key)) {
            found.push(requiredMap.get(key)); // push canonical original casing
            counts.set(key, (counts.get(key) || 0) + 1);
        } else {
            // model used braces for something else -> hard fail to keep deterministic
            throw new Error(`UNEXPECTED_BRACED_TOKEN: ${inside}`);
        }
    }

    // // Validate: every required word appears exactly once
    // for (const w of uniqWords) {
    //     const k = w.toLowerCase();
    //     const c = counts.get(k) || 0;
    //     if (c !== 1) {
    //         throw new Error(`WORD_USAGE_INVALID: "${w}" count=${c}`);
    //     }
    // }

    // // Validate: number of found placeholders matches uniqWords length
    // if (found.length !== uniqWords.length) {
    //     throw new Error(`GAPS_COUNT_MISMATCH found=${found.length} expected=${uniqWords.length}`);
    // }

    // Replace ALL {word} occurrences with {GAP} (case-insensitive exact match inside braces)
    // Since we already validated exact counts, we can do a generic replace.
    const textWithGaps = storyText.replace(re, "{GAP}");

    return {
        text: textWithGaps,
        answers: found, // in exact gap order
        // optional: for debugging
        // originalText: storyText,
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