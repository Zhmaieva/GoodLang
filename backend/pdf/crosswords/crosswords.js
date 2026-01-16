import fs from "node:fs/promises";
import path from "node:path";

/**
 * @param {string} base64Path - base64 encoded relative path (e.g. "ZmlsZXMvcGRmcy9hYmMucGRm")
 * @returns {Promise<Buffer>} PDF file buffer
 */
export async function getPdfByBase64Path(base64Path) {
    if (!base64Path) {
        throw new Error("Missing base64 path");
    }

    // 1️⃣ Decode base64 → string
    const decodedPath = Buffer.from(base64Path, "base64").toString("utf-8");

    // 2️⃣ Resolve against current script directory
    const baseDir = `${path.resolve(process.cwd())}/pdf/crosswords/`; // or __dirname equivalent
    const resolvedPath = path.resolve(baseDir, decodedPath);

    // 3️⃣ Security check (prevent ../../etc/passwd)
    if (!resolvedPath.startsWith(baseDir)) {
        throw new Error("Invalid path");
    }

    // 4️⃣ Ensure it's a PDF
    if (path.extname(resolvedPath).toLowerCase() !== ".pdf") {
        throw new Error("Only PDF files are allowed");
    }

    // 5️⃣ Read file
    return await fs.readFile(resolvedPath);
}
