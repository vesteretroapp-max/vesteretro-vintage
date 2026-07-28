import { ClipboardList, Search } from "lucide-react";
import { useState } from "react";

const demoLogs: Array<{
  id: string;
  admin: string;
  action: string;
  resource: string;
  resourceId: string;
  date: string;
}> = [];

export default function AdminLogsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#D6A632]" />
          Logs de Auditoria
        </h2>
        <p className="text-[10px] text-[#9B9B9B] mt-0.5">
          Histórico de ações realizadas no painel administrativo
        </p>
      </div>

      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#9B9B9B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ação, recurso ou administrador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#090B0B] border border-[#D6A632]/20 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
          />
        </div>
      </div>

      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D6A632]/10">
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Data/Hora</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Admin</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Ação</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Recurso</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">ID</th>
            </tr>
          </thead>
          <tbody>
            {demoLogs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <ClipboardList className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
                  <p className="text-xs text-[#F8F5ED] mb-1">Nenhum log registrado</p>
                  <p className="text-[10px] text-[#9B9B9B]">
                    As ações realizadas no painel serão registradas aqui
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
