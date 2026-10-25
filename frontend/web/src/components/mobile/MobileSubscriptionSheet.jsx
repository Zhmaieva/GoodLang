import { Check } from "@phosphor-icons/react";
import MobileSheet from "./MobileSheet.jsx";
import { mobileCopy as t } from "./mobileCopy.js";
import "./mobile-account-flows.css";

function money(value) {
    return value != null && value !== "" && Number.isFinite(Number(value)) ? `$${Number(value).toFixed(2)}` : null;
}

export function SubscriptionBenefits({ items }) {
    return <ul className="gl-subscription-benefits">{items.map(([uk, en]) => <li key={en}>
        <span aria-hidden="true"><Check size={15} weight="bold" /></span>{t(uk, en)}
    </li>)}</ul>;
}

export function MobileCheckoutSheet({ title, containerId, onClose, dismissible }) {
    return <MobileSheet title={title || t("Оплата", "Checkout")} onClose={onClose} dismissible={dismissible} className="gl-checkout-sheet">
        <div id={containerId} className="gl-mobile-checkout" style={{ display: "none" }} />
    </MobileSheet>;
}

export default function MobileSubscriptionSheet({ account, loading, priceLoading, accountError, checkoutError, onRetry, onSubscribe, onSignIn, onClose,
    isPaying, isLimitReached, timeLeft, hoursLeft, improvePct, hasEnoughEval }) {
    const promo = account?.promo;
    const price = priceLoading || accountError ? null : money(promo?.discountedPrice);
    const priceUnavailable = accountError || (account && !priceLoading && !money(promo?.discountedPrice));
    const originalPrice = money(promo?.originalPrice);
    const hasDiscount = price && originalPrice && promo?.discountPercentage > 0;

    return <MobileSheet title={isPaying ? t("Оплата", "Checkout") : t("Більше практики", "More practice")}
        className={isPaying ? "gl-checkout-sheet" : "gl-subscription-sheet"} onClose={onClose} dismissible={!loading}
        footer={!isPaying && <div className="gl-flow-actions">
            {checkoutError && <p className="gl-flow-error" role="alert">{t("Не вдалося відкрити оплату. Спробуйте пізніше.", "Couldn't open checkout. Please try again later.")}</p>}
            <button type="button" className="gl-primary" onClick={onSubscribe} disabled={loading || !price}>
                {loading ? t("Відкриваємо…", "Opening…") : t("Оформити підписку", "Subscribe")}
            </button>
            <button type="button" className="gl-text-button gl-flow-secondary" disabled={loading} onClick={onSignIn}>
                {account?.email ? t("Увійти в інший акаунт", "Use another account") : t("Уже маєте акаунт? Увійти", "Already have an account? Sign in")}
            </button>
        </div>}>
        <div hidden={isPaying}>
            {isLimitReached && timeLeft > 0 && <p className="gl-subscription-wait" role="status">
                {t("Наступне завдання через", "Your next task is available in")} {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </p>}
            <div className="gl-subscription-price">
                <p>{t("Щомісячна підписка", "Monthly subscription")}</p>
                {price ? <div><strong>{price}</strong><span>{t("/ місяць", "/ month")}</span>
                    {hasDiscount && <><del>{originalPrice}</del><small>−{promo.discountPercentage}%</small></>}
                </div> : <p className="gl-subscription-price-status" role="status">{priceUnavailable
                    ? t("Не вдалося завантажити ціну.", "Couldn't load the price.") : t("Завантажуємо ціну…", "Loading price…")}</p>}
                {priceUnavailable && <button type="button" className="gl-text-button" onClick={onRetry}>{t("Спробувати ще раз", "Try again")}</button>}
                {hasDiscount && hoursLeft != null && <p className="gl-subscription-offer">{t("Пропозиція діє ще", "Offer ends in")} {hoursLeft} {t("год.", hoursLeft === 1 ? "hour" : "hours")}</p>}
            </div>
            {hasEnoughEval && improvePct > 0 && <p className="gl-flow-description">{t("Прогноз покращення з підпискою:", "Estimated improvement with a subscription:")} {improvePct}%</p>}
            <SubscriptionBenefits items={[
                ["Необмежена практика", "Unlimited practice"],
                ["Збереження прогресу в хмарі", "Cloud progress saving"],
                ["Пріоритетна підтримка", "Priority support"],
                ["Скасування будь-коли", "Cancel anytime"],
            ]} />
        </div>
        <div id="embedded-checkout-container" className="gl-mobile-checkout" style={{ display: "none" }} />
    </MobileSheet>;
}
