import {
    addInquiry,
    confirmAccountEmailChange,
    createAccount,
    getAccountInfo,
    sendCurrentEmailChangeCode,
    sendNewEmailChangeCode,
    sendPromoCode,
    sendVerificationCode,
    unsubscribeByToken,
    verifyCode,
    verifyCurrentEmailChangeCode,
} from "../database/repositories/accountsRepository.js";
import jwt from "jsonwebtoken";
import {ACTION_TYPES, SECRET_KEY} from "../core/constants.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {recordAction} from "../database/repositories/accountLogRepository.js";

const name = 'accounts';
const appVersion = process.env.APP_VERSION || "1.0.0";

function generateToken({id}) {
    return jwt.sign({ id }, SECRET_KEY);
}

const emailChangeTokenTtl = "20m";

function generateEmailChangeToken({ id, step, email }) {
    return jwt.sign(
        { id: String(id), step, email, purpose: "email-change" },
        SECRET_KEY,
        { expiresIn: emailChangeTokenTtl }
    );
}

function createPublicError(message, statusCode = 400) {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.publicMessage = message;
    return error;
}

function readEmailChangeToken(token, accountId, step) {
    if (!token) {
        throw createPublicError("Confirm the previous step first");
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        if (
            payload?.purpose !== "email-change" ||
            payload?.id !== String(accountId) ||
            payload?.step !== step
        ) {
            throw new Error("Invalid token");
        }
        return payload;
    } catch {
        throw createPublicError("Email change confirmation expired. Please start again.");
    }
}

function sendPublicError(res, error) {
    return res.status(error.statusCode || 400).json({
        error: error.publicMessage || error.message || "Something went wrong",
    });
}

export const accountsController = {
    mapRoutes: function (app) {

        app.post(`/${name}/start`, async (req, res, next) => {
            try {
                const { id } = await createAccount();

                // teacher=true comes from query param: /accounts/start?teacher=true
                const isTeacher =
                    req.query?.teacher === "true" ||
                    req.body?.teacher === true ||
                    req.body?.teacher === "true";

                if (isTeacher) {
                    await recordAction(id, ACTION_TYPES.USER_TEACHER_REGISTERED); // 500
                }

                const token = generateToken({ id });

                res.status(201).json({
                    message: "User registered successfully",
                    userId: id,
                    token: token,
                });
            } catch (e) {
                next(e);
            }
        });


        app.get(`/accounts/info`, authMiddleware, async (req, res, next) => {
            try {
                const account = await getAccountInfo(
                    req.user.id,
                    req.query.promo_code
                );

                res.json({
                    ...account,
                    appVersion,
                });
            } catch (e) {
                next(e);
            }
        });


        app.get(`/accounts/verify`, authMiddleware, async (req, res, next) => {
            try {
                const { action_type } = req.query;

                if (action_type)
                    await recordAction(req.user.id, action_type);

                res.json({verified: true});
            } catch (e) {
                next(e);
            }
        });

        app.post(`/accounts/email-change/start`, authMiddleware, async (req, res, next) => {
            try {
                const { email } = await sendCurrentEmailChangeCode(req.user.id);

                res.json({ message: "Code sent to current email", email });
            } catch (e) {
                if (e.publicMessage) return sendPublicError(res, e);
                next(e);
            }
        });

        app.post(`/accounts/email-change/verify-current`, authMiddleware, async (req, res, next) => {
            try {
                const { code } = req.body;
                if (!code) return res.status(400).json({ error: "Code required" });

                const { email } = await verifyCurrentEmailChangeCode(req.user.id, code);

                res.json({
                    message: "Current email confirmed",
                    email,
                    changeToken: generateEmailChangeToken({
                        id: req.user.id,
                        step: "current-confirmed",
                        email,
                    }),
                });
            } catch (e) {
                if (e.publicMessage) return sendPublicError(res, e);
                next(e);
            }
        });

        app.post(`/accounts/email-change/send-new-code`, authMiddleware, async (req, res, next) => {
            try {
                const { newEmail, changeToken } = req.body;
                readEmailChangeToken(changeToken, req.user.id, "current-confirmed");

                const { email } = await sendNewEmailChangeCode(req.user.id, newEmail);

                res.json({
                    message: "Code sent to new email",
                    email,
                    changeToken: generateEmailChangeToken({
                        id: req.user.id,
                        step: "new-code-sent",
                        email,
                    }),
                });
            } catch (e) {
                if (e.publicMessage) return sendPublicError(res, e);
                next(e);
            }
        });

        app.post(`/accounts/email-change/confirm`, authMiddleware, async (req, res, next) => {
            try {
                const { code, changeToken } = req.body;
                if (!code) return res.status(400).json({ error: "Code required" });

                const payload = readEmailChangeToken(changeToken, req.user.id, "new-code-sent");
                const { email, oldEmail } = await confirmAccountEmailChange(req.user.id, payload.email, code);

                res.json({ message: "Email changed", email, oldEmail });
            } catch (e) {
                if (e.publicMessage) return sendPublicError(res, e);
                next(e);
            }
        });

        // Request a verification code
        app.post(`/accounts/send-promo-code`, authMiddleware, async (req, res, next) => {
            try {
                const { email } = req.body;
                if (!email) return res.status(400).json({ error: "Email required" });

                await sendPromoCode(req.user.id, email.toLowerCase().trim());

                res.json({ message: "Verification code sent" });
            } catch (e) {
                next(e);
            }
        });

        // Request a verification code
        app.post(`/accounts/send-code`, async (req, res, next) => {
            try {
                const { email } = req.body;
                if (!email) return res.status(400).json({ error: "Email required" });

                await sendVerificationCode(email.toLowerCase().trim());

                res.json({ message: "Verification code sent" });
            } catch (e) {
                next(e);
            }
        });

        app.post(`/accounts/inquiry`, authMiddleware, async (req, res, next) => {
            try {
                const { email } = req.body;
                if (!email) return res.status(400).json({ error: "Email required" });

                await addInquiry(email.toLowerCase().trim());

                res.json({ message: "Verification code sent" });
            } catch (e) {
                next(e);
            }
        });

        // Verify the code and return a JWT token
        app.post(`/accounts/verify-code`, authMiddleware, async (req, res, next) => {
            try {
                const { email, code, termsAccepted } = req.body;
                if (!email || !code) return res.status(400).json({ error: "Email and code required" });

                const { accountId, codeAccepted } = await verifyCode(req.user.id, email, code, termsAccepted);
                if (!codeAccepted) return res.status(400).json({ error: "Invalid or expired code" });

                const token = accountId ? generateToken({id: accountId}) : "";

                if (accountId) {
                    // teacher=true comes from query param: /accounts/start?teacher=true
                    const isTeacher =
                        req.query?.teacher === "true" ||
                        req.body?.teacher === true ||
                        req.body?.teacher === "true";

                    if (isTeacher) {
                        await recordAction(accountId, ACTION_TYPES.USER_TEACHER_REGISTERED); // 500
                    }
                }

                res.json({ message: "Logged in successfully", mustAcceptTerms: !accountId, token });
            } catch (e) {
                next(e);
            }
        });

        app.get(`/${name}/emails/unsubscribe`, async (req, res, next) => {
            try {
                const token = String(req.query?.email_unsubscribe_token ?? "").trim();

                const result = await unsubscribeByToken(token);

                // Keep it simple for email clients
                if (!result.ok) {
                    return res.status(400).send("Invalid unsubscribe link.");
                }

                return res.status(200).send("You have been unsubscribed.");
            } catch (e) {
                next(e);
            }
        });
    }
}
