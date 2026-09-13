import {getToken} from "./accountService.js";
import {logError, logInfo, logWarning} from "./logger.js";
import {getPromoCode} from "./dataService.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const STORAGE_KEY_APP_VERSION = "app_version";
const CLIENT_APP_VERSION = "1.4.1"; // hardcoded client version
const MAX_LOGGED_RESPONSE_LENGTH = 12000;
const MAX_LOGGED_RESPONSE_CONTENT_LENGTH = 128000;
let apiRequestSequence = 0;

const SENSITIVE_KEYS = new Set([
    "authorization",
    "password",
    "token",
    "accesstoken",
    "refreshtoken",
    "changetoken",
    "secret",
    "clientsecret",
    "email",
    "promocode",
    "paymentintent",
    "emailunsubscribetoken",
]);

function normalizeLogKey(key) {
    return String(key || "").replaceAll("_", "").replaceAll("-", "").toLowerCase();
}

function redactText(value) {
    return String(value)
        .replace(/Bearer\s+\S+/gi, "Bearer [REDACTED]")
        .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[REDACTED_EMAIL]")
        .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, "[REDACTED_TOKEN]");
}

function sanitizeLogValue(value, {redactCode = false} = {}, key = "") {
    const normalizedKey = normalizeLogKey(key);
    if (SENSITIVE_KEYS.has(normalizedKey) || (redactCode && normalizedKey === "code")) {
        return "[REDACTED]";
    }
    if (typeof value === "string") return redactText(value);
    if (Array.isArray(value)) {
        return value.map((item) => sanitizeLogValue(item, {redactCode}));
    }
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([nestedKey, nestedValue]) => [
                nestedKey,
                sanitizeLogValue(nestedValue, {redactCode}, nestedKey),
            ])
        );
    }
    return value;
}

function sanitizeUrlForLog(value) {
    try {
        const url = new URL(String(value), window.location.origin);
        url.searchParams.forEach((_parameterValue, key) => {
            const normalizedKey = normalizeLogKey(key);
            if (
                SENSITIVE_KEYS.has(normalizedKey)
                || normalizedKey === "code"
                || normalizedKey.endsWith("token")
            ) {
                url.searchParams.set(key, "[REDACTED]");
            }
        });
        return url.toString();
    } catch {
        return redactText(value);
    }
}

function sanitizeRequestBodyForLog(body) {
    if (body == null) return null;
    if (typeof body !== "string") {
        return `[${body?.constructor?.name || typeof body}]`;
    }

    try {
        return sanitizeLogValue(JSON.parse(body), {redactCode: true});
    } catch {
        return redactText(body).slice(0, MAX_LOGGED_RESPONSE_LENGTH);
    }
}

async function readResponseBodyForLog(response) {
    const contentType = response.headers.get("content-type") || "";
    const contentLength = Number(response.headers.get("content-length"));
    if (
        contentType.startsWith("application/pdf")
        || contentType.startsWith("image/")
        || contentType.startsWith("audio/")
        || contentType.startsWith("video/")
        || contentType.includes("application/octet-stream")
    ) {
        return `[binary response: ${contentType || "unknown content type"}]`;
    }
    if (Number.isFinite(contentLength) && contentLength > MAX_LOGGED_RESPONSE_CONTENT_LENGTH) {
        return `[response omitted: ${contentLength} bytes]`;
    }

    try {
        const text = await response.clone().text();
        if (!text) return null;

        try {
            return sanitizeLogValue(JSON.parse(text));
        } catch {
            return redactText(text.slice(0, MAX_LOGGED_RESPONSE_LENGTH));
        }
    } catch (error) {
        return `[response body unavailable: ${error?.message || "unknown error"}]`;
    }
}

