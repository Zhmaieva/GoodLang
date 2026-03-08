import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {checkRouteRedirect} from "../SyncOnRouteChange.jsx";

export function RootRedirect() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/") return;

        if (!checkRouteRedirect(navigate))
            navigate("/trainer", { replace: true });
    }, [location.pathname, navigate]);

    return null;
}

