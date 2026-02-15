import React from "react";
import { theme } from "../../../../App.jsx";
import AuthCodeInput from "../AuthCodeInput.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";

function onlyDigits(s) {
    return String(s ?? "").replace(/\D/g, "");
}

/**
 * Props:
 * - onVerified: async (code) => boolean | void
 * - onNext: () => void
 * - onBack: () => void
 */
export default function CodeStep({ onVerified, onNext, onBack }) {
    const [code, setCode] = React.useState("");

    const verify = async (val) => {
        const clean = onlyDigits(val);
        setCode(clean);

        const L = theme.authCodeInput.length;
        if (clean.length < L) return;

        const ok = await onVerified?.(clean);
        if (ok === false) return;

        onNext?.();
    };

    return (
        <>
            <AuthCodeInput
                value={code}
                onChange={(v) => setCode(onlyDigits(v))}
                onComplete={verify}
            />

            <AwesomeActionButton
                variant="ghost"
                size="regular"
                title="Back"
                onClick={onBack}
            >
                Back
            </AwesomeActionButton>

            <AwesomeActionButton
                variant="accent"
                size="regular"
                title="Verify"
                onClick={() => verify(code)}
            >
                Verify
            </AwesomeActionButton>
        </>
    );
}
