import { useEffect, useRef, useState } from "react";

/**
 * Gate para vídeos decorativos de fundo (Bokeh/Smoke).
 *
 * Só monta o <video> quando:
 *  - Cliente hidratado (evita fetch SSR / durante o carregamento inicial)
 *  - Usuário não pediu prefers-reduced-motion
 *  - Conexão não é 2g/3g e Save-Data está off
 *  - O container entra na viewport (IntersectionObserver)
 *
 * Retorna { containerRef, enableVideo }.
 */
export function useVideoBackdrop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enableVideo, setEnableVideo] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Reduced motion — nunca ativa vídeo
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    // 2. Conexão fraca — mantém só o poster
    const conn = (navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean };
    }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-)?2g$|^3g$/i.test(conn.effectiveType)) {
      return;
    }

    // 3. IntersectionObserver — só carrega quando visível
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // Fallback: ativa direto se IO não existe
      setEnableVideo(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setEnableVideo(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { containerRef, enableVideo };
}
