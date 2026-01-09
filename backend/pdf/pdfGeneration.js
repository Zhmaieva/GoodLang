import fs from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";
import puppeteer from "puppeteer";
import { PDFDocument } from "pdf-lib";

/** ------------ small concurrency limiter (no extra deps) ------------ */
function createLimiter(maxConcurrent = 4) {
    let active = 0;
    const queue = [];

    const runNext = () => {
        if (active >= maxConcurrent) return;
        const next = queue.shift();
        if (!next) return;
        active++;
        next()
            .catch(() => {})
            .finally(() => {
                active--;
                runNext();
            });
    };

    return function limit(fn) {
        return new Promise((resolve, reject) => {
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

const limitPdf = createLimiter(Number(process.env.PDF_CONCURRENCY ?? 4));

/** ------------ puppeteer browser singleton ------------ */
let browserPromise = null;

async function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
            ],
        });
    }
    return browserPromise;
}

/** ------------ HTML loader (same directory as this file) ------------ */
async function loadAssets() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const watermarkPath = path.join(__dirname, "watermark.png");
    const watermarkBase64 = await fs.readFile(watermarkPath, "base64");

    return {
        watermarkBase64,
    };
}

async function loadHtmlTemplate(fileName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    let html = await fs.readFile(path.join(__dirname, fileName), "utf8");

    const watermarkBase64 = await fs.readFile(
        path.join(__dirname, "watermark.png"),
        "base64"
    );

    const nunitoRegular = await fs.readFile(
        path.join(__dirname, "Nunito-VariableFont_wght.ttf"),
        "base64"
    );
    const nunitoItalic = await fs.readFile(
        path.join(__dirname, "Nunito-Italic-VariableFont_wght.ttf"),
        "base64"
    );

    return html
        .split("{{WATERMARK_BASE64}}").join(watermarkBase64)
        .replace("{{NUNITO}}", nunitoRegular)
        .replace("{{NUNITO_ITALIC}}", nunitoItalic);
}

export async function getPdf() {
    const pdf1 = await generatePdf('template.html'); // page 1
    const pdf2 = await generatePdf('template-answers.html'); // page 2

    return mergePdfs([pdf1, pdf2]);
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
async function generatePdf(templateName) {
    const html = await loadHtmlTemplate(templateName);

    // Queue + limit concurrency to avoid resource spikes
    return limitPdf(async () => {
        const browser = await getBrowser();
        const page = await browser.newPage();

        try {
            // Safety/timeouts
            page.setDefaultTimeout(Number(process.env.PDF_TIMEOUT_MS ?? 10000));

            // Block all network requests if your template is fully self-contained
            // await page.setRequestInterception(true);
            // page.on("request", (req) => req.abort());

            await page.setContent(html, { waitUntil: "networkidle0" });
            await page.emulateMediaType("print");

            return await page.pdf({
                format: "A4",
                printBackground: true,
                displayHeaderFooter: false, // <-- no URL/date/page numbers unless you add your own
                margin: {
                    top: "16mm",
                    bottom: "16mm",
                    left: "16mm",
                    right: "16mm",
                },
            });
        } finally {
            await page.close().catch(() => {});
        }
    });
}

/** Optional: graceful shutdown (put in your main server file if you prefer) */
process.on("SIGTERM", async () => {
    try {
        const b = await browserPromise;
        if (b) await b.close();
    } catch {}
    process.exit(0);
});