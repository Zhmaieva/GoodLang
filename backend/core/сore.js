// console.js (Node 18+, console app)
import OpenAI from "openai";
import {GrammarRule, LEVEL_RULES, RULE_LABELS} from "./rules.js";
import {ALL_RULES_SAMPLES} from "./allRulesSamples.js";

const client = new OpenAI({ apiKey:
        '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'
});
export const OPENAI_RUNTIME_MODEL = process.env.OPENAI_RUNTIME_MODEL || "gpt-5.4-mini";
export const OPENAI_QUICK_CHECK_MODEL = process.env.OPENAI_QUICK_CHECK_MODEL || "gpt-5.4-nano";

const languagesMap = {
    "Ukrainian": "ua",
    "English": "en",
}

const ALL_PROJECT_RULES = Object.freeze(Object.values(GrammarRule));
const PROJECT_RULE_SET = new Set(ALL_PROJECT_RULES);

function normalizeRuleList(rules = [], fallbackRules = []) {
    const normalized = [];
    for (const rule of [...(Array.isArray(rules) ? rules : []), ...(Array.isArray(fallbackRules) ? fallbackRules : [])]) {
        const ruleId = String(rule ?? "").trim();
        if (!ruleId || !PROJECT_RULE_SET.has(ruleId) || normalized.includes(ruleId)) continue;
        normalized.push(ruleId);
    }
    return normalized;
}

function formatRulesForPrompt(rules = ALL_PROJECT_RULES, fallbackRules = ALL_PROJECT_RULES) {
    return normalizeRuleList(rules, fallbackRules)
        .map((rule) => `${rule}: ${RULE_LABELS[rule] ?? rule}`)
        .join("\n");
}

function parseJsonObject(text) {
    try {
        const parsed = JSON.parse(text);
        return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
        return {};
    }
}

function neutralizeTutorTip(text = "", targetLocale = "uk-UA") {
    const safeText = String(text ?? "").trim();
    const safeLocale = String(targetLocale ?? "").toLowerCase();

    if (!safeText || !safeLocale.startsWith("uk")) return safeText;

    return safeText
        .replace(/Добре побудував(?:ла)? ([^.]+)\./gi, "Конструкцію $1 побудовано добре.")
        .replace(/Ти добре побудував(?:ла)?/gi, "Добре побудовано")
        .replace(/Ти побудував(?:ла)?/gi, "Побудовано")
        .replace(/Ти використав(?:ла)?/gi, "Використано")
        .replace(/Ти написав(?:ла)?/gi, "Написано")
        .replace(/Ти зробив(?:ла)?/gi, "Зроблено")
        .replace(/Ти виправив(?:ла)?/gi, "Виправлено")
        .replace(/Просто виправ/gi, "Варто лише виправити")
        .replace(/Виправ дрібні помилки/gi, "Варто виправити дрібні помилки")
        .replace(/(?:^|\s*)Усе речення має звучати так\.?$/gi, "")
        .replace(/(?:^|\s*)Все речення має звучати так\.?$/gi, "")
        .replace(/(?:^|\s*)Повне речення має звучати так\.?$/gi, "")
        .replace(/(?:^|\s*)Правильне речення має звучати так\.?$/gi, "")
        .replace(/(?:^|\s*)Усе речення повинно звучати так\.?$/gi, "")
        .replace(/(?:^|\s*)Все речення повинно звучати так\.?$/gi, "")
        .replace(/\s+/g, " ")
        .trim();
}

function normalizeGeneratedRules(modelRules = [], targetRules = [], allRules = ALL_PROJECT_RULES) {
    const allowed = new Set(normalizeRuleList(allRules, ALL_PROJECT_RULES));
    const out = [];
    const add = (rule) => {
        const ruleId = String(rule ?? "").trim();
        if (!ruleId || !allowed.has(ruleId) || out.includes(ruleId)) return;
        out.push(ruleId);
    };

    for (const rule of targetRules) add(rule);
    for (const rule of Array.isArray(modelRules) ? modelRules : []) add(rule);

    return out;
}

function normalizeOptions(options = [], correct = "") {
    const cleaned = [];
    for (const opt of Array.isArray(options) ? options : []) {
        const value = String(opt ?? "").trim();
        if (cleaned.includes(value)) continue;
        cleaned.push(value);
    }

    const correctValue = String(correct ?? "").trim();
    if (correctValue && !cleaned.includes(correctValue)) cleaned.unshift(correctValue);

    return cleaned.slice(0, 5);
}

