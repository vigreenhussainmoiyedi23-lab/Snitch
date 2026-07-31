import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  /** Optional numbered badge shown instead of icon */
  number?: number;
  children: ReactNode;
  className?: string;
};

/**
 * Reusable card wrapper.
 * Background: bg-text (#282420 dark brown) per design system.
 * Text hierarchy:
 *   heading  → text-background   (#fbeede warm cream)
 *   subtitle → text-background-subtle (#bcae9d muted tan)
 *   number   → text-primary      (orange accent)
 */
const SectionCard = ({
  title,
  subtitle,
  icon,
  number,
  children,
  className = "",
}: SectionCardProps) => {
  return (
    <div
      className={`bg-text border border-border rounded-[var(--radius-md)] overflow-hidden ${className}`}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {/* ── Header ── */}
      <div className="px-6 py-4 border-b border-border bg-text-mutes flex items-start gap-3">
        {/* Number badge */}
        {number !== undefined && (
          <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="teko text-sm font-bold text-primary leading-none">
              {number}
            </span>
          </div>
        )}

        {/* Icon (only when no number) */}
        {icon && number === undefined && (
          <span className="text-primary flex-shrink-0 mt-0.5">{icon}</span>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h2 className="eczar text-base font-semibold text-background leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mate text-xs text-background-subtle mt-0.5 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default SectionCard;
