import { authMiddleware } from "../middleware/authMiddleware.js";
import {CHOOSE_VARIANT_TASK_FORM, getPdf, getPreGeneratedPdf} from "../pdf/pdfGeneration.js";
import {getActionCount, recordAction} from "../database/repositories/accountLogRepository.js";
import {ACTION_TYPES} from "../core/constants.js";
import {getAccountById} from "../database/repositories/accountsRepository.js";
import {getPdfByBase64Path} from "../pdf/crosswords/crosswords.js";

const name = "files";

export const filesController = {
    mapRoutes: function (app) {
        app.get(`/${name}/generate/pdf`, authMiddleware, async (req, res, next) => {
            try {
                const account = await getAccountById(req.user.id);
                // if (!account.email) {
                //     const teacher = await getActionCount(req.user.id, ACTION_TYPES.USER_TEACHER_REGISTERED);
                //     const pdfCalls = await getActionCount(req.user.id, ACTION_TYPES.PDF_DOWNLOAD_CALL);
                //     if (pdfCalls > 0 || teacher <= 0) {
                //         // res.status(401).json({ error: "Register to download more" });
                //         // return;
                //     }
                // }

                const { pdfType } = req.query;

                if (account?.status !== 'paid' && pdfType === CHOOSE_VARIANT_TASK_FORM) {
                    res.status(401).json({ error: "Subscribe to download \"choose correct option\" pdf" });
                }

                const pdf = await getPreGeneratedPdf(req.query.rule, { pdfType: pdfType });
                //const pdf = await getPdf(req.query.rule,{ pdfType: pdfType });

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

        app.get(`/${name}/pdf/crossword`, authMiddleware, async (req, res) => {
            try {
                const { p } = req.query; // base64 encoded relative path

                if (!p) {
                    return res.status(400).json({ error: "Missing path parameter" });
                }

                const pdfBuffer = await getPdfByBase64Path(p);

                await recordAction(req.user.id, ACTION_TYPES.PDF_CROSSWORD_DOWNLOAD_CALL);

                res.setHeader("Content-Type", "application/pdf");
                res.setHeader("Content-Disposition", "inline; filename=file.pdf");
                res.send(pdfBuffer);
            } catch (err) {
                console.error(err);

                if (err.message === "Invalid path") {
                    return res.status(403).json({ error: "Access denied" });
                }

                if (err.message === "Only PDF files are allowed") {
                    return res.status(400).json({ error: "Invalid file type" });
                }

                res.status(404).json({ error: "PDF not found" });
            }
        });

    },
};
