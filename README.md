# PayrollPH — Payroll System v1.1

A clean, modular payroll web app built with **Next.js 14 · TypeScript · Tailwind CSS**.

---

## What's Included

### v1.0 — Payroll Entry & Payslip
- Manual payroll entry per employee
- Auto-computes: Gross Salary, Deductions, Net Salary
- Government benefits section: SSS, Pag-IBIG, PhilHealth (manual entry; auto-compute ready)
- Professional printable payslip (Print / Save as PDF)

### v1.1 — Employee Attendance Module
- Employee login portal (PIN-based)
- Daily clock in / clock out with timestamp recording
- Automatic computation of rendered hours and minutes
- Attendance history grouped by payroll cutoff period (1st–15th, 16th–30th)
- Current cutoff summary: days worked, total hours rendered
- Architecture prepared for attendance → payroll auto-computation

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/__payroll__.git
cd __payroll__
npm install
npm run dev
```

- **Admin / Payroll** → http://localhost:3000  
- **Employee Portal** → http://localhost:3000/employee/login

---

## Test Credentials

| Employee       | Number  | PIN  |
|----------------|---------|------|
| Juan Dela Cruz | EMP-001 | 1234 |
| Maria Santos   | EMP-002 | 5678 |
| Pedro Reyes    | EMP-003 | 9999 |

---

## Full Project Structure

```
src/
├── app/
│   ├── page.tsx                            # Payroll entry + payslip (admin)
│   ├── layout.tsx
│   ├── globals.css
│   └── employee/
│       ├── login/page.tsx                  # Employee PIN login
│       └── dashboard/page.tsx              # Attendance dashboard
│
├── types/
│   ├── employee.ts                         # Employee, EmployeeSession
│   └── attendance.ts                       # AttendanceRecord, PayrollCutoff,
│                                           # AttendanceCutoffSummary, PayrollSummaryInput
│
├── components/
│   ├── PayrollForm.tsx
│   ├── ui/
│   │   ├── FormField.tsx
│   │   ├── SectionHeader.tsx
│   │   └── GovBenefitGroup.tsx
│   ├── payslip/
│   │   ├── PayslipPreview.tsx
│   │   ├── PayslipRow.tsx
│   │   └── PayslipGovSection.tsx
│   └── attendance/
│       ├── TodayCard.tsx                   # Clock in/out UI
│       ├── AttendanceHistoryTable.tsx       # History by cutoff
│       └── CutoffSummaryCard.tsx           # Current period summary
│
└── lib/
    ├── auth/
    │   └── employeeAuth.ts                 # Login, session, sample employees
    ├── attendance/
    │   ├── attendanceStore.ts              # clockIn(), clockOut(), CRUD
    │   ├── calculateWorkedTime.ts          # Pure time math
    │   └── groupAttendanceByCutoff.ts      # Cutoff grouping
    └── payroll/
        ├── types.ts
        ├── calculatePayroll.ts
        ├── calculateGovernmentBenefits.ts
        ├── buildPayrollFromAttendance.ts   # Attendance → payroll bridge
        ├── cutoffHelpers.ts
        ├── validation.ts
        ├── formatters.ts
        ├── sampleData.ts
        ├── parsers/excelContributionParser.ts
        └── tables/governmentContributionTable.ts
```

---

## Cutoff Logic

| Period     | Dates           |
|------------|-----------------|
| 1st Cutoff | Day 1–15        |
| 2nd Cutoff | Day 16–end of month |

Attendance → Payroll bridge:  
`buildPayrollFromAttendance(cutoffSummary)` → `PayrollSummaryInput` → pre-fill payroll form

---

## Deploy to Vercel

```bash
git add .
git commit -m "feat: attendance module v1.1"
git push origin main
```

Then: [vercel.com](https://vercel.com) → Import Project → select `__payroll__` → Deploy.

---

## Roadmap

- [ ] v2 — Auto-compute gov benefits from contribution tables + Excel upload
- [ ] v2 — One-click "Generate Payroll" from attendance cutoff summary
- [ ] v3 — Admin panel: manage employees, view/override all attendance
- [ ] v3 — Multi-employee payroll batch processing + payroll history
- [ ] v4 — Overtime, undertime, late, leave, holiday handling
- [ ] v4 — Break time tracking + downloadable PDF records
- [ ] v5 — NextAuth login, QR kiosk attendance, CSV/Excel export, RBAC
