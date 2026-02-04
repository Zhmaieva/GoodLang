import { authMiddleware } from "../middleware/authMiddleware.js";
import { recordAction } from "../database/repositories/accountLogRepository.js";
import { ACTION_TYPES } from "../core/constants.js";
import {completeCurrentMarathonDay, updateMarathonStatus} from "../database/repositories/marathonsRepository.js";

const name = "marathons";

function actionTypeForStatus(status) {
    switch (status) {
        case "in_progress":
            return ACTION_TYPES.MARATHON_STATUS_IN_PROGRESS;
        case "completed":
            return ACTION_TYPES.MARATHON_STATUS_COMPLETED;
        case "failed":
            return ACTION_TYPES.MARATHON_STATUS_FAILED;
        default:
            return null;
    }
}

export const marathonsController = {
    mapRoutes: function (app) {
        /**
         * Update marathon status.
         * Allowed: only when current status is 'in_progress' (repository enforces this).
         *
         * Body:
         *  - marathonId: string (required)
         *  - status: 'completed' | 'failed' (required)
         */
        app.patch(`/${name}/status`, authMiddleware, async (req, res) => {
            try {
                const { status } = req.body || {};

                if (status !== "completed" && status !== "failed") {
                    return res.status(400).json({ error: "Invalid status. Use 'completed' or 'failed'." });
                }

                // Repository must only allow transition FROM 'in_progress'
                const result = await updateMarathonStatus(status);
                // result: { updated: boolean, marathonId, status, previousStatus? }

                // Track only if the status was actually changed
                if (result?.updated) {
                    const actionType = actionTypeForStatus(result.status);
                    if (actionType) {
                        await recordAction(req.user.id, actionType);
                    }
                }

                return res.json({
                    ok: true,
                    updated: !!result?.updated,
                    status: result?.status,
                    previousStatus: result?.previousStatus,
                });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to update marathon status" });
            }
        });


        /**
         * Complete current marathon day for active marathon.
         *
         * Body (optional):
         *  - requireAllTasksAnswered: boolean (default false)
         */
        app.post("/marathons/complete-day", authMiddleware, async (req, res) => {
            try {
                const { requireAllTasksAnswered = false } = req.body || {};

                const result = await completeCurrentMarathonDay(
                    req.user.id,
                    { requireAllTasksAnswered }
                );

                return res.json({
                    ok: true,
                    updated: !!result.updated,
                    marathonId: result.marathonId,
                    scheduleId: result.scheduleId,
                    dayNumber: result.dayNumber,
                });
            } catch (err) {
                console.error(err);
                return res.status(500).json({
                    error: "Failed to complete marathon day",
                });
            }
        });
    },
};