function buildJsonResponseRequest({ input, temperature = 0.2, model = OPENAI_RUNTIME_MODEL }) {
    const useReasoningConfig = String(model).startsWith("gpt-5");
    return {
        model,
        ...(useReasoningConfig
            ? { reasoning: { effort: "low" } }
            : { temperature }),
        text: { format: { type: "json_object" } },
        input,
    };
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

export async function generateTranslationSample({
                                                    targetRules = [],
                                                    allRules = ALL_PROJECT_RULES,
                                                    level = null,
                                                    targetLocale = "uk-UA",
                                                    model = OPENAI_RUNTIME_MODEL,
                                                    avoidSentence = "",
                                                    vocabularyWord = null,
                                                }) {
    const requestedRules = normalizeRuleList(targetRules);
    if (!requestedRules.length) throw new Error("targetRules required");

    const allowedRules = normalizeRuleList(allRules, ALL_PROJECT_RULES);
    const primaryRule = requestedRules[0];
    const sourceLocale = !targetLocale || String(targetLocale).toLowerCase() === "null"
        ? "uk-UA"
        : String(targetLocale).trim();

    const systemPrompt = `
You generate ESL grammar translation practice samples.
Return JSON only.

Schema:
{
  "rules": string[],
  "text": string,
  "en": string[],
  "hint": string
}

Rules:
- Create exactly one natural sentence in SOURCE_LOCALE for a learner to translate into English.
- The English answer must require PRIMARY_RULE.
- If REQUESTED_RULES contains more than one rule, include as many requested rules as naturally possible without making the sentence awkward.
- "rules" must contain only IDs from PROJECT_RULES, with PRIMARY_RULE first.
- "rules" should include every PROJECT_RULE needed to judge the correct English answer.
- "en" must contain 2 to 4 acceptable English translations.
- "hint" must be a short hint in SOURCE_LOCALE about the grammar pattern, without giving away the full answer.
- Keep the sentence appropriate for CEFR_LEVEL when provided, impacting the vocabulary difficulty.
- VOCABULARY_WORD, when provided, is a neutral English dictionary base form.
- Express the meaning of VOCABULARY_WORD naturally in the SOURCE_LOCALE sentence. Never place the English VOCABULARY_WORD itself in the SOURCE_LOCALE sentence.
- Use VOCABULARY_WORD in every expected English translation, but fit it naturally to the sentence and required grammar rules. Conjugate verbs, pluralize nouns, or use a possessive form when the sentence requires it; do not force the supplied base form to appear unchanged.
- If PREVIOUS_SENTENCE_TO_AVOID is provided, create a clearly different follow-up sentence:
  - Do not reuse the same subject/person/entity.
  - Do not reuse the same object/topic/entity.
  - Do not reuse the same main verb/action, including close inflections of it.
  - Keep the grammar rule, but change the situation completely.
- Do not invent rule IDs. Do not include explanations outside JSON.
`;

    const userPrompt = `
PRIMARY_RULE: ${primaryRule}
REQUESTED_RULES: ${JSON.stringify(requestedRules)}
SOURCE_LOCALE: ${sourceLocale}
CEFR_LEVEL: ${level || "(not specified)"}
PREVIOUS_SENTENCE_TO_AVOID: ${avoidSentence ? JSON.stringify(String(avoidSentence)) : "(none)"}
VOCABULARY_WORD: ${vocabularyWord ? JSON.stringify(String(vocabularyWord)) : "(none)"}

PROJECT_RULES:
${formatRulesForPrompt(allowedRules)}
`;

    const resp = await client.responses.create(buildJsonResponseRequest({
        model,
        temperature: 0.45,
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    }));

    const parsed = parseJsonObject(resp.output_text);
    const rules = normalizeGeneratedRules(parsed.rules, requestedRules, allowedRules);
    const text = String(parsed.text ?? "").trim();
    const enRaw = Array.isArray(parsed.en) ? parsed.en : [parsed.en];
    const en = enRaw.map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, 4);
    const hint = String(parsed.hint ?? "").trim();

    if (!text || !en.length || !rules.includes(primaryRule)) {
        throw new Error("MODEL_RETURNED_INVALID_TRANSLATION_SAMPLE");
    }

    return { rules, text, en, hint };
}

