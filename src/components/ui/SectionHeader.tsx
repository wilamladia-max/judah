/**
 * components/ui/SectionHeader.tsx
 * Decorative divider with a centered label — used in both the form and payslip.
 */

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-4 mt-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "#e8ddd0" }} />
        <span
          className="text-xs font-bold uppercase whitespace-nowrap"
          style={{
            letterSpacing: "0.14em",
            color: "#b5813a",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {title}
        </span>
        <div className="flex-1 h-px" style={{ background: "#e8ddd0" }} />
      </div>
      {subtitle && (
        <p
          className="text-center text-xs mt-1"
          style={{ color: "#b0a090", fontFamily: "'DM Mono', monospace" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
