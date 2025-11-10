import fs from 'fs';
import path from 'path';

// --- CONFIG ---
const inputDir = './b2';       // Directory with source JSON files
const outputFile = './output.json';    // Output file path
// ----------------

// Read or initialize output data
let mergedData = {};
if (fs.existsSync(outputFile)) {
    try {
        mergedData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    } catch (e) {
        console.error(`⚠️ Failed to parse ${outputFile}, starting fresh.`);
        mergedData = {};
    }
}

// Get all .json files in the directory
const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.json'));

for (const file of files) {
    const filePath = path.join(inputDir, file);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Expecting a top-level object — take its first key and value
        const keys = Object.keys(data);
        if (keys.length > 0) {
            const key = keys[0];
            mergedData[key] = data[key];
            console.log(`✅ Added "${key}" from ${file}`);
        } else {
            console.warn(`⚠️ Skipping ${file} — no top-level keys.`);
        }
    } catch (err) {
        console.error(`❌ Error reading ${file}:`, err.message);
    }
}

// Write back to output.json
fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2), 'utf8');
console.log(`✨ Done! Merged ${files.length} file(s) into ${outputFile}`);