export async function generateGapSample({
                                            targetRules = [],
                                            allRules = ALL_PROJECT_RULES,
                                            level = null,
                                            model = OPENAI_RUNTIME_MODEL,
                                            avoidSentence = "",
                                        }) {
    const requestedRules = normalizeRuleList(targetRules);
    if (!requestedRules.length) throw new Error("targetRules required");

    const allowedRules = normalizeRuleList(allRules, ALL_PROJECT_RULES);
    const primaryRule = requestedRules[0];

    const systemPrompt = `
You generate ESL multiple-choice gap-fill grammar practice samples.
Return JSON only.

Schema:
{
  "rules": string[],
  "en": string,
  "options": string[],
  "correct": string
}

Rules:
- Create one natural English sentence with exactly one "{GAP}" placeholder.
- The correct option must require PRIMARY_RULE.
- If REQUESTED_RULES contains more than one rule, include as many requested rules as naturally possible without making the sentence awkward.
- "rules" must contain only IDs from PROJECT_RULES, with PRIMARY_RULE first.
- "rules" should include every PROJECT_RULE needed to judge the sentence.
- "options" must contain 3 to 5 short choices, including "correct". Use "" as an option only when a zero article / no word answer is appropriate.
- Keep the sentence appropriate for CEFR_LEVEL when provided, impacting the vocabulary difficulty.
- If PREVIOUS_SENTENCE_TO_AVOID is provided, create a clearly different follow-up sentence:
  - Do not reuse the same subject/person/entity.
  - Do not reuse the same object/topic/entity.
  - Do not reuse the same main verb/action, including close inflections of it.
  - Keep the grammar rule, but change the situation completely.
- Do not invent rule IDs. Do not include explanations outside JSON.
`;

    const userPrompt = `
PRIMARY_RULE: ${primaryRule}
REQUESTED_RULES: ${JSON.stringify(requestedRules)}
CEFR_LEVEL: ${level || "(not specified)"}
PREVIOUS_SENTENCE_TO_AVOID: ${avoidSentence ? JSON.stringify(String(avoidSentence)) : "(none)"}

PROJECT_RULES:
${formatRulesForPrompt(allowedRules)}
`;

    const resp = await client.responses.create(buildJsonResponseRequest({
        model,
        temperature: 0.45,
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    }));

    const parsed = parseJsonObject(resp.output_text);
    const rules = normalizeGeneratedRules(parsed.rules, requestedRules, allowedRules);
    const en = String(parsed.en ?? "").trim();
    const correct = String(parsed.correct ?? "").trim();
    const options = normalizeOptions(parsed.options, correct);

    if (!en || (en.match(/\{GAP\}/g) || []).length !== 1 || !correct || !options.includes(correct) || !rules.includes(primaryRule)) {
        throw new Error("MODEL_RETURNED_INVALID_GAP_SAMPLE");
    }

    return { rules, en, options, correct };
}


