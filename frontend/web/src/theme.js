export const APP_BACKGROUND_COLOR = "#eeefe1";
export const APP_BACKGROUND_CSS_VARIABLE = "--bg";
export const APP_ACCENT_COLOR = "#95b5fe";
export const APP_ACCENT_CSS_VARIABLE = "--accent";
export const LEARNED_STATUS_COLOR = "#2B2F6B";
export const LEARNED_STATUS_CSS_VARIABLE = "--status-learned";

export function installGlobalTheme(documentRef = globalThis.document) {
    if (!documentRef?.documentElement) return;

    documentRef.documentElement.style.setProperty(APP_BACKGROUND_CSS_VARIABLE, APP_BACKGROUND_COLOR);
    documentRef.documentElement.style.setProperty(APP_ACCENT_CSS_VARIABLE, APP_ACCENT_COLOR);
    documentRef.documentElement.style.setProperty(LEARNED_STATUS_CSS_VARIABLE, LEARNED_STATUS_COLOR);
}
