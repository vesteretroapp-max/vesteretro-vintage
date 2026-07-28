import { Mail, Download, Trash2, CheckCircle } from "lucide-react";

const demoSubscribers: Array<{
  id: string;
  name: string;
  email: string;
  subscribedAt: string;
  consent: boolean;
}> = [];

export default function AdminNewsletterPage() {
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#D6A632]" />
            Newsletter
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            Assinantes da newsletter
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-[#D6A632] border border-[#D6A632]/30 rounded-sm hover:bg-[#D6A632]/10 transition-colors uppercase tracking-wider">
          <Download className="w-3 h-3" />
          Exportar CSV
        </button>
      </div>

      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D6A632]/10">
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Nome</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">E-mail</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Data</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Consentimento</th>
              <th className="p-3 text-right text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {demoSubscribers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <Mail className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
                  <p className="text-xs text-[#F8F5ED] mb-1">Nenhum inscrito</p>
                  <p className="text-[10px] text-[#9B9B9B]">Os inscritos na newsletter aparecerão aqui</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
