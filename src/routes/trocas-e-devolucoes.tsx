import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/trocas-e-devolucoes")({
  head: () => ({
    title: "Trocas e Devoluções — Temperanzza",
    meta: [
      { name: "description", content: "Saiba como funciona o processo de troca e devolução na Temperanzza." },
    ],
    links: [{ rel: "canonical", href: "https://temperanzza.com.br/trocas-e-devolucoes" }],
  }),
  component: TrocasDevolucoesPage,
});

function TrocasDevolucoesPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight mb-8">Trocas e Devoluções</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80 leading-relaxed">
          <p>Queremos que você tenha a melhor experiência possível. Se precisar trocar ou devolver um produto, siga as orientações abaixo.</p>
          
          <h2 className="text-xl font-bold text-foreground">1. Direito de Arrependimento</h2>
          <p>Conforme o Código de Defesa do Consumidor, você tem até 7 (sete) dias corridos após o recebimento do produto para solicitar a devolução por arrependimento, com reembolso total do valor pago.</p>
          
          <h2 className="text-xl font-bold text-foreground">2. Condições para Troca ou Devolução</h2>
          <p>O produto deve ser devolvido em sua embalagem original, lacrado e sem indícios de uso. Como trabalhamos com gêneros alimentícios, não podemos aceitar devoluções de potes abertos, por questões de segurança alimentar.</p>
          
          <h2 className="text-xl font-bold text-foreground">3. Processo de Solicitação</h2>
          <p>Para iniciar uma troca ou devolução, entre em contato pelo e-mail <a href="mailto:contatotemperanzza@gmail.com" className="text-accent underline">contatotemperanzza@gmail.com</a> informando o número do pedido e o motivo.</p>
          
          <h2 className="text-xl font-bold text-foreground">4. Reembolso</h2>
          <p>O reembolso será processado na mesma forma de pagamento utilizada na compra, após o recebimento e conferência do produto em nosso centro de distribuição.</p>
        </div>
      </div>
    </SiteLayout>
  );
}
