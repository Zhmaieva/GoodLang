import React, { useEffect, useState } from "react";
import LoginModal from "./LoginModal.jsx";
import {callAccountInfoApi, callAccountVerifyApi} from "../../services/api.js";
import {syncWithServer} from "../../services/dataService.js";
import {emit, off} from "../../services/events.js";
import {ACTION_TYPES} from "../../utils/constants.js";
import { Button } from "../Buttons.jsx";

export default function AccountButton({ theme, mobile }) {
    const [account, setAccount] = useState(null);
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

    const isPaid = account?.email && account?.status === "paid";
    const buttonTheme = {
        ...theme,
        accent: isPaid ? theme.green : theme.accent,
        accentDark: isPaid ? theme.greenDark : theme.accentDark,
    };

    return (
        isLoading
        ? <></>
        : <>
            {!mobile && account?.email && <Button
                variant="primary"
                theme={buttonTheme}
                style={{ fontSize: 14 }}
                onClick={handleClick}
            >
                {account?.email && account?.status === 'free' && `⚠️ ${account?.email}`}
                {account?.status !== 'free' && account?.email}
            </Button>}

            {mobile && <Button
                variant="primary"
                theme={buttonTheme}
                style={{
                    fontSize: 14,
                    width: "90px",
                    height: "100%",
                    lineHeight: .3,
                    padding: mobile ? "10px 14px" : "10px 16px",
                }}
                onClick={handleClick}
            >
                {account?.email && account?.status === 'free' && `Аккаунт`}
                {!account?.email && account?.status === 'free' && "Увійти"}
                {account?.status !== 'free' && "Аккаунт"}
            </Button>}

            <LoginModal mobile={mobile} theme={theme} account={account} open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
        </>
    );
}
