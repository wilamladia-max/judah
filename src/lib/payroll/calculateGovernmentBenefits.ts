/**
 * lib/payroll/calculateGovernmentBenefits.ts
 * ─────────────────────────────────────────────────────────────
 * Isolated government benefit computation module.
 *
 * v1  → passes through manually entered values from the form.
 * v2  → replace the function body with table lookups:
 *          lookupSSS(grossSalary, SSSContributionTable)
 *          lookupPhilHealth(grossSalary)
 *          lookupPagIBIG(grossSalary)
 * v3  → parse an uploaded Excel file via excelContributionParser
 *        and pass the resulting table to the lookup functions.
 *
 * ⚠️  Do NOT add UI logic here. Keep this a pure utility.
 */

import type { PayrollInput, GovernmentBenefits } from "./types";

// ── FUTURE: import lookup helpers ──────────────────────────────
// import { lookupContribution } from "./tables/governmentContributionTable";
// import { parsedSSSTable }      from "./tables/governmentContributionTable";

export function calculateGovernmentBenefits(input: PayrollInput): GovernmentBenefits {
  /**
   * ── FUTURE HOOK (v2) ──────────────────────────────────────
   * const gross = parseFloat(input.daysWorked) * parseFloat(input.dailyRate);
   *
   * const sss       = lookupContribution(gross, parsedSSSTable);
   * const pagibig   = lookupContribution(gross, parsedPagIBIGTable);
   * const philhealth = lookupContribution(gross, parsedPhilHealthTable);
   *
   * return { sss, pagibig, philhealth };
   * ─────────────────────────────────────────────────────────
   *
   * For v1, we return the raw manually entered values.
   */
  return {
    sss: {
      employee: parseFloat(input.sssEmployee) || 0,
      employer: parseFloat(input.sssEmployer) || 0,
    },
    pagibig: {
      employee: parseFloat(input.pagibigEmployee) || 0,
      employer: parseFloat(input.pagibigEmployer) || 0,
    },
    philhealth: {
      employee: parseFloat(input.philhealthEmployee) || 0,
      employer: parseFloat(input.philhealthEmployer) || 0,
    },
  };
}
