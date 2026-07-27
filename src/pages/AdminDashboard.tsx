import { useState } from "react";
import { Link } from "react-router";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Settings,
  FileText,
  Tag,
  Image,
  Truck,
  MessageCircle,
  Mail,
  Database,
  Plus,
  Edit,
  Search,
} from "lucide-react";

const adminMenuItems = [
  {
    group: "Dashboard",
    items: [
      { name: "Visão Geral", icon: BarChart3 },
      { name: "Vendas", icon: TrendingUp },
      { name: "Relatórios", icon: FileText },
    ],
  },
  {
    group: "Gestão",
    items: [
      { name: "Produtos", icon: Package },
      { name: "Categorias", icon: Tag },
      { name: "Clubes", icon: Users },
      { name: "Estoque", icon: Database },
      { name: "Pedidos", icon: ShoppingCart },
      { name: "Clientes", icon: Users },
    ],
  },
  {
    group: "Marketing",
    items: [
      { name: "Cupons", icon: Tag },
      { name: "Banners", icon: Image },
      { name: "Newsletter", icon: Mail },
    ],
  },
  {
    group: "Configurações",
    items: [
      { name: "Pagamentos", icon: DollarSign },
      { name: "Frete", icon: Truck },
      { name: "Atendimento", icon: MessageCircle },
      { name: "Geral", icon: Settings },
    ],
  },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Visão Geral");

  const stats = [
    { label: "Faturamento", value: "R$ 0,00", icon: DollarSign, change: "+0%" },
    { label: "Pedidos", value: "0", icon: ShoppingCart, change: "0" },
    { label: "Clientes", value: "0", icon: Users, change: "+0" },
    { label: "Produtos", value: "20", icon: Package, change: "rascunho" },
  ];

  return (
    <div className="min-h-screen bg-[#090B0B] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111414] border-r border-[#D6A632]/10 hidden lg:block">
        <div className="p-4 border-b border-[#D6A632]/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#D6A632] flex items-center justify-center">
              <span className="text-[#090B0B] text-xs font-bold">VR</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#F8F5ED]">VesteRetro</p>
              <p className="text-[8px] text-[#D6A632] uppercase tracking-wider">
                Admin
              </p>
            </div>
          </Link>
        </div>
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          {adminMenuItems.map((group) => (
            <div key={group.group}>
              <p className="text-[9px] uppercase tracking-widest text-[#9B9B9B] font-semibold mb-2 px-3">
                {group.group}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveSection(item.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-sm transition-all ${
                    activeSection === item.name
                      ? "bg-[#D6A632]/10 text-[#D6A632]"
                      : "text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#D6A632]/5"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.name}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1">
        {/* Top bar */}
        <div className="bg-[#111414] border-b border-[#D6A632]/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-[#F8F5ED]">{activeSection}</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#9B9B9B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-9 pr-3 py-1.5 bg-[#090B0B] border border-[#D6A632]/20 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none w-48"
                />
              </div>
              <Link
                to="/admin/produtos/novo"
                className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors"
              >
                <Plus className="w-3 h-3" />
                Novo
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className="w-4 h-4 text-[#D6A632]" />
                  <span className="text-[10px] text-[#2EA66B]">{stat.change}</span>
                </div>
                <p className="text-xl font-bold text-[#F8F5ED]">{stat.value}</p>
                <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          {/* Products table */}
          <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm">
            <div className="p-4 border-b border-[#D6A632]/10 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
                Produtos Recentes
              </h2>
              <div className="flex gap-2">
                <button className="text-[10px] text-[#D6A632] hover:text-[#E8C56A] transition-colors uppercase tracking-wider">
                  Importar
                </button>
                <button className="text-[10px] text-[#D6A632] hover:text-[#E8C56A] transition-colors uppercase tracking-wider">
                  Exportar CSV
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { name: "Camisa Retrô Brasil 1970", status: "Publicado", price: "R$ 149,90", stock: "45" },
                  { name: "Camisa Retrô Flamengo 1981", status: "Publicado", price: "R$ 149,90", stock: "32" },
                  { name: "Camisa Retrô Brasil 1994", status: "Rascunho", price: "R$ 169,90", stock: "0" },
                ].map((product, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-[#090B0B] rounded-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#181B1B] rounded-sm" />
                      <div>
                        <p className="text-xs text-[#F8F5ED]">{product.name}</p>
                        <p className="text-[10px] text-[#9B9B9B]">
                          Estoque: {product.stock} • {product.price}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                          product.status === "Publicado"
                            ? "text-[#2EA66B] border-[#2EA66B]/30"
                            : "text-[#D6A632] border-[#D6A632]/30"
                        }`}
                      >
                        {product.status}
                      </span>
                      <button className="text-[#9B9B9B] hover:text-[#D6A632] transition-colors">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Import section */}
          <div className="mt-6 bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6">
            <h2 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider mb-4">
              Importar Catálogo
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  URL do Álbum
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://uniforming.x.yupoo.com/albums/..."
                    className="flex-1 px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  />
                  <button className="px-4 py-2 bg-[#D6A632] text-[#090B0B] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
                    Analisar
                  </button>
                </div>
              </div>
              <p className="text-[9px] text-[#9B9B9B]">
                Os produtos importados aparecerão como rascunho e precisarão de
                aprovação manual antes da publicação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
