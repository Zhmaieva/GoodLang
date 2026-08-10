import React, { useEffect, useMemo, useState } from "react";
import {
    CaretRight,
    ChartBar,
    CreditCard,
    CrownSimple,
    EnvelopeSimple,
    GlobeHemisphereWest,
    ShieldCheck,
} from "@phosphor-icons/react";
import SiteHeader from "../SiteHeader.jsx";
import { Button } from "../Buttons.jsx";
import ChooseLocaleModal from "../modals/ChooseLocaleModal.jsx";
import ModalShell from "../modals/ModalShell.jsx";
import { callAccountInfoApi, callManageSubscriptionApi } from "../../services/api.js";
import { localizationService } from "../../localization/localizationService.js";
import { getSavedTrainingLevel, saveTrainingLevel } from "../../services/trainingDirector.js";
import {
    APP_ACCENT_COLOR,
    APP_ACCENT_SOFT_COLOR,
    APP_BACKGROUND_COLOR,
    APP_BORDER_COLOR,
    APP_DARK_COLOR,
    APP_MUTED_TEXT_COLOR,
    APP_SURFACE_COLOR,
    APP_TEXT_COLOR,
} from "../../theme.js";

const LOCALE_TO_LANGUAGE = {
    "uk-UA": "Ukrainian",
    "ru-RU": "Russian",
    "pl-PL": "Polish",
    "de-DE": "German",
    "fr-FR": "French",
    "es-ES": "Spanish",
    "it-IT": "Italian",
    "pt-PT": "Portuguese",
    "nl-NL": "Dutch",
    "sv-SE": "Swedish",
    "no-NO": "Norwegian",
    "da-DK": "Danish",
    "fi-FI": "Finnish",
    "cs-CZ": "Czech",
    "sk-SK": "Slovak",
    "hu-HU": "Hungarian",
    "ro-RO": "Romanian",
    "bg-BG": "Bulgarian",
    "el-GR": "Greek",
    "tr-TR": "Turkish",
    "zh-CN": "Chinese",
    "ja-JP": "Japanese",
    "ko-KR": "Korean",
    "th-TH": "Thai",
    "vi-VN": "Vietnamese",
    "id-ID": "Bahasa Indonesia",
    "ms-MY": "Bahasa Melayu",
    "he-IL": "Hebrew",
    "ar-SA": "Arabic",
};

const LEVEL_LABELS = {
    managed: "Adaptive",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
};

function readCachedAccountInfo() {
    try {
        return JSON.parse(localStorage.getItem("account_info") || "null");
    } catch {
        return null;
    }
}

function getLanguagePairLabel() {
    const locale = localizationService.isLocaleDefined()
        ? localizationService.getLocale()
        : "uk-UA";

    return `${LOCALE_TO_LANGUAGE[locale] || "Ukrainian"} → English`;
}

function getPlanLabel(account) {
    if (account?.status === "active" || account?.status === "paid" || account?.isPaid) {
        return "Monthly subscription";
    }

    return "Free plan";
}

