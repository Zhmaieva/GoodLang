import React, { useEffect, useState } from "react";
import ChooseLocaleModal from "./modals/ChooseLocaleModal.jsx";
import { localizationService } from "../localization/localizationService.js";
import {featureToggleService} from "../services/featureToggleService.js";

export default function LocaleButton({ theme }) {
    const [hovered, setHovered] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentLocale, setCurrentLocale] = useState(
        localizationService.isLocaleDefined() ? localizationService.getLocale() : null
    );

    useEffect(() => {
        if (!localizationService.isLocaleDefined()) {
            setModalOpen(true);
        }
    }, []);

    const handleOpen = () => {
        setModalOpen(true);
    };

    const handleClose = () => {
        const _locale = localizationService.isLocaleDefined()
            ? localizationService.getLocale()
            : null;

        setCurrentLocale(_locale);
        setModalOpen(false);
    };

    const btnStyle = {
        appearance: "none",
        padding: "8px 14px",
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
        background: theme.green,
        color: "#fff",
        minWidth: "120px",
        textAlign: "center",
        justifyContent: "center",
    };

    if (!featureToggleService.get(featureToggleService.FEATURE_NAME.LOCALIZATION))
        return null;

    return (
        <>
            <div
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={btnStyle}
                onClick={handleOpen}
            >
                Language
            </div>

            <ChooseLocaleModal
                open={modalOpen}
                onClose={handleClose}
                theme={theme}
            />
        </>
    );
}