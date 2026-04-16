/**
 * components/ui/FormField.tsx
 * Reusable labeled input field with error display.
 */

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number";
  placeholder?: string;
  error?: string;
  hint?: string; // small grey note after the label
}

export function FormField({
  label, name, value, onChange,
  type = "text", placeholder, error, hint,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-bold uppercase tracking-widest mb-1"
        style={{ color: "#8a7560", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>
        {label}
        {hint && (
          <span className="normal-case font-normal ml-1" style={{ color: "#b0a090" }}>
            {hint}
          </span>
        )}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
        className="w-full px-3 py-2 rounded-md text-sm transition-colors"
        style={{
          border: error ? "1.5px solid #c0392b" : "1.5px solid #ddd3c3",
          background: "#fdfaf6",
          color: "#2c2218",
          fontFamily: "'DM Mono', monospace",
          outline: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#b5813a")}
        onBlur={(e)  => (e.target.style.borderColor = error ? "#c0392b" : "#ddd3c3")}
      />
      {error && (
        <p className="text-xs mt-1" style={{ color: "#c0392b", fontFamily: "'DM Mono', monospace" }}>
          {error}
        </p>
      )}
    </div>
  );
}
