import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {getCookieConsent} from "../../services/settingsService.js";
import {ensureGA, trackPageView} from "../../services/gaService.js";


const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export default function GaRouteTracker() {
    const location = useLocation();

    useEffect(() => {
        const consent = getCookieConsent();
        ensureGA(GA_ID, consent);
        if (consent !== "accepted") return;

        trackPageView(GA_ID, location.pathname + location.search);
    }, [location.pathname, location.search]);

    return null;
}