export async function evaluateAndCoach({
                                           rules = [],
                                           targetLocale = 'uk-UA',       // the learner’s L1 for prompts
                                           userEnglish = "",                // learner's translation attempt (English)
                                           textToTranslate = "",
                                           hint = "",
                                           model = OPENAI_RUNTIME_MODEL,
                                       }) {

    const scoreRules = normalizeRuleList(rules);

    const systemPrompt = `
You are a friendly but precise ESL grammar tutor. You never invalidate informal speech.
Return JSON only.
Schema:
{
  "answer_is_correct": boolean,
  "correct_answer": string,
  "natural_answer": string | null,
  "tip_if_wrong": string,
  "scores": number[],
  "violated_rules": string[]
}
  `;

    const userPrompt = `
TARGET_LANGUAGE: ${targetLocale}
RULES_TO_SCORE_IN_ORDER: ${JSON.stringify(scoreRules)}
PROJECT_GRAMMAR_RULES:
${formatRulesForPrompt(ALL_PROJECT_RULES, [])}
TEXT_TO_TRANSLATE: ${textToTranslate}
HINT: ${hint}

TASKS:
1) Evaluate if LEARNER_ENGLISH is correct according to English rules and, if when HINT is present, first and foremost according to HINT and also referring to RULES_TO_SCORE_IN_ORDER[0] as the target rule, and if it is a correct translation from TEXT_TO_TRANSLATE. Pay extra attention to accurate translation. Never evaluate correctness of TEXT_TO_TRANSLATE itself. 
2) If wrong, give a helpful human tip in TARGET_LANGUAGE. Use gender-neutral, impersonal wording. For Ukrainian, avoid gendered past-tense verbs and direct forms such as "побудував", "побудувала", "виправив", "виправила", "зробив", "зробила"; prefer impersonal forms like "побудовано", "варто виправити", "потрібно використати". Do not say that the whole sentence should sound a certain way, because the correct answer is shown separately.
3) Also, give correct translation from TARGET_LANGUAGE to English.
4) If LEARNER_ENGLISH is correct and communicates the meaning well, but a native speaker would probably choose a more natural or idiomatic phrasing, return that phrasing in natural_answer. Do not use natural_answer for actual grammar corrections; those belong in correct_answer when answer_is_correct is false. Return null if LEARNER_ENGLISH is incorrect, already natural, or if the natural version would be almost identical.
5) Check LEARNER_ENGLISH against PROJECT_GRAMMAR_RULES and return every violated rule ID in violated_rules. Use only IDs from PROJECT_GRAMMAR_RULES. This list is the canonical project-wide rule list, not only the rules attached to this sentence.
6) For each rule in RULES_TO_SCORE_IN_ORDER, give score in output array accordingly: if LEARNER_ENGLISH is full grammatical mismatch of correct translation -> 0; ELSE if this exact particular specific rule was violated anywhere in LEARNER_ENGLISH -> 0; ELSE if absolutely correct -> 1; ELSE if 1 misused word or typo -> 0.95; ELSE if 2-3 misused words or typos -> 0.85; ELSE 0.75

LEARNER_ENGLISH: ${userEnglish || "(none)"}
`;

    const resp = await client.responses.create(buildJsonResponseRequest({
        model,
        temperature: 0.2,
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user",   content: [{ type: "input_text", text: userPrompt }] },
        ],
    }));


    // The Responses API returns structured items; easiest is to read the top-level output_text
    const txt = resp.output_text; // SDK helper that concatenates text parts
    const parsed = JSON.parse(txt);
    parsed.tip_if_wrong = neutralizeTutorTip(parsed.tip_if_wrong, targetLocale);
    parsed.violated_rules = normalizeRuleList(parsed.violated_rules, []);
    parsed.natural_answer = parsed.answer_is_correct && parsed.natural_answer
        ? String(parsed.natural_answer).trim()
        : null;

    if (parsed.natural_answer && clearText(parsed.natural_answer) === clearText(userEnglish)) {
        parsed.natural_answer = null;
    }

    return parsed;
}

export async function quickEvaluateAnswer({
                                              taskType = 0,
                                              rules = [],
                                              userEnglish = "",
                                              textToTranslate = "",
                                              options = [],
                                          }) {
    const scoreRules = normalizeRuleList(rules);

    const systemPrompt = `
You are a strict but fair ESL answer checker.
Return JSON only.
Schema:
{
  "answer_is_correct": boolean
}
`;

    const userPrompt = Number(taskType) === 1
        ? `
TASK_TYPE: GAP_CHOICE
RULES: ${JSON.stringify(scoreRules)}
SENTENCE_TEMPLATE: ${textToTranslate}
OPTIONS: ${JSON.stringify(options)}
LEARNER_CHOICE: ${userEnglish || "(none)"}

Return true only if LEARNER_CHOICE is the correct option for the sentence.
`
        : `
TASK_TYPE: TRANSLATION_TO_ENGLISH
RULES: ${JSON.stringify(scoreRules)}
SOURCE_TEXT: ${textToTranslate}
LEARNER_ENGLISH: ${userEnglish || "(none)"}

Return true only if LEARNER_ENGLISH is an accurate English translation of SOURCE_TEXT and satisfies the listed grammar rules.
`;

    const resp = await client.responses.create(buildJsonResponseRequest({
        model: OPENAI_QUICK_CHECK_MODEL,
        temperature: 0,
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    }));

    const parsed = parseJsonObject(resp.output_text);

    return {
        answer_is_correct: !!parsed.answer_is_correct,
    };
}

