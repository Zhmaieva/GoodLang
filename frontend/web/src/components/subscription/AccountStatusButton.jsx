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
    inferUserLevel,
    setPaymentIntent,
    setPromoCode
} from "../../services/dataService.js";
import MarathonInfoModal from "../modals/MarathonInfoModal.jsx";
import {disableMarathonFailedModal, isMarathonFailedModalEnabled} from "../../services/marathonService.js";
import MarathonFailedModal from "../modals/MarathonFailedModal.jsx";
import {off, on} from "../../services/events.js";
import MarathonCompletedModal from "../modals/MarathonCompletedModal.jsx";

export default function AccountStatusButton({ theme }) {
    const [account, setAccount] = useState(null);
    const [hovered, setHovered] = useState(null);

    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [failedModalOpen, setFailedModalOpen] = useState(isMarathonFailedModalEnabled());
    const [completedModalOpen, setCompletedModalOpen] = useState(false);

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

    useEffect(() => {
        on('marathonFailed', checkMarathonFailed);
        on('marathonCompleted', checkMarathonCompleted);

        return () => {
            off('marathonFailed', checkMarathonFailed);
            off('marathonCompleted', checkMarathonCompleted);
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
            // setLoginModalOpen(true);
            setLimitModalOpen(true);
        } else {
            setStatusModalOpen(true);
        }
    }

    // --- LevelSwitch-style button ---
    const btnStyle = (() => {
        // map to same semantic colors
        const isPaid = account?.status === "paid";
        const isAttention = account?.status === "attention";
        const isFree = account?.status === "free";

        let background = "#fffdf8";
        let border = theme.accent;
        let shadow = theme.accentDark;
        let color = theme.text;

        if (isPaid) {
            background = theme.green;
            border = theme.green;
            shadow = theme.greenDark;
            color = "#fff";
        } else  {
            background = theme.accent;
            color = "#fff";
            shadow = theme.accentDark;
        }

        return {
            appearance: "none",
            padding: "10px 14px",
            fontWeight: 800,
            fontSize: "1rem",
            lineHeight: 1,
            borderRadius: 999,
            cursor: "pointer",

            border: "2px solid rgba(0,0,0,0.12)",
            boxShadow: `2px 2px 0 rgba(0,0,0,0.18)`,
            fontFamily: "Nunito, system-ui, sans-serif",
            whiteSpace: "nowrap",

            transform: hovered ? "translateY(1px)" : "none",
            filter: hovered ? "brightness(0.95)" : "none",
            transition: "transform 120ms ease, filter 120ms ease",

            background,
            color,
            height: "100%",
            minWidth: "180px",
            textAlign: "center",
            visibility: account?.status? "visible" : "hidden",

            justifyContent: "center",
        };
    })();

    return (
        <>

            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={btnStyle}
                onClick={handleClick}
            >
                {account?.status === "paid" && "Моя підписка"}
                {account?.status === "attention" && "Підписка (увага)"}
                {account?.status === "free" && account?.email && "Марафон"}
                {account?.status === "free" && !account?.email && "Увійти"}
            </div>


            {
                // account && <LimitModal
                //     featurePdf={localStorage.getItem("teacher") === "true"}
                //     subscribeIntent={subscribeIntent}
                //     accountInfo={account}
                //     isLimitReached={false}
                //     theme={theme}
                //     open={limitModalOpen}
                //     onClose={() => setLimitModalOpen(false)}
                // />

                account && <MarathonInfoModal
                    open={limitModalOpen}
                    onClose={() => setLimitModalOpen(false)}
                    theme={theme}
                    account={account}               // from callAccountInfoApi()
                    ruleIds={[]}         // exactly 7 items
                />
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
        </>
    );
}
