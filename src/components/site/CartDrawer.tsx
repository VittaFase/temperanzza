import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatBRL } from "@/lib/shopify";
import { trackEvent, toAnalyticsItem } from "@/lib/analytics";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const {
    items,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
  } = useCartStore();

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce(
    (s, i) => s + parseFloat(i.price.amount) * i.quantity,
    0,
  );

  useEffect(() => {
    if (open) syncCart();
  }, [open, syncCart]);

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) {
      trackEvent("begin_checkout", {
        currency: items[0]?.price.currencyCode ?? "BRL",
        value: totalPrice,
        items: items.map((i) =>
          toAnalyticsItem({
            handle: i.product.node.handle,
            title: i.product.node.title,
            price: i.price.amount,
            quantity: i.quantity,
          }),
        ),
      });
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-foreground/20 bg-accent text-accent-foreground hover:bg-accent/90 md:bg-transparent md:text-foreground md:hover:bg-foreground md:hover:text-background rounded-none h-11 w-11"
          aria-label="Abrir carrinho"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-accent text-accent-foreground border-0">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background border-l border-foreground/15">
        <SheetHeader className="flex-shrink-0 border-b border-foreground/15 pb-4">
          <SheetTitle className="font-display text-2xl uppercase tracking-wide">
            Sua Sacola
          </SheetTitle>
          <SheetDescription className="text-muted-foreground">
            {totalItems === 0
              ? "Vazia — escolha seus temperos"
              : `${totalItems} ${totalItems === 1 ? "item" : "itens"}`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Sua sacola está vazia
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-3 p-3 border border-foreground/10 bg-card"
                    >
                      <div className="w-16 h-20 bg-brand-cream overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img decoding="async" loading="lazy"
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate text-sm uppercase tracking-wide">
                          {item.product.node.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.selectedOptions
                            .map((o) => o.value)
                            .filter((v) => v !== "Default Title")
                            .join(" • ")}
                        </p>
                        <p className="font-bold mt-1 text-sm">
                          {formatBRL(item.price.amount, item.price.currencyCode)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:text-accent"
                          onClick={() => {
                            trackEvent("remove_from_cart", {
                              currency: item.price.currencyCode,
                              value:
                                parseFloat(item.price.amount) * item.quantity,
                              items: [
                                toAnalyticsItem({
                                  handle: item.product.node.handle,
                                  title: item.product.node.title,
                                  price: item.price.amount,
                                  quantity: item.quantity,
                                }),
                              ],
                            });
                            removeItem(item.variantId);
                          }}
                          aria-label="Remover"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                        <div className="flex items-center gap-1 border border-foreground/15">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 sm:h-6 sm:w-6 rounded-none"
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 sm:h-6 sm:w-6 rounded-none"
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="flex-shrink-0 space-y-3 pt-4 border-t border-foreground/15 bg-background"
                style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
              >
                <div className="flex justify-between items-baseline">
                  <span className="font-display uppercase text-sm tracking-wide">
                    Subtotal
                  </span>
                  <span className="text-2xl font-bold font-display">
                    {formatBRL(totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Frete e impostos calculados no checkout.
                </p>
                <Button
                  onClick={handleCheckout}
                  className="w-full rounded-none h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-display uppercase tracking-widest text-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Finalizar Compra
                      <ExternalLink className="w-3.5 h-3.5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
