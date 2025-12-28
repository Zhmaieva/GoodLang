let gaLoaded = false;

export function loadGA(measurementId) {
    if (!measurementId) return;
    if (gaLoaded) return;
    gaLoaded = true;

    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;

    window.gtag("js", new Date());
    window.gtag("config", measurementId, { anonymize_ip: true });
}

export function ensureGA(measurementId, consentValue) {
    if (consentValue !== "accepted") return;
    loadGA(measurementId);
}

export function trackPageView(measurementId, path) {
    if (!window.gtag || !measurementId) return;
    window.gtag("event", "page_view", {
        page_path: path,
        send_to: measurementId,
    });
}
