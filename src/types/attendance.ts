/**
 * types/attendance.ts
 * ─────────────────────────────────────────────────────────────
 * Core data models for attendance tracking and payroll preparation.
 *
 * FUTURE: Add break tracking (breakStart, breakEnd, totalBreakMinutes).
 * FUTURE: Add overtimeMinutes, lateMinutes, undertimeMinutes.
 * FUTURE: Add leave and holiday flags.
 */

// ── Attendance record status ────────────────────────────────────
export type AttendanceStatus =
  | "Clocked In"   // employee has timed in, not yet timed out
  | "Completed"    // employee has timed in AND out
  | "Absent";      // future: admin-marked

// ── One attendance record per employee per workday ─────────────
export interface AttendanceRecord {
  id: string;                // unique record id (e.g. "{employeeId}-{date}")
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  date: string;              // "YYYY-MM-DD"
  clockIn: string;           // ISO timestamp
  clockOut: string | null;   // ISO timestamp (null until clocked out)
  totalMinutesWorked: number | null;
  totalHoursWorked: number | null;  // decimal hours (e.g. 8.5)
  renderedHours: number | null;     // whole hours portion
  renderedMinutes: number | null;   // remaining minutes portion
  status: AttendanceStatus;
}

// ── Payroll cutoff period ───────────────────────────────────────
export type CutoffPeriod = "1st" | "2nd";

export interface PayrollCutoff {
  period: CutoffPeriod;
  year: number;
  month: number;             // 1–12
  startDate: string;         // "YYYY-MM-DD"
  endDate: string;           // "YYYY-MM-DD"
  label: string;             // e.g. "April 1–15, 2026"
}

// ── Attendance summary per cutoff (feeds into payroll) ──────────
export interface AttendanceCutoffSummary {
  cutoff: PayrollCutoff;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  records: AttendanceRecord[];
  totalDaysWorked: number;
  totalMinutesWorked: number;
  totalHoursWorked: number;  // decimal
}

// ── Payroll preparation input built from attendance ─────────────
// This is the bridge between attendance data and the payroll form.
export interface PayrollSummaryInput {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  payrollPeriod: string;
  daysWorked: number;
  totalHoursWorked: number;
  cutoff: PayrollCutoff;
  attendanceSummary: AttendanceCutoffSummary;
}
