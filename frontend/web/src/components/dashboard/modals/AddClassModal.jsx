import React, { useState } from "react";
import AwesomeModal from "../AwesomeModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

export default function AddClassModal({ open, onClose, onCreate }) {
    const [name, setName] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    async function submit() {
        setErr("");
        const trimmed = String(name || "").trim();
        if (!trimmed) {
            setErr("Вкажіть назву класу");
            return;
        }

        setBusy(true);
        try {
            await onCreate?.(trimmed);
            setName("");
            onClose?.();
        } catch (e) {
            setErr(e?.message || "Не вдалося створити клас");
        } finally {
            setBusy(false);
        }
    }

    return (
        <AwesomeModal
            open={open}
            onClose={onClose}
            title="Створити клас"
            footer={
                <>
                    <AwesomeButton variant="ghost" onClick={onClose} disabled={busy}>
                        Скасувати
                    </AwesomeButton>
                    <AwesomeButton onClick={submit} disabled={busy}>
                        Створити
                    </AwesomeButton>
                </>
            }
        >
            <div style={styles.field}>
                <div style={styles.label}>Назва класу</div>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Напр. A2 група (вечір)"
                    style={styles.input}
                />
            </div>

            {err ? <div style={styles.err}>{err}</div> : null}
        </AwesomeModal>
    );
}

const styles = {
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontWeight: 900 },
    input: {
        padding: 10,
        border: "2px solid rgba(0,0,0,0.2)",
        outline: "none",
        fontWeight: 800,
        background: "rgba(255,255,255,0.9)",
    },
    err: {
        marginTop: 10,
        padding: 10,
        border: "2px solid rgba(255,0,0,0.25)",
        background: "rgba(255,0,0,0.06)",
        fontWeight: 900,
    },
};
