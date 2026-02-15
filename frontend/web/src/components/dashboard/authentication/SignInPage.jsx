import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import EmptyContent from "../EmptyContent.jsx";

export default function SignInPage({ nextPath }) {
    const location = useLocation();

    const resolvedNext = useMemo(() => {
        if (nextPath) return String(nextPath);
        const p = (location?.pathname || "/") + (location?.search || "");
        return p;
    }, [nextPath, location?.pathname, location?.search]);

    return (
        <EmptyContent
            sourceText={"Let's get started"}
            subtitle={`Please sign in. After sign in you should return to: ${resolvedNext}`}
            actionText={"Sign in"}
            variant={"ghost"}
            onAction={() => {
                // barebones stub — plug your real sign-in flow here later
                // for now we just show the page + where you should redirect after sign in
            }}
        />
    );
}
