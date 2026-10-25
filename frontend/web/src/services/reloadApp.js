// Reloading an HTML-backed WebView loads its base URL from the website.
// Ask the native host to recreate the bundled app instead.
export function reloadApp(path) {
    if (window.__GOODLANG_NATIVE__?.isNativeApp && window.ReactNativeWebView?.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: "goodlang:reload",
            path: path ?? `${window.location.pathname}${window.location.search}${window.location.hash}`,
        }));
        return;
    }

    if (path === undefined) window.location.reload();
    else window.location.assign(path);
}
