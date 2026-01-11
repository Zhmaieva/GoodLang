import {getToken} from "./accountService.js";
import {logError} from "./logger.js";
import {getPromoCode} from "./dataService.js";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const STORAGE_KEY_APP_VERSION = "app_version";
const CLIENT_APP_VERSION = "1.0.11"; // hardcoded client version

export async function callCheckoutApi() {
    const url = `${API_BASE}/payments/create-checkout-session`;

    const res = await fetch(url, {
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

export async function callDataSyncApi(payload) {
    const url = `${API_BASE}/data-sync`;

    const res = await fetch(url, {
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

export async function callTranslateAPI(params) {
    const qs = new URLSearchParams(params);
    const url = `${API_BASE}/translations?${qs.toString()}`;

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${await getToken()}` // add Authorization header
        }
    });

    const data = await res.json();
    if (!res.ok) {
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

    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${await getToken()}`,
        },
    });

    const data = await res.json();

    if (!res.ok) throw new Error("Server error: " + res.status);

    // ✅ version sync + optional reload
    syncVersionAndMaybeReload(data?.appVersion);

    return data;
}

export async function callAccountVerifyApi(actionType) {
    try {
        const url = `${API_BASE}/accounts/verify?action_type=${actionType}`;

        const res = await fetch(url, {
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

    const res = await fetch(url, {
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

export async function callSendPromoCodeApi({ email }) {
    const res = await fetch(`${API_BASE}/accounts/send-promo-code`, {
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


export async function dowloadPdf(ruleName) {
    const { blob } = await callGeneratePdfApi(ruleName);

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ruleName}_TRANSLATIONS.pdf`;
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

async function callGeneratePdfApi(ruleName, opts = {}) {
    const {
        maxRetries = 5,
        baseDelayMs = 400,      // initial backoff
        maxDelayMs = 8000,      // cap
        jitterRatio = 0.35,
    } = opts;

    const url = `${API_BASE}/files/generate/pdf?rule=${encodeURIComponent(ruleName)}`;

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




