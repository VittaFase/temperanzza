import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      q: "Os temperos contêm sal?",
      a: "Sim, alguns de nossos blends contêm sal marinho de alta qualidade para realçar o sabor e auxiliar na conservação natural. Verifique a lista de ingredientes em cada produto."
    },
    {
      q: "São adequados para a dieta carnívora?",
      a: "Sim, nossos blends são 100% naturais e ideais para a dieta carnívora flexível, ajudando a manter a adesão ao protocolo sem adicionar antinutrientes ou inflamatórios."
    },
    {
      q: "Qual a diferença dos temperos de supermercado?",
      a: "Não usamos 'enchimentos' como amido, açúcar, maltodextrina ou conservantes. Você paga por especiarias puras e frescas, moídas em pequenos lotes."
    },
    {
      q: "Como conservar meus temperos Temperanzza?",
      a: "Mantenha em local seco, fresco e ao abrigo da luz. Nossos potes são herméticos para preservar o aroma por mais tempo."
    }
  ];

  return (
    <section className="py-32 bg-brand-paper border-t border-brand-ink/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-20">
          <span className="text-accent font-display uppercase tracking-[0.4em] text-xs mb-4 block">
            Suporte
          </span>
          <h2 className="font-display text-5xl uppercase text-brand-ink">Dúvidas Frequentes</h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-brand-ink/10">
              <AccordionTrigger className="font-display uppercase tracking-widest text-left hover:text-accent py-6 text-sm">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-serif italic text-lg text-brand-ink/70 pb-8">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
