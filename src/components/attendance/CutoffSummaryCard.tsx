/**
 * components/attendance/CutoffSummaryCard.tsx
 * ─────────────────────────────────────────────────────────────
 * Shows the current cutoff summary: days worked, hours rendered.
 * This is the "payroll preparation preview" visible on the dashboard.
 *
 * FUTURE: Add a "Send to Payroll" button that pre-fills the payroll form.
 */

"use client";

import type { AttendanceCutoffSummary } from "@/types/attendance";
import { formatDuration } from "@/lib/attendance/calculateWorkedTime";

interface CutoffSummaryCardProps {
  summary: AttendanceCutoffSummary | null;
}

export function CutoffSummaryCard({ summary }: CutoffSummaryCardProps) {
  if (!summary) {
    return (
      <div style={{
        background: "#fff",
        border: "1px solid #ecdfc9",
        borderRadius: 14,
        padding: "1.4rem 1.6rem",
        fontFamily: "'DM Mono', monospace",
      }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b5813a", marginBottom: 6 }}>
          Current Cutoff
        </div>
        <div style={{ fontSize: "0.8rem", color: "#b0a090" }}>
          No attendance recorded for this cutoff period yet.
        </div>
      </div>
    );
  }

  const renderedH = Math.floor(summary.totalMinutesWorked / 60);
  const renderedM = summary.totalMinutesWorked % 60;

  return (
    <div style={{
      background: "linear-gradient(135deg, #fdf3e2, #fef9f0)",
      border: "1px solid #ecdfc9",
      borderRadius: 14,
      padding: "1.4rem 1.6rem",
      boxShadow: "0 2px 12px rgba(181,129,58,0.08)",
    }}>
      <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b5813a", fontFamily: "'DM Mono', monospace", marginBottom: 4 }}>
        Current Payroll Cutoff
      </div>
      <div style={{ fontSize: "1rem", fontWeight: 700, color: "#2c1a08", fontFamily: "'DM Mono', monospace", marginBottom: "1rem" }}>
        {summary.cutoff.label}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.8rem" }}>
        <SummaryTile label="Days Worked" value={String(summary.totalDaysWorked)} unit="days" />
        <SummaryTile label="Hours Rendered" value={formatDuration(renderedH, renderedM)} unit="" />
        <SummaryTile label="Total Minutes" value={String(summary.totalMinutesWorked)} unit="min" />
      </div>

      <div style={{
        marginTop: "1rem",
        padding: "0.7rem 0.9rem",
        background: "#fff7ed",
        borderRadius: 8,
        border: "1px solid #fed7aa",
        fontSize: "0.7rem",
        color: "#7a4a10",
        fontFamily: "'DM Mono', monospace",
      }}>
        📋 This data will be used to compute your salary for <strong>{summary.cutoff.label}</strong>.
        Daily rate × {summary.totalDaysWorked} days worked.
      </div>
    </div>
  );
}

function SummaryTile({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 9,
      padding: "0.75rem",
      border: "1px solid #f0e4cc",
    }}>
      <div style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0a090", fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#7a4a10", fontFamily: "'DM Mono', monospace" }}>
        {value}
        {unit && <span style={{ fontSize: "0.65rem", fontWeight: 500, color: "#b0a090", marginLeft: 2 }}>{unit}</span>}
      </div>
    </div>
  );
}
