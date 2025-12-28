import React, {useCallback, useEffect, useRef, useState} from "react";
import {callAccountInfoApi} from "../../services/api.js";
import LimitModal from "../subscription/LimitModal.jsx";
import AccountStatusModal from "./AccountStatusModal.jsx";
import LoginModal from "./LoginModal.jsx";
import {logInfo} from "../../services/logger.js";

export default function AccountStatusButton({ theme }) {
    const [account, setAccount] = useState(null);
    const [hovered, setHovered] = useState(null);
    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);

    const effectRan = useRef(false); // <-- prevents double run

    const intervalRef = useRef(null);
    const mountedRef = useRef(false);

    const loadStatus = useCallback(async () => {
        try {
            const data = await callAccountInfoApi();
            if (!mountedRef.current) return null;
            setAccount(data);
            return data;
        } catch (e) {
            console.error("Failed to load account status", e);
            return null;
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;

        // ensure no duplicates (StrictMode/dev remount or parent toggles)
        if (intervalRef.current) clearInterval(intervalRef.current);

        loadStatus().then((data) => {
            if (data) logInfo(data);
        });

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


        if (shouldOpenSubscribe && account) {
            if (account?.status !== 'paid')
                setLimitModalOpen(true);

            // Optional: remove param so it doesn't reopen on refresh
            params.delete("subscribe");
            const next = params.toString();
            const newUrl = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash || ""}`;
            window.history.replaceState({}, "", newUrl);
        }
    }, [account])

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
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: "1rem",
            lineHeight: 1,
            borderRadius: 999,
            cursor: "pointer",
            height: "100%",
            minWidth: "180px",
            textAlign: "center",
            visibility: account?.status? "visible" : "hidden",

            background,
            color,
            border: `2px solid ${border}`,
            boxShadow: `2px 2px 0 ${shadow}`,
            transform: hovered ? "translateY(1px)" : "none",
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
                {account?.status === "free" && account?.email && "Хочу підписку"}
                {account?.status === "free" && !account?.email && "Підписка / Увійти"}
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
