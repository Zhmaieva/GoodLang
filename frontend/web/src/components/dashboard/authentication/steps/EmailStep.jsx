import React from "react";
import { theme } from "../../../../App.jsx";

import Input from "../../Input.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";

function normalizeEmail(s) {
    return String(s ?? "").trim().toLowerCase();
}
function isValidEmail(v) {
    const s = normalizeEmail(v);
    return /^\S+@\S+\.\S+$/.test(s);
}

export default function EmailStep({ initialEmail = "", onConfirmed, onNext }) {
    const [email, setEmail] = React.useState(normalizeEmail(initialEmail));
    const [hint, setHint] = React.useState("");

    // ✅ drives first-appear fade-in
    const [isShown, setIsShown] = React.useState(false);
    React.useEffect(() => {
        // next paint -> triggers transition 0 -> 1
        const id = requestAnimationFrame(() => setIsShown(true));
        return () => cancelAnimationFrame(id);
    }, []);

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

    const actionsStyle = {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
    };

    const onContinue = async () => {
        const v = normalizeEmail(email);
        setEmail(v);

        if (!v) {
            setHint("Email is required.");
            return;
        }
        if (!isValidEmail(v)) {
            setHint("Please enter a valid email.");
            return;
        }

        const ok = await onConfirmed?.(v);
        if (ok === false) return;

        onNext?.();
    };

    const fade = {
        transition: `opacity ${theme.motion.normal} ${theme.motion.ease}`,
    };

    const baseOpacity = isShown ? 1 : 0;

    const canContinue = !!String(email || "").trim();
    const buttonOpacity = isShown && canContinue ? 1 : 0;

    return (
        <div style={stackStyle}>
            <div
                style={{
                    ...subtitleStyle,
                }}
            >
                In order to proceed, we need to verify your email.
            </div>

            <div>
                <Input
                    title=""
                    mode="email"
                    placeholder="name@school.com"
                    value={email}
                    onChange={(v) => {
                        setEmail(v);
                        if (hint) setHint("");
                    }}
                    subtext={hint}
                />
            </div>

            <div
                style={{
                    ...actionsStyle,
                    ...fade,
                    opacity: buttonOpacity,
                    pointerEvents: buttonOpacity ? "auto" : "none",
                    transitionDelay: `${theme.flow.stagger.delayStep * 3}ms`,
                }}
            >
                <AwesomeActionButton
                    variant="ghost"
                    size="regular"
                    symbol={"→"}
                    onClick={onContinue}
                >
                    Continue
                </AwesomeActionButton>
            </div>
        </div>
    );
}
