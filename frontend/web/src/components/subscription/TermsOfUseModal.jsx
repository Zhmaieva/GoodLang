import React, { useRef, useState } from "react";
import {
    callAccountInfoApi,
    callAccountVerifyApi,
    callDataSyncApi,
    callVerifyCodeApi
} from "../../services/api.js";
import { logoStyle } from "./LimitModal.jsx";
import { useNavigate } from "react-router-dom";
import { logError } from "../../services/logger.js";
import { ensureAnalytics, trackMetaEvent, trackPageView } from "../../services/gaService.js";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import { acceptCookies, getCookieConsent, rejectCookies } from "../../services/settingsService.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import {localizationService} from "../../localization/localizationService.js";

export default function TermsOfUseModal({
                                            ruleToDownload = null,
                                            theme,
                                            onClose = () => {},
                                            readOnly = false,
                                            email,
                                            verificationCode,
                                        }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const [btnHover, setBtnHover] = useState(false);
    const [secondaryHover, setSecondaryHover] = useState(false);

    const [cookieOpen, setCookieOpen] = useState(false);

    async function syncData() {
        try {
            await callDataSyncApi();
        } catch (e) {
            logError(e);
        }
    }

    async function handleAgree() {
        const code = String(verificationCode || "").trim();

        if (!email || !email.trim()) {
            setError("Немає імейлу для підтвердження.");
            return;
        }
        if (code.length < 6) {
            setError("Код має містити 6 цифр.");
            return;
        }

        setLoading(true);
        setError("");

        let stopLoading = true;

        try {
            const oldAccount = await callAccountInfoApi();
            const { token } = await callVerifyCodeApi({
                email: email.trim(),
                code,
                termsAccepted: true
            });

            localStorage.setItem("token", token);

            const savedLocale = localizationService.getLocale();

            const newAccount = await callAccountInfoApi();

            if (oldAccount.email && oldAccount.status !== "free") {
                localStorage.clear();
                localStorage.setItem("token", token);

                if (savedLocale) {
                    localizationService.setLocale(savedLocale);
                }
            }

            if (newAccount.status !== "free") {
                await syncData();
            }

            trackMetaEvent("CompleteRegistration");

            if (!getCookieConsent()) {
                setCookieOpen(true);
                await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);
                return;
            }

            setTimeout(() => {
                reloadWithRuleParam(ruleToDownload);
                onClose();
            }, 500);
        } catch (err) {
            stopLoading = false;
            setError("Не вдалося підтвердити код. Спробуйте ще раз.");
        } finally {
            if (!stopLoading) setLoading(false);
        }
    }

    function reloadWithRuleParam(ruleId) {
        try {
            const url = new URL(window.location.href);
            ruleId ? url.searchParams.set("ruleToDownload", ruleId) : url.searchParams.delete("ruleToDownload");
            window.history.replaceState({}, "", url.toString());
            window.location.reload();
        } catch {
            window.location.href = ruleId
                ? `${window.location.pathname}?ruleToDownload=${encodeURIComponent(ruleId)}`
                : window.location.pathname;
        }
    }

    const overlayStyle = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    };

    const cardStyle = {
        background: theme.bg,
        padding: 28,
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "92%",
        maxWidth: 560,
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    };

    const termsBoxStyle = {
        textAlign: "left",
        background: "#fffdf8",
        borderRadius: theme.radius,
        border: `3px solid ${theme.accent}`,
        padding: 14,
        maxHeight: 260,
        overflowY: "auto",
        lineHeight: 1.55,
        color: theme.text,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
    };

    const primaryBtn = {
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        background: loading ? "#999" : theme.accent,
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: "Nunito, system-ui, sans-serif",
        width: "100%",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transform: (btnHover || (readOnly && secondaryHover)) && !loading ? "translateY(1px)" : "none",
        filter: (btnHover || (readOnly && secondaryHover)) && !loading ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    };

    const secondaryBtn = {
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        background: "#fff",
        color: theme.text,
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: "Nunito, system-ui, sans-serif",
        width: "100%",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transform: secondaryHover && !loading ? "translateY(1px)" : "none",
        filter: secondaryHover && !loading ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    };

    return (
        <>
            {!cookieOpen && !isPaying && (
                <div style={overlayStyle}>
                    <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{display: "flex", justifyContent: "space-between", marginBottom: 16}}>
                            <div>
                                <h2 style={{margin: 0, fontWeight: 800}}>Terms of use</h2>
                                <p style={{marginTop: 8}}>
                                    {readOnly
                                        ? "Please review"
                                        : "Before signing up, please confirm that you agree to the Terms of Use."}
                                </p>
                            </div>
                            <div style={logoStyle(56, theme)}>GL</div>
                        </div>

                        <div style={termsBoxStyle}>
                            <h3 style={{marginTop: 0}}>1. General Provisions</h3>
                            <p>
                                <strong>GoodLang</strong>, <strong>“we”</strong>, <strong>“the service”</strong> —
                                an online platform for learning English through translation with instant AI feedback,
                                provided under the GoodLang brand and operated by its owners.
                            </p>

                            <p>
                                <strong>User</strong>, <strong>“you”</strong> — an individual who accesses the GoodLang
                                service,
                                registers for it, or uses its functionality regardless of whether a paid subscription
                                is active.
                            </p>

                            <p>
                                <strong>Subscription</strong> — paid access to extended functionality of the GoodLang
                                service under the terms described in these rules.
                            </p>

                            <p>
                                By using the GoodLang service, you confirm that you have read these Terms of Use
                                and agree to them. If you do not agree with these terms, please stop using the service.
                            </p>

                            <h3>2. Use of the Service</h3>
                            <p>
                                The user agrees to use the service in good faith and in accordance with its intended
                                purpose. Abuse of the service, attempts to gain unauthorized access, automation of
                                interactions with the application, sending spam, or intentionally interfering with
                                the operation of the service are prohibited.
                            </p>

                            <p>
                                The service may be used by persons who have reached the age of 18, as well as by
                                children aged 3 and older exclusively with the consent of their parents or legal
                                guardians. By using the service, you confirm that either: 1) you are 18 years old
                                and use the service personally; or 2) you are the parent or legal guardian of a child
                                using the service, or have permission to act on their behalf in relation to the child.
                            </p>

                            <h3>3. Personal Data</h3>
                            <p>
                                We store only the personal data necessary for the proper functioning of the
                                application. Such data includes the user’s email address and the results of answers
                                to tasks, including: scores, completion time, and grammar rule codes. We do not
                                store the full text of user answers.
                            </p>

                            <p>
                                We also reserve the right to collect additional analytical and technical metadata
                                in order to improve service quality, optimize application performance, and develop
                                new features.
                            </p>

                            <p>
                                Processing of users’ personal data is carried out in accordance with the applicable
                                legislation of Ukraine, as well as the General Data Protection Regulation (GDPR)
                                of the European Union where applicable.
                            </p>

                            <h3>4. Deletion of Personal Data</h3>
                            <p>
                                Upon the user’s request, we may completely delete all personal data stored on our
                                servers related to that user. This includes the user’s email address, service usage
                                history, task answer results (scores, completion time, and grammar rule codes),
                                analytical and technical metadata, as well as any other information directly or
                                indirectly related to that user.
                            </p>

                            <p>
                                To delete personal data, the user must contact us via email.
                            </p>

                            <h3>5. Payments and Third-Party Services</h3>
                            <p>
                                To process payments, we use the third-party payment service Stripe. We transfer
                                only the user’s email address to Stripe and are not responsible for how Stripe
                                processes this information.
                            </p>

                            <p>
                                Other data that Stripe may collect on its payment page is governed by Stripe’s
                                own policies and does not fall under the Terms of Use of this application.
                            </p>

                            <p>
                                Subscription management, payment processing, and charges are governed by the
                                Stripe payment service. We do not directly control payment operations and are
                                not responsible for technical aspects of Stripe’s operation.
                            </p>

                            <p>
                                Subscriptions renew automatically unless canceled before the end of the
                                current billing cycle.
                            </p>

                            <p>
                                Subscription management, including cancellation, is available through the
                                appropriate link to the Stripe page within the application, as well as by
                                contacting us via email.
                            </p>

                            <p>
                                The user may cancel the subscription at any time at their own discretion.
                                If the subscription is canceled, payments for the already paid period are
                                non-refundable, but paid functionality remains available until the end of
                                the current billing cycle.
                            </p>

                            <p>
                                We reserve the right to change the subscription price at any time in the
                                national currency of Ukraine — the hryvnia, which is the primary currency
                                of the service. If payment is made in another currency, conversion is
                                performed by the Stripe payment service, and we are not responsible for
                                the conversion rate or any additional fees that may apply.
                            </p>

                            <p>
                                In the event of a price change for a specific subscription, we undertake to
                                notify users with an active subscription via email before such changes
                                take effect.
                            </p>

                            <p>
                                When the subscription price changes, the new price applies only from the
                                beginning of the next billing cycle, while the price for users with an
                                active subscription remains unchanged until the end of the current payment
                                period.
                            </p>

                            <p>
                                We use third-party code libraries to ensure the functioning of the product.
                                For generating PDF documents, we use Puppeteer (Apache 2.0 License).
                                More information: https://github.com/puppeteer/puppeteer/blob/main/LICENSE.
                            </p>

                            <h3>6. Notifications</h3>
                            <p>
                                We reserve the right to send users emails necessary for the operation of
                                the service, including login confirmations, service notifications, and
                                notifications about changes to the Terms of Use.
                            </p>

                            <p>
                                We may also send marketing and informational emails about service updates.
                                You can opt out of marketing and non-essential informational emails by
                                clicking the corresponding link in one of these emails or by contacting us
                                at goodlang.app@gmail.com.
                            </p>

                            <h3>7. Cookie Policy</h3>
                            <p>
                                We use only essential cookies required for secure authentication and payment
                                processing. These cookies are necessary for the proper functioning of the
                                website and cannot be disabled. We also use analytical cookies to improve
                                the service, which you can decline before they are set.
                            </p>

                            <h3>8. Service Availability and Refunds</h3>
                            <p>
                                We do not guarantee uninterrupted or continuous availability of the service
                                and are not responsible for temporary unavailability of the application.
                            </p>

                            <p>
                                Upon user request, we may review cases related to subscription cancellation
                                or refund requests. We do not guarantee a full or partial refund. The refund
                                amount may be less than the full billing cycle or may be denied at the
                                discretion of the application administration.
                            </p>

                            <p>
                                We do not provide refunds for products such as “Marathon” or other similar
                                products with special access conditions, including cases where automatic
                                termination of the service is specified.
                            </p>

                            <h3>9. Limitation of Liability</h3>
                            <p>
                                The service is provided “as is.” We do not guarantee specific learning
                                outcomes and are not responsible for any direct or indirect consequences
                                resulting from the use of the service.
                            </p>

                            <h3>10. Termination of Services</h3>
                            <p>
                                We reserve the right to terminate the provision of services at any time
                                without explanation.
                            </p>

                            <p>
                                The use of third-party tools to automate interaction with the application
                                or intentional attempts to interfere with its operation constitute
                                sufficient grounds to suspend access to the service for a specific user.
                            </p>

                            <h3>11. Changes to the Terms of Use</h3>
                            <p>
                                We reserve the right to modify these Terms of Use. In the event of
                                significant changes, we undertake to notify the user by email using
                                the email address provided during registration.
                            </p>

                            <h3>12. Contact Information</h3>
                            <p style={{marginBottom: 0}}>
                                All official communication regarding the use of the service is conducted
                                via email:
                                <strong> goodlang.app@gmail.com</strong>
                            </p>
                        </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 16}}>
                            {!readOnly && (
                                <button
                                    onMouseEnter={() => setBtnHover(true)}
                                    onMouseLeave={() => setBtnHover(false)}
                                    onClick={handleAgree}
                                    disabled={loading}
                                    style={primaryBtn}
                                >
                                    {loading ? "Confirming…" : "I agree"}
                                </button>
                            )}

                            <button
                                onMouseEnter={() => setSecondaryHover(true)}
                                onMouseLeave={() => setSecondaryHover(false)}
                                onClick={onClose}
                                disabled={loading}
                                style={readOnly ? primaryBtn : secondaryBtn}
                            >
                                {readOnly ? "OK" : "Decline"}
                            </button>

                            {error && <div style={{color: "red", fontWeight: 700}}>{error}</div>}
                        </div>
                    </div>
                </div>
            )}

            {cookieOpen && (
                <CookieConsentModal
                    theme={theme}
                    onAccept={async () => {
                        acceptCookies();
                        ensureAnalytics();
                        trackPageView(window.location.pathname);
                        trackMetaEvent("CompleteRegistration");
                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);
                        reloadWithRuleParam(ruleToDownload);
                    }}
                    onReject={async () => {
                        rejectCookies();
                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);
                        reloadWithRuleParam(ruleToDownload);
                    }}
                />
            )}
        </>
    );
}
