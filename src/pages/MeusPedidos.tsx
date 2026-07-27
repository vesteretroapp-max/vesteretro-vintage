import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, ChevronRight, Eye, Loader2 } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/lib/supabase";

interface OrderItem {
  product_name: string;
  image_url: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  total: number;
  status: string;
  payment_method: string;
  items: OrderItem[];
}

const statusStyles: Record<string, string> = {
  pending: "text-[#D6A632] border-[#D6A632]/30",
  awaiting_payment: "text-[#D6A632] border-[#D6A632]/30",
  payment_review: "text-[#D6A632] border-[#D6A632]/30",
  paid: "text-[#2EA66B] border-[#2EA66B]/30",
  processing: "text-[#D6A632] border-[#D6A632]/30",
  shipped: "text-[#2EA66B] border-[#2EA66B]/30",
  delivered: "text-[#2EA66B] border-[#2EA66B]/30",
  cancelled: "text-[#C94B4B] border-[#C94B4B]/30",
  refunded: "text-[#C94B4B] border-[#C94B4B]/30",
};

const statusLabels: Record<string, string> = {
  pending: "Aguardando pagamento",
  awaiting_payment: "Aguardando pagamento",
  payment_review: "Pagamento em análise",
  paid: "Pago",
  processing: "Em separação",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

export default function MeusPedidos() {
  const { user } = useSupabaseAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      // Try localStorage for guest orders
      const stored = localStorage.getItem("veste_orders");
      if (stored) {
        try {
          setOrders(JSON.parse(stored));
        } catch {
          setOrders([]);
        }
      }
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Load items for each order
      const ordersWithItems = await Promise.all(
        (data || []).map(async (order: any) => {
          const { data: items } = await supabase
            .from("order_items")
            .select("product_name, image_url, quantity, unit_price")
            .eq("order_id", order.id);
          return { ...order, items: items || [] };
        })
      );

      setOrders(ordersWithItems);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Não foi possível carregar seus pedidos.");
      // Fallback to localStorage
      const stored = localStorage.getItem("veste_orders");
      if (stored) {
        try {
          setOrders(JSON.parse(stored));
        } catch {
          setOrders([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B0B] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#D6A632]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-surface border-b border-border">
        <div className="container-vr py-8 lg:py-12">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            Meus{" "}
            <span className="text-[var(--gold)]">Pedidos</span>
          </h1>
        </div>
      </div>

      <div className="container-vr py-8">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-[var(--gold)]/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Nenhum pedido ainda
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Seus pedidos aparecerão aqui após a primeira compra.
            </p>
            <Link
              to="/todos-os-produtos"
              className="btn-gold rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              Comprar agora
            </Link>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface border border-border rounded-sm p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Pedido #{order.order_number}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 border rounded-sm ${
                      statusStyles[order.status] || "text-muted-foreground"
                    }`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="w-12 h-14 bg-background rounded-sm overflow-hidden"
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{order.items.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--gold)]">
                    R$ {Number(order.total).toFixed(2)}
                  </span>
                  <Link
                    to={`/pedido/${order.order_number}`}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--gold)] hover:underline"
                  >
                    Ver detalhes
                    <Eye className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
