import { motion } from "framer-motion";

export function FilmGate({ children, active = true }: { children: React.ReactNode; active?: boolean }) {
  if (!active) return <>{children}</>;

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Noise/Grain Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Gate Weave & Micro-Flicker Wrapper */}
      <motion.div
        className="w-full h-full"
        animate={{
          x: [0, -0.5, 0.5, -0.3, 0],
          y: [0, 0.3, -0.3, 0.2, 0],
          filter: [
            "brightness(1)",
            "brightness(1.01)",
            "brightness(0.99)",
            "brightness(1.02)",
            "brightness(1)",
          ],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
      </motion.div>

      {/* Lens Vignette Breathing */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-40"
        animate={{
          opacity: [0.3, 0.35, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </div>
  );
}
