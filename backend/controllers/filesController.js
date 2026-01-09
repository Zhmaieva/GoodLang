import { authMiddleware } from "../middleware/authMiddleware.js";
import { getPdf } from "../pdf/pdfGeneration.js";
import { getAccountInfo } from "../database/repositories/accountsRepository.js";

const name = "files";

export const filesController = {
    mapRoutes: function (app) {
        app.get(`/${name}/generate/pdf`, authMiddleware, async (req, res, next) => {
            try {
                const accountInfo = await getAccountInfo(req.user.id);
                if (accountInfo?.email !== "zorkasupreme@gmail.com") {
                    return res.status(404).send({});
                }

                const rule = String(req.query.rule || "DEMONSTRATIVES").trim();
                const pdfBuffer = await getPdf(rule);

                res.setHeader("Content-Type", "application/pdf");
                const safeName = rule.replaceAll(/[^a-zA-Z0-9_-]+/g, "_");
                res.setHeader("Content-Disposition", `attachment; filename="${safeName}.pdf"`);

                return res.send(pdfBuffer);
            } catch (e) {
                next(e);
            }
        });
    },
};
