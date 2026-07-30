import { Link } from "react-router";
import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";

const LOGO_URL =
  "https://i.postimg.cc/1PpMzQ81/Chat-GPT-Image-27-de-jul-de-2026-16-41-41.png";

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-background">
      <div className="container-vr">
        {/* Top section — Brand + columns */}
        <div className="grid gap-16 py-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <div className="logo-container">
                <img
                  src={LOGO_URL}
                  alt="VesteRetro"
                  className="logo-img"
                  loading="lazy"
                />
              </div>
            </Link>
            <p className="mt-6 font-display text-base italic text-[var(--gold)]/80">
              Vista a História.
            </p>
            <p className="mt-4 max-w-[260px] text-xs leading-relaxed text-muted-foreground/50">
              Mais que camisas, vestimos histórias. Reviva os maiores momentos do futebol.
            </p>

            {/* Social */}
            <div className="mt-8 flex gap-4">
              {[
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
                { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                {
                  icon: MessageCircle,
                  href: "https://wa.me/5511987516823",
                  label: "WhatsApp",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center border border-border/30 text-muted-foreground/40 transition-all duration-300 hover:border-[var(--gold)]/30 hover:text-[var(--gold)]"
                >
                  <social.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Colunas */}
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]/60 mb-6">
              Institucional
            </h4>
            <ul className="space-y-3.5 text-xs text-muted-foreground/50">
              <li><Link to="/sobre" className="hover:text-[var(--gold)] transition-colors duration-300">Sobre nós</Link></li>
              <li><Link to="/contato" className="hover:text-[var(--gold)] transition-colors duration-300">Contato</Link></li>
              <li><Link to="/faq" className="hover:text-[var(--gold)] transition-colors duration-300">Perguntas frequentes</Link></li>
              <li><Link to="/blog" className="hover:text-[var(--gold)] transition-colors duration-300">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]/60 mb-6">
              Ajuda
            </h4>
            <ul className="space-y-3.5 text-xs text-muted-foreground/50">
              <li><Link to="/guia-de-tamanhos" className="hover:text-[var(--gold)] transition-colors duration-300">Guia de tamanhos</Link></li>
              <li><Link to="/rastreamento" className="hover:text-[var(--gold)] transition-colors duration-300">Rastrear pedido</Link></li>
              <li><Link to="/trocas" className="hover:text-[var(--gold)] transition-colors duration-300">Trocas e devoluções</Link></li>
              <li><Link to="/politica-de-envio" className="hover:text-[var(--gold)] transition-colors duration-300">Política de envio</Link></li>
              <li><Link to="/termos" className="hover:text-[var(--gold)] transition-colors duration-300">Termos de uso</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]/60 mb-6">
              Contato
            </h4>
            <ul className="space-y-4 text-xs text-muted-foreground/50">
              <li className="flex items-start gap-2.5">
                <MessageCircle className="h-3.5 w-3.5 mt-0.5 text-[var(--gold)]/40" />
                <div>
                  <p className="text-foreground/70">+55 11 98751-6823</p>
                  <p className="text-[10px] mt-0.5">WhatsApp</p>
                </div>
              </li>
              <li>
                <p className="text-foreground/70">contato@vesteretro.com.br</p>
                <p className="text-[10px] mt-0.5">Seg. a Sex., 9h às 18h</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar — ultra minimal */}
        <div className="border-t border-border/20 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-[10px] text-muted-foreground/30">
            <Link to="/privacidade" className="hover:text-[var(--gold)] transition-colors duration-300">Privacidade</Link>
            <Link to="/termos" className="hover:text-[var(--gold)] transition-colors duration-300">Termos</Link>
            <Link to="/cookies" className="hover:text-[var(--gold)] transition-colors duration-300">Cookies</Link>
          </div>
          <p className="text-[10px] text-muted-foreground/30">
            © 2026 VesteRetro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
