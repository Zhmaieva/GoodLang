import { authMiddleware } from "../middleware/authMiddleware.js";
import {getPdf, getPreGeneratedPdf} from "../pdf/pdfGeneration.js";
import {recordAction} from "../database/repositories/accountLogRepository.js";
import {ACTION_TYPES} from "../core/constants.js";

const name = "files";

export const filesController = {
    mapRoutes: function (app) {
        app.get(`/${name}/generate/pdf`, authMiddleware, async (req, res, next) => {
            try {
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
