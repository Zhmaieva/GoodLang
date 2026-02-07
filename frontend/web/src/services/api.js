import { getToken } from "./accountService.js";
import { logError } from "./logger.js";
import { getPromoCode } from "./dataService.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const STORAGE_KEY_APP_VERSION = "app_version";
const CLIENT_APP_VERSION = "1.2.3"; // hardcoded client version

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------
function parseVersion(v) {
    const clean = String(v || "").trim().split("-")[0];
    const parts = clean.split(".").map((n) => parseInt(n, 10));
    return [
        Number.isFinite(parts[0]) ? parts[0] : 0,
        Number.isFinite(parts[1]) ? parts[1] : 0,
        Number.isFinite(parts[2]) ? parts[2] : 0,
    ];
}

function compareVersions(a, b) {
    const A = parseVersion(a);
    const B = parseVersion(b);
    for (let i = 0; i < 3; i++) {
        if (A[i] > B[i]) return 1;
        if (A[i] < B[i]) return -1;
    }
    return 0;
}

function syncVersionAndMaybeReload(serverVersion) {
    if (!serverVersion) return;

    const localVersion = localStorage.getItem(STORAGE_KEY_APP_VERSION);

    // If LS missing, treat it as CLIENT version for comparison purposes
    const effectiveLocal = localVersion || CLIENT_APP_VERSION;

    const serverVsLocal = compareVersions(serverVersion, effectiveLocal);
    const serverVsClient = compareVersions(serverVersion, CLIENT_APP_VERSION);

    const shouldReload = serverVsLocal === 1 && serverVsClient === 1;

    // Always sync LS to backend version
    localStorage.setItem(STORAGE_KEY_APP_VERSION, serverVersion);

    if (shouldReload) {
        window.location.reload();
    }
}

async function jsonFetch(url, opts = {}) {
    const res = await fetch(url, {
        ...opts,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
            ...(opts.headers || {}),
        },
    });

    let data = null;
    try {
        data = await res.json();
    } catch {
        // ignore
    }

    if (!res.ok) {
        const msg = data?.error || `Server error: ${res.status}`;
        const err = new Error(msg);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

export function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function jitter(ms, jitterRatio = 0.3) {
    // random in [ms*(1-j), ms*(1+j)]
    const j = ms * jitterRatio;
    return Math.max(0, Math.round(ms - j + Math.random() * (2 * j)));
}

/**
 * ✅ Homework task normalizer:
 * Ensures the FE always has `task.taskId` to attach into score sync payload.
 *
 * Server returns:
 * { task: { id: "<mongoTaskId>", ... } } or { task: null }
 *
 * We normalize to:
 * { task: { id, taskId: id, ... } } or { task: null }
 */
function normalizeNextTaskResponse(data) {
    if (!data || typeof data !== "object") return data;

    const t = data.task;
    if (!t) return data;

    const id = String(t.id ?? "").trim();
    const taskId = String(t.taskId ?? id ?? "").trim();

    return {
        ...data,
        task: {
            ...t,
            id: id || t.id,
            taskId: taskId || (id || null),
        },
    };
}

/**
 * ✅ Helper to attach taskId into an answer object that you later send to /data-sync.
 * Use for homework mode; safe no-op otherwise.
 *
 * Example:
 * const next = await apiStudentNextTaskFromSet(taskSetId);
 * const answer = { id, rule, score, ... };
 * const answerWithTask = withTaskId(answer, next.task);
 * await callDataSyncApi({ answers: [answerWithTask], ... });
 */
export function withTaskId(answer, task) {
    const a = answer && typeof answer === "object" ? { ...answer } : {};
    const t = task && typeof task === "object" ? task : null;

    const taskId = t?.taskId ?? t?.id ?? null;
    if (!taskId) return a;

    return { ...a, taskId: String(taskId) };
}

// ------------------------------------------------------------
// Payments / account / core
// ------------------------------------------------------------
export async function callCheckoutApi() {
    const url = `${API_BASE}/payments/create-checkout-session`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
            promoCode: getPromoCode(),
        }),
    });

    const data = await res.json();
    if (!res.ok) {
        return { isSuccess: false };
    }
    return { ...data, isSuccess: true };
}

