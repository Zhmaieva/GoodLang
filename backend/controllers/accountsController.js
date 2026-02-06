import {
    addInquiry,
    createAccount,
    getAccountInfo, sendPromoCode,
    sendVerificationCode, unsubscribeByToken,
    verifyCode
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