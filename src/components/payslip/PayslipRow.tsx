/**
 * components/payslip/PayslipRow.tsx
 * A single line item row inside the payslip.
 */

interface PayslipRowProps {
  label: string;
  value: string;
  bold?: boolean;
  indent?: boolean;   // indent label (used for sub-items under a benefit group)
  muted?: boolean;    // grey out (used for employer shares — not deducted)
}

export function PayslipRow({ label, value, bold, indent, muted }: PayslipRowProps) {
  return (
    <div
      className="flex justify-between items-center py-1"
      style={{
        paddingLeft:  indent ? "1.4rem" : 0,
        borderBottom: "1px solid #f0e8d8",
      }}
    >
      <span
        style={{
          fontSize:    bold ? "0.88rem" : "0.82rem",
          fontWeight:  bold ? 700 : 400,
          color:       muted ? "#b0a090" : "#3a2c1e",
          fontFamily:  "'DM Mono', monospace",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize:   bold ? "0.92rem" : "0.82rem",
          fontWeight: bold ? 700 : 500,
          color:      muted ? "#b0a090" : "#2c1a08",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {value}
      </span>
    </div>
  );
}
