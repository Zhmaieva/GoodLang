import React, { useState } from "react";
import AwesomeModal from "../AwesomeModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

export default function ConfirmModal({ open, title, text, confirmText = "Підтвердити", onCancel, onConfirm }) {
    const [busy, setBusy] = useState(false);

    async function confirm() {
        setBusy(true);
        try {
            await onConfirm?.();
        } finally {
            setBusy(false);
        }
    }

    return (
        <AwesomeModal
            open={open}
            onClose={busy ? undefined : onCancel}
            title={title || "Підтвердження"}
            footer={
                <>
                    <AwesomeButton variant="ghost" onClick={onCancel} disabled={busy}>
                        Скасувати
                    </AwesomeButton>
                    <AwesomeButton variant="danger" onClick={confirm} disabled={busy}>
                        {confirmText}
                    </AwesomeButton>
                </>
            }
        >
            <div style={styles.text}>{text || "Ви впевнені?"}</div>
        </AwesomeModal>
    );
}

const styles = {
    text: { fontWeight: 900, lineHeight: 1.35 },
};
