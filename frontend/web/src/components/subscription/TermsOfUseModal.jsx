import React, { useRef, useState } from "react";
import {
    callAccountInfoApi,
    callAccountVerifyApi,
    callDataSyncApi,
    callVerifyCodeApi
} from "../../services/api.js";
import { logoStyle } from "./LimitModal.jsx";
import { useNavigate } from "react-router-dom";
import { logError } from "../../services/logger.js";
import { ensureAnalytics, trackMetaEvent, trackPageView } from "../../services/gaService.js";
import CookieConsentModal from "../modals/CookieConsentModal.jsx";
import { acceptCookies, getCookieConsent, rejectCookies } from "../../services/settingsService.js";
import { ACTION_TYPES } from "../../utils/constants.js";

export default function TermsOfUseModal({
                                            ruleToDownload = null,
                                            theme,
                                            onClose = () => {},
                                            readOnly = false,
                                            email,
                                            verificationCode,
                                        }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const [btnHover, setBtnHover] = useState(false);
    const [secondaryHover, setSecondaryHover] = useState(false);

    const [cookieOpen, setCookieOpen] = useState(false);

    async function syncData() {
        try {
            await callDataSyncApi();
        } catch (e) {
            logError(e);
        }
    }

    async function handleAgree() {
        const code = String(verificationCode || "").trim();

        if (!email || !email.trim()) {
            setError("Немає імейлу для підтвердження.");
            return;
        }
        if (code.length < 6) {
            setError("Код має містити 6 цифр.");
            return;
        }

        setLoading(true);
        setError("");

        let stopLoading = true;

        try {
            const oldAccount = await callAccountInfoApi();
            const { token } = await callVerifyCodeApi({
                email: email.trim(),
                code,
                termsAccepted: true
            });

            localStorage.setItem("token", token);

            const newAccount = await callAccountInfoApi();

            if (oldAccount.email && oldAccount.status !== "free") {
                localStorage.clear();
                localStorage.setItem("token", token);
            }

            if (newAccount.status !== "free") {
                await syncData();
            }

            trackMetaEvent("CompleteRegistration");

            if (!getCookieConsent()) {
                setCookieOpen(true);
                await callAccountVerifyApi(ACTION_TYPES.MODAL_SHOWN_COOKIES);
                return;
            }

            setTimeout(() => {
                reloadWithRuleParam(ruleToDownload);
                onClose();
            }, 500);
        } catch (err) {
            stopLoading = false;
            setError("Не вдалося підтвердити код. Спробуйте ще раз.");
        } finally {
            if (!stopLoading) setLoading(false);
        }
    }

    function reloadWithRuleParam(ruleId) {
        try {
            const url = new URL(window.location.href);
            ruleId ? url.searchParams.set("ruleToDownload", ruleId) : url.searchParams.delete("ruleToDownload");
            window.history.replaceState({}, "", url.toString());
            window.location.reload();
        } catch {
            window.location.href = ruleId
                ? `${window.location.pathname}?ruleToDownload=${encodeURIComponent(ruleId)}`
                : window.location.pathname;
        }
    }

    const overlayStyle = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    };

    const cardStyle = {
        background: theme.bg,
        padding: 28,
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "92%",
        maxWidth: 560,
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    };

    const termsBoxStyle = {
        textAlign: "left",
        background: "#fffdf8",
        borderRadius: theme.radius,
        border: `3px solid ${theme.accent}`,
        padding: 14,
        maxHeight: 260,
        overflowY: "auto",
        lineHeight: 1.55,
        color: theme.text,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
    };

    const primaryBtn = {
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        background: loading ? "#999" : theme.accent,
        color: "#fff",
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: "Nunito, system-ui, sans-serif",
        width: "100%",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transform: (btnHover || (readOnly && secondaryHover)) && !loading ? "translateY(1px)" : "none",
        filter: (btnHover || (readOnly && secondaryHover)) && !loading ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    };

    const secondaryBtn = {
        appearance: "none",
        padding: "10px 14px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        background: "#fff",
        color: theme.text,
        border: "2px solid rgba(0,0,0,0.12)",
        boxShadow: "2px 2px 0 rgba(0,0,0,0.18)",
        fontFamily: "Nunito, system-ui, sans-serif",
        width: "100%",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.7 : 1,
        transform: secondaryHover && !loading ? "translateY(1px)" : "none",
        filter: secondaryHover && !loading ? "brightness(0.95)" : "none",
        transition: "transform 120ms ease, filter 120ms ease",
    };

    return (
        <>
            {!cookieOpen && !isPaying && (
                <div style={overlayStyle}>
                    <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{display: "flex", justifyContent: "space-between", marginBottom: 16}}>
                            <div>
                                <h2 style={{margin: 0, fontWeight: 800}}>Умови використання</h2>
                                <p style={{marginTop: 8}}>
                                    {readOnly
                                        ? "Будь ласка, ознайомся"
                                        : "Перш ніж зареєструватися, підтвердь, що погоджуєшся з умовами використання."}
                                </p>
                            </div>
                            <div style={logoStyle(56, theme)}>GL</div>
                        </div>

                        <div style={termsBoxStyle}>
                            <h3 style={{marginTop: 0}}>1. Загальні положення</h3>
                            <p>
                                <strong>GoodLang</strong>, <strong>«ми»</strong>, <strong>«сервіс»</strong> —
                                онлайн-платформа
                                для вивчення англійської мови через переклад з миттєвим AI-фідбеком,
                                що надається під брендом GoodLang та керується його власниками.
                            </p>

                            <p>
                                <strong>Користувач</strong>, <strong>«ви»</strong> — фізична особа, яка отримує доступ
                                до сервісу GoodLang, реєструється в ньому або використовує його функціонал
                                незалежно від наявності платної підписки.
                            </p>

                            <p>
                                <strong>Підписка</strong> — платний доступ до розширеного функціоналу сервісу GoodLang
                                на умовах, описаних у цих правилах.
                            </p>

                            <p>
                                Використовуючи сервіс GoodLang, ви підтверджуєте, що ознайомилися з цими
                                умовами користування та погоджуєтеся з ними. Якщо ви не погоджуєтеся з
                                умовами, будь ласка, припиніть використання сервісу.
                            </p>

                            <h3>2. Використання сервісу</h3>
                            <p>
                                Користувач зобов’язується використовувати сервіс добросовісно та
                                відповідно до його призначення. Забороняється зловживання сервісом,
                                спроби несанкціонованого доступу, автоматизація взаємодії з додатком,
                                надсилання спаму або навмисне створення перешкод у роботі сервісу.
                            </p>

                            <p>
                                Сервіс може використовуватися особами, що досягли віку 18 років, а також
                                дітьми віком від 3 років виключно за згодою батьків або законних опікунів.
                                Використовуючи сервіс, ви підтверджуєте, що або: 1) маєте 18 років і
                                користуєтесь сервісом особисто; 2) або являєтесь батьком/матір'ю чи законним опікуном
                                дитини,
                                що користується сервісом, або ж маєте дозвіл діяти від їх імені у відношенні до дитини.
                            </p>

                            <h3>3. Персональні дані</h3>
                            <p>
                                Ми зберігаємо лише персональні дані, необхідні для коректного
                                функціонування додатку. До таких даних належать імейл користувача, а
                                також результати відповідей на завдання, а саме: оцінки, час виконання
                                та коди граматичних правил. Ми не зберігаємо повні тексти відповідей
                                користувача.
                            </p>

                            <p>
                                Ми також залишаємо за собою право збирати додаткові аналітичні та
                                технічні метадані з метою покращення якості сервісу, оптимізації роботи
                                додатку та розвитку нових функцій.
                            </p>

                            <p>
                                Обробка персональних даних користувачів здійснюється відповідно до
                                чинного законодавства України, а також Загального регламенту про захист
                                даних (GDPR) Європейського Союзу у випадках, коли він застосовується.
                            </p>

                            <h3>4. Видалення персональних даних</h3>
                            <p>
                                За бажанням користувача ми можемо повністю видалити всі персональні дані
                                користувача, що зберігаються на наших серверах. Це включає імейл
                                користувача, історію використання сервісу, результати відповідей на
                                завдання (оцінки, час виконання та коди граматичних правил), аналітичні
                                та технічні метадані, а також будь-яку іншу інформацію, яка прямо або
                                опосередковано стосується цього користувача.
                            </p>

                            <p>
                                Для видалення персональних даних користувач повинен звернутися до нас
                                електронною поштою.
                            </p>

                            <h3>5. Платежі та сторонні сервіси</h3>
                            <p>
                                Для обробки платежів ми користуємося стороннім платіжним сервісом
                                Stripe. Ми передаємо Stripe лише імейл користувача та не несемо
                                відповідальності за те, як Stripe обробляє цю інформацію.
                            </p>

                            <p>
                                Інші дані, які Stripe може збирати на своїй сторінці оплати,
                                регулюються політикою Stripe та не належать до умов використання цього
                                додатку.
                            </p>

                            <p>
                                Оформлення підписки, зняття коштів та обробка платежів регулюються
                                платіжним сервісом Stripe. Ми не здійснюємо пряме управління платіжними
                                операціями та не несемо відповідальності за технічні аспекти роботи Stripe.
                            </p>

                            <p>
                                Підписка продовжується автоматично, якщо її не скасовано до завершення
                                поточного платіжного циклу.
                            </p>

                            <p>
                                Керування підпискою, включно зі скасуванням, доступне через відповідне
                                посилання на сторінку Stripe всередині додатку, а також шляхом звернення
                                до нас електронною поштою.
                            </p>

                            <p>
                                Користувач може скасувати підписку у будь-який момент за власним бажанням.
                                У разі скасування підписки кошти за вже оплачений період не повертаються,
                                однак оплачений функціонал залишається доступним до завершення поточного
                                циклу оплати.
                            </p>

                            <p>
                                Ми залишаємо за собою право у будь-який момент змінювати вартість підписки в
                                національній валюті України — гривні, яка є основною валютою сервісу. У разі
                                оплати в іншій валюті конвертація здійснюється платіжним сервісом Stripe, і ми
                                не несемо відповідальності за курс конвертації або додаткові комісії, які можуть
                                застосовуватися.
                            </p>

                            <p>
                                У разі зміни вартості окремо взятої підписки ми зобов’язуємося повідомити про це
                                електронною
                                поштою користувачів з цією активною підпискою до набуття таких змін чинності.
                            </p>

                            <p>
                                У разі зміни вартості підписки нова ціна застосовується лише з початку
                                наступного платіжного циклу, а ціна для користувача з активною підпискою
                                залишається незмінною до завершення поточного періоду платежу.
                            </p>

                            <p>
                                Ми використовуємо сторонні бібліотеки програмного коду для забезпечення функціонування
                                продукту. Для генерації PDF документів ми використовуємо Puppeteer (Apache 2.0 License)
                                Більше інформації на: https://github.com/puppeteer/puppeteer/blob/main/LICENSE.
                            </p>

                            <h3>6. Сповіщення</h3>
                            <p>
                                Ми залишаємо за собою право надсилати користувачам електронні листи,
                                необхідні для функціонування сервісу, включно з підтвердженням входу,
                                службовими повідомленнями та повідомленнями про зміни в умовах
                                користування.
                            </p>

                            <p>
                                Також ми можемо надсилати маркетингові та інформаційні листи з новинами
                                сервісу. Ви можете відмовитися від маркетингових то необов'язкових
                                інформаційних листів, перейшовши по відповідному посиланню у одному з таки листів
                                або написавши нам на goodlang.app@gmail.com
                            </p>

                            <h3>7. Політика cookies</h3>
                            <p>
                                Ми використовуємо виключно необхідні файли cookie для забезпечення безпечної автентифікації
                                та обробки платежів.
                                Ці файли cookie є необхідними для коректної роботи вебсайту і не можуть бути вимкнені.
                                Також ми використовуємо аналітичні cookies для покращення сервісу, від яких можна відмовитись, перш ніж вони будуть встановлені.
                            </p>

                            <h3>8. Доступність сервісу та повернення коштів</h3>
                            <p>
                                Ми не гарантуємо безперебійну або постійну доступність сервісу та не
                                несемо відповідальності за тимчасову недоступність додатку.
                            </p>

                            <p>
                                За запитом користувача ми можемо розглянути звернення щодо скасування
                                підписки або повернення коштів. Ми не гарантуємо повернення повної вартості
                                або частини суми. Сума повернення може бути меншою за
                                повний цикл оплати або у поверненні може бути відмовлено на розсуд адміністрації
                                додатку.
                            </p>

                            <p>
                                Ми не повертаємо кошти за вартість продукту типу "Марафон", або інших подібних, зі
                                спеціальними
                                умовами надання доступу, в тому числі, де зазначено автоматичне припинення послуги.
                            </p>

                            <h3>9. Обмеження відповідальності</h3>
                            <p>
                                Сервіс надається «як є». Ми не гарантуємо досягнення конкретних результатів
                                навчання та не несемо відповідальності за будь-які прямі або непрямі
                                наслідки використання сервісу.
                            </p>

                            <h3>10. Припинення надання послуг</h3>
                            <p>
                                Ми залишаємо за собою право припинити надання послуг у будь-який момент
                                без пояснення причин.
                            </p>

                            <p>
                                Використання сторонніх засобів для автоматизації взаємодії з додатком
                                або навмисні спроби створити перешкоди в його роботі є достатньою
                                підставою для зупинення доступу до сервісу для конкретного користувача.
                            </p>

                            <h3>11. Зміни умов користування</h3>
                            <p>
                                Ми залишаємо за собою право змінювати ці умови користування. У разі
                                суттєвих змін ми зобов’язуємося повідомити користувача електронною
                                поштою, використовуючи імейл, вказаний під час реєстрації.
                            </p>

                            <h3>12. Контактна інформація</h3>
                            <p style={{marginBottom: 0}}>
                                Уся офіційна комунікація з питань використання сервісу здійснюється
                                електронною поштою:
                                <strong> goodlang.app@gmail.com</strong>
                            </p>

                        </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 16}}>
                            {!readOnly && (
                                <button
                                    onMouseEnter={() => setBtnHover(true)}
                                    onMouseLeave={() => setBtnHover(false)}
                                    onClick={handleAgree}
                                    disabled={loading}
                                    style={primaryBtn}
                                >
                                    {loading ? "Підтверджую…" : "Погоджуюсь"}
                                </button>
                            )}

                            <button
                                onMouseEnter={() => setSecondaryHover(true)}
                                onMouseLeave={() => setSecondaryHover(false)}
                                onClick={onClose}
                                disabled={loading}
                                style={readOnly ? primaryBtn : secondaryBtn}
                            >
                                {readOnly ? "Добре" : "Не погоджуюсь"}
                            </button>

                            {error && <div style={{color: "red", fontWeight: 700}}>{error}</div>}
                        </div>
                    </div>
                </div>
            )}

            {cookieOpen && (
                <CookieConsentModal
                    theme={theme}
                    onAccept={async () => {
                        acceptCookies();
                        ensureAnalytics();
                        trackPageView(window.location.pathname);
                        trackMetaEvent("CompleteRegistration");
                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_ACCEPT_COOKIES);
                        reloadWithRuleParam(ruleToDownload);
                    }}
                    onReject={async () => {
                        rejectCookies();
                        await callAccountVerifyApi(ACTION_TYPES.BUTTON_CLICK_REJECT_COOKIES);
                        reloadWithRuleParam(ruleToDownload);
                    }}
                />
            )}
        </>
    );
}
