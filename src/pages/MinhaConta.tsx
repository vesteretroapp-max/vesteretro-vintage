import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  User,
  Package,
  Heart,
  MapPin,
  Tag,
  Search,
  Settings,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  FileText,
  Loader2,
  Check,
  X,
  Edit3,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";

const accountLinks = [
  { name: "Visão Geral", href: "/minha-conta", icon: User },
  { name: "Dados Pessoais", href: "/minha-conta/dados", icon: User },
  { name: "Meus Pedidos", href: "/minha-conta/pedidos", icon: Package },
  { name: "Favoritos", href: "/favoritos", icon: Heart },
  { name: "Endereços", href: "/minha-conta/enderecos", icon: MapPin },
  { name: "Cupons", href: "/minha-conta/cupons", icon: Tag },
  { name: "Rastreamento", href: "/rastreamento", icon: Search },
  { name: "Alterar Senha", href: "/minha-conta/alterar-senha", icon: Settings },
];

export default function MinhaConta() {
  const { user, profile, isLoading, signOut, updateProfile } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDadosPage = location.pathname === "/minha-conta/dados";
  const isAlterarSenha = location.pathname === "/minha-conta/alterar-senha";

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: "",
    whatsapp: "",
    cpf: "",
    birth_date: "",
  });

  // Password reset state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        whatsapp: profile.whatsapp || "",
        cpf: profile.cpf || "",
        birth_date: profile.birth_date || "",
      });
    }
  }, [profile]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    const result = await updateProfile(formData);
    if (result.error) {
      setSaveMsg(result.error);
    } else {
      setSaveMsg("Dados atualizados com sucesso!");
      setEditMode(false);
    }
    setSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      setPasswordMsg("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("As senhas não conferem.");
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordMsg("Não foi possível alterar a senha.");
      } else {
        setPasswordMsg("Senha alterada com sucesso!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMsg("Erro de conexão. Tente novamente.");
    }
    setPasswordLoading(false);
  };

  const formatPhone = (phone: string) => {
    const d = phone.replace(/\D/g, "");
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7, 11)}`;
  };

  const formatCpf = (cpf: string) => {
    const d = cpf.replace(/\D/g, "");
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9, 11)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#090B0B] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#D6A632]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090B0B]">
      <div className="bg-surface border-b border-border">
        <div className="container-vr py-8 lg:py-12">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            Minha{" "}
            <span className="text-[var(--gold)]">Conta</span>
          </h1>
          {profile && (
            <p className="text-sm text-muted-foreground mt-2">
              Bem-vindo(a), {profile.full_name?.split(" ")[0] || "Cliente"}
            </p>
          )}
        </div>
      </div>

      <div className="container-vr py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {accountLinks.map((link) => {
                const isActive = link.href === location.pathname;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`flex items-center justify-between px-4 py-3 text-sm rounded-sm transition-all ${
                      isActive
                        ? "bg-surface-2 text-[var(--gold)] border-l-2 border-[var(--gold)]"
                        : "text-muted-foreground hover:text-[var(--gold)] hover:bg-surface-2"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="w-4 h-4" />
                      {link.name}
                    </div>
                    <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-destructive hover:bg-surface-2 rounded-sm transition-all mt-4"
              >
                <LogOut className="w-4 h-4" />
                Sair da conta
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Dados Pessoais */}
            {isDadosPage && (
              <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground">Dados Pessoais</h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 text-xs text-[var(--gold)] hover:underline"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  )}
                </div>

                {saveMsg && (
                  <div className={`mb-4 p-3 rounded-sm text-xs flex items-center gap-2 ${
                    saveMsg.includes("sucesso")
                      ? "bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)]"
                      : "bg-destructive/10 border border-destructive/20 text-destructive"
                  }`}>
                    {saveMsg.includes("sucesso") ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {saveMsg}
                  </div>
                )}

                <div className="space-y-4">
                  {editMode ? (
                    <>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Nome completo</label>
                        <input type="text" value={formData.full_name}
                          onChange={(e) => setFormData(p => ({ ...p, full_name: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">WhatsApp</label>
                        <input type="tel" value={formData.whatsapp}
                          onChange={(e) => setFormData(p => ({ ...p, whatsapp: e.target.value.replace(/\D/g, "").slice(0, 11) }))}
                          placeholder="(11) 99999-9999"
                          className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">CPF</label>
                        <input type="text" value={formData.cpf}
                          onChange={(e) => setFormData(p => ({ ...p, cpf: e.target.value.replace(/\D/g, "").slice(0, 11) }))}
                          placeholder="000.000.000-00"
                          className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Data de nascimento</label>
                        <input type="date" value={formData.birth_date}
                          onChange={(e) => setFormData(p => ({ ...p, birth_date: e.target.value }))}
                          className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={handleSaveProfile} disabled={saving}
                          className="btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-60">
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Salvar
                        </button>
                        <button onClick={() => setEditMode(false)}
                          className="border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-background rounded-sm">
                        <User className="w-5 h-5 text-[var(--gold)]" />
                        <div>
                          <p className="text-xs text-muted-foreground">Nome</p>
                          <p className="text-sm text-foreground">{profile?.full_name || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-background rounded-sm">
                        <Mail className="w-5 h-5 text-[var(--gold)]" />
                        <div>
                          <p className="text-xs text-muted-foreground">E-mail</p>
                          <p className="text-sm text-foreground">{profile?.email || user?.email || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-background rounded-sm">
                        <Phone className="w-5 h-5 text-[var(--gold)]" />
                        <div>
                          <p className="text-xs text-muted-foreground">WhatsApp</p>
                          <p className="text-sm text-foreground">{profile?.whatsapp ? formatPhone(profile.whatsapp) : "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-background rounded-sm">
                        <FileText className="w-5 h-5 text-[var(--gold)]" />
                        <div>
                          <p className="text-xs text-muted-foreground">CPF</p>
                          <p className="text-sm text-foreground">{profile?.cpf ? formatCpf(profile.cpf) : "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-background rounded-sm">
                        <Calendar className="w-5 h-5 text-[var(--gold)]" />
                        <div>
                          <p className="text-xs text-muted-foreground">Data de nascimento</p>
                          <p className="text-sm text-foreground">{profile?.birth_date || "—"}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Alterar Senha */}
            {isAlterarSenha && (
              <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
                <h2 className="text-lg font-bold text-foreground mb-6">Alterar Senha</h2>

                {passwordMsg && (
                  <div className={`mb-4 p-3 rounded-sm text-xs flex items-center gap-2 ${
                    passwordMsg.includes("sucesso")
                      ? "bg-[var(--success)]/10 border border-[var(--success)]/20 text-[var(--success)]"
                      : "bg-destructive/10 border border-destructive/20 text-destructive"
                  }`}>
                    {passwordMsg.includes("sucesso") ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {passwordMsg}
                  </div>
                )}

                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Nova senha</label>
                    <input type="password" value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Confirmar nova senha</label>
                    <input type="password" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repita a senha"
                      className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
                  </div>
                  <button onClick={handleChangePassword} disabled={passwordLoading}
                    className="btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-60">
                    {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Alterar senha
                  </button>
                </div>
              </div>
            )}

            {/* Visão Geral (default) */}
            {!isDadosPage && !isAlterarSenha && (
              <>
                <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
                  <h2 className="text-lg font-bold text-foreground mb-2">
                    Bem-vindo(a), {profile?.full_name?.split(" ")[0] || "Cliente"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {profile?.email || user?.email}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                    {[
                      { label: "Pedidos", value: "0", icon: Package, href: "/minha-conta/pedidos" },
                      { label: "Favoritos", value: "—", icon: Heart, href: "/favoritos" },
                      { label: "Endereços", value: "—", icon: MapPin, href: "/minha-conta/enderecos" },
                      { label: "Cupons", value: "—", icon: Tag, href: "/minha-conta/cupons" },
                    ].map((stat) => (
                      <Link key={stat.label} to={stat.href}
                        className="text-center p-4 bg-background rounded-sm hover:border hover:border-[var(--gold)]/20 transition-all group">
                        <stat.icon className="w-5 h-5 text-[var(--gold)] mx-auto mb-2 group-hover:scale-110 transition-transform" />
                        <p className="text-xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-sm p-6 lg:p-8">
                  <h3 className="text-xs uppercase tracking-widest text-[var(--gold)] font-semibold mb-4">Atalhos</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Link to="/todos-os-produtos"
                      className="flex items-center gap-3 p-3 bg-background rounded-sm hover:border hover:border-[var(--gold)]/20 transition-all text-sm text-foreground">
                      <Package className="w-4 h-4 text-[var(--gold)]" />
                      Explorar produtos
                    </Link>
                    <a href="https://wa.me/5511987516823" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-background rounded-sm hover:border hover:border-[var(--gold)]/20 transition-all text-sm text-foreground">
                      <Phone className="w-4 h-4 text-[var(--gold)]" />
                      Falar no WhatsApp
                    </a>
                    <Link to="/rastreamento"
                      className="flex items-center gap-3 p-3 bg-background rounded-sm hover:border hover:border-[var(--gold)]/20 transition-all text-sm text-foreground">
                      <Search className="w-4 h-4 text-[var(--gold)]" />
                      Rastrear pedido
                    </Link>
                    <Link to="/guia-de-tamanhos"
                      className="flex items-center gap-3 p-3 bg-background rounded-sm hover:border hover:border-[var(--gold)]/20 transition-all text-sm text-foreground">
                      <Settings className="w-4 h-4 text-[var(--gold)]" />
                      Guia de tamanhos
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
