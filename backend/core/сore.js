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
    .split(',').join('');

export function preEvaluate({
                                      rules = [],
                                      targetLanguage = "Ukrainian",       // the learner’s L1 for prompts
                                      userEnglish = "",                // learner's translation attempt (English)
                                      textToTranslate = ""
                                  }) {
    const targetRule = rules[0];
    const languageCode = languagesMap[targetLanguage];
    const targetSample = ALL_RULES_SAMPLES[targetRule].find(x => x[languageCode] === textToTranslate || Array.isArray(x[languageCode]) && x[languageCode].find(xx => xx === textToTranslate));
    const validTranslation = Array.isArray(targetSample[languagesMap["English"]])
        ? targetSample[languagesMap["English"]].find((expectedTranslation) => {
            return clearText(expectedTranslation) === clearText(userEnglish);
        })
        : clearText(targetSample[languagesMap["English"]]) === clearText(userEnglish);

    const result = !!validTranslation;

    return {
        answer_is_correct: result,
        scores: rules.map(() => (result ? 1 : 0))
    };
}


export async function evaluateAndCoach({
                                           rules = [],
                                           targetLanguage = "Ukrainian",       // the learner’s L1 for prompts
                                           userEnglish = "",                // learner's translation attempt (English)
                                           textToTranslate = ""
                                       }) {


    const systemPrompt = `
You are a friendly but precise ESL grammar tutor.
Return JSON only.
Schema:
{
  "sample_in_target_language": string,
  "answer_is_correct": boolean,
  "correct_answer": string,
  "tip_if_wrong": string,
  "scores": number[]
}
  `;

    const userPrompt = `
TARGET_LANGUAGE: ${targetLanguage}
GRAMMAR_RULES: [${rules.join(', ')}]
TEXT_TO_TRANSLATE: ${textToTranslate}

TASKS:
1) Evaluate if LEARNER_ENGLISH is correct according to English rules and if it is a correct translation from TEXT_TO_TRANSLATE. Pay extra attention to accurate translation. Never evaluate correctness of TEXT_TO_TRANSLATE itself. 
2) If wrong, give a helpful human tip in TARGET_LANGUAGE
3) Also, give correct translation from TARGET_LANGUAGE to English.
4) For each of GRAMMAR_RULES exactly, give score in output array accordingly: 1 - correct, 0.75 - 1 spelling mistake, 0.5 - 2-3 spelling mistakes, 0.25 - 3+ spelling mistakes, but grammatically correct, 0 - wrong. If the LEARNER_ENGLISH is complete mismatch of translation, then give 0 to every rule.

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
