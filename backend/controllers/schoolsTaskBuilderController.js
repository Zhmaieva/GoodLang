import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateTopicWords, generateGapStoryFromWords } from "../core/сore.js";

const name = "schools/task-builder";

function clampInt(v, min, max, fallback) {
    const n = Number.parseInt(String(v ?? ""), 10);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, n));
}

function normalizeTopic(v) {
    const s = String(v ?? "").trim();
    if (!s) return "";
    return s.slice(0, 64);
}

function normalizeLevel(v) {
    const s = String(v ?? "").trim().toUpperCase();
    const allowed = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
    return allowed.has(s) ? s : null;
}

function normalizeTopicHint(v) {
    const s = String(v ?? "").trim();
    if (!s) return "";
    return s.slice(0, 80);
}

function normalizeWords(arr) {
    if (!Array.isArray(arr)) return [];
    const cleaned = arr
        .map((x) => String(x ?? "").trim())
        .filter(Boolean);

    // de-dup (case-insensitive), keep first
    const out = [];
    const seen = new Set();
    for (const w of cleaned) {
        const k = w.toLowerCase();
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(w);
    }
    return out;
}

// -----------------------------
// controller
// -----------------------------
export const schoolsTaskBuilderController = {
    mapRoutes(app) {
        // ==========================================================
        // (1) GENERATE TOPIC WORDS (teacher or student)
        // ==========================================================
        // POST /schools/task-builder/topic-words
        // body: { topic: string(<=64), level: "A1".."C2", numberOfWords: 5..30 }
        app.post(`/${name}/topic-words`, authMiddleware, async (req, res, next) => {
            try {
                const topic = normalizeTopic(req.body?.topic);
                if (!topic) return res.status(400).json({ error: "topic is required" });

                const level = normalizeLevel(req.body?.level);
                if (!level) return res.status(400).json({ error: "level must be one of: A1, A2, B1, B2, C1, C2" });

                const numberOfWords = clampInt(req.body?.numberOfWords, 5, 30, 12);

                const words = await generateTopicWords({
                    topic,
                    level,
                    numberOfWords,
                });

                return res.status(201).json({
                    topic,
                    level,
                    numberOfWords,
                    words,
                });
            } catch (e) {
                next(e);
            }
        });

        // ==========================================================
        // (2) GENERATE GAP STORY FROM WORDS (teacher or student)
        // ==========================================================
        // POST /schools/task-builder/story-from-words
        // body: { words: string[], level?: "A1".."C2", topicHint?: string }
        // returns: { text: string(with {GAP}), answers: string[] }
        app.post(`/${name}/story-from-words`, authMiddleware, async (req, res, next) => {
            try {
                const words = normalizeWords(req.body?.words);
                if (!words.length) {
                    return res.status(400).json({ error: "words must be a non-empty array" });
                }

                // keep it in your usual builder range (feel free to adjust)
                if (words.length < 5) {
                    return res.status(400).json({ error: "words must contain at least 5 items" });
                }
                if (words.length > 30) {
                    return res.status(400).json({ error: "words must contain at most 30 items" });
                }

                const levelRaw = req.body?.level;
                const level = levelRaw ? normalizeLevel(levelRaw) : "A2";
                if (!level) return res.status(400).json({ error: "level must be one of: A1, A2, B1, B2, C1, C2" });

                const topicHint = normalizeTopicHint(req.body?.topicHint);

                const out = await generateGapStoryFromWords({
                    words,
                    level,
                    topicHint,
                });

                return res.status(201).json({
                    level,
                    topicHint: topicHint || null,
                    wordsCount: words.length,
                    text: out.text,
                    answers: out.answers,
                });
            } catch (e) {
                next(e);
            }
        });
    },
};
