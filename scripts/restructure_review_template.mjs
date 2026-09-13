import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath = "/Users/yuliiazhmaieva/WebstormProjects/Language/outputs/clean_review_template/Concurrences_Gate2_Expert_Review_Template_Clean.xlsx";
const outputDir = "/Users/yuliiazhmaieva/WebstormProjects/Language/outputs/restructured_review_template";
const outputPath = `${outputDir}/Concurrences_Gate2_Expert_Review_Template_Restructured.xlsx`;

const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
await fs.mkdir(outputDir, { recursive: true });

const noteTemplate = workbook.worksheets.getItem("Q28");
const claimTemplate = workbook.worksheets.getItem("Q12");
const questionSheets = workbook.worksheets.items.filter((sheet) => /^Q\d+$/.test(sheet.name));

const colors = {
  section: "#D9EAF7",
  tableHeader: "#1F4E78",
  input: "#FFF2CC",
  border: "#D9E2F3",
  text: "#1F1F1F",
};

function styleRange(range, { fill, bold = false, fontColor = colors.text, horizontalAlignment, wrapText = false } = {}) {
  if (fill) range.format.fill = fill;
  range.format.font = { bold, color: fontColor };
  range.format.wrapText = wrapText;
  if (horizontalAlignment) range.format.horizontalAlignment = horizontalAlignment;
  range.format.borders = { preset: "all", style: "thin", color: colors.border };
}

// All question sheets use one consistent layout: notes, then claims, then retrieval.
function buildQuestionLayout(sheet) {
  sheet.getRange("A11:J180").unmerge();
  sheet.getRange("A11:J180").clear({ applyTo: "all" });
  sheet.getRange("A1:J180").dataValidation.clear();

  const notesHeading = sheet.getRange("A11:J11");
  notesHeading.merge();
  notesHeading.values = [["Notes"]];
  styleRange(notesHeading, { fill: colors.section, bold: true });

  sheet.getRange("A12:H12").values = [["Run ID", "", "Run date", "", "Model / prompt version", "", "Corpus snapshot", ""]];
  styleRange(sheet.getRange("A12:H12"), { wrapText: true });
  sheet.getRange("B12").format.fill = colors.input;
  sheet.getRange("D12").format.fill = colors.input;
  sheet.getRange("F12").format.fill = colors.input;
  sheet.getRange("H12").format.fill = colors.input;

  styleRange(sheet.getRange("A13:J13"), { fill: colors.input, wrapText: true });
  sheet.getRange("A13:J13").merge();
  sheet.getRange("A13").format.rowHeight = 44;

  const claimHeading = sheet.getRange("A14:J14");
  claimHeading.merge();
  claimHeading.values = [["Claim-by-claim review"]];
  styleRange(claimHeading, { fill: colors.section, bold: true });

  sheet.getRange("A15:F15").values = [["Claim ID", "Claim from answer", "Cited document", "Expert verdict", "Cited passage", "Required fix / comment"]];
  styleRange(sheet.getRange("A15:F15"), { fill: colors.tableHeader, bold: true, fontColor: "#FFFFFF", horizontalAlignment: "center", wrapText: true });
  styleRange(sheet.getRange("A16:F35"), { wrapText: true });
  sheet.getRange("A16:A35").values = Array.from({ length: 20 }, (_, index) => [index + 1]);
  sheet.getRange("D16:D35").format.fill = colors.input;
  sheet.getRange("F16:F35").format.fill = colors.input;
  sheet.getRange("D16:D35").dataValidation = { rule: { type: "list", values: ["Supports claim", "Partially supports claim", "Does not support claim", "Wrong source", "Missing citation", "Not a legal claim"] } };

  const retrievalHeading = sheet.getRange("A37:J37");
  retrievalHeading.merge();
  retrievalHeading.values = [["Retrieval set review (full ranked list)"]];
  styleRange(retrievalHeading, { fill: colors.section, bold: true });

  sheet.getRange("A38:J38").values = [["Rank", "Title", "Document name", "Document class", "Issued by", "Jurisdiction", "Cited in answer", "Required source?", "Expert verdict", "Notes"]];
  styleRange(sheet.getRange("A38:J38"), { fill: colors.tableHeader, bold: true, fontColor: "#FFFFFF", horizontalAlignment: "center", wrapText: true });
  styleRange(sheet.getRange("A39:J138"), { wrapText: true });
  sheet.getRange("H39:J138").format.fill = colors.input;
  sheet.getRange("H39:H138").dataValidation = { rule: { type: "list", values: ["Yes", "No"] } };
  sheet.getRange("I39:I138").dataValidation = { rule: { type: "list", values: ["Supports claim", "Partially supports claim", "Does not support claim", "Wrong source", "Missing citation", "Not a legal claim"] } };

  const finalHeading = sheet.getRange("A141:B141");
  finalHeading.merge();
  finalHeading.values = [["Final expert verdict"]];
  styleRange(finalHeading, { fill: colors.section, bold: true });
  sheet.getRange("A142:B145").values = [["Reviewer", ""], ["Is the answer acceptable?", ""], ["Overall comment / required fixes", ""], ["Review completed?", ""]];
  styleRange(sheet.getRange("A142:B145"), { wrapText: true });
  sheet.getRange("B142:B145").format.fill = colors.input;
  sheet.getRange("B143").dataValidation = { rule: { type: "list", values: ["Acceptable", "Partly acceptable", "Not acceptable"] } };
  sheet.getRange("B145").dataValidation = { rule: { type: "list", values: ["Not started", "In review", "Completed", "Needs follow-up"] } };
  sheet.getRange("A144:B144").format.rowHeight = 42;
}

// Keep Q28 and Q12 intact as format sources until every other question tab is rebuilt.
for (const sheet of questionSheets) {
  if (sheet.name !== "Q28" && sheet.name !== "Q12") buildQuestionLayout(sheet);
}
buildQuestionLayout(noteTemplate);
buildQuestionLayout(claimTemplate);

// Remove the accidental duplicate tab after Q28 has been used as the Notes template.
workbook.worksheets.getItem("Invalid_Q28").delete();

const summary = workbook.worksheets.getItem("Scoring Summary");
for (let row = 5; row <= 56; row += 1) {
  const questionId = Math.trunc(summary.getRange(`A${row}`).values[0][0]);
  const q = `Q${String(questionId).padStart(2, "0")}`;
  summary.getRange(`B${row}:E${row}`).formulas = [[
    `=COUNTA('${q}'!B16:B35)`,
    `=COUNTIF('${q}'!D16:D35,"Supports claim")`,
    `=COUNTIF('${q}'!D16:D35,"Partially supports claim")`,
    `=COUNTIF('${q}'!D16:D35,"Does not support claim")`,
  ]];
}

const summaryCheck = await workbook.inspect({
  kind: "table",
  range: "Scoring Summary!A28:E33",
  include: "values,formulas",
  tableMaxRows: 6,
  tableMaxCols: 5,
});
console.log(summaryCheck.ndjson);

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan after restructuring",
});
console.log(errors.ndjson);

const preview = await workbook.render({
  sheetName: "Q01",
  range: "A1:J146",
  scale: 1,
  format: "png",
});
await fs.writeFile(`${outputDir}/q01-restructured.png`, new Uint8Array(await preview.arrayBuffer()));

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(JSON.stringify({ outputPath }));
