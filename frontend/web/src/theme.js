export const APP_BACKGROUND_COLOR = "#F3F8FC";
export const APP_BACKGROUND_CSS_VARIABLE = "--bg";

export function installGlobalTheme(documentRef = globalThis.document) {
    if (!documentRef?.documentElement) return;

    documentRef.documentElement.style.setProperty(APP_BACKGROUND_CSS_VARIABLE, APP_BACKGROUND_COLOR);
}
