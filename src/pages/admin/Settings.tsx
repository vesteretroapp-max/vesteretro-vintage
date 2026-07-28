import { useState } from "react";
import {
  Settings,
  Save,
  Store,
  CreditCard,
  Truck,
  Search,
  FileText,
  Share2,
  Shield,
  Bell,
} from "lucide-react";

type SettingsTab = "geral" | "comercial" | "pedidos" | "seo" | "redes" | "notificacoes";

const tabs: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: "geral", label: "Geral", icon: Store },
  { key: "comercial", label: "Comercial", icon: CreditCard },
  { key: "pedidos", label: "Pedidos", icon: FileText },
  { key: "seo", label: "SEO", icon: Search },
  { key: "redes", label: "Redes Sociais", icon: Share2 },
  { key: "notificacoes", label: "Notificações", icon: Bell },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("geral");

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#D6A632]" />
            Configurações
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            Configurações gerais da loja
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
          <Save className="w-3 h-3" />
          Salvar
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Tabs */}
        <div className="lg:w-48 shrink-0">
          <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 text-[10px] rounded-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#D6A632]/10 text-[#D6A632]"
                    : "text-[#9B9B9B] hover:text-[#D6A632]"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6">
          {activeTab === "geral" && (
            <div className="space-y-6">
              <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
                Informações da Loja
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Nome da Loja
                  </label>
                  <input
                    type="text"
                    defaultValue="VesteRetro"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Slogan
                  </label>
                  <input
                    type="text"
                    defaultValue="Vista a História"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    E-mail
                  </label>
                  <input
                    type="email"
                    defaultValue="contato@vesteretro.com.br"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    defaultValue="+55 11 98751-6823"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Horário de Atendimento
                  </label>
                  <input
                    type="text"
                    defaultValue="Segunda a sexta, das 9h às 18h"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    placeholder="XX.XXX.XXX/XXXX-XX"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none placeholder:text-[#9B9B9B]/50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "comercial" && (
            <div className="space-y-6">
              <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
                Regras Comerciais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Parcelamento Máximo
                  </label>
                  <input
                    type="number"
                    defaultValue="12"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Parcela Mínima (R$)
                  </label>
                  <input
                    type="number"
                    defaultValue="50"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Desconto PIX (%)
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Frete Grátis a partir de (R$)
                  </label>
                  <input
                    type="number"
                    defaultValue="299.90"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-6">
              <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
                SEO
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Título Padrão
                  </label>
                  <input
                    type="text"
                    defaultValue="VesteRetro — Vista a História"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Meta Descrição
                  </label>
                  <textarea
                    defaultValue="Camisas retrô premium de clubes brasileiros, internacionais e seleções. Vista a história com estilo e autenticidade."
                    rows={3}
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none placeholder:text-[#9B9B9B]/50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "redes" && (
            <div className="space-y-6">
              <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
                Redes Sociais
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {["Instagram", "Facebook", "TikTok", "YouTube"].map((social) => (
                  <div key={social}>
                    <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                      {social}
                    </label>
                    <input
                      type="url"
                      placeholder={`https://${social.toLowerCase()}.com/...`}
                      className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none placeholder:text-[#9B9B9B]/50"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "pedidos" && (
            <div className="space-y-6">
              <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
                Configurações de Pedidos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Prefixo do Pedido
                  </label>
                  <input
                    type="text"
                    defaultValue="VR-"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
                    Prazo para Pagamento (horas)
                  </label>
                  <input
                    type="number"
                    defaultValue="24"
                    className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notificacoes" && (
            <div className="space-y-6">
              <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
                Notificações
              </h3>
              <p className="text-[10px] text-[#9B9B9B]">
                As notificações por e-mail serão configuradas com a integração de e-mail transacional (Resend, Brevo, etc.)
              </p>
              <div className="space-y-3">
                {[
                  "Novo pedido recebido",
                  "Pagamento confirmado",
                  "Pedido enviado",
                  "Produto com estoque baixo",
                  "Nova avaliação",
                  "Novo cadastro de cliente",
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-[#090B0B] rounded-sm">
                    <span className="text-[10px] text-[#D4D4D4]">{item}</span>
                    <div className="w-8 h-4 bg-[#D6A632]/20 rounded-full relative">
                      <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-[#D6A632] rounded-full transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
