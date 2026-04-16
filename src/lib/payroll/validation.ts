/**
 * lib/payroll/validation.ts
 * ─────────────────────────────────────────────────────────────
 * Centralized validation for payroll form input.
 * Returns a map of field → error message.
 * Empty object means no errors.
 *
 * FUTURE: Add min/max day rules, rate caps, etc.
 */

import type { PayrollInput } from "./types";

type ValidationErrors = Partial<Record<keyof PayrollInput, string>>;

// Numeric fields that must be >= 0
const NUMERIC_FIELDS: Array<[keyof PayrollInput, string]> = [
  ["daysWorked",         "Days worked"],
  ["dailyRate",          "Daily rate"],
  ["otherDeductions",    "Other deductions"],
  ["sssEmployee",        "SSS employee share"],
  ["sssEmployer",        "SSS employer share"],
  ["pagibigEmployee",    "Pag-IBIG employee share"],
  ["pagibigEmployer",    "Pag-IBIG employer share"],
  ["philhealthEmployee", "PhilHealth employee share"],
  ["philhealthEmployer", "PhilHealth employer share"],
];

export function validateInput(input: PayrollInput): ValidationErrors {
  const errors: ValidationErrors = {};

  // Required text fields
  if (!input.employeeName.trim())   errors.employeeName   = "Employee name is required.";
  if (!input.employeeNumber.trim()) errors.employeeNumber = "Employee number is required.";
  if (!input.payrollPeriod.trim())  errors.payrollPeriod  = "Payroll period is required.";

  // Numeric non-negative fields
  for (const [field, label] of NUMERIC_FIELDS) {
    const raw = input[field];
    const val = parseFloat(raw as string);
    if (raw !== "" && (isNaN(val) || val < 0)) {
      errors[field] = `${label} cannot be negative.`;
    }
  }

  return errors;
}
