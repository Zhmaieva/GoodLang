import React, { useEffect, useMemo, useState } from "react";
import AwesomeModal from "../AwesomeModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

export default function AddStudentModal({
                                            open,
                                            onClose,
                                            classId,
                                            onAdd,
                                            canAddStudents,
                                            isPro,
                                            quota,
                                            activeStudentsCount,
                                        }) {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (!open) {
            setErr("");
            setBusy(false);
        }
    }, [open]);

    const info = useMemo(() => {
        if (!isPro) return "Ваш план FREE — ви не можете додавати студентів.";
        if (quota <= 0) return "Квота студентів = 0.";
        if (activeStudentsCount >= quota) return "Квота вичерпана — додавання студентів недоступне.";
        return `Активні студенти: ${activeStudentsCount} / ${quota}`;
    }, [isPro, quota, activeStudentsCount]);

    async function submit() {
        setErr("");

        if (!classId) {
            setErr("Не вибрано клас");
            return;
        }

        const normalized = String(email || "").trim().toLowerCase();
        const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!EMAIL_REGEX.test(normalized)) {
            setErr("Вкажіть коректний email");
            return;
        }

        if (!canAddStudents) {
            setErr("Неможливо додати студента: план/квота");
            return;
        }

        setBusy(true);
        try {
            await onAdd?.(classId, {
                email: normalized,
                firstName: firstName.trim() || null,
                lastName: lastName.trim() || null,
            });
            setEmail("");
            setFirstName("");
            setLastName("");
            onClose?.();
        } catch (e) {
            setErr(e?.message || "Не вдалося додати студента");
        } finally {
            setBusy(false);
        }
    }

    return (
        <AwesomeModal
            open={open}
            onClose={onClose}
            title="Додати студента"
            footer={
                <>
                    <AwesomeButton variant="ghost" onClick={onClose} disabled={busy}>
                        Скасувати
                    </AwesomeButton>
                    <AwesomeButton onClick={submit} disabled={busy || !canAddStudents}>
                        Додати
                    </AwesomeButton>
                </>
            }
        >
            <div style={styles.info}>{info}</div>

            <div style={styles.grid}>
                <div style={styles.field}>
                    <div style={styles.label}>Email*</div>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@email.com"
                        style={styles.input}
                    />
                </div>

                <div style={styles.field}>
                    <div style={styles.label}>Імʼя</div>
                    <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Олена"
                        style={styles.input}
                    />
                </div>

                <div style={styles.field}>
                    <div style={styles.label}>Прізвище</div>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Петренко"
                        style={styles.input}
                    />
                </div>
            </div>

            {!canAddStudents ? (
                <div style={styles.blocked}>
                    Додавання заблоковано. Перевірте план (FREE/PRO) або квоту.
                </div>
            ) : null}

            {err ? <div style={styles.err}>{err}</div> : null}
        </AwesomeModal>
    );
}

const styles = {
    info: {
        padding: 10,
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(0,0,0,0.03)",
        fontWeight: 900,
        marginBottom: 10,
    },
    grid: { display: "grid", gridTemplateColumns: "1fr", gap: 10 },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontWeight: 900 },
    input: {
        padding: 10,
        border: "2px solid rgba(0,0,0,0.2)",
        outline: "none",
        fontWeight: 800,
        background: "rgba(255,255,255,0.9)",
    },
    blocked: {
        marginTop: 10,
        padding: 10,
        border: "2px solid rgba(0,0,0,0.12)",
        background: "rgba(0,0,0,0.03)",
        fontWeight: 900,
    },
    err: {
        marginTop: 10,
        padding: 10,
        border: "2px solid rgba(255,0,0,0.25)",
        background: "rgba(255,0,0,0.06)",
        fontWeight: 900,
    },
};
