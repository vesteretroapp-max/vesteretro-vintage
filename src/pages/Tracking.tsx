import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const statusTimeline: Record<string, { label: string; icon: any; color: string }[]> = {
  awaiting_payment: [
    { label: "Pedido recebido", icon: Package, color: "text-[var(--gold)]" },
    { label: "Aguardando pagamento", icon: Clock, color: "text-[var(--gold)]" },
    { label: "Pagamento confirmado", icon: CheckCircle, color: "text-muted-foreground" },
    { label: "Em separação", icon: Package, color: "text-muted-foreground" },
    { label: "Enviado", icon: Truck, color: "text-muted-foreground" },
    { label: "Entregue", icon: CheckCircle, color: "text-muted-foreground" },
  ],
  paid: [
    { label: "Pedido recebido", icon: Package, color: "text-[var(--success)]" },
    { label: "Aguardando pagamento", icon: Clock, color: "text-[var(--success)]" },
    { label: "Pagamento confirmado", icon: CheckCircle, color: "text-[var(--success)]" },
    { label: "Em separação", icon: Package, color: "text-[var(--gold)]" },
    { label: "Enviado", icon: Truck, color: "text-muted-foreground" },
    { label: "Entregue", icon: CheckCircle, color: "text-muted-foreground" },
  ],
  shipped: [
    { label: "Pedido recebido", icon: Package, color: "text-[var(--success)]" },
    { label: "Aguardando pagamento", icon: Clock, color: "text-[var(--success)]" },
    { label: "Pagamento confirmado", icon: CheckCircle, color: "text-[var(--success)]" },
    { label: "Em separação", icon: Package, color: "text-[var(--success)]" },
    { label: "Enviado", icon: Truck, color: "text-[var(--gold)]" },
    { label: "Entregue", icon: CheckCircle, color: "text-muted-foreground" },
  ],
  delivered: [
    { label: "Pedido recebido", icon: Package, color: "text-[var(--success)]" },
    { label: "Aguardando pagamento", icon: Clock, color: "text-[var(--success)]" },
    { label: "Pagamento confirmado", icon: CheckCircle, color: "text-[var(--success)]" },
    { label: "Em separação", icon: Package, color: "text-[var(--success)]" },
    { label: "Enviado", icon: Truck, color: "text-[var(--success)]" },
    { label: "Entregue", icon: CheckCircle, color: "text-[var(--success)]" },
  ],
  cancelled: [
    { label: "Pedido recebido", icon: Package, color: "text-muted-foreground" },
    { label: "Cancelado", icon: XCircle, color: "text-destructive" },
  ],
};

const statusLabels: Record<string, string> = {
  awaiting_payment: "Aguardando pagamento",
  paid: "Pago",
  processing: "Em separação",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export default function Tracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      // Try Supabase
      const { data, error: dbError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber.trim())
        .single();

      if (data && !dbError) {
        if (email && data.customer_email !== email) {
          setError("E-mail não corresponde ao pedido informado.");
          setLoading(false);
          return;
        }
        setOrder({ ...data, source: "supabase" });
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
        const found = orders.find((o: any) => o.number === orderNumber.trim());
        if (found) {
          if (email && found.customer_email !== email) {
            setError("E-mail não corresponde ao pedido informado.");
          } else {
            setOrder({ ...found, source: "local" });
          }
        } else {
          setError("Pedido não encontrado. Verifique o número e tente novamente.");
        }
      } catch {
        setError("Erro ao buscar pedido. Tente novamente.");
      }
    } else {
      setError("Pedido não encontrado. Verifique o número e tente novamente.");
    }

    setLoading(false);
  };

  const whatsappMessage = order
    ? `Olá! Gostaria de atendimento sobre o pedido ${orderNumber}.`
    : "Olá! Gostaria de atendimento da VesteRetro.";
  const whatsappUrl = `https://wa.me/5511987516823?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-surface border-b border-border">
        <div className="container-vr py-12 lg:py-16 text-center">
          <Package className="w-10 h-10 text-[var(--gold)] mx-auto mb-4" />
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            Rastrear{" "}
            <span className="text-[var(--gold)]">Pedido</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Acompanhe o status da sua entrega.
          </p>
        </div>
      </div>

      <div className="container-vr py-8 max-w-lg">
        <form onSubmit={handleTrack} className="bg-surface border border-border rounded-sm p-6 space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">
              Número do Pedido
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Ex: VR-2026-XXXX"
              className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">
              E-mail ou CPF (opcional)
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail usado no pedido"
              className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="w-full btn-gold rounded-md py-3 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                Rastrear
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-sm">
            <p className="text-xs text-destructive text-center">{error}</p>
          </div>
        )}

        {order && (
          <div className="mt-8 space-y-6">
            {/* Status */}
            <div className="bg-surface border border-border rounded-sm p-6 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Pedido #{order.order_number || order.number}
              </p>
              <p className="text-sm text-foreground">
                {new Date(order.created_at || order.date).toLocaleDateString("pt-BR")}
              </p>
            </div>

            {/* Timeline */}
            {(statusTimeline[order.status || "awaiting_payment"] || statusTimeline.awaiting_payment).map(
              (step: any, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${step.color}`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    {i < (statusTimeline[order.status] || []).length - 1 && (
                      <div className="w-px h-8 bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`text-sm ${step.color}`}>{step.label}</p>
                  </div>
                </div>
              )
            )}

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="bg-surface border border-border rounded-sm p-4">
                <p className="text-[10px] uppercase tracking-wider text-[var(--gold)] mb-3">Itens</p>
                {order.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
                    {(item.image_url || item.image) && (
                      <img src={item.image_url || item.image} alt="" className="w-10 h-12 object-cover rounded-sm" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{item.product_name || item.name}</p>
                      <p className="text-[10px] text-muted-foreground">Tam: {item.size} · Qtd: {item.quantity || 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Address */}
            {order.shipping_address && (
              <div className="bg-surface border border-border rounded-sm p-4">
                <p className="text-[10px] uppercase tracking-wider text-[var(--gold)] mb-2">Endereço de entrega</p>
                <p className="text-sm text-foreground">{order.shipping_address}</p>
              </div>
            )}

            {/* Actions */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-[var(--success)]/40 text-[var(--success)] text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[var(--success)]/10 transition-all"
            >
              Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
