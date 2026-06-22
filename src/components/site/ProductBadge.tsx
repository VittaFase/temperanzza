/**
 * Selo circular preto rotacionado, estilo Kinder's "NEW".
 */
export function ProductBadge({
  label,
  size = "md",
  className = "",
}: {
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim =
    size === "sm" ? "w-14 h-14 text-[10px]" : size === "lg" ? "w-24 h-24 text-sm" : "w-20 h-20 text-xs";
  return (
    <div
      className={`absolute z-10 grid place-items-center rounded-full bg-foreground text-background font-display font-black uppercase tracking-wider shadow-lg -rotate-12 ${dim} ${className}`}
    >
      <span className="leading-none text-center px-1">{label}</span>
    </div>
  );
}
