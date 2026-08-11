import { motion } from "framer-motion";

interface FilmGateProps {
  opacity?: number;
  activeAccent?: string;
  flickerIntensity?: number;
}

/**
 * FilmGate Overlay Component
 * Adds a layer of "cinematic life" over a scene to break the "mockup" feel.
 */
export function FilmGate({ 
  opacity = 0.08, 
  activeAccent = "#ffffff",
  flickerIntensity = 0.02 
}: FilmGateProps) {
  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden mix-blend-screen">
      {/* 1. Animated Grain (feTurbulence) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.4]" aria-hidden="true">
        <filter id="film-grain">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.65" 
            numOctaves="3" 
            stitchTiles="stitch"
          >
            <animate 
              attributeName="seed" 
              from="1" 
              to="1000" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </feTurbulence>
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>

      {/* 2. Flicker / Light Breathing */}
      <motion.div
        animate={{
          opacity: [0.98, 1, 0.97, 1, 0.99, 1],
          filter: [
            "brightness(1) contrast(1)",
            "brightness(1.02) contrast(1.01)",
            "brightness(0.99) contrast(0.99)",
            "brightness(1.01) contrast(1.01)",
            "brightness(1) contrast(1)",
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 bg-white/5 mix-blend-soft-light"
      />

      {/* 3. Halation / Bloom Bloom Bloom */}
      <motion.div
        animate={{
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeAccent}15 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      {/* 4. Peripheral Vignette breathing */}
      <div 
        className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.4)]"
      />
    </div>
  );
}