export async function evaluateGapAndCoach({
                                              task,
                                              userAnswer = "",
                                              targetLocale = "uk-UA",
                                              model = OPENAI_RUNTIME_MODEL,
                                          }) {
    const { rules = [], en = [], options = [], correct } = task;
    const scoreRules = normalizeRuleList(rules);

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

    if (correct == null || String(correct).trim() === "") {
        const systemPrompt = `
You are a friendly but precise ESL grammar tutor.
Return JSON only.
Schema:
{
  "answer_is_correct": boolean,
  "correct_answer": string,
  "tip_if_wrong": string,
  "scores": number[],
  "violated_rules": string[]
}
`;

        const userPrompt = `
TARGET_LANGUAGE: ${targetLocale}
RULES_TO_SCORE_IN_ORDER: ${JSON.stringify(scoreRules)}
PROJECT_GRAMMAR_RULES:
${formatRulesForPrompt(ALL_PROJECT_RULES, [])}

TASK_TYPE: GAP_CHOICE
SENTENCE_TEMPLATE: ${sentence}
OPTIONS: ${JSON.stringify(options)}
LEARNER_CHOICE: ${userAnswer || "(none)"}

INSTRUCTIONS:
1) Pick the correct option for SENTENCE_TEMPLATE from OPTIONS when OPTIONS are provided.
2) Evaluate whether LEARNER_CHOICE is correct.
3) correct_answer must be the full sentence with {GAP} replaced by the correct option.
4) If wrong, give a short helpful tip in TARGET_LANGUAGE. Use gender-neutral, impersonal wording. For Ukrainian, avoid gendered past-tense verbs and direct forms such as "побудував", "побудувала", "виправив", "виправила", "зробив", "зробила"; prefer impersonal forms like "побудовано", "варто виправити", "потрібно використати". Do not say that the whole sentence should sound a certain way, because the correct answer is shown separately.
5) Check the learner answer against PROJECT_GRAMMAR_RULES and return every violated rule ID in violated_rules. Use only IDs from PROJECT_GRAMMAR_RULES. This list is the canonical project-wide rule list, not only the rules attached to this sentence.
6) Return one score for each rule in RULES_TO_SCORE_IN_ORDER, in order: 1 when the rule is satisfied, 0 when it is violated.
`;

        const resp = await client.responses.create(buildJsonResponseRequest({
            model,
            temperature: 0.2,
            input: [
                { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
                { role: "user", content: [{ type: "input_text", text: userPrompt }] }
            ]
        }));

        const parsed = parseJsonObject(resp.output_text);
        const scores = Array.isArray(parsed.scores) ? parsed.scores.slice(0, scoreRules.length) : scoreRules.map(() => parsed.answer_is_correct ? 1 : 0);

        while (scores.length < scoreRules.length) {
            scores.push(parsed.answer_is_correct ? 1 : 0);
        }

        return {
            answer_is_correct: !!parsed.answer_is_correct,
            correct_answer: String(parsed.correct_answer ?? ""),
            tip_if_wrong: neutralizeTutorTip(parsed.tip_if_wrong, targetLocale),
            scores,
            violated_rules: normalizeRuleList(parsed.violated_rules, [])
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
1) Give a short, helpful tip in TARGET_LANGUAGE explaining why LEARNER_CHOICE is wrong and why CORRECT_OPTION fits. Use gender-neutral, impersonal wording. For Ukrainian, avoid gendered past-tense verbs and direct forms such as "побудував", "побудувала", "виправив", "виправила", "зробив", "зробила"; prefer impersonal forms like "побудовано", "варто виправити", "потрібно використати". Do not say that the whole sentence should sound a certain way, because the correct answer is shown separately.
2) Never mention the grammar rule names (GRAMMAR_RULES) as they are.
3) Keep it practical and short (1-3 sentences).
4) Do NOT include any other keys besides tip_if_wrong.
5) Also if you use English words, explaining the mistake, specify TARGET_LANGUAGE translations next to them
`;

    const resp = await client.responses.create(buildJsonResponseRequest({
        model,
        temperature: 0.2,
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] }
        ]
    }));

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
        violated_rules: scoreRules,

        // LLM-only explanation
        tip_if_wrong: neutralizeTutorTip(parsed.tip_if_wrong, targetLocale)
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

    const resp = await client.responses.create(buildJsonResponseRequest({
        temperature: 0.2,
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    }));

    const txt = resp.output_text;

    try {
        const parsed = JSON.parse(txt);
        return String(parsed.translation ?? safeValue);
    } catch {
        return safeValue;
    }
}

function getLanguageNameFromLocale(locale = "uk-UA") {
    const safeLocale = String(locale ?? "").toLowerCase();

    if (safeLocale.startsWith("uk")) return "Ukrainian";
    if (safeLocale.startsWith("ru")) return "Russian";
    if (safeLocale.startsWith("en")) return "English";
    if (safeLocale.startsWith("pl")) return "Polish";
    if (safeLocale.startsWith("de")) return "German";
    if (safeLocale.startsWith("fr")) return "French";
    if (safeLocale.startsWith("es")) return "Spanish";
    if (safeLocale.startsWith("it")) return "Italian";
    if (safeLocale.startsWith("pt")) return "Portuguese";
    if (safeLocale.startsWith("nl")) return "Dutch";
    if (safeLocale.startsWith("sv")) return "Swedish";
    if (safeLocale.startsWith("no")) return "Norwegian";
    if (safeLocale.startsWith("cs")) return "Czech";
    if (safeLocale.startsWith("sk")) return "Slovak";
    if (safeLocale.startsWith("hu")) return "Hungarian";
    if (safeLocale.startsWith("ro")) return "Romanian";
    if (safeLocale.startsWith("bg")) return "Bulgarian";
    if (safeLocale.startsWith("el")) return "Greek";
    if (safeLocale.startsWith("tr")) return "Turkish";
    if (safeLocale.startsWith("zh")) return "Simplified Chinese";
    if (safeLocale.startsWith("ja")) return "Japanese";
    if (safeLocale.startsWith("ko")) return "Korean";
    if (safeLocale.startsWith("th")) return "Thai";
    if (safeLocale.startsWith("vi")) return "Vietnamese";
    if (safeLocale.startsWith("da")) return "Danish";
    if (safeLocale.startsWith("id")) return "Indonesian";
    if (safeLocale.startsWith("ms")) return "Malay";
    if (safeLocale.startsWith("he")) return "Hebrew";
    if (safeLocale.startsWith("ar")) return "Arabic";

    return "English";
}

export const SUPPORTED_VOCABULARY_LOCALES = Object.freeze([
    "uk-UA", "ru-RU", "pl-PL", "de-DE", "fr-FR", "es-ES", "it-IT", "pt-PT", "nl-NL",
    "sv-SE", "no-NO", "da-DK", "fi-FI", "cs-CZ", "sk-SK", "hu-HU", "ro-RO", "bg-BG",
    "el-GR", "tr-TR", "zh-CN", "ja-JP", "ko-KR", "th-TH", "vi-VN", "id-ID", "ms-MY",
    "he-IL", "ar-SA",
]);

export async function translateVocabularyWords({
                                                   words = [],
                                                   locale = "uk-UA",
                                               } = {}) {
    const uniqueWords = [...new Set(
        (Array.isArray(words) ? words : [])
            .map((word) => String(word ?? "").trim().toLowerCase())
            .filter(Boolean)
    )];

    if (!uniqueWords.length) return {};

    const targetLanguage = getLanguageNameFromLocale(locale);
    const systemPrompt = `
