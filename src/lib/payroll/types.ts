/**
 * lib/payroll/types.ts
 * ─────────────────────────────────────────────────────────────
 * Central data model for the payroll system.
 * All interfaces live here so every module imports from one place.
 *
 * FUTURE: Extend PayrollInput with leave, overtime, bonuses, etc.
 * FUTURE: Add EmployeeRecord with DB id, department, position.
 * FUTURE: Add PayrollHistory to store past payslips per employee.
 */

// ── Raw form input ──────────────────────────────────────────────
export interface PayrollInput {
  payrollPeriod: string;
  employeeName: string;
  employeeNumber: string;

  // Earnings
  daysWorked: string;   // stored as string from <input>, parsed in calculation
  dailyRate: string;

  // Deductions
  otherDeductions: string;

  // Government benefit shares (manual v1 → auto-compute in future)
  sssEmployee: string;
  sssEmployer: string;
  pagibigEmployee: string;
  pagibigEmployer: string;
  philhealthEmployee: string;
  philhealthEmployer: string;
}

// ── Government benefit amounts (parsed numbers) ─────────────────
export interface BenefitPair {
  employee: number;
  employer: number; // shown on payslip; NOT deducted from net salary
}

export interface GovernmentBenefits {
  sss: BenefitPair;
  pagibig: BenefitPair;
  philhealth: BenefitPair;
}

// ── Computed payslip summary ────────────────────────────────────
export interface PayrollSummary {
  grossSalary: number;
  govBenefits: GovernmentBenefits;
  otherDeductions: number;
  totalEmployeeGovDeductions: number; // SSS + Pag-IBIG + PhilHealth (employee shares only)
  totalEmployeeDeductions: number;    // totalEmployeeGovDeductions + otherDeductions
  netSalary: number;                  // grossSalary - totalEmployeeDeductions
}

// ── FUTURE: Contribution table row (SSS / PhilHealth / Pag-IBIG) ─
// Will be populated from a static JSON table or parsed Excel file.
export interface ContributionTableRow {
  minSalary: number;
  maxSalary: number;
  employeeShare: number;
  employerShare: number;
}

// ── FUTURE: Employee record (for multi-employee support) ─────────
export interface EmployeeRecord {
  id: string;
  name: string;
  employeeNumber: string;
  department?: string;
  position?: string;
  dailyRate: number;
}

// ── FUTURE: Payroll history entry ────────────────────────────────
export interface PayrollHistoryEntry {
  id: string;
  employeeId: string;
  period: string;
  summary: PayrollSummary;
  createdAt: string;
}
