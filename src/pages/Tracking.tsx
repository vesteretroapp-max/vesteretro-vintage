import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function Tracking() {
  const [orderNumber, setOrderNumber] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      const orders = JSON.parse(localStorage.getItem("veste_orders") || "[]");
      const order = orders.find((o: any) => o.number === orderNumber.trim());
      if (order) {
        alert(`Pedido #${order.number} encontrado! Status: ${order.status}`);
      } else {
        alert("Pedido não encontrado. Verifique o número e tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16 text-center">
          <Package className="w-10 h-10 text-[#D6A632] mx-auto mb-4" />
          <h1 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED]">
            Rastrear{" "}
            <span className="gold-text">Pedido</span>
          </h1>
          <p className="text-sm text-[#9B9B9B] mt-2">
            Acompanhe o status da sua entrega.
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-12">
        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
              Número do Pedido
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Ex: VRABC1234"
              className="w-full px-4 py-3 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#D6A632] text-[#090B0B] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Rastrear
          </button>
        </form>

        {/* Timeline example */}
        <div className="mt-12">
          <h3 className="text-xs uppercase tracking-wider text-[#D6A632] font-semibold mb-6 text-center">
            Status do Pedido
          </h3>
          <div className="space-y-0">
            {[
              { icon: Clock, label: "Aguardando pagamento", active: false },
              { icon: Package, label: "Em separação", active: false },
              { icon: Truck, label: "Enviado", active: false },
              { icon: CheckCircle, label: "Entregue", active: false },
            ].map((step, i) => (
              <div key={step.label} className="flex items-start gap-4 pb-6 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      step.active
                        ? "border-[#D6A632] bg-[#D6A632]/10 text-[#D6A632]"
                        : "border-[#D6A632]/20 text-[#9B9B9B]"
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  {i < 3 && (
                    <div className="w-px flex-1 bg-[#D6A632]/10 mt-1" />
                  )}
                </div>
                <div className="pt-1.5">
                  <p
                    className={`text-sm ${
                      step.active ? "text-[#D6A632]" : "text-[#9B9B9B]"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
