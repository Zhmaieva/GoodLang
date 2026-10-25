import { useEffect, useState } from "react";

export default function useMobileLayout() {
    const [mobile, setMobile] = useState(() => window.innerWidth < 915);
    useEffect(() => {
        const media = window.matchMedia("(max-width: 914px)");
        const update = () => setMobile(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);
    return mobile;
}
