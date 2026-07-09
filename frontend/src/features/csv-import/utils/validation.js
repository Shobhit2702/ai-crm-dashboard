import Papa from "papaparse";

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Normalizes row object keys to lowercase to handle casing discrepancies (e.g. Name vs name)
 */
export function normalizeRow(row) {
  const normalized = {};
  Object.keys(row).forEach((key) => {
    const normalizedKey = key.trim().toLowerCase();
    normalized[normalizedKey] = row[key] ? String(row[key]).trim() : "";
  });
  return {
    name: normalized.name || row.Name || row.name || "",
    email: normalized.email || row.Email || row.email || "",
    company: normalized.company || row.Company || row.company || "",
    location: normalized.location || row.Location || row.location || "",
  };
}

/**
 * Validates a single customer record row.
 * Returns the normalized row along with validity status and specific field errors.
 */
export function validateRow(rawRow) {
  const normalized = normalizeRow(rawRow);
  const errors = {};
  
  // Validate Name
  if (!normalized.name) {
    errors.name = "Name is required";
  }

  // Validate Email
  if (!normalized.email) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(normalized.email)) {
    errors.email = "Invalid email format";
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    ...normalized,
    isValid,
    errors,
    raw: rawRow, // Keep reference to raw row if needed
  };
}

/**
 * Validates a batch of rows parsed from a CSV.
 */
export function validateBatch(rows) {
  const validatedRows = rows.map((row, index) => {
    const validated = validateRow(row);
    return {
      ...validated,
      index, // 0-indexed position in file
    };
  });

  const validRows = validatedRows.filter((r) => r.isValid);
  const invalidRows = validatedRows.filter((r) => !r.isValid);

  return {
    validatedRows,
    validRows,
    invalidRows,
    totalCount: validatedRows.length,
    validCount: validRows.length,
    invalidCount: invalidRows.length,
  };
}

/**
 * Generates and triggers the download of a CSV file containing invalid rows with reasons.
 */
export function downloadErrorReport(invalidRows, fileName = "customers") {
  if (!invalidRows || invalidRows.length === 0) return;

  const errorData = invalidRows.map((row) => {
    const errorReasons = [];
    if (row.errors.name) errorReasons.push(row.errors.name);
    if (row.errors.email) errorReasons.push(row.errors.email);

    return {
      "Row Number": row.index + 2, // 1-based index + header row
      "Name": row.name || "(Empty)",
      "Email": row.email || "(Empty)",
      "Company": row.company || "",
      "Location": row.location || "",
      "Error Details": errorReasons.join("; "),
    };
  });

  const csv = Papa.unparse(errorData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${fileName.replace(".csv", "")}_error_report.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
