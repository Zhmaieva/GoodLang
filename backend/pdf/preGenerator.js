import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ✅ your existing rule list
import { GrammarRule } from "../core/rules.js";

// ✅ import your existing PDF function (the file that exports getPdf)
// adjust path to where the code you pasted lives
import {CHOOSE_VARIANT_TASK_FORM, getPdf, TRANSLATIONS} from "../pdf/pdfGeneration.js";

/** ---------- tiny concurrency limiter (no deps) ---------- */
function createLimiter(maxConcurrent = 8) {
    let active = 0;
    const queue = [];

    const runNext = () => {
        if (active >= maxConcurrent) return;
        const next = queue.shift();
        if (!next) return;

        active++;
        next()
            .catch(() => {})
            .finally(() => {
                active--;
                runNext();
            });
    };

    return function limit(fn) {
        return new Promise((resolve, reject) => {
            queue.push(async () => {
                try {
                    resolve(await fn());
                } catch (e) {
                    reject(e);
                }
            });
            runNext();
        });
    };
}

/** ---------- paths ---------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "./pre-generated");
await fs.mkdir(OUTPUT_DIR, { recursive: true });

/** ---------- config ---------- */
const PARALLEL = Number(process.env.PREGEN_PARALLEL ?? 16);
const limit = createLimiter(PARALLEL);

const rules = Object.values(GrammarRule);

/** ---------- helpers ---------- */
async function fileExists(p) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

async function generateAndSave(ruleName) {
    const outPath = path.join(OUTPUT_DIR, `${ruleName}.pdf`);

    // optional: skip if already generated
    if (process.env.SKIP_EXISTING === "1" && (await fileExists(outPath))) {
        console.log(`↩️  skip ${ruleName} (already exists)`);
        return;
    }

    //const pdfBytes = await getPdf(ruleName, {pdfType: CHOOSE_VARIANT_TASK_FORM}); // Uint8Array
    const pdfBytes = await getPdf(ruleName, {pdfType: CHOOSE_VARIANT_TASK_FORM, withWatermarks: true}); // Uint8Array
    await fs.writeFile(outPath, Buffer.from(pdfBytes));

    console.log(`✅ saved ${ruleName}.pdf`);
}

/** ---------- main ---------- */
async function run() {
    console.log(`Pre-generating PDFs...`);
    console.log(`Rules: ${rules.length}`);
    console.log(`Outer parallelism: ${PARALLEL}`);
    console.log(
        `Inner PDF_CONCURRENCY (inside getPdf): ${process.env.PDF_CONCURRENCY ?? "(default in code)"}`
    );
    console.log(`Output: ${OUTPUT_DIR}\n`);

    const tasks = rules.map((rule) =>
        limit(async () => {
            try {
                await generateAndSave(rule);
            } catch (e) {
                console.error(`❌ ${rule}: ${e?.message ?? e}`);
            }
        })
    );

    await Promise.all(tasks);

    console.log("\n🎉 Done.");
}

run().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
});
