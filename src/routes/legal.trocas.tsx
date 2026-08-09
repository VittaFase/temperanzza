import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/trocas")({
  head: () => ({
    meta: [
      { title: "Trocas e Devoluções — Temperanzza" },
      { name: "description", content: "Conheça nossa política de trocas e devoluções." },
    ],
  }),
  component: TrocasPage,
});

function TrocasPage() {
  return (
    <div className="prose-sm sm:prose max-w-none text-foreground/80 leading-relaxed">
      <h1 className="font-display font-black uppercase text-4xl sm:text-5xl tracking-tight mb-8 text-foreground">
        Trocas e Devoluções
      </h1>
      
      <p>
        Queremos que você tenha a melhor experiência possível. Se precisar trocar ou devolver um produto, siga as orientações abaixo.
      </p>

      <h2 className="font-display font-black uppercase text-xl mt-10 mb-4 text-foreground">
        1. Direito de Arrependimento
      </h2>
      <p>
        Conforme o Código de Defesa do Consumidor, você tem até 7 (sete) dias corridos após o recebimento do produto para solicitar a devolução por arrependimento, com reembolso total do valor pago.
      </p>

      <h2 className="font-display font-black uppercase text-xl mt-10 mb-4 text-foreground">
        2. Condições para Troca ou Devolução
      </h2>
      <p>
        O produto deve ser devolvido em sua embalagem original, lacrado e sem indícios de uso. Como trabalhamos com gêneros alimentícios, não podemos aceitar devoluções de potes abertos, por questões de segurança alimentar.
      </p>

      <h2 className="font-display font-black uppercase text-xl mt-10 mb-4 text-foreground">
        3. Processo de Solicitação
      </h2>
      <p>
        Para iniciar uma troca ou devolução, entre em contato pelo e-mail <a href="mailto:contatotemperanzza@gmail.com" className="text-accent underline font-bold">contatotemperanzza@gmail.com</a> informando o número do pedido e o motivo.
      </p>

      <h2 className="font-display font-black uppercase text-xl mt-10 mb-4 text-foreground">
        4. Reembolso
      </h2>
      <p>
        O reembolso será processado na mesma forma de pagamento utilizada na compra, após o recebimento e conferência do produto em nosso centro de distribuição.
      </p>
    </div>
  );
}
