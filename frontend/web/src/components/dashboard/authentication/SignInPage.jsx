import React from "react";
import Flow from "../Flow.jsx";

import EmailStep from "./steps/EmailStep.jsx";
import CodeStep from "./steps/CodeStep.jsx";
import NameStep from "./steps/NameStep.jsx";
import DoneStep from "./steps/DoneStep.jsx";

import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";

function getTeacherFromCtx(ctx) {
    return ctx?.teacher || ctx?.account?.teacher || ctx?.me || null;
}

function pickEmail(t) {
    return t?.email ?? t?.profile?.email ?? "";
}
function pickFirstName(t) {
    return t?.first_name ?? t?.firstName ?? t?.profile?.first_name ?? "";
}
function pickLastName(t) {
    return t?.last_name ?? t?.lastName ?? t?.profile?.last_name ?? "";
}

export default function SignInPage() {
    const ctx = useTeacherDashboard?.();
    const teacher = getTeacherFromCtx(ctx);

    const teacherEmail = String(pickEmail(teacher) || "").trim();
    const teacherFirst = String(pickFirstName(teacher) || "").trim();
    const teacherLast = String(pickLastName(teacher) || "").trim();

    // Page only wires actions (can call services here; steps decide when/how)
    const sendEmailCode = async (email) => {
        // TODO: call your API
        // return false to block navigation
        return true;
    };

    const verifyEmailCode = async (code) => {
        // TODO: call your API
        return true;
    };

    const saveName = async ({ firstName, lastName }) => {
        // TODO: call your API
        return true;
    };

    const finish = () => {
        // TODO: navigate or finalize auth
    };

    const steps = [
        {
            key: "email",
            title: "Sign in please",
            when: () => !teacherEmail,
            render: ({ goNext }) => (
                <EmailStep
                    initialEmail={teacherEmail}
                    onConfirmed={sendEmailCode}
                    onNext={goNext}
                />
            ),
        },
        {
            key: "code",
            title: "Enter the code",
            when: () => !teacherEmail, // shown only if email step was required
            render: ({ goNext, goPrev }) => (
                <CodeStep
                    onVerified={verifyEmailCode}
                    onNext={goNext}
                    onBack={goPrev}
                />
            ),
        },
        {
            key: "name",
            title: "Your name",
            when: () => !teacherFirst,
            render: ({ goNext }) => (
                <NameStep
                    initialFirstName={teacherFirst}
                    initialLastName={teacherLast}
                    onConfirmed={saveName}
                    onNext={goNext}
                />
            ),
        },
        {
            key: "done",
            title: "Welcome",
            when: () => true,
            render: () => <DoneStep onDone={finish} />,
        },
    ];

    return <Flow steps={steps} onDone={finish} />;
}
