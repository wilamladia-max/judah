/**
 * app/employee/login/page.tsx
 * ─────────────────────────────────────────────────────────────
 * Employee login page. PIN-based authentication for v1.
 * FUTURE: Replace with NextAuth.js / OAuth / biometric login.
 */

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { validateLogin, saveSession } from "@/lib/auth/employeeAuth";

export default function EmployeeLoginPage() {
  const router = useRouter();
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Small delay for UX feel
    setTimeout(() => {
      const result = validateLogin(employeeNumber, pin);
      if (result.success && result.employee) {
        saveSession(result.employee);
        router.push("/employee/dashboard");
      } else {
        setError(result.error ?? "Login failed.");
        setLoading(false);
      }
    }, 400);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f9f2e7 0%, #f0e4cc 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      fontFamily: "'DM Mono', monospace",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "linear-gradient(135deg, #b5813a, #7a4a10)",
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            marginBottom: 12,
          }}>P</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#2c1a08", fontFamily: "'Playfair Display', serif" }}>
            PayrollPH
          </div>
          <div style={{ fontSize: "0.68rem", color: "#b5813a", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 3 }}>
            Employee Portal
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "#fff",
          borderRadius: 16,
          padding: "2rem",
          border: "1px solid #ecdfc9",
          boxShadow: "0 8px 32px rgba(120,80,30,0.12)",
        }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2c1a08", margin: "0 0 1.5rem", fontFamily: "'DM Mono', monospace" }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>Employee Number</label>
              <input
                type="text"
                value={employeeNumber}
                onChange={(e) => setEmployeeNumber(e.target.value)}
                placeholder="EMP-001"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#b5813a")}
                onBlur={(e)  => (e.target.style.borderColor = "#ddd3c3")}
              />
            </div>

            <div style={{ marginBottom: "1.4rem" }}>
              <label style={labelStyle}>PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                required
                maxLength={8}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#b5813a")}
                onBlur={(e)  => (e.target.style.borderColor = "#ddd3c3")}
              />
            </div>

            {error && (
              <div style={{
                background: "#fdecea",
                border: "1px solid #f5c6cb",
                borderRadius: 8,
                padding: "0.65rem 0.9rem",
                marginBottom: "1rem",
                fontSize: "0.78rem",
                color: "#c0392b",
                fontFamily: "'DM Mono', monospace",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: 9,
                border: "none",
                background: loading ? "#c0a87a" : "linear-gradient(135deg, #b5813a, #8a5e28)",
                color: "#fff",
                fontSize: "0.88rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'DM Mono', monospace",
                boxShadow: "0 4px 14px rgba(181,129,58,0.25)",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          {/* Sample credentials hint */}
          <div style={{
            marginTop: "1.4rem",
            padding: "0.8rem",
            background: "#fdf8f1",
            border: "1px solid #f0e4cc",
            borderRadius: 8,
            fontSize: "0.68rem",
            color: "#8a7560",
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1.7,
          }}>
            <strong style={{ color: "#b5813a" }}>Sample Credentials:</strong><br />
            EMP-001 / PIN: 1234 (Juan Dela Cruz)<br />
            EMP-002 / PIN: 5678 (Maria Santos)<br />
            EMP-003 / PIN: 9999 (Pedro Reyes)
          </div>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
          <a href="/" style={{ fontSize: "0.72rem", color: "#b5813a", textDecoration: "none", fontFamily: "'DM Mono', monospace" }}>
            ← Back to Payroll System
          </a>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#8a7560",
  marginBottom: "0.35rem",
  fontFamily: "'DM Mono', monospace",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.8rem",
  border: "1.5px solid #ddd3c3",
  borderRadius: 7,
  fontSize: "0.92rem",
  fontFamily: "'DM Mono', monospace",
  background: "#fdfaf6",
  color: "#2c2218",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};
