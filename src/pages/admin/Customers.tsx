import { useState } from "react";
import {
  Search,
  Users,
  ShoppingCart,
  Mail,
  Phone,
  ExternalLink,
  Eye,
  Ban,
  CheckCircle,
} from "lucide-react";

const demoCustomers: Array<{
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  registeredAt: string;
  lastOrder: string;
}> = [];

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider">
            Clientes
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            {demoCustomers.length} cliente{demoCustomers.length !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#9B9B9B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#090B0B] border border-[#D6A632]/20 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
          />
        </div>
      </div>

      {/* Table Desktop */}
      <div className="hidden md:block bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D6A632]/10">
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Cliente
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Contato
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Pedidos
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Total Gasto
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Último Pedido
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Cadastro
              </th>
              <th className="p-3 text-right text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {demoCustomers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-12 text-center">
                  <Users className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
                  <p className="text-xs text-[#F8F5ED] mb-1">
                    Nenhum cliente cadastrado
                  </p>
                  <p className="text-[10px] text-[#9B9B9B]">
                    Os clientes aparecerão aqui após se cadastrarem
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Empty State Mobile */}
      <div className="md:hidden bg-[#111414] border border-[#D6A632]/10 rounded-sm p-12">
        <div className="text-center">
          <Users className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
          <p className="text-xs text-[#F8F5ED] mb-1">
            Nenhum cliente cadastrado
          </p>
          <p className="text-[10px] text-[#9B9B9B]">
            Os clientes aparecerão aqui após se cadastrarem
          </p>
        </div>
      </div>
    </div>
  );
}
