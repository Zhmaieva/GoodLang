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
import {ALL_GAPS_SAMPLES} from "../core/allGapsSamples.js";

export const CHOOSE_VARIANT_TASK_FORM = "choose_variant";

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

function getFirstEn(s) {
    return escapeHtml(Array.isArray(s?.en) ? (s.en[0] ?? "") : "");
}

function buildGapsTaskItems(samples) {
    return samples
        .map((s, idx) => {
            const en = getFirstEn(s);
            const options = Array.isArray(s?.options) ? s.options : [];
            const optionsText = options.map(escapeHtml).map(o => {
                return o === "" ? "—" : o;
            }).join(" / ");

            const sentenceHtml = escapeHtml(en).includes("{GAP}")
                ? escapeHtml(en).replace("{GAP}", `<span class="choices">${optionsText}</span>`)
                : `${escapeHtml(en)} <span class="choices">${optionsText}</span>`;

            return (
                `            <div class="item">\n` +
                `                <div class="badge">${idx + 1}</div>\n` +
                `                <div class="text-wrap">\n` +
                `                    <p class="sentence">${sentenceHtml}</p>\n` +
                `                </div>\n` +
                `            </div>`
            );
        })
        .join("\n\n");
}

function buildGapsAnswerItems(samples) {
    return samples
        .map((s, idx) => {
            const en = getFirstEn(s);
            let correct = escapeHtml(s?.correct ?? "");
            correct = correct === "" ? "—" : correct;

            const sentenceHtml = escapeHtml(en).includes("{GAP}")
                ? escapeHtml(en).replace("{GAP}", `<span class="fill">${correct}</span>`)
                : `${escapeHtml(en)} <span class="fill">${correct}</span>`;

            return (
                `            <div class="item">\n` +
                `                <div class="badge">${idx + 1}</div>\n` +
                `                <div class="text-wrap">\n` +
                `                    <p class="sentence">${sentenceHtml}</p>\n` +
                `                </div>\n` +
                `            </div>`
            );
        })
        .join("\n\n");
}


function populateTemplate({ html, ruleName, samples, mode, pdfType = "translations" }) {
    const title = RULE_LABELS?.[ruleName] ?? ruleName;

    let headerTitle = title;
    if (pdfType === CHOOSE_VARIANT_TASK_FORM && mode === "task") headerTitle = `${title}, circle the correct option`;
    if (pdfType === CHOOSE_VARIANT_TASK_FORM && mode === "answers") headerTitle = `${title}, answers`;

    let out = replaceTitle(html, headerTitle);

    let itemsHtml = "";
    if (pdfType === CHOOSE_VARIANT_TASK_FORM) {
        itemsHtml = mode === "answers" ? buildGapsAnswerItems(samples) : buildGapsTaskItems(samples);
    } else {
        itemsHtml = mode === "answers" ? buildAnswerItems(samples) : buildTaskItems(samples);
    }

    // for gaps templates, the list ends before bottom logo too; reuse "answers" behavior
    const replaceMode = mode === "answers" ? "answers" : "task";
    out = replaceListItems(out, itemsHtml, replaceMode);

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
export async function getPdf(ruleName, opts = {}) {
    const { pdfType = "translations" } = opts;

    const key = String(ruleName ?? "").trim();
    if (!key) throw new Error("ruleName is required");

    if (!["translations", CHOOSE_VARIANT_TASK_FORM].includes(pdfType)) {
        throw new Error(`Unsupported pdfType: ${pdfType}`);
    }

    const rulePage = getRulePage(ruleName);
    if (!rulePage) throw new Error(`No rule page found for rule: ${key}`);

    const isGaps = pdfType === CHOOSE_VARIANT_TASK_FORM;
    const samplesRaw = isGaps ? ALL_GAPS_SAMPLES?.[key] : ALL_RULES_SAMPLES?.[key];

    const samplesAll = shuffleBySeed(samplesRaw, 5431);
    if (!Array.isArray(samplesAll) || samplesAll.length === 0) {
        throw new Error(`No samples found for rule: ${key}`);
    }

    const samples = samplesAll.slice(0, isGaps ? 12 : 8);

    // 1) Intro page (same for both pdf types)
    const introHtml = buildRuleIntroHtml(rulePage, {
        watermarkBase64: await getWatermarkBase64()
    });
    const introPdf = await generatePdfFromHtml(introHtml);

    // Pick templates by type
    const taskTemplateFile =
        isGaps ? "template-gaps.html" : "template.html";

    const answersTemplateFile =
        isGaps ? "template-gaps-answers.html" : "template-answers.html";

    // 2) Tasks
    const htmlTask = populateTemplate({
        html: await loadHtmlTemplate(taskTemplateFile),
        ruleName: key,
        samples,
        mode: "task",
        pdfType,
    });
    const pdfTask = await generatePdfFromHtml(htmlTask);

    // 3) Answers
    const htmlAnswers = populateTemplate({
        html: await loadHtmlTemplate(answersTemplateFile),
        ruleName: key,
        samples,
        mode: "answers",
        pdfType,
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

async function getPreGeneratedPdfPath(ruleName, pdfType) {
    const key = String(ruleName ?? "").trim().toUpperCase();
    if (!key) throw new Error("ruleName is required");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const pdfDirName = pdfType === CHOOSE_VARIANT_TASK_FORM
        ? "pre-generated-choose-variant"
        : "pre-generated-translations";
    // /pdfGeneration.js is in /pdf in your repo => pre-generated folder sits next to it
    // i.e. /pdf/pre-generated/CAN_CANT.pdf
    const folder = path.join(__dirname, pdfDirName);
    const filePath = path.join(folder, `${key}.pdf`);

    // prevent any sneaky path tricks (extra safe)
    const rel = path.relative(folder, filePath);
    if (rel.startsWith("..") || path.isAbsolute(rel)) {
        throw new Error("Invalid ruleName for pre-generated PDF");
    }

    return filePath;
}

/**
 * Returns a pre-generated PDF buffer if it exists.
 * File naming: /pre-generated/<RULE_ID>.pdf (RULE_ID is uppercase)
 *
 * @returns {Promise<Uint8Array>} PDF bytes
 */
export async function getPreGeneratedPdf(ruleName, {pdfType}) {
    const filePath = await getPreGeneratedPdfPath(ruleName, pdfType);

    try {
        const buf = await fs.readFile(filePath);
        // fs.readFile gives Buffer; keep it consistent with your return type
        return new Uint8Array(buf);
    } catch (e) {
        if (e?.code === "ENOENT") {
            const key = String(ruleName ?? "").trim().toUpperCase();
            const err = new Error(`Pre-generated PDF not found for rule: ${key}`);
            err.code = "PDF_PREGENERATED_NOT_FOUND";
            err.filePath = filePath;
            throw err;
        }
        throw e;
    }
}

/** Optional: graceful shutdown */
process.on("SIGTERM", async () => {
    try {
        const b = await browserPromise;
        if (b) await b.close();
    } catch {}
    process.exit(0);
});
