import { SignOut, UserCircle } from "@phosphor-icons/react";
import MobileSettingsRow from "./MobileSettingsRow.jsx";
import { mobileCopy as t } from "./mobileCopy.js";
import "./mobile-profile.css";

export default function MobileProfile({ account, isSubscribed, onPlan, onEmail, onLegal, onLogout, onTitlePress }) {
    const email = account?.email;
    const name = account?.name || t("Ваш акаунт", "Your account");

    return <main className="gl-mobile-page gl-profile-page">
        <section className="gl-profile-identity" aria-label={t("Акаунт", "Account")}>
            <button type="button" className="gl-profile-identity-icon" aria-label={t("Інформація про профіль", "Profile information")} onClick={onTitlePress}>
                <UserCircle size={34} weight="light" aria-hidden="true" />
            </button>
            <div className="gl-profile-identity-copy">
                <strong>{email ? name : t("Гостьовий акаунт", "Guest account")}</strong>
                <p>{email || t("Увійдіть, щоб зберігати прогрес на всіх пристроях.", "Sign in to keep your progress across devices.")}</p>
            </div>
            {!email && <button type="button" className="gl-primary gl-profile-signin" onClick={onEmail}>
                {t("Увійти", "Sign in")}
            </button>}
        </section>

        <section className="gl-profile-list" aria-label={t("Налаштування акаунта", "Account settings")}>
            <MobileSettingsRow label={t("Підписка", "Subscription")}
                value={isSubscribed ? t("Місячна", "Monthly") : t("Безкоштовно", "Free")} onClick={onPlan} />
            {email && <MobileSettingsRow label="Email" detail={email} onClick={onEmail} />}
            <MobileSettingsRow label={t("Конфіденційність та умови", "Privacy & terms")} onClick={onLegal} />
            <MobileSettingsRow label={t("Підтримка", "Help & support")} href="mailto:goodlang.app@gmail.com" />
        </section>
        {email && <button type="button" className="gl-profile-logout" onClick={onLogout}><SignOut size={18} aria-hidden="true" />{t("Вийти з акаунта", "Sign out")}</button>}
    </main>;
}