async function apiFetch(input, options = {}) {
    const requestId = ++apiRequestSequence;
    const method = String(options.method || "GET").toUpperCase();
    const url = sanitizeUrlForLog(input);
    const startedAt = performance.now();

    logInfo("[API request]", {
        requestId,
        method,
        url,
        body: sanitizeRequestBodyForLog(options.body),
    });

    try {
        const response = await fetch(input, options);
        const responseLog = {
            requestId,
            method,
            url,
            status: response.status,
            statusText: response.statusText,
            ok: response.ok,
            durationMs: Math.round(performance.now() - startedAt),
            responseUrl: sanitizeUrlForLog(response.url || input),
            redirected: response.redirected,
            contentType: response.headers.get("content-type") || null,
            serverRequestId: response.headers.get("x-request-id")
                || response.headers.get("request-id")
                || null,
            cloudflareRay: response.headers.get("cf-ray") || null,
            body: await readResponseBodyForLog(response),
        };

        if (response.ok) {
            logInfo("[API response]", responseLog);
        } else {
            logWarning("[API response]", responseLog);
        }
        return response;
    } catch (error) {
        const errorLog = {
            requestId,
            method,
            url,
            status: null,
            durationMs: Math.round(performance.now() - startedAt),
            error,
        };
        if (error?.name === "AbortError") {
            logWarning("[API aborted]", errorLog);
        } else {
            logError("[API network error]", errorLog);
        }
        throw error;
    }
}

export async function callCheckoutApi() {
    const url = `${API_BASE}/payments/create-checkout-session`;

    const res = await apiFetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({
            promoCode: getPromoCode()
        })
    });

    const data = await res.json();
    if (!res.ok) {
        return { isSuccess: false }
    }
    return  { ...data, isSuccess: true };
}

export async function callCheckoutMarathonApi(ruleIds) {
    const url = `${API_BASE}/payments/create-marathon-checkout-session`;

    const res = await apiFetch(url, {
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

    const res = await apiFetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await getToken()}`,
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
        return { isSuccess: false }
    }

    return { isSuccess: true, ...data };
}

export async function callTranslateAPI(params, { signal } = {}) {
    const qs = new URLSearchParams(params);
    const url = `${API_BASE}/translations?${qs.toString()}`;

    const res = await apiFetch(url, {
        signal,
        headers: {
            'Authorization': `Bearer ${await getToken()}` // add Authorization header
        }
    });

    const data = await res.json();
    if (!res.ok) {
        if (res.status === 429) {
            return { ...data, isSuccess: false, isLimitReached: true, status: 429 };
        }
        if (data?.waitTimeSeconds) {
            return  { ...data, isSuccess: false };
        }
        throw new Error("Server error: " + res.status);
    }
    return  { ...data, isSuccess: true };
}

export async function callQuickTranslateAPI(params, { signal } = {}) {
    const qs = new URLSearchParams(params);
    const url = `${API_BASE}/translations/quick?${qs.toString()}`;

    const res = await apiFetch(url, {
        signal,
        headers: {
            'Authorization': `Bearer ${await getToken()}`
        }
    });

    const data = await res.json();
    if (!res.ok) {
        if (res.status === 429) {
            return { ...data, isSuccess: false, isLimitReached: true, status: 429 };
        }
        if (data?.waitTimeSeconds) {
            return  { ...data, isSuccess: false };
        }
        throw new Error("Server error: " + res.status);
    }
    return  { ...data, isSuccess: true };
}


export async function callSignUpApi(params) {
    const qs = new URLSearchParams(params);

    // If teacher flag is stored locally, include it in query params
    if (localStorage.getItem("teacher") === "true") {
        qs.set("teacher", "true");
    }

    const url = `${API_BASE}/accounts/start?${qs.toString()}`;

    const res = await apiFetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    if (!res.ok) throw new Error("Server error: " + res.status);

    return res.json();
}

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

export async function callAccountInfoApi() {
    const params = new URLSearchParams();
    const promoCode = getPromoCode();
    if (promoCode) params.set("promo_code", promoCode);

    const url = `${API_BASE}/accounts/info${params.toString() ? `?${params.toString()}` : ""}`;

    const res = await apiFetch(url, {
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

        const res = await apiFetch(url, {
            headers: {
                'Authorization': `Bearer ${await getToken()}`,
            },
        });

        await res.json();
    } catch (e) {
        logError(e);
    }
}


export async function callManageSubscriptionApi() {
    const url = `${API_BASE}/payments/manage`;

    const res = await apiFetch(url, {
        headers: {
            'Authorization': `Bearer ${await getToken()}`,
        }
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error("Server error: " + res.status);
    }

    // backend should return: { url: "https://billing.stripe.com/..." }
    return { ...data, isSuccess: true };
}

function accountCanSyncData(account) {
    return account?.status === "paid" || account?.status === "attention";
}

export async function callVocabularyApi(account = null) {
    const accountInfo = account ?? await callAccountInfoApi();
    if (!accountCanSyncData(accountInfo)) {
        return {
            isSuccess: true,
            syncSkipped: true,
            state: "localOnly",
            words: [],
            summary: null,
        };
    }

    const url = `${API_BASE}/vocabulary`;

    const res = await apiFetch(url, {
        headers: {
            'Authorization': `Bearer ${await getToken()}`,
        }
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error("Server error: " + res.status);
    }

    return { ...data, isSuccess: true };
}

export async function callVocabularyEvaluationApi(payload = {}, { signal } = {}) {
    const res = await apiFetch(`${API_BASE}/vocabulary/evaluate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
        },
        signal,
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.status === 429) {
        return { ...data, isSuccess: false, isLimitReached: true, status: 429 };
    }
    if (!res.ok) throw new Error("Server error: " + res.status);
    return { ...data, isSuccess: true };
}

