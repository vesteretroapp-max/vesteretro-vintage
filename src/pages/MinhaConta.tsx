import { Link, Outlet } from "react-router";
import {
  User,
  Package,
  Heart,
  MapPin,
  Tag,
  Search,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

const accountLinks = [
  { name: "Dados Pessoais", href: "/minha-conta/dados", icon: User },
  { name: "Meus Pedidos", href: "/minha-conta/pedidos", icon: Package },
  { name: "Favoritos", href: "/favoritos", icon: Heart },
  { name: "Endereços", href: "/minha-conta/enderecos", icon: MapPin },
  { name: "Cupons", href: "/minha-conta/cupons", icon: Tag },
  { name: "Rastreamento", href: "/rastreamento", icon: Search },
  { name: "Alterar Senha", href: "/minha-conta/alterar-senha", icon: Settings },
];

export default function MinhaConta() {
  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <h1 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED]">
            Minha{" "}
            <span className="gold-text">Conta</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {accountLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="flex items-center justify-between px-4 py-3 text-sm text-[#D4D4D4] hover:text-[#D6A632] hover:bg-[#111414] rounded-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <link.icon className="w-4 h-4 text-[#D6A632]" />
                    {link.name}
                  </div>
                  <ChevronRight className="w-3 h-3 text-[#9B9B9B]" />
                </Link>
              ))}
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#C94B4B] hover:bg-[#111414] rounded-sm transition-all mt-4">
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6 lg:p-8">
              <h2 className="text-lg font-bold text-[#F8F5ED] mb-4">
                Bem-vindo à sua conta
              </h2>
              <p className="text-sm text-[#9B9B9B]">
                Gerencie seus dados, acompanhe pedidos e visualize seus favoritos.
              </p>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Pedidos", value: "0", icon: Package },
                  { label: "Favoritos", value: "0", icon: Heart },
                  { label: "Endereços", value: "0", icon: MapPin },
                  { label: "Cupons", value: "0", icon: Tag },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 bg-[#090B0B] rounded-sm"
                  >
                    <stat.icon className="w-5 h-5 text-[#D6A632] mx-auto mb-2" />
                    <p className="text-xl font-bold text-[#F8F5ED]">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
