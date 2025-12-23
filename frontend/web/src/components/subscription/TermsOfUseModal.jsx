import React, {useRef, useState} from "react";
import {callAccountInfoApi, callCheckoutApi, callDataSyncApi, callVerifyCodeApi} from "../../services/api.js";
import {logoStyle, stripePromise} from "./LimitModal.jsx";
import {useNavigate} from "react-router-dom";
import {getPaymentIntent, setPaymentIntent} from "../../services/dataService.js";
import {logError} from "../../services/logger.js";

export default function TermsOfUseModal({
                                            theme,
                                            onClose = () => {},
                                            readOnly = false,
                                            email,                 // required for verify
                                            verificationCode,      // 6-digit code passed from parent
                                        }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const navigate = useNavigate();

    const checkoutRef = useRef(null);

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

        try {
            // Same flow as LoginForm.handleVerify
            const oldAccount = await callAccountInfoApi();
            const { token } = await callVerifyCodeApi({ email: email.trim(), code, termsAccepted: true });

            localStorage.setItem("token", token);

            const newAccount = await callAccountInfoApi();

            // purge old data if it was synced account
            if (oldAccount.email && oldAccount.status !== "free") {
                localStorage.clear();
                localStorage.setItem("token", token);
            }

            // old data will be synced to new account if possible
            if (newAccount.status !== "free") {
                await syncData();
            }

            if (newAccount.status === "free" && getPaymentIntent()) {
                setPaymentIntent(false);
                try {
                    setLoading(true);

                    const stripe = await stripePromise;

                    const { clientSecret, isSuccess } = await callCheckoutApi();
                    if (!isSuccess) {
                        navigate("/payment/cancel");
                        setLoading(false);
                        return;
                    }

                    setIsPaying(true);

                    setTimeout(async () => {
                        if (!checkoutRef.current) {
                            checkoutRef.current = await stripe.initEmbeddedCheckout({ clientSecret });
                            checkoutRef.current.mount("#embedded-checkout-container-tou");
                        }

                        document.getElementById("embedded-checkout-container-tou").style.display = "block";
                        setLoading(false);
                    }, 200)
                } catch (err) {
                    console.error("Stripe error:", err);
                    setLoading(false);
                }
                return;
            }

            window.location.reload();
            onClose();
        } catch (err) {
            setError("Не вдалося підтвердити код. Спробуйте ще раз.");
        } finally {
            setLoading(false);
        }
    }

    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        inset: 0,
        height: "100dvh",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    };

    const cardStyle = {
        background: theme.bg,
        padding: "28px",
        borderRadius: theme.radius * 1.2,
        border: `4px solid ${theme.accent}`,
        width: "92%",
        maxWidth: 560,
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    };

    const termsBoxStyle = {
        textAlign: "left",
        background: "#fffdf8",
        borderRadius: theme.radius,
        border: `3px solid ${theme.accent}`,
        padding: "14px 14px",
        maxHeight: 260,
        overflowY: "auto",
        lineHeight: 1.55,
        color: theme.text,
        fontSize: "1rem",
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
    };

    const primaryBtn = {
        background: loading ? "#999" : theme.accent,
        color: "white",
        padding: "10px 20px",
        borderRadius: theme.radius,
        border: "none",
        cursor: loading ? "default" : "pointer",
        fontSize: "1rem",
        fontWeight: 800,
        width: "100%",
        opacity: loading ? 0.7 : 1,
    };

    const secondaryBtn = {
        appearance: "none",
        padding: "10px 16px",
        fontWeight: 800,
        fontSize: "1rem",
        lineHeight: 1,
        borderRadius: 999,
        cursor: loading ? "default" : "pointer",
        background: "#fffdf8",
        color: theme.text,
        border: `2px solid ${theme.accent}`,
        boxShadow: `2px 2px 0 ${theme.accentDark}`,
        width: "100%",
        opacity: loading ? 0.7 : 1,
    };

    return (
        <>
            {
                !isPaying && <div style={overlayStyle}>
                    <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            marginLeft: 0,
                            marginBottom: 16,
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <h2 style={{
                                    textAlign: "left",
                                    marginBottom: 0,
                                    marginTop: 0,
                                    color: theme.text,
                                    fontSize: "1.5rem",
                                    fontWeight: 800
                                }}>
                                    Умови використання і політика приватності
                                </h2>
                                <p style={{
                                    marginBottom: 16,
                                    marginTop: 8,
                                    marginLeft: 0,
                                    color: theme.text,
                                    fontSize: "1rem",
                                    fontWeight: 500,
                                    textAlign: "left"
                                }}>
                                    { readOnly ? 'Будь ласка, ознайомся' : 'Перш ніж зареєструватися, підтвердь, що погоджуєшся з умовами.'}
                                </p>
                            </div>

                            <div style={{display: "flex", alignItems: "flex-start", gap: 12}}>
                                <div style={logoStyle(64)}>GL</div>
                            </div>
                        </div>

                        <div style={termsBoxStyle}>
                            <h3 style={{marginTop: 0}}>1. Загальні положення</h3>
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
                                Сервіс може використовуватися дітьми віком від 3 років виключно за згодою
                                батьків або законних опікунів. Використовуючи сервіс, ви підтверджуєте,
                                що є батьком або законним опікуном дитини, або маєте дозвіл діяти від їх
                                імені.
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
                                У разі зміни вартості підписки ми зобов’язуємося повідомити про це електронною
                                поштою користувачів з активною підпискою до набуття таких змін чинності.
                            </p>

                            <p>
                                У разі зміни вартості підписки нова ціна застосовується лише з початку
                                наступного платіжного циклу, а ціна для користувача з активною підпискою
                                залишається незмінною до завершення поточного періоду платежу.
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
                                сервісу.
                            </p>

                            <h3>7. Доступність сервісу та повернення коштів</h3>
                            <p>
                                Ми не гарантуємо безперебійну або постійну доступність сервісу та не
                                несемо відповідальності за тимчасову недоступність додатку.
                            </p>

                            <p>
                                За запитом користувача ми можемо розглянути звернення щодо скасування
                                підписки або повернення коштів. Сума повернення може бути меншою за
                                повний цикл оплати.
                            </p>

                            <h3> 8. Обмеження відповідальності</h3>
                            <p>
                                Сервіс надається «як є». Ми не гарантуємо досягнення конкретних результатів
                                навчання та не несемо відповідальності за будь-які прямі або непрямі
                                наслідки використання сервісу.
                            </p>

                            <h3>9. Припинення надання послуг</h3>
                            <p>
                                Ми залишаємо за собою право припинити надання послуг у будь-який момент
                                без пояснення причин.
                            </p>

                            <p>
                                Використання сторонніх засобів для автоматизації взаємодії з додатком
                                або навмисні спроби створити перешкоди в його роботі є достатньою
                                підставою для зупинення доступу до сервісу для конкретного користувача.
                            </p>

                            <h3>10. Зміни умов користування</h3>
                            <p>
                                Ми залишаємо за собою право змінювати ці умови користування. У разі
                                суттєвих змін ми зобов’язуємося повідомити користувача електронною
                                поштою, використовуючи імейл, вказаний під час реєстрації.
                            </p>

                            <h3>11. Контактна інформація</h3>
                            <p style={{marginBottom: 0}}>
                                Уся офіційна комунікація з питань використання сервісу здійснюється
                                електронною поштою:
                                <strong> goodlang.app@gmail.com</strong>
                            </p>

                        </div>

                        <div style={{display: "flex", flexDirection: "column", gap: 12, marginTop: 16}}>
                            {!readOnly &&
                                <button onClick={handleAgree} disabled={loading} style={primaryBtn}>
                                    {loading ? "Підтверджую…" : "Погоджуюсь"}
                                </button>
                            }

                            <button onClick={onClose} disabled={loading} style={secondaryBtn}>
                                {readOnly ? 'Добре' : 'Не погоджуюсь'}
                            </button>

                            {error && <div style={{color: "red", fontWeight: 700}}>{error}</div>}
                        </div>
                    </div>
                </div>
            }
            {
                isPaying && <div style={{
                    position: "fixed",
                    top: 0, left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: "rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999
                }}>
                    <div
                        id="embedded-checkout-container-tou"
                        style={{
                            display: "none",
                            width: "92vw",
                            maxWidth: 720,
                            margin: "0 auto",
                            background: theme.bg,
                            borderRadius: theme.radius * 1.2,
                            border: `4px solid ${theme.accent}`,
                            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                            maxHeight: "75%",
                            overflow: "auto",
                        }}
                    />
                </div>
            }
        </>
    );
}
