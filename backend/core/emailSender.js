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
export async function sendVerificationEmail(to, code) {
    const info = await transporter.sendMail({
        from: `"GoodLang" <${process.env.SMTP_FROM}>`,
        to,
        subject: "Your GoodLang Verification Code",
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });

    console.log(`Verification email sent to ${to}: ${info.messageId}`);
}
