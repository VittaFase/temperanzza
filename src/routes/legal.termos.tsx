import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso — Temperanzza" },
      { name: "description", content: "Condições de compra e uso do site Temperanzza." },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <div className="prose-sm sm:prose max-w-none text-foreground/80 leading-relaxed">
      <h1 className="font-display font-black uppercase text-4xl sm:text-5xl tracking-tight mb-8 text-foreground">
        Termos de Uso
      </h1>
      
      <p>
        Ao acessar o site da Temperanzza, você concorda em cumprir estes termos de serviço e todas as leis e regulamentos aplicáveis.
      </p>

      <h2 className="font-display font-black uppercase text-xl mt-10 mb-4 text-foreground">
        1. Condições de Compra
      </h2>
      <p>
        Todas as compras estão sujeitas à disponibilidade de estoque. Os preços estão sujeitos a alterações sem aviso prévio, mas o valor cobrado será o vigente no momento da finalização do pedido.
      </p>

      <h2 className="font-display font-black uppercase text-xl mt-10 mb-4 text-foreground">
        2. Pagamento
      </h2>
      <p>
        Aceitamos as formas de pagamento indicadas no checkout, incluindo cartões de crédito e PIX. O processamento é realizado por parceiros financeiros seguros.
      </p>

      <h2 className="font-display font-black uppercase text-xl mt-10 mb-4 text-foreground">
        3. Entrega
      </h2>
      <p>
        Os prazos de entrega são calculados no fechamento do pedido com base no seu endereço e na modalidade de frete escolhida. A Temperanzza se esforça para cumprir os prazos, mas atrasos podem ocorrer por motivos logísticos externos.
      </p>

      <h2 className="font-display font-black uppercase text-xl mt-10 mb-4 text-foreground">
        4. Uso do Site
      </h2>
      <p>
        É proibido utilizar o site para qualquer finalidade ilegal ou que possa danificar a infraestrutura da plataforma.
      </p>
    </div>
  );
}
