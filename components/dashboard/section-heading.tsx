/** Section title + subtitle, shared by the routed sections that need one. */
export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <h2 className="mb-1 text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mb-5 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
