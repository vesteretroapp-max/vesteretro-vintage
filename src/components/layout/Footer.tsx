import { Link } from "react-router";
import {
  Instagram,
  Facebook,
  Music2,
  Youtube,
  MessageCircle,
  Mail,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
} from "lucide-react";

const logoUrl =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export function Footer() {
  return (
    <footer className="bg-[#090B0B] border-t border-[#D6A632]/20">
      {/* Benefits Bar */}
      <div className="border-b border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Shield, label: "Compra Protegida" },
              { icon: MessageCircle, label: "Atendimento via WhatsApp" },
              { icon: RotateCcw, label: "Troca Facilitada" },
              { icon: Truck, label: "Envio para todo o Brasil" },
              { icon: CreditCard, label: "Parcele em até 12x" },
              { icon: Headphones, label: "Suporte Premium" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center gap-2"
              >
                <item.icon className="w-5 h-5 text-[#D6A632]" />
                <span className="text-[10px] uppercase tracking-widest text-[#D4D4D4]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoUrl}
                alt="VesteRetro"
                className="h-10 w-auto"
              />
              <div>
                <h3 className="text-lg font-bold tracking-wider text-[#F8F5ED]">
                  VesteRetro
                </h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-serif italic">
                  Vista a História.
                </p>
              </div>
            </Link>
            <p className="text-xs text-[#9B9B9B] leading-relaxed font-serif italic">
              Mais que camisas, vestimos histórias. Reviva os maiores momentos do
              futebol com estilo e autenticidade.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#D6A632]/30 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632] hover:border-[#D6A632] transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#D6A632]/30 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632] hover:border-[#D6A632] transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#D6A632]/30 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632] hover:border-[#D6A632] transition-all"
                aria-label="TikTok"
              >
                <Music2 className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#D6A632]/30 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632] hover:border-[#D6A632] transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Institucional */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#D6A632] font-semibold mb-5">
              Institucional
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Sobre a VesteRetro", href: "/sobre" },
                { name: "Contato", href: "/contato" },
                { name: "Perguntas Frequentes", href: "/faq" },
                { name: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs text-[#9B9B9B] hover:text-[#D6A632] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#D6A632] font-semibold mb-5">
              Atendimento
            </h4>
            <ul className="space-y-3">
              {[
                {
                  name: "WhatsApp",
                  href: "https://wa.me/5511987516823",
                  external: true,
                },
                { name: "Trocas e Devoluções", href: "/trocas-devolucoes" },
                { name: "Guia de Tamanhos", href: "/guia-de-tamanhos" },
                { name: "Rastreamento", href: "/rastreamento" },
              ].map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#9B9B9B] hover:text-[#D6A632] transition-colors"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-xs text-[#9B9B9B] hover:text-[#D6A632] transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 space-y-2">
              <a
                href="https://wa.me/5511987516823"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#D6A632]" />
                +55 (11) 98751-6823
              </a>
              <p className="text-[10px] text-[#9B9B9B]">
                Segunda a sexta, 9h às 18h.
              </p>
            </div>
          </div>

          {/* Políticas */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#D6A632] font-semibold mb-5">
              Políticas
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Política de Privacidade", href: "/privacidade" },
                { name: "Termos de Uso", href: "/termos" },
                { name: "Política de Envio", href: "/politica-de-envio" },
                { name: "Cookies", href: "/cookies" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-xs text-[#9B9B9B] hover:text-[#D6A632] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-[10px] uppercase tracking-widest text-[#D6A632] font-semibold mb-3">
                Receba Novidades
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = new FormData(form).get("email") as string;
                  if (email) {
                    alert(
                      "Obrigado por se inscrever! Em breve você receberá nossas novidades."
                    );
                    form.reset();
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Seu e-mail"
                  required
                  className="flex-1 px-3 py-2 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-xs placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-[#D6A632] text-[#090B0B] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-[#9B9B9B] tracking-wider">
              &copy; 2026 VesteRetro. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[#9B9B9B]">
                Pagamento:
              </span>
              <div className="flex items-center gap-2">
                {["visa", "mastercard", "amex", "elo", "pix", "boleto"].map(
                  (flag) => (
                    <div
                      key={flag}
                      className="w-8 h-5 rounded bg-[#111414] border border-[#D6A632]/20 flex items-center justify-center"
                    >
                      <span className="text-[6px] uppercase text-[#9B9B9B] tracking-wider">
                        {flag}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
