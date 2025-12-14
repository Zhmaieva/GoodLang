import {getAllStatistics, inferUserLevel} from "./dataService"; // adjust path
import { LEVEL_RULES } from "../utils/rules";
import {getLearningState} from "./insightsService.js";

const CEFR_ORDER = ["A1", "A2", "B1", "B2"];

/**
 * Compute per-level stats: average accuracy among answered rules, plus total answers
 */
function computeLevelStats(stats) {
    const per = {};
    for (const lvl of CEFR_ORDER) {
        const rules = LEVEL_RULES[lvl] || [];
        // only consider rules that have answers
        const lvlRulesWithAnswers = stats.filter(s => rules.includes(s.rule) && s.attemptsNumber > 0);

        const accuracy = lvlRulesWithAnswers.length
            ? lvlRulesWithAnswers.reduce((a, r) => a + r.accuracy, 0) / lvlRulesWithAnswers.length
            : 0;

        const total = lvlRulesWithAnswers.reduce((a, r) => a + r.attemptsNumber, 0);

        per[lvl] = { accuracy, total };
    }
    return per;
}

/**
 * Main function to get user's training level
 */
export function getProgress() {
    const leveStats = inferUserLevel();

    const { answers, medianDays, nextLevels } = getLearningState();

    if (nextLevels.length === 0) {
        return null;
    }

    let combinedAccuracy = 0;
    nextLevels.forEach(n => {
        combinedAccuracy += (leveStats.levels.find(l => l.level === n)?.score * 100) ?? 0;
    })
    combinedAccuracy = combinedAccuracy / nextLevels.length;

    return {
        nextLevel: nextLevels[0],
        accuracy: combinedAccuracy
    }
}

/**
 * Main function to get user's training level
 */
export function getTrainingLevel() {
    const allStats = inferUserLevel({
        minAttemptsPerRule: 1,
        minRulesWithAttempts: 6,
        minTotalAttemptsPerLevel: 6,
        minAccuracy: 85
    });

    console.log(allStats);

    // Total attempts across all levels
    const totalScores = CEFR_ORDER.reduce((acc, lvl) => acc + (allStats.levels.find(l => l.level === lvl)?.attempts || 0), 0);

    // --- CALIBRATION MODE: total scores < 40 ---
    if (totalScores < 40) {
        let levelIdx = 0; // start at A1

        while (true) {
            const lvl = CEFR_ORDER[levelIdx];
            const lvlStats = allStats.levels.find(l => l.level === lvl);

            if (!lvlStats || lvlStats.attempts === 0) break;

            // Move UP if accuracy >85%
            if (lvlStats.score >= 85) {
                if (levelIdx < CEFR_ORDER.length - 1) levelIdx++;
                else  {
                    console.log(`CALIBRATION ${lvl}: ${lvlStats.score}%`);
                    break;
                }
            }
            // Move DOWN if accuracy <75% and not already at A1
            else if (((lvlStats.score < 75 && lvlStats.attempts > 6) || (lvlStats.score < 25 && lvlStats.attempts > 1)) && levelIdx > 0) {
                levelIdx--;
            }
            else {
                console.log(`CALIBRATION ${lvl}: ${lvlStats.score}%`);
                break;
            }
        }

        console.log('current managed level: ', CEFR_ORDER[levelIdx]);
        return CEFR_ORDER[levelIdx];
    }

    // --- NORMAL MODE: enough data (≥40 scores) ---
    // Randomize level order, then pick the first level with accuracy < 85 as `next`.
    // If all are >= 85, default to "B2".
    const shuffled = [...CEFR_ORDER].sort(() => Math.random() - 0.5);

    const current =
        shuffled.find(lvl => {
            const levelData = allStats.levels.find(l => l.level === lvl);
            const levelIndex = allStats.levels.indexOf(levelData);
            const currentLevelIndex = allStats.levels.indexOf(allStats.levels.find(l => l.level === allStats.level));
            const levelTooHigh = levelIndex - currentLevelIndex > 1;

            return (levelData?.score ?? 0) < 95 && !levelTooHigh;
        }) || "B2";

    console.log('current managed level: ', current);
    return current;
}
