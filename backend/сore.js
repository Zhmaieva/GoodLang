// console.js (Node 18+, console app)
import OpenAI from "openai";
import {GrammarRule, LEVEL_RULES} from "../shared/rules.js";

const client = new OpenAI({ apiKey: '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' });


export function randomRule(level) {
    const values = LEVEL_RULES[level];
    return values[Math.floor(Math.random() * values.length)];
}

// Core function
export async function evaluateAndCoach({
                                           rule = GrammarRule.TO_BE,
                                           targetLanguage = "Ukrainian",       // the learner’s L1 for prompts
                                           userEnglish = "",                // learner's translation attempt (English)
                                           textToTranslate = "",
                                           difficulty = "A2",               // A1–B2, affects sample complexity
                                       }) {


    const systemPrompt = `
You are a friendly but precise ESL grammar tutor.
Return JSON only.
Schema:
{
  "rule": string,
  "sample_in_target_language": string,
  "answer_is_correct": boolean,
  "correct_answer": string,
  "tip_if_wrong": string,
  "next_target_sentence": string,
  "violated_rules": string[],
  "score": number
}
Difficulty: ${difficulty}.
  `;

    const userPrompt = `
TARGET_LANGUAGE: ${targetLanguage}
GRAMMAR_RULE: ${rule}
TEXT_TO_TRANSLATE: ${textToTranslate}

TASKS:
1) If LEARNER_ENGLISH IS empty, create a short sample sentence in TARGET_LANGUAGE that demonstrates the rule (GRAMMAR_RULE). Then do not do next steps.
2) If LEARNER_ENGLISH is NOT empty, evaluate if it's correct according to English rules and if it is a correct translation from TEXT_TO_TRANSLATE. Pay extra attention to accurate translation.
3) If wrong, give a helpful human tip and new short sentence to translate next.
4) Also, give correct translation from TARGET_LANGUAGE to English.
5) List violated rules.
6) Give score: 1 - correct, 0.75 - 1 spelling mistake, 0.5 - 2-3 spelling mistakes, 0.25 - 3+ spelling mistakes, but grammatically correct, 0 - wrong.

LEARNER_ENGLISH: ${userEnglish || "(none)"}
`;

    const resp = await client.responses.create({
        model: "gpt-4.1-mini",
        temperature: 0.2,

        // ✅ use a format object (not a plain string)
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
