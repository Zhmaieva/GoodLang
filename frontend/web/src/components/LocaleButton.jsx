import React, { useEffect, useState } from "react";
import ChooseLocaleModal from "./modals/ChooseLocaleModal.jsx";
import { localizationService } from "../localization/localizationService.js";
import {featureToggleService} from "../services/featureToggleService.js";
import { Button } from "./Buttons.jsx";

const LOCALE_TO_SOURCE_CODE = {
    "uk-UA": "UKR",
    "ru-RU": "RUS",
    "pl-PL": "POL",
    "de-DE": "DEU",
    "fr-FR": "FRA",
    "es-ES": "ESP",
    "it-IT": "ITA",
    "pt-PT": "POR",
    "nl-NL": "NLD",
    "sv-SE": "SWE",
    "no-NO": "NOR",
    "da-DK": "DAN",
    "fi-FI": "FIN",
    "cs-CZ": "CZE",
    "sk-SK": "SVK",
    "hu-HU": "HUN",
    "ro-RO": "RON",
    "bg-BG": "BUL",
    "el-GR": "ELL",
    "tr-TR": "TUR",
    "zh-CN": "ZHO",
    "ja-JP": "JPN",
    "ko-KR": "KOR",
    "th-TH": "THA",
    "vi-VN": "VIE",
    "id-ID": "IND",
    "ms-MY": "MSA",
    "he-IL": "HEB",
    "ar-SA": "ARA",
};

const getSourceCode = (locale) => {
    if (!locale) return "UKR";

    return LOCALE_TO_SOURCE_CODE[locale] || locale.slice(0, 2).toUpperCase();
};

export default function LocaleButton({
                                         theme,
                                         compact = true,
                                         isMobile = false,
                                         shadowColor,
                                         shadowOffset = 4,
                                         variant = "offset",
                                         fullWidth = false,
                                         style,
                                         wrapperStyle,
                                     }) {
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

    const languageDirection = `${getSourceCode(currentLocale)} → ENG`;

    return (
        <>
            <Button
                variant={variant}
                compact={compact}
                isMobile={isMobile}
                theme={theme}
                fullWidth={fullWidth}
                shadowColor={shadowColor ?? theme.accent}
                shadowOffset={shadowOffset}
                wrapperStyle={wrapperStyle}
                style={{
                    minWidth: variant === "header" ? undefined : "120px",
                    ...style,
                }}
                onClick={handleOpen}
            >
                {languageDirection}
            </Button>

            <ChooseLocaleModal
                open={modalOpen}
                onClose={handleClose}
                theme={theme}
            />
        </>
    );
}
