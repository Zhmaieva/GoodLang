#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

/**
 * Config
 */
const ROOT_DIR = process.argv[2] || "."; // folder to scan (default: project root)
const ONLY_PDFS = true;

/**
 * Base64 encoder (utf-8 safe)
 */
function toBase64(str) {
    return Buffer.from(str, "utf-8").toString("base64");
}

/**
 * Recursive directory walk
 */
async function walk(dir, results = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // skip common noisy folders
            if (["node_modules", ".git", "dist", "build"].includes(entry.name)) {
                continue;
            }

            await walk(fullPath, results);
        } else if (entry.isFile()) {
            if (!ONLY_PDFS || entry.name.toLowerCase().endsWith(".pdf")) {
                results.push(fullPath);
            }
        }
    }

    return results;
}

async function main() {
    const baseDir = path.resolve(process.cwd());
    const scanDir = path.resolve(baseDir, ROOT_DIR);

    console.log(`🔍 Scanning for PDFs in: ${scanDir}\n`);

    const files = await walk(scanDir);

    if (files.length === 0) {
        console.log("❌ No PDFs found");
        return;
    }

    console.log(`✅ Found ${files.length} PDF(s)\n`);

    for (const file of files) {
        const relativePath = path.relative(baseDir, file);
        const code = toBase64(relativePath);

        // filename without extension
        const rawName = path.basename(file, ".pdf");

        // make it URL / filesystem safe
        const filename = rawName
            .trim()
            .replace(/\s+/g, "_")
            .replace(/[^\w\d-_]/g, "");

        const encodedCode = encodeURIComponent(code);
        const encodedFilename = encodeURIComponent(filename);

        console.log("📄", path.basename(file));
        console.log("   path:", relativePath);
        console.log("   code:", code);
        console.log(
            "   test-url: http://localhost:5173/crossword?code=" +
            encodedCode +
            "&filename=" +
            encodedFilename
        );
        console.log(
            "   prod-url: https://goodlang.app/crossword?code=" +
            encodedCode +
            "&filename=" +
            encodedFilename
        );
        console.log("");
    }

}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
