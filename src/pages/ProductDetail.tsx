import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Star,
  MessageCircle,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { demoProducts } from "@/data/products";

export default function ProductDetail() {
  const { slug } = useParams();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [cep, setCep] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [imgError, setImgError] = useState<Set<number>>(new Set());
  const [sizeError, setSizeError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const product = demoProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#090B0B] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Produto não encontrado.</p>
          <Link
            to="/todos-os-produtos"
            className="inline-block mt-4 text-sm text-[var(--gold)] hover:underline transition-colors"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.promotionalPrice || product.price;
  const installmentPrice = currentPrice / 12;
  const discount = product.promotionalPrice
    ? Math.round(((product.price - product.promotionalPrice) / product.price) * 100)
    : 0;

  const relatedProducts = demoProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.club === product.club || p.decade === product.decade || p.category === product.category)
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    setAddedToCart(true);

    const cart = JSON.parse(localStorage.getItem("veste_cart") || "[]");
    const existingIndex = cart.findIndex(
      (item: any) => item.id === product.id && item.size === selectedSize
    );
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: currentPrice,
        image: product.images[0],
        size: selectedSize,
        quantity,
        slug: product.slug,
        club: product.club,
        year: product.year,
      });
    }
    localStorage.setItem("veste_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate after adding to cart
    setTimeout(() => window.location.href = "/carrinho", 300);
  };

  const whatsappMessage = selectedSize
    ? `Olá! Gostaria de mais informações sobre a camisa ${product.name}, tamanho ${selectedSize}.`
    : `Olá! Gostaria de mais informações sobre a camisa ${product.name}.`;
  const whatsappUrl = `https://wa.me/5511987516823?text=${encodeURIComponent(whatsappMessage)}`;

  const tabs = [
    { id: "description", label: "Descrição", show: true },
    { id: "history", label: "História", show: !!product.history },
    { id: "details", label: "Detalhes", show: true },
    { id: "shipping", label: "Envio e Troca", show: true },
  ].filter((t) => t.show);

  return (
    <div className="min-h-screen bg-[#090B0B]">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container-vr py-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Link to="/" className="hover:text-[var(--gold)] transition-colors">Início</Link>
            <span>/</span>
            <Link
              to={`/${product.category === "brasil" ? "clubes-do-brasil" : product.category === "mundo" ? "clubes-do-mundo" : "selecoes"}`}
              className="hover:text-[var(--gold)] transition-colors"
            >
              {product.category === "brasil" ? "Clubes do Brasil" : product.category === "mundo" ? "Clubes do Mundo" : "Seleções"}
            </Link>
            <span>/</span>
            <span className="text-foreground/70">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product */}
      <div className="container-vr py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-surface border border-border rounded-sm overflow-hidden group">
              {!imgError.has(selectedImage) ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={() => setImgError((prev) => new Set([...prev, selectedImage]))}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-2">
                  <ShoppingBag className="w-16 h-16 text-[var(--gold)]/20" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-[var(--gold)] text-background text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                    Novo
                  </span>
                )}
                {discount > 0 && (
                  <span className="bg-destructive text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                    -{discount}%
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-background/80 text-foreground text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-[var(--gold)]/30 backdrop-blur">
                    Mais Vendido
                  </span>
                )}
              </div>

              {/* Favorite */}
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="absolute top-4 right-4 w-10 h-10 bg-background/80 border border-border rounded-full flex items-center justify-center hover:bg-background transition-colors"
                aria-label="Favoritar"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground"}`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-sm overflow-hidden shrink-0 transition-all ${
                    i === selectedImage ? "border-[var(--gold)]" : "border-border hover:border-[var(--gold)]/40"
                  }`}
                >
                  {!imgError.has(i) ? (
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy"
                      onError={() => setImgError((prev) => new Set([...prev, i]))}
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-[var(--gold)] font-medium">
                  {product.club}
                </span>
                <span className="text-[10px] text-muted-foreground">•</span>
                <span className="text-[10px] text-muted-foreground">{product.year}</span>
              </div>
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i <= Math.floor(product.rating) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {product.rating} ({product.reviewCount} {product.reviewCount === 1 ? "avaliação" : "avaliações"})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1 py-4 border-t border-b border-border">
              {product.promotionalPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-lg text-muted-foreground line-through">R$ {product.price.toFixed(2)}</span>
                  <span className="font-display text-3xl font-bold text-[var(--gold)]">R$ {product.promotionalPrice.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-display text-3xl font-bold text-[var(--gold)]">R$ {product.price.toFixed(2)}</span>
              )}
              <p className="text-xs text-muted-foreground">ou 12x de R$ {installmentPrice.toFixed(2)} sem juros</p>
              <p className="text-[10px] text-[var(--success)]">🎯 Desconto no PIX: 5% OFF</p>
            </div>

            {/* Size Selection (required) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-foreground/85">
                  Tamanho: {selectedSize ? <span className="text-[var(--gold)] font-semibold">{selectedSize}</span> : <span className="text-destructive">*obrigatório</span>}
                </span>
                <Link to="/guia-de-tamanhos" className="text-[10px] text-[var(--gold)] hover:underline transition-colors">
                  Guia de tamanhos
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => { setSelectedSize(s.size); setSizeError(false); }}
                    className={`min-w-[48px] h-10 text-xs font-medium border rounded-sm transition-all ${
                      selectedSize === s.size
                        ? "bg-[var(--gold)] text-background border-[var(--gold)]"
                        : s.stock > 0
                          ? "border-border text-muted-foreground hover:border-[var(--gold)] hover:text-foreground"
                          : "border-destructive/20 text-destructive/50 line-through cursor-not-allowed"
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-[10px] text-destructive mt-2">Selecione um tamanho antes de adicionar ao carrinho.</p>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-foreground/85">Quantidade:</span>
              <div className="flex items-center border border-border rounded-sm">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-12 text-center text-sm text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className={`w-full btn-gold rounded-md py-3 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  addedToCart ? "bg-[var(--success)]" : ""
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {addedToCart ? "Adicionado ao carrinho!" : "Adicionar ao carrinho"}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 border border-border text-foreground text-sm font-semibold uppercase tracking-wider py-3 rounded-sm hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
                >
                  Comprar agora
                </button>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[0.6] border border-[var(--success)]/40 text-[var(--success)] text-sm font-semibold py-3 rounded-sm flex items-center justify-center gap-2 hover:bg-[var(--success)]/10 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { icon: Truck, text: "Frete para todo Brasil" },
                { icon: Shield, text: "Compra segura" },
                { icon: RotateCcw, text: "Troca facilitada" },
                { icon: Star, text: "Qualidade premium" },
              ].map((ben) => (
                <div key={ben.text} className="flex items-center gap-2">
                  <ben.icon className="w-4 h-4 text-[var(--gold)] shrink-0" />
                  <span className="text-[10px] text-muted-foreground">{ben.text}</span>
                </div>
              ))}
            </div>

            {/* Freight */}
            <div className="border-t border-border pt-4">
              <p className="text-xs uppercase tracking-wider text-foreground/85 mb-2">Calcular frete</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="flex-1 px-3 py-2 bg-surface border border-border text-foreground text-sm placeholder:text-muted-foreground rounded-sm focus:border-[var(--gold)] outline-none transition-colors"
                />
                <button className="px-4 py-2 border border-border text-xs text-muted-foreground rounded-sm hover:border-[var(--gold)] transition-colors uppercase tracking-wider">
                  Calcular
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="border-b border-border">
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-xs uppercase tracking-widest font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[var(--gold)] border-b-2 border-[var(--gold)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8 max-w-3xl">
            {activeTab === "description" && (
              <div>
                <p className="text-sm text-foreground/80 leading-relaxed">{product.description}</p>
                {product.competition && (
                  <div className="mt-4 p-4 bg-surface border border-border rounded-sm">
                    <p className="text-[10px] uppercase tracking-widest text-[var(--gold)] mb-1">Competição</p>
                    <p className="text-sm text-foreground/80">{product.competition}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && product.history && (
              <div>
                <p className="text-sm text-foreground/80 leading-relaxed">{product.history}</p>
                {product.legendaryPlayers && (
                  <div className="mt-6">
                    <h4 className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-semibold mb-3">Jogadores Marcantes</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.legendaryPlayers.map((player) => (
                        <span key={player} className="text-[10px] text-foreground/80 border border-border px-3 py-1 rounded-full">
                          {player}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "details" && (
              <div>
                <ul className="space-y-2">
                  <li className="text-sm text-foreground/80 flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Clube</span><span>{product.club}</span>
                  </li>
                  <li className="text-sm text-foreground/80 flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Ano</span><span>{product.year}</span>
                  </li>
                  <li className="text-sm text-foreground/80 flex justify-between py-2 border-b border-border/50">
                    <span className="text-muted-foreground">Tipo</span><span className="uppercase">{product.type}</span>
                  </li>
                  {product.country && (
                    <li className="text-sm text-foreground/80 flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">País</span><span>{product.country}</span>
                    </li>
                  )}
                  <li className="text-sm text-foreground/80 flex justify-between py-2">
                    <span className="text-muted-foreground">Tamanhos disponíveis</span>
                    <span>P, M, G, GG, XG, 2XG, 3XG, 4XG</span>
                  </li>
                </ul>
                <p className="text-[10px] text-muted-foreground mt-4 italic">
                  Confira as medidas antes da compra. Modelos e fornecedores podem apresentar pequenas variações.
                </p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[var(--gold)] font-semibold mb-2">Envio</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Enviamos para todo o Brasil. O prazo de entrega varia de acordo com a região e a modalidade de frete selecionada. Consulte o prazo no cálculo de frete.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[var(--gold)] font-semibold mb-2">Troca e Devolução</h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Você pode solicitar troca ou devolução em até 30 dias após o recebimento. O produto deve estar em sua embalagem original, sem sinais de uso.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 pt-12 border-t border-border">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">
            Produtos <span className="text-[var(--gold)]">Relacionados</span>
          </h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum produto relacionado encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}
