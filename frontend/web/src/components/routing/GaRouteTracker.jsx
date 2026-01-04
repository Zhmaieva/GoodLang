import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {getCookieConsent} from "../../services/settingsService.js";
import {ensureAnalytics, trackPageView} from "../../services/gaService.js";

export default function GaRouteTracker() {
    const location = useLocation();

    useEffect(() => {
        const consent = getCookieConsent();
        ensureAnalytics();
        if (consent !== "accepted") return;

        trackPageView(location.pathname + location.search);
    }, [location.pathname, location.search]);

    return null;
}
