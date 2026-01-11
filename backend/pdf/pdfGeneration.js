import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";

// NOTE: in the real backend repo, pdfGeneration.js lives in /pdf, so these are one level up.
import { ALL_RULES_SAMPLES } from "../core/allRulesSamples.js";
import { RULE_LABELS } from "../core/rules.js";
import * as RulePages from "../core/rulePages.js";
import {shuffleBySeed} from "../core/сore.js";
import {buildRuleIntroHtml} from "./buildRuleInfo.js";

/** ------------ small concurrency limiter (no extra deps) ------------ */
/** ------------ small concurrency + queue limiter ------------ */
function createLimiter(maxConcurrent = 4, maxQueue = 20) {
    let active = 0;
    const queue = [];

    const runNext = () => {
        if (active >= maxConcurrent) return;
        const next = queue.shift();
        if (!next) return;

        active++;
        next()
            .finally(() => {
                active--;
                runNext();
            });
    };

    return function limit(fn) {
        return new Promise((resolve, reject) => {
            if (queue.length >= maxQueue) {
                const err = new Error("PDF queue is full");
                err.code = "PDF_QUEUE_FULL";
                reject(err);
                return;
            }

            queue.push(async () => {
                try {
                    resolve(await fn());
                } catch (e) {
                    reject(e);
                }
            });

            runNext();
        });
    };
}


const limitPdf = createLimiter(Number(process.env.PDF_CONCURRENCY ?? 2), Number(process.env.PDF_QUEUE_LIMIT ?? 20));

/** ------------ puppeteer browser singleton ------------ */
let browserPromise = null;

async function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
        });
    }
    return browserPromise;
}

async function getWatermarkBase64() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    let watermarkBase64 = ""
    try {
        watermarkBase64 = await fs.readFile(path.join(__dirname, "watermark.png"), "base64");
    } catch {
        // local dev fallback (your uploaded asset in this project sandbox)
        try {
            watermarkBase64 = await fs.readFile(
                "/mnt/data/04446554-5abe-44d9-ab37-db9011e60ca4.png",
                "base64"
            );
        } catch {
            watermarkBase64 = "";
        }
    }
    return watermarkBase64;
}

async function loadHtmlTemplate(fileName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    let html = await fs.readFile(path.join(__dirname, fileName), "utf8");

    const watermarkBase64 = await getWatermarkBase64();

    // ---- Nunito fonts (TTF, embedded as data URIs) ----
    // We reuse the variable font file for weights 400/700/800.
    const nunitoRegularTtf = await fs.readFile(
        path.join(__dirname, "Nunito-VariableFont_wght.ttf"),
        "base64"
    );
    const nunitoItalicTtf = await fs.readFile(
        path.join(__dirname, "Nunito-Italic-VariableFont_wght.ttf"),
        "base64"
    );

    // Your templates currently declare woff2 in @font-face.
    // On the server we embed TTF, so adjust the mime + format.
    html = html
        .replaceAll("data:font/woff2;base64,", "data:font/ttf;base64,")
        .replaceAll('format("woff2")', 'format("truetype")');

    return html
        .split("{{WATERMARK_BASE64}}").join(watermarkBase64)
        .split("{{NUNITO_REGULAR}}").join(nunitoRegularTtf)
        .split("{{NUNITO_BOLD}}").join(nunitoRegularTtf)
        .split("{{NUNITO_EXTRABOLD}}").join(nunitoRegularTtf)
        .split("{{NUNITO_ITALIC}}").join(nunitoItalicTtf);
}

