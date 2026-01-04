import { getCookieConsent } from "./settingsService.js";

let gaLoaded = false;
let metaLoaded = false;

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

// Put your Pixel ID in .env as VITE_META_PIXEL_ID
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

function loadGA(measurementId) {
    if (!measurementId) return;
    if (gaLoaded) return;
    gaLoaded = true;

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });
}

function loadMetaPixel(pixelId) {
    if (!pixelId) return;
    if (metaLoaded) return;
    metaLoaded = true;

    // Prevent double-injection if something else already loaded it
    if (window.fbq) return;

    !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", pixelId);
    // NOTE: Do NOT auto-track PageView here if you want to control it via trackPageView().
    // If you prefer Meta to always log initial PageView once after consent, uncomment next line:
    // window.fbq("track", "PageView");
}

/**
 * Ensures analytics are loaded ONLY when user consent is "accepted".
 * Call this on app start, and also right after user accepts cookies.
 */
export function ensureAnalytics() {
    const consentValue = getCookieConsent();
    if (consentValue !== "accepted") return;

    // GA
    loadGA(GA_ID);

    // Meta
    loadMetaPixel(META_PIXEL_ID);
}

export function trackPageView(path) {
    const consentValue = getCookieConsent();
    if (consentValue !== "accepted") return;

    // Ensure scripts are loaded before tracking
    ensureAnalytics();

    // GA page_view
    const measurementId = GA_ID;
    if (window.gtag && measurementId) {
        window.gtag("event", "page_view", {
            page_path: path,
            send_to: measurementId,
        });
    }

    // Meta PageView
    if (window.fbq) {
        window.fbq("track", "PageView");
    }
}

/**
 * Track Meta standard events, e.g. "CompleteRegistration", "Lead", "Purchase"
 */
export function trackMetaEvent(eventName, params = {}) {
    const consentValue = getCookieConsent();
    if (consentValue !== "accepted") return;

    ensureAnalytics();
    if (!window.fbq) return;

    window.fbq("track", eventName, params);
}

/**
 * Track Meta custom events, e.g. "StartTraining"
 */
export function trackMetaCustomEvent(eventName, params = {}) {
    const consentValue = getCookieConsent();
    if (consentValue !== "accepted") return;

    ensureAnalytics();
    if (!window.fbq) return;

    window.fbq("trackCustom", eventName, params);
}
