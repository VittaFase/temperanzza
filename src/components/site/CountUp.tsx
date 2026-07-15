import { useEffect, useRef, useState } from "react";

/**
 * CountUp — contador editorial discreto.
 * Anima do 0 (ou `from`) até `to` quando entra em viewport.
 * Duração: 600–900ms, ease-out. Respeita prefers-reduced-motion.
 * Renderiza um <span> com tabular-nums para não causar layout shift.
 */
export function CountUp({
  to,
  from = 0,
  duration = 800,
  prefix = "",
  suffix = "",
  pad = 0,
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** zero-pad the integer part to N digits (ex: 2 → "07") */
  pad?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(to);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const start = performance.now();
            let raf = 0;
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              // ease-out cubic
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.round(from + (to - from) * eased));
              if (t < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
            io.disconnect();
            return () => cancelAnimationFrame(raf);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, from, duration]);

  const formatted = pad > 0 ? String(value).padStart(pad, "0") : String(value);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
