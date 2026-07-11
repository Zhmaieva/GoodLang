export const APP_BACKGROUND_COLOR = "#F3F8FC";
export const APP_BACKGROUND_CSS_VARIABLE = "--bg";
export const APP_ACCENT_COLOR = "#40a6ff";
export const APP_ACCENT_CSS_VARIABLE = "--accent";

export function installGlobalTheme(documentRef = globalThis.document) {
    if (!documentRef?.documentElement) return;

    documentRef.documentElement.style.setProperty(APP_BACKGROUND_CSS_VARIABLE, APP_BACKGROUND_COLOR);
    documentRef.documentElement.style.setProperty(APP_ACCENT_CSS_VARIABLE, APP_ACCENT_COLOR);
}
