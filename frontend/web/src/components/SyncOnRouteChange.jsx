import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { syncWithServer } from "../services/dataService";
import { callAccountInfoApi } from "../services/api.js";

const FIRST_OPEN_KEY = "gl_has_opened";

export default function SyncOnRouteChange() {
    const location = useLocation();
    const navigate = useNavigate();
    const checkedFirstOpen = useRef(false);

    useEffect(() => {
        // 🔹 First-open check (run once)
        if (!checkedFirstOpen.current) {
            checkedFirstOpen.current = true;

            const hasOpened = localStorage.getItem(FIRST_OPEN_KEY);

            if (!hasOpened) {
                localStorage.setItem(FIRST_OPEN_KEY, "1");

                // avoid redirect loop if already on /welcome
                if (location.pathname !== "/welcome") {
                    navigate("/welcome", { replace: true });
                    return;
                }
            }
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
