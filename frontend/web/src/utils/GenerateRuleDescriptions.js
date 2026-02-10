import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { ALL_RULES_SAMPLES } from "../../../../backend/core/allRulesSamples.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const out = {};

for (const [ruleId, samples] of Object.entries(ALL_RULES_SAMPLES)) {
    const first = Array.isArray(samples) ? samples[0] : null;
    const firstEn =
        first && Array.isArray(first.en) && typeof first.en[0] === "string"
            ? first.en[0]
            : "";
    out[ruleId] = firstEn;
}

const outPath = path.join(
    __dirname,
    "./ruleDescriptions.json"
);

fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");

console.log("✅ ruleDescriptions.json generated");
