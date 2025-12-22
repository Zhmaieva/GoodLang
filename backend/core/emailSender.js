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
        subject: "Перевірка імейлу в GoodLang",
        text: `Твій код доступу до GoodLang: ${code}`,
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
