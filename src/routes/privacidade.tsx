import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    title: "Política de Privacidade — Temperanzza",
    meta: [
      { name: "description", content: "Saiba como a Temperanzza protege seus dados pessoais de acordo com a LGPD." },
    ],
  }),
  component: PrivacidadePage,
});

function PrivacidadePage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight mb-8">Política de Privacidade</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-foreground/80 leading-relaxed">
          <p>A Temperanzza valoriza sua privacidade e está comprometida em proteger seus dados pessoais. Esta política descreve como coletamos e usamos suas informações.</p>
          
          <h2 className="text-xl font-bold text-foreground">1. Coleta de Dados</h2>
          <p>Coletamos dados que você nos fornece diretamente ao fazer um pedido ou entrar em contato, incluindo nome, e-mail, endereço de entrega e dados de pagamento processados por nossos parceiros financeiros.</p>
          
          <h2 className="text-xl font-bold text-foreground">2. Finalidade do Uso</h2>
          <p>Seus dados são utilizados para processar pedidos, realizar entregas, fornecer suporte ao cliente e, opcionalmente, enviar comunicações de marketing que você pode cancelar a qualquer momento.</p>
          
          <h2 className="text-xl font-bold text-foreground">3. Compartilhamento com Terceiros</h2>
          <p>Compartilhamos informações apenas com parceiros essenciais para a operação, como transportadoras, gateways de pagamento e ferramentas de análise (como o Google Analytics), sempre de forma segura.</p>
          
          <h2 className="text-xl font-bold text-foreground">4. Seus Direitos (LGPD)</h2>
          <p>Sob a Lei Geral de Proteção de Dados, você tem o direito de acessar, corrigir ou excluir seus dados pessoais. Para exercer esses direitos, entre em contato conosco.</p>
          
          <h2 className="text-xl font-bold text-foreground">5. Contato</h2>
          <p>Para dúvidas sobre privacidade, envie um e-mail para <a href="mailto:contatotemperanzza@gmail.com" className="text-accent underline">contatotemperanzza@gmail.com</a>.</p>
        </div>
      </div>
    </SiteLayout>
  );
}
