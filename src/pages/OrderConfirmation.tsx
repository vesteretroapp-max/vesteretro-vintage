import { useParams, Link } from "react-router";
import { CheckCircle, Package, MessageCircle, ArrowRight, ShoppingBag } from "lucide-react";

const LOGO_URL =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export default function OrderConfirmation() {
  const { orderNumber } = useParams();

  const whatsappMessage = `Olá! Gostaria de ajuda para finalizar meu pedido nº ${orderNumber}.`;
  const whatsappUrl = `https://wa.me/5511987516823?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#090B0B] flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={LOGO_URL} alt="VesteRetro" className="h-12 w-auto" />
          </Link>
        </div>

        <div className="w-20 h-20 rounded-full bg-[#2EA66B]/10 border border-[#2EA66B]/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-[#2EA66B]" />
        </div>

        <h1 className="vintage-text text-3xl font-bold text-[#F8F5ED] mb-4">
          Pedido Confirmado!
        </h1>
        <p className="text-[#D4D4D4] mb-2">
          Seu pedido foi registrado com sucesso.
        </p>
        <p className="text-sm text-[#9B9B9B] mb-8">
          Em breve você receberá um e-mail com os detalhes.
        </p>

        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6 mb-8">
          <Package className="w-8 h-8 text-[#D6A632] mx-auto mb-3" />
          <p className="text-[10px] uppercase tracking-widest text-[#D6A632] mb-1">
            Nº do Pedido
          </p>
          <p className="text-lg font-bold text-[#F8F5ED] tracking-wider">
            {orderNumber}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to={`/rastreamento?pedido=${orderNumber}`}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#D6A632] text-[#090B0B] text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-all"
          >
            Acompanhar Pedido
            <Package className="w-4 h-4" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-[#2EA66B]/40 text-[#2EA66B] text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#2EA66B]/10 transition-all"
          >
            Falar no WhatsApp
            <MessageCircle className="w-4 h-4" />
          </a>

          <Link
            to="/todos-os-produtos"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
          >
            Continuar Comprando
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
