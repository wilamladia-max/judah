/**
 * app/employee/dashboard/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Employee attendance dashboard.
 * Orchestrates: session check → clock in/out → history display.
 *
 * State lives here; all child components are purely presentational.
 *
 * FUTURE: Replace localStorage with API calls.
 * FUTURE: Add leave application button.
 * FUTURE: Add overtime declaration.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession } from "@/lib/auth/employeeAuth";
import {
  clockIn,
  clockOut,
  getEmployeeRecords,
  getTodayRecord,
} from "@/lib/attendance/attendanceStore";
import { calculateWorkedTime } from "@/lib/attendance/calculateWorkedTime";
import { groupAttendanceByCutoff } from "@/lib/attendance/groupAttendanceByCutoff";
import { getCurrentCutoff } from "@/lib/payroll/cutoffHelpers";
import { TodayCard } from "@/components/attendance/TodayCard";
import { AttendanceHistoryTable } from "@/components/attendance/AttendanceHistoryTable";
import { CutoffSummaryCard } from "@/components/attendance/CutoffSummaryCard";
import type { AttendanceRecord, AttendanceCutoffSummary } from "@/types/attendance";
import type { EmployeeSession } from "@/types/employee";

export default function DashboardPage() {
  const router = useRouter();

  const [session, setSession]           = useState<EmployeeSession | null>(null);
  const [todayRecord, setTodayRecord]   = useState<AttendanceRecord | null>(null);
  const [cutoffSummaries, setCutoffSummaries] = useState<AttendanceCutoffSummary[]>([]);
  const [currentCutoffSummary, setCurrentCutoffSummary] = useState<AttendanceCutoffSummary | null>(null);
  const [loading, setLoading]           = useState(false);
  const [toast, setToast]               = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // ── Load session and records ─────────────────────────────────
  const refreshData = useCallback((employeeId: string) => {
    const today   = getTodayRecord(employeeId);
    const records = getEmployeeRecords(employeeId);
    const summaries = groupAttendanceByCutoff(records);
    const currentCutoff = getCurrentCutoff();

    const currentSummary = summaries.find(
      (s) => s.cutoff.startDate === currentCutoff.startDate
    ) ?? null;

    setTodayRecord(today);
    setCutoffSummaries(summaries);
    setCurrentCutoffSummary(currentSummary);
  }, []);

  useEffect(() => {
    const sess = getSession();
    if (!sess) {
      router.push("/employee/login");
      return;
    }
    setSession(sess);
    refreshData(sess.employeeId);
  }, [router, refreshData]);

  // ── Toast helper ─────────────────────────────────────────────
  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Clock In handler ─────────────────────────────────────────
  const handleClockIn = () => {
    if (!session) return;
    setLoading(true);
    setTimeout(() => {
      const result = clockIn({
        employeeId:     session.employeeId,
        employeeName:   session.employeeName,
        employeeNumber: session.employeeNumber,
      });
      if (result.success) {
        showToast("Clocked in successfully!", "success");
        refreshData(session.employeeId);
      } else {
        showToast(result.error ?? "Clock-in failed.", "error");
      }
      setLoading(false);
    }, 300);
  };

  // ── Clock Out handler ────────────────────────────────────────
  const handleClockOut = () => {
    if (!session) return;
    setLoading(true);
    setTimeout(() => {
      const result = clockOut(session.employeeId, calculateWorkedTime);
      if (result.success) {
        showToast("Clocked out successfully! Great work today.", "success");
        refreshData(session.employeeId);
      } else {
        showToast(result.error ?? "Clock-out failed.", "error");
      }
      setLoading(false);
    }, 300);
  };

  // ── Logout handler ───────────────────────────────────────────
  const handleLogout = () => {
    clearSession();
    router.push("/employee/login");
  };

  if (!session) return null; // Redirecting…

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f9f2e7 0%, #f0e4cc 100%)",
      padding: "1.5rem 1rem 4rem",
      fontFamily: "'DM Mono', monospace",
    }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Top bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "linear-gradient(135deg, #b5813a, #7a4a10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: "1rem",
              fontFamily: "'Playfair Display', serif",
            }}>P</div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2c1a08", fontFamily: "'Playfair Display', serif" }}>
                PayrollPH
              </div>
              <div style={{ fontSize: "0.62rem", color: "#b5813a", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Attendance Portal
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.45rem 1rem",
              border: "1.5px solid #ddd3c3",
              borderRadius: 7,
              background: "transparent",
              color: "#8a7560",
              fontSize: "0.75rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Employee greeting */}
        <div style={{
          background: "#fff",
          borderRadius: 14,
          padding: "1.2rem 1.6rem",
          marginBottom: "1.2rem",
          border: "1px solid #ecdfc9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}>
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b5813a" }}>
              Welcome back
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2c1a08", marginTop: 2, fontFamily: "'Playfair Display', serif" }}>
              {session.employeeName}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.65rem", color: "#b0a090" }}>Employee No.</div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#8a5e28" }}>
              {session.employeeNumber}
            </div>
          </div>
        </div>

        {/* Toast notification */}
        {toast && (
          <div style={{
            padding: "0.8rem 1rem",
            borderRadius: 10,
            marginBottom: "1rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            fontFamily: "'DM Mono', monospace",
            background: toast.type === "success" ? "#e8f5e9" : "#fdecea",
            border: `1px solid ${toast.type === "success" ? "#a5d6a7" : "#f5c6cb"}`,
            color: toast.type === "success" ? "#2e7d32" : "#c0392b",
          }}>
            {toast.type === "success" ? "✓ " : "✕ "}{toast.msg}
          </div>
        )}

        {/* Today card */}
        <div style={{ marginBottom: "1.2rem" }}>
          <SectionLabel>Today&apos;s Attendance</SectionLabel>
          <TodayCard
            record={todayRecord}
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            loading={loading}
          />
        </div>

        {/* Current cutoff summary */}
        <div style={{ marginBottom: "1.2rem" }}>
          <SectionLabel>Current Payroll Cutoff</SectionLabel>
          <CutoffSummaryCard summary={currentCutoffSummary} />
        </div>

        {/* Attendance history */}
        <div>
          <SectionLabel>Attendance History</SectionLabel>
          <AttendanceHistoryTable summaries={cutoffSummaries} />
        </div>

      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#b0a090",
      fontFamily: "'DM Mono', monospace",
      marginBottom: "0.5rem",
    }}>
      {children}
    </div>
  );
}
