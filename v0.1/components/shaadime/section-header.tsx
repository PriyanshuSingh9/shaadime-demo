type SectionHeaderProps = {
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  compact?: boolean;
};

export function SectionHeader({
  label,
  title,
  subtitle,
  centered = false,
  compact = false,
}: SectionHeaderProps) {
  return (
    <div
      className={`section-header${centered ? " is-centered" : ""}${
        compact ? " is-compact" : ""
      }`}
    >
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
      {subtitle ? <p className="section-sub">{subtitle}</p> : null}
    </div>
  );
}
