// MarathonPurchaseModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import LoginModal from "../subscription/LoginModal.jsx";
import { getOverallAccuracy, getPaymentIntent, inferUserLevel, setPaymentIntent } from "../../services/dataService.js";
import MarathonPurchaseModal from "./MarathonPurchaseModal.jsx";
import { callAccountVerifyApi } from "../../services/api.js";
import { ACTION_TYPES } from "../../utils/constants.js";
import { Button } from "../Buttons.jsx";
import ModalShell from "./ModalShell.jsx";

export default function MarathonInfoModal({
                                              open,
                                              onClose,
                                              theme,
                                              account = null,
                                              ruleIds = [],
                                          }) {
    const [loginOpen, setLoginOpen] = useState(false);
    const [purchaseOpen, setPurchaseOpen] = useState(false);
    const [userLevel, setUserLevel] = useState("");

    const items = useMemo(
        () => [
            { title: "7 rules in 7 days", sub: "A new rule every day and unlimited practice." },
            { title: "Learn it or you're out", sub: "You have 24 hours to learn the rule." },
            { title: "Personalized plan", sub: "Focus on weak points. Spaced repetition method." },
        ],
        []
    );

    const levelMap = {
        A1: { label: "Beginner", percent: 33 },
        A2: { label: "Intermediate", percent: 66 },
        B1: { label: "Intermediate", percent: 66 },
        B2: { label: "Advanced", percent: 100 },
    };

    useEffect(() => {
        if (!open) return;

        setLoginOpen(false);

        const lvl = inferUserLevel();
        const overall = getOverallAccuracy();
        const acc = Number.isFinite(overall?.accuracy) ? overall.accuracy : 0;

        let inferred = lvl?.level || "A1";
        if (inferred === "A1" && acc > 40) {
            inferred = "A2";
        }

        if (inferred !== "B2" && acc > 85) {
            inferred = "B2";
        }

        setUserLevel(levelMap[inferred] || levelMap.A1);

        if (getPaymentIntent()) {
            setPaymentIntent(false);
            const intentType = localStorage.getItem("paymentIntentType");
            if (intentType === "1") {
                setPurchaseOpen(true);
            }
        }
    }, [open]);

    if (!open) return null;

    const hasEmail = !!account?.email;

    const onCloseHandler = () => {
        try {
            setPaymentIntent(false);
        } catch {}
        onClose?.();
    };

    const openLoginFlow = () => {
        try {
            localStorage.setItem("paymentIntentType", "1");
            setPaymentIntent(true);
        } catch {}
        setLoginOpen(true);
    };

    const handleStart = async () => {
        callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_MARATHON_START).then();

        if (!hasEmail) {
            openLoginFlow();
            return;
        }

        setPurchaseOpen(true);
    };

    if (account?.email && purchaseOpen) {
        return (
            <MarathonPurchaseModal
                open={true}
                onClose={() => setPurchaseOpen(false)}
                theme={theme}
                account={account}
            />
        );
    }

    if (loginOpen) {
        return (
            <LoginModal
                forceLogin={true}
                theme={theme}
                account={account}
                open={loginOpen}
                onClose={() => {
                    setLoginOpen(false);
                    try {
                        setPaymentIntent(false);
                    } catch {}
                }}
            />
        );
    }

    return (
        <ModalShell
            open={open}
            id="marathon-info-modal"
            theme={theme}
            title="It will be hard"
            subtitle="But you will learn the rules. No pain, no gain."
            onClose={onCloseHandler}
            maxWidth={480}
        >
            {account?.email && (
                <p
                    style={{
                        margin: "0 0 16px",
                        color: theme.text,
                        fontSize: "1rem",
                        fontWeight: 400,
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: 250,
                    }}
                >
                    {account.email}
                </p>
            )}

            <div style={{ marginBottom: 20 }}>
                {items.map((x) => (
                    <div
                        key={x.title}
                        style={{
                            display: "flex",
                            gap: 12,
                            alignItems: "flex-start",
                            padding: "10px 0",
                        }}
                    >
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                background: theme.accent,
                                flex: "0 0 12px",
                                marginTop: 4,
                            }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                                style={{
                                    margin: 0,
                                    color: theme.text,
                                    fontWeight: 800,
                                    fontSize: 15,
                                    lineHeight: 1.25,
                                    textAlign: "left",
                                }}
                            >
                                {x.title}
                            </p>
                            <p
                                style={{
                                    margin: "2px 0 0 0",
                                    color: theme.text,
                                    opacity: 0.8,
                                    fontWeight: 400,
                                    fontSize: 13.5,
                                    lineHeight: 1.35,
                                    textAlign: "left",
                                }}
                            >
                                {x.sub}
                            </p>
                        </div>
                    </div>
                ))}

                <div
                    style={{
                        marginTop: 6,
                        fontSize: 12.5,
                        fontWeight: 700,
                        opacity: 0.75,
                        color: theme.text,
                    }}
                >
                    Your current level: {userLevel?.label?.toLowerCase()}
                </div>
            </div>

            <Button
                variant="offset"
                compact
                fullWidth
                shadowColor={theme.accent}
                shadowOffset={0}
                onClick={handleStart}
                style={{
                    backgroundColor: theme.accent,
                    color: "#fff",
                    borderColor: "transparent",
                    boxShadow: "0 12px 28px rgba(123, 97, 216, 0.16)",
                }}
            >
                Start marathon
            </Button>

            {account?.email && (
                <Button
                    variant="offset"
                    compact
                    fullWidth
                    shadowColor={theme.accent}
                    shadowOffset={0}
                    onClick={() => setLoginOpen(true)}
                    wrapperStyle={{ marginTop: 8 }}
                    style={{
                        backgroundColor: theme.accent,
                        color: "#fff",
                        borderColor: "transparent",
                        boxShadow: "0 12px 28px rgba(123, 97, 216, 0.16)",
                    }}
                >
                    Log in to another account
                </Button>
            )}
        </ModalShell>
    );
}
