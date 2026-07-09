import React, {useCallback, useEffect, useRef, useState} from "react";
import {callAccountInfoApi, callAccountVerifyApi} from "../../services/api.js";
import LimitModal from "../subscription/LimitModal.jsx";
import AccountStatusModal from "./AccountStatusModal.jsx";
import LoginModal from "./LoginModal.jsx";
import {logInfo} from "../../services/logger.js";
import {ACTION_TYPES} from "../../utils/constants.js";
import {
    getOverallAccuracy,
    getPaymentIntent,
    setPromoCode
} from "../../services/dataService.js";
import MarathonInfoModal from "../modals/MarathonInfoModal.jsx";
import {disableMarathonFailedModal, isMarathonFailedModalEnabled} from "../../services/marathonService.js";
import MarathonFailedModal from "../modals/MarathonFailedModal.jsx";
import {off, on} from "../../services/events.js";
import MarathonCompletedModal from "../modals/MarathonCompletedModal.jsx";
import DailyTasksCompletedModal from "../modals/DailyTasksCompletedModal.jsx";
import DailyTasksNeedMorePracticeModal from "../modals/DailyTasksNeedMorePractiseModal.jsx";
import { Button } from "../Buttons.jsx";

export default function AccountStatusButton({ theme }) {
    const [account, setAccount] = useState(null);
    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [failedModalOpen, setFailedModalOpen] = useState(isMarathonFailedModalEnabled());
    const [completedModalOpen, setCompletedModalOpen] = useState(false);
    const [completedDailyModalOpen, setCompletedDailyModalOpen] = useState(false);
    const [dailyNeedsPracticeModalOpen, setDailyNeedsPracticeModalOpen] = useState(false);

    const [subscribeIntent, setSubscribeIntent] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState(1);

    const effectRan = useRef(false); // <-- prevents double run

    const intervalRef = useRef(null);
    const mountedRef = useRef(false);

    const loadStatus = useCallback(async () => {
        try {
            const data = await callAccountInfoApi();
            if (!mountedRef.current) return null;
            setAccount(data);

            if (data.status === 'free' && getPaymentIntent()) {
                const intentType = localStorage.getItem("paymentIntentType");
                if (intentType === '1') {
                    setLimitModalOpen(true);
                }
            }

            return data;
        } catch (e) {
            console.error("Failed to load account status", e);
            return null;
        }
    }, []);

    const checkMarathonFailed = () => {
        setFailedModalOpen(isMarathonFailedModalEnabled())
    }

    const checkMarathonCompleted = () => {
        setCompletedModalOpen(true)
    }

    const checkMarathonDailyCompleted = () => {
        setCompletedDailyModalOpen(true)
    }

    const checkMarathonDailyNeedsPracticeModalOpen = () => {
        setDailyNeedsPracticeModalOpen(true)
    }

    useEffect(() => {
        on('marathonFailed', checkMarathonFailed);
        on('marathonCompleted', checkMarathonCompleted);
        on('marathonDailyCompleted', checkMarathonDailyCompleted);
        on('marathonDailyNeedsPractice', checkMarathonDailyNeedsPracticeModalOpen);

        return () => {
            off('marathonFailed', checkMarathonFailed);
            off('marathonCompleted', checkMarathonCompleted);
            off('marathonDailyCompleted', checkMarathonDailyCompleted);
            off('marathonDailyNeedsPractice', checkMarathonDailyNeedsPracticeModalOpen);
        }
    })

    useEffect(() => {
        mountedRef.current = true;

        // ensure no duplicates (StrictMode/dev remount or parent toggles)
        if (intervalRef.current) clearInterval(intervalRef.current);

        loadStatus().then((data) => {
            if (data) logInfo(data);
        });

        const overall = getOverallAccuracy();
        setAttemptsLeft(overall?.attemptsLeft ?? 0);


        intervalRef.current = setInterval(() => {
            loadStatus().catch(() => {});
        }, 5000);

        return () => {
            mountedRef.current = false;
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [loadStatus]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const shouldOpenSubscribe = params.get("subscribe") === "true";
        const promoCode = params.get("code");

        if (shouldOpenSubscribe && account) {

            setSubscribeIntent(true);

            // If promo_code exists and not yet loaded into account → refetch with promo
            if (promoCode) {
                setPromoCode(promoCode);
            }

            setTimeout(() => {
                if (account?.status !== "paid") {
                    setLimitModalOpen(true);
                }

                // Remove only `subscribe`, keep promo_code if you want it reusable
                params.delete("subscribe");
                params.delete("code");
                const next = params.toString();
                const newUrl = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash || ""}`;
                window.history.replaceState({}, "", newUrl);
            }, 200)
        }
    }, [account]);

    function handleClick() {
        if (!account?.status) return;

        callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_SUBSCRIPTION).then();

        if (account?.status === "free") {
            if (!account?.email) {
                setLoginModalOpen(true);
                return;
            }
            setLimitModalOpen(true);
        } else {
            setStatusModalOpen(true);
        }
    }

    const isPaid = account?.status === "paid";
    const buttonTheme = {
        ...theme,
        accent: isPaid ? theme.green : theme.accent,
        accentDark: isPaid ? theme.greenDark : theme.accentDark,
    };

    return (
        <>

            <Button
                variant="primary"
                theme={buttonTheme}
                style={{
                    fontFamily: 'var(--font-family-base)',
                    height: "100%",
                    minWidth: "180px",
                    visibility: account?.status ? "visible" : "hidden",
                }}
                onClick={handleClick}
            >
                {account?.status === "paid" && "My subscription"}
                {account?.status === "attention" && "Subscription (expiring)"}
                {account?.status === "free" && account?.email && "Get more practice"}
                {account?.status === "free" && !account?.email && "Subscribe / Sign in"}
            </Button>


            {
                account && <LimitModal
                    featurePdf={localStorage.getItem("teacher") === "true"}
                    subscribeIntent={subscribeIntent}
                    accountInfo={account}
                    isLimitReached={false}
                    theme={theme}
                    open={limitModalOpen}
                    onClose={() => setLimitModalOpen(false)}
                />

                // account && <MarathonInfoModal
                //     open={limitModalOpen}
                //     onClose={() => setLimitModalOpen(false)}
                //     theme={theme}
                //     account={account}               // from callAccountInfoApi()
                //     ruleIds={[]}         // exactly 7 items
                // />
            }

            {
                account && <AccountStatusModal
                    accountInfo={account}
                    theme={theme}
                    open={statusModalOpen}
                    onClose={() => setStatusModalOpen(false)}
                    status={account?.status}
                />
            }

            {
                account && loginModalOpen &&
                <LoginModal forceLogin={true} theme={theme} account={account} open={loginModalOpen}
                            onClose={() => setLoginModalOpen(false)}/>
            }

            {
                account && failedModalOpen && <MarathonFailedModal
                    open={failedModalOpen}
                    theme={theme}
                    account={account}
                    onClose={() => {
                        disableMarathonFailedModal();   // 🔒 one-time only
                        setFailedModalOpen(false);
                    }}
                />
            }

            {
                account && completedModalOpen && <MarathonCompletedModal
                    open={completedModalOpen}
                    theme={theme}
                    onClose={() => {
                        setCompletedModalOpen(false);
                    }}
                />
            }

            {
                account && completedDailyModalOpen && <DailyTasksCompletedModal
                    open={completedDailyModalOpen}
                    theme={theme}
                    onClose={() => {
                        setCompletedDailyModalOpen(false);
                    }}
                />
            }

            {
                account && dailyNeedsPracticeModalOpen && <DailyTasksNeedMorePracticeModal
                    open={dailyNeedsPracticeModalOpen}
                    theme={theme}
                    onClose={() => {
                        setDailyNeedsPracticeModalOpen(false);
                    }}
                />
            }
        </>
    );
}
