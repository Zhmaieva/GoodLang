import { getAllStatistics } from "./dataService"; // adjust path
import { LEVEL_RULES } from "../utils/rules";

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
export function getTrainingLevel() {
    const stats = getAllStatistics();
    const per = computeLevelStats(stats);

    // Total attempts across all levels
    const totalScores = CEFR_ORDER.reduce((acc, lvl) => acc + (per[lvl]?.total || 0), 0);

    // --- CALIBRATION MODE: total scores < 40 ---
    if (totalScores < 40) {
        let levelIdx = 0; // start at A1

        while (true) {
            const lvl = CEFR_ORDER[levelIdx];
            const lvlStats = per[lvl];

            if (!lvlStats || lvlStats.total === 0) break;

            // Move UP if accuracy >85%
            if (lvlStats.accuracy >= 85) {
                if (levelIdx < CEFR_ORDER.length - 1) levelIdx++;
                else  {
                    console.log(`CALIBRATION ${lvl}: ${lvlStats.accuracy}%`);
                    break;
                }
            }
            // Move DOWN if accuracy <75% and not already at A1
            else if ((lvlStats.accuracy < 75 && lvlStats.total > 6) || (lvlStats.accuracy < 25 && lvlStats.total > 1) && levelIdx > 0) {
                levelIdx--;
            }
            else {
                console.log(`CALIBRATION ${lvl}: ${lvlStats.accuracy}%`);
                break;
            }
        }

        console.log('current managed level: ', CEFR_ORDER[levelIdx]);
        return CEFR_ORDER[levelIdx];
    }

    // --- NORMAL MODE: enough data (≥40 scores) ---
    // Best mastered level (accuracy ≥85%)
    let current = "A1";
    const mastered = CEFR_ORDER.filter(lvl => per[lvl].accuracy >= 85);
    if (mastered.length) {
        current = mastered[mastered.length - 1]; // hardest mastered level
    } else {
        // fallback: best overall accuracy
        current = CEFR_ORDER.reduce((best, lvl) =>
            per[lvl].accuracy > per[best].accuracy ? lvl : best, "A1"
        );
    }

    // Next level logic
    const idx = CEFR_ORDER.indexOf(current);
    const next = idx < CEFR_ORDER.length - 1 ? CEFR_ORDER[idx + 1] : null;

    console.log(per);
    if (next) {
        // Promote if next level accuracy > 40%
        if (per[next].accuracy > 40 && per[current].total > 40) {
            console.log('current managed level: ', next);
            return next;
        }

        // Promote if current level accuracy ≥85%
        if (per[current].accuracy >= 85 && per[current].total > 40) {
            console.log('current managed level: ', next);
            return next;
        }
    }

    console.log('current managed level: ', current);
    return current;
}
