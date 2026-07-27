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
      className="whatsapp-pulse fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#111414] border border-[#D6A632]/40 text-[#F8F5ED] px-4 py-3 rounded-full shadow-lg hover:bg-[#181B1B] hover:border-[#D6A632] transition-all duration-300 group"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="w-5 h-5 text-[#2EA66B] group-hover:scale-110 transition-transform" />
      <span className="hidden lg:block text-xs whitespace-nowrap">
        Fale com a VesteRetro
      </span>
    </a>
  );
}
