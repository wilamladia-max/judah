/**
 * components/ui/GovBenefitGroup.tsx
 * Renders a labeled group with employee + employer share inputs.
 * Used in PayrollForm for SSS, Pag-IBIG, and PhilHealth.
 */

import { FormField } from "./FormField";
import type { PayrollInput } from "@/lib/payroll/types";

interface GovBenefitGroupProps {
  icon: string;
  label: string;
  employeeFieldName: keyof PayrollInput;
  employerFieldName: keyof PayrollInput;
  employeeValue: string;
  employerValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  employeeError?: string;
  employerError?: string;
  employeePlaceholder?: string;
  employerPlaceholder?: string;
}

export function GovBenefitGroup({
  icon,
  label,
  employeeFieldName,
  employerFieldName,
  employeeValue,
  employerValue,
  onChange,
  employeeError,
  employerError,
  employeePlaceholder = "0",
  employerPlaceholder = "0",
}: GovBenefitGroupProps) {
  return (
    <div
      className="rounded-lg p-4 pb-0 mb-4"
      style={{
        background: "#fdf7ee",
        border: "1px solid #ecdfc9",
      }}
    >
      <div
        className="text-xs font-bold mb-3"
        style={{
          color: "#8a5e28",
          letterSpacing: "0.06em",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {icon} {label}
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <FormField
          label="Employee Share"
          name={employeeFieldName}
          type="number"
          value={employeeValue}
          onChange={onChange}
          placeholder={employeePlaceholder}
          error={employeeError}
        />
        <FormField
          label="Employer Share"
          name={employerFieldName}
          type="number"
          value={employerValue}
          onChange={onChange}
          placeholder={employerPlaceholder}
          error={employerError}
          hint="(not deducted)"
        />
      </div>
    </div>
  );
}