export async function callCheckoutMarathonApi(ruleIds) {
    const url = `${API_BASE}/payments/create-marathon-checkout-session`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
            ruleIds,          // ✅ array of 7 strings
            // promoCode: getPromoCode(), // optional (remove if not used)
        }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        return { isSuccess: false, error: data?.error || "Failed to create session" };
    }

    return { ...data, isSuccess: true }; // expects { clientSecret }
}


export async function callDataSyncApi(payload) {
    const url = `${API_BASE}/data-sync`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        return { isSuccess: false };
    }

    return { isSuccess: true, ...data };
}

export async function callTranslateAPI(params) {
    const qs = new URLSearchParams(params);
    const url = `${API_BASE}/translations?${qs.toString()}`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${await getToken()}`, // add Authorization header
        },
    });

    const data = await res.json();
    if (!res.ok) {
        if (data?.waitTimeSeconds) {
            return { ...data, isSuccess: false };
        }
        throw new Error("Server error: " + res.status);
    }
    return { ...data, isSuccess: true };
}

export async function callSignUpApi(params) {
    const qs = new URLSearchParams(params);

    // If teacher flag is stored locally, include it in query params
    if (localStorage.getItem("teacher") === "true") {
        qs.set("teacher", "true");
    }

    const url = `${API_BASE}/accounts/start?${qs.toString()}`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error("Server error: " + res.status);

    return res.json();
}

export async function callAccountInfoApi() {
    const params = new URLSearchParams();
    const promoCode = getPromoCode();
    if (promoCode) params.set("promo_code", promoCode);

    const url = `${API_BASE}/accounts/info${params.toString() ? `?${params.toString()}` : ""}`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${await getToken()}`,
        },
    });

    const data = await res.json();

    if (!res.ok) throw new Error("Server error: " + res.status);

    // ✅ version sync + optional reload
    syncVersionAndMaybeReload(data?.appVersion);

    // ✅ persist last known account info to LS (but still always fetch on this function)
    try {
        localStorage.setItem("account_info", JSON.stringify(data));
    } catch {}

    return data;
}


export async function callAccountVerifyApi(actionType) {
    try {
        const url = `${API_BASE}/accounts/verify?action_type=${actionType}`;

        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        await res.json();
    } catch (e) {
        logError(e);
    }
}

export async function callManageSubscriptionApi() {
    const url = `${API_BASE}/payments/manage`;

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${await getToken()}`,
        },
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error("Server error: " + res.status);
    }

    // backend should return: { url: "https://billing.stripe.com/..." }
    return { ...data, isSuccess: true };
}

export async function callSendPromoCodeApi({ email }) {
    const res = await fetch(`${API_BASE}/accounts/send-promo-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Не вдалося відправити код");
    return data;
}

export async function callSendCodeApi({ email }) {
    const res = await fetch(`${API_BASE}/accounts/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Не вдалося відправити код");
    return data;
}

export async function callVerifyCodeApi({ email, code, termsAccepted = false }) {
    const isTeacher = localStorage.getItem("teacher") === "true";

    const qs = new URLSearchParams();
    if (isTeacher) qs.set("teacher", "true");

    const res = await fetch(
        `${API_BASE}/accounts/verify-code${qs.toString() ? `?${qs.toString()}` : ""}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({
                email,
                code,
                termsAccepted,
                ...(isTeacher && { teacher: true }),
            }),
        }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to verify code");

    return data; // { token: "..." }
}

export async function downloadCrossword(code) {
    const p = String(code ?? "").trim();
    if (!p) throw new Error("Missing code");

    const url = `${API_BASE}/files/pdf/crossword?p=${encodeURIComponent(p)}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${await getToken()}`,
        },
    });

    if (!res.ok) {
        // Best-effort message
        let details = "";
        try {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
                const data = await res.json();
                details = data?.error ? ` (${data.error})` : "";
            } else {
                const txt = await res.text();
                if (txt) details = ` (${txt.slice(0, 140)})`;
            }
        } catch {}

        throw new Error(`Failed to fetch PDF: ${res.status}${details}`);
    }

    const blob = await res.blob();
    return { isSuccess: true, blob };
}

