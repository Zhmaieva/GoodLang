import React from "react";
import { theme } from "../../../../App.jsx";
import AuthCodeInput from "../AuthCodeInput.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";

function onlyDigits(s) {
    return String(s ?? "").replace(/\D/g, "");
}

const STUB_VALID_CODE = "123456";

export default function CodeStep({ email = "", onVerified, onNext, onBack }) {
    const [code, setCode] = React.useState("");

    // subtext behaves like Input subtext: reserved space + fade in/out
    const [hint, setHint] = React.useState("");
    const [hintOpacity, setHintOpacity] = React.useState(0);

    const L = theme.authCodeInput.length;
    const isFull = onlyDigits(code).length >= L;

    const subtitleStyle = {
        fontFamily: theme.fontFamily,
        fontSize: theme.type.subtitle,
        fontWeight: theme.weights.normal,
        lineHeight: theme.type.subtitleLineHeight,
        color: theme.textMutedDark,
    };

    // use the same style as Input subtext if present, otherwise fall back to subtitleStyle
    const hintStyleBase = theme.input?.subtext || subtitleStyle;

    const hintStyle = {
        ...hintStyleBase,
        textAlign: "center",
        transition: `opacity ${theme.motion.fast} ${theme.motion.ease}`,
        opacity: hintOpacity,
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

    const btnFadeStyle = {
        transition: `opacity ${theme.motion.normal} ${theme.motion.ease}`,
        opacity: isFull ? 1 : 0,
        pointerEvents: isFull ? "auto" : "none",
    };

    const verify = async () => {
        const clean = onlyDigits(code).slice(0, L);
        setCode(clean);

        if (clean.length < L) return;

        // prefer real verifier if provided; otherwise stub
        let ok = false;
        if (onVerified) {
            ok = await onVerified(clean);
        } else {
            ok = clean === STUB_VALID_CODE;
        }

        ok = false

        if (ok === false) {
            setHint("Invalid code");
            setHintOpacity(1);
            return;
        }

        onNext?.();
    };

    return (
        <div style={stackStyle}>
            <div style={subtitleStyle}>
                We have sent an email to {String(email || "").trim() || "your email"}.
            </div>

            <AuthCodeInput
                value={code}
                onChange={(v) => {
                    setCode(onlyDigits(v));

                    // like Input: hide hint on change (but keep row space)
                    if (hintOpacity !== 0) setHintOpacity(0);
                    if (hint) setHint("");
                }}
            />

            {/* subtext row (always occupies space) */}
            <div style={hintStyle}>{hint ? hint : "\u00A0"}</div>

            <div style={actionsRowStyle}>
                <AwesomeActionButton variant="ghost" size="regular" symbol={"←"} onClick={onBack}>
                    Back
                </AwesomeActionButton>

                <div style={btnFadeStyle}>
                    <AwesomeActionButton variant="ghost" size="regular" symbol={"→"} onClick={verify}>
                        Verify
                    </AwesomeActionButton>
                </div>
            </div>
        </div>
    );
}
