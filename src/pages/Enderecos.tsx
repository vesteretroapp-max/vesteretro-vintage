import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Loader2,
  Home,
  Star,
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/lib/supabase";

interface Address {
  id: string;
  label: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia: string;
  destinatario: string;
  telefone: string;
  is_primary: boolean;
}

export default function Enderecos() {
  const { user } = useSupabaseAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    label: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    referencia: "",
    destinatario: "",
    telefone: "",
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (user) loadAddresses();
    else setLoading(false);
  }, [user]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user!.id)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses((data as Address[]) || []);
    } catch (err) {
      console.error("Error loading addresses:", err);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCepBlur = async () => {
    const cep = form.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          rua: data.logradouro || "",
          bairro: data.bairro || "",
          cidade: data.localidade || "",
          estado: data.uf || "",
        }));
      }
    } catch {
      // ViaCEP failed silently
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const addressData = {
        user_id: user.id,
        ...form,
        is_primary: addresses.length === 0,
      };

      if (editingId) {
        const { error } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("addresses")
          .insert(addressData);
        if (error) throw error;
      }

      await loadAddresses();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error("Error saving address:", err);
      setError("Não foi possível salvar o endereço.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este endereço?")) return;
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
      await loadAddresses();
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleSetPrimary = async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from("addresses")
        .update({ is_primary: false })
        .eq("user_id", user.id);
      await supabase
        .from("addresses")
        .update({ is_primary: true })
        .eq("id", id);
      await loadAddresses();
    } catch (err) {
      console.error("Error setting primary address:", err);
    }
  };

  const startEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      cep: addr.cep,
      rua: addr.rua,
      numero: addr.numero,
      complemento: addr.complemento || "",
      bairro: addr.bairro,
      cidade: addr.cidade,
      estado: addr.estado,
      referencia: addr.referencia || "",
      destinatario: addr.destinatario,
      telefone: addr.telefone || "",
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  const formatCep = (cep: string) => {
    const d = cep.replace(/\D/g, "");
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5, 8)}`;
  };

  if (loading) {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
                Meus <span className="text-[var(--gold)]">Endereços</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Gerencie seus endereços de entrega
              </p>
            </div>
            {!showForm && (
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
                className="btn-gold rounded-md px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo Endereço
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-vr py-8">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-xs text-destructive flex items-center gap-2">
            <X className="w-4 h-4" /> {error}
          </div>
        )}

        {showForm && (
          <div className="bg-surface border border-border rounded-sm p-6 lg:p-8 mb-8">
            <h3 className="text-sm font-bold text-foreground mb-6">
              {editingId ? "Editar Endereço" : "Novo Endereço"}
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Identificação *</label>
                <input type="text" value={form.label} onChange={(e) => setForm(p => ({ ...p, label: e.target.value }))}
                  placeholder="Ex: Minha casa, Trabalho"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Destinatário *</label>
                <input type="text" value={form.destinatario} onChange={(e) => setForm(p => ({ ...p, destinatario: e.target.value }))}
                  placeholder="Nome do destinatário"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">CEP *</label>
                <input type="text" value={formatCep(form.cep)} onBlur={handleCepBlur}
                  onChange={(e) => setForm(p => ({ ...p, cep: e.target.value.replace(/\D/g, "").slice(0, 8) }))}
                  placeholder="00000-000"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Telefone</label>
                <input type="tel" value={form.telefone} onChange={(e) => setForm(p => ({ ...p, telefone: e.target.value.replace(/\D/g, "").slice(0, 11) }))}
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Rua *</label>
                <input type="text" value={form.rua} onChange={(e) => setForm(p => ({ ...p, rua: e.target.value }))}
                  placeholder="Nome da rua"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Número *</label>
                <input type="text" value={form.numero} onChange={(e) => setForm(p => ({ ...p, numero: e.target.value }))}
                  placeholder="Nº"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Complemento</label>
                <input type="text" value={form.complemento} onChange={(e) => setForm(p => ({ ...p, complemento: e.target.value }))}
                  placeholder="Apto, Bloco, Casa"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Bairro *</label>
                <input type="text" value={form.bairro} onChange={(e) => setForm(p => ({ ...p, bairro: e.target.value }))}
                  placeholder="Seu bairro"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Cidade *</label>
                <input type="text" value={form.cidade} onChange={(e) => setForm(p => ({ ...p, cidade: e.target.value }))}
                  placeholder="Sua cidade"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Estado *</label>
                <select value={form.estado} onChange={(e) => setForm(p => ({ ...p, estado: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none">
                  <option value="">Selecione</option>
                  {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-wider text-foreground/85 mb-1.5 block">Referência</label>
                <input type="text" value={form.referencia} onChange={(e) => setForm(p => ({ ...p, referencia: e.target.value }))}
                  placeholder="Próximo ao mercado, ponto de referência"
                  className="w-full px-3 py-2.5 bg-background border border-border text-foreground text-sm rounded-sm focus:border-[var(--gold)] outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} disabled={saving}
                className="btn-gold rounded-md px-6 py-2.5 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {editingId ? "Atualizar" : "Salvar"}
              </button>
              <button onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}
                className="border border-border text-muted-foreground px-6 py-2.5 text-sm rounded-sm hover:border-[var(--gold)] transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}

        {addresses.length === 0 && !showForm ? (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-[var(--gold)]/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Nenhum endereço cadastrado</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Adicione um endereço para agilizar suas compras.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id}
                className={`bg-surface border rounded-sm p-4 lg:p-6 relative ${
                  addr.is_primary ? "border-[var(--gold)]" : "border-border"
                }`}>
                {addr.is_primary && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-[var(--gold)] uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-[var(--gold)]" />
                    Principal
                  </span>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <Home className="w-5 h-5 text-[var(--gold)] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{addr.label}</p>
                    <p className="text-xs text-muted-foreground">{addr.destinatario}</p>
                  </div>
                </div>
                <div className="text-sm text-foreground space-y-1 ml-8">
                  <p>{addr.rua}, {addr.numero}{addr.complemento ? ` - ${addr.complemento}` : ""}</p>
                  <p className="text-muted-foreground">{addr.bairro} - {addr.cidade}/{addr.estado}</p>
                  <p className="text-muted-foreground">CEP: {formatCep(addr.cep)}</p>
                </div>
                <div className="flex items-center gap-3 mt-4 ml-8">
                  <button onClick={() => startEdit(addr)}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[var(--gold)] hover:underline">
                    <Edit3 className="w-3 h-3" /> Editar
                  </button>
                  <button onClick={() => handleDelete(addr.id)}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-destructive hover:underline">
                    <Trash2 className="w-3 h-3" /> Excluir
                  </button>
                  {!addr.is_primary && (
                    <button onClick={() => handleSetPrimary(addr.id)}
                      className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-[var(--gold)]">
                      <Star className="w-3 h-3" /> Definir como principal
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link to="/minha-conta" className="text-xs text-[var(--gold)] hover:underline">
            ← Voltar para Minha Conta
          </Link>
        </div>
      </div>
    </div>
  );
}