export async function dowloadPdf(ruleName, pdfType = "translations") {
    const { blob } = await callGeneratePdfApi(ruleName, pdfType);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ruleName}_${pdfType.toUpperCase()}.pdf`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
}

async function callGeneratePdfApi(ruleName, pdfType, opts = {}) {
    const {
        maxRetries = 5,
        baseDelayMs = 400, // initial backoff
        maxDelayMs = 8000, // cap
        jitterRatio = 0.35,
    } = opts;

    const url = `${API_BASE}/files/generate/pdf?rule=${encodeURIComponent(ruleName)}&pdfType=${pdfType}`;

    let attempt = 0;
    while (true) {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        if (res.ok) {
            const blob = await res.blob();
            return { isSuccess: true, blob };
        }

        // Retry only on 429
        if (res.status === 429 && attempt < maxRetries) {
            const ra = res.headers.get("Retry-After");
            let delay = null;

            if (ra) {
                const seconds = Number(ra);
                if (Number.isFinite(seconds)) {
                    delay = seconds * 1000;
                } else {
                    const dateMs = Date.parse(ra);
                    if (!Number.isNaN(dateMs)) delay = Math.max(0, dateMs - Date.now());
                }
            }

            if (delay == null) {
                const exp = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
                delay = jitter(exp, jitterRatio);
            }

            attempt++;
            await sleep(delay);
            continue;
        }

        // Best-effort message
        let details = "";
        try {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
                const data = await res.json();
                details = data?.error ? ` (${data.error})` : "";
            } else {
                const txt = await res.text();
                if (txt) details = ` (${txt.slice(0, 140)})`;
            }
        } catch {}

        throw new Error(`Failed to generate PDF: ${res.status}${details}`);
    }
}

// Call: GET /accounts/unsubscribe?email_unsubscribe_token=<token>
// Token == accountId (UUID) per your backend decision.
export async function callEmailUnsubscribeApi(emailUnsubscribeToken) {
    try {
        const token = String(emailUnsubscribeToken ?? "").trim();
        if (!token) {
            return { isSuccess: false, errorCode: "missing_token" };
        }

        const qs = new URLSearchParams({ email_unsubscribe_token: token });
        const url = `${API_BASE}/accounts/emails/unsubscribe?${qs.toString()}`;

        const res = await fetch(url, { method: "GET" });

        // endpoint may return text/plain
        const bodyText = await res.text().catch(() => "");

        if (!res.ok) {
            return {
                isSuccess: false,
                errorCode: `http_${res.status}`,
                message: bodyText || null,
            };
        }

        return { isSuccess: true, message: bodyText || null };
    } catch (e) {
        logError(e);
        return { isSuccess: false, errorCode: "network_error" };
    }
}

/**
 * Update current user's marathon status.
 * Backend resolves marathon by accountId (auth token).
 *
 * @param {'completed'|'failed'} status
 * @returns {Promise<{ isSuccess: boolean, updated?: boolean, status?: string }>}
 */
export async function callUpdateMarathonStatusApi(status) {
    if (status !== "completed" && status !== "failed") {
        throw new Error("Invalid marathon status");
    }

    try {
        const res = await fetch(`${API_BASE}/marathons/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({ status }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                isSuccess: false,
                error: data?.error || "Failed to update marathon status",
            };
        }

        return {
            isSuccess: true,
            ...data, // { ok, updated, status, previousStatus }
        };
    } catch (e) {
        logError(e);
        return { isSuccess: false, error: "network_error" };
    }
}

/**
 * Complete current marathon day for the authenticated user.
 *
 * @param {{ requireAllTasksAnswered?: boolean }} [opts]
 * @returns {Promise<{
 *   isSuccess: boolean,
 *   ok?: boolean,
 *   updated?: boolean,
 *   marathonId?: string,
 *   scheduleId?: string,
 *   dayNumber?: number,
 *   error?: string
 * }>}
 */
export async function callCompleteMarathonDayApi(opts = {}) {
    try {
        const { requireAllTasksAnswered = false } = opts || {};

        const res = await fetch(`${API_BASE}/marathons/complete-day`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({ requireAllTasksAnswered }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                isSuccess: false,
                error: data?.error || "Failed to complete marathon day",
            };
        }

        // expected: { ok, updated, marathonId, scheduleId, dayNumber }
        return { isSuccess: true, ...data };
    } catch (e) {
        logError(e);
        return { isSuccess: false, error: "network_error" };
    }
}


