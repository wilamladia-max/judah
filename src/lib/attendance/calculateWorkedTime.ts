/**
 * lib/attendance/calculateWorkedTime.ts
 * ─────────────────────────────────────────────────────────────
 * Pure utility functions for worked-time computation.
 * No side effects — safe to unit test independently.
 *
 * FUTURE: Add overtime threshold (e.g. >8 hrs = overtime).
 * FUTURE: Add late computation (vs expected shift start).
 * FUTURE: Subtract break time when break tracking is added.
 */

// ── Format a Date to "YYYY-MM-DD" ─────────────────────────────
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ── Format a Date to "hh:mm AM/PM" ───────────────────────────
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Format a Date to readable date string ─────────────────────
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Format "YYYY-MM-DD" to short readable form ─────────────────
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Core: compute worked duration between two ISO timestamps ───
export function calculateWorkedTime(clockIn: string, clockOut: string): {
  totalMinutes: number;
  totalHours: number;    // decimal, e.g. 8.5
  renderedHours: number; // whole hours, e.g. 8
  renderedMinutes: number; // remainder minutes, e.g. 30
} {
  const inTime  = new Date(clockIn).getTime();
  const outTime = new Date(clockOut).getTime();
  const diffMs  = outTime - inTime;

  if (diffMs <= 0) {
    return { totalMinutes: 0, totalHours: 0, renderedHours: 0, renderedMinutes: 0 };
  }

  const totalMinutes   = Math.floor(diffMs / 60000);
  const totalHours     = parseFloat((totalMinutes / 60).toFixed(2));
  const renderedHours  = Math.floor(totalMinutes / 60);
  const renderedMinutes = totalMinutes % 60;

  return { totalMinutes, totalHours, renderedHours, renderedMinutes };
}

// ── Format rendered hours + minutes as a readable string ──────
export function formatDuration(hours: number, minutes: number): string {
  const h = hours > 0 ? `${hours}h` : "";
  const m = minutes > 0 ? `${minutes}m` : "";
  return [h, m].filter(Boolean).join(" ") || "0m";
}
