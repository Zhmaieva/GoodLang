import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

async function inspectBook(path, label) {
  const blob = await FileBlob.load(path);
  const wb = await SpreadsheetFile.importXlsx(blob);
  console.log(`\n=== ${label} ===`);
  const sheets = await wb.inspect({ kind: "sheet", include: "id,name", maxChars: 10000 });
  console.log(sheets.ndjson);
  const overview = await wb.inspect({
    kind: "workbook,sheet,table",
    maxChars: 20000,
    tableMaxRows: 18,
    tableMaxCols: 12,
    tableMaxCellChars: 120,
  });
  console.log(overview.ndjson);
}

await inspectBook("/private/tmp/concurrences_review_merge/template.xlsx", "template");
await inspectBook("/private/tmp/concurrences_review_merge/source.xlsx", "source");
