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

    const buttonStyle = {
        backgroundColor: theme.accent,
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
            >
                {account?.email && (
                    <p
                        style={{
                            marginTop: 0,
                            marginBottom: 18,
                            color: theme.text,
                            fontSize: "1rem",
                            fontWeight: 400,
                            textAlign: "left",
                        }}
                    >
                        {account.email}
                    </p>
                )}

                {status !== "free" && (
                    <div style={{ textAlign: "left", margin: "0 0 28px 0" }}>
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                lineHeight: "1.6",
                                color: theme.text,
                                fontSize: "16px",
                                fontWeight: 500,
                            }}
                        >
                            {[
                                "Unlimited tasks",
                                "Cloud progress sync",
                                "Access from all devices",
                                "Priority support",
                            ].map((item) => (
                                <li key={item}>
                                    <Check
                                        size={16}
                                        weight="bold"
                                        color={theme.accent}
                                        aria-hidden
                                        style={{ marginRight: 8, verticalAlign: "-2px" }}
                                    />
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
                            shadowOffset={5}
                            style={buttonStyle}
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
                        shadowOffset={5}
                        onClick={() => setLoginModalOpen(true)}
                        style={buttonStyle}
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
