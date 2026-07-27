import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  slug: string;
}

export default function Carrinho() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [cep, setCep] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("veste_cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        setCartItems([]);
      }
    }
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem("veste_cart", JSON.stringify(items));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQuantity = (productId: string, size: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.id === productId && item.size === size) {
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
      (item) => !(item.id === productId && item.size === size)
    );
    updateCart(updated);
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 299 ? 0 : 19.9;
  const total = subtotal + shipping;

  const whatsappMessage = `Olá! Gostaria de finalizar minha compra na VesteRetro. Meu carrinho tem ${cartItems.length} itens, total de R$ ${total.toFixed(2)}.`;
  const whatsappUrl = `https://wa.me/5511987516823?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#090B0B]">
      {/* Header */}
      <div className="bg-[#111414] border-b border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
          <h1 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED]">
            Seu{" "}
            <span className="gold-text">Carrinho</span>
          </h1>
          <p className="text-sm text-[#9B9B9B] mt-2">
            {cartItems.length} {cartItems.length === 1 ? "item" : "itens"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-[#D6A632]/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-[#F8F5ED] mb-2">
              Seu carrinho está vazio
            </h2>
            <p className="text-sm text-[#9B9B9B] mb-6">
              Explore nossa coleção e encontre a camisa perfeita.
            </p>
            <Link
              to="/todos-os-produtos"
              className="inline-flex items-center gap-2 bg-[#D6A632] text-[#090B0B] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-all"
            >
              Ver produtos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => {
                const itemTotal = item.price * item.quantity;
                return (
                  <div
                    key={`${item.productId}-${item.size}-${index}`}
                    className="flex gap-4 bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4"
                  >
                    <Link
                      to={`/produto/${item.slug}`}
                      className="w-20 h-24 sm:w-24 sm:h-28 shrink-0 bg-[#090B0B] rounded-sm overflow-hidden"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/produto/${item.slug}`}
                        className="text-sm text-[#F8F5ED] hover:text-[#D6A632] transition-colors line-clamp-2 font-medium"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[10px] text-[#D6A632] mt-1 uppercase tracking-wider">
                        Tamanho: {item.size}
                      </p>
                      <p className="text-sm font-bold text-[#D6A632] mt-2">
                        R$ {itemTotal.toFixed(2)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#D6A632]/30 rounded-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, -1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs text-[#F8F5ED]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, 1)
                            }
                            className="w-8 h-8 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-[#9B9B9B] hover:text-[#C94B4B] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Coupon */}
              <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4">
                <p className="text-xs uppercase tracking-wider text-[#D4D4D4] mb-2">
                  Cupom de desconto
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  />
                  <button className="px-4 py-2 bg-[#D6A632] text-[#090B0B] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
                    Aplicar
                  </button>
                </div>
              </div>

              {/* CEP */}
              <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4">
                <p className="text-xs uppercase tracking-wider text-[#D4D4D4] mb-2">
                  Calcular frete
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className="flex-1 px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                  />
                  <button className="px-4 py-2 border border-[#D6A632]/40 text-xs text-[#D4D4D4] rounded-sm hover:border-[#D6A632] transition-colors uppercase tracking-wider">
                    Calcular
                  </button>
                </div>
              </div>

              <Link
                to="/todos-os-produtos"
                className="inline-flex items-center gap-2 text-xs text-[#D6A632] hover:text-[#E8C56A] transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Continuar comprando
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6 sticky top-24">
                <h3 className="text-xs uppercase tracking-widest text-[#D6A632] font-semibold mb-4">
                  Resumo do Pedido
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#9B9B9B]">Subtotal</span>
                    <span className="text-[#F8F5ED]">
                      R$ {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9B9B9B]">Frete</span>
                    <span
                      className={
                        shipping === 0
                          ? "text-[#2EA66B]"
                          : "text-[#F8F5ED]"
                      }
                    >
                      {shipping === 0
                        ? "Grátis"
                        : `R$ ${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal >= 299 && (
                    <p className="text-[10px] text-[#2EA66B]">
                      🎉 Frete grátis para pedidos acima de R$ 299,00
                    </p>
                  )}
                  <div className="border-t border-[#D6A632]/10 pt-3">
                    <div className="flex justify-between text-base">
                      <span className="text-[#F8F5ED] font-semibold">
                        Total
                      </span>
                      <span className="text-[#D6A632] font-bold">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#9B9B9B] mt-1">
                      ou 12x de R$ {(total / 12).toFixed(2)} sem juros
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mt-6">
                  <Button
                    onClick={() => navigate("/checkout")}
                    className="w-full bg-[#D6A632] text-[#090B0B] hover:bg-[#E8C56A] text-sm font-semibold uppercase tracking-wider h-12 rounded-sm"
                  >
                    Ir para checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 border border-[#2EA66B]/40 text-[#2EA66B] text-sm font-semibold h-12 rounded-sm hover:bg-[#2EA66B]/10 transition-colors"
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
                    <div
                      key={ben.text}
                      className="flex items-center gap-2 text-[10px] text-[#9B9B9B]"
                    >
                      <ben.icon className="w-3 h-3 text-[#D6A632]" />
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
