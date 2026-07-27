import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { CheckCircle, Package, MessageCircle, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const LOGO_URL =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        // Try Supabase first
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("order_number", orderNumber)
          .single();

        if (data) {
          // Load items
          const { data: items } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", data.id);
          setOrder({ ...data, items: items || [] });
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to localStorage
      }

      // Fallback to localStorage
      const stored = localStorage.getItem("veste_orders");
      if (stored) {
        try {
          const orders = JSON.parse(stored);
          const found = orders.find((o: any) => o.number === orderNumber);
          if (found) {
            setOrder(found);
          }
        } catch {
          // ignore
        }
      }
      setLoading(false);
    };

    if (orderNumber) loadOrder();
  }, [orderNumber]);

  const whatsappMessage = order
    ? `Olá! Gostaria de atendimento sobre o pedido ${orderNumber}.`
    : "Olá! Gostaria de atendimento da VesteRetro.";

  const whatsappUrl = `https://wa.me/5511987516823?text=${encodeURIComponent(whatsappMessage)}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B0B] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#D6A632]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B0B] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={LOGO_URL} alt="VesteRetro" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="w-20 h-20 rounded-full bg-[var(--success)]/10 border border-[var(--success)]/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[var(--success)]" />
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-4">
          Pedido Confirmado!
        </h1>
        <p className="text-muted-foreground mb-2">
          Seu pedido foi registrado com sucesso.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          Em breve você receberá um e-mail com os detalhes.
        </p>

        <div className="bg-surface border border-border rounded-sm p-6 mb-8">
          <Package className="w-8 h-8 text-[var(--gold)] mx-auto mb-3" />
          <p className="text-[10px] uppercase tracking-widest text-[var(--gold)] mb-1">
            Nº do Pedido
          </p>
          <p className="text-lg font-bold text-foreground tracking-wider">
            {orderNumber}
          </p>
        </div>

        {order && (
          <div className="bg-surface border border-border rounded-sm p-4 mb-6 text-left">
            <p className="text-xs text-muted-foreground mb-3">Resumo:</p>
            {order.items?.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
                {item.image_url && (
                  <img src={item.image_url} alt="" className="w-8 h-10 object-cover rounded-sm" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">{item.name || item.product_name}</p>
                  <p className="text-[10px] text-muted-foreground">Tam: {item.size} · Qtd: {item.quantity || 1}</p>
                </div>
              </div>
            ))}
            <div className="border-t border-border mt-3 pt-3">
              <p className="text-sm font-bold text-[var(--gold)]">
                Total: R$ {Number(order.total || 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to={`/rastreamento?pedido=${orderNumber}`}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 btn-gold rounded-md text-sm font-semibold uppercase tracking-wider"
          >
            Acompanhar Pedido
            <Package className="w-4 h-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-[var(--success)]/40 text-[var(--success)] text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[var(--success)]/10 transition-all"
          >
            Falar no WhatsApp
            <MessageCircle className="w-4 h-4" />
          </a>

          <Link
            to="/todos-os-produtos"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm text-muted-foreground hover:text-[var(--gold)] transition-colors"
          >
            Continuar Comprando
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
