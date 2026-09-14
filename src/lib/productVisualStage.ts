import { canonicalProductHandle } from "@/lib/rebrandCatalog";

export type ProductStageContext = "catalog" | "featured" | "pdp";

type StageGeometry = {
  imageClass: string;
  shadowClass: string;
};

const DEFAULT_GEOMETRY: Record<ProductStageContext, StageGeometry> = {
  catalog: {
    imageClass: "h-[82%] w-[72%]",
    shadowClass: "bottom-[8%] h-[5%] w-[56%]",
  },
  featured: {
    imageClass: "h-[300px] w-[76%] sm:h-[350px]",
    shadowClass: "bottom-[7%] h-[5%] w-[52%]",
  },
  pdp: {
    imageClass: "h-[80%] w-[76%] sm:h-[82%] sm:w-[74%]",
    shadowClass: "bottom-[9%] h-[5%] w-[54%]",
  },
};

const TEMPERAFLIX_GEOMETRY: Record<ProductStageContext, StageGeometry> = {
  catalog: {
    imageClass: "h-[88%] w-[82%]",
    shadowClass: "bottom-[7%] h-[5%] w-[60%]",
  },
  featured: {
    imageClass: "h-[320px] w-[84%] sm:h-[370px]",
    shadowClass: "bottom-[6%] h-[5%] w-[58%]",
  },
  pdp: {
    imageClass: "h-[86%] w-[84%] sm:h-[88%] sm:w-[82%]",
    shadowClass: "bottom-[7%] h-[5%] w-[60%]",
  },
};

/**
 * Presentation-only geometry for official product PNGs.
 * This never edits, crops or recreates the locked label artwork; it only
 * normalizes how transparent product assets occupy each storefront stage.
 */
export function getProductStageGeometry(handle: string, context: ProductStageContext): StageGeometry {
  const canonicalHandle = canonicalProductHandle(handle);
  return canonicalHandle.startsWith("temperaflix-")
    ? TEMPERAFLIX_GEOMETRY[context]
    : DEFAULT_GEOMETRY[context];
}
