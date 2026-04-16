/**
 * components/attendance/TodayCard.tsx
 * ─────────────────────────────────────────────────────────────
 * Shows the current day's attendance status with clock-in / clock-out buttons.
 * All business logic is handled by the parent — this component is purely UI.
 */

"use client";

import type { AttendanceRecord } from "@/types/attendance";
import { formatTime, formatDate, formatDuration } from "@/lib/attendance/calculateWorkedTime";

interface TodayCardProps {
  record: AttendanceRecord | null;
  onClockIn: () => void;
  onClockOut: () => void;
  loading: boolean;
}

export function TodayCard({ record, onClockIn, onClockOut, loading }: TodayCardProps) {
  const today = new Date();
  const dateLabel = formatDate(today.toISOString());

  const isComplete  = record?.status === "Completed";
  const isClockedIn = record?.status === "Clocked In";
  const hasRecord   = !!record;

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #ecdfc9",
      borderRadius: 14,
      padding: "1.8rem",
      boxShadow: "0 4px 24px rgba(140,100,50,0.09)",
    }}>
      {/* Date header */}
      <div style={{ marginBottom: "1.4rem" }}>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#b5813a", fontFamily: "'DM Mono', monospace" }}>
          Today
        </div>
        <div style={{ fontSize: "1rem", fontWeight: 600, color: "#2c1a08", marginTop: 3, fontFamily: "'DM Mono', monospace" }}>
          {dateLabel}
        </div>
      </div>

      {/* Status badge */}
      <div style={{ marginBottom: "1.4rem" }}>
        <span style={{
          display: "inline-block",
          padding: "0.3rem 0.85rem",
          borderRadius: 999,
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          fontFamily: "'DM Mono', monospace",
          background: isComplete ? "#e8f5e9" : isClockedIn ? "#fff3e0" : "#f5f5f5",
          color: isComplete ? "#2e7d32" : isClockedIn ? "#e65100" : "#757575",
          border: `1px solid ${isComplete ? "#a5d6a7" : isClockedIn ? "#ffcc80" : "#e0e0e0"}`,
        }}>
          {isComplete ? "✓ Completed" : isClockedIn ? "● Clocked In" : "○ Not Started"}
        </span>
      </div>

      {/* Time info */}
      {hasRecord && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          marginBottom: "1.4rem",
          padding: "1rem",
          background: "#fdf8f1",
          border: "1px solid #f0e4cc",
          borderRadius: 10,
        }}>
          <TimeCell label="Time In" value={formatTime(record!.clockIn)} />
          <TimeCell label="Time Out" value={record!.clockOut ? formatTime(record!.clockOut) : "—"} />
          <TimeCell
            label="Rendered"
            value={
              record!.renderedHours !== null && record!.renderedMinutes !== null
                ? formatDuration(record!.renderedHours, record!.renderedMinutes)
                : "—"
            }
            highlight={isComplete}
          />
        </div>
      )}

      {/* Completion summary */}
      {isComplete && record!.renderedHours !== null && (
        <div style={{
          background: "linear-gradient(135deg, #e8f5e9, #f1f8e9)",
          border: "1px solid #a5d6a7",
          borderRadius: 10,
          padding: "1rem 1.2rem",
          marginBottom: "1.2rem",
          fontFamily: "'DM Mono', monospace",
        }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#388e3c", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            Work Summary
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1b5e20" }}>
            {formatDuration(record!.renderedHours!, record!.renderedMinutes!)}
          </div>
          <div style={{ fontSize: "0.72rem", color: "#555", marginTop: 2 }}>
            {record!.totalMinutesWorked} total minutes rendered
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        {!hasRecord && (
          <ActionButton
            label={loading ? "Clocking In…" : "Clock In"}
            onClick={onClockIn}
            disabled={loading}
            variant="clockin"
          />
        )}
        {isClockedIn && (
          <ActionButton
            label={loading ? "Clocking Out…" : "Clock Out"}
            onClick={onClockOut}
            disabled={loading}
            variant="clockout"
          />
        )}
        {isComplete && (
          <div style={{
            width: "100%",
            padding: "0.75rem",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#388e3c",
            fontWeight: 600,
            fontFamily: "'DM Mono', monospace",
            background: "#e8f5e9",
            borderRadius: 8,
          }}>
            ✓ Attendance complete for today
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function TimeCell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b5813a", fontFamily: "'DM Mono', monospace", marginBottom: 3 }}>
        {label}
      </div>
      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: highlight ? "#2e7d32" : "#2c1a08", fontFamily: "'DM Mono', monospace" }}>
        {value}
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, disabled, variant }: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant: "clockin" | "clockout";
}) {
  const isClockIn = variant === "clockin";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        flex: 1,
        padding: "0.85rem",
        borderRadius: 9,
        border: "none",
        fontSize: "0.88rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'DM Mono', monospace",
        transition: "opacity 0.15s",
        opacity: disabled ? 0.6 : 1,
        background: isClockIn
          ? "linear-gradient(135deg, #b5813a, #8a5e28)"
          : "linear-gradient(135deg, #e53935, #b71c1c)",
        color: "#fff",
        boxShadow: isClockIn
          ? "0 3px 12px rgba(181,129,58,0.28)"
          : "0 3px 12px rgba(229,57,53,0.25)",
      }}
    >
      {isClockIn ? "⏱ " : "⏹ "}{label}
    </button>
  );
}
