import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export interface ProductReview {
  id: string;
  product_handle: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  city: string | null;
  created_at: string;
}

export const reviewSchema = z.object({
  author_name: z
    .string()
    .trim()
    .min(2, { message: "Diga como podemos te chamar." })
    .max(60, { message: "Nome muito longo." }),
  rating: z.number().int().min(1).max(5),
  title: z
    .string()
    .trim()
    .max(90, { message: "Título muito longo." })
    .optional()
    .or(z.literal("")),
  body: z
    .string()
    .trim()
    .min(10, { message: "Conte um pouco mais sobre o preparo." })
    .max(1200, { message: "Texto muito longo." }),
  city: z
    .string()
    .trim()
    .max(60, { message: "Cidade muito longa." })
    .optional()
    .or(z.literal("")),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

/** Avaliações aprovadas de um produto — só o que passou pela moderação da casa. */
export async function fetchApprovedReviews(handle: string): Promise<ProductReview[]> {
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, product_handle, author_name, rating, title, body, city, created_at")
    .eq("product_handle", handle)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(24);

  if (error) throw error;
  return (data ?? []) as ProductReview[];
}

/** Envia uma avaliação para moderação. Nunca publica direto. */
export async function submitReview(handle: string, input: ReviewInput) {
  const parsed = reviewSchema.parse(input);
  const { error } = await supabase.from("product_reviews").insert({
    product_handle: handle,
    author_name: parsed.author_name,
    rating: parsed.rating,
    title: parsed.title ? parsed.title : null,
    body: parsed.body,
    city: parsed.city ? parsed.city : null,
    status: "pending",
  });
  if (error) throw error;
}

export function averageRating(reviews: ProductReview[]) {
  if (reviews.length === 0) return null;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}
