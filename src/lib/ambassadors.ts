import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

/** Perfis aceitos no Programa de Embaixadores da casa. */
export const PROFILE_TYPES = [
  { value: "chef", label: "Chef / cozinheiro profissional" },
  { value: "criador", label: "Criador de conteúdo gastronômico" },
  { value: "restaurante", label: "Restaurante / food service" },
  { value: "revendedor", label: "Revenda / distribuição" },
  { value: "cliente", label: "Cliente apaixonado pela casa" },
] as const;

export const AUDIENCE_SIZES = [
  "Até 1 mil",
  "1 mil a 10 mil",
  "10 mil a 50 mil",
  "50 mil a 200 mil",
  "Mais de 200 mil",
  "Não se aplica",
] as const;

export const ambassadorSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, { message: "Diga seu nome completo." })
    .max(80, { message: "Nome muito longo." }),
  email: z
    .string()
    .trim()
    .email({ message: "Informe um e-mail válido." })
    .max(120, { message: "E-mail muito longo." }),
  phone: z
    .string()
    .trim()
    .max(30, { message: "Telefone muito longo." })
    .optional()
    .or(z.literal("")),
  city: z
    .string()
    .trim()
    .max(60, { message: "Cidade muito longa." })
    .optional()
    .or(z.literal("")),
  state: z
    .string()
    .trim()
    .max(40, { message: "Estado muito longo." })
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .trim()
    .max(60, { message: "Perfil muito longo." })
    .optional()
    .or(z.literal("")),
  profile_type: z.enum(
    PROFILE_TYPES.map((p) => p.value) as [string, ...string[]],
    { message: "Escolha o perfil que mais combina com você." },
  ),
  audience_size: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, { message: "Conte um pouco mais sobre sua cozinha (mínimo 20 caracteres)." })
    .max(1500, { message: "Texto muito longo." }),
});

export type AmbassadorInput = z.infer<typeof ambassadorSchema>;

export const EMPTY_AMBASSADOR: AmbassadorInput = {
  full_name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  instagram: "",
  profile_type: "chef",
  audience_size: "",
  message: "",
};

const clean = (v?: string) => {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
};

/** Envia uma candidatura ao programa. Entra sempre como "em análise" — a casa lê uma a uma. */
export async function submitAmbassadorApplication(input: AmbassadorInput) {
  const parsed = ambassadorSchema.parse(input);
  const { error } = await supabase.from("ambassador_applications").insert({
    full_name: parsed.full_name,
    email: parsed.email,
    phone: clean(parsed.phone),
    city: clean(parsed.city),
    state: clean(parsed.state),
    instagram: clean(parsed.instagram)?.replace(/^@/, "") ?? null,
    profile_type: parsed.profile_type,
    audience_size: clean(parsed.audience_size),
    message: parsed.message,
    status: "pending",
  });
  if (error) throw error;
}
