import React, { useEffect, useState } from "react";
import LoginModal from "./LoginModal.jsx";
import {callAccountInfoApi, callAccountVerifyApi} from "../../services/api.js";
import {syncWithServer} from "../../services/dataService.js";
import {emit, off} from "../../services/events.js";
import {ACTION_TYPES} from "../../utils/constants.js";

export default function AccountButton({ theme, mobile }) {
    const [account, setAccount] = useState(null);
    const [hover, setHover] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAccountInfo().then(_ => {});

        emit.on("refreshAccount", loadAccountInfo);
        return () => {
            off("refreshAccount");
        }
    }, []);

    async function loadAccountInfo() {
        try {
            const data = await callAccountInfoApi();
            setAccount(data);
        } catch (e) {
            console.error("Failed to load account info", e);
            setAccount(null); // user not logged in
        }
        setIsLoading(false);
    }

    function handleClick() {
        syncWithServer().then();
        callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_SUBSCRIPTION).then();
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

    const btnStyleMobile = {
        appearance: "none",
        padding: mobile ? "10px 14px" : "10px 16px",
        fontWeight: 800,
        fontSize: 14,
        width: "90px",
        lineHeight: .3,
        borderRadius: 999,
        cursor: "pointer",
        background: account?.email && account?.status === 'paid' ? theme.green : theme.accent,
        color: "#fff",
        border: `2px solid ${account?.email && account?.status === 'paid' ? theme.greenDark : theme.accent}`,
        boxShadow: `2px 2px 0 ${account?.email && account?.status === 'paid' ? theme.greenDark : theme.accentDark}`,
        transform: hover ? "translateY(1px)" : "none",
        transition: "transform 120ms ease",
        height: '100%'
    };

    return (
        isLoading
        ? <></>
        : <>
            {!mobile && account?.email && <button
                style={btnStyle}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleClick}
            >
                {account?.email && account?.status === 'free' && `⚠️ ${account?.email}`}
                {account?.status !== 'free' && account?.email}
            </button>}

            {mobile && <button
                style={btnStyleMobile}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleClick}
            >
                {account?.email && account?.status === 'free' && `Аккаунт`}
                {!account?.email && account?.status === 'free' && "Увійти"}
                {account?.status !== 'free' && "Аккаунт"}
            </button>}

            <LoginModal mobile={mobile} theme={theme} account={account} open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
}
