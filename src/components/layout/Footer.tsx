import { Link } from "react-router";
import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  CreditCard,
  Truck,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const LOGO_URL =
  "https://i.postimg.cc/1PpMzQ81/Chat-GPT-Image-27-de-jul-de-2026-16-41-41.png";

const paymentMethods = [
  { name: "Visa", icon: "💳" },
  { name: "Mastercard", icon: "💳" },
  { name: "PIX", icon: "⚡" },
  { name: "Boleto", icon: "📄" },
  { name: "Elo", icon: "💳" },
  { name: "Amex", icon: "💳" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      {/* Newsletter Strip */}
      <div className="border-b border-border">
        <div className="container-vr py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)] font-semibold">
                Newsletter
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Receba lançamentos e promoções exclusivas
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Obrigado por se inscrever!");
              }}
              className="flex w-full md:w-auto gap-3"
            >
              <input
                required
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 md:w-72 rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-[var(--gold)] transition-colors"
              />
              <button
                type="submit"
                className="rounded-lg bg-[var(--gold)] px-6 py-3 text-sm font-bold uppercase tracking-wider text-background hover:bg-[var(--gold-light)] transition-colors"
              >
                Inscrever
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-vr grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-2">
          <Link to="/">
            <div className="logo-container">
              <img
                src={LOGO_URL}
                alt="VesteRetro — Vista a História"
                className="logo-img"
                loading="lazy"
              />
            </div>
          </Link>
          <p className="mt-4 font-display text-lg italic text-[var(--gold)]">
            Vista a História.
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Mais que camisas, vestimos histórias. Reviva os maiores momentos do
            futebol com estilo e autenticidade.
          </p>

          {/* Social Media */}
          <div className="mt-6 flex gap-3">
            {[
              { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
              { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
              {
                icon: MessageCircle,
                href: "https://wa.me/5511987516823?text=Ol%C3%A1!%20Estou%20visitando%20a%20loja%20VesteRetro.",
                label: "WhatsApp",
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-[var(--gold)] hover:text-[var(--gold)] hover:bg-[var(--gold)]/5"
              >
                <social.icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/5511987516823?text=Ol%C3%A1!%20Gostaria%20de%20atendimento."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600/10 border border-green-600/30 px-4 py-2.5 text-sm text-green-500 hover:bg-green-600/20 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Atendimento via WhatsApp
          </a>
        </div>

        {/* Institucional */}
        <div>
          <h4 className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Institucional
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/sobre" className="transition hover:text-[var(--gold)]">
                Sobre nós
              </Link>
            </li>
            <li>
              <Link to="/contato" className="transition hover:text-[var(--gold)]">
                Contato
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition hover:text-[var(--gold)]">
                Perguntas frequentes
              </Link>
            </li>
            <li>
              <Link to="/blog" className="transition hover:text-[var(--gold)]">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/trabalhe-conosco" className="transition hover:text-[var(--gold)]">
                Trabalhe conosco
              </Link>
            </li>
          </ul>
        </div>

        {/* Ajuda */}
        <div>
          <h4 className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Ajuda
          </h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li>
              <Link to="/guia-de-tamanhos" className="transition hover:text-[var(--gold)]">
                Guia de tamanhos
              </Link>
            </li>
            <li>
              <Link to="/rastreamento" className="transition hover:text-[var(--gold)]">
                Rastrear pedido
              </Link>
            </li>
            <li>
              <Link to="/trocas" className="transition hover:text-[var(--gold)]">
                Trocas e devoluções
              </Link>
            </li>
            <li>
              <Link to="/politica-de-envio" className="transition hover:text-[var(--gold)]">
                Política de envio
              </Link>
            </li>
            <li>
              <Link to="/termos" className="transition hover:text-[var(--gold)]">
                Termos de uso
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <h4 className="mb-5 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Contato
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <MessageCircle className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
              <div>
                <p className="text-foreground">+55 11 98751-6823</p>
                <p className="text-xs">WhatsApp</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
              <div>
                <p className="text-foreground">contato@vesteretro.com.br</p>
                <p className="text-xs">E-mail</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5 text-[var(--gold)]" />
              <div>
                <p className="text-foreground">Seg. a Sex., 9h às 18h</p>
                <p className="text-xs">Horário de atendimento</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-border">
        <div className="container-vr py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[var(--gold)]" />
              <span className="text-sm font-medium text-foreground">
                Formas de pagamento
              </span>
            </div>
            <div className="flex items-center gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-xs text-muted-foreground"
                >
                  <span>{method.icon}</span>
                  <span>{method.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shipping & Security */}
      <div className="border-t border-border">
        <div className="container-vr py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-5 w-5 text-[var(--gold)]" />
                <span>Envio para todo o Brasil</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-5 w-5 text-[var(--gold)]" />
                <span>Compra 100% segura</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">SSL Seguro</span>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Site Verificado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/60">
        <div className="container-vr flex flex-col items-start gap-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacidade" className="transition hover:text-[var(--gold)]">
              Privacidade
            </Link>
            <Link to="/termos" className="transition hover:text-[var(--gold)]">
              Termos
            </Link>
            <Link to="/cookies" className="transition hover:text-[var(--gold)]">
              Cookies
            </Link>
          </div>
          <p>© 2026 VesteRetro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
