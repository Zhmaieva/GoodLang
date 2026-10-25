import assert from "node:assert/strict";
import test from "node:test";
import vm from "node:vm";
import {reloadApp} from "../../web/src/services/reloadApp.js";
import {addNativeContext, getEmbeddedPath} from "../src/embeddedApp.mjs";

function withWindow(value, run) {
    const original = globalThis.window;
    globalThis.window = value;
    try {
        return run();
    } finally {
        if (original === undefined) delete globalThis.window;
        else globalThis.window = original;
    }
}

test("native language refresh requests the bundle and restores route before app startup", () => {
    const messages = [];
    const route = "/trainer?ruleToDownload=WILL_PREDICTIONS&pdf_type=rule#answer";
    withWindow({
        __GOODLANG_NATIVE__: {isNativeApp: true},
        ReactNativeWebView: {postMessage: (message) => messages.push(JSON.parse(message))},
        location: {
            pathname: "/trainer",
            search: "?ruleToDownload=WILL_PREDICTIONS&pdf_type=rule",
            hash: "#answer",
            reload: () => assert.fail("Native refresh must not load the hosted website"),
            assign: () => assert.fail("Native refresh must not navigate to the website"),
        },
    }, () => reloadApp());
    assert.deepEqual(messages, [{type: "goodlang:reload", path: route}]);

    const context = {isNativeApp: true, safeAreaInsets: {top: 20, bottom: 0}};
    const html = addNativeContext("<html><head><script>startApp()</script></head></html>", context, messages[0].path);
    let restoredPath;
    const nativeWindow = {history: {replaceState: (_state, _title, path) => { restoredPath = path; }}};
    const root = {classList: {add() {}}, style: {setProperty() {}}};
    const bootstrap = html.match(/<script>([\s\S]*?)<\/script>/)[1];
    vm.runInNewContext(bootstrap, {window: nativeWindow, document: {documentElement: root}});
    assert.equal(restoredPath, route);
    assert.equal(nativeWindow.__GOODLANG_NATIVE__.isNativeApp, true);
    assert.ok(html.indexOf(bootstrap) < html.indexOf("startApp()"));
});

test("native refresh honors an explicit route", () => {
    withWindow({
        __GOODLANG_NATIVE__: {isNativeApp: true},
        ReactNativeWebView: {postMessage: (message) => {
            assert.deepEqual(JSON.parse(message), {type: "goodlang:reload", path: "/analytics"});
        }},
    }, () => reloadApp("/analytics"));
});

test("ordinary browsers retain document reload and navigation behavior", () => {
    let reloads = 0;
    const navigations = [];
    withWindow({location: {
        reload: () => { reloads += 1; },
        assign: (path) => navigations.push(path),
    }}, () => {
        reloadApp();
        reloadApp("/profile");
    });
    assert.equal(reloads, 1);
    assert.deepEqual(navigations, ["/profile"]);
});

test("embedded route restoration rejects external and non-web URLs", () => {
    for (const url of ["https://example.org/trainer", "//example.org/profile", "javascript:alert(1)", "about:blank"]) {
        assert.equal(getEmbeddedPath(url, "/vocabulary"), "/vocabulary");
    }
    assert.equal(getEmbeddedPath("https://goodlang.app/profile?tab=language#settings"), "/profile?tab=language#settings");
});

test("route text cannot break out of the bootstrap script", () => {
    const html = addNativeContext("<head></head>", {safeAreaInsets: {top: 0, bottom: 0}}, "/trainer?text=</script><script>bad()</script>");
    assert.equal((html.match(/<script>/g) || []).length, 1);
    assert.equal((html.match(/<\/script>/g) || []).length, 1);
});
