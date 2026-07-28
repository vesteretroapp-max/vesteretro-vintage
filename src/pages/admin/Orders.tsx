import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Eye,
  MoreHorizontal,
  ShoppingCart,
  ChevronDown,
  Printer,
} from "lucide-react";

type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

const statusConfig: Record<
  OrderStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: {
    label: "Aguardando Pagamento",
    color: "text-[#D6A632]",
    bgColor: "border-[#D6A632]/30",
  },
  paid: {
    label: "Pago",
    color: "text-[#2EA66B]",
    bgColor: "border-[#2EA66B]/30",
  },
  processing: {
    label: "Em Separação",
    color: "text-[#E8C56A]",
    bgColor: "border-[#E8C56A]/30",
  },
  shipped: {
    label: "Enviado",
    color: "text-[#3B82F6]",
    bgColor: "border-[#3B82F6]/30",
  },
  delivered: {
    label: "Entregue",
    color: "text-[#2EA66B]",
    bgColor: "border-[#2EA66B]/30",
  },
  cancelled: {
    label: "Cancelado",
    color: "text-[#C94B4B]",
    bgColor: "border-[#C94B4B]/30",
  },
};

const demoOrders: Array<{
  id: string;
  number: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  payment: string;
}> = [];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider">
            Pedidos
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            {demoOrders.length} pedido{demoOrders.length !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(statusConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() =>
              setStatusFilter(statusFilter === key ? "all" : key)
            }
            className={`p-3 rounded-sm border text-left transition-colors ${
              statusFilter === key
                ? "bg-[#D6A632]/10 border-[#D6A632]/40"
                : "bg-[#111414] border-[#D6A632]/10 hover:border-[#D6A632]/25"
            }`}
          >
            <p className={`text-lg font-bold ${config.color}`}>0</p>
            <p className="text-[9px] text-[#9B9B9B] uppercase tracking-wider">
              {config.label}
            </p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#9B9B9B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por número, cliente ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090B0B] border border-[#D6A632]/20 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-[10px] text-[#D4D4D4] border border-[#D6A632]/20 rounded-sm hover:border-[#D6A632]/40 transition-colors uppercase tracking-wider">
              Data
            </button>
            <button className="px-3 py-1.5 text-[10px] text-[#D4D4D4] border border-[#D6A632]/20 rounded-sm hover:border-[#D6A632]/40 transition-colors uppercase tracking-wider">
              Valor
            </button>
            <button className="px-3 py-1.5 text-[10px] text-[#D4D4D4] border border-[#D6A632]/20 rounded-sm hover:border-[#D6A632]/40 transition-colors uppercase tracking-wider flex items-center gap-1">
              <Printer className="w-3 h-3" />
              Exportar
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table (Desktop) */}
      <div className="hidden md:block bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D6A632]/10">
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Pedido
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Cliente
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Data
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Itens
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Total
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Pagamento
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Status
              </th>
              <th className="p-3 text-right text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {demoOrders.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center">
                  <ShoppingCart className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
                  <p className="text-xs text-[#F8F5ED] mb-1">
                    Nenhum pedido realizado
                  </p>
                  <p className="text-[10px] text-[#9B9B9B]">
                    Os pedidos aparecerão aqui quando forem realizados
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-12 md:hidden">
        <div className="text-center">
          <ShoppingCart className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
          <p className="text-xs text-[#F8F5ED] mb-1">
            Nenhum pedido realizado
          </p>
          <p className="text-[10px] text-[#9B9B9B]">
            Os pedidos aparecerão aqui quando forem realizados
          </p>
        </div>
      </div>
    </div>
  );
}
