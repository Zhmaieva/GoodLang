import React from "react";
import { theme } from "../../../../App.jsx";
import Input from "../../Input.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";

/**
 * Props:
 * - initialFirstName: string
 * - initialLastName: string
 * - onConfirmed: async ({firstName,lastName}) => boolean | void
 * - onNext: () => void
 * - onBack: () => void
 */
export default function NameStep({
                                     initialFirstName = "",
                                     initialLastName = "",
                                     onConfirmed,
                                     onNext,
                                     onBack,
                                 }) {
    const [firstName, setFirstName] = React.useState(String(initialFirstName || ""));
    const [lastName, setLastName] = React.useState(String(initialLastName || ""));
    const [error, setError] = React.useState("");

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

    const canBegin = String(firstName || "").trim().length > 2;

    const btnFadeStyle = {
        transition: `opacity ${theme.motion.normal} ${theme.motion.ease}`,
        opacity: canBegin ? 1 : 0,
        pointerEvents: canBegin ? "auto" : "none",
    };

    const submit = async () => {
        const f = String(firstName || "").trim();
        const l = String(lastName || "").trim();

        if (!f) {
            setError("First name is required.");
            return;
        }

        const ok = await onConfirmed?.({ firstName: f, lastName: l });
        if (ok === false) return;

        onNext?.();
    };

    return (
        <div style={stackStyle}>
            <div style={subtitleStyle}>For your best experience, we need a few more details</div>

            <Input
                placeholder="First name"
                value={firstName}
                onChange={(v) => {
                    setError("");
                    setFirstName(v);
                }}
                subtext={error}
                subtextHideOnType={true}
            />

            <Input
                placeholder="Last name (optional)"
                value={lastName}
                onChange={setLastName}
            />

            <div style={actionsRowStyle}>
                <AwesomeActionButton variant="ghost" size="regular" symbol={"←"} onClick={onBack}>
                    Back
                </AwesomeActionButton>

                <div style={btnFadeStyle}>
                    <AwesomeActionButton variant="ghost" size="regular" symbol={"→"} onClick={submit}>
                        Let’s begin
                    </AwesomeActionButton>
                </div>
            </div>
        </div>
    );
}
