import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { syncWithServer } from "../services/dataService";

export default function SyncOnRouteChange() {
    const location = useLocation();

    useEffect(() => {
        syncWithServer();
    }, [location.pathname]); // triggers on each navigation

    return null; // This component renders nothing
}
