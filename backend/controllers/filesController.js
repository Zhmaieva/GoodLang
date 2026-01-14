import { authMiddleware } from "../middleware/authMiddleware.js";
import {getPdf, getPreGeneratedPdf} from "../pdf/pdfGeneration.js";
import {getActionCount, recordAction} from "../database/repositories/accountLogRepository.js";
import {ACTION_TYPES} from "../core/constants.js";
import {getAccountById} from "../database/repositories/accountsRepository.js";

const name = "files";

export const filesController = {
    mapRoutes: function (app) {
        app.get(`/${name}/generate/pdf`, authMiddleware, async (req, res, next) => {
            try {
                const account = await getAccountById(req.user.id);
                if (!account.email) {
                    const teacher = await getActionCount(req.user.id, ACTION_TYPES.USER_TEACHER_REGISTERED);
                    const pdfCalls = await getActionCount(req.user.id, ACTION_TYPES.PDF_DOWNLOAD_CALL);
                    if (pdfCalls > 0 || teacher <= 0) {
                        console.log(`userID: ${req.user.id}. pdfCalls: ${pdfCalls}, teacherCalls: ${teacher}`);
                        // res.status(401).json({ error: "Register to download more" });
                        // return;
                    }
                }

                const pdf = await getPreGeneratedPdf(req.query.rule);
                //const pdf = await getPdf(req.query.rule);

                await recordAction(req.user.id, ACTION_TYPES.PDF_DOWNLOAD_CALL);

                res.setHeader("Content-Type", "application/pdf");
                res.send(Buffer.from(pdf));
            } catch (err) {
                if (err.code === "PDF_QUEUE_FULL") {
                    return res.status(429).json({
                        error: "Too many PDF requests. Please try again in a moment."
                    });
                }

                console.error(err);
                res.status(500).json({ error: "Failed to generate PDF" });
            }
        });
    },
};
