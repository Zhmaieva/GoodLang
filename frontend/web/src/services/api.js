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
        throw new Error("Sync failed: " + res.status);
    }

    return data;
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

export async function callAccountStatusApi() {
    const url = `${API_BASE}/accounts/status`;

    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${await getToken()}`,
        }
    });

    const data = await res.json();

    if (!res.ok) throw new Error("Server error: " + res.status);

    return data; // {status: 'free'|'paid'|'attention'}
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


