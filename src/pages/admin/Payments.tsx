import { DollarSign, CreditCard, Smartphone, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

const paymentMethods = [
  {
    id: "pix",
    name: "PIX",
    icon: Smartphone,
    status: "not_configured" as const,
    description: "Pagamento instantâneo via PIX",
  },
  {
    id: "credit_card",
    name: "Cartão de Crédito",
    icon: CreditCard,
    status: "not_configured" as const,
    description: "Parcele em até 12x sem juros",
  },
  {
    id: "boleto",
    name: "Boleto Bancário",
    icon: CreditCard,
    status: "not_configured" as const,
    description: "Pagamento via boleto bancário",
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    icon: CreditCard,
    status: "not_configured" as const,
    description: "Gateway de pagamento via Mercado Pago",
  },
  {
    id: "stripe",
    name: "Stripe",
    icon: CreditCard,
    status: "not_configured" as const,
    description: "Gateway de pagamento via Stripe",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: Smartphone,
    status: "active" as const,
    description: "Pagamento combinado via WhatsApp (+55 11 98751-6823)",
  },
];

const statusConfig = {
  active: { label: "Ativo", color: "text-[#2EA66B] border-[#2EA66B]/30", icon: CheckCircle },
  sandbox: { label: "Sandbox", color: "text-[#D6A632] border-[#D6A632]/30", icon: AlertTriangle },
  not_configured: { label: "Não Configurado", color: "text-[#9B9B9B] border-[#9B9B9B]/30", icon: XCircle },
  inactive: { label: "Inativo", color: "text-[#C94B4B] border-[#C94B4B]/30", icon: XCircle },
};

export default function AdminPaymentsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-[#D6A632]" />
          Pagamentos
        </h2>
        <p className="text-[10px] text-[#9B9B9B] mt-0.5">
          Configure as formas de pagamento da loja
        </p>
      </div>

      <div className="bg-[#D6A632]/5 border border-[#D6A632]/20 rounded-sm p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-[#D6A632] mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] text-[#D6A632] font-semibold uppercase tracking-wider mb-1">
              Modo Demonstração
            </p>
            <p className="text-[10px] text-[#9B9B9B]">
              Nenhum pagamento real será processado até que as credenciais dos gateways sejam configuradas. A opção de "Pagamento via WhatsApp" está disponível para pedidos manuais.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {paymentMethods.map((method) => {
          const statusInfo = statusConfig[method.status];
          return (
            <div key={method.id} className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4 hover:border-[#D6A632]/25 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-sm bg-[#D6A632]/10 flex items-center justify-center">
                  <method.icon className="w-5 h-5 text-[#D6A632]" />
                </div>
                <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <h3 className="text-xs font-bold text-[#F8F5ED] mb-1">{method.name}</h3>
              <p className="text-[9px] text-[#9B9B9B] mb-3">{method.description}</p>
              <button className="w-full px-3 py-1.5 text-[10px] text-[#D6A632] border border-[#D6A632]/30 rounded-sm hover:bg-[#D6A632]/10 transition-colors uppercase tracking-wider">
                Configurar
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
