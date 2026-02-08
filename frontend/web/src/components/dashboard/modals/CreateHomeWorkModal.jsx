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
            { label: "Students", title: "Select students", subtitle: "Choose classes or individual students" },
            { label: "Tasks", title: "Configure tasks", subtitle: "Choose task type, amount, and topic" },
            { label: "Summary", title: "Almost ready", subtitle: "Double-check before sending" },
        ],
        []
    );

    const [step, setStep] = useState(0);
    const [step2Ready, setStep2Ready] = useState(false);
    const [confirmNonce, setConfirmNonce] = useState(0);

    const previewKey = useMemo(() => uniqStrings(selectedStudentIds).sort().join("|"), [selectedStudentIds]);
    const seedRef = useRef(makeRandomSeed());

    useEffect(() => {
        seedRef.current = makeRandomSeed();
        setStep2Ready(false);
        ctx?.setBuiltTasksPreview?.(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [previewKey]);

    useEffect(() => {
        const tasks = ctx?.builtTasksPreview?.tasks || ctx?.builtTasksPreview?.data?.tasks || [];
        setStep2Ready(Array.isArray(tasks) && tasks.length > 0);
    }, [ctx?.builtTasksPreview]);

    const screenTitle = STEPS?.[step]?.title || "Create homework";
    const screenSubtitle = STEPS?.[step]?.subtitle || `Step ${step + 1} of ${STEPS.length}`;

    const isFirst = step <= 0;
    const isLast = step >= STEPS.length - 1;

    const validateStep = (idx) => {
        if (idx === 0) {
            const ok = (selectedStudentIds?.length || 0) > 0;
            return ok ? { ok: true, message: "" } : { ok: false, message: "Select at least one student to continue" };
        }

        if (idx === 1) {
            return step2Ready
                ? { ok: true, message: "" }
                : { ok: false, message: "Generate tasks to continue" };
        }

        if (idx === 2) {
            const tasks = ctx?.builtTasksPreview?.tasks || [];
            const ok = (selectedStudentIds?.length || 0) > 0 && Array.isArray(tasks) && tasks.length > 0;
            return ok ? { ok: true, message: "" } : { ok: false, message: "No tasks to send" };
        }

        return { ok: true, message: "" };
    };

    const currentValidation = validateStep(step);
    const isBlocked = !currentValidation?.ok;
    const blockMsg = currentValidation?.message || "Complete the current step";

    const nextLabel = useMemo(() => {
        if (isLast) return "Send assignment";
        const next = STEPS[step + 1]?.label ?? "Next";
        return `Next: ${next}`;
    }, [isLast, STEPS, step]);

    const backLabel = useMemo(() => {
        const prev = STEPS[step - 1]?.label ?? "Back";
        return `Back: ${prev}`;
    }, [STEPS, step]);

    const onNext = () => {
        if (isBlocked) return;
        if (!isLast) {
            setStep((s) => Math.min(s + 1, STEPS.length - 1));
            return;
        }
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
            title="Create homework"
            footer={
                <div style={styles.footer}>
                    <div style={styles.footerLeft}>
                        {!isFirst && (
                            <AwesomeButton variant="ghost" onClick={onBack}>
                                {backLabel}
                            </AwesomeButton>
                        )}
                    </div>

                    <div style={styles.footerMeta}>
                        Selected students: <b>{selectedCount}</b>
                    </div>

                    <div style={styles.footerRight}>
                        {isBlocked ? (
                            <Tooltip content={blockMsg} autoHideMs={1500} fadeMs={260}>
                                <AwesomeButton variant="accent" disabled>
                                    {nextLabel}
                                </AwesomeButton>
                            </Tooltip>
                        ) : (
                            <AwesomeButton variant="accent" onClick={onNext}>
                                {nextLabel}
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

                        return (
                            <div style={styles.stepFill}>
                                <AssignmentSummarySection
                                    selectedStudentIds={selectedStudentIds}
                                    students={ctx.students || []}
                                    builtTasksPreview={ctx.builtTasksPreview}
                                    confirmNonce={confirmNonce}
                                    onDone={() => {
                                        onClose?.();
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
    footerLeft: { display: "flex", gap: 10 },
    footerMeta: {
        fontWeight: 900,
        color: "var(--muted, #a47856)",
        whiteSpace: "nowrap",
    },
    footerRight: { display: "flex", gap: 10 },
};