// ------------------------------------------------------------
// Teacher
// ------------------------------------------------------------
export function apiTeacherMetadata() {
    return jsonFetch(`${API_BASE}/schools/teachers/me`);
}

export function apiTeacherClasses() {
    return jsonFetch(`${API_BASE}/schools/teachers/me/classes`);
}

export function apiTeacherStudents() {
    return jsonFetch(`${API_BASE}/schools/teachers/me/students`);
}

export function apiClassStudents(classId, isActive = "all") {
    const qs = new URLSearchParams();
    qs.set("is_active", isActive); // "all" | "true" | "false"
    return jsonFetch(`${API_BASE}/schools/teachers/me/classes/${classId}/students?${qs.toString()}`);
}

export function apiCreateClass(name) {
    return jsonFetch(`${API_BASE}/schools/teachers/me/classes`, {
        method: "POST",
        body: JSON.stringify({ name }),
    });
}

export function apiRegenerateInviteCode(classId) {
    return jsonFetch(`${API_BASE}/schools/teachers/me/classes/${classId}/invitation-codes`, {
        method: "POST",
    });
}

/**
 * Add student:
 * - classId = real UUID => adds to class
 * - classId = "none"    => adds to teacher without class
 */
export function apiAddStudentToClass(classId, { email, firstName, lastName }) {
    return jsonFetch(`${API_BASE}/schools/teachers/me/classes/${classId}/students`, {
        method: "POST",
        body: JSON.stringify({ email, firstName, lastName }),
    });
}

/**
 * Remove student:
 * - classId = real UUID => removes from that class
 * - classId = "teacher" => removes from teacher across all classes
 */
export function apiDeactivateStudentInClass(classId, studentAccountId) {
    return jsonFetch(`${API_BASE}/schools/teachers/me/classes/${classId}/students/${studentAccountId}`, {
        method: "DELETE",
    });
}

// ✅ Convenience wrappers for FE readability
export function apiAddStudentToTeacher({ email, firstName, lastName }) {
    return apiAddStudentToClass("none", { email, firstName, lastName });
}

export function apiRemoveStudentFromTeacher(studentAccountId) {
    return apiDeactivateStudentInClass("teacher", studentAccountId);
}

// ============================================================
// Schools / Task Sets
// ============================================================

/**
 * POST /schools/task-sets
 * Teacher creates a task set (server builds tasks + assigns)
 */
