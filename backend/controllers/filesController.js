import { authMiddleware } from "../middleware/authMiddleware.js";
import { getPdf } from "../pdf/pdfGeneration.js";
import { getAccountInfo } from "../database/repositories/accountsRepository.js";

const name = "files";

export const filesController = {
    mapRoutes: function (app) {
        app.get(`/${name}/generate/pdf`, authMiddleware, async (req, res, next) => {
            try {
                const pdf = await getPdf(req.query.rule);

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
