import React, { useEffect, useMemo, useRef, useState } from "react";
import AwesomeModal from "../AwesomeModal.jsx";
import AwesomeButton from "../AwesomeButton.jsx";
import StudentsSelectorSection from "../assignments/studentSelection/StudentsSelectorSection.jsx";
import StepScreens from "../StepScreens.jsx";
import Tooltip from "../Tooltip.jsx";

import ManualBuildSection from "../assignments/taskCreation/ManualBuildSection.jsx";
import AssignmentSummarySection from "../assignments/taskCreation/AssignmentSummarySection.jsx";

import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";
import { RULE_LABELS, LEVEL_RULES } from "../../../utils/rules.js";


function uniqStrings(arr) {
    const s = new Set((arr || []).map((x) => String(x)).filter(Boolean));
    return Array.from(s);
}

function makeRandomSeed() {
    return Math.floor(Math.random() * 1_000_000_000);
}

function findRuleLevel(ruleId) {
    const id = String(ruleId || "").trim();
    if (!id) return "—";

    for (const [lvl, ids] of Object.entries(LEVEL_RULES || {})) {
        if ((ids || []).includes(id)) return lvl;
    }
    return "—";
}

export default function CreateHomeworkModal({ open, onClose, onCreated }) {
    const ctx = useTeacherDashboard();

    const [selectedStudentIds, setSelectedStudentIds] = useState([]);
    const selectedCount = useMemo(() => selectedStudentIds.length, [selectedStudentIds]);

    // ✅ build RULES list (for your manual build UI)
    const RULES = useMemo(() => {
        const out = Object.entries(RULE_LABELS || {}).map(([id, label]) => ({
            id,
            label,
            level: findRuleLevel(id),
        }));

        const order = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6, "—": 99 };
        out.sort((a, b) => {
            const da = order[a.level] ?? 99;
            const db = order[b.level] ?? 99;
            if (da !== db) return da - db;
            return String(a.label || "").localeCompare(String(b.label || ""));
        });

        return out;
    }, []);

    const STEPS = useMemo(
        () => [
            { label: "Учні", title: "Вибери учнів", subtitle: "Обери класи або окремих учнів" },
            { label: "Завдання", title: "Налаштуй завдання", subtitle: "Обери тип завдань, кількість і тему" },
            { label: "Підсумок", title: "Майже готово", subtitle: "Переконайся, що все правильно" },
        ],
        []
    );

    const [step, setStep] = useState(0);

    // ✅ Step 1 readiness gate (build must happen)
    const [step2Ready, setStep2Ready] = useState(false);

    // ✅ trigger for sending (Step 2 listens to this)
    const [confirmNonce, setConfirmNonce] = useState(0);

    const previewKey = useMemo(() => uniqStrings(selectedStudentIds).sort().join("|"), [selectedStudentIds]);

    // ✅ hidden seed
    const seedRef = useRef(makeRandomSeed());

    // When student selection changes, re-seed and re-lock Step 1
    useEffect(() => {
        seedRef.current = makeRandomSeed();
        setStep2Ready(false);
        // also clear built preview to avoid stale tasks (optional but sane)
        ctx?.setBuiltTasksPreview?.(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewKey]);

    // ✅ unlock Step 1 when tasks are built
    useEffect(() => {
        const tasks = ctx?.builtTasksPreview?.tasks || ctx?.builtTasksPreview?.data?.tasks || [];
        setStep2Ready(Array.isArray(tasks) && tasks.length > 0);
    }, [ctx?.builtTasksPreview]);

    const screenTitle = STEPS?.[step]?.title || "Створити домашнє завдання";
    const screenSubtitle = STEPS?.[step]?.subtitle || `Крок ${step + 1} з ${STEPS.length}`;

    const isFirst = step <= 0;
    const isLast = step >= STEPS.length - 1;

    const validateStep = (idx) => {
        if (idx === 0) {
            const ok = (selectedStudentIds?.length || 0) > 0;
            return ok ? { ok: true, message: "" } : { ok: false, message: "Вибери учня, щоб продовжити" };
        }

        if (idx === 1) {
            return step2Ready ? { ok: true, message: "" } : { ok: false, message: "Згенеруй список завдань, щоб продовжити" };
        }

        if (idx === 2) {
            const tasks = ctx?.builtTasksPreview?.tasks || [];
            const ok = (selectedStudentIds?.length || 0) > 0 && Array.isArray(tasks) && tasks.length > 0;
            return ok ? { ok: true, message: "" } : { ok: false, message: "Немає завдань для відправки" };
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

        // ✅ trigger Step 2 “send”
        setConfirmNonce((x) => x + 1);
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
                            <AwesomeButton variant="ghost" onClick={onBack} disabled={isFirst} title={isFirst ? "Це перший крок" : backLabel}>
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
                            return (
                                <div style={styles.stepFill} key={previewKey}>
                                    <ManualBuildSection
                                        rules={RULES}
                                        selectedStudentIds={selectedStudentIds}
                                        seed={seedRef.current}
                                        selectedRuleIds={ctx.selectedRuleIds}
                                        setSelectedRuleIds={ctx.setSelectedRuleIds}
                                        manualBuild={ctx.manualBuild}
                                        setManualBuild={ctx.setManualBuild}
                                        setBuiltTasksPreview={ctx.setBuiltTasksPreview}
                                        setStep2Ready={setStep2Ready}
                                    />
                                </div>
                            );
                        }

                        // ✅ Step 2: summary + send
                        return (
                            <div style={styles.stepFill}>
                                <AssignmentSummarySection
                                    selectedStudentIds={selectedStudentIds}
                                    students={ctx.students || []}
                                    builtTasksPreview={ctx.builtTasksPreview}
                                    confirmNonce={confirmNonce}
                                    onDone={() => {
                                        onClose?.();
                                        // refresh page after close
                                        window.location.reload();
                                        onCreated?.();
                                    }}
                                />
                            </div>
                        );
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
