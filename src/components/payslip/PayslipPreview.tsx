/**
 * components/payslip/PayslipPreview.tsx
 * ─────────────────────────────────────────────────────────────
 * Purely presentational — receives input + computed summary as props.
 * Handles print-to-PDF via window.print() in an isolated window.
 *
 * FUTURE: Replace print logic with @react-pdf/renderer for richer PDF output.
 * FUTURE: Add a "Save to History" button that stores the payslip record.
 */

"use client";

import { useRef }               from "react";
import { PayslipRow }           from "./PayslipRow";
import { PayslipGovSection }    from "./PayslipGovSection";
import { formatPHP }            from "@/lib/payroll/formatters";
import type { PayrollInput, PayrollSummary } from "@/lib/payroll/types";

interface PayslipPreviewProps {
  input:   PayrollInput;
  summary: PayrollSummary;
  onBack:  () => void;
}

export function PayslipPreview({ input, summary, onBack }: PayslipPreviewProps) {
  const payslipRef = useRef<HTMLDivElement>(null);
  const { govBenefits } = summary;

  // ── Print handler ──────────────────────────────────────────
  // Opens a clean window with the payslip HTML + embedded fonts,
  // then triggers the browser print dialog (Save as PDF works here).
  const handlePrint = () => {
    if (!payslipRef.current) return;
    const content = payslipRef.current.innerHTML;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payslip – ${input.employeeName} – ${input.payrollPeriod}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'DM Mono', monospace;
              background: #fff;
              padding: 2rem;
              color: #2c1a08;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 400);
  };

  // ── Employee info rows ─────────────────────────────────────
  const infoRows: [string, string][] = [
    ["Payroll Period",  input.payrollPeriod],
    ["Employee Name",   input.employeeName],
    ["Employee No.",    input.employeeNumber],
    ["Days Worked",     `${input.daysWorked} day(s)`],
    ["Daily Rate",      formatPHP(parseFloat(input.dailyRate) || 0)],
  ];

  return (
    <div>
      {/* Action bar */}
      <div className="no-print flex justify-between items-center mb-6 flex-wrap gap-3">
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
          style={{
            border: "1.5px solid #ddd3c3",
            background: "transparent",
            color: "#8a7560",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          ← Edit Payroll
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #b5813a, #8a5e28)",
            fontFamily: "'DM Mono', monospace",
            boxShadow: "0 3px 12px rgba(181,129,58,0.28)",
            letterSpacing: "0.06em",
          }}
        >
          🖨 Print / Save as PDF
        </button>
      </div>

      {/* ── Payslip paper ──────────────────────────────────── */}
      <div
        ref={payslipRef}
        className="payslip-paper bg-white rounded-xl mx-auto"
        style={{
          border: "1px solid #ddd3c3",
          padding: "2.5rem 2.8rem",
          boxShadow: "0 8px 40px rgba(140,100,50,0.10)",
          maxWidth: 640,
        }}
      >
        {/* Header */}
        <div
          className="text-center mb-8 pb-5"
          style={{ borderBottom: "2px solid #b5813a" }}
        >
          <div
            className="text-4xl font-black"
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#2c1a08",
              letterSpacing: "0.03em",
            }}
          >
            PAYSLIP
          </div>
          <div
            className="text-xs font-bold uppercase mt-2 tracking-widest"
            style={{ color: "#b5813a", fontFamily: "'DM Mono', monospace" }}
          >
            Official Payroll Document
          </div>
        </div>

        {/* Employee info grid */}
        <div
          className="grid grid-cols-2 gap-x-8 gap-y-3 rounded-lg p-4 mb-6"
          style={{ background: "#fdf8f1", border: "1px solid #ecdfc9" }}
        >
          {infoRows.map(([label, val]) => (
            <div key={label}>
              <div
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "#b5813a", fontFamily: "'DM Mono', monospace" }}
              >
                {label}
              </div>
              <div
                className="text-sm font-semibold mt-0.5"
                style={{ color: "#2c1a08", fontFamily: "'DM Mono', monospace" }}
              >
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* Earnings */}
        <div className="mb-5">
          <div style={sectionTitleStyle}>EARNINGS</div>
          <PayslipRow label="Gross Salary" value={formatPHP(summary.grossSalary)} bold />
        </div>

        {/* Deductions */}
        <div className="mb-5">
          <div style={sectionTitleStyle}>DEDUCTIONS</div>
          <PayslipRow label="Other Deductions" value={formatPHP(summary.otherDeductions)} />

          <div className="mt-3">
            <div
              className="text-xs font-bold uppercase mb-2"
              style={{ color: "#b5813a", letterSpacing: "0.1em", fontFamily: "'DM Mono', monospace" }}
            >
              Government Benefits
            </div>

            <PayslipGovSection icon="🏛" label="SSS"        data={govBenefits.sss} />
            <PayslipGovSection icon="🏠" label="Pag-IBIG"   data={govBenefits.pagibig} />
            <PayslipGovSection icon="💊" label="PhilHealth"  data={govBenefits.philhealth} />
          </div>
        </div>

        {/* Summary */}
        <div
          className="rounded-lg p-4"
          style={{ background: "#fdf3e2", border: "1px solid #ecdfc9" }}
        >
          <div style={sectionTitleStyle}>SUMMARY</div>

          <PayslipRow label="Gross Salary"                    value={formatPHP(summary.grossSalary)} />
          <PayslipRow label="Total Employee Gov. Deductions"  value={`– ${formatPHP(summary.totalEmployeeGovDeductions)}`} />
          <PayslipRow label="Other Deductions"                value={`– ${formatPHP(summary.otherDeductions)}`} />
          <PayslipRow label="Total Employee Deductions"       value={`– ${formatPHP(summary.totalEmployeeDeductions)}`} bold />

          {/* Net salary highlight */}
          <div
            className="flex justify-between items-center pt-3 mt-2"
            style={{ borderTop: "2px solid #b5813a" }}
          >
            <span
              className="font-black text-base"
              style={{ color: "#2c1a08", fontFamily: "'DM Mono', monospace", letterSpacing: "0.04em" }}
            >
              NET SALARY
            </span>
            <span
              className="font-black text-xl"
              style={{ color: "#7a4a10", fontFamily: "'DM Mono', monospace" }}
            >
              {formatPHP(summary.netSalary)}
            </span>
          </div>
        </div>

        {/* Footer note */}
        <div
          className="text-center mt-6 text-xs"
          style={{ color: "#c0b09a", letterSpacing: "0.06em", fontFamily: "'DM Mono', monospace" }}
        >
          Employer shares are shown for reference only and are not deducted from net salary.
          <br />Generated by PayrollPH v1.0
        </div>
      </div>
    </div>
  );
}

// Shared style for section title labels inside the payslip
const sectionTitleStyle: React.CSSProperties = {
  fontSize: "0.64rem",
  fontWeight: 700,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "#b5813a",
  fontFamily: "'DM Mono', monospace",
  marginBottom: "0.5rem",
  paddingBottom: "0.3rem",
  borderBottom: "1px solid #ecdfc9",
};
