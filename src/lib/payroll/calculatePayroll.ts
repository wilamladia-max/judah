/**
 * lib/payroll/calculatePayroll.ts
 * ─────────────────────────────────────────────────────────────
 * Core salary computation. Pure function – no side effects.
 *
 * Computation rules (v1):
 *   Gross Salary                  = daysWorked × dailyRate
 *   Total Employee Gov Deductions = SSS + Pag-IBIG + PhilHealth (employee shares)
 *   Total Employee Deductions     = Total Gov Deductions + otherDeductions
 *   Net Salary                    = Gross Salary - Total Employee Deductions
 *
 * NOTE: Employer shares are included in the payslip for transparency
 *       but are NOT deducted from the employee's net salary.
 *
 * FUTURE: Add parameters for overtime, leave, bonuses, tax withholding.
 */

import type { PayrollInput, PayrollSummary } from "./types";
import { calculateGovernmentBenefits } from "./calculateGovernmentBenefits";

export function calculatePayroll(input: PayrollInput): PayrollSummary {
  const daysWorked     = parseFloat(input.daysWorked) || 0;
  const dailyRate      = parseFloat(input.dailyRate) || 0;
  const otherDeductions = parseFloat(input.otherDeductions) || 0;

  // ── Step 1: Gross salary ──────────────────────────────────
  const grossSalary = daysWorked * dailyRate;

  // ── Step 2: Government benefits ──────────────────────────
  // Isolated in its own module so the logic can be swapped to
  // table-based / Excel-based computation without touching this file.
  const govBenefits = calculateGovernmentBenefits(input);

  // ── Step 3: Employee-side deductions only ─────────────────
  const totalEmployeeGovDeductions =
    govBenefits.sss.employee +
    govBenefits.pagibig.employee +
    govBenefits.philhealth.employee;

  const totalEmployeeDeductions = totalEmployeeGovDeductions + otherDeductions;

  // ── Step 4: Net salary ────────────────────────────────────
  const netSalary = grossSalary - totalEmployeeDeductions;

  return {
    grossSalary,
    govBenefits,
    otherDeductions,
    totalEmployeeGovDeductions,
    totalEmployeeDeductions,
    netSalary,
  };
}
