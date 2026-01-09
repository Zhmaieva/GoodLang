import {authMiddleware} from "../middleware/authMiddleware.js";
import {generatePdf} from "../pdf/pdfGeneration.js";
import {getAccountInfo} from "../database/repositories/accountsRepository.js";

const name = 'files';

export const filesController = {
    mapRoutes: function (app) {
        app.get(`/${name}/generate/pdf`, authMiddleware, async (req, res, next) => {
            try {
                const accountInfo = await getAccountInfo(req.user.id);
                if (accountInfo?.email !== 'zorkasupreme@gmail.com') {
                    return res.status(404).send({})
                }

                const pdfBuffer = await generatePdf();

                res.setHeader("Content-Type", "application/pdf");
                res.setHeader(
                    "Content-Disposition",
                    'attachment; filename="generated.pdf"'
                );

                return res.send(pdfBuffer);
            } catch (e) {
                next(e);
            }
        });
    },
};
