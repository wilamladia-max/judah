/**
 * lib/payroll/cutoffHelpers.ts
 * ─────────────────────────────────────────────────────────────
 * Date helpers for payroll cutoff logic.
 * FUTURE: Add holiday calendar integration.
 */

import type { PayrollCutoff } from "@/types/attendance";

/** Returns the current active cutoff period based on today's date */
export function getCurrentCutoff(): PayrollCutoff {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth() + 1;
  const day   = today.getDate();
  const monthStr = String(month).padStart(2, "0");

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const monthName = monthNames[month - 1];
  const lastDay   = new Date(year, month, 0).getDate();

  if (day <= 15) {
    return {
      period:    "1st",
      year,
      month,
      startDate: `${year}-${monthStr}-01`,
      endDate:   `${year}-${monthStr}-15`,
      label:     `${monthName} 1–15, ${year}`,
    };
  } else {
    const endDay = String(lastDay).padStart(2, "0");
    return {
      period:    "2nd",
      year,
      month,
      startDate: `${year}-${monthStr}-16`,
      endDate:   `${year}-${monthStr}-${endDay}`,
      label:     `${monthName} 16–${lastDay}, ${year}`,
    };
  }
}

/** Check if a "YYYY-MM-DD" date falls within a given cutoff */
export function isInCutoff(dateStr: string, cutoff: PayrollCutoff): boolean {
  return dateStr >= cutoff.startDate && dateStr <= cutoff.endDate;
}
