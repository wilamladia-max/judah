/**
 * components/payslip/PayslipGovSection.tsx
 * Renders a single government benefit block (SSS / Pag-IBIG / PhilHealth)
 * inside the payslip, showing both employee and employer shares.
 */

import { PayslipRow } from "./PayslipRow";
import { formatPHP }  from "@/lib/payroll/formatters";
import type { BenefitPair } from "@/lib/payroll/types";

interface PayslipGovSectionProps {
  icon:  string;
  label: string;
  data:  BenefitPair;
}

export function PayslipGovSection({ icon, label, data }: PayslipGovSectionProps) {
  return (
    <div
      className="mb-3 rounded-md px-3 py-2"
      style={{
        background: "#fdfaf6",
        border: "1px solid #f0e4cc",
      }}
    >
      <div
        className="text-xs font-bold mb-1"
        style={{ color: "#8a5e28", fontFamily: "'DM Mono', monospace" }}
      >
        {icon} {label}
      </div>
      <PayslipRow label="Employee Share" value={formatPHP(data.employee)} indent />
      <PayslipRow
        label="Employer Share"
        value={formatPHP(data.employer)}
        indent
        muted
      />
    </div>
  );
}
