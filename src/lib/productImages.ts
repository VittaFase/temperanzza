/**
 * Registro comercial de handle canônico → PNG transparente local.
 *
 * Shopify continua sendo a fonte comercial. Aliases técnicos são normalizados
 * antes da consulta para impedir correspondências acidentais por substring.
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
import { canonicalProductHandle } from "@/lib/rebrandCatalog";

const COMMERCIAL_IMAGE_MAP: Record<string, string> = {
  "ana-maria": anaMaria.url,
  "canela-moida": canela.url,
  "cebola-em-po": cebola.url,
  "chimichurri-picante": chimiPicante.url,
  "chimichurri-sem-pimenta": chimiSemPimenta.url,
  curcuma: curcuma.url,
  "du-chefe-com-paprica": duChefe.url,
  "ervas-finas": ervasFinas.url,
  "lemon-pepper": lemonPepper.url,
  "paprica-defumada": papricaDefumada.url,
  "paprica-doce": papricaDoce.url,
  "paprica-picante": papricaPicante.url,
  "pimenta-do-reino": pimenta.url,
  "salsa-cebola-e-alho": salsaCebolaAlho.url,
  "temperaflix-bacon": flixBacon.url,
  "temperaflix-ervas-finas": flixErvas.url,
  "temperaflix-tradicional": flixTrad.url,
  "tempero-do-edu": edu.url,
  "tempero-mineiro": mineiro.url,
};

/** Devolve o PNG transparente local exato; senão usa a imagem da Shopify. */
export function getProductImage(handle: string, fallback?: string | null): string | null {
  const canonicalHandle = canonicalProductHandle(handle);
  return COMMERCIAL_IMAGE_MAP[canonicalHandle] ?? fallback ?? null;
}
