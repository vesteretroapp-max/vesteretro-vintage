import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Percent,
  DollarSign,
  Truck,
} from "lucide-react";

const demoCoupons = [
  {
    id: "1",
    code: "BEMVINDO10",
    description: "10% de desconto para novos clientes",
    type: "percentage" as const,
    value: 10,
    minOrder: 100,
    maxDiscount: 50,
    usageCount: 0,
    usageLimit: 100,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    active: true,
  },
];

const typeConfig = {
  percentage: { label: "Percentual", icon: Percent, color: "text-[#D6A632]" },
  fixed: { label: "Valor Fixo", icon: DollarSign, color: "text-[#2EA66B]" },
  free_shipping: { label: "Frete Grátis", icon: Truck, color: "text-[#3B82F6]" },
};

export default function AdminCouponsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider">
            Cupons
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            {demoCoupons.length} cupom{demoCoupons.length !== 1 && "s"}
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
          <Plus className="w-3 h-3" />
          Novo Cupom
        </button>
      </div>

      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D6A632]/10">
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Código</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Descrição</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Tipo</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Valor</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Utilizações</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Validade</th>
              <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Status</th>
              <th className="p-3 text-right text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {demoCoupons.map((coupon) => {
              const typeInfo = typeConfig[coupon.type];
              return (
                <tr key={coupon.id} className="border-b border-[#D6A632]/5 hover:bg-[#D6A632]/5 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-[#D6A632] font-mono bg-[#D6A632]/10 px-2 py-0.5 rounded">
                        {coupon.code}
                      </code>
                      <button className="text-[#9B9B9B] hover:text-[#D6A632] transition-colors" title="Copiar">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3 text-[10px] text-[#D4D4D4] max-w-[200px] truncate">{coupon.description}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <typeInfo.icon className={`w-3 h-3 ${typeInfo.color}`} />
                      <span className="text-[10px] text-[#D4D4D4]">{typeInfo.label}</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-[#F8F5ED] font-medium">
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : coupon.type === "fixed"
                      ? `R$ ${coupon.value.toFixed(2).replace(".", ",")}`
                      : "Grátis"}
                  </td>
                  <td className="p-3 text-[10px] text-[#D4D4D4]">
                    {coupon.usageCount}/{coupon.usageLimit}
                  </td>
                  <td className="p-3">
                    <div className="text-[10px] text-[#9B9B9B]">
                      <span>{coupon.startDate}</span>
                      <span className="mx-1">até</span>
                      <span>{coupon.endDate}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${coupon.active ? "text-[#2EA66B] border-[#2EA66B]/30" : "text-[#9B9B9B] border-[#9B9B9B]/30"}`}>
                      {coupon.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 text-[#9B9B9B] hover:text-[#C94B4B] transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
