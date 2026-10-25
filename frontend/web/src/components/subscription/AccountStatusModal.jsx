import React, { useState } from "react";
import { callManageSubscriptionApi } from "../../services/api.js";
import LoginModal from "./LoginModal.jsx";
import { fmtDate } from "../pages/analyticsLogic.js";
import { marathonService } from "../../services/marathonService.js";
import { Button } from "../Buttons.jsx";
import { Check } from "@phosphor-icons/react";
import ModalShell from "../modals/ModalShell.jsx";
import MobileSheet from "../mobile/MobileSheet.jsx";
import { SubscriptionBenefits } from "../mobile/MobileSubscriptionSheet.jsx";
import useMobileLayout from "../mobile/useMobileLayout.js";
import { mobileCopy as t } from "../mobile/mobileCopy.js";

export default function AccountStatusModal({ accountInfo, theme, open, onClose, status }) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [manageLoading, setManageLoading] = useState(false);
    const [account] = useState(accountInfo);
    const isMobile = useMobileLayout();

    const onManage = async () => {
        if (manageLoading) return;

        setManageLoading(true);
        try {
            const { url } = await callManageSubscriptionApi();
            if (!url) throw new Error("Subscription management URL was not returned");
            window.location.assign(url);
            setManageLoading(false);
        } catch (e) {
            console.error("Failed to open subscription management", e);
            setManageLoading(false);
        }
    };

    const titleMap = {
        free: "Your profile",
        paid: "You're all set",
        attention: "Your subscription is expiring",
    };

    const subtitle = account?.isTrial
        ? `Trial ends on ${fmtDate(account?.trialEndsOn)}`
        : status === "free"
            ? "Free account"
        : marathonService.isInMarathon()
            ? "7-day marathon. Subscription ends when the marathon finishes or if you drop out."
            : "Monthly subscription";

    const primaryButtonStyle = {
        justifyContent: "center",
        background: theme.dark,
        color: "#fff",
        borderColor: theme.dark,
        boxShadow: "none",
    };

    const secondaryButtonStyle = {
        justifyContent: "center",
        background: theme.surface,
        color: theme.text,
        borderColor: theme.border,
        boxShadow: "none",
    };

    if (isMobile) {
        const canManage = !marathonService.isInMarathon() && (status === "paid" || status === "attention") && !account?.isTrial;
        const mobileSubtitle = account?.isTrial ? `${t("Пробний період до", "Trial ends on")} ${fmtDate(account.trialEndsOn)}`
            : status === "free" ? t("Безкоштовний акаунт", "Free account")
                : marathonService.isInMarathon() ? t("Марафон на 7 днів. Підписка діє до його завершення або виходу з марафону.", "7-day marathon. Your subscription ends when the marathon finishes or if you leave it.")
                    : t("Щомісячна підписка", "Monthly subscription");
        return <MobileSheet open={open} title={status === "attention" ? t("Підписка завершується", "Subscription expiring")
            : status === "free" ? t("Ваш план", "Your plan") : t("Підписка активна", "You're subscribed")}
            onClose={onClose} dismissible={!manageLoading} className="gl-subscription-sheet"
            footer={<button type="button" className="gl-primary" disabled={manageLoading} onClick={canManage ? onManage : onClose}>
                {manageLoading ? t("Відкриваємо…", "Opening…") : canManage ? t("Керувати підпискою", "Manage subscription") : t("Готово", "Done")}
            </button>}>
            <p className="gl-flow-description">{mobileSubtitle}</p>
            {status !== "free" && <SubscriptionBenefits items={[
                ["Необмежені завдання", "Unlimited tasks"], ["Синхронізація прогресу", "Cloud progress sync"],
                ["Доступ з усіх пристроїв", "Access from all devices"], ["Пріоритетна підтримка", "Priority support"],
            ]} />}
        </MobileSheet>;
    }

    return (
        <>
            <ModalShell
                open={open}
                id="acc-modal"
                theme={theme}
                title={titleMap[status]}
                subtitle={subtitle}
                onClose={onClose}
                hidden={loginModalOpen}
                maxWidth={480}
                panelStyle={{ borderColor: theme.border }}
            >
                {status !== "free" && (
                    <div style={{ textAlign: "left", margin: "0 0 28px 0" }}>
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                                lineHeight: 1.35,
                                color: theme.text,
                                fontSize: "16px",
                                fontWeight: 400,
                            }}
                        >
                            {[
                                "Unlimited tasks",
                                "Cloud progress sync",
                                "Access from all devices",
                                "Priority support",
                            ].map((item) => (
                                <li
                                    key={item}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                    }}
                                >
                                    <span
                                        aria-hidden
                                        style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            backgroundColor: theme.accentSoft,
                                            color: theme.accent,
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flex: "0 0 auto",
                                        }}
                                    >
                                        <Check size={18} weight="bold" />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div
                    style={{
                        display: "flex",
                        marginTop: "12px",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    {!marathonService.isInMarathon() && (status === "paid" || status === "attention") && !account?.isTrial && (
                        <Button
                            variant="offset"
                            compact
                            fullWidth
                            shadowColor={theme.accent}
                            shadowOffset={0}
                            style={primaryButtonStyle}
                            disabled={manageLoading}
                            onClick={onManage}
                        >
                            {manageLoading ? "Opening..." : "Manage subscription"}
                        </Button>
                    )}
                </div>
            </ModalShell>

            {loginModalOpen && (
                <div onClick={(e) => e.stopPropagation()}>
                    <LoginModal
                        forceLogin={true}
                        theme={theme}
                        account={account}
                        open={loginModalOpen}
                        onClose={() => {
                            setLoginModalOpen(false);
                            onClose?.();
                        }}
                    />
                </div>
            )}
        </>
    );
}
