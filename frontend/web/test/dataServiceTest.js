// -----------------------------
// Test harness for getOverallAccuracy()
// Console-only, no dependencies
// -----------------------------

/**
 * Utilities the original function expects.
 * (Keep these identical to your app versions if you already have them.)
 */
function clamp01(x) {
    const n = Number(x);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(1, n));
}

// We'll "fake" your global uniqueAttempts with a Set.
let uniqueAttempts = new Set();

/**
 * ✅ Mock inferUserLevel() using a list of samples.
 * Add more samples into INFER_SAMPLES and the test will run over all of them.
 */
const INFER_SAMPLES = [
    {
        name: "Sample A — mostly A1, high accuracy",
        inf: {
            confidence: 0.656433771413929,
            decidedBy: "eligibility",
            level: "A1",
            levels: [
                {
                    level: "A1",
                    attempts: 8,
                    accuracy: 99.38,
                    rulesWithMinAttempts: 7,
                    coverage: 0.30434782608695654,
                    eligible: true,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "A2",
                    attempts: 2,
                    accuracy: 0,
                    rulesWithMinAttempts: 1,
                    coverage: 0.043478260869565216,
                    eligible: false,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "B1",
                    attempts: 0,
                    accuracy: 0,
                    rulesWithMinAttempts: 0,
                    coverage: 0,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
                {
                    level: "B2",
                    attempts: 0,
                    accuracy: 0,
                    rulesWithMinAttempts: 0,
                    coverage: 0,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
            ],
        },
    },

    {
        name: "Sample B — A1, almost A2",
        inf: {
            confidence: 0.656433771413929,
            decidedBy: "eligibility",
            level: "A1",
            levels: [
                {
                    level: "A1",
                    attempts: 8,
                    accuracy: 99.38,
                    rulesWithMinAttempts: 7,
                    coverage: 0.30434782608695654,
                    eligible: true,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "A2",
                    attempts: 12,
                    accuracy: 74.5,
                    rulesWithMinAttempts: 1,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "B1",
                    attempts: 0,
                    accuracy: 0,
                    rulesWithMinAttempts: 0,
                    coverage: 0,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
                {
                    level: "B2",
                    attempts: 0,
                    accuracy: 0,
                    rulesWithMinAttempts: 0,
                    coverage: 0,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
            ],
        },
    },


    {
        name: "Sample C — A1, almost all",
        inf: {
            confidence: 0.656433771413929,
            decidedBy: "eligibility",
            level: "A1",
            levels: [
                {
                    level: "A1",
                    attempts: 8,
                    accuracy: 99.38,
                    rulesWithMinAttempts: 7,
                    coverage: 0.30434782608695654,
                    eligible: true,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "A2",
                    attempts: 12,
                    accuracy: 74.5,
                    rulesWithMinAttempts: 1,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "B1",
                    attempts: 10,
                    accuracy: 74,
                    rulesWithMinAttempts: 5,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
                {
                    level: "B2",
                    attempts: 10,
                    accuracy: 74,
                    rulesWithMinAttempts: 5,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
            ],
        },
    },

    {
        name: "Sample D — A2, almost all",
        inf: {
            confidence: 0.656433771413929,
            decidedBy: "eligibility",
            level: "A2",
            levels: [
                {
                    level: "A1",
                    attempts: 8,
                    accuracy: 99.38,
                    rulesWithMinAttempts: 7,
                    coverage: 0.30434782608695654,
                    eligible: true,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "A2",
                    attempts: 12,
                    accuracy: 76,
                    rulesWithMinAttempts: 1,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "B1",
                    attempts: 10,
                    accuracy: 74,
                    rulesWithMinAttempts: 5,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
                {
                    level: "B2",
                    attempts: 10,
                    accuracy: 74,
                    rulesWithMinAttempts: 5,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
            ],
        },
    },

    {
        name: "Sample E — B1, almost all",
        inf: {
            confidence: 0.656433771413929,
            decidedBy: "eligibility",
            level: "B1",
            levels: [
                {
                    level: "A1",
                    attempts: 8,
                    accuracy: 99.38,
                    rulesWithMinAttempts: 7,
                    coverage: 0.30434782608695654,
                    eligible: true,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "A2",
                    attempts: 12,
                    accuracy: 76,
                    rulesWithMinAttempts: 1,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "B1",
                    attempts: 10,
                    accuracy: 75,
                    rulesWithMinAttempts: 5,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
                {
                    level: "B2",
                    attempts: 10,
                    accuracy: 74,
                    rulesWithMinAttempts: 5,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
            ],
        },
    },

    {
        name: "Sample E — B2, almost all",
        inf: {
            confidence: 0.656433771413929,
            decidedBy: "eligibility",
            level: "B2",
            levels: [
                {
                    level: "A1",
                    attempts: 8,
                    accuracy: 99.38,
                    rulesWithMinAttempts: 7,
                    coverage: 0.30434782608695654,
                    eligible: true,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "A2",
                    attempts: 12,
                    accuracy: 76,
                    rulesWithMinAttempts: 1,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0.0,
                    score: 0.0,
                },
                {
                    level: "B1",
                    attempts: 10,
                    accuracy: 75,
                    rulesWithMinAttempts: 5,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
                {
                    level: "B2",
                    attempts: 10,
                    accuracy: 75,
                    rulesWithMinAttempts: 5,
                    coverage: 0.843478260869565216,
                    eligible: false,
                    learnedShare: 0,
                    score: 0,
                },
            ],
        },
    },

    // Add more samples like:
    // {
    //   name: "Sample B — decided B1, moderate",
    //   inf: { ...same shape... }
    // },
];

let __activeInferIndex = 0;
function inferUserLevel() {
    return INFER_SAMPLES[__activeInferIndex]?.inf ?? null;
}

/**
 * Your function (unchanged except it references the globals above).
 */
function getOverallAccuracy() {
    const total = uniqueAttempts.size;
    const required = 10;

    if (total < required) {
        return {
            attemptsLeft: Math.max(0, required - total),
            accuracy: 0,
        };
    }

    const inf = inferUserLevel(); // { level, levels }
    const curLvl = String(inf?.level ?? "a1").toLowerCase();

    const accOf = (lvl, withCoverage = false) => {
        const want = String(lvl).toLowerCase();
        const hit = (inf?.levels ?? []).find(
            (x) => String(x?.level ?? "").toLowerCase() === want
        );
        return Number.isFinite(hit?.accuracy)
            ? hit.accuracy * (withCoverage ? hit.coverage : 1)
            : 0; // 0..100
    };

    const levelAcc = accOf(curLvl); // 0..100

    const BANDS = {
        a1: { low: 0, cap: 30 },
        a2: { low: 30, cap: 55 },
        b1: { low: 55, cap: 80 },
        b2: { low: 80, cap: 100 },
    };

    const band = BANDS[curLvl] ?? BANDS.a1;
    const bandWidth = band.cap - band.low;

    // (4) lower border
    let bandAcc = band.low;

    // ✅ (5) within-band contribution uses ONLY 75% of band width
    const effectiveWidth = bandWidth * 0.75;

    bandAcc += clamp01(levelAcc / 100) * effectiveWidth;

    // (6) pull from higher levels
    const ABOVE = {
        a1: ["b2", "b1", "a2"],
        a2: ["b2", "b1"],
        b1: ["b2"],
        b2: [],
    };

    for (const lvlAbove of ABOVE[curLvl] ?? []) {
        const band = BANDS[lvlAbove];
        const bandWidth = band.cap - band.low;
        const effectiveWidth = bandWidth * 0.75;

        // const diff = band.cap - bandAcc;
        // if (diff <= 0) break;

        const acc = accOf(lvlAbove, true);
        bandAcc += clamp01(acc / 100) * effectiveWidth;
    }

    // (3) enforce band limits
    bandAcc = Math.min(bandAcc, 100);

    bandAcc = Math.max(band.low, bandAcc);

    return {
        attemptsLeft: 0,
        accuracy: Math.round(bandAcc * 100) / 100,
    };
}

/**
 * Helper to set uniqueAttempts.size easily.
 */
function setAttemptCount(n) {
    uniqueAttempts = new Set();
    for (let i = 0; i < n; i++) uniqueAttempts.add(`att_${i}`);
}

/**
 * Pretty logging per sample.
 */
function runOverallAccuracyTests({
                                     attemptsBelow = 7,
                                     attemptsExact = 10,
                                     attemptsAbove = 25,
                                 } = {}) {
    console.log("=== getOverallAccuracy() test run ===");
    console.log(`Samples: ${INFER_SAMPLES.length}`);
    console.log("");

    const attemptCases = [
        // { label: `below required (${attemptsBelow})`, n: attemptsBelow },
        { label: `exact required (${attemptsExact})`, n: attemptsExact },
        // { label: `above required (${attemptsAbove})`, n: attemptsAbove },
    ];

    INFER_SAMPLES.forEach((sample, idx) => {
        __activeInferIndex = idx;

        const inf = inferUserLevel();
        console.log("--------------------------------------------------");
        console.log(`Sample #${idx + 1}: ${sample.name}`);
        // console.log(
        //     `infer.level=${inf?.level} | confidence=${inf?.confidence} | decidedBy=${inf?.decidedBy}`
        // );
        // console.log(
        //     "levels:",
        //     (inf?.levels ?? []).map((x) => ({
        //         level: x.level,
        //         attempts: x.attempts,
        //         accuracy: x.accuracy,
        //         coverage: x.coverage,
        //     }))
        // );

        attemptCases.forEach((c) => {
            setAttemptCount(c.n);
            const out = getOverallAccuracy();
            console.log(
                `  attempts: ${c.label} -> attemptsLeft=${out.attemptsLeft}, accuracy=${out.accuracy}`
            );
        });
    });

    console.log("--------------------------------------------------");
    console.log("Done.");
}

// ✅ Run
runOverallAccuracyTests();

/**
 * HOW TO ADD MORE DATA SAMPLES:
 * - Push another { name, inf } object into INFER_SAMPLES
 * - Keep the same "inf" shape (confidence, decidedBy, level, levels[])
 * - Re-run runOverallAccuracyTests()
 */
