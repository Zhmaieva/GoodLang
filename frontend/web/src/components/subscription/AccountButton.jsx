import React, { useEffect, useState } from "react";
import LoginModal from "./LoginModal.jsx";
import { callAccountInfoApi } from "../../services/api.js";
import {syncWithServer} from "../../services/dataService.js";

export default function AccountButton({ theme }) {
    const [account, setAccount] = useState(null);
    const [hover, setHover] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);

    useEffect(() => {
        loadAccountInfo();
        const interval = setInterval(loadAccountInfo, 5000);
        return () => clearInterval(interval);
    }, []);

    async function loadAccountInfo() {
        try {
            const data = await callAccountInfoApi();
            setAccount(data);
        } catch (e) {
            console.error("Failed to load account info", e);
            setAccount(null); // user not logged in
        }
    }

    function handleClick() {
        syncWithServer().then();
        setLoginModalOpen(true);
    }

    const btnStyle = {
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: 14,
        lineHeight: 1,
        borderRadius: 999,
        cursor: "pointer",
        background: account?.email && account?.status === 'paid' ? theme.green : theme.accent,
        color: "#fff",
        border: `2px solid ${account?.email && account?.status === 'paid' ? theme.greenDark : theme.accent}`,
        boxShadow: `2px 2px 0 ${account?.email && account?.status === 'paid' ? theme.greenDark : theme.accentDark}`,
        transform: hover ? "translateY(1px)" : "none",
        transition: "transform 120ms ease",
    };

    return (
        <>
            <button
                style={btnStyle}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleClick}
            >
                {account?.email && account?.status === 'free' && `⚠️ ${account?.email}`}
                {!account?.email && account?.status === 'free' && "⚠️ Увімкнути синхронізацію"}
                {account?.status !== 'free' && account?.email}
            </button>

            <LoginModal theme={theme} account={account} open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
}
