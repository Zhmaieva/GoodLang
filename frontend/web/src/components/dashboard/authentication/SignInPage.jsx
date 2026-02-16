import React, {useState} from "react";
import Flow from "../Flow.jsx";

import EmailStep from "./steps/EmailStep.jsx";
import CodeStep from "./steps/CodeStep.jsx";
import NameStep from "./steps/NameStep.jsx";

import { useTeacherDashboard } from "../TeacherDashboardContext.jsx";
import {callSendCodeApi, callVerifyCodeApi} from "../../../services/api.js";
import {logError} from "../../../services/logger.js";
import TermsStep from "./steps/TermsStep.jsx";
import {TERMS_OF_USE_CONTENT} from "../../../services/touService.js";

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

    const [teacherEmail, setTeacherEmail] = useState(String(pickEmail(teacher) || "").trim());
    const [sentEmail, setSentEmail] = useState("");
    const [sentCode, setSentCode] = useState("");
    const teacherFirst = String(pickFirstName(teacher) || "").trim();
    const teacherLast = String(pickLastName(teacher) || "").trim();

    // Page only wires actions (can call services here; steps decide when/how)
    const sendEmailCode = async (email) => {
        callSendCodeApi({email})
            .catch((err) => {
                logError(err);
            });

        setSentEmail(email);
        return true;
    };

    const verifyEmailCode = async (email, code, acceptTou = false) => {
        try {
            const { token } = await callVerifyCodeApi({email, code, termsAccepted: acceptTou});

            if (acceptTou) {
                localStorage.setItem("token", token);
            } else {
                setSentCode(code);
            }

            return true;
        } catch (e) {
            logError(e);
            return false;
        }
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
                    email={sentEmail}
                    onVerified={async (code) => {
                        return await verifyEmailCode(sentEmail, code);
                    }}
                    onNext={goNext}
                    onBack={goPrev}
                />
            ),
        },
        {
            key: "terms",
            title: "Please review",
            when: () => !teacherEmail, // shown only if email step was required
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
                    teacherEmail={teacherEmail}
                    initialFirstName={teacherFirst}
                    initialLastName={teacherLast}
                    onConfirmed={saveName}
                    onNext={() => {

                    }}
                    onBack={() => {
                        goTo('email')
                    }}
                />
            ),
        },
    ];

    return <Flow steps={steps} onDone={finish} />;
}
