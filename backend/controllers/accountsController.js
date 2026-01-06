import {
    createAccount,
    getAccountInfo, sendPromoCode,
    sendVerificationCode,
    verifyCode
} from "../database/repositories/accountsRepository.js";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../core/constants.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {recordAction} from "../database/repositories/accountLogRepository.js";

const name = 'accounts';

function generateToken({id}) {
    return jwt.sign({ id }, SECRET_KEY);
}

export const accountsController = {
    mapRoutes: function (app) {

        app.post(`/${name}/start`, async (req, res, next) => {
            try {
                const {id} = await createAccount();

                const token = generateToken({id});

                res.status(201).json({
                    message: "User registered successfully",
                    userId: id,
                    token: token
                });
            } catch (e) {
                next(e);
            }
        });

        app.get(`/accounts/info`, authMiddleware, async (req, res, next) => {
            try {
                const account = await getAccountInfo(req.user.id);
                res.json(account);
            } catch (e) {
                next(e);
            }
        });

        app.get(`/accounts/verify`, authMiddleware, async (req, res, next) => {
            try {
                const { action_type } = req.query;

                await recordAction(req.user.id, action_type);

                res.json({verified: true});
            } catch (e) {
                next(e);
            }
        });

        // Request a verification code
        app.post(`/accounts/send-promo-code`, async (req, res, next) => {
            try {
                const { email } = req.body;
                if (!email) return res.status(400).json({ error: "Email required" });

                await sendPromoCode(email.toLowerCase().trim());

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

        // Verify the code and return a JWT token
        app.post(`/accounts/verify-code`, async (req, res, next) => {
            try {
                const { email, code, termsAccepted } = req.body;
                if (!email || !code) return res.status(400).json({ error: "Email and code required" });

                const { accountId, codeAccepted } = await verifyCode(email, code, termsAccepted);
                if (!codeAccepted) return res.status(400).json({ error: "Invalid or expired code" });

                const token = accountId ? generateToken({id: accountId}) : "";

                res.json({ message: "Logged in successfully", mustAcceptTerms: !accountId, token });
            } catch (e) {
                next(e);
            }
        });
    }
}