You translate English vocabulary items for a language-learning app.
Return JSON only.

Schema:
{
  "translations": [
    { "word": string, "translation": string }
  ]
}
`;

    const userPrompt = `
Translate each English word into ${targetLanguage}.

Rules:
1. Use a short dictionary-style translation.
2. Keep one or two common meanings only.
3. Do not add examples or explanations.
4. Preserve the input word exactly in the "word" field.

WORDS:
${JSON.stringify(uniqueWords)}
`;

    const resp = await client.responses.create(buildJsonResponseRequest({
        model: OPENAI_QUICK_CHECK_MODEL,
        temperature: 0,
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    }));

    const parsed = parseJsonObject(resp.output_text);
    const translations = {};

    for (const item of Array.isArray(parsed.translations) ? parsed.translations : []) {
        const word = String(item?.word ?? "").trim().toLowerCase();
        const translation = String(item?.translation ?? "").trim();
        if (word && translation) translations[word] = translation;
    }

    return translations;
}

export async function translateVocabularyWordsForLocales({
    words = [],
    locales = SUPPORTED_VOCABULARY_LOCALES,
} = {}) {
    const uniqueWords = [...new Set((Array.isArray(words) ? words : [])
        .map((word) => String(word ?? "").trim().toLowerCase()).filter(Boolean))];
    const requestedLocales = [...new Set((Array.isArray(locales) ? locales : SUPPORTED_VOCABULARY_LOCALES)
        .filter((locale) => SUPPORTED_VOCABULARY_LOCALES.includes(locale)))];
    if (!uniqueWords.length || !requestedLocales.length) return {};

    const languageList = requestedLocales
        .map((locale) => `${locale}: ${getLanguageNameFromLocale(locale)}`)
        .join(", ");
    const resp = await client.responses.create(buildJsonResponseRequest({
        model: OPENAI_QUICK_CHECK_MODEL,
        temperature: 0,
        input: [
            {
                role: "system",
                content: [{ type: "input_text", text: `Translate English vocabulary words into every requested locale. Return JSON only as {"translations":[{"word":string,"translations":{"locale":string}}]}. Use short dictionary-style translations. Locales: ${languageList}` }],
            },
            {
                role: "user",
                content: [{ type: "input_text", text: `WORDS:\n${JSON.stringify(uniqueWords)}` }],
            },
        ],
    }));
    const parsed = parseJsonObject(resp.output_text);
    const result = {};
    for (const item of Array.isArray(parsed.translations) ? parsed.translations : []) {
        const word = String(item?.word ?? "").trim().toLowerCase();
        if (!word || !uniqueWords.includes(word)) continue;
        const values = {};
        for (const locale of requestedLocales) {
            const value = String(item?.translations?.[locale] ?? "").trim();
            if (value) values[locale] = value;
        }
        if (Object.keys(values).length) result[word] = values;
    }
    return result;
}

function extractVocabularyEvaluationWords(text = "") {
    const words = String(text).match(/[A-Za-z][A-Za-z'-]*/g) ?? [];
    return [...new Set(words.map((word) => word.toLowerCase()))];
}

export async function evaluateVocabularyUsage({
    targetSentence = "",
    userAnswer = "",
    targetLocale = "uk-UA",
    fallbackLevel = "A1",
    model = OPENAI_RUNTIME_MODEL,
} = {}) {
    const validCefrLevels = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
    const safeFallbackLevel = validCefrLevels.has(String(fallbackLevel).toUpperCase())
        ? String(fallbackLevel).toUpperCase()
        : "A1";
    const words = [...new Set([
        ...extractVocabularyEvaluationWords(targetSentence),
        ...extractVocabularyEvaluationWords(userAnswer),
    ])];
    if (!words.length) return { words: [], feedback: "", translations: {} };

    const getTargetTranslations = async (evaluatedWords) => {
        try {
            const translated = await translateVocabularyWords({
                words: evaluatedWords.map((item) => item.word),
                locale: targetLocale,
            });
            return Object.fromEntries(Object.entries(translated).map(([word, translation]) => [word, {
                [targetLocale]: translation,
            }]));
        } catch (error) {
            console.error("Failed to translate vocabulary target locale:", error);
            return {};
        }
    };

    const targetLanguage = getLanguageNameFromLocale(targetLocale);
    const systemPrompt = `
