import React, { useEffect, useMemo, useState } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Page from "../../../Page.jsx";
import Flow from "../../../Flow.jsx";
import {apiJoinTaskSet, apiStudentTaskSetTasksStudent, callVerifyCodeApi} from "../../../../../services/api.js";
import { logError } from "../../../../../services/logger.js";
import ChooseOptionGapTaskWorkView from "./ChooseOptionGapTaskWorkView.jsx";
import TasksProgressList from "./TasksProgressList.jsx"; // adjust path
import {theme} from "../../../../../App.jsx";
import {useTeacherDashboard} from "../../../TeacherDashboardContext.jsx";
import NameStep from "../../../authentication/steps/NameStep.jsx";
import {saveName, sendEmailCode} from "../../../authentication/SignInPage.jsx";
import EmailStep from "../../../authentication/steps/EmailStep.jsx";
import CodeStep from "../../../authentication/steps/CodeStep.jsx";
import TermsStep from "../../../authentication/steps/TermsStep.jsx";
import {TERMS_OF_USE_CONTENT} from "../../../../../services/touService.js";
import CustomInfoStep from "../../../CustomInfoStep.jsx";

function extractTaskSetId(pathname) {
    const parts = String(pathname || "")
        .split("?")[0]
        .split("#")[0]
        .split("/")
        .filter(Boolean);

    const idx = parts.findIndex((p) => p === "assignments");
    if (idx === -1) return "";

    return String(parts[idx + 1] || "").trim();
}

