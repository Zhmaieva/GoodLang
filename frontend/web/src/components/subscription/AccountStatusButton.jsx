import React, { useEffect, useState } from "react";
import { callAccountStatusApi } from "../../services/api.js";
import LimitModal from "../subscription/LimitModal.jsx";
import AccountStatusModal from "./AccountStatusModal.jsx";

export default function AccountStatusButton({ theme, accountId }) {
    const [status, setStatus] = useState(null);
    const [hover, setHover] = useState(false);
    const [limitModalOpen, setLimitModalOpen] = useState(false);
    const [statusModalOpen, setStatusModalOpen] = useState(false);

    useEffect(() => {
        loadStatus();
    }, []);

    async function loadStatus() {
        try {
            const data = await callAccountStatusApi();
            setStatus(data.status);
        } catch (e) {
            console.error("Failed to load account status", e);
        }
    }

    function handleClick() {
        if (!status) return;

        if (status === "free") {
            setLimitModalOpen(true);
        } else {
            setStatusModalOpen(true);
        }
    }

    // --- LevelSwitch-style button ---
    const btnStyle = (() => {
        // map to same semantic colors
        const isPaid = status === "paid";
        const isAttention = status === "attention";
        const isFree = status === "free";

        let background = "#fffdf8";
        let border = theme.accent;
        let shadow = theme.accentDark;
        let color = theme.text;

        if (isFree) {
            background = theme.green;
            border = theme.greenDark;
            shadow = theme.greenDark;
            color = "#fff";
        } else if (isAttention) {
            background = "#e6b800";
            border = "#c99f00";
            shadow = "#907000";
            color = "#fff";
        } else if (isPaid) {
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

            transform: hover ? "translateY(1px)" : "none",
            transition: "transform 120ms ease",
            opacity: status ? 1 : 0.65,
        };
    })();

    return (
        <>
            {status && (
                <div
                    style={btnStyle}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={handleClick}
                >
                    {status === "paid" && "Преміум підписка"}
                    {status === "attention" && "Оплата потребує уваги"}
                    {status === "free" && "Покращити результати"}
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
                status={status}
            />
        </>
    );
}