You evaluate English vocabulary usage in a learner's English translation.
Return JSON only. Do not evaluate verb tense: a wrong verb tense is still correct here.
Return only established, real English vocabulary headwords or a high-confidence correction to an
established, real English word. Never return an invented spelling, nonce word, keyboard mash,
transliteration, or other nonsense token as a vocabulary word.
If a learner token is not a real English word and context does not identify exactly one credible real
English correction with high confidence, omit that token completely. Do not guess the nearest-looking
word, do not add it to feedback, and do not return a vocabulary record for it.
Each returned object must include the neutral dictionary base form of the English word, correct
(boolean), mistakeType (null, "spelling", or "word_fit"), and lexicalStatus ("real" or
"clear_correction"). Use lexicalStatus="real" only for an established English word. Use
lexicalStatus="clear_correction" only when a misspelling or misuse has one unambiguous established
English counterpart supported by the sentence context.
The "word" field must always be a basic vocabulary headword, never the surface form from the sentence:
- Remove possessive forms: "teacher's" becomes "teacher".
- Return nouns in singular form: "phones" becomes "phone".
- Return verbs in their bare present-simple dictionary form: "calls", "called", and "calling" become "call"; "went" becomes "go".
- Return other parts of speech in their neutral dictionary form.
Judge whether the learner used the surface word correctly before reducing it to its base form. A required
tense, number, or possessive inflection is not a vocabulary mistake.
Assign each word its English vocabulary CEFR level: A1, A2, B1, B2, C1, or C2.
Do not omit a supplied real English word because it is correct. Correct real words must also be
returned with correct=true, mistakeType=null, and lexicalStatus="real". The requirement to return
correct words never applies to nonsense or unresolved tokens; those must be omitted.
For a spelling mistake, first identify the corrected intended word and then return its neutral base form
in the "word" field (for example, the learner's "cal" may be returned as "call" when the sentence
clearly supports that correction). If multiple corrections are plausible, omit the token.
Also add important English vocabulary words that the target sentence intends the learner to use
but that are missing from the learner answer. Do not mark a word incorrect merely because it was omitted.
This applies even when the target sentence is localized and contains no English tokens.
Mark a word incorrect only when there is direct evidence of a spelling mistake or an incorrect
translation/word choice in the learner answer. When uncertain, use correct=true and mistakeType=null.
Do not mention grammar or verb tense. Add only real words used or clearly intended by the target sentence.
Before returning each item, verify that its "word" is an attested English dictionary headword. When
that verification is uncertain, omit the item.
Schema: {"words":[{"word":string,"correct":boolean,"mistakeType":null|"spelling"|"word_fit","lexicalStatus":"real"|"clear_correction","level":"A1"|"A2"|"B1"|"B2"|"C1"|"C2"}]}
`;
    const userPrompt = `
