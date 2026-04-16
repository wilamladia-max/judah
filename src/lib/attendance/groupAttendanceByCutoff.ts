/**
 * lib/attendance/groupAttendanceByCutoff.ts
 * ─────────────────────────────────────────────────────────────
 * Groups attendance records into payroll cutoff periods:
 *   1st cutoff: day 1–15 of a month
 *   2nd cutoff: day 16–end of month
 *
 * FUTURE: Support custom cutoff ranges defined by admin.
 * FUTURE: Handle holidays and non-working days.
 */

import type {
  AttendanceRecord,
  PayrollCutoff,
  AttendanceCutoffSummary,
  CutoffPeriod,
} from "@/types/attendance";

// ── Determine cutoff period for a date string "YYYY-MM-DD" ────
export function getCutoffPeriod(dateStr: string): CutoffPeriod {
  const day = parseInt(dateStr.split("-")[2], 10);
  return day <= 15 ? "1st" : "2nd";
}

// ── Build a PayrollCutoff descriptor for a given date ─────────
export function buildCutoff(dateStr: string): PayrollCutoff {
  const [yearStr, monthStr] = dateStr.split("-");
  const year  = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const period = getCutoffPeriod(dateStr);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const monthName = monthNames[month - 1];

  // Last day of the month
  const lastDay = new Date(year, month, 0).getDate();

  if (period === "1st") {
    return {
      period,
      year,
      month,
      startDate: `${yearStr}-${monthStr}-01`,
      endDate:   `${yearStr}-${monthStr}-15`,
      label: `${monthName} 1–15, ${year}`,
    };
  } else {
    const endDay = String(lastDay).padStart(2, "0");
    return {
      period,
      year,
      month,
      startDate: `${yearStr}-${monthStr}-16`,
      endDate:   `${yearStr}-${monthStr}-${endDay}`,
      label: `${monthName} 16–${lastDay}, ${year}`,
    };
  }
}

// ── Get the cutoff key for grouping: "2026-04-1st" ─────────────
function cutoffKey(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const period = getCutoffPeriod(dateStr);
  return `${year}-${month}-${period}`;
}

// ── Group records by cutoff and summarize per employee ─────────
export function groupAttendanceByCutoff(
  records: AttendanceRecord[]
): AttendanceCutoffSummary[] {
  const groups = new Map<string, AttendanceRecord[]>();

  for (const record of records) {
    const key = cutoffKey(record.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(record);
  }

  const summaries: AttendanceCutoffSummary[] = [];

  for (const [, groupRecords] of groups) {
    // All records in this group belong to the same employee (filtered upstream)
    const first = groupRecords[0];
    const cutoff = buildCutoff(first.date);

    const completedRecords = groupRecords.filter((r) => r.status === "Completed");
    const totalDaysWorked   = completedRecords.length;
    const totalMinutesWorked = completedRecords.reduce(
      (sum, r) => sum + (r.totalMinutesWorked ?? 0),
      0
    );
    const totalHoursWorked = parseFloat((totalMinutesWorked / 60).toFixed(2));

    summaries.push({
      cutoff,
      employeeId:     first.employeeId,
      employeeName:   first.employeeName,
      employeeNumber: first.employeeNumber,
      records:        groupRecords.sort((a, b) => a.date.localeCompare(b.date)),
      totalDaysWorked,
      totalMinutesWorked,
      totalHoursWorked,
    });
  }

  // Sort by cutoff start date descending (most recent first)
  return summaries.sort((a, b) =>
    b.cutoff.startDate.localeCompare(a.cutoff.startDate)
  );
}
