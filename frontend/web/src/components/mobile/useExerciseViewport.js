import { useLayoutEffect } from "react";

// The exercise is a bounded screen. Only the prompt and answer may scroll.
// On native, its height comes from the actual WebView frame after native
// keyboard avoidance; never subtract the keyboard height again in JavaScript.
export default function useExerciseViewport(enabled) {
    useLayoutEffect(() => {
        if (!enabled) return;
        const root = document.documentElement;
        const viewport = window.visualViewport;
        const native = window.__GOODLANG_NATIVE__?.isNativeApp === true;
        const sendMode = (active) => window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: "goodlang:practice-screen", active,
        }));
        const update = () => {
            root.classList.toggle("goodlang-answer-focused", document.activeElement?.matches("[data-goodlang-answer]") === true);
            if (!native) {
                root.style.setProperty("--exercise-viewport-height", `${viewport?.height ?? window.innerHeight}px`);
                root.style.setProperty("--exercise-viewport-top", `${viewport?.offsetTop ?? 0}px`);
            }
        };
        root.classList.add("goodlang-practice-screen");
        window.scrollTo(0, 0);
        sendMode(true);
        update();
        viewport?.addEventListener("resize", update);
        viewport?.addEventListener("scroll", update);
        window.addEventListener("resize", update);
        document.addEventListener("focusin", update);
        document.addEventListener("focusout", update);
        return () => {
            root.classList.remove("goodlang-practice-screen", "goodlang-answer-focused");
            root.style.removeProperty("--exercise-viewport-height");
            root.style.removeProperty("--exercise-viewport-top");
            viewport?.removeEventListener("resize", update);
            viewport?.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            document.removeEventListener("focusin", update);
            document.removeEventListener("focusout", update);
            sendMode(false);
        };
    }, [enabled]);
}
