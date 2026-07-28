import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Settings,
  FileText,
  Tag,
  Image,
  Truck,
  MessageCircle,
  Mail,
  Database,
  Search,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ChevronLeft,
  Star,
  Upload,
  Shield,
  Bell,
  ClipboardList,
  Store,
} from "lucide-react";

const LOGO_URL = "https://i.postimg.cc/1PpMzQ81/Chat-GPT-Image-27-de-jul-de-2026-16-41-41.png";

const adminMenuItems = [
  {
    group: "Dashboard",
    items: [
      { name: "Visão Geral", icon: BarChart3, path: "/admin" },
      { name: "Pedidos", icon: ShoppingCart, path: "/admin/pedidos" },
      { name: "Produtos", icon: Package, path: "/admin/produtos" },
      { name: "Clientes", icon: Users, path: "/admin/clientes" },
    ],
  },
  {
    group: "Catálogo",
    items: [
      { name: "Categorias", icon: Tag, path: "/admin/categorias" },
      { name: "Clubes", icon: Shield, path: "/admin/clubes" },
      { name: "Seleções", icon: Store, path: "/admin/selecoes" },
      { name: "Estoque", icon: Database, path: "/admin/estoque" },
    ],
  },
  {
    group: "Marketing",
    items: [
      { name: "Cupons", icon: Tag, path: "/admin/cupons" },
      { name: "Banners", icon: Image, path: "/admin/banners" },
      { name: "Avaliações", icon: Star, path: "/admin/avaliacoes" },
      { name: "Newsletter", icon: Mail, path: "/admin/newsletter" },
    ],
  },
  {
    group: "Operação",
    items: [
      { name: "Importação", icon: Upload, path: "/admin/importacao" },
      { name: "Fretes", icon: Truck, path: "/admin/fretes" },
      { name: "Pagamentos", icon: DollarSign, path: "/admin/pagamentos" },
    ],
  },
  {
    group: "Sistema",
    items: [
      { name: "Configurações", icon: Settings, path: "/admin/configuracoes" },
      { name: "Logs", icon: ClipboardList, path: "/admin/logs" },
    ],
  },
];

function SidebarContent({
  activePath,
  onNavigate,
}: {
  activePath: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="p-4 border-b border-[#D6A632]/10">
        <Link to="/" className="flex items-center gap-3" onClick={onNavigate}>
          <img
            src={LOGO_URL}
            alt="VesteRetro"
            className="h-9 w-auto mix-blend-lighten"
          />
          <div>
            <p className="text-[10px] font-bold text-[#D6A632] uppercase tracking-widest">
              Painel Admin
            </p>
          </div>
        </Link>
      </div>
      <nav className="p-3 space-y-5 overflow-y-auto flex-1">
        {adminMenuItems.map((group) => (
          <div key={group.group}>
            <p className="text-[9px] uppercase tracking-widest text-[#9B9B9B] font-semibold mb-2 px-3">
              {group.group}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  activePath === item.path ||
                  (item.path !== "/admin" && activePath.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onNavigate}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs rounded-sm transition-all ${
                      isActive
                        ? "bg-[#D6A632]/15 text-[#D6A632]"
                        : "text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#D6A632]/5"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </>
  );
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useSupabaseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const pageTitle = (() => {
    const segments = location.pathname.split("/").filter(Boolean);
    if (segments.length <= 1) return "Visão Geral";
    const slug = segments[segments.length - 1];
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  })();

  return (
    <div className="min-h-screen bg-[#090B0B] flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#111414] border-r border-[#D6A632]/10 transition-all duration-300 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <SidebarContent activePath={location.pathname} />
        <div className="p-3 border-t border-[#D6A632]/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-[10px] text-[#9B9B9B] hover:text-[#D6A632] transition-colors"
          >
            <ChevronLeft
              className={`w-3.5 h-3.5 transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            {!collapsed && <span>Recolher</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#111414] border-r border-[#D6A632]/10 flex flex-col transform transition-transform duration-300 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#D6A632]/10">
          <img
            src={LOGO_URL}
            alt="VesteRetro"
            className="h-9 w-auto mix-blend-lighten"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-[#9B9B9B] hover:text-[#D6A632]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <SidebarContent
          activePath={location.pathname}
          onNavigate={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <div className="bg-[#111414] border-b border-[#D6A632]/10 px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-[#9B9B9B] hover:text-[#D6A632]"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-sm lg:text-base font-bold text-[#F8F5ED]">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 text-[#9B9B9B] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-9 pr-3 py-1.5 bg-[#090B0B] border border-[#D6A632]/20 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none w-44 lg:w-56"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-[#9B9B9B] hover:text-[#D6A632] transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#C94B4B] rounded-full" />
              </button>

              {/* View Store */}
              <Link
                to="/"
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-[#D6A632] border border-[#D6A632]/30 rounded-sm hover:bg-[#D6A632]/10 transition-colors uppercase tracking-wider"
              >
                <ExternalLink className="w-3 h-3" />
                Ver Loja
              </Link>

              {/* User */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#D6A632]/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-[#D6A632]">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-[#9B9B9B] hover:text-[#C94B4B] transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
