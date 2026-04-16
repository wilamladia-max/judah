"use client";

import { useState } from "react";
import { PayrollForm } from "@/components/PayrollForm";
import { PayslipPreview } from "@/components/payslip/PayslipPreview";
import { calculatePayroll } from "@/lib/payroll/calculatePayroll";
import { validateInput } from "@/lib/payroll/validation";
import type { PayrollInput, PayrollSummary } from "@/lib/payroll/types";
import { SAMPLE_PAYROLL_INPUT } from "@/lib/payroll/sampleData";

type View = "form" | "payslip";

export default function HomePage() {
  const [view, setView] = useState<View>("form");
  const [input, setInput] = useState<PayrollInput>(SAMPLE_PAYROLL_INPUT);
  const [errors, setErrors] = useState<Partial<Record<keyof PayrollInput, string>>>({});
  const [summary, setSummary] = useState<PayrollSummary | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof PayrollInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateInput(input);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const result = calculatePayroll(input);
    setSummary(result);
    setView("payslip");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen py-8 px-4 pb-16" style={{ background: "linear-gradient(160deg, #f9f2e7 0%, #f0e4cc 100%)" }}>
      {/* Top bar */}
      <div className="no-print max-w-2xl mx-auto mb-6">
        <div className="flex items-center justify-between w-full flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ background: "linear-gradient(135deg, #b5813a, #7a4a10)", fontFamily: "'Playfair Display', serif" }}>
              P
            </div>
            <div>
              <div className="text-base font-bold text-brand-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                PayrollPH
              </div>
              <div className="text-xs tracking-widest uppercase text-brand-500" style={{ fontFamily: "'DM Mono', monospace" }}>
                Payroll System v1.0
              </div>
            </div>
          </div>
          <a href="/employee/login" style={{
            padding: "0.45rem 1rem",
            borderRadius: 7,
            border: "1.5px solid #ddd3c3",
            background: "#fff",
            color: "#8a5e28",
            fontSize: "0.75rem",
            fontWeight: 700,
            textDecoration: "none",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.06em",
          }}>
            👤 Employee Portal
          </a>
        </div>
      </div>

      {/* Main card */}
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-10 border border-brand-200"
        style={{ boxShadow: "0 12px 50px rgba(120,80,30,0.12)" }}>

        {view === "form" ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-brand-800 m-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                Payroll Entry
              </h1>
              <p className="text-brand-400 text-xs mt-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                Fill in the payroll details below to generate a professional payslip.
              </p>
            </div>
            <PayrollForm
              input={input}
              onChange={handleChange}
              onSubmit={handleSubmit}
              errors={errors}
            />
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-brand-800 m-0" style={{ fontFamily: "'Playfair Display', serif" }}>
                Payslip Preview
              </h1>
              <p className="text-brand-400 text-xs mt-2" style={{ fontFamily: "'DM Mono', monospace" }}>
                Review the payslip below, then print or save as PDF.
              </p>
            </div>
            {summary && (
              <PayslipPreview input={input} summary={summary} onBack={handleBack} />
            )}
          </>
        )}
      </div>

      {/* Future features note */}
      <div className="no-print max-w-2xl mx-auto mt-4 text-center">
        <p className="text-xs text-brand-400 tracking-widest uppercase" style={{ fontFamily: "'DM Mono', monospace" }}>
          Future Ready · SSS / Pag-IBIG / PhilHealth Auto-Compute · Excel Upload · Multi-Employee · Payroll History
        </p>
      </div>
    </div>
  );
}
