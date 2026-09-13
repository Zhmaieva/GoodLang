import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/yuliiazhmaieva/Downloads/EMPTY_Concurrences_Gate2_Expert_Review_Template.xlsx";
const outputDir = "/Users/yuliiazhmaieva/WebstormProjects/Language/outputs/clean_review_template";
const outputPath = `${outputDir}/Concurrences_Gate2_Expert_Review_Template_Clean.xlsx`;

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);

const overview = await workbook.inspect({
  kind: "workbook,sheet,table",
  maxChars: 5000,
  tableMaxRows: 5,
  tableMaxCols: 8,
  tableMaxCellChars: 80,
});
console.log(overview.ndjson);

const before = await workbook.render({
  sheetName: "Q01",
  range: "A1:J145",
  scale: 1,
  format: "png",
});
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(`${outputDir}/before-q01.png`, new Uint8Array(await before.arrayBuffer()));

function findCell(values, predicate) {
  for (let r = 0; r < values.length; r += 1) {
    for (let c = 0; c < values[r].length; c += 1) {
      if (predicate(values[r][c])) return { row: r, col: c };
    }
  }
  return null;
}

function isNumeric(value) {
  return typeof value === "number" && Number.isFinite(value);
}

const cleared = [];

for (const sheet of workbook.worksheets.items) {
  if (!/^Q\d+$/.test(sheet.name)) continue;

  const usedRange = sheet.getUsedRange();
  const values = usedRange.values;
  const rowCount = values.length;
  const colCount = values[0]?.length ?? 1;
  const clearRange = (rowStart, colStart, rows, cols) => {
    if (rows > 0 && cols > 0) {
      sheet.getRangeByIndexes(rowStart, colStart, rows, cols).clear({ applyTo: "contents" });
    }
  };

  const generatedAnswer = findCell(values, (value) => String(value ?? "").trim() === "Generated answer");
  if (generatedAnswer && generatedAnswer.row + 1 < rowCount) {
    clearRange(generatedAnswer.row + 1, generatedAnswer.col, 1, colCount - generatedAnswer.col);
  }

  const runId = findCell(values, (value) => String(value ?? "").trim() === "Run ID");
  if (runId) {
    const nextRow = runId.row + 1;
    if (nextRow < rowCount) clearRange(nextRow, 0, 1, colCount);
  }

  for (const label of ["Run ID", "Run date", "Model / prompt version", "Corpus snapshot"]) {
    const meta = findCell(values, (value) => String(value ?? "").trim() === label);
    if (meta && meta.col + 1 < colCount) clearRange(meta.row, meta.col + 1, 1, 1);
  }

  const rankHeader = findCell(values, (value) => String(value ?? "").trim() === "Rank");
  if (rankHeader) {
    let end = rankHeader.row + 1;
    while (end < rowCount && isNumeric(values[end][rankHeader.col])) end += 1;
    clearRange(rankHeader.row + 1, 0, end - rankHeader.row - 1, colCount);
  }

  const claimHeader = findCell(values, (value) => String(value ?? "").trim() === "Claim ID");
  if (claimHeader) {
    let end = claimHeader.row + 1;
    while (end < rowCount && isNumeric(values[end][claimHeader.col])) end += 1;
    clearRange(claimHeader.row + 1, claimHeader.col, end - claimHeader.row - 1, colCount - claimHeader.col);
  }

  const finalVerdict = findCell(values, (value) => String(value ?? "").trim() === "Final expert verdict");
  if (finalVerdict) {
    let end = finalVerdict.row + 1;
    while (end < rowCount && values[end].some((value) => value !== null && value !== undefined && String(value).trim() !== "")) end += 1;
    clearRange(finalVerdict.row + 1, finalVerdict.col + 1, end - finalVerdict.row - 1, colCount - finalVerdict.col - 1);
  }

  cleared.push(sheet.name);
}

const reviewStatus = workbook.worksheets.getItem("Review Status");
if (reviewStatus) {
  const reviewRange = reviewStatus.getUsedRange();
  const reviewRows = reviewRange.values.length;
  if (reviewRows > 3) {
    reviewStatus.getRangeByIndexes(3, 4, reviewRows - 3, 5).clear({ applyTo: "contents" });
  }
}

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan after cleanup",
});
console.log(errors.ndjson);

const after = await workbook.render({
  sheetName: "Q01",
  range: "A1:J145",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${outputDir}/after-q01.png`, new Uint8Array(await after.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath, clearedTabs: cleared.length, cleared }));
