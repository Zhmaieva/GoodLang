// controllers/schoolsTaskBuilderController.js — FULL DROP-IN

import { authMiddleware } from "../middleware/authMiddleware.js";
import { generateTopicWords } from "../core/сore.js";

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
    },
};

