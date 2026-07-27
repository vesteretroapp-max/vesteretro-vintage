import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { SupabaseAuthProvider } from "@/hooks/use-supabase-auth";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Layout
import { Layout } from "@/components/layout/Layout";

// Lazy loaded pages
const Home = lazy(() => import("./pages/Home.tsx"));
const Catalog = lazy(() => import("./pages/Catalog.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const Carrinho = lazy(() => import("./pages/Carrinho.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const CriarConta = lazy(() => import("./pages/CriarConta.tsx"));
const RecuperarSenha = lazy(() => import("./pages/RecuperarSenha.tsx"));
const RedefinirSenha = lazy(() => import("./pages/RedefinirSenha.tsx"));
const MinhaContaEnderecos = lazy(() => import("./pages/Enderecos.tsx"));
const MinhaConta = lazy(() => import("./pages/MinhaConta.tsx"));
const MeusPedidos = lazy(() => import("./pages/MeusPedidos.tsx"));
const Favorites = lazy(() => import("./pages/Favorites.tsx"));
const Tracking = lazy(() => import("./pages/Tracking.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Lazy loaded static pages
const SobrePage = lazy(() => import("./pages/StaticPages.tsx").then(m => ({ default: m.SobrePage })));
const ContatoPage = lazy(() => import("./pages/StaticPages.tsx").then(m => ({ default: m.ContatoPage })));
const FAQPage = lazy(() => import("./pages/StaticPages.tsx").then(m => ({ default: m.FAQPage })));
const GuiaTamanhosPage = lazy(() => import("./pages/StaticPages.tsx").then(m => ({ default: m.GuiaTamanhosPage })));

// Generic policy page placeholder (can be expanded later)
function PolicyPlaceholder({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-surface border-b border-border">
        <div className="container-vr py-12 lg:py-16 text-center">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            {title}
          </h1>
        </div>
      </div>
      <div className="container-vr py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            Esta página está sendo atualizada com as informações oficiais da VesteRetro.
          </p>
          <p className="text-sm text-muted-foreground">
            Enquanto isso, entre em contato conosco pelo WhatsApp para tirar suas dúvidas.
          </p>
          <a
            href="https://wa.me/5511987516823"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-sm text-[var(--gold)] hover:underline transition-colors"
          >
            Fale conosco no WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090B0B]">
      <div className="animate-pulse text-[#D6A632] text-sm uppercase tracking-widest">
        Carregando...
      </div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#090B0B] text-[#F8F5ED] p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold text-[#D6A632]">Erro no preview</p>
            <p className="mt-2 text-xs text-[#9B9B9B] break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-[#9B9B9B]/80 max-h-40 overflow-auto rounded border border-[#D6A632]/20 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <SupabaseAuthProvider>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              {/* Public routes with layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/todos-os-produtos" element={<Catalog />} />
                <Route path="/busca" element={<Catalog />} />
                <Route path="/lancamentos" element={<Catalog />} />
                <Route path="/promocoes" element={<Catalog />} />
                <Route path="/mais-vendidos" element={<Catalog />} />
                <Route path="/clubes-do-brasil" element={<Catalog />} />
                <Route path="/clubes-do-brasil/:club" element={<Catalog />} />
                <Route path="/clubes-do-mundo" element={<Catalog />} />
                <Route path="/clubes-do-mundo/:club" element={<Catalog />} />
                <Route path="/selecoes" element={<Catalog />} />
                <Route path="/selecoes/:team" element={<Catalog />} />
                <Route path="/categoria/:slug" element={<Catalog />} />
                <Route path="/produto/:slug" element={<ProductDetail />} />
                <Route path="/entrar" element={<Login />} />
                <Route path="/criar-conta" element={<CriarConta />} />
                <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                <Route path="/redefinir-senha" element={<RedefinirSenha />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/rastreamento" element={<Tracking />} />
                
                {/* Static pages */}
                <Route path="/sobre" element={<SobrePage />} />
                <Route path="/contato" element={<ContatoPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/guia-de-tamanhos" element={<GuiaTamanhosPage />} />
                <Route path="/privacidade" element={<PolicyPlaceholder title="Política de Privacidade" />} />
                <Route path="/termos" element={<PolicyPlaceholder title="Termos de Uso" />} />
                <Route path="/trocas-devolucoes" element={<PolicyPlaceholder title="Política de Trocas e Devoluções" />} />
                <Route path="/politica-de-envio" element={<PolicyPlaceholder title="Política de Envio" />} />
                <Route path="/cookies" element={<PolicyPlaceholder title="Política de Cookies" />} />
              </Route>

              {/* Auth */}
              <Route
                path="/auth"
                element={<AuthPage redirectAfterAuth="/" />}
              />

              {/* Checkout - no header/footer */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido/:orderNumber" element={<OrderConfirmation />} />

              {/* Authenticated routes */}
              <Route
                path="/minha-conta"
                element={
                  <RequireAuth>
                    <MinhaConta />
                  </RequireAuth>
                }
              />
              <Route
                path="/minha-conta/dados"
                element={
                  <RequireAuth>
                    <MinhaConta />
                  </RequireAuth>
                }
              />
              <Route
                path="/minha-conta/pedidos"
                element={
                  <RequireAuth>
                    <MeusPedidos />
                  </RequireAuth>
                }
              />
              <Route
                path="/minha-conta/enderecos"
                element={
                  <RequireAuth>
                    <MinhaContaEnderecos />
                  </RequireAuth>
                }
              />
              <Route
                path="/minha-conta/cupons"
                element={
                  <RequireAuth>
                    <MinhaConta />
                  </RequireAuth>
                }
              />
              <Route
                path="/minha-conta/alterar-senha"
                element={
                  <RequireAuth>
                    <MinhaConta />
                  </RequireAuth>
                }
              />

              {/* Admin */}
              <Route
                path="/admin"
                element={
                  <RequireAuth>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin/*"
                element={
                  <RequireAuth>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />        </ConvexAuthProvider>
      </SupabaseAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
