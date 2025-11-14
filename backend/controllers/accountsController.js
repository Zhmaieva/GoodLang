import {createAccount, getAccountStatus} from "../database/repositories/accountsRepository.js";
import jwt from "jsonwebtoken";
import {SECRET_KEY} from "../core/constants.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

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

        app.get(`/${name}/status`, authMiddleware, async (req, res, next) => {
            try {
                const status = await getAccountStatus(req.user.id);

                res.json({status});
            } catch (e) {
                next(e);
            }
        });
    }
}