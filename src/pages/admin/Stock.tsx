import { Database, Package, AlertTriangle, ArrowUp, ArrowDown, History } from "lucide-react";
import { demoProducts } from "@/data/products";

export default function AdminStockPage() {
  const products = demoProducts.map((p) => ({
    name: p.name,
    club: p.club,
    sizes: p.sizes,
    totalStock: p.sizes.reduce((sum, s) => sum + s.stock, 0),
  }));

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-[#D6A632]" />
            Estoque
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            Controle de estoque por produto e tamanho
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-[9px] text-[#9B9B9B] uppercase tracking-wider mb-1">Total em Estoque</p>
          <p className="text-lg font-bold text-[#F8F5ED]">
            {products.reduce((sum, p) => sum + p.totalStock, 0)}
          </p>
        </div>
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-[9px] text-[#9B9B9B] uppercase tracking-wider mb-1">Produtos Ativos</p>
          <p className="text-lg font-bold text-[#2EA66B]">{products.length}</p>
        </div>
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-[9px] text-[#9B9B9B] uppercase tracking-wider mb-1">Estoque Baixo</p>
          <p className="text-lg font-bold text-[#D6A632]">0</p>
        </div>
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-[9px] text-[#9B9B9B] uppercase tracking-wider mb-1">Esgotados</p>
          <p className="text-lg font-bold text-[#C94B4B]">0</p>
        </div>
      </div>

      {/* Stock Table */}
      <div className="hidden md:block bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D6A632]/10">
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Produto</th>
              <th className="p-3 text-center text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">P</th>
              <th className="p-3 text-center text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">M</th>
              <th className="p-3 text-center text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">G</th>
              <th className="p-3 text-center text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">GG</th>
              <th className="p-3 text-center text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">XG</th>
              <th className="p-3 text-center text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Total</th>
              <th className="p-3 text-right text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={i} className="border-b border-[#D6A632]/5 hover:bg-[#D6A632]/5 transition-colors">
                <td className="p-3">
                  <p className="text-[10px] text-[#F8F5ED] max-w-[200px] truncate">{product.name}</p>
                  <p className="text-[9px] text-[#9B9B9B]">{product.club}</p>
                </td>
                {product.sizes.map((s) => (
                  <td key={s.size} className="p-3 text-center">
                    <span className={`text-[10px] font-mono ${s.stock < 5 ? "text-[#C94B4B]" : "text-[#D4D4D4]"}`}>
                      {s.stock}
                    </span>
                  </td>
                ))}
                <td className="p-3 text-center">
                  <span className="text-[10px] font-bold text-[#F8F5ED]">{product.totalStock}</span>
                </td>
                <td className="p-3 text-right">
                  <button className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors" title="Ajustar Estoque">
                    <Package className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {products.map((product, i) => (
          <div key={i} className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
            <p className="text-xs text-[#F8F5ED] mb-2">{product.name}</p>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => (
                <div key={s.size} className="text-center">
                  <p className="text-[8px] text-[#9B9B9B] uppercase">{s.size}</p>
                  <p className={`text-xs font-mono ${s.stock < 5 ? "text-[#C94B4B]" : "text-[#D4D4D4]"}`}>{s.stock}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
