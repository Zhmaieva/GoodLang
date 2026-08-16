import React, { useEffect, useMemo, useState } from "react";
import {
    CaretRight,
    ChartBar,
    CreditCard,
    CrownSimple,
    EnvelopeSimple,
    GlobeHemisphereWest,
    ShieldCheck,
    SignOut,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../SiteHeader.jsx";
import { Button } from "../Buttons.jsx";
import ChooseLocaleModal from "../modals/ChooseLocaleModal.jsx";
import ModalShell from "../modals/ModalShell.jsx";
import LimitModal from "../subscription/LimitModal.jsx";
import AccountStatusModal from "../subscription/AccountStatusModal.jsx";
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
    const navigate = useNavigate();
    const [account, setAccount] = useState(() => readCachedAccountInfo());
    const [hoveredRow, setHoveredRow] = useState(null);
    const [limitVisible, setLimitVisible] = useState(false);
    const [accountStatusVisible, setAccountStatusVisible] = useState(false);
    const [billingVisible, setBillingVisible] = useState(false);
    const [billingLoading, setBillingLoading] = useState(false);
    const [billingError, setBillingError] = useState("");
    const [languageVisible, setLanguageVisible] = useState(false);
    const [levelVisible, setLevelVisible] = useState(false);
    const [legalVisible, setLegalVisible] = useState(false);
    const [legalView, setLegalView] = useState("menu");
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
    const billingStatus = account?.status === "active" || account?.isPaid
        ? "paid"
        : account?.status;

    const handlePlanOverview = () => {
        if (!billingStatus) return;

        if (billingStatus === "free") {
            setLimitVisible(true);
            return;
        }

        setAccountStatusVisible(true);
    };

    const handleBilling = () => {
        if (!billingStatus || billingLoading) return;

        if (billingStatus === "free") {
            setLimitVisible(true);
            return;
        }

        setBillingError("");
        setBillingVisible(true);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem("token");
            localStorage.removeItem("account_info");
            localStorage.removeItem("account_info_prev");
            localStorage.removeItem("purchase");
            localStorage.removeItem("paymentIntentType");
        } catch {
            // Logout should still navigate even if local storage is unavailable.
        }

        navigate("/");
    };

    const openBillingPortal = async () => {
        if (billingLoading) return;

        setBillingLoading(true);
        setBillingError("");
        try {
            const { url } = await callManageSubscriptionApi();
            if (url) {
                window.location.assign(url);
                return;
            }
            setBillingError("We couldn't open billing for this account. Please contact us at goodlang.app@gmail.com.");
        } catch (error) {
            console.error("Failed to open billing portal", error);
            setBillingError("We couldn't open billing for this account. Please contact us at goodlang.app@gmail.com.");
        } finally {
            setBillingLoading(false);
        }
    };

    const handleLevelSelect = (nextLevel) => {
        saveTrainingLevel(nextLevel);
        setSelectedLevel(nextLevel);
        setLevelVisible(false);
    };

    const openLegalMenu = () => {
        setLegalView("menu");
        setLegalVisible(true);
    };

    const closeLegalModal = () => {
        setLegalVisible(false);
        setLegalView("menu");
    };

    const closeBillingModal = () => {
        setBillingVisible(false);
        setBillingError("");
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

    const heroInfoStyle = {
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 20 : 32,
        minWidth: 0,
    };

    const logoutButtonStyle = {
        marginLeft: "auto",
        appearance: "none",
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: isMobile ? "10px 12px" : "12px 16px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        background: colors.surface,
        color: "#26345f",
        fontFamily: "var(--font-family-base)",
        fontSize: isMobile ? 13 : 14,
        fontWeight: 800,
        lineHeight: 1,
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 10px 28px rgba(31, 36, 54, 0.06)",
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
            ? "linear-gradient(90deg, rgba(116, 119, 184, 0.13), rgba(116, 119, 184, 0.07))"
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
        { value: "managed", label: "Adaptive", recommended: true },
        { value: "beginner", label: "Beginner" },
        { value: "intermediate", label: "Intermediate" },
        { value: "advanced", label: "Advanced" },
    ];

    const legalOptions = [
        {
            value: "privacy",
            label: "Privacy Policy",
            },
        {
            value: "terms",
            label: "Terms of Service",
            },
        {
            value: "contact",
            label: "Contact: goodlang.app@gmail.com",
            },
    ];

    const levelGridStyle = {
        display: "grid",
        gap: 12,
    };

    const legalGridStyle = {
        display: "grid",
        gap: 12,
    };

    const billingGridStyle = {
        display: "grid",
        gap: 12,
    };

    const levelButtonStyle = (selected) => ({
        justifyContent: "center",
        gap: 10,
        background: selected ? colors.dark : colors.surface,
        color: selected ? "#fff" : colors.text,
        borderColor: selected ? colors.dark : colors.border,
        boxShadow: "none",
    });

    const recommendedBadgeStyle = (selected) => ({
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px 8px",
        borderRadius: 999,
        background: selected ? "rgba(255, 255, 255, 0.18)" : colors.accentSoft,
        color: selected ? "#fff" : colors.accent,
        fontFamily: "var(--font-family-base)",
        fontSize: "0.68rem",
        lineHeight: 1,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
    });

    const legalButtonStyle = {
        justifyContent: "center",
        boxShadow: "none",
    };

    const billingPrimaryButtonStyle = {
        justifyContent: "center",
        background: colors.dark,
        color: "#fff",
        borderColor: colors.dark,
        boxShadow: "none",
    };

    const billingErrorStyle = {
        margin: 0,
        color: colors.muted,
        fontSize: "0.86rem",
        fontWeight: 400,
        lineHeight: 1.4,
        textAlign: "center",
    };

    const legalContentStyle = {
        padding: 0,
        color: "#465174",
        fontSize: "0.95rem",
        lineHeight: 1.55,
        fontWeight: 400,
        maxHeight: "46vh",
        overflowY: "auto",
    };

    const legalParagraphStyle = {
        margin: "0 0 12px",
    };

    const backButtonStyle = {
        marginTop: 14,
        boxShadow: "none",
    };

    const renderLegalDocument = () => {
        if (legalView === "privacy") {
            return (
                <>
                    <div style={legalContentStyle}>
                        <p style={legalParagraphStyle}>
                            GoodLang stores only the personal data needed to run the service:
                            your email address and practice results, such as scores, completion time,
                            and grammar rule codes.
                        </p>
                        <p style={legalParagraphStyle}>
                            We do not store the full text of your answers. We may collect analytical
                            and technical metadata to improve service quality and performance.
                        </p>
                        <p style={legalParagraphStyle}>
                            You can request deletion of your personal data by contacting us at
                            {" "}goodlang.app@gmail.com.
                        </p>
                        <p style={{ margin: 0 }}>
                            Payments are processed by Stripe. Stripe may process payment data under
                            its own privacy and payment policies.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        compact
                        fullWidth
                        theme={theme}
                        style={backButtonStyle}
                        onClick={() => setLegalView("menu")}
                    >
                        Back
                    </Button>
                </>
            );
        }

        if (legalView === "terms") {
            return (
                <>
                    <div style={legalContentStyle}>
                        <p style={legalParagraphStyle}>
                            By using GoodLang, you agree to use the service in good faith and only
                            for its intended learning purpose.
                        </p>
                        <p style={legalParagraphStyle}>
                            Paid subscriptions renew automatically unless canceled before the end of
                            the current billing cycle. Subscription management and payment processing
                            are handled through Stripe.
                        </p>
                        <p style={legalParagraphStyle}>
                            The service is provided as is. We do not guarantee specific learning
                            outcomes or uninterrupted availability.
                        </p>
                        <p style={{ margin: 0 }}>
                            We may update these terms and notify users about significant changes by
                            email.
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        compact
                        fullWidth
                        theme={theme}
                        style={backButtonStyle}
                        onClick={() => setLegalView("menu")}
                    >
                        Back
                    </Button>
                </>
            );
        }

        return (
            <div style={legalGridStyle}>
                {legalOptions.map((option) => (
                    <Button
                        key={option.value}
                        variant="offset"
                        compact
                        fullWidth
                        theme={theme}
                        shadowColor={theme.accent}
                        shadowOffset={0}
                        style={legalButtonStyle}
                        onClick={() => {
                            if (option.value === "contact") {
                                window.location.href = "mailto:goodlang.app@gmail.com";
                                return;
                            }

                            setLegalView(option.value);
                        }}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
        );
    };

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
                        <div style={heroInfoStyle}>
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
                                        overflowWrap: "anywhere",
                                    }}
                                >
                                    {email}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            style={logoutButtonStyle}
                            onClick={handleLogout}
                            aria-label="Log out"
                        >
                            <SignOut size={isMobile ? 18 : 20} weight="bold" aria-hidden />
                            {!isMobile && "Log out"}
                        </button>
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
                            onClick: handlePlanOverview,
                        })}
                        {renderRow({
                            key: "billing",
                            icon: <CreditCard style={iconStyle} weight="regular" />,
                            title: "Billing",
                            subtitle: billingLoading
                                ? "Opening billing..."
                                : "Manage plan, renewal, and payment method",
                            divider: false,
                            onClick: handleBilling,
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
                            onClick: openLegalMenu,
                        })}
                    </section>
                </section>
            </main>
            <ChooseLocaleModal
                open={languageVisible}
                theme={theme}
                onClose={() => setLanguageVisible(false)}
            />
            {account && (
                <LimitModal
                    accountInfo={account}
                    isLimitReached={false}
                    theme={theme}
                    open={limitVisible}
                    onClose={() => setLimitVisible(false)}
                />
            )}
            {account && (
                <AccountStatusModal
                    accountInfo={account}
                    theme={theme}
                    open={accountStatusVisible}
                    onClose={() => setAccountStatusVisible(false)}
                    status={billingStatus}
                />
            )}
            <ModalShell
                open={billingVisible}
                id="profile-billing-modal"
                theme={theme}
                title="Billing"
                subtitle="Manage your plan, renewal, and payment method."
                onClose={closeBillingModal}
                maxWidth={520}
                titleStyle={{ fontSize: "1.75rem" }}
                contentStyle={billingGridStyle}
            >
                <Button
                    variant="offset"
                    compact
                    fullWidth
                    theme={theme}
                    shadowColor={theme.accent}
                    shadowOffset={0}
                    style={billingPrimaryButtonStyle}
                    disabled={billingLoading}
                    onClick={openBillingPortal}
                >
                    {billingLoading ? "Opening..." : "Manage subscription"}
                </Button>
                {billingError && <p style={billingErrorStyle}>{billingError}</p>}
            </ModalShell>
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
                            <span>{option.label}</span>
                            {option.recommended && (
                                <span style={recommendedBadgeStyle(selected)}>
                                    Recommended
                                </span>
                            )}
                        </Button>
                    );
                })}
            </ModalShell>
            <ModalShell
                open={legalVisible}
                id="profile-legal-modal"
                theme={theme}
                title={legalView === "menu" ? "Legal" : legalView === "privacy" ? "Privacy Policy" : "Terms of Service"}
                subtitle={legalView === "menu" ? "Privacy Policy, Terms of Service, and contact information." : null}
                onClose={closeLegalModal}
                maxWidth={560}
                titleStyle={{ fontSize: "1.75rem" }}
                contentStyle={legalGridStyle}
            >
                {renderLegalDocument()}
            </ModalShell>
        </div>
    );
}
