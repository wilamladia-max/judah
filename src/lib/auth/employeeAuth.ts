/**
 * lib/auth/employeeAuth.ts
 * ─────────────────────────────────────────────────────────────
 * v1 authentication: PIN-based login stored in localStorage.
 *
 * FUTURE: Replace with:
 *   - Server-side sessions (NextAuth.js)
 *   - JWT tokens
 *   - Biometric / QR device login
 *   - Role-based access (admin vs employee)
 *
 * ⚠️  This is intentionally simple for v1 (kiosk / internal tool).
 *     Do NOT use this pattern for internet-facing production systems.
 */

import type { Employee, EmployeeSession } from "@/types/employee";

// ── Sample employee roster ─────────────────────────────────────
// FUTURE: Replace with DB query (Prisma / Supabase / REST API).
export const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: "emp-001",
    employeeNumber: "EMP-001",
    name: "Juan Dela Cruz",
    department: "Operations",
    position: "Staff",
    dailyRate: 800,
    pin: "1234",
  },
  {
    id: "emp-002",
    employeeNumber: "EMP-002",
    name: "Maria Santos",
    department: "Finance",
    position: "Accountant",
    dailyRate: 1000,
    pin: "5678",
  },
  {
    id: "emp-003",
    employeeNumber: "EMP-003",
    name: "Pedro Reyes",
    department: "IT",
    position: "Developer",
    dailyRate: 1200,
    pin: "9999",
  },
];

const SESSION_KEY = "payrollph_employee_session";

// ── Find employee by employee number ──────────────────────────
export function findEmployee(employeeNumber: string): Employee | undefined {
  return SAMPLE_EMPLOYEES.find(
    (e) => e.employeeNumber.toLowerCase() === employeeNumber.trim().toLowerCase()
  );
}

// ── Validate login credentials ─────────────────────────────────
export function validateLogin(
  employeeNumber: string,
  pin: string
): { success: boolean; employee?: Employee; error?: string } {
  const employee = findEmployee(employeeNumber);
  if (!employee) {
    return { success: false, error: "Employee number not found." };
  }
  if (employee.pin !== pin.trim()) {
    return { success: false, error: "Incorrect PIN. Please try again." };
  }
  return { success: true, employee };
}

// ── Session helpers (localStorage) ────────────────────────────
export function saveSession(employee: Employee): void {
  if (typeof window === "undefined") return;
  const session: EmployeeSession = {
    employeeId: employee.id,
    employeeNumber: employee.employeeNumber,
    employeeName: employee.name,
    loggedInAt: new Date().toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): EmployeeSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as EmployeeSession) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
