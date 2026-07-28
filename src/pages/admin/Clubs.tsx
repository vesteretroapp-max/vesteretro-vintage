import { Plus, Edit, Trash2, Shield, Flag } from "lucide-react";

const demoClubs = [
  { id: "1", name: "Flamengo", country: "Brasil", slug: "flamengo", active: true },
  { id: "2", name: "Corinthians", country: "Brasil", slug: "corinthians", active: true },
  { id: "3", name: "Santos", country: "Brasil", slug: "santos", active: true },
  { id: "4", name: "Vasco da Gama", country: "Brasil", slug: "vasco-da-gama", active: true },
  { id: "5", name: "São Paulo", country: "Brasil", slug: "sao-paulo", active: true },
  { id: "6", name: "Grêmio", country: "Brasil", slug: "gremio", active: true },
  { id: "7", name: "Atlético Mineiro", country: "Brasil", slug: "atletico-mg", active: true },
  { id: "8", name: "Liverpool", country: "Inglaterra", slug: "liverpool", active: true },
  { id: "9", name: "Manchester United", country: "Inglaterra", slug: "manchester-united", active: true },
  { id: "10", name: "Barcelona", country: "Espanha", slug: "barcelona", active: true },
  { id: "11", name: "Real Madrid", country: "Espanha", slug: "real-madrid", active: true },
  { id: "12", name: "Milan", country: "Itália", slug: "milan", active: true },
  { id: "13", name: "Inter de Milão", country: "Itália", slug: "inter-milao", active: true },
  { id: "14", name: "Arsenal", country: "Inglaterra", slug: "arsenal", active: true },
  { id: "15", name: "Juventus", country: "Itália", slug: "juventus", active: true },
  { id: "16", name: "Boca Juniors", country: "Argentina", slug: "boca-juniors", active: true },
];

const demoTeams = [
  { id: "1", name: "Brasil", country: "Brasil", slug: "brasil", active: true },
  { id: "2", name: "Argentina", country: "Argentina", slug: "argentina", active: true },
  { id: "3", name: "Alemanha", country: "Alemanha", slug: "alemanha", active: true },
  { id: "4", name: "Itália", country: "Itália", slug: "italia", active: true },
  { id: "5", name: "França", country: "França", slug: "franca", active: true },
  { id: "6", name: "Espanha", country: "Espanha", slug: "espanha", active: true },
  { id: "7", name: "Inglaterra", country: "Inglaterra", slug: "inglaterra", active: true },
  { id: "8", name: "Portugal", country: "Portugal", slug: "portugal", active: true },
  { id: "9", name: "Holanda", country: "Holanda", slug: "holanda", active: true },
];

export default function AdminClubsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Clubs Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D6A632]" />
              Clubes
            </h2>
            <p className="text-[10px] text-[#9B9B9B] mt-0.5">
              {demoClubs.length} clubes cadastrados
            </p>
          </div>
          <button className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
            <Plus className="w-3 h-3" />
            Novo Clube
          </button>
        </div>

        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D6A632]/10">
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Nome</th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">País</th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Slug</th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Status</th>
                <th className="p-3 text-right text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {demoClubs.map((club) => (
                <tr key={club.id} className="border-b border-[#D6A632]/5 hover:bg-[#D6A632]/5 transition-colors">
                  <td className="p-3 text-xs text-[#F8F5ED]">{club.name}</td>
                  <td className="p-3 text-[10px] text-[#D4D4D4]">{club.country}</td>
                  <td className="p-3 text-[10px] text-[#9B9B9B] font-mono">{club.slug}</td>
                  <td className="p-3">
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${club.active ? "text-[#2EA66B] border-[#2EA66B]/30" : "text-[#9B9B9B] border-[#9B9B9B]/30"}`}>
                      {club.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-[#9B9B9B] hover:text-[#C94B4B] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* National Teams Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
              <Flag className="w-4 h-4 text-[#D6A632]" />
              Seleções
            </h2>
            <p className="text-[10px] text-[#9B9B9B] mt-0.5">
              {demoTeams.length} seleções cadastradas
            </p>
          </div>
          <button className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
            <Plus className="w-3 h-3" />
            Nova Seleção
          </button>
        </div>

        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D6A632]/10">
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Nome</th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">País</th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Slug</th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Status</th>
                <th className="p-3 text-right text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {demoTeams.map((team) => (
                <tr key={team.id} className="border-b border-[#D6A632]/5 hover:bg-[#D6A632]/5 transition-colors">
                  <td className="p-3 text-xs text-[#F8F5ED]">{team.name}</td>
                  <td className="p-3 text-[10px] text-[#D4D4D4]">{team.country}</td>
                  <td className="p-3 text-[10px] text-[#9B9B9B] font-mono">{team.slug}</td>
                  <td className="p-3">
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${team.active ? "text-[#2EA66B] border-[#2EA66B]/30" : "text-[#9B9B9B] border-[#9B9B9B]/30"}`}>
                      {team.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-[#9B9B9B] hover:text-[#C94B4B] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
