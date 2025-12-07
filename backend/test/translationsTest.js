import { translationsController } from "../controllers/translationController.js";
import { GrammarRule } from "../core/rules.js";

const errorsByRule = {};

// helper для запису помилки
function recordError(rule, skip, message, extra = {}) {
    if (!errorsByRule[rule]) {
        errorsByRule[rule] = {};
    }
    if (!errorsByRule[rule][message]) {
        errorsByRule[rule][message] = {
            count: 0,
            samples: [],
        };
    }

    const entry = errorsByRule[rule][message];
    entry.count += 1;

    // зберігаємо кілька (наприклад до 5) прикладів для кожного типу помилки
    if (entry.samples.length < 5) {
        entry.samples.push({ skip, ...extra });
    }
}

function createFakeReq(rule, skip, options = {}) {
    const { textToTranslate, translation } = options;

    const query = {
        rules: [rule],        // тренуємо конкретне правило
        seed: "1",
        skip: String(skip),
    };

    if (textToTranslate !== undefined) {
        query.textToTranslate = textToTranslate;
    }
    if (translation !== undefined) {
        query.translation = translation;
    }

    return {
        user: {
            id: "test-account-id",
        },
        query,
    };
}

function createFakeRes(rule, skip, phase = "generate", onSuccessPayload) {
    const res = {
        statusCode: 200,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            // якщо statusCode >= 400, вважаємо це помилкою
            if (this.statusCode >= 400) {
                recordError(
                    rule,
                    skip,
                    `HTTP ${this.statusCode}`,
                    { payload, phase }
                );
                return;
            }

            // базова логічна валідація відповіді
            if (!payload || !payload.rules || !payload.textToTranslate) {
                recordError(
                    rule,
                    skip,
                    "Invalid response: missing rules or textToTranslate",
                    { payload, phase }
                );
            } else if (typeof onSuccessPayload === "function") {
                // якщо все ок — передаємо payload далі (наприклад, щоб зробити другий запит)
                onSuccessPayload(payload);
            }

            // інакше – все ок, нічого не логимо
        },
    };

    return res;
}

async function testRule(rule) {
    //console.log(`\n=== Testing rule: ${rule} ===`);

    for (let skip = 0; skip < 1000; skip++) {
        let generatedSample = null;

        // 1) Перший виклик: отримати textToTranslate
        const reqGenerate = createFakeReq(rule, skip);
        const resGenerate = createFakeRes(
            rule,
            skip,
            "generate",
            (payload) => {
                generatedSample = payload;
            }
        );

        try {
            await translationsController.handleTranslationRequest(
                reqGenerate,
                resGenerate,
                (err) => {
                    // обробка next(err)
                    if (err) {
                        recordError(
                            rule,
                            skip,
                            err.message || String(err),
                            { fromNext: true, phase: "generate" }
                        );
                    }
                },
                { skipCoach: true }
            );
        } catch (e) {
            // виняток з handleTranslationRequest
            recordError(
                rule,
                skip,
                e.message || String(e),
                { stack: e.stack, phase: "generate" }
            );
        }

        // якщо згенерувати приклад не вдалось — немає сенсу робити другий виклик
        if (!generatedSample || !generatedSample.textToTranslate) {
            continue;
        }

        // 2) Другий виклик: відправляємо назад textToTranslate і translation = "test"
        const reqAnswer = createFakeReq(rule, skip, {
            textToTranslate: generatedSample.textToTranslate,
            translation: "test",
        });
        const resAnswer = createFakeRes(rule, skip, reqAnswer.query.textToTranslate);

        try {
            await translationsController.handleTranslationRequest(
                reqAnswer,
                resAnswer,
                (err) => {
                    if (err) {
                        recordError(
                            rule,
                            skip,
                            err.message || String(err),
                            { fromNext: true, phase: reqAnswer.query.textToTranslate }
                        );
                    }
                },
                { skipCoach: true }
            );
        } catch (e) {
            recordError(
                rule,
                skip,
                e.message || String(e),
                { stack: e.stack, phase: reqAnswer.query.textToTranslate }
            );
        }
    }

    //console.log(`Finished rule: ${rule}`);
}

function printSummary() {
    console.log("\n\n===== ERROR SUMMARY BY RULE =====\n");

    const rules = Object.keys(errorsByRule);
    if (rules.length === 0) {
        console.log("✅ No errors detected for any rule.");
        return;
    }

    for (const rule of rules) {
        console.log(`\n--- Rule: ${rule} ---`);
        const errorMap = errorsByRule[rule];
        const messages = Object.keys(errorMap);

        for (const msg of messages) {
            const { count, samples } = errorMap[msg];
            console.log(`\n  Error: ${msg}`);
            console.log(`  Count: ${count}`);
            console.log(
                `  Sample skips: ${samples
                    .map((s) => s.skip + (s.phase ? ` (${s.phase})` : ""))
                    .join(", ")}`
            );
            // якщо треба деталі:
            // console.log("  Samples detail:", samples);
        }
    }

    console.log("\n===== END OF SUMMARY =====");
}

async function main() {
    const allRules = Object.values(GrammarRule);

    for (const rule of allRules) {
        await testRule(rule);
    }

    printSummary();
}

// запуск
main().catch((e) => {
    console.error("Fatal error in test runner:", e);
});
