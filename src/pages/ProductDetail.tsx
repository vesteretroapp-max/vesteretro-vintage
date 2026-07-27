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
  ChevronDown,
  ChevronUp,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { demoProducts } from "@/data/products";

const LOGO_URL =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

export default function ProductDetail() {
  const { slug } = useParams();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [cep, setCep] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [imgError, setImgError] = useState<Set<number>>(new Set());

  const product = demoProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#090B0B] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-[#9B9B9B]">Produto não encontrado.</p>
          <Link
            to="/todos-os-produtos"
            className="inline-block mt-4 text-sm text-[#D6A632] hover:text-[#E8C56A] transition-colors"
          >
            Ver todos os produtos
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = demoProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.club === product.club || p.category === product.category)
    )
    .slice(0, 4);

  const currentPrice = product.promotionalPrice || product.price;
  const installmentPrice = currentPrice / 12;
  const availableSizes = product.sizes.filter((s) => s.stock > 0);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("veste_cart") || "[]");
    const existingIndex = cart.findIndex(
      (item: any) =>
        item.id === product.id && item.size === (selectedSize || "M")
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
        size: selectedSize || "M",
        quantity,
        slug: product.slug,
      });
    }
    localStorage.setItem("veste_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const whatsappMessage = `Olá! Gostaria de mais informações sobre a camisa ${product.name}, tamanho ${selectedSize || "M"}.`;
  const whatsappUrl = `https://wa.me/5511987516823?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#090B0B]">
      {/* Breadcrumb */}
      <div className="border-b border-[#D6A632]/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#9B9B9B]">
            <Link to="/" className="hover:text-[#D6A632] transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link
              to={`/${product.category === "brasil" ? "clubes-do-brasil" : product.category === "mundo" ? "clubes-do-mundo" : "selecoes"}/${product.club.toLowerCase().replace(/\s+/g, "-")}`}
              className="hover:text-[#D6A632] transition-colors"
            >
              {product.club}
            </Link>
            <span>/</span>
            <span className="text-[#D4D4D4]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
              {!imgError.has(selectedImage) ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-crosshair"
                  onError={() =>
                    setImgError((prev) => new Set([...prev, selectedImage]))
                  }
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#181B1B]">
                  <ShoppingBag className="w-16 h-16 text-[#D6A632]/30" />
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                {product.isNew && (
                  <span className="bg-[#D6A632] text-[#090B0B] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                    Novo
                  </span>
                )}
                {product.isPromotion && (
                  <span className="bg-[#C94B4B] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                    -
                    {Math.round(
                      ((product.price - product.promotionalPrice!) /
                        product.price) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>

              {/* Favorite */}
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="absolute top-4 right-4 w-10 h-10 bg-[#090B0B]/80 border border-[#D6A632]/30 rounded-sm flex items-center justify-center hover:bg-[#D6A632]/20 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorited
                      ? "fill-[#D6A632] text-[#D6A632]"
                      : "text-[#D4D4D4]"
                  }`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 border-2 rounded-sm overflow-hidden transition-all ${
                    i === selectedImage
                      ? "border-[#D6A632]"
                      : "border-[#D6A632]/20 hover:border-[#D6A632]/40"
                  }`}
                >
                  {!imgError.has(i) ? (
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={() =>
                        setImgError((prev) => new Set([...prev, i]))
                      }
                    />
                  ) : (
                    <div className="w-full h-full bg-[#181B1B]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-widest text-[#D6A632] font-medium">
                  {product.club}
                </span>
                <span className="text-[10px] text-[#9B9B9B]">•</span>
                <span className="text-[10px] text-[#9B9B9B]">{product.year}</span>
              </div>
              <h1 className="vintage-text text-2xl lg:text-3xl font-bold text-[#F8F5ED] leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i <= Math.floor(product.rating)
                          ? "fill-[#D6A632] text-[#D6A632]"
                          : "text-[#9B9B9B]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#9B9B9B]">
                  {product.rating} ({product.reviewCount} avaliações)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1 py-4 border-t border-b border-[#D6A632]/10">
              {product.promotionalPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-lg text-[#9B9B9B] line-through">
                    R$ {product.price.toFixed(2)}
                  </span>
                  <span className="vintage-text text-3xl font-bold text-[#D6A632]">
                    R$ {product.promotionalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="vintage-text text-3xl font-bold text-[#D6A632]">
                  R$ {product.price.toFixed(2)}
                </span>
              )}
              <p className="text-xs text-[#9B9B9B]">
                ou 12x de R$ {installmentPrice.toFixed(2)} sem juros
              </p>
              <p className="text-[10px] text-[#2EA66B]">
                🎯 Desconto no PIX: 5% OFF
              </p>
            </div>

            {/* Size */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-[#D4D4D4]">
                  Tamanho:
                </span>
                <Link
                  to="/guia-de-tamanhos"
                  className="text-[10px] text-[#D6A632] hover:text-[#E8C56A] transition-colors underline"
                >
                  Guia de tamanhos
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSelectedSize(s.size)}
                    className={`min-w-[48px] h-10 text-xs font-medium border rounded-sm transition-all ${
                      selectedSize === s.size
                        ? "bg-[#D6A632] text-[#090B0B] border-[#D6A632]"
                        : s.stock > 0
                          ? "border-[#D6A632]/30 text-[#D4D4D4] hover:border-[#D6A632]"
                          : "border-[#C94B4B]/30 text-[#C94B4B] line-through cursor-not-allowed"
                    }`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-[#D4D4D4]">
                Quantidade:
              </span>
              <div className="flex items-center border border-[#D6A632]/30 rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-12 text-center text-sm text-[#F8F5ED]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-[10px] text-[#2EA66B]">
                {availableSizes.reduce((a, s) => a + s.stock, 0)} em estoque
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#D6A632] text-[#090B0B] hover:bg-[#E8C56A] text-sm font-semibold uppercase tracking-wider h-12 rounded-sm"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Adicionar ao carrinho
                </Button>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/checkout"
                  className="flex-1 border border-[#D6A632]/40 text-[#F8F5ED] text-sm font-semibold uppercase tracking-wider h-12 rounded-sm flex items-center justify-center hover:bg-[#D6A632]/10 transition-colors"
                >
                  Comprar agora
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-[0.5] border border-[#2EA66B]/40 text-[#2EA66B] text-sm font-semibold h-12 rounded-sm flex items-center justify-center gap-2 hover:bg-[#2EA66B]/10 transition-colors"
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
                  <ben.icon className="w-4 h-4 text-[#D6A632] shrink-0" />
                  <span className="text-[10px] text-[#9B9B9B]">{ben.text}</span>
                </div>
              ))}
            </div>

            {/* CEP */}
            <div className="border-t border-[#D6A632]/10 pt-4">
              <p className="text-xs uppercase tracking-wider text-[#D4D4D4] mb-2">
                Calcular frete
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite seu CEP"
                  value={cep}
                  onChange={(e) =>
                    setCep(e.target.value.replace(/\D/g, "").slice(0, 8))
                  }
                  className="flex-1 px-3 py-2 bg-[#111414] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none"
                />
                <button className="px-4 py-2 border border-[#D6A632]/40 text-xs text-[#D4D4D4] rounded-sm hover:border-[#D6A632] transition-colors uppercase tracking-wider">
                  Calcular
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 lg:mt-16">
          <div className="border-b border-[#D6A632]/10">
            <div className="flex gap-0 overflow-x-auto">
              {[
                { id: "description", label: "Descrição" },
                { id: "history", label: "História" },
                { id: "details", label: "Detalhes" },
                { id: "shipping", label: "Envio e Troca" },
                { id: "reviews", label: "Avaliações" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-xs uppercase tracking-widest font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-[#D6A632] border-b-2 border-[#D6A632]"
                      : "text-[#9B9B9B] hover:text-[#D4D4D4]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-sm text-[#D4D4D4] leading-relaxed font-serif">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "history" && product.history && (
              <div className="max-w-3xl">
                <p className="text-sm text-[#D4D4D4] leading-relaxed font-serif">
                  {product.history}
                </p>
                {product.legendaryPlayers && (
                  <div className="mt-6">
                    <h4 className="text-xs uppercase tracking-widest text-[#D6A632] font-semibold mb-3">
                      Jogadores Marcantes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.legendaryPlayers.map((player) => (
                        <span
                          key={player}
                          className="text-[10px] text-[#D4D4D4] border border-[#D6A632]/20 px-3 py-1 rounded-full"
                        >
                          {player}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {product.competition && (
                  <div className="mt-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#D6A632]">
                      Competição: {product.competition}
                    </span>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && !product.history && (
              <p className="text-sm text-[#9B9B9B]">
                Informações históricas em breve.
              </p>
            )}

            {activeTab === "details" && (
              <div className="max-w-3xl">
                <ul className="space-y-2">
                  <li className="text-sm text-[#D4D4D4] flex justify-between py-2 border-b border-[#D6A632]/5">
                    <span className="text-[#9B9B9B]">Clube</span>
                    <span>{product.club}</span>
                  </li>
                  <li className="text-sm text-[#D4D4D4] flex justify-between py-2 border-b border-[#D6A632]/5">
                    <span className="text-[#9B9B9B]">Ano</span>
                    <span>{product.year}</span>
                  </li>
                  {product.season && (
                    <li className="text-sm text-[#D4D4D4] flex justify-between py-2 border-b border-[#D6A632]/5">
                      <span className="text-[#9B9B9B]">Temporada</span>
                      <span>{product.season}</span>
                    </li>
                  )}
                  {product.country && (
                    <li className="text-sm text-[#D4D4D4] flex justify-between py-2 border-b border-[#D6A632]/5">
                      <span className="text-[#9B9B9B]">País</span>
                      <span>{product.country}</span>
                    </li>
                  )}
                  <li className="text-sm text-[#D4D4D4] flex justify-between py-2 border-b border-[#D6A632]/5">
                    <span className="text-[#9B9B9B]">Tipo</span>
                    <span className="uppercase">{product.type}</span>
                  </li>
                  <li className="text-sm text-[#D4D4D4] flex justify-between py-2">
                    <span className="text-[#9B9B9B]">Tamanhos</span>
                    <span>P, M, G, GG, XG, 2XG, 3XG, 4XG</span>
                  </li>
                </ul>
                <p className="text-[10px] text-[#9B9B9B] mt-4 italic">
                  Confira as medidas antes da compra. Modelos e fornecedores podem
                  apresentar pequenas variações.
                </p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="max-w-3xl space-y-4">
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#D6A632] font-semibold mb-2">
                    Envio
                  </h4>
                  <p className="text-sm text-[#D4D4D4] leading-relaxed">
                    Enviamos para todo o Brasil. O prazo de entrega varia de
                    acordo com a região e a modalidade de frete selecionada.
                    Consulte o prazo no cálculo de frete.
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#D6A632] font-semibold mb-2">
                    Troca e Devolução
                  </h4>
                  <p className="text-sm text-[#D4D4D4] leading-relaxed">
                    Você pode solicitar troca ou devolução em até 30 dias após o
                    recebimento. O produto deve estar em sua embalagem original,
                    sem sinais de uso.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl">
                <p className="text-sm text-[#9B9B9B]">
                  Avaliações em breve.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-12 border-t border-[#D6A632]/10">
            <h2 className="vintage-text text-2xl font-bold text-[#F8F5ED] mb-8">
              Produtos{" "}
              <span className="gold-text">Relacionados</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
