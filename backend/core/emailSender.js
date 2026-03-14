import nodemailer from "nodemailer";
import {MAIL_PASS} from "./constants.js";

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
Your login code for <strong>GoodLang</strong>
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
If this wasn’t you, please email us at 
<a href="mailto:goodlang.app@gmail.com">goodlang.app@gmail.com</a>
</p>
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
🎁 This is your promo code for the <strong>GoodLang</strong> monthly subscription  
⏳ Valid for another ${hoursLeft} ${hoursWord}
</p>

<p style="
margin:0 0 12px 0;
font-size:15px;
">
Apply the code using this link:
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
If you didn’t sign up for GoodLang, just ignore this email or contact us at
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
        return null;
    });
}