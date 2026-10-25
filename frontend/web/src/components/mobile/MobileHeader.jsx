import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, CaretLeft, Stack, NotePencil, UserCircle } from "@phosphor-icons/react";
import MobileSheet from "./MobileSheet.jsx";
import MobileSettingsRow from "./MobileSettingsRow.jsx";
import ChooseLocaleModal from "../modals/ChooseLocaleModal.jsx";
import LevelSwitch from "../training/LevelSwitch.jsx";
import { localizationService } from "../../localization/localizationService.js";
import { mobileCopy as t } from "./mobileCopy.js";

export default function MobileHeader({ theme, level, loading, onLevelChange, account, hideNavigation }) {
    const { pathname, search, hash, state } = useLocation();
    const isProfile = pathname.startsWith("/profile");
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [localeOpen, setLocaleOpen] = useState(false);
    const tabs = [
        { path: "/trainer", label: t("Практика", "Practice"), icon: NotePencil, active: !/^\/(analytics|rule|vocabulary|profile)/.test(pathname) },
        { path: "/analytics", label: t("Граматика", "Grammar"), icon: BookOpen, active: /^\/(analytics|rule)/.test(pathname) },
        { path: "/vocabulary", label: t("Словник", "Vocabulary"), icon: Stack, active: pathname.startsWith("/vocabulary") },
    ];
    const title = isProfile ? t("Акаунт", "Account") : tabs.find((tab) => tab.active)?.label || "Goodlang";
    const name = account?.name || account?.email || "";
    const initial = name ? [...name][0].toLocaleUpperCase() : <UserCircle size={28} weight="regular" />;
    const localeName = localizationService.BASE_LOCALES.find((locale) => locale.locale === localizationService.getLocale())?.name;
    const returnTo = typeof state?.returnTo === "string" && state.returnTo.startsWith("/")
        && !state.returnTo.startsWith("//") && !state.returnTo.startsWith("/profile")
        ? state.returnTo : "/trainer";
    return <>
        <header className={`gl-mobile-header${isProfile ? " gl-profile-header" : ""}`}>
            {isProfile && <button type="button" className="gl-profile-back" onClick={() => navigate(returnTo)}
                aria-label={t("Назад", "Back")}><CaretLeft size={24} /></button>}
            <h1>{title}</h1>
            {!isProfile && <button type="button" className="gl-avatar" onClick={() => setSettingsOpen(true)} aria-label={t("Профіль і налаштування", "Profile and settings")}>{initial}</button>}
        </header>
        <div className="gl-mobile-header-spacer" aria-hidden="true" />
        {!hideNavigation && <nav className="gl-mobile-nav" aria-label={t("Основна навігація", "Main navigation")}>
            {tabs.map((tab) => {
                const NavIcon = tab.icon;
                return <button type="button" key={tab.path} onClick={() => navigate(tab.path)} aria-current={tab.active ? "page" : undefined}>
                    <NavIcon size={24} weight={tab.active ? "bold" : "regular"} aria-hidden="true" /><span>{tab.label}</span>
                </button>;
            })}
        </nav>}
        <MobileSheet open={settingsOpen && !localeOpen} title="Goodlang" onClose={() => setSettingsOpen(false)}
            footer={<button className="gl-primary" onClick={() => setSettingsOpen(false)}>{t("Готово", "Done")}</button>}>
            <p className="gl-sheet-description">{t("Ваш простір для щоденної англійської.", "Your space for everyday English.")}</p>
            <MobileSettingsRow label={t("Мова перекладу", "Translation language")} value={localeName} onClick={() => setLocaleOpen(true)} />
            <MobileSettingsRow label={t("Вивчаєте", "Learning")} value="English" />
            <MobileSettingsRow label={t("Складність", "Difficulty")}><LevelSwitch compact theme={theme} level={level} loading={loading} onLevelChange={onLevelChange} /></MobileSettingsRow>
            <MobileSettingsRow label={t("Обліковий запис і підписка", "Account and subscription")} onClick={() => {
                setSettingsOpen(false); navigate("/profile", {state: {returnTo: `${pathname}${search}${hash}`}});
            }} />
        </MobileSheet>
        <ChooseLocaleModal open={localeOpen} theme={theme} onClose={() => setLocaleOpen(false)} />
    </>;
}
