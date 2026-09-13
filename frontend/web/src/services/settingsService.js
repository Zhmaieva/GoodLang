// src/services/cookieConsent.js
export function isCookieConsentManagedNatively() {
    return typeof window !== "undefined"
        && window.__GOODLANG_NATIVE__?.isNativeApp === true
        && window.__GOODLANG_NATIVE__?.cookieConsentManagedNatively === true;
}

export function getCookieConsent() {
    if (isCookieConsentManagedNatively()) {
        return "accepted";
    }

    return localStorage.getItem("cookieConsent"); // "accepted" | "rejected" | null
}

export function acceptCookies() {
    localStorage.setItem("cookieConsent", "accepted");
}

export function rejectCookies() {
    localStorage.setItem("cookieConsent", "rejected");
}
