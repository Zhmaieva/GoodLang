import {translationsController} from "../controllers/translationController.js";
import {GrammarRule} from "../core/rules.js";
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

function createFakeReq(rule, skip) {
    return {
        user: {
            id: "test-account-id",
        },
        query: {
            rules: [rule],        // тренуємо конкретне правило
            seed: "1",
            skip: String(skip),
            // ВАЖЛИВО: без textToTranslate -> гілка "видай новий приклад"
        },
    };
}

function createFakeRes(rule, skip) {
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
                    { payload }
                );
                return;
            }

            // базова логічна валідація відповіді
            if (!payload || !payload.rules || !payload.textToTranslate) {
                recordError(
                    rule,
                    skip,
                    "Invalid response: missing rules or textToTranslate",
                    { payload }
                );
            }

            // інакше – все ок, нічого не логимо
        },
    };

    return res;
}

async function testRule(rule) {
    //console.log(`\n=== Testing rule: ${rule} ===`);

    for (let skip = 0; skip < 1000; skip++) {
        const req = createFakeReq(rule, skip);
        const res = createFakeRes(rule, skip);

        try {
            await translationsController.handleTranslationRequest(
                req,
                res,
                (err) => {
                    // обробка next(err)
                    if (err) {
                        recordError(
                            rule,
                            skip,
                            err.message || String(err),
                            { fromNext: true }
                        );
                    }
                },
                {skipCoach: true}
            );
        } catch (e) {
            // виняток з handleTranslationRequest
            recordError(
                rule,
                skip,
                e.message || String(e),
                { stack: e.stack }
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
                    .map((s) => s.skip)
                    .join(", ")}`
            );

            // якщо хочеш більше деталей:
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