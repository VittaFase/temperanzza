import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const recipeSubmissionSchema = z.object({
  author_name: z.string().min(2, "Diga seu nome."),
  email: z.string().email("E-mail inválido."),
  category: z.string().min(1, "Escolha uma categoria."),
  content: z.string().min(20, "A receita está muito curta."),
  used_condiments: z.array(z.string()).min(1, "Selecione ao menos um condimento."),
});

export type RecipeSubmissionInput = z.infer<typeof recipeSubmissionSchema>;

export const submitRecipe = createServerFn({ method: "POST" })
  .inputValidator((data) => recipeSubmissionSchema.parse(data))
  .handler(async ({ data }) => {
    // 1. Salvar no Supabase (Log técnico)
    const { error } = await supabase.from("recipe_submissions").insert({
      author_name: data.author_name,
      email: data.email,
      category: data.category,
      content: data.content,
      used_condiments: data.used_condiments,
    });

    if (error) throw error;

    // 2. Encaminhar para o e-mail (Simulação de log no servidor)
    // Em um ambiente real com Resend/SendGrid, o disparo ocorreria aqui.
    console.log(`[RECIPE SUBMISSION] Encaminhando receita de ${data.author_name} (${data.email}) para receitastemperanzza@gmail.com`);
    
    return { success: true };
  });
