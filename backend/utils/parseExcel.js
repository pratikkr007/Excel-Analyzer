import XLSX from "xlsx";

/**
 * parseExcel(filePath) -> returns { headers: [], data: [ {col: value} ], rows, cols }
 * fileBuffer or filePath both supported by using XLSX.read
 */
export function parseExcelFromBuffer(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
  const headers = extractHeaders(sheet);
  return {
    headers,
    data: json,
    rows: json.length,
    cols: headers.length
  };
}

function extractHeaders(sheet) {
  const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:A1");
  const headers = [];
  const firstRow = range.s.r;
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = { c: C, r: firstRow };
    const cellRef = XLSX.utils.encode_cell(cellAddress);
    const cell = sheet[cellRef];
    headers.push(cell ? String(cell.v) : `Column${C + 1}`);
  }
  return headers;
}
