import React, { useMemo, useState } from "react";
import AwesomeModal from "../AwesomeModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import StudentsSelectorSection from "../sections/StudentsSelectorSection.jsx";
import StepScreens from "../StepScreens.jsx"; // adjust path if needed

function uniqStrings(arr) {
    const s = new Set((arr || []).map((x) => String(x)).filter(Boolean));
    return Array.from(s);
}

export default function CreateHomeworkModal({ open, onClose, onCreated }) {
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const selectedCount = useMemo(() => selectedStudentIds.length, [selectedStudentIds]);

    const STEPS = useMemo(() => ([
        {
            label: "Учні",
            title: "Вибери учнів",
            subtitle: "Обери класи або окремих учнів",
        },
        {
            label: "Завдання",
            title: "Налаштуй завдання",
            subtitle: "Або дай GoodLang зробити це за тебе",
        },
        {
            label: "Підсумок",
            title: "Майже готово",
            subtitle: "Переконайся, що все правильно",
        },
    ]), []);

    const [step, setStep] = useState(0);

    const screenTitle = STEPS?.[step]?.title || "Створити домашнє завдання";
    const screenSubtitle = STEPS?.[step]?.subtitle || `Крок ${step + 1} з ${STEPS.length}`;

    const isFirst = step <= 0;
    const isLast = step >= STEPS.length - 1;

    const nextLabel = useMemo(() => {
        if (isLast) return "Відправити завдання";
        const next = STEPS[step + 1]?.label ?? "Далі";
        return `Далі: ${next}`;
    }, [isLast, STEPS, step]);

    const backLabel = useMemo(() => {
        const prev = STEPS[step - 1]?.label ?? "Назад";
        return `Назад: ${prev}`;
    }, [STEPS, step]);

    const onNext = () => {
        if (!isLast) {
            setStep((s) => Math.min(s + 1, STEPS.length - 1));
            return;
        }

        // last step action (no-op for now)
        // later: call create homework API, then onCreated?.()
        // onCreated?.();
    };

    const onBack = () => {
        setStep((s) => Math.max(s - 1, 0));
    };

    if (!open) return null;

    return (
        <AwesomeModal
            open={open}
            onClose={onClose}
            width="80%"
            height="80vh"
            title="Створити домашнє завдання"
            footer={
                <div style={styles.footer}>
                    <div style={styles.footerLeft}>
                        <AwesomeButton
                            variant="ghost"
                            onClick={onBack}
                            disabled={isFirst}
                            title={isFirst ? "Це перший крок" : backLabel}
                        >
                            {backLabel}
                        </AwesomeButton>
                    </div>

                    <div style={styles.footerMeta}>
                        Обрано учнів: <b>{selectedCount}</b>
                    </div>

                    <div style={styles.footerRight}>
                        <AwesomeButton
                            variant="accent"
                            onClick={onNext}
                            title={nextLabel}
                        >
                            {nextLabel}
                        </AwesomeButton>
                    </div>
                </div>
            }
        >
            <div style={styles.body}>
                <StepScreens
                    title={screenTitle}
                    subtitle={screenSubtitle}
                    steps={STEPS}
                    step={step}
                    onStepChange={(s) => setStep(s)}
                    contentPadding={10}
                    style={{ height: "100%" }}
                >
                    {(activeStep) => {
                        if (activeStep === 0) {
                            return (
                                <div style={styles.stepFill}>
                                    <StudentsSelectorSection
                                        style={{ height: "100%" }}
                                        initialSelectedStudentIds={selectedStudentIds}
                                        onChangeSelectedStudentIds={(ids) => setSelectedStudentIds(uniqStrings(ids))}
                                    />
                                </div>
                            );
                        }

                        if (activeStep === 1) {
                            return <div style={styles.placeholder}>{/* TODO */}</div>;
                        }

                        return <div style={styles.placeholder}>{/* TODO */}</div>;
                    }}
                </StepScreens>
            </div>
        </AwesomeModal>
    );
}

const styles = {
    body: {
        height: "100%",
        minHeight: 0,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },

    // makes each step content fill available area
    stepFill: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },

    placeholder: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        border: "2px dashed rgba(0,0,0,0.12)",
        background: "rgba(0,0,0,0.02)",
    },

    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        width: "100%",
        flexWrap: "wrap",
    },

    footerLeft: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
    },

    footerMeta: {
        fontWeight: 900,
        color: "var(--muted, #a47856)",
        whiteSpace: "nowrap",
        minWidth: 0,
    },

    footerRight: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 0,
    },
};
