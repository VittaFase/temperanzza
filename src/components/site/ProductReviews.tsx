import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, Loader2, PenLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchApprovedReviews,
  submitReview,
  averageRating,
  reviewSchema,
  type ReviewInput,
} from "@/lib/reviews";

function Stars({ value, size = 5 }: { value: number; size?: number }) {
  return (
    <div className="flex" aria-label={`${value} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-${size} w-${size} ${
            i <= Math.round(value) ? "text-accent fill-accent" : "text-foreground/25"
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}

const EMPTY: ReviewInput = { author_name: "", rating: 5, title: "", body: "", city: "" };

/** Avaliações reais de clientes. Nada é gerado: só entra o que o cliente escreveu e a casa aprovou. */
export function ProductReviews({ handle, title }: { handle: string; title: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ReviewInput>(EMPTY);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["product-reviews", handle],
    queryFn: () => fetchApprovedReviews(handle),
  });

  const avg = averageRating(reviews);

  const mutation = useMutation({
    mutationFn: () => submitReview(handle, form),
    onSuccess: () => {
      toast.success("Avaliação recebida", {
        description: "A casa lê cada uma antes de publicar. Obrigado por cozinhar com a gente.",
      });
      setForm(EMPTY);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["product-reviews", handle] });
    },
    onError: () => {
      toast.error("Não conseguimos registrar sua avaliação agora. Tente novamente em instantes.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = reviewSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revise os campos.");
      return;
    }
    mutation.mutate();
  }

  return (
    <section className="mt-6 border border-foreground/15 p-6 sm:p-8" aria-labelledby="avaliacoes">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Stars value={avg ?? 0} />
          <h3 id="avaliacoes" className="font-display uppercase tracking-widest text-xs text-muted-foreground">
            {isLoading
              ? "Carregando avaliações"
              : avg
                ? `${avg.toFixed(1)} de 5 · ${reviews.length} avaliação${reviews.length > 1 ? "ões" : ""} de quem cozinhou`
                : "Ainda não há avaliações deste tempero"}
          </h3>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen((v) => !v)}
          className="rounded-none min-h-[44px] font-display uppercase tracking-widest text-xs"
        >
          <PenLine className="h-4 w-4 mr-2" aria-hidden />
          {open ? "Fechar" : "Avaliar este pote"}
        </Button>
      </div>

      {!isLoading && reviews.length === 0 && (
        <p className="mt-3 text-sm text-foreground/70 max-w-2xl leading-relaxed">
          Só publicamos avaliação de quem realmente cozinhou com o pote. Se você já usou
          {" "}
          {title}, escreva para a casa — a sua nota entra aqui, com o seu nome.
        </p>
      )}

      {reviews.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="border border-foreground/10 bg-brand-cream/60 bg-paper-grain p-5">
              <Stars value={r.rating} size={4} />
              {r.title && (
                <h4 className="mt-3 font-display font-black uppercase text-base leading-[1.05]">{r.title}</h4>
              )}
              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">{r.body}</p>
              <p className="mt-3 font-display uppercase tracking-widest text-[10px] text-muted-foreground">
                {r.author_name}
                {r.city ? ` · ${r.city}` : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <form onSubmit={handleSubmit} className="mt-6 border-t border-foreground/15 pt-6 grid gap-4 max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="font-display uppercase tracking-widest text-[11px] text-muted-foreground">
              Sua nota
            </span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, rating: i }))}
                  aria-label={`Dar nota ${i}`}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Star
                    className={`h-6 w-6 ${i <= form.rating ? "text-accent fill-accent" : "text-foreground/25"}`}
                    aria-hidden
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
              placeholder="Seu nome"
              maxLength={60}
              required
              className="rounded-none h-12"
            />
            <Input
              value={form.city ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="Cidade (opcional)"
              maxLength={60}
              className="rounded-none h-12"
            />
          </div>

          <Input
            value={form.title ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Título da avaliação (opcional)"
            maxLength={90}
            className="rounded-none h-12"
          />

          <Textarea
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="O que você preparou com este tempero? Conte o prato e o resultado."
            maxLength={1200}
            required
            rows={5}
            className="rounded-none"
          />

          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-none h-12 bg-accent text-accent-foreground hover:bg-foreground font-display uppercase tracking-widest text-xs"
            >
              {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar avaliação"}
            </Button>
            <p className="text-xs text-muted-foreground leading-snug">
              A casa lê cada avaliação antes de publicar. Não pedimos e-mail nem telefone.
            </p>
          </div>
        </form>
      )}
    </section>
  );
}
