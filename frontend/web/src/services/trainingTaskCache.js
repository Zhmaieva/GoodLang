import { emit } from "./events.js";

const taskCache = new Map();
const pendingFetches = new Map();
const STORAGE_PREFIX = "trainer_task_cache:";

function emitCacheUpdate() {
    emit("trainingTaskCacheUpdate", { pendingKeys: getPendingTrainingTaskKeys() });
}

export function buildTrainingTaskCacheKey({
                                              scope,
                                              level = "",
                                              ruleId = "",
                                              taskType = 0,
                                              taskMode = "",
                                              locale = "",
                                          }) {
    const parts = [
        "trainer-task",
        `scope:${scope || "level"}`,
        `level:${level || ""}`,
        `rule:${ruleId || ""}`,
        `type:${Number(taskType) || 0}`,
        `mode:${taskMode || ""}`,
        `locale:${locale || ""}`,
    ];

    return parts.join("|");
}

export function getCachedTrainingTask(key) {
    if (!key) return null;

    const memoryValue = taskCache.get(key);
    if (memoryValue) return memoryValue;

    try {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (!raw) return null;

        const parsed = JSON.parse(raw);
        if (!parsed?.textToTranslate || !(parsed.rules?.length > 0)) return null;

        taskCache.set(key, parsed);
        return parsed;
    } catch {
        return null;
    }
}

export function setCachedTrainingTask(key, task) {
    if (!key || !task?.textToTranslate || !(task.rules?.length > 0)) return null;
    taskCache.set(key, task);

    try {
        localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(task));
    } catch {
        // Cache is best-effort; memory cache still works.
    }

    return task;
}

export function clearCachedTrainingTask(key) {
    if (!key) return;
    taskCache.delete(key);

    try {
        localStorage.removeItem(STORAGE_PREFIX + key);
    } catch {
        // ignore
    }
}

export function getPendingTrainingTaskKeys() {
    return [...pendingFetches.keys()];
}

export function prefetchTrainingTask(key, fetcher) {
    if (!key || typeof fetcher !== "function") return Promise.resolve(null);

    const cached = getCachedTrainingTask(key);
    if (cached) return Promise.resolve(cached);

    const pending = pendingFetches.get(key);
    if (pending) return pending;

    const promise = Promise.resolve()
        .then(fetcher)
        .then((task) => setCachedTrainingTask(key, task))
        .catch((error) => {
            console.error(error);
            return null;
        })
        .finally(() => {
            pendingFetches.delete(key);
            emitCacheUpdate();
        });

    pendingFetches.set(key, promise);
    emitCacheUpdate();
    return promise;
}
