const API_BASE = "http://localhost:3000/translations/";

export async function callAPI(params) {
    const qs = new URLSearchParams(params);
    const url = API_BASE + "?" + qs.toString();
    const res = await fetch(url);
    if (!res.ok) throw new Error("Server error: " + res.status);
    return res.json();
}