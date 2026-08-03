import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Instagram, MessageCircle, Printer } from "lucide-react";
import { toast } from "sonner";

const BASE = "https://temperanzza.com.br";

/**
 * Linha de ações da receita — compartilhar e imprimir.
 * Mantém a assinatura da casa: sem cantos arredondados, estêncil em maiúsculas,
 * traço fino como separador.
 */
export function RecipeShareBar({
  slug,
  title,
  tagline,
}: {
  slug: string;
  title: string;
  tagline: string;
}) {
  // URL só é lida do browser após a hidratação (evita divergência SSR/cliente)
  const [url, setUrl] = useState(`${BASE}/cozinha/${slug}`);
  useEffect(() => setUrl(window.location.href), [slug]);

  const waText = encodeURIComponent(`${title}\n\n${tagline}\n\n${url}`);
  const mailto = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
    `${tagline}\n\n${url}`,
  )}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado! Cole no story ou direct do Instagram.");
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  };

  const cls =
    "inline-flex min-h-[44px] items-center gap-2 border border-brand-paper/30 hover:border-brand-mustard hover:text-brand-mustard px-4 py-3 font-display uppercase tracking-[0.2em] text-[11px] text-brand-paper/85 transition-colors";

  return (
    <div className="mt-10 border-t border-brand-paper/20 pt-6 max-w-xl">
      <p className="text-[10px] font-display uppercase tracking-[0.4em] text-brand-paper/50 mb-4">
        Compartilhar esta receita
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={`https://wa.me/?text=${waText}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no WhatsApp"
          className={cls}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copiar link para o Instagram"
          className={cls}
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </button>
        <a href={mailto} aria-label="Enviar receita por e-mail" className={cls}>
          <Mail className="h-4 w-4" />
          E-mail
        </a>
        <Link
          to="/imprimir/$slug"
          params={{ slug }}
          target="_blank"
          aria-label="Abrir versão para impressão"
          className={cls}
        >
          <Printer className="h-4 w-4" />
          Imprimir
        </Link>
      </div>
    </div>
  );
}
