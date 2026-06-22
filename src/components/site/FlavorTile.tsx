import type { CSSProperties } from "react";
import { getFlavorTone } from "@/lib/flavorPalette";

/**
 * Tile colorido de fundo, com partículas sutis, que aloja a imagem do produto.
 * Espelha o tratamento dos produtos da Kinder's: bloco de cor saturado +
 * granulado sutil + potinho centralizado, com "ground shadow" elíptica
 * sob o pote para sensação de objeto pousado.
 */
export function FlavorTile({
  handle,
  title,
  children,
  className = "",
  intensity = 1,
  ground = true,
}: {
  handle: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** multiplica a opacidade das partículas */
  intensity?: number;
  /** desenha a sombra elíptica de contato sob o pote */
  ground?: boolean;
}) {
  const tone = getFlavorTone(handle, title);

  const style: CSSProperties = {
    backgroundColor: tone.bg,
    backgroundImage: `
      radial-gradient(circle at 18% 22%, ${tone.particle} 0px, transparent 1.5px),
      radial-gradient(circle at 72% 38%, ${tone.particle} 0px, transparent 1.2px),
      radial-gradient(circle at 38% 78%, ${tone.particle} 0px, transparent 1.8px),
      radial-gradient(circle at 88% 82%, ${tone.particle} 0px, transparent 1.4px),
      radial-gradient(circle at 50% 50%, ${tone.particle} 0px, transparent 1px),
      radial-gradient(circle at 12% 65%, ${tone.particle} 0px, transparent 1.3px),
      radial-gradient(ellipse at center, transparent 35%, color-mix(in oklab, ${tone.particle} ${30 * intensity}%, transparent) 100%)
    `,
    backgroundSize:
      "180px 180px, 220px 220px, 160px 160px, 200px 200px, 140px 140px, 240px 240px, 100% 100%",
    backgroundPosition:
      "0 0, 40px 30px, 80px 90px, 20px 60px, 110px 20px, 50px 130px, center",
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      data-flavor={handle}
      data-tone={tone.dark ? "dark" : "light"}
    >
      {/* Ground shadow — elipse escura sob o pote para sensação de contato */}
      {ground && (
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[68%] h-[10%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 45%, transparent 75%)",
            filter: "blur(2px)",
          }}
        />
      )}
      {children}
    </div>
  );
}
