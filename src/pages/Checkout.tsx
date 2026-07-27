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
  Loader2,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/lib/supabase";

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

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  slug: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user, profile } = useSupabaseAuth();
  const [step, setStep] = useState<Step>("info");
  const [paymentMethod, setPaymentMethod] = useState<string>("whatsapp");
  const [shippingMethod, setShippingMethod] = useState<string>("padrao");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const getCartItems = (): CartItem[] => {
    const stored = localStorage.getItem("veste_cart");
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  };

  const [formData, setFormData] = useState<FormData>({
    nome: profile?.full_name || "",
    cpf: profile?.cpf || "",
    email: profile?.email || user?.email || "",
    telefone: profile?.phone || "",
    whatsapp: profile?.whatsapp || "",
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

  const cartItems = getCartItems();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const shippingOptions = [
    { key: "padrao", name: "Frete Padrão", price: 19.9, days: "7-15" },
    { key: "expresso", name: "Frete Expresso", price: 39.9, days: "3-7" },
    { key: "gratis", name: "Frete Grátis", price: 0, days: "10-20", note: "Acima de R$ 299" },
  ];

  const selectedShipping = shippingOptions.find((s) => s.key === shippingMethod)!;
  const shippingCost = subtotal >= 299 ? 0 : selectedShipping.price;
  const total = subtotal + shippingCost;

  const handleCepBlur = async () => {
    const cep = formData.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          rua: data.logradouro || prev.rua,
          bairro: data.bairro || prev.bairro,
          cidade: data.localidade || prev.cidade,
          estado: data.uf || prev.estado,
        }));
      }
    } catch {
      // silently fail
    }
  };

  const generateOrderNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    const seq = Date.now().toString(36).slice(-4).toUpperCase();
    return `VR-${year}-${seq}${random}`;
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const orderNumber = generateOrderNumber();
      const couponCode = localStorage.getItem("veste_coupon") || null;
      const couponDiscount = couponCode ? subtotal * 0.1 : 0;

      // Apply coupon discount from local
      const finalTotal = subtotal + shippingCost - couponDiscount;

      const orderData = {
        order_number: orderNumber,
        user_id: user?.id || null,
        customer_name: formData.nome,
        customer_email: formData.email,
        customer_phone: formData.telefone,
        customer_cpf: formData.cpf.replace(/\D/g, ""),
        customer_whatsapp: formData.whatsapp,
        status: "awaiting_payment",
        payment_status: "pending",
        payment_method: paymentMethod,
        subtotal: subtotal,
        discount: couponDiscount,
        shipping_cost: shippingCost,
        total: finalTotal,
        coupon_code: couponCode,
        shipping_method: selectedShipping.name,
        shipping_address: `${formData.rua}, ${formData.numero}${formData.complemento ? ` - ${formData.complemento}` : ""}, ${formData.bairro} - ${formData.cidade}/${formData.estado}, CEP: ${formData.cep}`,
      };

      // Try to save to Supabase
      let savedToDb = false;
      try {
        const { data: orderResult, error: orderError } = await supabase
          .from("orders")
          .insert(orderData)
          .select("id")
          .single();

        if (orderError) throw orderError;

        // Save order items
        if (orderResult) {
          const orderItems = cartItems.map((item) => ({
            order_id: orderResult.id,
            product_id: item.productId,
            variant_id: item.productId + "-" + item.size,
            product_name: item.name,
            product_slug: item.slug,
            image_url: item.image,
            size: item.size,
            sku: item.size,
            quantity: item.quantity,
            unit_price: item.price,
            total_price: item.price * item.quantity,
          }));

          const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItems);

          if (itemsError) throw itemsError;

          // Create initial status history
          await supabase.from("order_status_history").insert({
            order_id: orderResult.id,
            status: "awaiting_payment",
            message: "Seu pedido foi recebido e está aguardando a confirmação do pagamento.",
            created_by: user?.id || "guest",
          });

          savedToDb = true;
        }
      } catch (dbError) {
        console.error("Error saving order to DB, falling back to localStorage:", dbError);
        savedToDb = false;
      }

      // Always save to localStorage as fallback
      const orders = JSON.parse(localStorage.getItem("veste_orders") || "[]");
      const newOrder = {
        number: orderNumber,
        date: new Date().toISOString(),
        items: cartItems,
        total: finalTotal,
        subtotal: subtotal,
        shipping: shippingCost,
        discount: couponDiscount,
        payment: paymentMethod,
        shipping_method: selectedShipping.name,
        status: "Aguardando pagamento",
        shipping_address: orderData.shipping_address,
        customer_name: formData.nome,
        customer_email: formData.email,
        customer_phone: formData.telefone,
      };
      orders.unshift(newOrder);
      localStorage.setItem("veste_orders", JSON.stringify(orders));

      // Clear cart
      localStorage.removeItem("veste_cart");
      localStorage.removeItem("veste_coupon");
      window.dispatchEvent(new Event("cart-updated"));

      // WhatsApp redirect if selected
      if (paymentMethod === "whatsapp") {
        const msg = `Olá! Acabei de realizar o pedido nº ${orderNumber} na VesteRetro e gostaria de combinar o pagamento.`;
        window.open(
          `https://wa.me/5511987516823?text=${encodeURIComponent(msg)}`,
          "_blank"
        );
      }

      navigate(`/pedido/${orderNumber}`);
    } catch (err) {
      console.error("Error creating order:", err);
      setSubmitError("Não foi possível finalizar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center shrink-0">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 text-[10px] uppercase tracking-wider ${
                i <= currentIdx ? "text-[var(--gold)]" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                  i < currentIdx
                    ? "bg-[var(--gold)] text-background"
                    : i === currentIdx
                      ? "bg-[var(--gold)] text-background"
                      : "border border-muted-foreground"
                }`}
              >
                {i < currentIdx ? <Check className="w-3 h-3" /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-4 sm:w-6 h-px ${
                  i < currentIdx ? "bg-[var(--gold)]" : "bg-[var(--gold)]/20"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="flex justify-center mb-8">
          <Link to="/"><img src={LOGO_URL} alt="VesteRetro" className="h-10 w-auto" /></Link>
        </div>
        <p className="text-muted-foreground text-sm mb-4">Seu carrinho está vazio.</p>
        <Link to="/todos-os-produtos" className="btn-gold rounded-md px-6 py-3 text-sm font-semibold uppercase">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-6 lg:py-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link to="/">
            <img src={LOGO_URL} alt="VesteRetro" className="h-10 w-auto" />
          </Link>
        </div>

        {renderStepIndicator()}

        {submitError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm">
            <p className="text-xs text-destructive">{submitError}</p>
          </div>
        )}

        {/* Step: Info */}
        {step === "info" && (
          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Identificação</h2>
            {user && profile && (
              <div className="mb-6 p-4 bg-background rounded-sm">
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="text-sm text-foreground font-medium">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Nome completo *</label>
                <input type="text" value={formData.nome} onChange={(e) => updateField("nome", e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="Seu nome completo" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">CPF *</label>
                <input type="text" value={formData.cpf} onChange={(e) => updateField("cpf", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="000.000.000-00" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">E-mail *</label>
                <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="seu@email.com" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Telefone</label>
                <input type="tel" value={formData.telefone} onChange={(e) => updateField("telefone", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="(11) 99999-9999" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">WhatsApp</label>
                <input type="tel" value={formData.whatsapp} onChange={(e) => updateField("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="(11) 99999-9999" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setStep("address")}
                className="btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Address */}
        {step === "address" && (
          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Endereço de Entrega</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">CEP *</label>
                <input type="text" value={formData.cep.replace(/\D/g, "").replace(/^(\d{5})(\d{0,3})/, "$1-$2")}
                  onBlur={handleCepBlur}
                  onChange={(e) => updateField("cep", e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="00000-000" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Rua *</label>
                <input type="text" value={formData.rua} onChange={(e) => updateField("rua", e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="Nome da rua" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Número *</label>
                <input type="text" value={formData.numero} onChange={(e) => updateField("numero", e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="Nº" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Complemento</label>
                <input type="text" value={formData.complemento} onChange={(e) => updateField("complemento", e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="Apto, Bloco" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Bairro *</label>
                <input type="text" value={formData.bairro} onChange={(e) => updateField("bairro", e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="Seu bairro" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Cidade *</label>
                <input type="text" value={formData.cidade} onChange={(e) => updateField("cidade", e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                  placeholder="Sua cidade" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Estado *</label>
                <select value={formData.estado} onChange={(e) => updateField("estado", e.target.value)}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none">
                  <option value="">Selecione</option>
                  {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep("info")}
                className="border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <button onClick={() => setStep("shipping")}
                className="btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Shipping */}
        {step === "shipping" && (
          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Forma de Entrega</h2>
            <div className="space-y-3">
              {shippingOptions.map((option) => (
                <label key={option.key}
                  className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                    shippingMethod === option.key
                      ? "border-[var(--gold)] bg-[var(--gold)]/5"
                      : "border-[var(--gold)]/20 hover:border-[var(--gold)]/40"
                  }`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="shipping" checked={shippingMethod === option.key}
                      onChange={() => setShippingMethod(option.key)} className="accent-[var(--gold)]" />
                    <div>
                      <p className="text-sm text-foreground">{option.name}</p>
                      <p className="text-[10px] text-muted-foreground">{option.days} dias úteis</p>
                      {option.note && <p className="text-[10px] text-[var(--success)]">{option.note}</p>}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[var(--gold)]">
                    {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2)}`}
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep("address")}
                className="border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <button onClick={() => setStep("payment")}
                className="btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && (
          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Forma de Pagamento</h2>

            <div className="mb-4 p-3 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm">
              <p className="text-xs text-[var(--gold)] uppercase tracking-wider font-semibold">
                🔧 Ambiente de Demonstração
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Nenhuma cobrança real será processada. As credenciais de pagamento serão configuradas em breve.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: "pix", name: "PIX", icon: Banknote, desc: "Pagamento instantâneo", disabled: false },
                { id: "credit", name: "Cartão de Crédito", icon: CreditCard, desc: "Parcele em até 12x", disabled: false },
                { id: "boleto", name: "Boleto Bancário", icon: Building2, desc: "Vencimento em 3 dias úteis", disabled: false },
                { id: "whatsapp", name: "Pagamento via WhatsApp", icon: MessageCircle, desc: "Combine o pagamento conosco", disabled: false },
              ].map((option) => (
                <label key={option.id}
                  className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${
                    paymentMethod === option.id
                      ? "border-[var(--gold)] bg-[var(--gold)]/5"
                      : "border-[var(--gold)]/20 hover:border-[var(--gold)]/40"
                  } ${option.disabled ? "opacity-40 pointer-events-none" : ""}`}>
                  <input type="radio" name="payment" value={option.id} checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)} className="accent-[var(--gold)]" />
                  <option.icon className="w-5 h-5 text-[var(--gold)] shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{option.name}</p>
                    <p className="text-[10px] text-muted-foreground">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep("shipping")}
                className="border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <button onClick={() => setStep("review")}
                className="btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                Revisar <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Review */}
        {step === "review" && (
          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Revisão do Pedido</h2>

            <div className="space-y-4 text-sm">
              <div className="p-4 bg-background rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[var(--gold)] mb-2">Dados Pessoais</p>
                <p className="text-foreground">{formData.nome}</p>
                <p className="text-muted-foreground">{formData.email}</p>
                <p className="text-muted-foreground">{formData.telefone}</p>
              </div>

              <div className="p-4 bg-background rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[var(--gold)] mb-2">Endereço</p>
                <p className="text-foreground">{formData.rua}, {formData.numero}{formData.complemento && ` - ${formData.complemento}`}</p>
                <p className="text-muted-foreground">{formData.bairro} - {formData.cidade}/{formData.estado}</p>
                <p className="text-muted-foreground">CEP: {formData.cep}</p>
              </div>

              <div className="p-4 bg-background rounded-sm">
                <p className="text-[10px] uppercase tracking-wider text-[var(--gold)] mb-2">Itens</p>
                {cartItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
                    <img src={item.image} alt="" className="w-10 h-12 object-cover rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground">Tam: {item.size} · Qtd: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-medium text-[var(--gold)]">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-background rounded-sm space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Frete ({selectedShipping.name})</span>
                  <span className={shippingCost === 0 ? "text-[var(--success)]" : "text-foreground"}>
                    {shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Forma de pagamento</span>
                  <span className="text-foreground capitalize">{paymentMethod === "whatsapp" ? "WhatsApp" : paymentMethod}</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-[var(--gold)] font-bold">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 border border-[var(--gold)]/20 rounded-sm bg-background">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-foreground">Modo demonstrativo — Pagamento em configuração</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    As credenciais de pagamento serão configuradas em breve. Seu pedido será registrado para teste.
                  </p>
                </div>
              </div>
            </div>

            {!user && (
              <div className="mt-4 p-4 bg-background rounded-sm border border-border">
                <p className="text-xs text-muted-foreground">
                  💡 Deseja criar sua conta e acompanhar seus pedidos com mais facilidade?{' '}
                  <Link to="/criar-conta" className="text-[var(--gold)] hover:underline">Criar conta</Link>
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button onClick={() => setStep("payment")}
                className="border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
              <button onClick={handleFinish} disabled={isSubmitting}
                className="btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-60">
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Finalizar Pedido <Check className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
