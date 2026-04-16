/**
 * components/PayrollForm.tsx
 * ─────────────────────────────────────────────────────────────
 * Payroll input form. Receives state and handlers from the parent
 * page — contains NO computation logic itself.
 *
 * FUTURE: Add fields for overtime, leave, bonuses, tax withholding.
 * FUTURE: Add an Excel upload button to auto-fill gov benefit shares.
 */

import { FormField }      from "@/components/ui/FormField";
import { SectionHeader }  from "@/components/ui/SectionHeader";
import { GovBenefitGroup } from "@/components/ui/GovBenefitGroup";
import type { PayrollInput } from "@/lib/payroll/types";

interface PayrollFormProps {
  input: PayrollInput;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Partial<Record<keyof PayrollInput, string>>;
}

export function PayrollForm({ input, onChange, onSubmit, errors }: PayrollFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate>

      {/* ── Payroll Period ───────────────────────────────────── */}
      <SectionHeader title="Payroll Period" />
      <FormField
        label="Month Duration / Payroll Period"
        name="payrollPeriod"
        value={input.payrollPeriod}
        onChange={onChange}
        placeholder="e.g. April 1–15, 2026"
        error={errors.payrollPeriod}
      />

      {/* ── Employee Information ─────────────────────────────── */}
      <SectionHeader title="Employee Information" />
      <div className="grid grid-cols-2 gap-x-4">
        <FormField
          label="Employee Name"
          name="employeeName"
          value={input.employeeName}
          onChange={onChange}
          placeholder="Juan Dela Cruz"
          error={errors.employeeName}
        />
        <FormField
          label="Employee Number"
          name="employeeNumber"
          value={input.employeeNumber}
          onChange={onChange}
          placeholder="EMP-001"
          error={errors.employeeNumber}
        />
      </div>

      {/* ── Earnings ─────────────────────────────────────────── */}
      <SectionHeader title="Earnings" />
      <div className="grid grid-cols-2 gap-x-4">
        <FormField
          label="Days Worked"
          name="daysWorked"
          type="number"
          value={input.daysWorked}
          onChange={onChange}
          placeholder="12"
          error={errors.daysWorked}
        />
        <FormField
          label="Daily Rate (PHP)"
          name="dailyRate"
          type="number"
          value={input.dailyRate}
          onChange={onChange}
          placeholder="800"
          error={errors.dailyRate}
        />
      </div>

      {/* ── Other Deductions ──────────────────────────────────── */}
      <SectionHeader title="Other Deductions" />
      <FormField
        label="Other Deductions (PHP)"
        name="otherDeductions"
        type="number"
        value={input.otherDeductions}
        onChange={onChange}
        placeholder="500"
        error={errors.otherDeductions}
      />

      {/* ── Government Benefits ───────────────────────────────── */}
      <SectionHeader
        title="Government Benefits"
        subtitle="Manual entry · Auto-compute coming in v2"
      />

      <GovBenefitGroup
        icon="🏛"
        label="SSS"
        employeeFieldName="sssEmployee"
        employerFieldName="sssEmployer"
        employeeValue={input.sssEmployee}
        employerValue={input.sssEmployer}
        onChange={onChange}
        employeeError={errors.sssEmployee}
        employerError={errors.sssEmployer}
        employeePlaceholder="300"
        employerPlaceholder="600"
      />

      <GovBenefitGroup
        icon="🏠"
        label="Pag-IBIG"
        employeeFieldName="pagibigEmployee"
        employerFieldName="pagibigEmployer"
        employeeValue={input.pagibigEmployee}
        employerValue={input.pagibigEmployer}
        onChange={onChange}
        employeeError={errors.pagibigEmployee}
        employerError={errors.pagibigEmployer}
        employeePlaceholder="100"
        employerPlaceholder="100"
      />

      <GovBenefitGroup
        icon="💊"
        label="PhilHealth"
        employeeFieldName="philhealthEmployee"
        employerFieldName="philhealthEmployer"
        employeeValue={input.philhealthEmployee}
        employerValue={input.philhealthEmployer}
        onChange={onChange}
        employeeError={errors.philhealthEmployee}
        employerError={errors.philhealthEmployer}
        employeePlaceholder="200"
        employerPlaceholder="200"
      />

      {/* ── Submit ───────────────────────────────────────────── */}
      <button
        type="submit"
        className="w-full mt-6 py-3 rounded-lg text-white text-sm font-bold uppercase tracking-widest transition-opacity hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #b5813a, #8a5e28)",
          fontFamily: "'DM Mono', monospace",
          boxShadow: "0 4px 16px rgba(181,129,58,0.25)",
          letterSpacing: "0.1em",
        }}
      >
        Generate Payslip →
      </button>
    </form>
  );
}
