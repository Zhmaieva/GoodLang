import React from "react";
import AwesomeActionButton from "../../AwesomeActionButton.jsx";

/**
 * Props:
 * - onDone: () => void
 */
export default function DoneStep({ onDone }) {
    return (
        <AwesomeActionButton
            variant="accent"
            size="regular"
            title="Continue"
            onClick={onDone}
        >
            Continue
        </AwesomeActionButton>
    );
}
