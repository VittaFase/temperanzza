import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
  return (
    <section className="py-20 bg-brand-paper">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-4xl font-display uppercase mb-12 text-center">Dúvidas Frequentes</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Os temperos contêm sal?</AccordionTrigger>
            <AccordionContent>Sim, alguns de nossos blends contêm sal marinho de alta qualidade para realçar o sabor.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>São adequados para a dieta carnívora?</AccordionTrigger>
            <AccordionContent>Sim, temos blends específicos que respeitam os princípios da dieta carnívora flexível.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
