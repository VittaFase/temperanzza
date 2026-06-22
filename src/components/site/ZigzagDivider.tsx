/**
 * Borda decorativa em zigue-zague (serra dentada), no estilo Kinder's.
 */
export function ZigzagDivider({
  color = "var(--brand-red)",
  flip = false,
  className = "",
}: {
  color?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`w-full h-3 ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${color} 25%, transparent 25%), linear-gradient(225deg, ${color} 25%, transparent 25%)`,
        backgroundSize: "16px 16px",
        backgroundPosition: flip ? "0 100%" : "0 0",
        backgroundRepeat: "repeat-x",
        transform: flip ? "scaleY(-1)" : undefined,
      }}
    />
  );
}
