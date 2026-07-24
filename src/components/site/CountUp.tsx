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

    let raf = 0;
    const runAnimation = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(from + (to - from) * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Fallback imediato: se o elemento já está no viewport no primeiro paint
    // (comum em telas pequenas onde a seção "A Casa em Números" aparece
    // acima da dobra ao rolar de uma vez), IntersectionObserver pode não
    // disparar. Verificamos a bounding rect na hora.
    const rect = el.getBoundingClientRect();
    const viewportH =
      typeof window !== "undefined" ? window.innerHeight : 800;
    if (rect.top < viewportH && rect.bottom > 0) {
      runAnimation();
      return () => cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            runAnimation();
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);

    // Rede de segurança: se por algum motivo (mobile Safari + prerender)
    // o observer não disparar em 1.5s, força o valor final para não
    // deixar zero na tela.
    const safety = setTimeout(() => {
      if (!startedRef.current) setValue(to);
    }, 1500);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
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
