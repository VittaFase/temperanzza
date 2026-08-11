import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Handshake, Camera, Percent, Sparkles, Send } from "lucide-react";

import { BrandSeal } from "@/components/site/BrandSeal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ambassadorSchema,
  submitAmbassadorApplication,
  AUDIENCE_SIZES,
  PROFILE_TYPES,
  EMPTY_AMBASSADOR,
  type AmbassadorInput,
} from "@/lib/ambassadors";
import { trackEvent } from "@/lib/analytics";

const URL = "https://temperanzza.com.br/cozinhe-conosco";
const TITLE = "Cozinhe com a Temperanzza — Programa de Parceria";
const DESCRIPTION =
  "Buscamos chefs, criadores e apaixonados pela boa mesa para levar a essência mineira a mais cozinhas. Programa de parceria Temperanzza.";


export const Route = createFileRoute("/embaixadores")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          url: URL,
          description: DESCRIPTION,
          isPartOf: { "@type": "WebSite", name: "Temperanzza", url: "https://temperanzza.com.br" },
        }),
      },
    ],
  }),
  component: EmbaixadoresPage,
  errorComponent: () => (
    <div className="mx-auto max-w-3xl py-24 px-6 text-center">
      <h1 className="font-display uppercase text-4xl">Erro ao carregar</h1>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl py-24 px-6 text-center">
      <h1 className="font-display uppercase text-4xl">Página não encontrada</h1>
    </div>
  ),
});

const PILLARS = [
  {
    icon: Percent,
    title: "Condição de Parceiro",
    body: "Cupom pessoal para sua audiência e preço diferenciado nas suas próprias compras — sem meta agressiva.",

  },
  {
    icon: Camera,
    title: "Kit para conteúdo",
    body: "Potes reais da linha que combina com sua cozinha, enviados lote a lote, para você gravar com o produto na bancada.",
  },
  {
    icon: Sparkles,
    title: "Coautoria de Conteúdo",
    body: "Parceiros ativos participam de testes de blends e podem assinar uma receita na Cozinha Temperanzza.",

  },
  {
    icon: Handshake,
    title: "Vitrine da casa",
    body: "Suas receitas e fotos entram na nossa Cozinha e no Blog com crédito e link direto para o seu perfil.",
  },
];

const STEPS = [
  "Você envia a candidatura com seu perfil e o que cozinha.",
  "A casa lê uma a uma — sem robô, sem resposta automática.",
  "Se fizer sentido, conversamos por e-mail e alinhamos o formato.",
  "Kit enviado, cupom criado e sua primeira receita entra na Cozinha.",
];

