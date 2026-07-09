export const FONT_FAMILY_NAME = "Source Serif 4";
export const FONT_FALLBACK_FAMILIES = ["Georgia", "serif"];
export const FONT_CSS_VARIABLE = "--font-family-base";
export const FONT_FAMILY_CSS_VAR = `var(${FONT_CSS_VARIABLE})`;

export const FONT_FAMILY = `"${FONT_FAMILY_NAME}", ${FONT_FALLBACK_FAMILIES.join(", ")}`;
export const FONT_FAMILY_CSS = `'${FONT_FAMILY_NAME}', ${FONT_FALLBACK_FAMILIES.join(", ")}`;
export const FONT_TEMPLATE_TOKEN = "{{FONT_FAMILY}}";
export const GOOGLE_FONT_STYLESHEET_URL =
    `https://fonts.googleapis.com/css2?family=${FONT_FAMILY_NAME.replaceAll(" ", "+")}:opsz,wght@8..60,200..900&display=swap`;

export function applyFontFamilyTemplate(html) {
    return String(html ?? "").replaceAll(FONT_TEMPLATE_TOKEN, FONT_FAMILY_CSS);
}

export function installGlobalFont(documentRef = globalThis.document) {
    if (!documentRef?.documentElement) return;

    documentRef.documentElement.style.setProperty(FONT_CSS_VARIABLE, FONT_FAMILY);

    if (!documentRef.querySelector('link[data-goodlang-font="preconnect-fonts"]')) {
        const fontsPreconnect = documentRef.createElement("link");
        fontsPreconnect.rel = "preconnect";
        fontsPreconnect.href = "https://fonts.googleapis.com";
        fontsPreconnect.dataset.goodlangFont = "preconnect-fonts";
        documentRef.head.appendChild(fontsPreconnect);
    }

    if (!documentRef.querySelector('link[data-goodlang-font="preconnect-static"]')) {
        const staticPreconnect = documentRef.createElement("link");
        staticPreconnect.rel = "preconnect";
        staticPreconnect.href = "https://fonts.gstatic.com";
        staticPreconnect.crossOrigin = "";
        staticPreconnect.dataset.goodlangFont = "preconnect-static";
        documentRef.head.appendChild(staticPreconnect);
    }

    if (!documentRef.querySelector('link[data-goodlang-font="stylesheet"]')) {
        const stylesheet = documentRef.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = GOOGLE_FONT_STYLESHEET_URL;
        stylesheet.dataset.goodlangFont = "stylesheet";
        documentRef.head.appendChild(stylesheet);
    }
}
