/**
 * types/employee.ts
 * ─────────────────────────────────────────────────────────────
 * Employee data model and authentication types.
 *
 * FUTURE: Replace with DB-backed records (Prisma / Supabase).
 * FUTURE: Add role: "admin" | "employee" for RBAC.
 * FUTURE: Add biometric / QR login fields.
 */

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  department?: string;
  position?: string;
  dailyRate: number;
  /** PIN used for simple kiosk-style login (v1). Future: replace with hashed password or OAuth. */
  pin: string;
}

/** Session stored in localStorage after successful login */
export interface EmployeeSession {
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  loggedInAt: string; // ISO timestamp
}
