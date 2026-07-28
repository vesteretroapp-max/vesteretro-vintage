import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Eye,
  ArrowUpRight,
  BarChart3,
} from "lucide-react";
import { demoProducts } from "@/data/products";

const stats: { label: string; value: string; change: string; trend: "neutral" | "up" | "down"; icon: React.ElementType; description: string }[] = [
  {
    label: "Faturamento Total",
    value: "R$ 0,00",
    change: "0%",
    trend: "neutral",
    icon: DollarSign,
    description: "Sem vendas registradas",
  },
  {
    label: "Pedidos Hoje",
    value: "0",
    change: "0",
    trend: "neutral",
    icon: ShoppingCart,
    description: "Nenhum pedido hoje",
  },
  {
    label: "Clientes Cadastrados",
    value: "0",
    change: "+0",
    trend: "neutral",
    icon: Users,
    description: "Sem clientes ainda",
  },
  {
    label: "Produtos Ativos",
    value: String(demoProducts.length),
    change: "rascunho",
    trend: "neutral",
    icon: Package,
    description: "Todos em demonstração",
  },
];

const orderStatusStats = [
  { label: "Aguardando Pagamento", value: 0, color: "#D6A632" },
  { label: "Em Separação", value: 0, color: "#E8C56A" },
  { label: "Enviados", value: 0, color: "#2EA66B" },
  { label: "Entregues", value: 0, color: "#9B9B9B" },
  { label: "Cancelados", value: 0, color: "#C94B4B" },
];

const recentProducts = demoProducts.slice(0, 5);

const periods = [
  "Hoje",
  "Últimos 7 dias",
  "Últimos 30 dias",
  "Este mês",
  "Mês anterior",
];

export default function AdminDashboardPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Period Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {periods.map((period, i) => (
          <button
            key={period}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-wider rounded-sm whitespace-nowrap transition-colors ${
              i === 0
                ? "bg-[#D6A632] text-[#090B0B] font-semibold"
                : "bg-[#111414] text-[#9B9B9B] border border-[#D6A632]/10 hover:text-[#D6A632] hover:border-[#D6A632]/30"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4 hover:border-[#D6A632]/25 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-sm bg-[#D6A632]/10 flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-[#D6A632]" />
              </div>
              {stat.trend === "up" ? (
                <TrendingUp className="w-3.5 h-3.5 text-[#2EA66B]" />
              ) : stat.trend === "down" ? (
                <TrendingDown className="w-3.5 h-3.5 text-[#C94B4B]" />
              ) : null}
            </div>
            <p className="text-xl font-bold text-[#F8F5ED]">{stat.value}</p>
            <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider mt-1">
              {stat.label}
            </p>
            <p className="text-[9px] text-[#9B9B9B]/60 mt-0.5">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Chart Placeholder */}
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm">
          <div className="p-4 border-b border-[#D6A632]/10 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
              Vendas por Dia
            </h3>
            <BarChart3 className="w-4 h-4 text-[#D6A632]" />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-48">
              <div className="text-center">
                <BarChart3 className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
                <p className="text-xs text-[#9B9B9B]">
                  Dados de vendas aparecerão aqui
                </p>
                <p className="text-[9px] text-[#9B9B9B]/60 mt-1">
                  Após as primeiras vendas serem realizadas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm">
          <div className="p-4 border-b border-[#D6A632]/10 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
              Pedidos por Status
            </h3>
            <ShoppingCart className="w-4 h-4 text-[#D6A632]" />
          </div>
          <div className="p-4 space-y-3">
            {orderStatusStats.map((status) => (
              <div key={status.label} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-[10px] text-[#D4D4D4] flex-1">
                  {status.label}
                </span>
                <span className="text-xs font-bold text-[#F8F5ED]">
                  {status.value}
                </span>
              </div>
            ))}
            <div className="pt-3 border-t border-[#D6A632]/10">
              <div className="flex items-center justify-center h-24">
                <p className="text-[9px] text-[#9B9B9B]/60">
                  Gráfico de pedidos por status
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Low Stock Alerts */}
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm">
          <div className="p-4 border-b border-[#D6A632]/10 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
              Estoque Baixo
            </h3>
            <AlertTriangle className="w-3.5 h-3.5 text-[#D6A632]" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 text-[#2EA66B]/30 mx-auto mb-2" />
                <p className="text-[10px] text-[#2EA66B]">
                  Todos os produtos com estoque OK
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm">
          <div className="p-4 border-b border-[#D6A632]/10 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
              Pedidos Recentes
            </h3>
            <Clock className="w-3.5 h-3.5 text-[#D6A632]" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <ShoppingCart className="w-8 h-8 text-[#D6A632]/20 mx-auto mb-2" />
                <p className="text-[10px] text-[#9B9B9B]">
                  Nenhum pedido realizado
                </p>
                <p className="text-[9px] text-[#9B9B9B]/60 mt-0.5">
                  Os pedidos aparecerão aqui
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm">
          <div className="p-4 border-b border-[#D6A632]/10 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
              Produtos Recentes
            </h3>
            <Eye className="w-3.5 h-3.5 text-[#D6A632]" />
          </div>
          <div className="p-2 max-h-44 overflow-y-auto">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2 rounded-sm hover:bg-[#090B0B] transition-colors"
              >
                <div className="w-8 h-8 bg-[#181B1B] rounded-sm overflow-hidden shrink-0">
                  <img
                    src={product.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#F8F5ED] truncate">
                    {product.name}
                  </p>
                  <p className="text-[9px] text-[#9B9B9B]">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <ArrowUpRight className="w-3 h-3 text-[#D6A632]/40 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
