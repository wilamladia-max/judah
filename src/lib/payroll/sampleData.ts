/**
 * lib/payroll/sampleData.ts
 * ─────────────────────────────────────────────────────────────
 * Pre-filled sample input for development / demo purposes.
 * Remove or replace in production.
 */

import type { PayrollInput } from "./types";

export const SAMPLE_PAYROLL_INPUT: PayrollInput = {
  payrollPeriod:       "April 1–15, 2026",
  employeeName:        "Juan Dela Cruz",
  employeeNumber:      "EMP-001",
  daysWorked:          "12",
  dailyRate:           "800",
  otherDeductions:     "500",
  sssEmployee:         "300",
  sssEmployer:         "600",
  pagibigEmployee:     "100",
  pagibigEmployer:     "100",
  philhealthEmployee:  "200",
  philhealthEmployer:  "200",
};

/**
 * Expected output for SAMPLE_PAYROLL_INPUT:
 *   Gross Salary                  = 12 × 800  = 9,600.00
 *   Total Employee Gov Deductions = 300+100+200 = 600.00
 *   Total Employee Deductions     = 600 + 500  = 1,100.00
 *   Net Salary                    = 9,600 - 1,100 = 8,500.00
 */
