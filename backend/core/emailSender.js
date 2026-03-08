import nodemailer from "nodemailer";
import {MAIL_PASS} from "./constants.js";

// Create reusable transporter using SMTP (example: Gmail, custom SMTP)
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'goodlang.app@gmail.com', // Your custom domain email on iCloud
        pass: MAIL_PASS, // App-specific password
    },
    socketTimeout: 10000,
    timeout: 15000,
    tls: {
        rejectUnauthorized: true, // Helps with some SSL issues
    }
});

/**
 * Send a verification code email
 * @param {string} to - recipient email
 * @param {string} code - 6-digit code
 */
export function sendVerificationEmail(to, code) {
    const info = transporter.sendMail({
        from: `"GoodLang" <goodlang.app@gmail.com>`,
        to,
        subject: "Код логіну до GoodLang",
        text: `Твій код логіну до GoodLang: ${code}`,
        html: `
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td valign="top" style="font-family:Arial, sans-serif;">
            <h2 style="
              margin:0;
              font-size:24px;
              font-weight:800;
              color:#ff6138;
            ">
              ${code}
            </h2>

            <p style="
              margin:8px 0 16px 0;
              font-size:16px;
              font-weight:500;
            ">
              Твій код доступу до <strong>GoodLang</strong>
            </p>
          </td>

          <td width="64" valign="top" align="right">
            <table width="64" height="64" cellpadding="0" cellspacing="0" role="presentation"
              style="
                background:#ff6138;
                border-radius:12px;
                text-align:center;
              ">
              <tr>
                <td style="
                  color:#ffffff;
                  font-weight:800;
                  font-size:28px;
                  font-family:Arial, sans-serif;
                  line-height:64px;
                ">
                  GL
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<p style="font-family:Arial, sans-serif; opacity: 0.5">
  Якщо це був хтось інший, будь ласка, надішли нам листа на <a href="mailto:goodlang.app@gmail.com">goodlang@mail.com</a>
</p>
`,
    }).then(() => {
        console.log(`Verification email sent to ${to}: ${info.messageId}`);
    }).catch((err) => {
        console.error("sendVerificationEmail failed:", err?.message || err);
        // swallow error so it never becomes unhandled
        return null;
    });
}

function pluralizeHours(n) {
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 14) return "годин";
    if (mod10 === 1) return "годину";
    if (mod10 >= 2 && mod10 <= 4) return "години";
    return "годин";
}


/**
 * Send promo code email
 * @param {string} to - recipient email
 * @param {string} code - promo code
 * @param {Date} expiresAt - expiration datetime
 */
export function sendPromoEmail(to, code, expiresAt) {
    const SUBSCRIBE_URL = `${process.env.FRONTEND_URL}/trainer?subscribe=true&code=${code}`;

    const now = Date.now();
    const expiresMs = expiresAt instanceof Date ? expiresAt.getTime() : Date.parse(expiresAt);
    const hoursLeft = Math.max(1, Math.ceil((expiresMs - now) / (1000 * 60 * 60)));

    const hoursWord = pluralizeHours(hoursLeft);

    return transporter.sendMail({
        from: `"GoodLang" <${process.env.SMTP_FROM}>`,
        to,
        subject: "Твій промо-код для GoodLang",
        text: `Твій промо-код: ${code}
Діє ще ${hoursLeft} ${hoursWord}.
Активуй тут: ${SUBSCRIBE_URL}`,
        html: `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr>
    <td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td valign="top" style="font-family:Arial, sans-serif;">
            <h2 style="
              margin:0;
              font-size:24px;
              font-weight:800;
              color:#ff6138;
            ">
              ${code}
            </h2>

            <p style="
              margin:8px 0 8px 0;
              font-size:16px;
              font-weight:500;
            ">
              🎁 Це твій промо-код для щомісячної підписки <strong>GoodLang</strong> ⏳ Діє ще ${hoursLeft} ${hoursWord}
            </p>

            <p style="
              margin:0 0 12px 0;
              font-size:15px;
            ">
              Застосуй код за посиланням:
            </p>

            <a
              href="${SUBSCRIBE_URL}"
              style="
                color:#ff6138;
                font-weight:900;
                font-size:15px;
                text-decoration:none;
              "
            >
              ${SUBSCRIBE_URL}
            </a>
          </td>

          <td width="64" valign="top" align="right">
            <table width="64" height="64" cellpadding="0" cellspacing="0" role="presentation"
              style="
                background:#ff6138;
                border-radius:12px;
                text-align:center;
              ">
              <tr>
                <td style="
                  color:#ffffff;
                  font-weight:800;
                  font-size:28px;
                  font-family:Arial, sans-serif;
                  line-height:64px;
                ">
                  GL
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<p style="
  font-family:Arial, sans-serif;
  opacity:0.5;
  font-size:13px;
">
  Якщо ти не реєструвався(-лась) у GoodLang — просто проігноруй цей лист або напиши нам на
  <a
    href="mailto:goodlang.app@gmail.com"
    style="color:#ff6138; text-decoration:none;"
  >
    goodlang.app@gmail.com
  </a>
</p>
`
    }).then(info => {
        console.log(`Promo email sent to ${to}: ${info.messageId}`);
    }).catch((err) => {
        console.error("sendVerificationEmail failed:", err?.message || err);
        // swallow error so it never becomes unhandled
        return null;
    });
}

