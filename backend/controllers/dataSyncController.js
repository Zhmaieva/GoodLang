import {authMiddleware} from "../middleware/authMiddleware.js";
import {
    getAnswersSince,
    getSeedState,
    insertAnswers,
    saveSeedState
} from "../database/repositories/scoresRepository.js";

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

                // 1. Save incoming answers (ignore duplicates)
                await insertAnswers(userId, deviceId, answers);

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
                    serverTime: new Date().toISOString(),
                });
            } catch (err) {
                next(err);
            }
        });

    }
}