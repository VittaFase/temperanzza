/**
 * Registro comercial handle → PNG transparente local.
 *
 * Este mapa preserva compatibilidade com Shopify, PDP, receitas e carrinho,
 * inclusive para aliases e produtos legados. Ele NÃO autoriza um SKU a ser
 * promovido automaticamente na experiência editorial do rebrand.
 * Para hero/destaques/storytelling, use também isRebrandEditorialHandle().
 */
import anaMaria from "@/assets/ana-maria.png.asset.json";
import canela from "@/assets/canela-moida.png.asset.json";
import cebola from "@/assets/cebola-em-po.png.asset.json";
import chimiPicante from "@/assets/chimi-churri-picante.png.asset.json";
import chimiSemPimenta from "@/assets/chimi-churri-sem-pimenta.png.asset.json";
import curcuma from "@/assets/curcuma.png.asset.json";
import duChefe from "@/assets/du-chefe-com-paprica.png.asset.json";
import ervasFinas from "@/assets/ervas-finas.png.asset.json";
import lemonPepper from "@/assets/lemon-pepper.png.asset.json";
import papricaDefumada from "@/assets/paprica-defumada.png.asset.json";
import papricaDoce from "@/assets/paprica-doce.png.asset.json";
import papricaPicante from "@/assets/paprica-picante.png.asset.json";
import pimenta from "@/assets/pimenta-do-reino.png.asset.json";
import salsaCebolaAlho from "@/assets/salsa-cebola-e-alho.png.asset.json";
import flixBacon from "@/assets/temperaflix-bacon.png.asset.json";
import flixErvas from "@/assets/temperaflix-ervas-finas.png.asset.json";
import flixTrad from "@/assets/temperaflix-tradicional.png.asset.json";
import edu from "@/assets/tempero-do-edu.png.asset.json";
import mineiro from "@/assets/tempero-mineiro.png.asset.json";

const COMMERCIAL_IMAGE_MAP: Record<string, string> = {
  "ana-maria": anaMaria.url,
  "canela-moida": canela.url,
  "canela-premium-black-30g": canela.url,
  "cebola-em-po": cebola.url,
  "chimi-churri-picante": chimiPicante.url,
  "chimichurri-picante": chimiPicante.url,
  "chimi-churri-sem-pimenta": chimiSemPimenta.url,
  "chimichurri-sem-pimenta": chimiSemPimenta.url,
  curcuma: curcuma.url,
  "du-chefe-com-paprica": duChefe.url,
  "tempero-chefe": duChefe.url,
  "ervas-finas": ervasFinas.url,
  "lemon-pepper": lemonPepper.url,
  "paprica-defumada": papricaDefumada.url,
  "paprica-doce": papricaDoce.url,
  "paprica-picante": papricaPicante.url,
  "pimenta-do-reino": pimenta.url,
  "pimenta-do-reino-premium-black-30g": pimenta.url,
  "salsa-cebola-e-alho": salsaCebolaAlho.url,
  "temperaflix-bacon": flixBacon.url,
  "temperaflix-ervas-finas": flixErvas.url,
  "temperaflix-tradicional": flixTrad.url,
  "tempero-do-edu": edu.url,
  "edu-guedes": edu.url,
  "tempero-mineiro": mineiro.url,
};

/** Devolve o PNG transparente local; senão a URL da Shopify como fallback. */
export function getProductImage(handle: string, fallback?: string | null): string | null {
  if (COMMERCIAL_IMAGE_MAP[handle]) return COMMERCIAL_IMAGE_MAP[handle];

  for (const key of Object.keys(COMMERCIAL_IMAGE_MAP)) {
    if (handle.includes(key) || key.includes(handle)) return COMMERCIAL_IMAGE_MAP[key];
  }

  return fallback ?? null;
}
