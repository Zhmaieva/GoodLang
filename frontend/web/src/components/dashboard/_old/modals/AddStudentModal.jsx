// AddStudentModal.jsx — FULL DROP-IN
import React, { useEffect, useMemo, useState } from "react";
import AwesomeModal from "../AwesomeModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";

export default function AddStudentModal({
                                            open,
                                            onClose,
                                            classId, // UUID | "none"
                                            onAdd,
                                            canAddStudents,
                                            isTeacherPlus,
                                            quota,
                                            activeStudentsCount,
                                        }) {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);

    const isNoClass = String(classId || "").toLowerCase() === "none";

    useEffect(() => {
        if (!open) {
            setErr("");
            setBusy(false);
        }
    }, [open]);

    const info = useMemo(() => {
        if (!isTeacherPlus) return "Ваш план: Free — ви не можете додавати студентів.";
        if (quota <= 0) return "Квота студентів = 0.";
        if (activeStudentsCount >= quota) return "Квота вичерпана — додавання студентів недоступне.";
        return `Активні студенти: ${activeStudentsCount} / ${quota}`;
    }, [isTeacherPlus, quota, activeStudentsCount]);

    async function submit() {
        setErr("");

        // ✅ allow "none"
        if (!classId) {
            setErr("Не вибрано клас / режим");
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
            title={isNoClass ? "Додати студента (без класу)" : "Додати студента в клас"}
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

            {isNoClass ? (
                <div style={styles.hint}>
                    Студент буде доданий до вас як до викладача. Ви зможете пізніше додати його в будь-який клас.
                </div>
            ) : null}

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
                    Додавання заблоковано. Перевірте план (Free/Teacher+) або квоту.
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
    hint: {
        marginTop: -2,
        marginBottom: 10,
        padding: 10,
        border: "2px solid rgba(0,0,0,0.10)",
        background: "rgba(255,255,255,0.6)",
        fontWeight: 800,
        lineHeight: 1.35,
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
        fontWeight: 800,
    },
};
