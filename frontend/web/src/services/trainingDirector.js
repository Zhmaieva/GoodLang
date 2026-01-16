import {getOverallAccuracy, inferUserLevel} from "./dataService"; // adjust path
import {getLearningState, LEVEL_MAP_TO} from "./insightsService.js";
import {logInfo} from "./logger.js";

const CEFR_ORDER = ["A1", "A2", "B1", "B2"];

const LS_LEVEL_KEY = "training_level"; // pick any key name you like

export function getSavedTrainingLevel() {
    const v = String(localStorage.getItem(LS_LEVEL_KEY) || "").trim();
    const allowed = new Set(["managed", "beginner", "intermediate", "advanced"]);
    return allowed.has(v) ? v : null;
}

export function saveTrainingLevel(level) {
    localStorage.setItem(LS_LEVEL_KEY, String(level));
}

const LS_TASK_MODE_KEY = "task_mode"; // "translations" | "gaps" | "combined"

export function getSavedTaskMode() {
    const v = String(localStorage.getItem(LS_TASK_MODE_KEY) || "").trim();
    const allowed = new Set(["translations", "gaps", "combined"]);
    return allowed.has(v) ? v : null;
}

export function saveTaskMode(mode) {
    localStorage.setItem(LS_TASK_MODE_KEY, String(mode));
}


/**
 * Main function to get user's training level
 */
export function getProgress() {
    const leveStats = inferUserLevel();

    const { answers, medianDays, nextLevels } = getLearningState();

    const next = (nextLevels?.length ?? 0) > 0 ? nextLevels : ['B2'];

    const currentLevelStat = leveStats?.levels.find(x => x.level === leveStats.level)
    const recommendedLevel = (currentLevelStat?.eligible ?? false) ? next : [leveStats.level];

    let combinedAccuracy = 0;
    recommendedLevel.forEach(n => {
        const level = leveStats.levels.find(l => l.level === n)
        combinedAccuracy += level?.attempts > 0 ? (level?.accuracy ?? 0) : 0;
    })
    combinedAccuracy = combinedAccuracy / recommendedLevel.length;


    return {
        levelNameTo: LEVEL_MAP_TO[recommendedLevel[0].toUpperCase()].label,
        nextLevel: recommendedLevel[0],
        accuracy: combinedAccuracy
    }
}

/**
 * Main function to get user's training level
 */
export function getTrainingLevel() {
    const allStats = inferUserLevel();

    logInfo(allStats);

    const overall = getOverallAccuracy();

    // --- CALIBRATION MODE ---
    if (overall.attemptsLeft > 0) {
        let levelIdx = 0; // start at A1

        while (true) {
            const lvl = CEFR_ORDER[levelIdx];
            const lvlStats = allStats.levels.find(l => l.level === lvl);

            if (!lvlStats || lvlStats.attempts === 0) break;

            // Move UP if accuracy >75%
            if (lvlStats.accuracy >= 60) {
                if (levelIdx < CEFR_ORDER.length - 1) levelIdx++;
                else  {
                    logInfo(`CALIBRATION ${lvl}: ${lvlStats.accuracy}%`);
                    break;
                }
            }
            // Move DOWN if accuracy <75% and not already at A1
            else if (((lvlStats.accuracy < 60 && lvlStats.attempts > 6) || (lvlStats.accuracy < 25 && lvlStats.attempts > 1)) && levelIdx > 0) {
                levelIdx--;
                break;
            }
            else {
                logInfo(`CALIBRATION ${lvl}: ${lvlStats.accuracy}%`);
                break;
            }
        }

        logInfo('current managed level: ', CEFR_ORDER[levelIdx]);
        return {
            isCalibration: true,
            level: CEFR_ORDER[levelIdx]
        };
    }

    // --- NORMAL MODE: enough data (≥40 scores) ---
    // Randomize level order, then pick the first level with accuracy < 75 as `next`.
    // If all are >= 80, default to "B2".
    const shuffled = [...CEFR_ORDER].sort(() => Math.random() - 0.5);

    const current =
        shuffled.find(lvl => {
            const levelData = allStats.levels.find(l => l.level === lvl);
            const levelIndex = allStats.levels.indexOf(levelData);
            const currentLevelIndex = allStats.levels.indexOf(allStats.levels.find(l => l.level === allStats.level));
            const levelTooHigh = levelIndex - currentLevelIndex > 1;

            return (levelData?.accuracy ?? 0) < 80 && !levelTooHigh;
        }) || "B2";

    logInfo('current managed level: ', current);
    return {
        isCalibration: false,
        level: current
    };
}
