// src/services/cookieConsent.js
export function getCookieConsent() {
    return localStorage.getItem("cookieConsent"); // "accepted" | "rejected" | null
}

export function acceptCookies() {
    localStorage.setItem("cookieConsent", "accepted");
}

export function rejectCookies() {
    localStorage.setItem("cookieConsent", "rejected");
}