export function WorkOnAssignmentPage() {
    const location = useLocation();

    const taskSetId = useMemo(() => extractTaskSetId(location?.pathname), [location?.pathname]);

    const [activeTaskId, setActiveTaskId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [tasks, setTasks] = useState([]);
    const [allDone, setAllDone] = useState(false);
    const [taskListVisible, setTaskListVisible] = useState(true);

    const [answersByTaskId, setAnswersByTaskId] = useState({});

    const { teacher, reloadAll } = useTeacherDashboard(); // same context

    const [sentEmail, setSentEmail] = useState("");
    const [sentCode, setSentCode] = useState("");

    const navigate = useNavigate();

    const verifyEmailCode = async (email, code, acceptTou = false) => {
        try {
            const { token, mustAcceptTerms } = await callVerifyCodeApi({
                email,
                code,
                termsAccepted: acceptTou,
            });

            if (acceptTou || !mustAcceptTerms) {
                localStorage.setItem("token", token);
                await reloadAll();
                return "next";
            }

            setSentCode(code);
            return "terms";
        } catch (e) {
            logError(e);
            return "error";
        }
    };

    useEffect(() => {
        let cancelled = false;

        async function run() {
            setLoading(true);
            setError("");
            setTasks([]);

            try {
                const id = String(taskSetId ?? "").trim();
                if (!id) throw new Error("Missing taskSetId in URL path");

                await apiJoinTaskSet({ taskSetId: id });
                if (cancelled) return;

                const res = await apiStudentTaskSetTasksStudent({ taskSetId: id });
                if (cancelled) return;

                const arr = Array.isArray(res?.tasks) ? res.tasks : Array.isArray(res) ? res : [];
                setTasks(arr);
            } catch (e) {
                logError?.(e);
                if (!cancelled) setError(e?.message || "Failed to load assignment");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        run();

        return () => {
            cancelled = true;
        };
    }, [taskSetId]);

    const areAllDone = () => {
        const total = tasks.length || 0;
        return Object.keys(answersByTaskId)?.filter(x => answersByTaskId[x].submitted).length === total && tasks.length > 0;
    }

    const steps = useMemo(() => {
        const total = tasks.length || 0;
        const allDoneValue = areAllDone();
        setAllDone(allDoneValue);

        let result = tasks.map((task, idx) => {
            const key = String(task?.id || `${idx}`);

            return {
                key,
                title: `Task ${idx + 1}/${total}`,
                render: ({ goNext, goPrev, goTo }) => {
                    const taskId = String(task?.id || idx);
                    const saved = answersByTaskId[taskId] || {};

                    return (
                        <ChooseOptionGapTaskWorkView
                            key={taskId}
                            task={task}
                            initialSelected={saved.selected ?? null}
                            initialSubmitted={Boolean(saved.submitted)}
                            onSelect={(value) => {
                                setAnswersByTaskId((prev) => ({
                                    ...prev,
                                    [taskId]: {
                                        ...(prev[taskId] || {}),
                                        selected: value,
                                        submitted: false,
                                    },
                                }));
                            }}
                            onSubmit={async (selected) => {
                                setAnswersByTaskId((prev) => ({
                                    ...prev,
                                    [taskId]: {
                                        ...(prev[taskId] || {}),
                                        selected: String(selected ?? ""),
                                        submitted: true,
                                        submittedAt: Date.now(),
                                    },
                                }));
                                return true;
                            }}
                            onBack={goPrev}
                            onNext={goNext}
                            canBack={idx > 0}
                            canNext={idx < total - 1 || areAllDone()}
                        />
                    );
                },
            };
        });

        if (!tasks.length) {
            return result;
        }

        if (!teacher?.first_name) {
            result.push({
                key: "name",
                title: "Please sign your work",
                render: ({ goNext, goPrev }) => (
                    <NameStep
                        initialFirstName={''}
                        initialLastName={''}
                        onConfirmed={async ({firstName, lastName}) => {
                            await saveName({firstName, lastName});
                            reloadAll();
                        }}
                        onNext={() => {
                            goNext();
                        }}
                        canBack={false}
                        canNext={false}
                    />
                ),
            });
        }

        if (!teacher?.email) {
            result.push({
                key: "email",
                title: "Don't lose your progress",
                render: ({ goNext, goPrev, goTo }) => (
                    <EmailStep
                        initialEmail={''}
                        title={'Confirm your email to access your progress from anywhere, anytime'}
                        onConfirmed={(email) => {
                            sendEmailCode(email).then();
                            setSentEmail(email);
                            return true;
                        }}
                        onNext={goNext}
                        onSkip={() => {
                            goTo("finish")
                        }}
                    />
                ),
            });
            result.push({
                key: "code",
                title: "Enter the code",
                render: ({ goNext, goPrev, goTo }) => (
                    <CodeStep
                        email={sentEmail}
                        onVerified={async (code) => {
                            const res = await verifyEmailCode(sentEmail, code, false);

                            if (res === "terms") {
                                goTo("terms");
                                return true;
                            }

                            if (res === "next") {
                                goTo("finish");
                                return true;
                            }

                            return false;
                        }}
                        onBack={goPrev}
                    />
                )
            });
            result.push({
                key: "terms",
                title: "Please review",
                render: ({ goNext }) => (
                    <TermsStep
                        paragraphs={TERMS_OF_USE_CONTENT}
                        verifyApi={async () => {
                            await verifyEmailCode(sentEmail, sentCode, true);
                        }}
                        onAccepted={() => {
                            reloadAll().then();
                            goNext();
                        }}
                        onDeclined={goNext}
                    />
                ),
            });
        }

        result.push({
            key: 'finish',
            title: 'All done',
            render: ({ goNext, goPrev }) => (
                <CustomInfoStep
                    title={"Your answers have been saved and sent to the teacher"}
                    subtitle={"Do other assignments, review previous ones, or have a cup of tea"}
                    buttonText={"Go to assignments"}
                    backButtonText={"Go to submissions"}
                    onAction={() => {
                        navigate('/student/assignments');
                    }}
                    onBackAction={() => {
                        navigate('/student/submissions');
                    }}
                />
            )
        });


        return result;
    }, [tasks, answersByTaskId, sentEmail, sentCode]);

    return (
        <Page title="Work on Assignment">
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100vh - 140px)",
                    minHeight: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flex: "1 1 auto",
                        minHeight: 0,
                        gap: theme.spacing.gap,
                        alignItems: "stretch",
                    }}
                >
                    <div style={{ flex: "1 1 auto", transition: `width ${theme.motion.normal} ${theme.motion.ease}`, minWidth: 0, minHeight: 0 }}>
                        <Flow
                            style={{height:'100%'}}
                            steps={steps}
                            activeKey={activeTaskId || steps?.[0]?.key || ""}
                            onActiveKeyChange={setActiveTaskId}
                            onDone={() => {}}
                            onBetweenPhases={() => {
                                if (areAllDone())
                                    setTaskListVisible(false);
                            }}
                        />
                    </div>

                    {taskListVisible &&
                        <div style={{
                            transition: `opacity ${theme.motion.normal} ${theme.motion.ease}`,
                            opacity: (!allDone || taskListVisible) ? 1 : 0,
                            width: 420,
                            minWidth: 320,
                            minHeight: 0}}>
                            <TasksProgressList
                                tasks={tasks}
                                answersByTaskId={answersByTaskId}
                                activeTaskId={activeTaskId || steps?.[0]?.key || ""}
                                onSelectTaskId={setActiveTaskId}
                            />
                        </div>
                    }

                </div>
            </div>
        </Page>
    );


}
