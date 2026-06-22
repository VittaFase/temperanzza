import seal from "@/assets/temperanzza-seal.png.asset.json";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";
type Tone = "ink" | "paper";

const SIZES: Record<Size, string> = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-32 w-32",
  xl: "h-56 w-56",
};

export function BrandSeal({
  size = "md",
  tone = "ink",
  className,
  eager = false,
}: {
  size?: Size;
  tone?: Tone;
  className?: string;
  eager?: boolean;
}) {
  return (
    <img
      src={seal.url}
      alt="Brasão Temperanzza — Casa de Temperos"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={cn(
        SIZES[size],
        "object-contain select-none",
        tone === "paper" && "invert",
        className,
      )}
    />
  );
}
