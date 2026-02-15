import React from "react";
import Input from "../../Input.jsx";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";

/**
 * Props:
 * - initialFirstName: string
 * - initialLastName: string
 * - onConfirmed: async ({firstName,lastName}) => boolean | void
 * - onNext: () => void
 */
export default function NameStep({
                                     initialFirstName = "",
                                     initialLastName = "",
                                     onConfirmed,
                                     onNext,
                                 }) {
    const [firstName, setFirstName] = React.useState(String(initialFirstName || ""));
    const [lastName, setLastName] = React.useState(String(initialLastName || ""));
    const [error, setError] = React.useState("");

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
        <>
            <Input
                title="First name"
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
                title="Last name (optional)"
                placeholder="Last name"
                value={lastName}
                onChange={setLastName}
            />

            <AwesomeActionButton
                variant="accent"
                size="regular"
                title="Confirm"
                onClick={submit}
            >
                Confirm
            </AwesomeActionButton>
        </>
    );
}