function EmbaixadoresPage() {
  const [form, setForm] = useState<AmbassadorInput>(EMPTY_AMBASSADOR);
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => submitAmbassadorApplication(form),
    onSuccess: () => {
      trackEvent("generate_lead", { value: 0, currency: "BRL" });
      setForm(EMPTY_AMBASSADOR);
      setSent(true);
      toast.success("Candidatura recebida", {
        description: "A casa lê cada uma. Se fizer sentido, respondemos pelo e-mail informado.",
      });
    },
    onError: () => {
      toast.error("Não conseguimos registrar sua candidatura agora. Tente novamente em instantes.");
    },
  });

  function set<K extends keyof AmbassadorInput>(key: K, value: AmbassadorInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = ambassadorSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revise os campos.");
      return;
    }
    mutation.mutate();
  }

  const fieldClass = "rounded-none border-foreground/25 bg-background";

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO */}
      <section className="border-b border-foreground/15 bg-brand-cream bg-paper-grain py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <BrandSeal size="lg" className="mb-6" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Programa de embaixadores
          </span>
          <h1 className="font-display font-black uppercase text-5xl sm:text-6xl lg:text-7xl mt-3 tracking-tight leading-[0.92]">
            Cozinhe com <br />a Temperanzza
          </h1>
          <p className="mt-6 max-w-2xl font-serif italic text-xl text-foreground/80 leading-relaxed">
            Não procuramos número de seguidor. Procuramos gente que cozinha de verdade e sabe
            explicar por que aquele tempero mudou o prato.
          </p>
          <a
            href="#candidatura"
            className="mt-8 inline-flex items-center gap-2 bg-accent px-6 py-4 font-display font-black uppercase tracking-widest text-sm text-accent-foreground hover:bg-foreground hover:text-background"
          >
            Quero Cozinhar com a Casa

          </a>
        </div>
      </section>

      {/* PILARES */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight">
            O que a casa oferece
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="border border-foreground/15 bg-brand-cream/50 bg-paper-grain p-6 lg:p-7"
              >
                <p.icon className="h-5 w-5 text-accent" aria-hidden />
                <h3 className="mt-4 font-display font-black uppercase text-xl leading-tight">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-foreground/15 bg-brand-ink text-brand-paper py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight">
            Como funciona
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s} className="border-t-2 border-accent pt-4">
                <span className="font-display font-black text-4xl text-accent leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-sm text-brand-paper/80 leading-relaxed">{s}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-brand-paper/60">
            Ainda não conhece a linha?{" "}
            <Link to="/produtos" className="text-accent underline underline-offset-4">
              Veja o catálogo completo
            </Link>{" "}
            ou{" "}
            <Link to="/cozinha" search={{ refeicao: "", proteina: "" }} className="text-accent underline underline-offset-4">
              explore a Cozinha Temperanzza
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CANDIDATURA */}
      <section id="candidatura" className="py-16 sm:py-20 scroll-mt-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display font-black uppercase text-3xl sm:text-4xl tracking-tight">
            Sua candidatura
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Levamos alguns dias para responder porque lemos tudo. Seus dados ficam só com a casa.
          </p>

          {sent ? (
            <div className="mt-8 border-2 border-accent bg-brand-cream/60 bg-paper-grain p-8">
              <h3 className="font-display font-black uppercase text-2xl">Recebemos sua história</h3>
              <p className="mt-3 text-foreground/80 leading-relaxed">
                Obrigado por querer cozinhar com a gente. Se o perfil casar com a casa, você recebe
                um e-mail nosso — sem robô no meio do caminho.
              </p>
              <Button
                variant="outline"
                className="mt-6 rounded-none"
                onClick={() => setSent(false)}
              >
                Enviar outra candidatura
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="full_name" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                    Nome completo *
                  </label>
                  <Input
                    id="full_name"
                    className={fieldClass}
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                    maxLength={80}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className={fieldClass}
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    maxLength={120}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                    WhatsApp
                  </label>
                  <Input
                    id="phone"
                    className={fieldClass}
                    value={form.phone ?? ""}
                    onChange={(e) => set("phone", e.target.value)}
                    maxLength={30}
                  />
                </div>
                <div>
                  <label htmlFor="instagram" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                    Instagram
                  </label>
                  <Input
                    id="instagram"
                    className={fieldClass}
                    placeholder="@seuperfil"
                    value={form.instagram ?? ""}
                    onChange={(e) => set("instagram", e.target.value)}
                    maxLength={60}
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                    Cidade
                  </label>
                  <Input
                    id="city"
                    className={fieldClass}
                    value={form.city ?? ""}
                    onChange={(e) => set("city", e.target.value)}
                    maxLength={60}
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                    Estado
                  </label>
                  <Input
                    id="state"
                    className={fieldClass}
                    value={form.state ?? ""}
                    onChange={(e) => set("state", e.target.value)}
                    maxLength={40}
                  />
                </div>
                <div>
                  <label htmlFor="profile_type" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                    Perfil *
                  </label>
                  <select
                    id="profile_type"
                    className="h-10 w-full rounded-none border border-foreground/25 bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    value={form.profile_type}
                    onChange={(e) => set("profile_type", e.target.value)}
                  >
                    {PROFILE_TYPES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="audience_size" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                    Tamanho da audiência
                  </label>
                  <select
                    id="audience_size"
                    className="h-10 w-full rounded-none border border-foreground/25 bg-background px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    value={form.audience_size ?? ""}
                    onChange={(e) => set("audience_size", e.target.value)}
                  >
                    <option value="">Prefiro não informar</option>
                    {AUDIENCE_SIZES.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-display uppercase tracking-widest text-foreground/70 mb-2">
                  O que você cozinha e por que a Temperanzza? *
                </label>
                <Textarea
                  id="message"
                  className={`${fieldClass} min-h-36`}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  maxLength={1500}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={mutation.isPending}
                className="w-full rounded-none h-14 bg-accent text-accent-foreground hover:bg-foreground font-display uppercase tracking-widest"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Enviar candidatura
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Ao enviar, você concorda que a casa entre em contato pelo e-mail informado. Nada é
                publicado sem o seu aval.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
