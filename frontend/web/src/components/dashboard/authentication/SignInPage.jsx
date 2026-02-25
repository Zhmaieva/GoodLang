import React, {useState} from "react";
import Flow from "../Flow.jsx";

import EmailStep from "./steps/EmailStep.jsx";
import CodeStep from "./steps/CodeStep.jsx";
import NameStep from "./steps/NameStep.jsx";

import {getTeacherFromCtx, useTeacherDashboard} from "../TeacherDashboardContext.jsx";
import {apiBecomeTeacher, callAccountUpdateApi, callSendCodeApi, callVerifyCodeApi} from "../../../services/api.js";
import {logError} from "../../../services/logger.js";
import TermsStep from "./steps/TermsStep.jsx";
import {TERMS_OF_USE_CONTENT} from "../../../services/touService.js";

function pickEmail(t) {
    return t?.email ?? t?.profile?.email ?? "";
}
function pickFirstName(t) {
    return t?.first_name ?? t?.firstName ?? t?.profile?.first_name ?? "";
}
function pickLastName(t) {
    return t?.last_name ?? t?.lastName ?? t?.profile?.last_name ?? "";
}

export const saveName = async ({ firstName, lastName }) => {
    await callAccountUpdateApi({firstName, lastName});
    return true;
};

export const sendEmailCode = async (email) => {
    callSendCodeApi({email})
        .catch((err) => {
            logError(err);
        });
};

export default function SignInPage({forTeacher = false}) {
    const ctx = useTeacherDashboard?.();
    const teacher = getTeacherFromCtx(ctx);

    const [teacherEmail, setTeacherEmail] = useState(String(pickEmail(teacher) || "").trim());
    const [sentEmail, setSentEmail] = useState("");
    const [sentCode, setSentCode] = useState("");
    const [mustReviewTerms, setMustReviewTerms] = useState(false);
    const teacherFirst = String(pickFirstName(teacher) || "").trim();
    const teacherLast = String(pickLastName(teacher) || "").trim();

    const markUserAsTeacher = () => localStorage.setItem('isTeacherApp', 'true');

    const verifyEmailCode = async (email, code, acceptTou = false) => {
        try {
            const { token, mustAcceptTerms } = await callVerifyCodeApi({
                email,
                code,
                termsAccepted: acceptTou,
                teacher: forTeacher,
            });

            if (forTeacher) markUserAsTeacher();

            if (acceptTou || !mustAcceptTerms) {
                localStorage.setItem("token", token);
                await ctx?.reloadAll();
                return "next";
            }

            setSentCode(code);
            setMustReviewTerms(true);
            return "terms";
        } catch (e) {
            logError(e);
            return "error";
        }
    };

    const finish = async () => {
        await ctx?.reloadAll();
    };

    const steps = [
        {
            key: "email",
            title: "Sign in please",
            when: () => !teacherEmail,
            render: ({ goNext }) => (
                <EmailStep
                    initialEmail={teacherEmail}
                    onConfirmed={(email) => {
                        sendEmailCode(email).then();
                        setSentEmail(email);
                        return true;
                    }}
                    onNext={goNext}
                />
            ),
        },
        {
            key: "code",
            title: "Enter the code",
            when: () => !teacherEmail, // shown only if email step was required
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
                            goNext();
                            return true;
                        }

                        return false;
                    }}
                    onBack={goPrev}
                />
            )
        },
        {
            key: "terms",
            title: "Please review",
            when: () => !teacherEmail && mustReviewTerms, // shown only if email step was required
            render: ({ goNext }) => (
                <TermsStep
                    paragraphs={TERMS_OF_USE_CONTENT}
                    verifyApi={async () => {
                        await verifyEmailCode(sentEmail, sentCode, true);
                    }}
                    onAccepted={goNext}
                />
            ),
        },
        {
            key: "name",
            title: "Before we start",
            when: () => !teacherFirst,
            render: ({ goNext, goTo }) => (
                <NameStep
                    initialFirstName={teacherFirst}
                    initialLastName={teacherLast}
                    onConfirmed={saveName}
                    onNext={finish}
                    onBack={() => {
                        goTo('email')
                    }}
                />
            ),
        },
        {
            key: "teacher",
            title: "Teacher dashboard",
            when: () => forTeacher && (!localStorage.getItem('isTeacherApp') !== 'true'),
            render: ({ goNext, goTo }) => (
                <TermsStep
                    paragraphs={TERMS_OF_USE_CONTENT}
                    verifyApi={async () => {
                        await apiBecomeTeacher();
                        markUserAsTeacher();
                        return true;
                    }}
                    onAccepted={goNext}
                />
            ),
        },
    ];

    return <Flow steps={steps} onDone={finish} />;
}
