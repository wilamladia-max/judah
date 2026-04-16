/**
 * lib/payroll/parsers/excelContributionParser.ts
 * ─────────────────────────────────────────────────────────────
 * PLACEHOLDER – v1 does not implement this module.
 *
 * FUTURE (v3): Parse an uploaded .xlsx contribution table file
 * and return a structured ContributionTableRow[] that can be
 * passed directly to the government benefit calculation functions.
 *
 * Suggested library: xlsx (SheetJS)
 *   npm install xlsx
 *
 * Example usage (future):
 *   const file   = event.target.files[0];
 *   const table  = await parseExcelContributionTable(file, "SSS");
 *   const result = lookupContribution(grossSalary, table);
 */

import type { ContributionTableRow } from "../types";

export type ContributionType = "SSS" | "PAGIBIG" | "PHILHEALTH";

/**
 * Parses an uploaded Excel file and extracts the contribution table
 * for the specified benefit type.
 *
 * @param file   - The uploaded .xlsx File object
 * @param type   - Which benefit table to parse
 * @returns      - Parsed contribution rows sorted by minSalary
 */
export async function parseExcelContributionTable(
  file: File,                    // eslint-disable-line @typescript-eslint/no-unused-vars
  type: ContributionType         // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<ContributionTableRow[]> {
  // TODO (v3):
  //   1. Use SheetJS to read the uploaded file buffer
  //   2. Locate the correct sheet by name or index
  //   3. Map rows to ContributionTableRow[]
  //   4. Sort by minSalary ascending
  //   5. Return the parsed table
  throw new Error("parseExcelContributionTable is not yet implemented. Coming in v3.");
}
