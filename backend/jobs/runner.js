// scripts/intervalRunner.js
// Run one async job every `intervalMs`, but NEVER overlap.
// If a tick is still running, next tick is skipped.

import {runTipsTick} from "../emails/tips/tipsSender.js";
import {pool} from "../database/pool.js";
import {transporter} from "../core/emailSender.js";
import {fileURLToPath} from "node:url";
import path from "node:path";

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

console.log('The runner is running...')

startNonOverlappingInterval(async () => {
    const res = await runTipsTick({ pool, transporter, projectRoot });

    // avoid spam logs outside window
    if (!res.skipped) console.log("[tipsCron]", res);
}, 3600000)
