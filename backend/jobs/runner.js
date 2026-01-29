// scripts/intervalRunner.js
// Run one async job every `intervalMs`, but NEVER overlap.
// If a tick is still running, next tick is skipped.

import {runTipsTick} from "../emails/tips/tipsSender.js";
import {pool} from "../database/pool.js";
import {transporter} from "../core/emailSender.js";
import {fileURLToPath} from "node:url";
import path from "node:path";
import "dotenv/config";
import {
    downgradeAttentionAccountsAfterMarathonAge,
    failInProgressMarathonsForFreeAccounts
} from "../database/repositories/accountsRepository.js";
import {safelyAutostartMarathonsForEligibleAccounts} from "../database/repositories/marathonStarterRepository.js";
import {
    cancelFailedLatestMarathonsAndDowngradeAccounts, completeMarathonsWhenAllSchedulesDone,
    failOverdueInProgressMarathonsBySchedules
} from "../database/repositories/marathonsRepository.js";
import {
    runMarathonCompletedTick,
    runMarathonFailTick,
    runMarathonStartTick
} from "../emails/marathon/marathonEmails.js";
import {runTouTick} from "../emails/tou/TermsSender.js";
import res from "express/lib/response.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// if this file is in /scripts, then root is one level up
const projectRoot = path.join(__dirname, "..");

export function startNonOverlappingInterval(job, intervalMs = 1000) {
    if (typeof job !== "function") throw new Error("job must be a function");

    let running = false;
    let stopped = false;

    const tick = async () => {
        if (stopped) return;
        if (running) return; // skip this tick

        running = true;
        try {
            await job();
        } catch (e) {
            console.error("[intervalRunner] job error:", e);
        } finally {
            running = false;
        }
    };

    const timer = setInterval(tick, intervalMs);

    return {
        stop() {
            stopped = true;
            clearInterval(timer);
            console.log('The runner has stopped.')
        },
    };
}

console.log('process.env.STRIPE_LIFETIME_10_COUPON_ID', process.env.STRIPE_LIFETIME_10_COUPON_ID)
console.log('process.env.SMTP_FROM', process.env.SMTP_FROM)
console.log('process.env.FRONTEND_URL', process.env.FRONTEND_URL)
console.log('The runner is running...');

startNonOverlappingInterval(async () => {
    const res = await runTipsTick({ pool, transporter, projectRoot });
    // avoid spam logs outside window
    if (!res.skipped) console.log("[tipsCron]", res);

    // const promoRes = await runPromoRegularTick(
    //     { pool, transporter, projectRoot, batchSize: 1 });
    // if (!res.skipped) console.log("[promoCron]", promoRes);
//}, 10000)
}, 1200000)

startNonOverlappingInterval(async () => {
    const res = await runTouTick({ pool, transporter, projectRoot });

    if (!res.skipped) console.log("[tipsCron]", res);
}, 60000)

startNonOverlappingInterval(async () => {
    const res = await runMarathonStartTick({ pool, transporter, projectRoot, limit: 1 });
    // avoid spam logs outside window
    if (!res.skipped) console.log("[tipsCron]", res);
}, 1000)

startNonOverlappingInterval(async () => {
    const res = await runMarathonFailTick({ pool, transporter, projectRoot, limit: 1 });
    // avoid spam logs outside window
    if (!res.skipped) console.log("[tipsCron]", res);
}, 1000)

startNonOverlappingInterval(async () => {
    const res = await runMarathonCompletedTick({ pool, transporter, projectRoot, limit: 1 });
    // avoid spam logs outside window
    if (!res.skipped) console.log("[tipsCron]", res);
}, 1000)

startNonOverlappingInterval(async () => {
    await completeMarathonsWhenAllSchedulesDone();
    await safelyAutostartMarathonsForEligibleAccounts();
    await failOverdueInProgressMarathonsBySchedules();

    await cancelFailedLatestMarathonsAndDowngradeAccounts({ limit: 10 });
    await downgradeAttentionAccountsAfterMarathonAge();

    await failInProgressMarathonsForFreeAccounts();
}, 5000)
