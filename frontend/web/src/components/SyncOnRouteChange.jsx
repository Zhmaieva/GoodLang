import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { syncWithServer } from "../services/dataService";
import { callAccountInfoApi } from "../services/api.js";

const FIRST_OPEN_KEY = "gl_has_opened";
const TEACHER_KEY = "teacher";

export function checkRouteRedirect(navigate) {
    const params = new URLSearchParams(window.location.search);
    const isTeacher = params.get("teacher") === "true";
    const shouldOpenSubscribe = params.get("subscribe") === "true";

    // If teacher=true -> remember it + remove param from URL (no redirect)
    if (isTeacher) {
        localStorage.setItem(TEACHER_KEY, "true");
        params.delete("teacher");

        const nextSearch = params.toString();
        const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}${window.location.hash || ""}`;

        // Remove param without triggering navigation / redirect loops
        window.history.replaceState(null, "", nextUrl);
    }

    const hasOpened = localStorage.getItem(FIRST_OPEN_KEY);

    if (!hasOpened) {
        localStorage.setItem(FIRST_OPEN_KEY, "1");

        // Only redirect to /welcome if NOT teacher and NOT subscribe
        if (!isTeacher) {
            // avoid redirect loop if already on /welcome
            if (location.pathname !== "/welcome"
                && location.pathname !== '/greetings'
                && location.pathname !== '/hello'
                && location.pathname !== '/crossword'
                && location.pathname !== '/marathon'
                && !shouldOpenSubscribe) {
                navigate("/greetings", { replace: true });
                return true;
            }
        }
    }
    return false;
}

export default function SyncOnRouteChange() {
    const location = useLocation();
    const navigate = useNavigate();
    const checkedFirstOpen = useRef(false);

    useEffect(() => {
        // 🔹 First-open check (run once)
        if (!checkedFirstOpen.current) {
            checkedFirstOpen.current = true;

            const redirected = checkRouteRedirect(navigate);
            if (location.pathname === "/" && !redirected)
                navigate("/trainer", { replace: true });
        }

        // 🔹 Normal sync logic on route change
        sync().then();
    }, [location.pathname]);

    async function sync() {
        const account = await callAccountInfoApi();
        if (account?.status === "paid" || account?.status === "attention") {
            await syncWithServer();
        }
    }

    return null;
}
