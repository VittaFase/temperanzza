import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ChefHat, Send, Check } from "lucide-react";

import { BrandSeal } from "@/components/site/BrandSeal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitRecipe, type RecipeSubmissionInput } from "@/lib/recipe-submission.functions";
import { DIETS } from "@/lib/diets";

const CONDIMENTOS = [
  "Tempero Mineiro",
  "Tempero do Edu",
  "Ervas Finas",
  "Lemon Pepper",
  "Páprica Defumada",
  "Páprica Doce",
  "Páprica Picante",
  "Chimi Churri Picante",
  "Chimi Churri sem Pimenta",
  "Salsa, Cebola e Alho",
  "Cúrcuma",
  "Pimenta do Reino",
  "Canela em Pó",
  "Temperaflix Bacon",
  "Temperaflix Ervas Finas",
  "Temperaflix Tradicional",
  "Blend do Chefe",
  "Pote Premium Black",
];

const CATEGORIES = [...DIETS.map((d) => d.name), "Cozinha Tradicional"];

const TITLE = "Cozinhe com a Temperanzza — Compartilhe sua Receita";
const DESCRIPTION =
  "Envie sua criação autoral usando os temperos da casa e participe da nossa Biblioteca Gastronômica.";

export const Route = createFileRoute("/colaborar")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://temperanzza.com.br/colaborar" }],
  }),
  component: ColaborarPage,
});

function ColaborarPage() {
  const [form, setForm] = useState<RecipeSubmissionInput>({
    author_name: "",
    email: "",
    category: "",
    content: "",
    used_condiments: [],
  });
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: RecipeSubmissionInput) => submitRecipe({ data }),
    onSuccess: () => {
      setSent(true);
      toast.success("Receita enviada!", {
        description: "A casa recebeu sua criação. Nossa equipe fará a curadoria manual.",
      });
    },
    onError: () => {
      toast.error("Erro ao enviar. Tente novamente em instantes.");
    },
  });

  const toggleCondiment = (condiment: string) => {
    setForm((prev) => ({
      ...prev,
      used_condiments: prev.used_condiments.includes(condiment)
        ? prev.used_condiments.filter((c) => c !== condiment)
        : [...prev.used_condiments, condiment],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category) return toast.error("Escolha uma categoria.");
    if (form.used_condiments.length === 0)
      return toast.error("Selecione ao menos um condimento.");
    mutation.mutate(form);
  };

  const fieldClass = "rounded-none border-foreground/25 bg-background";

  return (
    <div className="flex min-h-screen flex-col">
      <section className="border-b border-foreground/15 bg-brand-cream bg-paper-grain py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <BrandSeal size="lg" className="mb-6" />
          <span className="font-display text-xs font-black uppercase tracking-[0.3em] text-accent">
            Cozinhe com a Temperanzza
          </span>
          <h1 className="mt-3 font-display text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
            Sua Receita <br />na Nossa Cozinha
          </h1>
          <p className="mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-foreground/80">
            Compartilhe sua autoria. As melhores receitas entram na nossa Biblioteca Gastronômica com seu nome e história.
          </p>
        </div>
      </section>

      <section className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {sent ? (
            <div className="border-2 border-accent bg-brand-cream/60 bg-paper-grain p-8 text-center">
              <ChefHat className="mx-auto mb-4 h-12 w-12 text-accent" />
              <h3 className="font-display text-3xl font-black uppercase">Criação Recebida</h3>
              <p className="mx-auto mt-4 max-w-md leading-relaxed text-foreground/80">
                Obrigado por compartilhar seu segredo de cozinha. Nossa equipe fará a curadoria manual e, se aprovada, sua receita entrará na Biblioteca.
              </p>
              <Button
                variant="outline"
                className="mt-8 rounded-none border-accent text-accent hover:bg-accent hover:text-white"
                onClick={() => {
                  setSent(false);
                  setForm({
                    author_name: "",
                    email: "",
                    category: "",
                    content: "",
                    used_condiments: [],
                  });
                }}
              >
                Enviar outra receita
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block font-display text-xs uppercase tracking-widest text-foreground/70">
                    Seu Nome *
                  </label>
                  <Input
                    className={fieldClass}
                    value={form.author_name}
                    onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block font-display text-xs uppercase tracking-widest text-foreground/70">
                    Seu E-mail *
                  </label>
                  <Input
                    type="email"
                    className={fieldClass}
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-4 block font-display text-xs uppercase tracking-widest text-foreground/70">
                  Estilo de Vida / Categoria *
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, category: cat }))}
                      className={`border px-3 py-2 font-display text-[10px] uppercase tracking-widest transition-colors ${
                        form.category === cat
                          ? "border-accent bg-accent text-white"
                          : "border-foreground/20 bg-white hover:border-accent"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-4 block font-display text-xs uppercase tracking-widest text-foreground/70">
                  Condimentos Utilizados *
                </label>
                <div className="flex flex-wrap gap-2">
                  {CONDIMENTOS.map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => toggleCondiment(cond)}
                      className={`flex items-center gap-1.5 border px-3 py-1.5 font-display text-[9px] uppercase tracking-widest transition-colors ${
                        form.used_condiments.includes(cond)
                          ? "border-brand-ink bg-brand-ink text-white"
                          : "border-foreground/15 bg-white hover:border-foreground/40"
                      }`}
                    >
                      {form.used_condiments.includes(cond) && <Check className="h-3 w-3" />}
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block font-display text-xs uppercase tracking-widest text-foreground/70">
                  Sua Receita (Ingredientes e Preparo) *
                </label>
                <Textarea
                  className={`${fieldClass} min-h-64 p-4 text-base leading-relaxed`}
                  placeholder="Liste os ingredientes e descreva o modo de preparo..."
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={mutation.isPending}
                className="h-16 w-full rounded-none bg-accent font-display font-black uppercase tracking-[0.2em] text-accent-foreground hover:bg-brand-ink"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar para Curadoria
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
