import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "5511987516823";
const DEFAULT_MESSAGE =
  "Olá! Estou visitando a loja VesteRetro e gostaria de tirar uma dúvida sobre as camisas.";

interface WhatsAppButtonProps {
  message?: string;
  productName?: string;
  size?: string;
  orderNumber?: string;
}

export function WhatsAppButton({
  message = DEFAULT_MESSAGE,
  productName,
  size,
  orderNumber,
}: WhatsAppButtonProps) {
  let finalMessage = message;

  if (productName && size) {
    finalMessage = `Olá! Gostaria de mais informações sobre a camisa ${productName}, tamanho ${size}.`;
  } else if (orderNumber) {
    finalMessage = `Olá! Gostaria de ajuda para finalizar meu pedido nº ${orderNumber}.`;
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(finalMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Suporte no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[var(--success)] px-4 py-3 text-sm font-semibold text-white shadow-2xl animate-pulse-gold hover:brightness-110 transition-all"
    >
      <MessageCircle className="h-5 w-5 shrink-0" />
      <span className="hidden sm:inline">Suporte</span>
    </a>
  );
}
