// index.js
import readline from 'readline';
import {evaluateAndCoach, randomRule} from './сore.js';
import { GrammarRule } from './rules.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(q) {
    return new Promise((resolve) => rl.question(q, (a) => resolve(a.trim())));
}

async function runTutor() {
    console.log("\n🎓 Welcome to Grammar Tutor!");
    console.log("Type 'exit' anytime to quit.\n");

    let currentRule = null;            // active rule for the current “thread”
    let currentPrompt = null;          // the sentence (in target language) to translate next
    const targetLanguage = "Ukrainian";

    while (true) {
        try {
            // If we don't have an active rule/prompt, start a new round.
            if (!currentRule) currentRule = randomRule();

            // If there's no prompt yet, ask API for a fresh sample sentence for this rule.
            if (!currentPrompt) {
                const seed = await evaluateAndCoach({
                    rule: currentRule,
                    targetLanguage,
                    userEnglish: "",
                });
                currentPrompt = seed.sample_in_target_language || "(no prompt received)";
            }

            console.log(`\n📘 Rule: ${currentRule}`);
            console.log(`Translate this sentence into English:\n👉  ${currentPrompt}\n`);

            const userInput = await ask("Your English translation: ");
            if (userInput.toLowerCase() === "exit") break;

            const result = await evaluateAndCoach({
                rule: currentRule,
                targetLanguage,
                userEnglish: userInput,
                textToTranslate: currentPrompt,
            });

            console.log("\n--- Feedback ---");
            if (result.answer_is_correct) {
                console.log("✅ Correct!");
                if (result.correct_answer) console.log("✔️ Model's version:", result.correct_answer);

                // ✅ End this thread and start a brand-new random rule next loop
                currentRule = null;
                currentPrompt = null;
                continue;
            }

            // ❌ Not correct — stay on the same rule “thread”
            console.log("❌ Not quite right.");
            if (result.correct_answer) console.log("💡 Correct sentence:", result.correct_answer);
            if (result.tip_if_wrong)   console.log("💡 Tip:", result.tip_if_wrong);
            console.log("🚫 Violated rules:", (result.violated_rules && result.violated_rules.length)
                ? result.violated_rules.join(", ")
                : "none");

            // 🔁 If the model gave a supplementary sentence, use it next.
            // Otherwise, retry with the same prompt to reinforce.
            if (result.next_target_sentence && result.next_target_sentence.trim().length > 0) {
                console.log("\n🧩 Try this supplementary one next (same rule).");
                currentPrompt = result.next_target_sentence.trim();
            } else {
                console.log("\n🔁 Let's try the same sentence again for practice.");
                // keep currentPrompt unchanged
            }

            // loop continues with same rule & updated prompt
        } catch (err) {
            console.error("\n⚠️ Error:", err?.message || err);
            // On API errors, softly recover by resetting the thread
            currentRule = null;
            currentPrompt = null;
        }
    }

    rl.close();
    console.log("\n👋 Goodbye!");
}

runTutor();
