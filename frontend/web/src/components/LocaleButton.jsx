import React, { useEffect, useState } from "react";
import ChooseLocaleModal from "./modals/ChooseLocaleModal.jsx";
import { localizationService } from "../localization/localizationService.js";
import {featureToggleService} from "../services/featureToggleService.js";
import { Button } from "./Buttons.jsx";

export default function LocaleButton({ theme }) {
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

    if (!featureToggleService.get(featureToggleService.FEATURE_NAME.LOCALIZATION))
        return null;

    return (
        <>
            <Button
                variant="segmented"
                active
                theme={{ ...theme, accent: theme.green, accentDark: theme.greenDark }}
                style={{
                    fontFamily: 'var(--font-family-base)',
                    minWidth: "120px",
                }}
                onClick={handleOpen}
            >
                Language
            </Button>

            <ChooseLocaleModal
                open={modalOpen}
                onClose={handleClose}
                theme={theme}
            />
        </>
    );
}
