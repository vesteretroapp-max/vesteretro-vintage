import { Truck, Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react";

const demoShipping = [
  {
    id: "1",
    name: "Frete Padrão",
    description: "Entrega via Correios ou transportadora parceira",
    price: 15.90,
    freeFrom: 299.90,
    minDays: 7,
    maxDays: 12,
    active: true,
  },
  {
    id: "2",
    name: "Frete Expresso",
    description: "Entrega priorizada em até 6 dias úteis",
    price: 29.90,
    freeFrom: null,
    minDays: 3,
    maxDays: 6,
    active: true,
  },
  {
    id: "3",
    name: "Retirada na Loja",
    description: "Retire seu pedido sem custo de frete",
    price: 0,
    freeFrom: null,
    minDays: 1,
    maxDays: 3,
    active: false,
  },
];

export default function AdminShippingPage() {
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#D6A632]" />
            Fretes
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            Configure os métodos de entrega
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
          <Plus className="w-3 h-3" />
          Novo Método
        </button>
      </div>

      <div className="space-y-3">
        {demoShipping.map((method) => (
          <div key={method.id} className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4 hover:border-[#D6A632]/25 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xs font-bold text-[#F8F5ED]">{method.name}</h3>
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${method.active ? "text-[#2EA66B] border-[#2EA66B]/30" : "text-[#9B9B9B] border-[#9B9B9B]/30"}`}>
                    {method.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <p className="text-[10px] text-[#9B9B9B] mb-2">{method.description}</p>
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="text-[#F8F5ED]">
                    {method.price === 0 ? "Grátis" : `R$ ${method.price.toFixed(2).replace(".", ",")}`}
                  </span>
                  {method.freeFrom && (
                    <span className="text-[#2EA66B]">
                      Grátis acima de R$ {method.freeFrom.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                  <span className="text-[#9B9B9B]">
                    {method.minDays} a {method.maxDays} dias úteis
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4">
        <p className="text-[10px] text-[#9B9B9B]">
          💡 A integração com APIs de frete (Melhor Envio, Correios, Jadlog) será adicionada em uma futura atualização.
        </p>
      </div>
    </div>
  );
}
