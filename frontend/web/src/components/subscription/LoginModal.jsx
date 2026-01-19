import React, { useState } from "react";
import LimitModal from "../subscription/LimitModal.jsx";
import LoginForm from "./LoginForm.jsx";
import AccountStatusButton from "./AccountStatusButton.jsx";

export default function LoginModal({
                                       theme,
                                       open,
                                       onClose,
                                       account,
                                       forceLogin = false,
                                       ruleToDownload = null,
                                       fileTypeToDownload = 'translations'
                                   }) {
    if (!open) return null;

    return (
                <LoginForm
                    ruleToDownload={ruleToDownload}
                    theme={theme}
                    account={account}
                    fileTypeToDownload={fileTypeToDownload}
                    onClose={() => {
                        if (forceLogin) onClose();
                    }}
                />
    );
}
