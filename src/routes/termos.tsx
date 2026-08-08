import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/termos")({
  head: () => ({
    title: "Termos de Uso — Temperanzza",
    meta: [
      { name: "description", content: "Termos e condições para uso do site e compras na Temperanzza." },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight mb-8">Termos de Uso</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80 leading-relaxed">
          <p>Ao acessar o site da Temperanzza, você concorda em cumprir estes termos de serviço e todas as leis e regulamentos aplicáveis.</p>
          
          <h2 className="text-xl font-bold text-foreground">1. Condições de Compra</h2>
          <p>Todas as compras estão sujeitas à disponibilidade de estoque. Os preços estão sujeitos a alterações sem aviso prévio, mas o valor cobrado será o vigente no momento da finalização do pedido.</p>
          
          <h2 className="text-xl font-bold text-foreground">2. Pagamento</h2>
          <p>Aceitamos as formas de pagamento indicadas no checkout, incluindo cartões de crédito e PIX. O processamento é realizado por parceiros financeiros seguros.</p>
          
          <h2 className="text-xl font-bold text-foreground">3. Entrega</h2>
          <p>Os prazos de entrega são calculados no fechamento do pedido com base no seu endereço e na modalidade de frete escolhida. A Temperanzza se esforça para cumprir os prazos, mas atrasos podem ocorrer por motivos logísticos externos.</p>
          
          <h2 className="text-xl font-bold text-foreground">4. Uso do Site</h2>
          <p>É proibido utilizar o site para qualquer finalidade ilegal ou que possa danificar a infraestrutura da plataforma.</p>
        </div>
      </div>
    </SiteLayout>
  );
}