export async function callVocabularyTranslationsApi(payload = {}, { signal } = {}) {
    const res = await apiFetch(`${API_BASE}/vocabulary/translations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
        },
        signal,
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.status === 429) {
        return { ...data, isSuccess: false, isLimitReached: true, status: 429 };
    }
    if (!res.ok) throw new Error("Server error: " + res.status);
    return { ...data, isSuccess: true };
}

export async function callSaveVocabularyCandidatesApi(payload = {}, account = null) {
    const accountInfo = account ?? await callAccountInfoApi();
    if (!accountCanSyncData(accountInfo)) {
        return { isSuccess: true, syncSkipped: true };
    }

    const url = `${API_BASE}/vocabulary/candidates`;
    const body = Array.isArray(payload)
        ? { candidates: payload }
        : payload;

    const res = await apiFetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${await getToken()}`,
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error("Server error: " + res.status);
    }

    return { ...data, isSuccess: true };
}

export async function callSendPromoCodeApi({ email }) {
    const res = await apiFetch(`${API_BASE}/accounts/send-promo-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Не вдалося відправити код");
    return data;
}

export async function callSendCodeApi({ email, changeToken }) {
    const res = await apiFetch(`${API_BASE}/accounts/send-code`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ email, changeToken }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Не вдалося відправити код");
    return data;
}

export async function callSendInquiry({ email }) {
    try {
        await apiFetch(`${API_BASE}/accounts/inquiry`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${await getToken()}`,
            },
            body: JSON.stringify({ email }),
        });
    } catch (e) {
        logError(e);
    }
}

export async function callVerifyCodeApi({ email, code, termsAccepted = false, emailChangeStep }) {
    const isTeacher = localStorage.getItem("teacher") === "true";

    const qs = new URLSearchParams();
    if (isTeacher) qs.set("teacher", "true");

    const res = await apiFetch(
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
                emailChangeStep,
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

    const res = await apiFetch(url, {
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

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function jitter(ms, jitterRatio = 0.3) {
    // random in [ms*(1-j), ms*(1+j)]
    const j = ms * jitterRatio;
    return Math.max(0, Math.round(ms - j + Math.random() * (2 * j)));
}

async function callGeneratePdfApi(ruleName, pdfType, opts = {}) {
    const {
        maxRetries = 5,
        baseDelayMs = 400,      // initial backoff
        maxDelayMs = 8000,      // cap
        jitterRatio = 0.35,
    } = opts;

    const url = `${API_BASE}/files/generate/pdf?rule=${encodeURIComponent(ruleName)}&pdfType=${pdfType}`;

    let attempt = 0;
    while (true) {
        const res = await apiFetch(url, {
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
            // If server provides Retry-After, respect it (seconds or date)
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
                // exponential backoff (capped) + jitter
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

        const res = await apiFetch(url, { method: "GET" });

        // endpoint may return text/plain
        const bodyText = await res.text().catch(() => "");

        if (!res.ok) {
            // graceful: never throw, return status as error code
            return {
                isSuccess: false,
                errorCode: `http_${res.status}`,
                message: bodyText || null,
            };
        }

        return { isSuccess: true, message: bodyText || null };
    } catch (e) {
        // graceful: network/CORS/etc
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
        const res = await apiFetch(`${API_BASE}/marathons/status`, {
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

        const res = await apiFetch(`${API_BASE}/marathons/complete-day`, {
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
