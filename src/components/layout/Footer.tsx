import { Link } from "react-router";
import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
} from "lucide-react";

const LOGO_URL =
  "https://i.postimg.cc/xT1LsBG6/Chat-GPT-Image-27-de-jul-de-2026-16-41-41.png";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      {/* Main Footer */}
      <div className="container-vr grid gap-10 py-16 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/">
            <img
              src={LOGO_URL}
              alt="VesteRetro — Vista a História"
              className="h-20 w-auto mix-blend-lighten"
              loading="lazy"
            />
          </Link>
          <p className="mt-4 font-display text-lg italic text-[var(--gold)]">
            Vista a História.
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Mais que camisas, vestimos histórias. Reviva os maiores momentos do
            futebol com estilo e autenticidade.
          </p>
          <div className="mt-5 flex gap-3 text-muted-foreground">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-[var(--gold)] transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-[var(--gold)] transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-[var(--gold)] transition-colors"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/5511987516823?text=Ol%C3%A1!%20Estou%20visitando%20a%20loja%20VesteRetro%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20as%20camisas."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="hover:text-[var(--gold)] transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Institucional */}
        <div>
          <h4 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Institucional
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
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
          </ul>
        </div>

        {/* Atendimento */}
        <div>
          <h4 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Atendimento
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <a
                href="https://wa.me/5511987516823?text=Ol%C3%A1!%20Estou%20visitando%20a%20loja%20VesteRetro%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20as%20camisas."
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--gold)] transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <Link to="/trocas" className="transition hover:text-[var(--gold)]">
                Trocas e devoluções
              </Link>
            </li>
            <li>
              <Link
                to="/guia-de-tamanhos"
                className="transition hover:text-[var(--gold)]"
              >
                Guia de tamanhos
              </Link>
            </li>
            <li>
              <Link
                to="/rastreamento"
                className="transition hover:text-[var(--gold)]"
              >
                Rastreamento
              </Link>
            </li>
          </ul>
        </div>

        {/* Políticas */}
        <div>
          <h4 className="mb-4 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
            Políticas
          </h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link
                to="/privacidade"
                className="transition hover:text-[var(--gold)]"
              >
                Privacidade
              </Link>
            </li>
            <li>
              <Link
                to="/termos"
                className="transition hover:text-[var(--gold)]"
              >
                Termos
              </Link>
            </li>
            <li>
              <Link
                to="/politica-de-envio"
                className="transition hover:text-[var(--gold)]"
              >
                Envio
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="transition hover:text-[var(--gold)]">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/60">
        <div className="container-vr flex flex-col items-start gap-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            WhatsApp:{" "}
            <span className="text-foreground">+55 11 98751-6823</span> · Seg. a
            sex., 9h às 18h
          </p>
          <p className="text-[var(--gold)]">Meios de pagamento em breve</p>
          <p>© 2026 VesteRetro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
