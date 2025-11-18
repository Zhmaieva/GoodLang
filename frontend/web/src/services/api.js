import {getToken} from "./accountService.js";

const API_BASE = "http://localhost:3000";

export async function callCheckoutApi(accountId) {
    const url = `${API_BASE}/payments/create-checkout-session`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({accountId})
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
    const url = `${API_BASE}/accounts/start?${qs.toString()}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });

    if (!res.ok) throw new Error("Server error: " + res.status);

    return res.json();
}

export async function callAccountInfoApi() {
    const url = `${API_BASE}/accounts/info`;

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${await getToken()}`,
        },
    });

    const data = await res.json();

    if (!res.ok) throw new Error("Server error: " + res.status);

    return data;
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

export async function callSendCodeApi({ email }) {
    const res = await fetch(`${API_BASE}/accounts/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to send code");
    return data;
}

export async function callVerifyCodeApi({ email, code }) {
    const res = await fetch(`${API_BASE}/accounts/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Failed to verify code");
    return data; // { token: "..." }
}