TARGET SENTENCE:
${String(targetSentence)}

LEARNER ANSWER:
${String(userAnswer)}

VOCABULARY WORDS TO CHECK:
${JSON.stringify(words)}
`;
    const resp = await client.responses.create(buildJsonResponseRequest({
        model,
        temperature: 0,
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    }));
    const parsed = parseJsonObject(resp.output_text);
    const evaluated = [];
    for (const item of Array.isArray(parsed.words) ? parsed.words : []) {
        const word = String(item?.word ?? "").trim().toLowerCase();
        if (!/^[a-z][a-z'-]*$/.test(word) || evaluated.some((entry) => entry.word === word)) continue;
        const lexicalStatus = ["real", "clear_correction"].includes(item?.lexicalStatus)
            ? item.lexicalStatus
            : null;
        if (!lexicalStatus) continue;
        const explicitMistakeType = ["spelling", "word_fit"].includes(item?.mistakeType)
            ? item.mistakeType
            : null;
        const isExplicitMistake = item?.correct === false && explicitMistakeType !== null;
        const mistakeType = isExplicitMistake ? explicitMistakeType : null;
        const level = validCefrLevels.has(String(item?.level).toUpperCase())
            ? String(item.level).toUpperCase()
            : safeFallbackLevel;
        evaluated.push({
            word,
            correct: !isExplicitMistake,
            mistakeType,
            lexicalStatus,
            isRealEnglishWord: true,
            level,
        });
    }
    const mistakes = evaluated.filter((item) => item.correct !== true);
    if (!mistakes.length) {
        return {
            words: evaluated,
            feedback: "",
            translations: await getTargetTranslations(evaluated),
        };
    }

    const feedbackResponse = await client.responses.create(buildJsonResponseRequest({
        model,
        temperature: 0,
        input: [
            {
                role: "system",
                content: [{
                    type: "input_text",
                    text: `Explain only the spelling and word-fit mistakes in one short paragraph in ${targetLanguage}. Do not mention grammar or verb tense. Return JSON: {"feedback":string}`,
                }],
            },
            {
                role: "user",
                content: [{
                    type: "input_text",
                    text: `${userPrompt}\nEVALUATED WORDS:\n${JSON.stringify(mistakes)}`,
                }],
            },
        ],
    }));
    const feedback = parseJsonObject(feedbackResponse.output_text);
    return {
        words: evaluated,
        feedback: String(feedback.feedback ?? "").trim(),
        translations: await getTargetTranslations(evaluated),
    };
}
