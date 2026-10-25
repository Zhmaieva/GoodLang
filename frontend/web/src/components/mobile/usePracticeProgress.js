import { useEffect, useState } from "react";
import { getOverallAccuracy } from "../../services/dataService.js";
import { off, on } from "../../services/events.js";

export default function usePracticeProgress() {
    const [progress, setProgress] = useState(() => getOverallAccuracy());
    useEffect(() => {
        const refresh = () => setProgress(getOverallAccuracy());
        const events = ["weeklyProgressUpdate", "refreshAccount", "vocabularyUpdated"];
        events.forEach((event) => on(event, refresh));
        window.addEventListener("storage", refresh);
        return () => {
            events.forEach((event) => off(event, refresh));
            window.removeEventListener("storage", refresh);
        };
    }, []);
    return progress;
}