export function apiCreateTaskSet(payload) {
    return jsonFetch(`${API_BASE}/schools/task-sets`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

/**
 * GET /schools/task-sets/teacher?limit=10&cursorCreatedAt=...&cursorId=...
 * Teacher list sets (paged) + per-student completion metadata
 */
export function apiTeacherTaskSets({ limit = 10, cursor } = {}) {
    const qs = new URLSearchParams();
    qs.set("limit", String(limit));

    if (cursor?.createdAt && cursor?.id) {
        qs.set("cursorCreatedAt", String(cursor.createdAt));
        qs.set("cursorId", String(cursor.id));
    }

    return jsonFetch(`${API_BASE}/schools/task-sets/teacher?${qs.toString()}`);
}

/**
 * GET /schools/task-sets/student?limit=10&cursorAssignedAt=...&cursorId=...
 * Student list assigned sets (paged) + own completion
 */
export function apiStudentTaskSets({ limit = 10, cursor } = {}) {
    const qs = new URLSearchParams();
    qs.set("limit", String(limit));

    if (cursor?.assignedAt && cursor?.id) {
        qs.set("cursorAssignedAt", String(cursor.assignedAt));
        qs.set("cursorId", String(cursor.id));
    }

    return jsonFetch(`${API_BASE}/schools/task-sets/student?${qs.toString()}`);
}

/**
 * GET /schools/task-sets/:taskSetId/tasks
 * Teacher gets all tasks in a set
 */
export function apiTeacherTaskSetTasks(taskSetId) {
    const id = String(taskSetId ?? "").trim();
    if (!id) throw new Error("Missing taskSetId");
    return jsonFetch(`${API_BASE}/schools/task-sets/${encodeURIComponent(id)}/tasks`);
}

/**
 * GET /schools/task-sets/:taskSetId/answers?studentId=...
 * Teacher gets all student answers in a set (read-only for now)
 */
export function apiTeacherTaskSetAnswers(taskSetId, { studentId } = {}) {
    const id = String(taskSetId ?? "").trim();
    if (!id) throw new Error("Missing taskSetId");

    const qs = new URLSearchParams();
    if (studentId) qs.set("studentId", String(studentId));

    const url =
        `${API_BASE}/schools/task-sets/${encodeURIComponent(id)}/answers` +
        (qs.toString() ? `?${qs.toString()}` : "");

    return jsonFetch(url);
}

/**
 * GET /schools/task-sets/:taskSetId/next
 * Student gets next task from set
 *
 * ✅ We normalize the response so FE always has:
 * data.task.taskId (alias of data.task.id)
 */
export async function apiStudentNextTaskFromSet(taskSetId) {
    const id = String(taskSetId ?? "").trim();
    if (!id) throw new Error("Missing taskSetId");

    const data = await jsonFetch(`${API_BASE}/schools/task-sets/${encodeURIComponent(id)}/next`);
    return normalizeNextTaskResponse(data);
}

/**
 * POST /schools/recommended-preview
 * body: { studentIds: string[], seed: number }
 */
export function apiRecommendedPreview({ studentIds, seed, numberOfTasksPerStudent = 10 }) {
    const ids = Array.isArray(studentIds)
        ? studentIds.map((x) => String(x).trim()).filter(Boolean)
        : [];

    return jsonFetch(`${API_BASE}/schools/task-sets/recommended-preview`, {
        method: "POST",
        body: JSON.stringify({
            studentIds: ids,
            seed: Number.isFinite(seed) ? seed : Math.floor(Math.random() * 1e9),
            numberOfTasksPerStudent
        }),
    });
}

/**
 * GET /schools/task-sets/build
 * Build a task set + tasks (no title, no assignment)
 *
 * params:
 * - taskMode: "translations" | "gaps" | "mixed"
 * - ruleIds: string[] | comma-separated string
 * - numberOfTasks?: number
 * - seed?: number
 */
export function apiBuildTaskSet({
                                    taskMode,
                                    ruleIds,
                                    numberOfTasks = 10,
                                    seed,
                                }) {
    if (!taskMode) throw new Error("taskMode is required");
    if (!ruleIds || (Array.isArray(ruleIds) && !ruleIds.length)) {
        throw new Error("ruleIds is required");
    }

    const qs = new URLSearchParams();

    qs.set("taskMode", taskMode);
    qs.set(
        "ruleIds",
        Array.isArray(ruleIds)
            ? ruleIds.join(",")
            : String(ruleIds)
    );
    qs.set("numberOfTasks", String(numberOfTasks));

    if (Number.isFinite(seed)) {
        qs.set("seed", String(seed));
    }

    return jsonFetch(
        `${API_BASE}/schools/task-sets?${qs.toString()}`
    );
}

/**
 * POST /schools/task-sets/:taskSetId/assign
 * Assign an existing task set to students with a title
 *
 * payload:
 * - title: string
 * - studentIds?: string[]
 * - studentId?: string
 * - tasks: Task[]   (for validation / count only)
 */
export function apiAssignBuiltTaskSet(taskSetId, {
    title,
    studentIds,
    studentId,
    tasks,
}) {
    const id = String(taskSetId ?? "").trim();
    if (!id) throw new Error("Missing taskSetId");
    if (!title) throw new Error("title is required");
    if (!tasks || !tasks.length) throw new Error("tasks are required");

    const payload = {
        title,
        tasks,
        ...(Array.isArray(studentIds) && studentIds.length
            ? { studentIds }
            : studentId
                ? { studentId }
                : {}),
    };

    if (!payload.studentIds && !payload.studentId) {
        throw new Error("studentId or studentIds is required");
    }

    return jsonFetch(
        `${API_BASE}/schools/task-sets/${encodeURIComponent(id)}/assign`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
}

