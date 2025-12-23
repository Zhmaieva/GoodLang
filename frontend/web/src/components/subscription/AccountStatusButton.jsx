import React, {useEffect, useRef, useState} from "react";
import {callAccountInfoApi} from "../../services/api.js";
import LimitModal from "../subscription/LimitModal.jsx";
import AccountStatusModal from "./AccountStatusModal.jsx";
import LoginModal from "./LoginModal.jsx";
import {getOverallAccuracy, getPaymentIntent, setPaymentIntent} from "../../services/dataService.js";
import {logInfo} from "../../services/logger.js";

export default function AccountStatusButton({ theme, mobile }) {
    const [account, setAccount] = useState(null);
    const [hover, setHover] = useState(false);
    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);

    const effectRan = useRef(false); // <-- prevents double run

    useEffect(() => {
        if (effectRan.current) return; // prevent second StrictMode call
        effectRan.current = true;

        loadStatus().then((data) => {
            const {attemptsLeft} = getOverallAccuracy();
            logInfo(data);
            if (data?.status === 'free' && (attemptsLeft <= 0 || (getPaymentIntent() === true))) {
                setLimitModalOpen(true);
            }
        });

        setInterval(() => {
            loadStatus().then();
        }, 5000);
    }, []);

    async function loadStatus() {
        try {
            const data = await callAccountInfoApi();
            setAccount(data);

            return data;
        } catch (e) {
            console.error("Failed to load account status", e);
        }
    }

    function handleClick() {
        if (!account?.status) return;

        if (account?.status === "free") {
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
            border = theme.greenDark;
            shadow = theme.greenDark;
            color = "#fff";
        } else if (isAttention) {
            background = "#fff";
            border = theme.accent;
            shadow = theme.accentDark;
            color = theme.accent;
        } else if (isFree) {
            background = theme.accent;
            color = "#fff";
            shadow = theme.accentDark;
        }

        return {
            appearance: "none",
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: "1rem",
            lineHeight: 1,
            borderRadius: 999,
            cursor: "pointer",
            height: "100%",
            minWidth: "160px",
            textAlign: "center",
            visibility: account?.status? "visible" : "hidden",

            background,
            color,
            border: `2px solid ${border}`,
            boxShadow: `4px 4px 0 ${shadow}`,

            justifyContent: "center",
        };
    })();

    return (
        <>
            <div
                style={btnStyle}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleClick}
            >
                {account?.status !== "free" && "Підписка"}
                {account?.status === "attention" && "Підписка (увага)"}
                {account?.status === "free" && "Хочу підписку"}
            </div>


            {
                account && <LimitModal
                    accountInfo={account}
                    isLimitReached={false}
                    theme={theme}
                    open={limitModalOpen}
                    onClose={() => setLimitModalOpen(false)}
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

            </>
    );
}