function escapeHtml(str) {
    return String(str ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function replaceTitle(html, title) {
    // Keep attributes on <h1> if present
    return html.replace(/<h1([^>]*)>[\s\S]*?<\/h1>/i, `<h1$1>${escapeHtml(title)}</h1>`);
}

function replaceListItems(html, itemsHtml, mode /* 'task' | 'answers' */) {
    const start = html.indexOf('<div class="list">');
    if (start === -1) return html;

    const startInner = html.indexOf(">", start) + 1;

    // Template-specific end marker
    const endMarker = mode === "task" ? '<div class="spacer"></div>' : '<!-- bottom logo -->';
    const endMarkerIndex = html.indexOf(endMarker, startInner);
    if (endMarkerIndex === -1) return html;

    // The list's closing </div> is the last </div> right before the marker
    const listCloseStart = html.lastIndexOf("</div>", endMarkerIndex);
    if (listCloseStart === -1 || listCloseStart < startInner) return html;

    return html.slice(0, startInner) + "\n" + itemsHtml + "\n" + html.slice(listCloseStart);
}

function buildTaskItems(samples) {
    return samples
        .map((s, idx) => {
            const ua = escapeHtml(s.ua);
            return (
                `            <div class="item">\n` +
                `                <div class="badge">${idx + 1}</div>\n` +
                `                <div class="text-wrap">\n` +
                `                    <p class="sentence">${ua}</p>\n` +
                `                    <div class="answer-line"></div>\n` +
                `                </div>\n` +
                `            </div>`
            );
        })
        .join("\n\n");
}

function buildAnswerItems(samples) {
    return samples
        .map((s, idx) => {
            const ua = escapeHtml(s.ua);
            const enFirst = escapeHtml(Array.isArray(s.en) ? (s.en[0] ?? "") : "");
            return (
                `            <div class="item">\n` +
                `                <div class="badge">${idx + 1}</div>\n` +
                `                <div class="text-wrap">\n` +
                `                    <p class="sentence">${ua}</p>\n` +
                `                    <div class="translation">${enFirst}</div>\n` +
                `                    <div class="answer-line"></div>\n` +
                `                </div>\n` +
                `            </div>`
            );
        })
        .join("\n\n");
}

function populateTemplate({ html, ruleName, samples, mode }) {
    const title = RULE_LABELS?.[ruleName] ?? ruleName;
    //const withSuffix = false && mode === "answers" ? `${title} — answers` : title;

    let out = replaceTitle(html, title);

    const itemsHtml = mode === "answers" ? buildAnswerItems(samples) : buildTaskItems(samples);
    out = replaceListItems(out, itemsHtml, mode === "answers" ? "answers" : "task");
    return out;
}

function getRulePage(ruleId) {
    const exportName = `RULE_PAGE_${ruleId}`;
    const page = RulePages[exportName];
    if (!page) throw new Error(`Missing export: ${exportName}`);
    return page;
}

/**
 * Main entry: build a 2-page PDF (tasks + answers) for a grammar rule.
 * - ruleName: e.g. "SECOND_CONDITIONAL"
 * - takes first 8 samples for that rule
 */
export async function getPdf(ruleName) {
    const key = String(ruleName ?? "").trim();
    if (!key) throw new Error("ruleName is required");

    const rulePage = getRulePage(ruleName);
    if (!rulePage) {
        throw new Error(`No rule page found for rule: ${key}`);
    }

    const samplesAll = shuffleBySeed(ALL_RULES_SAMPLES?.[key], 5431);
    if (!Array.isArray(samplesAll) || samplesAll.length === 0) {
        throw new Error(`No samples found for rule: ${key}`);
    }

    const samples = samplesAll.slice(0, 8);

    // 1) Intro page
    const introHtml = buildRuleIntroHtml(rulePage, {
        watermarkBase64: await getWatermarkBase64()
    });
    const introPdf = await generatePdfFromHtml(introHtml);

    // 2) Tasks
    const htmlTask = populateTemplate({
        html: await loadHtmlTemplate("template.html"),
        ruleName: key,
        samples,
        mode: "task",
    });
    const pdfTask = await generatePdfFromHtml(htmlTask);

    // 3) Answers
    const htmlAnswers = populateTemplate({
        html: await loadHtmlTemplate("template-answers.html"),
        ruleName: key,
        samples,
        mode: "answers",
    });
    const pdfAnswers = await generatePdfFromHtml(htmlAnswers);

    // Merge: intro → tasks → answers
    return mergePdfs([introPdf, pdfTask, pdfAnswers]);
}


async function mergePdfs(pdfBuffers) {
    const mergedPdf = await PDFDocument.create();

    for (const buffer of pdfBuffers) {
        const pdf = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save(); // Uint8Array
}

/** ------------ PDF generator ------------ */
async function generatePdfFromHtml(html) {
    // Queue + limit concurrency to avoid resource spikes
    return limitPdf(async () => {
        const browser = await getBrowser();
        const page = await browser.newPage();

        try {
            page.setDefaultTimeout(Number(process.env.PDF_TIMEOUT_MS ?? 10000));

            await page.setContent(html, { waitUntil: "networkidle0" });
            await page.emulateMediaType("print");

            return await page.pdf({
                format: "A4",
                printBackground: true,
                displayHeaderFooter: false,
                margin: { top: "16mm", bottom: "16mm", left: "16mm", right: "16mm" },
            });
        } finally {
            await page.close().catch(() => {});
        }
    });
}

/** Optional: graceful shutdown */
process.on("SIGTERM", async () => {
    try {
        const b = await browserPromise;
        if (b) await b.close();
    } catch {}
    process.exit(0);
});
