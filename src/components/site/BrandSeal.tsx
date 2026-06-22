import seal from "@/assets/temperanzza-seal.png.asset.json";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl" | "full";
type Tone = "ink" | "paper";

const SIZES: Record<Size, string> = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-32 w-32",
  xl: "h-56 w-56",
  full: "h-full w-full",
};

export function BrandSeal({
  size = "md",
  tone = "ink",
  embossed = false,
  className,
  eager = false,
}: {
  size?: Size;
  tone?: Tone;
  embossed?: boolean;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      src={seal.url}
      alt="Brasão Temperanzza — Casa de Temperos"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={
        embossed
          ? {
              filter:
                // luz vinda do topo-esquerda + sombra grave embaixo + glow quente sutil
                "drop-shadow(0 1px 0 rgba(255,235,200,0.35)) drop-shadow(-1px -1px 0 rgba(255,220,180,0.25)) drop-shadow(2px 3px 0 rgba(0,0,0,0.6)) drop-shadow(0 8px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 30px rgba(230,180,120,0.18))",
            }
          : undefined
      }
      className={cn(
        SIZES[size],
        "object-contain select-none",
        tone === "paper" && "invert",
        embossed && "brightness-110 contrast-105",
        className,
      )}
    />
  );
}
