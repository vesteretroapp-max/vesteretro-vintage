import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  CreditCard,
  Building2,
  Banknote,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Shield,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LOGO_URL =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

type Step = "info" | "address" | "shipping" | "payment" | "review";

interface FormData {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  whatsapp: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("info");
  const [paymentMethod, setPaymentMethod] = useState<string>("pix");
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    whatsapp: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCartTotal = () => {
    const stored = localStorage.getItem("veste_cart");
    if (!stored) return 0;
    const items = JSON.parse(stored);
    return items.reduce((a: number, i: any) => a + i.price * i.quantity, 0);
  };

  const total = getCartTotal() + (getCartTotal() >= 299 ? 0 : 19.9);

  const handleFinish = () => {
    const orderNumber = `VR${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const orders = JSON.parse(localStorage.getItem("veste_orders") || "[]");
    const newOrder = {
      number: orderNumber,
      date: new Date().toISOString(),
      items: JSON.parse(localStorage.getItem("veste_cart") || "[]"),
      total,
      payment: paymentMethod,
      status: "Aguardando pagamento",
      shipping: formData,
    };
    orders.unshift(newOrder);
    localStorage.setItem("veste_orders", JSON.stringify(orders));
    localStorage.removeItem("veste_cart");
    window.dispatchEvent(new Event("cart-updated"));

    navigate(`/pedido/${orderNumber}`);
  };

  const renderStepIndicator = () => {
    const steps: { key: Step; label: string }[] = [
      { key: "info", label: "Identificação" },
      { key: "address", label: "Endereço" },
      { key: "shipping", label: "Entrega" },
      { key: "payment", label: "Pagamento" },
      { key: "review", label: "Revisão" },
    ];
    const currentIdx = steps.findIndex((s) => s.key === step);

    return (
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider ${
                i <= currentIdx
                  ? "text-[#D6A632]"
                  : "text-[#9B9B9B]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  i < currentIdx
                    ? "bg-[#D6A632] text-[#090B0B]"
                    : i === currentIdx
                      ? "bg-[#D6A632] text-[#090B0B]"
                      : "border border-[#9B9B9B]"
                }`}
              >
                {i < currentIdx ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-6 h-px ${
                  i < currentIdx ? "bg-[#D6A632]" : "bg-[#D6A632]/20"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img
              src={LOGO_URL}
              alt="VesteRetro"
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {renderStepIndicator()}

        {/* Step: Info */}
        {step === "info" && (
          <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6 lg:p-8">
            <h2 className="vintage-text text-xl font-bold text-[#F8F5ED] mb-6">
              Identificação
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => updateField("nome", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="Seu nome completo"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => updateField("cpf", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  E-mail *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => updateField("telefone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setStep("address")}
                className="bg-[#D6A632] text-[#090B0B] hover:bg-[#E8C56A] text-sm font-semibold uppercase tracking-wider rounded-sm"
              >
                Continuar
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Address */}
        {step === "address" && (
          <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6 lg:p-8">
            <h2 className="vintage-text text-xl font-bold text-[#F8F5ED] mb-6">
              Endereço de Entrega
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  CEP *
                </label>
                <input
                  type="text"
                  value={formData.cep}
                  onChange={(e) => updateField("cep", e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="00000-000"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Rua *
                </label>
                <input
                  type="text"
                  value={formData.rua}
                  onChange={(e) => updateField("rua", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="Nome da rua"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Número *
                </label>
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => updateField("numero", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="Nº"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Complemento
                </label>
                <input
                  type="text"
                  value={formData.complemento}
                  onChange={(e) => updateField("complemento", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="Apto, Bloco"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Bairro *
                </label>
                <input
                  type="text"
                  value={formData.bairro}
                  onChange={(e) => updateField("bairro", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="Seu bairro"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={formData.cidade}
                  onChange={(e) => updateField("cidade", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="Sua cidade"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Estado *
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => updateField("estado", e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm rounded-sm focus:border-[#D6A632] outline-none"
                >
                  <option value="">Selecione</option>
                  {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("info")}
                className="border-[#D6A632]/40 text-[#D4D4D4] hover:bg-[#D6A632]/10 text-sm rounded-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <Button
                onClick={() => setStep("shipping")}
                className="bg-[#D6A632] text-[#090B0B] hover:bg-[#E8C56A] text-sm font-semibold uppercase tracking-wider rounded-sm"
              >
                Continuar
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Shipping */}
        {step === "shipping" && (
          <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6 lg:p-8">
            <h2 className="vintage-text text-xl font-bold text-[#F8F5ED] mb-6">
              Forma de Entrega
            </h2>
            <div className="space-y-3">
              {[
                { name: "Frete Padrão", price: 19.9, days: "7-15" },
                { name: "Frete Expresso", price: 39.9, days: "3-7" },
                { name: "Frete Grátis", price: 0, days: "10-20", note: "Acima de R$ 299" },
              ].map((option) => (
                <label
                  key={option.name}
                  className="flex items-center justify-between p-4 border border-[#D6A632]/20 rounded-sm hover:border-[#D6A632]/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      className="accent-[#D6A632]"
                    />
                    <div>
                      <p className="text-sm text-[#F8F5ED]">{option.name}</p>
                      <p className="text-[10px] text-[#9B9B9B]">
                        {option.days} dias úteis
                      </p>
                      {option.note && (
                        <p className="text-[10px] text-[#2EA66B]">{option.note}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#D6A632]">
                    {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("address")}
                className="border-[#D6A632]/40 text-[#D4D4D4] hover:bg-[#D6A632]/10 text-sm rounded-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <Button
                onClick={() => setStep("payment")}
                className="bg-[#D6A632] text-[#090B0B] hover:bg-[#E8C56A] text-sm font-semibold uppercase tracking-wider rounded-sm"
              >
                Continuar
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6 lg:p-8">
            <h2 className="vintage-text text-xl font-bold text-[#F8F5ED] mb-6">
              Forma de Pagamento
            </h2>
            <div className="space-y-3">
              {[
                { id: "pix", name: "PIX", icon: Banknote, desc: "Pagamento instantâneo. Aprovação na hora." },
                { id: "credit", name: "Cartão de Crédito", icon: CreditCard, desc: "Parcele em até 12x" },
                { id: "boleto", name: "Boleto Bancário", icon: Building2, desc: "Vencimento em 3 dias úteis" },
                { id: "whatsapp", name: "Pagamento via WhatsApp", icon: MessageCircle, desc: "Combine o pagamento conosco" },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${
                    paymentMethod === option.id
                      ? "border-[#D6A632] bg-[#D6A632]/5"
                      : "border-[#D6A632]/20 hover:border-[#D6A632]/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                    className="accent-[#D6A632]"
                  />
                  <option.icon className="w-5 h-5 text-[#D6A632] shrink-0" />
                  <div>
                    <p className="text-sm text-[#F8F5ED]">{option.name}</p>
                    <p className="text-[10px] text-[#9B9B9B]">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {paymentMethod === "credit" && (
              <div className="mt-6 space-y-4 p-4 bg-[#090B0B] border border-[#D6A632]/10 rounded-sm">
                <p className="text-xs text-[#D6A632] uppercase tracking-wider">
                  Cartão de crédito (modo sandbox)
                </p>
                <input
                  type="text"
                  placeholder="Número do cartão"
                  className="w-full px-3 py-2.5 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Validade"
                    className="w-full px-3 py-2.5 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full px-3 py-2.5 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <p className="text-[9px] text-[#9B9B9B] italic">
                  🔒 Ambiente de teste. Nenhum dado real será processado.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("shipping")}
                className="border-[#D6A632]/40 text-[#D4D4D4] hover:bg-[#D6A632]/10 text-sm rounded-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <Button
                onClick={() => setStep("review")}
                className="bg-[#D6A632] text-[#090B0B] hover:bg-[#E8C56A] text-sm font-semibold uppercase tracking-wider rounded-sm"
              >
                Revisar
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6 lg:p-8">
            <h2 className="vintage-text text-xl font-bold text-[#F8F5ED] mb-6">
              Revisão do Pedido
            </h2>

            <div className="space-y-4 text-sm">
              <div className="p-4 bg-[#090B0B] rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[#D6A632] mb-2">
                  Dados Pessoais
                </p>
                <p className="text-[#D4D4D4]">{formData.nome}</p>
                <p className="text-[#9B9B9B]">{formData.email}</p>
                <p className="text-[#9B9B9B]">{formData.telefone}</p>
              </div>

              <div className="p-4 bg-[#090B0B] rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[#D6A632] mb-2">
                  Endereço
                </p>
                <p className="text-[#D4D4D4]">
                  {formData.rua}, {formData.numero}
                  {formData.complemento && ` - ${formData.complemento}`}
                </p>
                <p className="text-[#9B9B9B]">
                  {formData.bairro} - {formData.cidade}/{formData.estado}
                </p>
                <p className="text-[#9B9B9B]">CEP: {formData.cep}</p>
              </div>

              <div className="p-4 bg-[#090B0B] rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[#D6A632] mb-2">
                  Pagamento
                </p>
                <p className="text-[#D4D4D4] capitalize">
                  {paymentMethod === "pix"
                    ? "PIX"
                    : paymentMethod === "credit"
                      ? "Cartão de Crédito"
                      : paymentMethod === "boleto"
                        ? "Boleto Bancário"
                        : "WhatsApp"}
                </p>
              </div>

              <div className="p-4 bg-[#090B0B] rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[#D6A632] mb-2">
                  Valor
                </p>
                <p className="text-2xl font-bold text-[#D6A632]">
                  R$ {total.toFixed(2)}
                </p>
                <p className="text-[10px] text-[#9B9B9B]">
                  ou 12x de R$ {(total / 12).toFixed(2)} sem juros
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 border border-[#D6A632]/20 rounded-sm">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#D6A632] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#D4D4D4]">
                    Modo demonstrativo — Pagamento em configuração
                  </p>
                  <p className="text-[10px] text-[#9B9B9B] mt-1">
                    As credenciais de pagamento serão configuradas em breve.
                    Seu pedido será registrado para teste.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("payment")}
                className="border-[#D6A632]/40 text-[#D4D4D4] hover:bg-[#D6A632]/10 text-sm rounded-sm"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <Button
                onClick={handleFinish}
                className="bg-[#D6A632] text-[#090B0B] hover:bg-[#E8C56A] text-sm font-semibold uppercase tracking-wider rounded-sm"
              >
                Finalizar Pedido
                <Check className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
