import {authMiddleware} from "../middleware/authMiddleware.js";
import {
    getAnswersSince,
    getSeedState,
    saveSeedState, upsertAnswers
} from "../database/repositories/scoresRepository.js";
import {getAccountInfo} from "../database/repositories/accountsRepository.js";

const name = 'data-sync';

export const dataSyncController = {
    mapRoutes: function (app) {

        // POST /data-sync
        app.post(`/${name}`, authMiddleware, async (req, res, next) => {
            try {
                const userId = req.user.id;     // authMiddleware sets this
                const {
                    since,
                    answers = [],
                    seedState = null,
                    deviceId
                } = req.body;

                const accountInfo = await getAccountInfo(userId);
                if (accountInfo?.status !== 'paid' && accountInfo?.status !== 'attention') {
                    res.status(400).json({ error: "Can't sync free account" });
                }

                const updatedOn = new Date();
                // 1. Save incoming answers (ignore duplicates)
                await upsertAnswers(userId, deviceId, answers, updatedOn);

                // 2. Save seed/skip if provided
                if (seedState?.updatedAt) {
                    await saveSeedState(userId, seedState);
                }

                // 3. Fetch server-side changes since "since"
                const serverAnswers = await getAnswersSince(userId, since);
                const serverSeed = await getSeedState(userId);

                res.json({
                    answers: serverAnswers,
                    seedState: serverSeed,
                    serverTime: updatedOn.toISOString(),
                });
            } catch (err) {
                next(err);
            }
        });

    }
}