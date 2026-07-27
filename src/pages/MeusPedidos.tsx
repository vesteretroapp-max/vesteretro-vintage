import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Package, ChevronRight, Eye } from "lucide-react";

interface Order {
  number: string;
  date: string;
  items: any[];
  total: number;
  payment: string;
  status: string;
}

export default function MeusPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("veste_orders");
    if (stored) {
      try {
        setOrders(JSON.parse(stored));
      } catch {
        setOrders([]);
      }
    }
  }, []);

  const statusStyles: Record<string, string> = {
    "Aguardando pagamento": "text-[#D6A632] border-[#D6A632]/30",
    "Pago": "text-[#2EA66B] border-[#2EA66B]/30",
    "Em separação": "text-[#D6A632] border-[#D6A632]/30",
    "Enviado": "text-[#2EA66B] border-[#2EA66B]/30",
    "Entregue": "text-[#2EA66B] border-[#2EA66B]/30",
    "Cancelado": "text-[#C94B4B] border-[#C94B4B]/30",
  };

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <h1 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED]">
            Meus{" "}
            <span className="gold-text">Pedidos</span>
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-[#D6A632]/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#F8F5ED] mb-2">
              Nenhum pedido ainda
            </h2>
            <p className="text-sm text-[#9B9B9B] mb-6">
              Seus pedidos aparecerão aqui após a primeira compra.
            </p>
            <Link
              to="/todos-os-produtos"
              className="inline-flex items-center gap-2 bg-[#D6A632] text-[#090B0B] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-all"
            >
              Comprar agora
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.number}
                className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4 lg:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-[#9B9B9B]">
                      Pedido #{order.number}
                    </p>
                    <p className="text-[10px] text-[#9B9B9B] mt-0.5">
                      {new Date(order.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 border rounded-sm ${
                      statusStyles[order.status] || "text-[#9B9B9B]"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  {order.items.slice(0, 3).map((item: any, i: number) => (
                    <div
                      key={i}
                      className="w-12 h-14 bg-[#090B0B] rounded-sm overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-[10px] text-[#9B9B9B]">
                      +{order.items.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#D6A632]">
                    R$ {order.total.toFixed(2)}
                  </span>
                  <Link
                    to={`/pedido/${order.number}`}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#D6A632] hover:text-[#E8C56A] transition-colors"
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
