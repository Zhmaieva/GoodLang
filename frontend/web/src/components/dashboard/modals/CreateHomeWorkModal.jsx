import React, { useMemo, useRef, useState } from "react";
import AwesomeModal from "../AwesomeModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import StudentsSelectorSection from "../sections/StudentsSelectorSection.jsx";
import StepScreens from "../StepScreens.jsx";
import Tooltip from "../Tooltip.jsx"; // keep if you already use it in footer

import RecommendedPreviewSection from "../sections/RecommendedPreviewSection.jsx"; // ✅ adjust path if needed

function uniqStrings(arr) {
    const s = new Set((arr || []).map((x) => String(x)).filter(Boolean));
    return Array.from(s);
}

function makeRandomSeed() {
    // stable enough random int
    return Math.floor(Math.random() * 1_000_000_000);
}

export default function CreateHomeworkModal({ open, onClose, onCreated }) {
    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const selectedCount = useMemo(() => selectedStudentIds.length, [selectedStudentIds]);

    const STEPS = useMemo(
        () => [
            { label: "Учні", title: "Вибери учнів", subtitle: "Обери класи або окремих учнів" },
            { label: "Завдання", title: "Налаштуй завдання", subtitle: "Дай GoodLang зробити це за тебе" },
            { label: "Підсумок", title: "Майже готово", subtitle: "Переконайся, що все правильно" },
        ],
        []
    );

    const [step, setStep] = useState(0);

    // ✅ Step 2 readiness gate
    const [step2Ready, setStep2Ready] = useState(false);

    // ✅ used to force Loader remount when selection changes
    const previewKey = useMemo(() => uniqStrings(selectedStudentIds).sort().join("|"), [selectedStudentIds]);

    // ✅ seed should be random and not displayed; re-generate each preview run
    const seedRef = useRef(makeRandomSeed());

    // When student selection changes, Step 2 must re-load
    useMemo(() => {
        seedRef.current = makeRandomSeed();
        setStep2Ready(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewKey]);

    const screenTitle = STEPS?.[step]?.title || "Створити домашнє завдання";
    const screenSubtitle = STEPS?.[step]?.subtitle || `Крок ${step + 1} з ${STEPS.length}`;

    const isFirst = step <= 0;
    const isLast = step >= STEPS.length - 1;

    const validateStep = (idx) => {
        // Step 0: students required
        if (idx === 0) {
            const ok = (selectedStudentIds?.length || 0) > 0;
            return ok ? { ok: true, message: "" } : { ok: false, message: "Вибери учня, щоб продовжити" };
        }

        // ✅ Step 1: pass only after recommended-preview finished loading
        if (idx === 1) {
            return step2Ready
                ? { ok: true, message: "" }
                : { ok: false, message: "Завантажуємо рекомендації..." };
        }

        return { ok: true, message: "" };
    };

    const currentValidation = validateStep(step);
    const isBlocked = !currentValidation?.ok;
    const blockMsg = currentValidation?.message || "Заповни поточний крок";

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
        if (isBlocked) return;

        if (!isLast) {
            setStep((s) => Math.min(s + 1, STEPS.length - 1));
            return;
        }

        // last step action (no-op for now)
        // onCreated?.();
    };

    const onBack = () => setStep((s) => Math.max(s - 1, 0));

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
                        {!isFirst && (
                            <AwesomeButton
                                variant="ghost"
                                onClick={onBack}
                                disabled={isFirst}
                                title={isFirst ? "Це перший крок" : backLabel}
                            >
                                {backLabel}
                            </AwesomeButton>
                        )}
                    </div>

                    <div style={styles.footerMeta}>
                        Обрано учнів: <b>{selectedCount}</b>
                    </div>

                    <div style={styles.footerRight}>
                        {isBlocked ? (
                            <Tooltip content={blockMsg} autoHideMs={1500} fadeMs={260}>
                                <AwesomeButton variant="accent" onClick={onNext} disabled title={blockMsg}>
                                    <div style={styles.nextBtnInner}>
                                        <span style={{ ...styles.lockIcon }} />
                                        <span>{nextLabel}</span>
                                    </div>
                                </AwesomeButton>
                            </Tooltip>
                        ) : (
                            <AwesomeButton variant="accent" onClick={onNext} title={nextLabel}>
                                <div style={styles.nextBtnInner}>
                                    <span>{nextLabel}</span>
                                </div>
                            </AwesomeButton>
                        )}
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
                    validateStep={validateStep}
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
                            // ✅ Always load recommended-preview when this step is mounted
                            // (remount happens automatically when previewKey changes via key prop)
                            return (
                                <div style={styles.stepFill}>
                                    <RecommendedPreviewSection
                                        selectedStudentIds={selectedStudentIds}
                                    />
                                </div>
                            );
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

    stepFill: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    },

    emptyStepContent: {
        flex: "1 1 auto",
        minHeight: 0,
        minWidth: 0,
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

    nextBtnInner: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
    },

    lockIcon: {
        width: 16,
        height: 16,
        display: "block",
        maskImage: "url(/lock-icon.svg)",
        WebkitMaskImage: "url(/lock-icon.svg)",
        WebkitMask: "url(/lock-icon.svg) no-repeat center / contain",
        mask: "url(/lock-icon.svg) no-repeat center / contain",
        backgroundColor: "#fff",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        WebkitMaskSize: "contain",
        transform: "scale(1.2)",
        transformOrigin: "center",
    },
};
