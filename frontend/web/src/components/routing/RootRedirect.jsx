import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function RootRedirect() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== "/") return;

        const hasAnswersData = !!localStorage.getItem("answers_data");
        const isTeacherApp = localStorage.getItem("isTeacherApp") === "true";

        let accountInfo = null;
        try {
            accountInfo = JSON.parse(localStorage.getItem("account_info") || "null");
        } catch {
            accountInfo = null;
        }

        const hasEmail = !!accountInfo?.email;

        if (!hasAnswersData) {
            if (isTeacherApp || !hasEmail) {
                navigate("/school", { replace: true });
            } else {
                navigate("/student", { replace: true });
            }
        } else {
            navigate("/trainer", { replace: true });
        }
    }, [location.pathname, navigate]);

    return null;
}
