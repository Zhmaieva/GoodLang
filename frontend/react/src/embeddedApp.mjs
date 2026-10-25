export const GOODLANG_ORIGIN = "https://goodlang.app";

export function getEmbeddedPath(value, fallback = "/") {
    try {
        const url = new URL(value, `${GOODLANG_ORIGIN}/`);
        if (url.origin !== GOODLANG_ORIGIN) return fallback;
        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return fallback;
    }
}

export function addNativeContext(html, context, path = "/") {
    const serialize = (value) => JSON.stringify(value).replaceAll("<", "\\u003c");
    const bootstrap = `<script>
        window.__GOODLANG_NATIVE__=${serialize(context)};
        (function () {
            window.history.replaceState(null, "", ${serialize(getEmbeddedPath(path))});
            var root = document.documentElement;
            root.classList.add("goodlang-native");
            root.style.setProperty("--native-safe-top", "${context.safeAreaInsets.top}px");
            root.style.setProperty("--native-safe-bottom", "${context.safeAreaInsets.bottom}px");
        })();
    </script>`;
    return html.replace("<head>", `<head>${bootstrap}`);
}
