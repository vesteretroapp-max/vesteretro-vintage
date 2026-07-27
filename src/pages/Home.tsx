import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  MessageCircle,
  RotateCcw,
  Truck,
  CreditCard,
  Headphones,
  ArrowRight,
  Heart,
  ShoppingBag,
  Instagram,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { demoProducts, categories, decades } from "@/data/products";

const logoUrl =
  "https://harmless-tapir-303.convex.cloud/api/storage/026f76e2-7e38-46d7-8178-c7d0a140b884";

const bannerImages = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=85",
  "https://images.unsplash.com/photo-1560272564-c83b4b6b63a2?w=1400&q=85",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1400&q=85",
];

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterName, setNewsletterName] = useState("");

  const nextBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev + 1) % 3);
  }, []);

  const prevBanner = useCallback(() => {
    setCurrentBanner((prev) => (prev - 1 + 3) % 3);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextBanner, 5000);
    return () => clearInterval(interval);
  }, [nextBanner]);

  const newProducts = demoProducts.filter((p) => p.isNew);
  const bestSellers = demoProducts.filter((p) => p.isBestSeller);
  const brasilProducts = demoProducts.filter((p) => p.category === "brasil");
  const mundoProducts = demoProducts.filter((p) => p.category === "mundo");
  const selecoesProducts = demoProducts.filter((p) => p.category === "selecoes");
  const promoProducts = demoProducts.filter((p) => p.isPromotion);

  const featuredProducts = [
    demoProducts[0],
    demoProducts[4],
    demoProducts[10],
  ];

  return (
    <div className="bg-[#090B0B]">
      {/* ============ SECTION 1: HERO ============ */}
      <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden">
        {/* Background images */}
        {bannerImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090B0B]/95 via-[#090B0B]/70 to-[#090B0B]/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090B0B] via-transparent to-transparent" />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="inline-block text-[10px] uppercase tracking-[0.3em] text-[#D6A632] mb-4 font-medium">
                Coleção 2026
              </span>
              <h1 className="vintage-text text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#F8F5ED] leading-[0.9] mb-6">
                VISTA A
                <br />
                <span className="gold-text">HISTÓRIA.</span>
                <br />
                SINTA A
                <br />
                <span className="gold-text">GLÓRIA.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#D4D4D4] mb-8 max-w-lg leading-relaxed font-serif italic">
                Camisas retrô que marcaram gerações.
                <br />
                Clubes históricos. Momentos eternos.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/todos-os-produtos"
                  className="inline-flex items-center gap-2 bg-[#D6A632] text-[#090B0B] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-all"
                >
                  Ver Coleção
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/lancamentos"
                  className="inline-flex items-center gap-2 border border-[#D6A632]/40 text-[#F8F5ED] px-6 py-3 text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#D6A632]/10 hover:border-[#D6A632] transition-all"
                >
                  Lançamentos
                </Link>
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-12 flex flex-wrap gap-6"
            >
              {[
                { icon: Truck, text: "Qualidade Premium" },
                { icon: CreditCard, text: "Até 12x sem juros" },
                { icon: Shield, text: "Compra Segura" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-[#D6A632]" />
                  <span className="text-[10px] uppercase tracking-widest text-[#D4D4D4]">
                    {item.text}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Banner nav */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
          <button
            onClick={prevBanner}
            className="w-8 h-8 rounded-full border border-[#D6A632]/40 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632] hover:border-[#D6A632] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentBanner
                    ? "bg-[#D6A632] w-6"
                    : "bg-[#D4D4D4]/40 hover:bg-[#D4D4D4]/60"
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextBanner}
            className="w-8 h-8 rounded-full border border-[#D6A632]/40 flex items-center justify-center text-[#D4D4D4] hover:text-[#D6A632] hover:border-[#D6A632] transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ============ SECTION 2: CATEGORIES ============ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
              Categorias
            </span>
            <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
              Explore Nossas{" "}
              <span className="gold-text">Coleções</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  to={cat.slug}
                  className="category-card block relative aspect-[3/4] bg-[#111414] border border-[#D6A632]/10 rounded-sm group"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090B0B] via-[#090B0B]/20 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <p className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
                      {cat.name}
                    </p>
                    <p className="text-[10px] text-[#9B9B9B] mt-1">
                      {cat.count} camisas
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-[#D6A632]/30 flex items-center justify-center group-hover:border-[#D6A632] group-hover:bg-[#D6A632]/10 transition-all">
                      <ShoppingBag className="w-6 h-6 text-[#D6A632]" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 3: LANÇAMENTOS ============ */}
      <section className="py-16 lg:py-24 bg-[#111414]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
                Novidades
              </span>
              <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
                Últimos{" "}
                <span className="gold-text">Lançamentos</span>
              </h2>
            </div>
            <Link
              to="/lancamentos"
              className="hidden sm:flex items-center gap-1 text-xs uppercase tracking-wider text-[#D6A632] hover:text-[#E8C56A] transition-colors"
            >
              Ver todos
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {demoProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/lancamentos"
              className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-[#D6A632]"
            >
              Ver todos os lançamentos
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SECTION 4: MAIS VENDIDOS ============ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
                Destaques
              </span>
              <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
                Mais{" "}
                <span className="gold-text">Vendidos</span>
              </h2>
            </div>
            <Link
              to="/mais-vendidos"
              className="hidden sm:flex items-center gap-1 text-xs uppercase tracking-wider text-[#D6A632] hover:text-[#E8C56A] transition-colors"
            >
              Ver todos
              <ArrowRight className="w-3 h-3" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {bestSellers.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 5: CLUBES BRASILEIROS ============ */}
      <section className="py-16 lg:py-24 bg-[#111414]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
                Nacionais
              </span>
              <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
                Clubes{" "}
                <span className="gold-text">Brasileiros</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {brasilProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 6: CLUBES INTERNACIONAIS ============ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
                Internacionais
              </span>
              <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
                Clubes do{" "}
                <span className="gold-text">Mundo</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {mundoProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 7: SELEÇÕES ============ */}
      <section className="py-16 lg:py-24 bg-[#111414]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
                Mundiais
              </span>
              <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
                Seleções{" "}
                <span className="gold-text">Históricas</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {selecoesProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 8: DÉCADAS ============ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
              Linha do Tempo
            </span>
            <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
              Compre por{" "}
              <span className="gold-text">Década</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {decades.map((decade, i) => {
              const count = demoProducts.filter(
                (p) =>
                  p.decade >= decade.value && p.decade < decade.value + 10
              ).length;
              return (
                <motion.div
                  key={decade.value}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <Link
                    to={`/busca?decada=${decade.value}`}
                    className="block text-center p-6 bg-[#111414] border border-[#D6A632]/10 rounded-sm hover:border-[#D6A632]/40 group transition-all"
                  >
                    <p className="vintage-text text-2xl font-bold text-[#F8F5ED] group-hover:text-[#D6A632] transition-colors">
                      {decade.label.replace("Anos ", "'")}
                    </p>
                    <p className="text-[10px] text-[#9B9B9B] mt-2">
                      {count} camisas
                    </p>
                    <div className="mt-3 w-8 h-0.5 bg-[#D6A632]/40 mx-auto group-hover:w-12 transition-all" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SECTION 9: HISTÓRIA POR TRÁS DO MANTO ============ */}
      <section className="py-16 lg:py-24 bg-[#111414]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
              Histórias
            </span>
            <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
              A História por Trás do{" "}
              <span className="gold-text">Manto</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/produto/${product.slug}`}
                  className="block group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm mb-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090B0B]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-[10px] uppercase tracking-widest text-[#D6A632] font-medium">
                        {product.year} • {product.competition || product.club}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#F8F5ED] group-hover:text-[#D6A632] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#9B9B9B] mt-2 leading-relaxed line-clamp-3 font-serif italic">
                    {product.history || product.description}
                  </p>
                  {product.legendaryPlayers && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {product.legendaryPlayers.slice(0, 3).map((player) => (
                        <span
                          key={player}
                          className="text-[9px] uppercase tracking-wider text-[#D6A632] border border-[#D6A632]/20 px-2 py-0.5 rounded-full"
                        >
                          {player}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 10: BENEFÍCIOS ============ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
            {[
              { icon: Shield, title: "Compra Protegida", desc: "Seus dados e pagamento protegidos" },
              { icon: MessageCircle, title: "Atendimento WhatsApp", desc: "Tire dúvidas diretamente" },
              { icon: RotateCcw, title: "Troca Facilitada", desc: "Troque em até 30 dias" },
              { icon: Truck, title: "Envio para todo Brasil", desc: "Entrega rápida e segura" },
              { icon: CreditCard, title: "Parcelamento", desc: "Em até 12x sem juros" },
              { icon: Headphones, title: "Qualidade Premium", desc: "Camisas selecionadas" },
            ].map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full border border-[#D6A632]/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#D6A632]/10 transition-colors">
                  <benefit.icon className="w-5 h-5 text-[#D6A632]" />
                </div>
                <h4 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider mb-1">
                  {benefit.title}
                </h4>
                <p className="text-[10px] text-[#9B9B9B]">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 11: NEWSLETTER ============ */}
      <section className="py-16 lg:py-24 bg-[#111414] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D6A632' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
              Newsletter
            </span>
            <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3 mb-4">
              Receba Novidades da{" "}
              <span className="gold-text">VesteRetro</span>
            </h2>
            <p className="text-sm text-[#D4D4D4] mb-8 font-serif italic">
              Lançamentos, camisas históricas e ofertas especiais diretamente no
              seu e-mail.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterName && newsletterEmail) {
                  alert(
                    "Obrigado por se inscrever, " +
                      newsletterName +
                      "! Em breve você receberá nossas novidades."
                  );
                  setNewsletterName("");
                  setNewsletterEmail("");
                }
              }}
              className="max-w-md mx-auto space-y-3"
            >
              <input
                type="text"
                placeholder="Seu nome"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none transition-colors"
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-3 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-sm placeholder:text-[#9B9B9B] rounded-sm focus:border-[#D6A632] outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#D6A632] text-[#090B0B] text-sm font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors whitespace-nowrap"
                >
                  Quero receber
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ============ SECTION 12: INSTAGRAM ============ */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <Instagram className="w-6 h-6 text-[#D6A632] mx-auto mb-3" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D6A632] font-medium">
              Siga-nos
            </span>
            <h2 className="vintage-text text-3xl lg:text-4xl font-bold text-[#F8F5ED] mt-3">
              @VesteRetro no{" "}
              <span className="gold-text">Instagram</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden group relative"
              >
                <div className="w-full h-full bg-gradient-to-br from-[#D6A632]/5 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#090B0B]/60">
                  <Instagram className="w-8 h-8 text-[#F8F5ED]" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
