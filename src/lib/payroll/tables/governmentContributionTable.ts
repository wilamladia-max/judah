/**
 * lib/payroll/tables/governmentContributionTable.ts
 * ─────────────────────────────────────────────────────────────
 * PLACEHOLDER – v1 does not use this table for computation.
 *
 * FUTURE (v2): Hardcode or import the SSS / Pag-IBIG / PhilHealth
 * contribution tables here, then wire them into
 * calculateGovernmentBenefits.ts via lookupContribution().
 *
 * The tables below are mocked/sample values only.
 * Replace with official DOLE-published rates before going live.
 */

import type { ContributionTableRow } from "../types";

/**
 * Looks up the applicable contribution bracket for a given gross salary.
 * Uses the first row where grossSalary <= maxSalary.
 *
 * @param grossSalary - Employee's gross salary for the period
 * @param table       - Sorted contribution table (ascending minSalary)
 */
export function lookupContribution(
  grossSalary: number,
  table: ContributionTableRow[]
): { employee: number; employer: number } {
  const row = table.find(
    (r) => grossSalary >= r.minSalary && grossSalary <= r.maxSalary
  ) ?? table[table.length - 1]; // fallback to highest bracket

  return {
    employee: row.employeeShare,
    employer: row.employerShare,
  };
}

// ── MOCK SSS Table (sample only – NOT official rates) ─────────
// FUTURE: Replace with the current official SSS contribution schedule.
export const MOCK_SSS_TABLE: ContributionTableRow[] = [
  { minSalary: 0,      maxSalary: 4249,  employeeShare: 180,  employerShare: 380  },
  { minSalary: 4250,   maxSalary: 4749,  employeeShare: 202.5, employerShare: 427.5 },
  { minSalary: 4750,   maxSalary: 5249,  employeeShare: 225,  employerShare: 475  },
  { minSalary: 5250,   maxSalary: 5749,  employeeShare: 247.5, employerShare: 522.5 },
  { minSalary: 5750,   maxSalary: 9999,  employeeShare: 300,  employerShare: 600  },
  { minSalary: 10000,  maxSalary: 19999, employeeShare: 450,  employerShare: 900  },
  { minSalary: 20000,  maxSalary: 99999, employeeShare: 900,  employerShare: 1800 },
];

// ── MOCK PhilHealth Table (sample only – NOT official rates) ───
// FUTURE: Replace with the current official PhilHealth premium schedule.
export const MOCK_PHILHEALTH_TABLE: ContributionTableRow[] = [
  { minSalary: 0,     maxSalary: 10000, employeeShare: 200, employerShare: 200 },
  { minSalary: 10001, maxSalary: 99999, employeeShare: 400, employerShare: 400 },
];

// ── MOCK Pag-IBIG Table (sample only – NOT official rates) ─────
// FUTURE: Replace with the current official Pag-IBIG contribution schedule.
export const MOCK_PAGIBIG_TABLE: ContributionTableRow[] = [
  { minSalary: 0,     maxSalary: 1500,  employeeShare: 30,  employerShare: 30  },
  { minSalary: 1501,  maxSalary: 99999, employeeShare: 100, employerShare: 100 },
];
