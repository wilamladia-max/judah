/**
 * lib/payroll/buildPayrollFromAttendance.ts
 * ─────────────────────────────────────────────────────────────
 * Bridge module: converts an AttendanceCutoffSummary into a
 * PayrollSummaryInput that can pre-fill the payroll form.
 *
 * FUTURE: Auto-submit to payroll computation (skip manual form).
 * FUTURE: Allow admin overrides (manual day adjustments).
 * FUTURE: Factor in overtime, leave, and holiday pay.
 */

import type { AttendanceCutoffSummary, PayrollSummaryInput } from "@/types/attendance";

/**
 * Converts a payroll cutoff attendance summary into the input shape
 * expected by the payroll computation module.
 *
 * @param summary  - Grouped attendance data for one cutoff period
 * @returns        - PayrollSummaryInput ready for payroll form pre-fill
 */
export function buildPayrollFromAttendance(
  summary: AttendanceCutoffSummary
): PayrollSummaryInput {
  return {
    employeeId:      summary.employeeId,
    employeeName:    summary.employeeName,
    employeeNumber:  summary.employeeNumber,
    payrollPeriod:   summary.cutoff.label,
    daysWorked:      summary.totalDaysWorked,
    totalHoursWorked: summary.totalHoursWorked,
    cutoff:          summary.cutoff,
    attendanceSummary: summary,
  };
}
