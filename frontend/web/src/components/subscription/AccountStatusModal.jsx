import React, { useState } from "react";
import { callManageSubscriptionApi } from "../../services/api.js";
import LoginModal from "./LoginModal.jsx";
import { fmtDate } from "../pages/analyticsLogic.js";
import { marathonService } from "../../services/marathonService.js";
import { Button } from "../Buttons.jsx";
import { Check } from "@phosphor-icons/react";
import ModalShell from "../modals/ModalShell.jsx";

export default function AccountStatusModal({ accountInfo, theme, open, onClose, status }) {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [manageLoading, setManageLoading] = useState(false);
    const [account] = useState(accountInfo);

    const onManage = async () => {
        if (manageLoading) return;

        setManageLoading(true);
        try {
            const { url } = await callManageSubscriptionApi();
            if (!url) throw new Error("Subscription management URL was not returned");
            window.location.assign(url);
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

                    <Button
                        variant="offset"
                        compact
                        fullWidth
                        shadowColor={theme.accent}
                        shadowOffset={0}
                        onClick={() => setLoginModalOpen(true)}
                        style={secondaryButtonStyle}
                    >
                        Sign in to another account
                    </Button>
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
