import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { syncWithServer } from "../services/dataService";
import {callAccountInfoApi} from "../services/api.js";

export default function SyncOnRouteChange() {
    const location = useLocation();

    useEffect(() => {
        sync().then();
    }, [location.pathname]); // triggers on each navigation

    async function sync() {
        const account = await callAccountInfoApi();
        if (account?.status === 'paid' || account?.status === 'attention') {
            await syncWithServer();
        }
    }

    return null; // This component renders nothing
}
