import { useState } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Tag,
  GripVertical,
} from "lucide-react";

const demoCategories = [
  { id: "1", name: "Clubes do Brasil", slug: "brasil", count: 8, active: true, order: 1 },
  { id: "2", name: "Clubes do Mundo", slug: "mundo", count: 7, active: true, order: 2 },
  { id: "3", name: "Seleções", slug: "selecoes", count: 5, active: true, order: 3 },
  { id: "4", name: "Lançamentos", slug: "lancamentos", count: 4, active: true, order: 4 },
  { id: "5", name: "Promoções", slug: "promocoes", count: 3, active: true, order: 5 },
];

export default function AdminCategoriesPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider">
            Categorias
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            {demoCategories.length} categorias
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
          <Plus className="w-3 h-3" />
          Nova Categoria
        </button>
      </div>

      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D6A632]/10">
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold w-8"></th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Nome
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Slug
              </th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                Produtos
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
            {demoCategories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-[#D6A632]/5 hover:bg-[#D6A632]/5 transition-colors"
              >
                <td className="p-3">
                  <GripVertical className="w-3.5 h-3.5 text-[#9B9B9B]/40 cursor-grab" />
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#D6A632]" />
                    <span className="text-xs text-[#F8F5ED]">{cat.name}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="text-[10px] text-[#9B9B9B] font-mono">
                    {cat.slug}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-[10px] text-[#D4D4D4]">
                    {cat.count}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                      cat.active
                        ? "text-[#2EA66B] border-[#2EA66B]/30"
                        : "text-[#9B9B9B] border-[#9B9B9B]/30"
                    }`}
                  >
                    {cat.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors" title="Editar">
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 text-[#9B9B9B] hover:text-[#C94B4B] transition-colors" title="Excluir">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
