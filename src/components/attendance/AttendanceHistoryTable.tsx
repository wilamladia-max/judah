/**
 * components/attendance/AttendanceHistoryTable.tsx
 * ─────────────────────────────────────────────────────────────
 * Renders attendance history grouped by payroll cutoff.
 * FUTURE: Add export to CSV / Excel button per cutoff.
 * FUTURE: Add admin edit / override capability.
 */

"use client";

import type { AttendanceCutoffSummary } from "@/types/attendance";
import {
  formatTime,
  formatDateShort,
  formatDuration,
} from "@/lib/attendance/calculateWorkedTime";

interface AttendanceHistoryTableProps {
  summaries: AttendanceCutoffSummary[];
}

export function AttendanceHistoryTable({ summaries }: AttendanceHistoryTableProps) {
  if (summaries.length === 0) {
    return (
      <div style={{
        textAlign: "center",
        padding: "2.5rem 1rem",
        color: "#b0a090",
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.82rem",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #ecdfc9",
      }}>
        No attendance records yet.
        <br />
        <span style={{ fontSize: "0.72rem", opacity: 0.7 }}>
          Clock in to start tracking your attendance.
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
      {summaries.map((summary) => (
        <CutoffBlock key={`${summary.cutoff.startDate}`} summary={summary} />
      ))}
    </div>
  );
}

// ── One cutoff block ──────────────────────────────────────────
function CutoffBlock({ summary }: { summary: AttendanceCutoffSummary }) {
  const { cutoff, records, totalDaysWorked, totalHoursWorked, totalMinutesWorked } = summary;
  const renderedH = Math.floor(totalMinutesWorked / 60);
  const renderedM = totalMinutesWorked % 60;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #ecdfc9",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(140,100,50,0.07)",
    }}>
      {/* Cutoff header */}
      <div style={{
        background: "linear-gradient(90deg, #fdf3e2, #fef9f0)",
        padding: "0.9rem 1.3rem",
        borderBottom: "1px solid #ecdfc9",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "0.5rem",
      }}>
        <div>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#b5813a", fontFamily: "'DM Mono', monospace" }}>
            Payroll Cutoff · {cutoff.period === "1st" ? "1st Half" : "2nd Half"}
          </div>
          <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#2c1a08", fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
            {cutoff.label}
          </div>
        </div>
        <div style={{ display: "flex", gap: "1.2rem" }}>
          <Stat label="Days Worked" value={String(totalDaysWorked)} />
          <Stat label="Total Rendered" value={formatDuration(renderedH, renderedM)} />
          <Stat label="Decimal Hours" value={`${totalHoursWorked}h`} />
        </div>
      </div>

      {/* Records table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace" }}>
          <thead>
            <tr style={{ background: "#fdf8f1" }}>
              {["Date", "Time In", "Time Out", "Rendered", "Status"].map((h) => (
                <th key={h} style={{
                  padding: "0.55rem 1rem",
                  textAlign: "left",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#8a7560",
                  borderBottom: "1px solid #ecdfc9",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} style={{ borderBottom: "1px solid #f5eedd" }}>
                <td style={tdStyle}>{formatDateShort(record.date)}</td>
                <td style={tdStyle}>{formatTime(record.clockIn)}</td>
                <td style={tdStyle}>
                  {record.clockOut ? formatTime(record.clockOut) : (
                    <span style={{ color: "#b0a090" }}>—</span>
                  )}
                </td>
                <td style={tdStyle}>
                  {record.renderedHours !== null && record.renderedMinutes !== null
                    ? formatDuration(record.renderedHours, record.renderedMinutes)
                    : <span style={{ color: "#b0a090" }}>—</span>
                  }
                </td>
                <td style={tdStyle}>
                  <span style={{
                    display: "inline-block",
                    padding: "0.2rem 0.65rem",
                    borderRadius: 999,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    background: record.status === "Completed" ? "#e8f5e9" : "#fff3e0",
                    color: record.status === "Completed" ? "#2e7d32" : "#e65100",
                    border: `1px solid ${record.status === "Completed" ? "#a5d6a7" : "#ffcc80"}`,
                  }}>
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tdStyle: React.CSSProperties = {
  padding: "0.65rem 1rem",
  fontSize: "0.8rem",
  color: "#3a2c1e",
  fontFamily: "'DM Mono', monospace",
};

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0a090", fontFamily: "'DM Mono', monospace" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#7a4a10", fontFamily: "'DM Mono', monospace" }}>
        {value}
      </div>
    </div>
  );
}
