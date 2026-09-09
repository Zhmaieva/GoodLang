import nodemailer from "nodemailer";
import {MAIL_PASS} from "./constants.js";
import {FONT_FAMILY_CSS} from "../../shared/fontFamily.js";

// Create reusable transporter using SMTP (example: Gmail, custom SMTP)
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'goodlang.app@gmail.com',
        pass: MAIL_PASS,
    },
    socketTimeout: 10000,
    timeout: 15000,
    tls: {
        rejectUnauthorized: true,
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
        subject: "Your GoodLang login code",
        text: `Your GoodLang login code: ${code}`,
        html: `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8f9fc;">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;background:#ffffff;border:1px solid #e6e8f1;border-radius:24px;">
        <tr>
          <td style="padding:22px;border-bottom:1px solid #e6e8f1;color:#000000;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;letter-spacing:-0.4px;">
            Good Lang
          </td>
        </tr>
        <tr>
          <td style="padding:24px 22px;font-family:${FONT_FAMILY_CSS};color:#20243a;">
            <p style="margin:0 0 10px;font-size:16px;line-height:1.5;">Your login code:</p>
            <div style="display:inline-block;padding:12px 16px;background:#171b2f;color:#ffffff;border-radius:14px;font-size:26px;font-weight:800;letter-spacing:0.14em;">
              ${code}
            </div>
            <p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:#7d8499;">
              If this wasn’t you, please email us at
              <a href="mailto:goodlang.app@gmail.com" style="color:#7477b8;font-weight:700;">goodlang.app@gmail.com</a>.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`,
    }).then(() => {
        console.log(`Verification email sent to ${to}: ${info.messageId}`);
    }).catch((err) => {
        console.error("sendVerificationEmail failed:", err?.message || err);
        return null;
    });
}

function pluralizeHours(n) {
    if (n === 1) return "hour";
    return "hours";
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
        subject: "Your GoodLang promo code",
        text: `Your promo code: ${code}
Valid for another ${hoursLeft} ${hoursWord}.
Activate it here: ${SUBSCRIBE_URL}`,
        html: `
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f8f9fc;">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;background:#ffffff;border:1px solid #e6e8f1;border-radius:24px;">
        <tr>
          <td style="padding:22px;border-bottom:1px solid #e6e8f1;color:#000000;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;letter-spacing:-0.4px;">
            Good Lang
          </td>
        </tr>
        <tr>
          <td style="padding:24px 22px;font-family:${FONT_FAMILY_CSS};color:#20243a;">
            <div style="padding:16px;background:#f0f1fb;border:1px solid #e6e8f1;border-radius:16px;">
              <p style="margin:0 0 12px;font-size:16px;line-height:1.5;">
                🎁 Your promo code for the <strong>GoodLang</strong> monthly subscription:
              </p>
              <div style="display:inline-block;padding:10px 14px;background:#171b2f;color:#ffffff;border-radius:12px;font-size:20px;font-weight:800;letter-spacing:0.06em;">
                ${code}
              </div>
              <p style="margin:14px 0;font-size:14px;line-height:1.5;color:#7d8499;">
                ⏳ Valid for another ${hoursLeft} ${hoursWord}
              </p>
              <a href="${SUBSCRIBE_URL}" style="display:inline-block;max-width:100%;padding:11px 16px;background:#171b2f;color:#ffffff;border-radius:14px;font-size:15px;font-weight:800;line-height:1.3;text-decoration:none;word-break:break-word;">
                Activate discount
              </a>
            </div>
            <p style="margin:18px 0 0;font-size:13px;line-height:1.5;color:#7d8499;">
              If you didn’t sign up for GoodLang, ignore this email or contact us at
              <a href="mailto:goodlang.app@gmail.com" style="color:#7477b8;font-weight:700;">goodlang.app@gmail.com</a>.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`
    }).then(info => {
        console.log(`Promo email sent to ${to}: ${info.messageId}`);
    }).catch((err) => {
        console.error("sendVerificationEmail failed:", err?.message || err);
        return null;
    });
}
