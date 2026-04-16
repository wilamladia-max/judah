/**
 * lib/attendance/attendanceStore.ts
 * ─────────────────────────────────────────────────────────────
 * Persistence layer for attendance records using localStorage.
 *
 * FUTURE: Replace with API calls to a real backend:
 *   POST /api/attendance/clockin
 *   PATCH /api/attendance/clockout/:id
 *   GET  /api/attendance/:employeeId
 *
 * All functions are pure and testable — they receive/return plain objects.
 */

import type { AttendanceRecord } from "@/types/attendance";
import { toDateString } from "./calculateWorkedTime";

const STORE_KEY = "payrollph_attendance";

// ── Read all records from localStorage ────────────────────────
export function getAllRecords(): AttendanceRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as AttendanceRecord[]) : [];
  } catch {
    return [];
  }
}

// ── Write all records back to localStorage ─────────────────────
function saveAllRecords(records: AttendanceRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(records));
}

// ── Get all records for a specific employee ────────────────────
export function getEmployeeRecords(employeeId: string): AttendanceRecord[] {
  return getAllRecords().filter((r) => r.employeeId === employeeId);
}

// ── Get a specific employee's record for today ─────────────────
export function getTodayRecord(employeeId: string): AttendanceRecord | null {
  const today = toDateString(new Date());
  return (
    getEmployeeRecords(employeeId).find((r) => r.date === today) ?? null
  );
}

// ── Clock In: create a new attendance record ───────────────────
export function clockIn(params: {
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
}): { success: boolean; record?: AttendanceRecord; error?: string } {
  const existing = getTodayRecord(params.employeeId);

  if (existing) {
    return {
      success: false,
      error: "You have already clocked in for today.",
    };
  }

  const now = new Date();
  const record: AttendanceRecord = {
    id: `${params.employeeId}-${toDateString(now)}`,
    employeeId: params.employeeId,
    employeeName: params.employeeName,
    employeeNumber: params.employeeNumber,
    date: toDateString(now),
    clockIn: now.toISOString(),
    clockOut: null,
    totalMinutesWorked: null,
    totalHoursWorked: null,
    renderedHours: null,
    renderedMinutes: null,
    status: "Clocked In",
  };

  const all = getAllRecords();
  saveAllRecords([...all, record]);
  return { success: true, record };
}

// ── Clock Out: update today's record with time out + duration ──
export function clockOut(
  employeeId: string,
  calculateFn: (clockIn: string, clockOut: string) => {
    totalMinutes: number;
    totalHours: number;
    renderedHours: number;
    renderedMinutes: number;
  }
): { success: boolean; record?: AttendanceRecord; error?: string } {
  const all = getAllRecords();
  const today = toDateString(new Date());
  const idx = all.findIndex(
    (r) => r.employeeId === employeeId && r.date === today
  );

  if (idx === -1) {
    return { success: false, error: "No clock-in record found for today." };
  }

  const existing = all[idx];

  if (existing.clockOut) {
    return { success: false, error: "You have already clocked out for today." };
  }

  const now = new Date();
  const duration = calculateFn(existing.clockIn, now.toISOString());

  if (duration.totalMinutes <= 0) {
    return {
      success: false,
      error: "Clock-out time cannot be earlier than clock-in time.",
    };
  }

  const updated: AttendanceRecord = {
    ...existing,
    clockOut: now.toISOString(),
    totalMinutesWorked: duration.totalMinutes,
    totalHoursWorked: duration.totalHours,
    renderedHours: duration.renderedHours,
    renderedMinutes: duration.renderedMinutes,
    status: "Completed",
  };

  all[idx] = updated;
  saveAllRecords(all);
  return { success: true, record: updated };
}
