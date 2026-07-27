import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useSupabaseAuth } from "@/hooks/use-supabase-auth";
import { supabase } from "@/lib/supabase";
import {
  ShoppingBag,
  Trash2,
  Heart,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Shield,
  Truck,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  slug: string;
  club?: string;
  year?: number;
}

export default function Carrinho() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [cep, setCep] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    if (user) {
      // Try loading from Supabase
      try {
        const { data: cart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (cart) {
          const { data: items } = await supabase
            .from("cart_items")
            .select("*")
            .eq("cart_id", cart.id);

          if (items && items.length > 0) {
            const mapped = items.map((item: any) => ({
              id: item.product_id,
              productId: item.product_id,
              name: item.product_name || "",
              price: item.unit_price,
              image: item.image_url || "",
              size: item.size,
              quantity: item.quantity,
              slug: item.slug || "",
            }));
            setCartItems(mapped);
            return;
          }
        }
      } catch {
        // fallback to localStorage
      }
    }

    const stored = localStorage.getItem("veste_cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        setCartItems([]);
      }
    }
  };

  const updateCart = async (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("veste_cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));

    // Sync to Supabase if logged in
    if (user) {
      try {
        let { data: cart } = await supabase
          .from("carts")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!cart) {
          const { data: newCart } = await supabase
            .from("carts")
            .insert({ user_id: user.id })
            .select("id")
            .single();
          cart = newCart;
        }

        if (cart) {
          // Delete old items
          await supabase.from("cart_items").delete().eq("cart_id", cart.id);

          // Insert new items
          if (items.length > 0) {
            const cartItemsData = items.map((item) => ({
              cart_id: cart.id,
              product_id: item.productId,
              product_name: item.name,
              image_url: item.image,
              size: item.size,
              quantity: item.quantity,
              unit_price: item.price,
              slug: item.slug,
            }));
            await supabase.from("cart_items").insert(cartItemsData);
          }
        }
      } catch (err) {
        console.error("Error syncing cart to DB:", err);
      }
    }
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.productId === productId && item.size === size) {
          const newQty = item.quantity + delta;
          return newQty <= 0 ? null : { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    updateCart(updated);
  };

  const removeItem = (productId: string, size: string) => {
    const updated = cartItems.filter(
      (item) => !(item.productId === productId && item.size === size)
    );
    updateCart(updated);
  };

  // Apply coupon (simulated)
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError("Digite um código de cupom.");
      return;
    }
    if (couponCode.trim().toUpperCase() === "VR10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Cupom inválido ou expirado.");
      setCouponApplied(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const couponDiscount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 299 ? 0 : 19.9;
  const total = subtotal - couponDiscount + shipping;

  const whatsappMessage = `Olá! Gostaria de finalizar minha compra na VesteRetro. Meu carrinho tem ${cartItems.length} ${cartItems.length === 1 ? "item" : "itens"}, total de R$ ${total.toFixed(2)}.`;
  const whatsappUrl = `https://wa.me/5511987516823?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#090B0B]">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="container-vr py-8 lg:py-12">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
            Seu <span className="text-[var(--gold)]">Carrinho</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
          </p>
        </div>
      </div>

      <div className="container-vr py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-[var(--gold)]/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Seu carrinho está vazio</h2>
            <p className="text-sm text-muted-foreground mb-6">Explore nossa coleção e encontre a camisa perfeita.</p>
            <Link
              to="/todos-os-produtos"
              className="btn-gold rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider inline-flex items-center gap-2"
            >
              Ver produtos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="flex gap-4 bg-surface border border-border rounded-sm p-4"
                  >
                    <Link to={`/produto/${item.slug}`} className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 bg-background rounded-sm overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/produto/${item.slug}`} className="text-sm text-foreground hover:text-[var(--gold)] transition-colors line-clamp-2 font-medium">
                            {item.name}
                          </Link>
                          <p className="text-[10px] text-[var(--gold)] mt-1 uppercase tracking-wider">
                            Tamanho: {item.size}
                          </p>
                          {item.club && (
                            <p className="text-[10px] text-muted-foreground">
                              {item.club} · {item.year}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.size)}
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                          aria-label="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-sm">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, -1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, 1)}
                            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-[var(--gold)]">R$ {itemTotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon */}
              <div className="bg-surface border border-border rounded-sm p-4">
                <p className="text-xs uppercase tracking-wider text-foreground/85 mb-2">Cupom de desconto</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu cupom"
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                    className="flex-1 px-3 py-2 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                      couponApplied
                        ? "bg-[var(--success)] text-white"
                        : "btn-gold"
                    }`}
                  >
                    {couponApplied ? "Aplicado" : "Aplicar"}
                  </button>
                </div>
                {couponError && (
                  <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
                {couponApplied && (
                  <p className="text-[10px] text-[var(--success)] mt-1">🎉 Cupom aplicado! 10% de desconto.</p>
                )}
              </div>

              {/* CEP */}
              <div className="bg-surface border border-border rounded-sm p-4">
                <p className="text-xs uppercase tracking-wider text-foreground/85 mb-2">Calcular frete</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="flex-1 px-3 py-2 bg-background border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors"
                  />
                  <button className="px-4 py-2 border border-border text-xs text-muted-foreground rounded-sm hover:border-[var(--gold)] transition-colors uppercase tracking-wider">
                    Calcular
                  </button>
                </div>
              </div>

              <Link to="/todos-os-produtos" className="inline-flex items-center gap-2 text-xs text-[var(--gold)] hover:underline transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Continuar comprando
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-sm p-6 sticky top-28">
                <h3 className="text-xs uppercase tracking-widest text-[var(--gold)] font-semibold mb-4">Resumo do Pedido</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-[var(--success)]">
                      <span>Desconto (VR10)</span>
                      <span>-R$ {couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete</span>
                    <span className={shipping === 0 ? "text-[var(--success)]" : "text-foreground"}>
                      {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 299 && (
                    <p className="text-[10px] text-muted-foreground">
                      Adicione mais R$ {(299 - subtotal).toFixed(2)} para frete grátis.
                    </p>
                  )}
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between text-base">
                      <span className="text-foreground font-semibold">Total</span>
                      <span className="text-[var(--gold)] font-bold">R$ {total.toFixed(2)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">ou 12x de R$ {(total / 12).toFixed(2)} sem juros</p>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full btn-gold rounded-md py-3 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    Ir para checkout
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-[var(--success)]/40 text-[var(--success)] text-sm font-semibold py-3 rounded-sm hover:bg-[var(--success)]/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Comprar pelo WhatsApp
                  </a>
                </div>

                <div className="mt-6 space-y-2">
                  {[
                    { icon: Shield, text: "Compra segura" },
                    { icon: Truck, text: "Envio para todo Brasil" },
                    { icon: RotateCcw, text: "Troca facilitada" },
                  ].map((ben) => (
                    <div key={ben.text} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <ben.icon className="w-3 h-3 text-[var(--gold)]" />
                      {ben.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
