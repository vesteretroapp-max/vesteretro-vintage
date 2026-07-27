import { Link } from "react-router";
import { Mail, MessageCircle, MapPin, Clock, ArrowRight } from "lucide-react";

const LOGO_URL =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export function SobrePage() {
  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
            Sobre Nós
          </span>
          <h1 className="vintage-text text-4xl lg:text-5xl font-bold text-[#F8F5ED] mt-4 mb-6">
            A VesteRetro{" "}
            <span className="gold-text">é paixão</span>
          </h1>
          <p className="text-lg text-[#D4D4D4] max-w-2xl mx-auto font-serif italic leading-relaxed">
            Mais que camisas, vestimos histórias. Reviva os maiores momentos do
            futebol com estilo e autenticidade.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-invert max-w-none">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="vintage-text text-2xl font-bold text-[#F8F5ED] mb-4">
                Nossa <span className="gold-text">Missão</span>
              </h2>
              <p className="text-sm text-[#D4D4D4] leading-relaxed font-serif">
                Na VesteRetro, acreditamos que cada camisa conta uma história.
                Nos dedicamos a resgatar e eternizar os mantos que marcaram
                gerações, permitindo que os amantes do futebol revivam momentos
                inesquecíveis através de peças únicas e cheias de significado.
              </p>
            </div>
            <div>
              <h2 className="vintage-text text-2xl font-bold text-[#F8F5ED] mb-4">
                Nossa <span className="gold-text">Visão</span>
              </h2>
              <p className="text-sm text-[#D4D4D4] leading-relaxed font-serif">
                Ser referência nacional em camisas retrô de futebol, oferecendo
                produtos de altíssima qualidade que celebram a história do
                esporte mais amado do Brasil e do mundo.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="vintage-text text-2xl font-bold text-[#F8F5ED] mb-6 text-center">
              Nossos <span className="gold-text">Valores</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Autenticidade",
                  desc: "Cada camisa é selecionada com cuidado para representar fielmente momentos históricos do futebol.",
                },
                {
                  title: "Qualidade",
                  desc: "Trabalhamos com os melhores fornecedores para garantir produtos premium que duram gerações.",
                },
                {
                  title: "Paixão",
                  desc: "Somos apaixonados por futebol e isso reflete em cada detalhe do nosso atendimento e produtos.",
                },
              ].map((v) => (
                <div
                  key={v.title}
                  className="text-center p-6 bg-[#111414] border border-[#D6A632]/10 rounded-sm"
                >
                  <h3 className="text-sm font-bold text-[#D6A632] uppercase tracking-wider mb-3">
                    {v.title}
                  </h3>
                  <p className="text-xs text-[#9B9B9B] leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContatoPage() {
  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
            Contato
          </span>
          <h1 className="vintage-text text-4xl lg:text-5xl font-bold text-[#F8F5ED] mt-4 mb-6">
            Fale com a{" "}
            <span className="gold-text">VesteRetro</span>
          </h1>
          <p className="text-lg text-[#D4D4D4] font-serif italic">
            Estamos aqui para ajudar.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-lg font-bold text-[#F8F5ED] mb-6">
              Envie sua mensagem
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Mensagem enviada com sucesso! Entraremos em contato em breve.");
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2.5 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2.5 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                  Mensagem
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-3 py-2.5 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none resize-none"
                  placeholder="Sua mensagem"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#D6A632] text-[#090B0B] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-all"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#F8F5ED] mb-6">
              Informações de Contato
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-5 h-5 text-[#D6A632] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#F8F5ED]">WhatsApp</p>
                  <a
                    href="https://wa.me/5511987516823"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#D6A632] hover:text-[#E8C56A] transition-colors"
                  >
                    +55 (11) 98751-6823
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#D6A632] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#F8F5ED]">E-mail</p>
                  <a
                    href="mailto:contato@vesteretro.com.br"
                    className="text-xs text-[#D6A632] hover:text-[#E8C56A] transition-colors"
                  >
                    contato@vesteretro.com.br
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#D6A632] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#F8F5ED]">Horário de Atendimento</p>
                  <p className="text-xs text-[#9B9B9B]">
                    Segunda a sexta-feira, das 9h às 18h.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQPage() {
  const faqs = [
    {
      q: "Quanto tempo leva para meu pedido ser processado?",
      a: "Após a confirmação do pagamento, seu pedido é processado em até 2 dias úteis.",
    },
    {
      q: "Qual o prazo de entrega?",
      a: "O prazo varia de acordo com a região: 7 a 15 dias úteis para frete padrão e 3 a 7 dias úteis para frete expresso.",
    },
    {
      q: "Posso trocar o produto?",
      a: "Sim! Você pode solicitar troca em até 30 dias após o recebimento. O produto deve estar sem uso e na embalagem original.",
    },
    {
      q: "Como faço para acompanhar meu pedido?",
      a: "Você pode rastrear seu pedido pela página de Rastreamento, informando o número do pedido.",
    },
    {
      q: "Quais formas de pagamento são aceitas?",
      a: "Aceitamos PIX, cartão de crédito (em até 12x) e boleto bancário. Pagamento via WhatsApp também está disponível.",
    },
    {
      q: "As camisas são originais?",
      a: "Trabalhamos com réplicas de altíssima qualidade, produzidas com materiais premium que remetem aos modelos originais.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-20 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
            FAQ
          </span>
          <h1 className="vintage-text text-4xl lg:text-5xl font-bold text-[#F8F5ED] mt-4 mb-6">
            Perguntas{" "}
            <span className="gold-text">Frequentes</span>
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-[#111414] border border-[#D6A632]/10 rounded-sm"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer text-sm text-[#F8F5ED] hover:text-[#D6A632] transition-colors">
                {faq.q}
                <ArrowRight className="w-4 h-4 text-[#D6A632] group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4">
                <p className="text-xs text-[#9B9B9B] leading-relaxed">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PolicyPage({ title, content }: { title: string; content: string }) {
  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16 text-center">
          <h1 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED]">
            {title}
          </h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-sm text-[#D4D4D4] leading-relaxed font-serif space-y-4">
          {content.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GuiaTamanhosPage() {
  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-4xl mx-auto px-4 py-12 lg:py-16 text-center">
          <h1 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED]">
            Guia de{" "}
            <span className="gold-text">Tamanhos</span>
          </h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D6A632]/20">
                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-[#D6A632]">Tamanho</th>
                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-[#D6A632]">Largura (cm)</th>
                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-[#D6A632]">Comprimento (cm)</th>
                <th className="text-left py-3 px-4 text-[10px] uppercase tracking-wider text-[#D6A632]">Manga (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { size: "P", width: "50", length: "68", sleeve: "20" },
                { size: "M", width: "54", length: "71", sleeve: "21" },
                { size: "G", width: "58", length: "74", sleeve: "22" },
                { size: "GG", width: "62", length: "77", sleeve: "23" },
                { size: "XG", width: "66", length: "80", sleeve: "24" },
                { size: "2XG", width: "70", length: "83", sleeve: "25" },
                { size: "3XG", width: "74", length: "86", sleeve: "26" },
                { size: "4XG", width: "78", length: "89", sleeve: "27" },
              ].map((row) => (
                <tr key={row.size} className="border-b border-[#D6A632]/5">
                  <td className="py-3 px-4 text-[#F8F5ED] font-medium">{row.size}</td>
                  <td className="py-3 px-4 text-[#D4D4D4]">{row.width}</td>
                  <td className="py-3 px-4 text-[#D4D4D4]">{row.length}</td>
                  <td className="py-3 px-4 text-[#D4D4D4]">{row.sleeve}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-[#9B9B9B] mt-6 italic">
          Confira as medidas antes da compra. Modelos e fornecedores podem apresentar
          pequenas variações.
        </p>
      </div>
    </div>
  );
}
