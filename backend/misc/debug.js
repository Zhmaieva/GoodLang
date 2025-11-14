const levels = ["A1", "A2", "B1", "B2"];

for (const level of levels) {
    const missing = LEVEL_RULES[level].filter(key => !(key in ALL_RULES_SAMPLES));

    if (missing.length > 0) {
        console.log(`Missing keys in ${level}:`, missing);
    } else {
        console.log(`✅ All keys from ${level} exist in ALL_RULES_SAMPLES`);
    }
}