export default function ProfilePage({ theme }) {
    const [account, setAccount] = useState(() => readCachedAccountInfo());
    const [hoveredRow, setHoveredRow] = useState(null);
    const [billingLoading, setBillingLoading] = useState(false);
    const [languageVisible, setLanguageVisible] = useState(false);
    const [levelVisible, setLevelVisible] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(getSavedTrainingLevel() || "managed");
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" ? window.innerWidth < 760 : false
    );

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth < 760);
        onResize();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        callAccountInfoApi()
            .then(setAccount)
            .catch(() => setAccount(readCachedAccountInfo()));
    }, []);

    const colors = useMemo(
        () => ({
            bg: theme?.bg ?? APP_BACKGROUND_COLOR,
            surface: theme?.surface ?? APP_SURFACE_COLOR,
            border: theme?.border ?? APP_BORDER_COLOR,
            text: theme?.text ?? APP_TEXT_COLOR,
            muted: theme?.muted ?? APP_MUTED_TEXT_COLOR,
            accent: theme?.accent ?? APP_ACCENT_COLOR,
            accentSoft: theme?.accentSoft ?? APP_ACCENT_SOFT_COLOR,
            dark: theme?.dark ?? APP_DARK_COLOR,
        }),
        [theme]
    );

    const email = account?.email || "learner@example.com";
    const languagePair = getLanguagePairLabel();
    const levelLabel = LEVEL_LABELS[selectedLevel] || "Adaptive";
    const planLabel = getPlanLabel(account);

    const handleManageSubscription = async () => {
        if (billingLoading) return;

        setBillingLoading(true);
        try {
            const { url } = await callManageSubscriptionApi();
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error("Failed to open billing portal", error);
        } finally {
            setBillingLoading(false);
        }
    };

    const handleLevelSelect = (nextLevel) => {
        saveTrainingLevel(nextLevel);
        setSelectedLevel(nextLevel);
        setLevelVisible(false);
    };

    const pageStyle = {
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        fontFamily: "var(--font-family-base)",
    };

    const contentStyle = {
        width: "100%",
        maxWidth: 1040,
        margin: "0 auto",
        padding: isMobile ? "28px 16px 52px" : "54px 24px 80px",
        boxSizing: "border-box",
    };

    const cardStyle = {
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 24,
        boxShadow: "0 24px 70px rgba(31, 36, 54, 0.10)",
        overflow: "hidden",
    };

    const heroStyle = {
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 20 : 32,
        padding: isMobile ? "30px 24px" : "46px 56px",
    };

    const avatarStyle = {
        color: colors.accent,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: isMobile ? 34 : 42,
        lineHeight: 1,
        fontWeight: 900,
        flex: "0 0 auto",
    };

    const sectionStyle = {
        borderTop: `1px solid ${colors.border}`,
        padding: isMobile ? "24px 22px 12px" : "30px 38px 16px",
    };

    const sectionLabelStyle = {
        margin: "0 0 14px",
        color: "#465174",
        fontSize: 12,
        lineHeight: 1,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontWeight: 800,
    };

    const rowStyle = (key, highlighted = false) => ({
        width: "100%",
        appearance: "none",
        border: "none",
        background: highlighted
            ? "linear-gradient(90deg, rgba(123, 97, 216, 0.13), rgba(123, 97, 216, 0.07))"
            : hoveredRow === key
              ? "#fbfbff"
              : "transparent",
        borderRadius: highlighted ? 12 : 0,
        padding: highlighted
            ? isMobile
                ? "18px 16px"
                : "20px 18px"
            : isMobile
              ? "18px 0"
              : "20px 0",
        display: "grid",
        gridTemplateColumns: isMobile ? "32px minmax(0, 1fr) 18px" : "34px minmax(0, 1fr) auto 18px",
        gap: isMobile ? 14 : 18,
        alignItems: "center",
        textAlign: "left",
        cursor: "pointer",
        boxSizing: "border-box",
        color: colors.text,
        transition: "background-color 140ms ease",
    });

    const dividerStyle = {
        borderBottom: `1px solid ${colors.border}`,
    };

    const iconStyle = {
        color: colors.dark,
        width: 25,
        height: 25,
    };

    const titleStyle = {
        margin: 0,
        fontSize: isMobile ? 16 : 17,
        lineHeight: 1.2,
        fontWeight: 800,
        color: colors.text,
    };

    const subtitleStyle = {
        margin: "6px 0 0",
        fontSize: isMobile ? 13 : 14,
        lineHeight: 1.35,
        fontWeight: 500,
        color: "#465174",
    };

    const valueStyle = {
        fontSize: isMobile ? 14 : 15,
        lineHeight: 1.3,
        fontWeight: 600,
        color: "#26345f",
        whiteSpace: "nowrap",
        justifySelf: "end",
    };

    const levelOptions = [
        { value: "managed", label: "Adaptive" },
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
    ];

    const levelGridStyle = {
        display: "grid",
        gap: 12,
    };

    const levelButtonStyle = (selected) => ({
        justifyContent: "center",
        background: selected ? colors.dark : colors.surface,
        color: selected ? "#fff" : colors.text,
        borderColor: selected ? colors.dark : colors.border,
        boxShadow: "none",
    });

    const renderRow = ({
        key,
        icon,
        title,
        subtitle,
        value,
        highlighted = false,
        divider = true,
        onClick,
    }) => (
        <div style={highlighted || !divider ? null : dividerStyle}>
            <button
                type="button"
                style={rowStyle(key, highlighted)}
                onMouseEnter={() => setHoveredRow(key)}
                onMouseLeave={() => setHoveredRow(null)}
                onClick={onClick}
            >
                <span aria-hidden style={{ display: "inline-flex" }}>
                    {icon}
                </span>
                <span style={{ minWidth: 0 }}>
                    <p style={titleStyle}>{title}</p>
                    {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
                </span>
                {!isMobile && value && <span style={valueStyle}>{value}</span>}
                <CaretRight
                    size={18}
                    weight="bold"
                    color={highlighted ? colors.accent : "#26345f"}
                    style={{ gridColumn: isMobile ? 3 : 4, justifySelf: "end" }}
                    aria-hidden
                />
            </button>
        </div>
    );

    return (
        <div style={pageStyle}>
            <SiteHeader theme={theme} />
            <main style={contentStyle}>
                <section style={cardStyle} aria-label="User profile">
                    <div style={heroStyle}>
                        <div style={avatarStyle} aria-hidden>
                            GL
                        </div>
                        <div>
                            <h1
                                style={{
                                    margin: 0,
                                    color: colors.text,
                                    fontSize: isMobile ? 28 : 34,
                                    lineHeight: 1.06,
                                    fontWeight: 850,
                                }}
                            >
                                My profile
                            </h1>
                            <p
                                style={{
                                    margin: "8px 0 0",
                                    color: "#465174",
                                    fontSize: isMobile ? 15 : 16,
                                    fontWeight: 500,
                                }}
                            >
                                {email}
                            </p>
                        </div>
                    </div>

                    <section style={sectionStyle}>
                        <h2 style={sectionLabelStyle}>Preferences</h2>
                        {renderRow({
                            key: "language",
                            icon: <GlobeHemisphereWest style={iconStyle} weight="regular" />,
                            title: "Language",
                            subtitle: "Choose your practice language pair",
                            value: languagePair,
                            onClick: () => setLanguageVisible(true),
                        })}
                        {renderRow({
                            key: "level",
                            icon: <ChartBar style={iconStyle} weight="regular" />,
                            title: "Level",
                            subtitle: "Set your current proficiency level",
                            value: levelLabel,
                            divider: false,
                            onClick: () => setLevelVisible(true),
                        })}
                    </section>

                    <section style={sectionStyle}>
                        <h2 style={sectionLabelStyle}>Subscription</h2>
                        {renderRow({
                            key: "plan",
                            icon: <CrownSimple style={iconStyle} weight="regular" />,
                            title: "Current plan",
                            value: planLabel,
                            onClick: handleManageSubscription,
                        })}
                        {renderRow({
                            key: "billing",
                            icon: <CreditCard style={iconStyle} weight="regular" />,
                            title: "Billing",
                            subtitle: billingLoading
                                ? "Opening billing..."
                                : "Manage plan, renewal, and payment method",
                            divider: false,
                            onClick: handleManageSubscription,
                        })}
                    </section>

                    <section style={{ ...sectionStyle, paddingBottom: isMobile ? 24 : 34 }}>
                        <h2 style={sectionLabelStyle}>Account</h2>
                        {renderRow({
                            key: "email",
                            icon: <EnvelopeSimple style={iconStyle} weight="regular" />,
                            title: "Email",
                            subtitle: "Change the email you use for sign-in",
                            value: email,
                            onClick: () => {},
                        })}
                        {renderRow({
                            key: "legal",
                            icon: <ShieldCheck style={iconStyle} weight="regular" />,
                            title: "Legal",
                            subtitle: "Privacy Policy, Terms of Service, Contact",
                            divider: false,
                            onClick: () => {},
                        })}
                    </section>
                </section>
            </main>
            <ChooseLocaleModal
                open={languageVisible}
                theme={theme}
                onClose={() => setLanguageVisible(false)}
            />
            <ModalShell
                open={levelVisible}
                id="profile-level-modal"
                theme={theme}
                title="Choose difficulty"
                subtitle="Pick the level for the next training tasks."
                onClose={() => setLevelVisible(false)}
                maxWidth={520}
                titleStyle={{ fontSize: "1.75rem" }}
                contentStyle={levelGridStyle}
            >
                {levelOptions.map((option) => {
                    const selected = selectedLevel === option.value;

                    return (
                        <Button
                            key={option.value}
                            variant="secondary"
                            compact
                            fullWidth
                            theme={theme}
                            selected={selected}
                            shadowOffset={0}
                            aria-pressed={selected}
                            style={levelButtonStyle(selected)}
                            onClick={() => handleLevelSelect(option.value)}
                        >
                            {option.label}
                        </Button>
                    );
                })}
            </ModalShell>
        </div>
    );
}
