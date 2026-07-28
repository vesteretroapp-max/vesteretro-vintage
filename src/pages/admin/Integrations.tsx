import { useState, useEffect } from "react";
import {
  Link as LinkIcon,
  CreditCard,
  Truck,
  Mail,
  MessageCircle,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  Settings,
  Shield,
  Globe,
} from "lucide-react";
import { getPaymentProvider } from "@/lib/payment-provider";
import { getMelhorEnvioProvider } from "@/lib/melhor-envio";
import { getResendEmailService } from "@/lib/resend-emails";
import { getLogStats, type IntegrationService } from "@/lib/integration-logs";
import { getWebhookStats } from "@/lib/webhooks";

interface IntegrationCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "payment" | "shipping" | "email" | "messaging" | "analytics";
  isConfigured: boolean;
  environment: "sandbox" | "production" | "not_configured";
  docsUrl?: string;
  setupUrl?: string;
}

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationCard[]>([]);
  const [logStats, setLogStats] = useState<ReturnType<typeof getLogStats> | null>(null);
  const [webhookStats, setWebhookStats] = useState<ReturnType<typeof getWebhookStats> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      const paymentProvider = await getPaymentProvider();
      const melhorEnvio = getMelhorEnvioProvider();
      const resend = getResendEmailService();

      const integrationsList: IntegrationCard[] = [
        {
          id: "mercadopago",
          name: "Mercado Pago",
          description: "PIX, Cartão de Crédito e Boleto via Mercado Pago",
          icon: CreditCard,
          category: "payment",
          isConfigured: paymentProvider.isConfigured,
          environment: paymentProvider.isConfigured
            ? (paymentProvider.environment as "sandbox" | "production")
            : "not_configured",
          docsUrl: "https://mercadopago.com.br/developers",
          setupUrl: "https://www.mercadopago.com.br/developers",
        },
        {
          id: "melhor-envio",
          name: "Melhor Envio",
          description: "Cálculo de frete e geração de etiquetas de envio",
          icon: Truck,
          category: "shipping",
          isConfigured: melhorEnvio.isConfigured,
          environment: melhorEnvio.isConfigured ? "sandbox" : "not_configured",
          docsUrl: "https://docs.melhorenvio.com.br",
          setupUrl: "https://melhorenvio.com.br/planos",
        },
        {
          id: "resend",
          name: "Resend",
          description: "E-mails transacionais (confirmação, envio, notificações)",
          icon: Mail,
          category: "email",
          isConfigured: resend.isConfigured,
          environment: resend.isConfigured ? "production" : "not_configured",
          docsUrl: "https://resend.com/docs",
          setupUrl: "https://resend.com",
        },
        {
          id: "whatsapp",
          name: "WhatsApp Business",
          description: "Atendimento e notificações via WhatsApp",
          icon: MessageCircle,
          category: "messaging",
          isConfigured: true,
          environment: "production",
          setupUrl: "https://business.whatsapp.com",
        },
        {
          id: "viacep",
          name: "ViaCEP",
          description: "Consulta automática de endereço por CEP",
          icon: Globe,
          category: "shipping",
          isConfigured: true,
          environment: "production",
          docsUrl: "https://viacep.com.br",
        },
        {
          id: "google-analytics",
          name: "Google Analytics",
          description: "Análise de tráfego e comportamento do usuário",
          icon: BarChart3,
          category: "analytics",
          isConfigured: false,
          environment: "not_configured",
          docsUrl: "https://analytics.google.com",
        },
      ];

      setIntegrations(integrationsList);
      setLogStats(getLogStats());
      setWebhookStats(getWebhookStats());
    } catch (error) {
      console.error("Error loading integrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment": return "text-[#D6A632]";
      case "shipping": return "text-[#2EA66B]";
      case "email": return "text-[#4A90E2]";
      case "messaging": return "text-[#25D366]";
      case "analytics": return "text-[#9B59B6]";
      default: return "text-[#9B9B9B]";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "payment": return "Pagamento";
      case "shipping": return "Entrega";
      case "email": return "E-mail";
      case "messaging": return "Mensageria";
      case "analytics": return "Analytics";
      default: return category;
    }
  };

  const getEnvironmentBadge = (env: string) => {
    switch (env) {
      case "production":
        return (
          <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border text-[#2EA66B] border-[#2EA66B]/30">
            Produção
          </span>
        );
      case "sandbox":
        return (
          <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border text-[#D6A632] border-[#D6A632]/30">
            Sandbox
          </span>
        );
      default:
        return (
          <span className="text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border text-[#9B9B9B] border-[#9B9B9B]/30">
            Não Configurado
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-[#D6A632]/20 rounded-sm animate-pulse" />
          <div className="h-4 w-32 bg-[#D6A632]/20 rounded-sm animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-[#D6A632]/10 rounded-sm animate-pulse" />
                <div className="h-4 w-16 bg-[#D6A632]/10 rounded-sm animate-pulse" />
              </div>
              <div className="h-4 w-24 bg-[#D6A632]/10 rounded-sm animate-pulse mb-2" />
              <div className="h-3 w-full bg-[#D6A632]/10 rounded-sm animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-[#D6A632]" />
          Integrações
        </h2>
        <p className="text-[10px] text-[#9B9B9B] mt-0.5">
          Configure e monitore todas as integrações da loja
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider">Total</p>
          <p className="text-lg font-bold text-[#F8F5ED]">{integrations.length}</p>
        </div>
        <div className="bg-[#111414] border border-[#2EA66B]/10 rounded-sm p-3">
          <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider">Ativas</p>
          <p className="text-lg font-bold text-[#2EA66B]">
            {integrations.filter((i) => i.isConfigured).length}
          </p>
        </div>
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider">Sandbox</p>
          <p className="text-lg font-bold text-[#D6A632]">
            {integrations.filter((i) => i.environment === "sandbox").length}
          </p>
        </div>
        <div className="bg-[#111414] border border-[#C94B4B]/10 rounded-sm p-3">
          <p className="text-[10px] text-[#9B9B9B] uppercase tracking-wider">Não Config.</p>
          <p className="text-lg font-bold text-[#C94B4B]">
            {integrations.filter((i) => !i.isConfigured).length}
          </p>
        </div>
      </div>

      {/* Environment Warning */}
      {integrations.some((i) => i.environment === "sandbox") && (
        <div className="bg-[#D6A632]/5 border border-[#D6A632]/20 rounded-sm p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#D6A632] mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] text-[#D6A632] font-semibold uppercase tracking-wider mb-1">
                Modo Sandbox Ativo
              </p>
              <p className="text-[10px] text-[#9B9B9B]">
                Algumas integrações estão em modo de teste. Nenhum pagamento real será processado até a ativação em produção.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Integration Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4 hover:border-[#D6A632]/25 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-sm bg-[#D6A632]/10 flex items-center justify-center">
                <integration.icon className={`w-5 h-5 ${getCategoryColor(integration.category)}`} />
              </div>
              <div className="flex items-center gap-2">
                {getEnvironmentBadge(integration.environment)}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-bold text-[#F8F5ED]">{integration.name}</h3>
                {integration.isConfigured ? (
                  <CheckCircle className="w-3 h-3 text-[#2EA66B]" />
                ) : (
                  <XCircle className="w-3 h-3 text-[#9B9B9B]" />
                )}
              </div>
              <p className="text-[9px] text-[#9B9B9B]">{integration.description}</p>
              <p className="text-[8px] text-[#D6A632] uppercase tracking-wider mt-1">
                {getCategoryLabel(integration.category)}
              </p>
            </div>

            <div className="flex gap-2">
              {integration.docsUrl && (
                <a
                  href={integration.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] text-[#9B9B9B] border border-[#D6A632]/20 rounded-sm hover:border-[#D6A632]/40 hover:text-[#F8F5ED] transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Docs
                </a>
              )}
              {integration.setupUrl && (
                <a
                  href={integration.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] text-[#D6A632] border border-[#D6A632]/30 rounded-sm hover:bg-[#D6A632]/10 transition-colors uppercase tracking-wider"
                >
                  <Settings className="w-3 h-3" />
                  Configurar
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Webhook & Log Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Webhooks */}
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4">
          <h3 className="text-xs font-bold text-[#F8F5ED] mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D6A632]" />
            Webhooks
          </h3>
          {webhookStats ? (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#9B9B9B]">Total recebidos</span>
                <span className="text-[#F8F5ED]">{webhookStats.total}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#9B9B9B]">Processados</span>
                <span className="text-[#2EA66B]">{webhookStats.processed}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#9B9B9B]">Falhas</span>
                <span className="text-[#C94B4B]">{webhookStats.failed}</span>
              </div>
            </div>
          ) : (
            <p className="text-[10px] text-[#9B9B9B]">Nenhum dado disponível</p>
          )}
        </div>

        {/* Integration Logs */}
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4">
          <h3 className="text-xs font-bold text-[#F8F5ED] mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#D6A632]" />
            Logs de Integração
          </h3>
          {logStats ? (
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span className="text-[#9B9B9B]">Total de chamadas</span>
                <span className="text-[#F8F5ED]">{logStats.total}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#9B9B9B]">Taxa de sucesso</span>
                <span className="text-[#2EA66B]">{logStats.successRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-[#9B9B9B]">Erros recentes</span>
                <span className="text-[#C94B4B]">{logStats.recentErrors.length}</span>
              </div>
            </div>
          ) : (
            <p className="text-[10px] text-[#9B9B9B]">Nenhum dado disponível</p>
          )}
        </div>
      </div>

      {/* Environment Variables Info */}
      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4">
        <h3 className="text-xs font-bold text-[#F8F5ED] mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#D6A632]" />
          Variáveis de Ambiente Necessárias
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-[#0a0b0b] p-2 rounded-sm">
            <p className="text-[9px] text-[#D6A632] font-mono">VITE_MERCADO_PAGO_ACCESS_TOKEN</p>
            <p className="text-[8px] text-[#9B9B9B]">Token de acesso da API Mercado Pago</p>
          </div>
          <div className="bg-[#0a0b0b] p-2 rounded-sm">
            <p className="text-[9px] text-[#D6A632] font-mono">VITE_MERCADO_PAGO_PUBLIC_KEY</p>
            <p className="text-[8px] text-[#9B9B9B]">Chave pública para tokenização de cartão</p>
          </div>
          <div className="bg-[#0a0b0b] p-2 rounded-sm">
            <p className="text-[9px] text-[#D6A632] font-mono">VITE_MELHOR_ENVIO_TOKEN</p>
            <p className="text-[8px] text-[#9B9B9B]">Token de acesso da API Melhor Envio</p>
          </div>
          <div className="bg-[#0a0b0b] p-2 rounded-sm">
            <p className="text-[9px] text-[#D6A632] font-mono">VITE_RESEND_API_KEY</p>
            <p className="text-[8px] text-[#9B9B9B]">Chave de API do Resend para e-mails</p>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={loadIntegrations}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-[#D6A632] border border-[#D6A632]/30 rounded-sm hover:bg-[#D6A632]/10 transition-colors uppercase tracking-wider"
        >
          <RefreshCw className="w-3 h-3" />
          Atualizar Status
        </button>
      </div>
    </div>
  );
}
