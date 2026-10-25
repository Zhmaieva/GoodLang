import { useEffect, useId, useRef } from "react";
import MobileSheet from "./MobileSheet.jsx";
import { mobileCopy as t } from "./mobileCopy.js";
import "./mobile-account-flows.css";

const ERROR_MESSAGES = {
    "Email cannot be empty": ["Введіть email", "Enter your email"],
    "Enter a valid email": ["Перевірте адресу email", "Enter a valid email"],
    "You are already signed in with this email": ["Ви вже увійшли з цим email", "You are already signed in with this email"],
    "Failed to send the code": ["Не вдалося надіслати код. Спробуйте ще раз.", "Couldn't send the code. Please try again."],
    "Invalid code": ["Код не підійшов. Перевірте його в листі.", "That code didn't work. Check your email and try again."],
    "Could not open checkout. Please try again later.": ["Не вдалося відкрити оплату. Спробуйте пізніше.", "Couldn't open checkout. Please try again later."],
};

export default function MobileLoginSheet({ step, emailChangeStage, emailChange, email, onEmailChange, code, onCodeChange,
    onEmailSubmit, onVerify, onEditEmail, loading, error, onClose }) {
    const inputId = useId();
    const errorId = useId();
    const codeRef = useRef(null);
    const isCode = step === "code";
    const isCurrentEmail = emailChangeStage === "current";
    const title = isCode ? t("Код підтвердження", "Check your email")
        : emailChange ? t("Новий email", "New email") : t("Увійти в Goodlang", "Sign in to Goodlang");
    const errorMessage = Object.hasOwn(ERROR_MESSAGES, error) ? t(...ERROR_MESSAGES[error]) : error;

    useEffect(() => {
        if (!isCode) return;
        const frame = window.requestAnimationFrame(() => codeRef.current?.focus({ preventScroll: true }));
        return () => window.cancelAnimationFrame(frame);
    }, [isCode]);

    const submit = (event) => {
        event.preventDefault();
        if (loading) return;
        if (isCode) onVerify();
        else onEmailSubmit(event);
    };

    return <MobileSheet title={title} onClose={onClose} dismissible={!loading} className="gl-auth-sheet"
        footer={<button type="submit" form={inputId} className="gl-primary" disabled={loading || (isCode && code.length < 6)}>
            {loading ? isCode ? t("Перевіряємо…", "Checking…") : t("Надсилаємо…", "Sending…")
                : isCode ? isCurrentEmail ? t("Підтвердити email", "Verify email")
                    : emailChange ? t("Змінити email", "Change email") : t("Увійти", "Sign in")
                    : t("Отримати код", "Send code")}
        </button>}>
        {isCode ? <p className="gl-flow-description">{isCurrentEmail
            ? t("Код для поточного email", "Code for your current email")
            : t("Введіть 6 цифр із листа на", "Enter the 6-digit code sent to")}<br /><bdi className="gl-auth-email">{email}</bdi></p>
            : <p className="gl-flow-description">{t("Надішлемо код для входу. Пароль не потрібен.", "We'll email you a sign-in code. No password needed.")}</p>}
        <form id={inputId} onSubmit={submit} noValidate className="gl-auth-form" aria-busy={loading}>
            <label className="gl-flow-label" htmlFor={`${inputId}-field`}>{isCode ? t("Код із листа", "Email code") : "Email"}</label>
            {isCode ? <input id={`${inputId}-field`} className="gl-flow-input gl-auth-code" ref={codeRef}
                type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000"
                value={code} onChange={(event) => onCodeChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
                onPaste={(event) => {
                    event.preventDefault();
                    onCodeChange((event.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6));
                }}
                disabled={loading} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
                : <input id={`${inputId}-field`} className="gl-flow-input" type="email" inputMode="email" autoComplete="email"
                    autoCapitalize="none" autoCorrect="off" spellCheck={false} placeholder="name@example.com"
                    value={email} onChange={(event) => onEmailChange(event.target.value)} disabled={loading}
                    aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />}
            {error && <p className="gl-flow-error" id={errorId} role="alert">{errorMessage}</p>}
        </form>
        {isCode && !isCurrentEmail && <button type="button" className="gl-text-button gl-auth-edit" onClick={onEditEmail} disabled={loading}>
            {t("Змінити адресу email", "Use a different email")}
        </button>}
    </MobileSheet>;
}
