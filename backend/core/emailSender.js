import nodemailer from "nodemailer";
import {MAIL_PASS} from "./constants.js";

// Create reusable transporter using SMTP (example: Gmail, custom SMTP)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Use 465 for SSL
    secure: false, // Set to true for port 465
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
        from: `"GoodLang" <${process.env.SMTP_FROM}>`,
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
              color:#3a2a1d;
            ">
              ${code}
            </h2>

            <p style="
              margin:8px 0 16px 0;
              font-size:16px;
              font-weight:500;
              color:#3a2a1d;
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
  Якщо це був хтось інший, будь ласка, надішли нам листа на <a href="mailto:goodlang@mail.com">goodlang@mail.com</a>
</p>
`,
    }).then(() => {
        console.log(`Verification email sent to ${to}: ${info.messageId}`);
    });
}

/**
 * Send promo code email
 * @param {string} to - recipient email
 */
export function sendPromoEmail(to) {
    const SUBSCRIBE_URL = `${process.env.FRONTEND_URL}?subscribe=true`;
    const PROMO_CODE = "WELCOME26";

    return transporter.sendMail({
        from: `"GoodLang" <${process.env.SMTP_FROM}>`,
        to,
        subject: "Твій промо-код для GoodLang",
        text: `Твій промо-код: ${PROMO_CODE}\nАктивуй тут: ${SUBSCRIBE_URL}`,
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
              color:#3a2a1d;
            ">
              ${PROMO_CODE}
            </h2>

            <p style="
              margin:8px 0 16px 0;
              font-size:16px;
              font-weight:500;
              color:#3a2a1d;
            ">
              🎁 Це твій промо-код для <strong>GoodLang</strong>
            </p>

            <p style="
              margin:0 0 12px 0;
              font-size:15px;
              color:#3a2a1d;
            ">
              Активуй доступ за посиланням:
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
    });
}
