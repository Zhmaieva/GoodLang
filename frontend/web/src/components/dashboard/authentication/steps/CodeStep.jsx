import React from "react";
import { theme } from "../../../../App.jsx";
import AuthCodeInput from "../AuthCodeInput.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";

function onlyDigits(s) {
    return String(s ?? "").replace(/\D/g, "");
}

export default function CodeStep({ email = "", onVerified, onNext, onBack }) {
    const [code, setCode] = React.useState("");

    const subtitleStyle = {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textMutedDark,
    };

    const stackStyle = {
        width: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.gap,
    };

    const actionsRowStyle = {
        width: "100%",
        minWidth: 0,
        display: "flex",
        alignItems: theme.layout?.rowAlign || "center",
        justifyContent: "space-between",
        gap: theme.spacing.gap,
    };

    const verify = async () => {
        const clean = onlyDigits(code);
        setCode(clean);

        const L = theme.authCodeInput.length;
        if (clean.length < L) return;

        const ok = await onVerified?.(clean);
        if (ok === false) return;

        onNext?.();
    };

    return (
        <div style={stackStyle}>
            <div style={subtitleStyle}>
                We have sent an email to {String(email || "").trim() || "your email"}.
            </div>

            <AuthCodeInput
                value={code}
                onChange={(v) => setCode(onlyDigits(v))}
            />

            <div style={actionsRowStyle}>
                <AwesomeActionButton
                    variant="ghost"
                    size="regular"
                    symbol={"←"}
                    onClick={onBack}
                >
                    Back
                </AwesomeActionButton>

                <AwesomeActionButton
                    variant="ghost"
                    size="regular"
                    symbol={"→"}
                    onClick={verify}
                >
                    Verify
                </AwesomeActionButton>
            </div>
        </div>
    );
}
