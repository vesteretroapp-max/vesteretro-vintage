import { useState, useEffect, useCallback } from "react";
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
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  RefreshCw,
  QrCode,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/lib/supabase";
import { getPaymentProvider, type PaymentResult } from "@/lib/payment-provider";
import { getMelhorEnvioProvider, type ShippingOption } from "@/lib/melhor-envio";
import { getResendEmailService } from "@/lib/resend-emails";

const LOGO_URL =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

type Step = "info" | "address" | "shipping" | "payment" | "review" | "payment_result";

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

  // Payment state
  const [shippingOptionsList, setShippingOptionsList] = useState<ShippingOption[]>([]);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [paymentResultData, setPaymentResultData] = useState<{
    method: string;
    status: string;
    paymentId?: string;
    orderNumber?: string;
    pixQrCode?: string;
    pixExpiration?: string;
    boletoUrl?: string;
    boletoBarcode?: string;
    boletoExpiration?: string;
  } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Card form state
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
    installments: 1,
  });

  // Installment options
  const installmentOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}x sem juros`,
  }));

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

  // Local fallback shipping options
  const fallbackShippingOptions = [
    { key: "padrao", name: "Frete Padrão", price: 19.9, days: "7-15" },
    { key: "expresso", name: "Frete Expresso", price: 39.9, days: "3-7" },
    { key: "gratis", name: "Frete Grátis", price: 0, days: "10-20", note: "Acima de R$ 299" },
  ];

  // Get selected shipping
  const getSelectedShipping = () => {
    if (shippingOptionsList.length > 0) {
      return shippingOptionsList.find((s) => s.id === shippingMethod) || shippingOptionsList[0];
    }
    return fallbackShippingOptions.find((s) => s.key === shippingMethod) || fallbackShippingOptions[0];
  };

  const selectedShipping = getSelectedShipping();
  const shippingCost = subtotal >= 299 ? 0 : ("price" in selectedShipping ? selectedShipping.price : 19.9);
  const total = subtotal + shippingCost;

  // Calculate shipping via Melhor Envio
  const calculateShipping = useCallback(async () => {
    if (!formData.cep || formData.cep.replace(/\D/g, "").length !== 8) return;

    setLoadingShipping(true);
    try {
      const melhorEnvio = getMelhorEnvioProvider();
      const result = await melhorEnvio.calculateShipping({
        from_postal_code: "01001-000",
        to_postal_code: formData.cep,
        products: cartItems.map((item) => ({
          id: item.productId,
          width: 30,
          height: 5,
          length: 40,
          weight: 0.5,
          insurance_value: item.price,
          quantity: item.quantity,
        })),
      });

      if (result.success && result.options.length > 0) {
        setShippingOptionsList(result.options);
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
    } finally {
      setLoadingShipping(false);
    }
  }, [formData.cep, cartItems]);

  // Calculate shipping when CEP changes
  useEffect(() => {
    if (step === "shipping" && formData.cep) {
      calculateShipping();
    }
  }, [step, formData.cep, calculateShipping]);

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
      const finalTotal = subtotal + shippingCost - couponDiscount;

      // Process payment
      const paymentProvider = await getPaymentProvider();
      let paymentResult: PaymentResult | null = null;

      if (paymentMethod === "pix") {
        paymentResult = await paymentProvider.createPixPayment(
          finalTotal,
          `Pedido ${orderNumber} - VesteRetro`,
          orderNumber
        );
      } else if (paymentMethod === "credit") {
        paymentResult = await paymentProvider.createCardPayment(
          finalTotal,
          `Pedido ${orderNumber} - VesteRetro`,
          orderNumber,
          cardForm.installments
        );
      } else if (paymentMethod === "boleto") {
        paymentResult = await paymentProvider.createBoletoPayment(
          finalTotal,
          `Pedido ${orderNumber} - VesteRetro`,
          orderNumber
        );
      } else {
        // WhatsApp - no payment processing
        paymentResult = {
          success: true,
          status: "pending",
          payment_id: `whatsapp_${Date.now()}`,
          external_reference: orderNumber,
        };
      }

      if (!paymentResult.success) {
        throw new Error(paymentResult.error_message || "Erro ao processar pagamento");
      }

      // Save order to Supabase
      const orderData = {
        order_number: orderNumber,
        user_id: user?.id || null,
        customer_name: formData.nome,
        customer_email: formData.email,
        customer_phone: formData.telefone,
        customer_cpf: formData.cpf.replace(/\D/g, ""),
        customer_whatsapp: formData.whatsapp,
        status: "awaiting_payment",
        payment_status: paymentResult.status || "pending",
        payment_method: paymentMethod,
        subtotal,
        discount: couponDiscount,
        shipping_cost: shippingCost,
        total: finalTotal,
        coupon_code: couponCode,
        shipping_method: "name" in selectedShipping ? selectedShipping.name : "Frete Padrão",
        shipping_address: `${formData.rua}, ${formData.numero}${formData.complemento ? ` - ${formData.complemento}` : ""}, ${formData.bairro} - ${formData.cidade}/${formData.estado}, CEP: ${formData.cep}`,
      };

      let savedToDb = false;
      try {
        const { data: orderResult, error: orderError } = await supabase
          .from("orders")
          .insert(orderData)
          .select("id")
          .single();

        if (orderError) throw orderError;

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

          const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
          if (itemsError) throw itemsError;

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

      // Save to localStorage as fallback
      const orders = JSON.parse(localStorage.getItem("veste_orders") || "[]");
      const newOrder = {
        number: orderNumber,
        date: new Date().toISOString(),
        items: cartItems,
        total: finalTotal,
        subtotal,
        shipping: shippingCost,
        discount: couponDiscount,
        payment: paymentMethod,
        shipping_method: "name" in selectedShipping ? selectedShipping.name : "Frete Padrão",
        status: paymentMethod === "whatsapp" ? "Aguardando pagamento" : "Pagamento pendente",
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

      // Send confirmation email
      try {
        const emailService = getResendEmailService();
        await emailService.sendOrderConfirmation({
          order_number: orderNumber,
          customer_name: formData.nome,
          customer_email: formData.email,
          items: cartItems.map((item) => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
          subtotal,
          shipping_cost: shippingCost,
          discount: couponDiscount,
          total: finalTotal,
          payment_method: paymentMethod === "whatsapp" ? "Pagamento via WhatsApp" : paymentMethod,
          shipping_address: orderData.shipping_address,
          shipping_method: "name" in selectedShipping ? selectedShipping.name : "Frete Padrão",
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }

      // Set payment result and show result page
      setPaymentResultData({
        method: paymentMethod,
        status: paymentResult.status || "pending",
        paymentId: paymentResult.payment_id,
        orderNumber,
        pixQrCode: paymentResult.pix_qr_code,
        pixExpiration: paymentResult.pix_expiration,
        boletoUrl: paymentResult.boleto_url,
        boletoBarcode: paymentResult.boleto_barcode,
        boletoExpiration: paymentResult.boleto_expiration,
      });

      setStep("payment_result");

      // WhatsApp redirect if selected
      if (paymentMethod === "whatsapp") {
        const msg = `Olá! Acabei de realizar o pedido nº ${orderNumber} na VesteRetro e gostaria de combinar o pagamento.`;
        window.open(
          `https://wa.me/5511987516823?text=${encodeURIComponent(msg)}`,
          "_blank"
        );
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setSubmitError("Não foi possível finalizar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPixCode = () => {
    if (paymentResultData?.pixQrCode) {
      navigator.clipboard.writeText(paymentResultData.pixQrCode);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
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

  if (cartItems.length === 0 && step !== "payment_result") {
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

  // Payment Result Step
  if (step === "payment_result" && paymentResultData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-6 lg:py-10">
          <div className="flex justify-center mb-6">
            <Link to="/">
              <img src={LOGO_URL} alt="VesteRetro" className="h-10 w-auto" />
            </Link>
          </div>

          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[var(--gold)]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Pedido Recebido!
              </h2>
              <p className="text-muted-foreground">
                Pedido <span className="text-[var(--gold)] font-semibold">{paymentResultData.orderNumber}</span>
              </p>
            </div>

            {/* PIX Payment */}
            {paymentResultData.method === "pix" && (
              <div className="mb-6">
                <div className="p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <QrCode className="w-5 h-5 text-[var(--gold)]" />
                    <p className="text-sm font-semibold text-[var(--gold)]">Pagamento PIX</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Escaneie o QR Code ou copie o código abaixo para realizar o pagamento.
                  </p>

                  {/* QR Code placeholder */}
                  <div className="bg-white p-4 rounded-sm mb-4 flex items-center justify-center">
                    <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                  </div>

                  {/* PIX Code */}
                  {paymentResultData.pixQrCode && (
                    <div className="bg-background p-3 rounded-sm">
                      <p className="text-[10px] text-muted-foreground mb-2">Código PIX (Copia e Cola)</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={paymentResultData.pixQrCode}
                          readOnly
                          className="flex-1 px-3 py-2 bg-surface border border-border text-foreground text-xs rounded-sm"
                        />
                        <button
                          onClick={copyPixCode}
                          className="px-3 py-2 bg-[var(--gold)] text-background rounded-sm hover:bg-[var(--gold)]/80 transition-colors"
                        >
                          {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentResultData.pixExpiration && (
                    <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Expira em: {new Date(paymentResultData.pixExpiration).toLocaleString("pt-BR")}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-background rounded-sm border border-border">
                  <p className="text-xs text-muted-foreground">
                    ⚠️ O pagamento será confirmado automaticamente após a identificação do PIX.
                  </p>
                </div>
              </div>
            )}

            {/* Boleto Payment */}
            {paymentResultData.method === "boleto" && (
              <div className="mb-6">
                <div className="p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-5 h-5 text-[var(--gold)]" />
                    <p className="text-sm font-semibold text-[var(--gold)]">Boleto Bancário</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Utilize o código abaixo para pagamento via boleto.
                  </p>

                  {/* Boleto Barcode */}
                  {paymentResultData.boletoBarcode && (
                    <div className="bg-background p-3 rounded-sm">
                      <p className="text-[10px] text-muted-foreground mb-2">Linha Digitável</p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={paymentResultData.boletoBarcode}
                          readOnly
                          className="flex-1 px-3 py-2 bg-surface border border-border text-foreground text-xs rounded-sm font-mono"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(paymentResultData.boletoBarcode || "");
                          }}
                          className="px-3 py-2 bg-[var(--gold)] text-background rounded-sm hover:bg-[var(--gold)]/80 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentResultData.boletoUrl && (
                    <a
                      href={paymentResultData.boletoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--gold)] text-background rounded-sm hover:bg-[var(--gold)]/80 transition-colors text-sm font-semibold"
                    >
                      <Building2 className="w-4 h-4" />
                      Visualizar Boleto
                    </a>
                  )}

                  {paymentResultData.boletoExpiration && (
                    <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Vencimento: {new Date(paymentResultData.boletoExpiration).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-background rounded-sm border border-border">
                  <p className="text-xs text-muted-foreground">
                    ⚠️ O boleto leva até 3 dias úteis para ser compensado após o pagamento.
                  </p>
                </div>
              </div>
            )}

            {/* Credit Card - Approved */}
            {paymentResultData.method === "credit" && paymentResultData.status === "approved" && (
              <div className="mb-6">
                <div className="p-4 bg-[#2EA66B]/10 border border-[#2EA66B]/20 rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-[#2EA66B]" />
                    <p className="text-sm font-semibold text-[#2EA66B]">Pagamento Aprovado!</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Seu pagamento foi processado com sucesso. Seu pedido já está sendo preparado.
                  </p>
                </div>
              </div>
            )}

            {/* Credit Card - Pending */}
            {paymentResultData.method === "credit" && paymentResultData.status !== "approved" && (
              <div className="mb-6">
                <div className="p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-[var(--gold)]" />
                    <p className="text-sm font-semibold text-[var(--gold)]">Pagamento em Análise</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Seu pagamento está sendo analisado. Avisaremos assim que houver uma atualização.
                  </p>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {paymentResultData.method === "whatsapp" && (
              <div className="mb-6">
                <div className="p-4 bg-[var(--gold)]/5 border border-[var(--gold)]/20 rounded-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    <p className="text-sm font-semibold text-[#25D366]">Aguardando Contato</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Um atendente entrará em contato via WhatsApp para combinar o pagamento.
                  </p>
                  <a
                    href="https://wa.me/5511987516823?text=Olá! Gostaria de combinar o pagamento do meu pedido."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-sm hover:bg-[#25D366]/80 transition-colors text-sm font-semibold"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/pedido/${paymentResultData.orderNumber}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--gold)] text-background rounded-sm hover:bg-[var(--gold)]/80 transition-colors text-sm font-semibold"
              >
                <Truck className="w-4 h-4" />
                Acompanhar Pedido
              </Link>
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-border text-muted-foreground rounded-sm hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors text-sm"
              >
                Continuar Comprando
              </Link>
            </div>
          </div>
        </div>
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

            {loadingShipping ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-[var(--gold)] animate-spin" />
                <span className="ml-2 text-sm text-muted-foreground">Calculando frete...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {shippingOptionsList.length > 0 ? (
                  shippingOptionsList.map((option) => (
                    <label key={option.id}
                      className={`flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all ${
                        shippingMethod === option.id
                          ? "border-[var(--gold)] bg-[var(--gold)]/5"
                          : "border-[var(--gold)]/20 hover:border-[var(--gold)]/40"
                      }`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="shipping" checked={shippingMethod === option.id}
                          onChange={() => setShippingMethod(option.id)} className="accent-[var(--gold)]" />
                        <div>
                          <p className="text-sm text-foreground">{option.name}</p>
                          <p className="text-[10px] text-muted-foreground">{option.delivery_days} dias úteis</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[var(--gold)]">
                        {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2)}`}
                      </span>
                    </label>
                  ))
                ) : (
                  fallbackShippingOptions.map((option) => (
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
                  ))
                )}
              </div>
            )}

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

            {/* Credit Card Form */}
            {paymentMethod === "credit" && (
              <div className="mt-6 p-4 bg-background rounded-sm border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-4">Dados do Cartão</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Número do Cartão *</label>
                    <input type="text" value={cardForm.number}
                      onChange={(e) => setCardForm({ ...cardForm, number: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                      className="w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                      placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Nome no Cartão *</label>
                    <input type="text" value={cardForm.name}
                      onChange={(e) => setCardForm({ ...cardForm, name: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                      placeholder="NOME COMO ESTÁ NO CARTÃO" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Validade *</label>
                    <input type="text" value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      className="w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                      placeholder="MM/AA" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">CVV *</label>
                    <input type="text" value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                      className="w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none"
                      placeholder="000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Parcelas *</label>
                    <select value={cardForm.installments}
                      onChange={(e) => setCardForm({ ...cardForm, installments: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-surface border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none">
                      {installmentOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-3">
                  ⚠️ Dados do cartão não são salvos. Processamento seguro via gateway de pagamento.
                </p>
              </div>
            )}

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
                  <span className="text-muted-foreground">Frete ({("name" in selectedShipping) ? selectedShipping.name : "Frete Padrão"})</span>
                  <span className={shippingCost === 0 ? "text-[var(--success)]" : "text-foreground"}>
                    {shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Forma de pagamento</span>
                  <span className="text-foreground capitalize">{paymentMethod === "whatsapp" ? "WhatsApp" : paymentMethod}</span>
                </div>
                {paymentMethod === "credit" && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Parcelas</span>
                    <span className="text-foreground">{cardForm.installments}x de R$ {(total / cardForm.installments).toFixed(2)}</span>
                  </div>
                )}
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
                  <p className="text-xs text-foreground">Compra segura — Pagamento processado com segurança</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Seus dados estão protegidos. Nenhuma informação de pagamento é armazenada.
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
