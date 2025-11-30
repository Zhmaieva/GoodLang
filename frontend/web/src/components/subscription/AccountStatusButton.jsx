import React, {useEffect, useRef, useState} from "react";
import {callAccountInfoApi} from "../../services/api.js";
import LimitModal from "../subscription/LimitModal.jsx";
import AccountStatusModal from "./AccountStatusModal.jsx";
import LoginForm from "./LoginForm.jsx";
import LoginModal from "./LoginModal.jsx";

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
            console.log(data);
            if (data?.status === 'free' && data?.email)
                setLimitModalOpen(true);
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

        if (!account?.email) {
            setLoginModalOpen(true);
            return;
        }

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

        if (isPaid && !mobile) {
            background = theme.green;
            border = theme.greenDark;
            shadow = theme.greenDark;
            color = "#fff";
        } else if (isAttention && !mobile) {
            background = "#fff";
            border = theme.accent;
            shadow = theme.accentDark;
            color = theme.accent;
        } else if (isFree || mobile) {
            background = theme.accent;
            color = "#fff";
            shadow = theme.accentDark;
        }

        return {
            appearance: "none",
            padding: "10px 16px",
            fontWeight: 800,
            fontSize: 14,
            lineHeight: 1,
            borderRadius: 999,
            cursor: "pointer",

            background,
            color,
            border: `2px solid ${border}`,
            boxShadow: `2px 2px 0 ${shadow}`,

            // transform: hover ? "translateY(1px)" : "none",
            // transition: "transform 120ms ease",
            // opacity: account?.status ? 1 : 0.65,
            // display: isFree ? "none" : "flex",

            justifyContent: "center",
        };
    })();

    return (
            <>
                {!mobile && account?.status && (
                    <div
                        style={btnStyle}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={handleClick}
                    >
                        {account?.status === "paid" && "Преміум"}
                        {account?.status === "attention" && "Преміум закінчується"}
                        {account?.status === "free" && "Купити преміум"}
                    </div>
                )}

                {mobile && account?.status && (
                    <div
                        style={btnStyle}
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        onClick={handleClick}
                    >
                        {account?.status !== "free" && "Деталі підписки"}
                        {account?.status === "free" && "Купити преміум"}
                    </div>
                )}

                <LimitModal
                    isLimitReached={false}
                    theme={theme}
                    open={limitModalOpen}
                    onClose={() => setLimitModalOpen(false)}
                />

                <AccountStatusModal
                    theme={theme}
                    open={statusModalOpen}
                    onClose={() => setStatusModalOpen(false)}
                    status={account?.status}
                />

                {
                    loginModalOpen &&
                    <LoginModal forceLogin={true} theme={theme} account={account} open={loginModalOpen}
                                onClose={() => setLoginModalOpen(false)}/>
                }

            </>
    );
}
