export const APP_BACKGROUND_COLOR = "#f8f9fc";
export const APP_BACKGROUND_CSS_VARIABLE = "--bg";
export const APP_SURFACE_COLOR = "#ffffff";
export const APP_SURFACE_CSS_VARIABLE = "--surface";
export const APP_SURFACE_MUTED_COLOR = "#f6f4ff";
export const APP_SURFACE_MUTED_CSS_VARIABLE = "--surface-muted";
export const APP_BORDER_COLOR = "#e6e8f1";
export const APP_BORDER_CSS_VARIABLE = "--border";
export const APP_TEXT_COLOR = "#20243a";
export const APP_TEXT_CSS_VARIABLE = "--text";
export const APP_MUTED_TEXT_COLOR = "#7d8499";
export const APP_MUTED_TEXT_CSS_VARIABLE = "--muted-text";
export const APP_ACCENT_COLOR = "#7b61d8";
export const APP_ACCENT_CSS_VARIABLE = "--accent";
export const APP_ACCENT_SOFT_COLOR = "#f1edff";
export const APP_ACCENT_SOFT_CSS_VARIABLE = "--accent-soft";
export const APP_DARK_COLOR = "#171b2f";
export const APP_DARK_CSS_VARIABLE = "--dark";
export const LEARNED_STATUS_COLOR = "#2B2F6B";
export const LEARNED_STATUS_CSS_VARIABLE = "--status-learned";

export function installGlobalTheme(documentRef = globalThis.document) {
    if (!documentRef?.documentElement) return;

    const root = documentRef.documentElement;
    root.style.setProperty(APP_BACKGROUND_CSS_VARIABLE, APP_BACKGROUND_COLOR);
    root.style.setProperty(APP_SURFACE_CSS_VARIABLE, APP_SURFACE_COLOR);
    root.style.setProperty(APP_SURFACE_MUTED_CSS_VARIABLE, APP_SURFACE_MUTED_COLOR);
    root.style.setProperty(APP_BORDER_CSS_VARIABLE, APP_BORDER_COLOR);
    root.style.setProperty(APP_TEXT_CSS_VARIABLE, APP_TEXT_COLOR);
    root.style.setProperty(APP_MUTED_TEXT_CSS_VARIABLE, APP_MUTED_TEXT_COLOR);
    root.style.setProperty(APP_ACCENT_CSS_VARIABLE, APP_ACCENT_COLOR);
    root.style.setProperty(APP_ACCENT_SOFT_CSS_VARIABLE, APP_ACCENT_SOFT_COLOR);
    root.style.setProperty(APP_DARK_CSS_VARIABLE, APP_DARK_COLOR);
    root.style.setProperty(LEARNED_STATUS_CSS_VARIABLE, LEARNED_STATUS_COLOR);
    root.style.setProperty("--font-family-base", 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif');
}
