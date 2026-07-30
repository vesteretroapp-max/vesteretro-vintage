import { Star, BadgeCheck } from "lucide-react";

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  verified: boolean;
  date: string;
  hasImage?: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Rafael M.",
    avatar: "https://picsum.photos/id/1012/100/100",
    rating: 5,
    text: "A qualidade da camisa é impressionante. Detalhes perfeitos, tecido premium. Parece que estou usando a original de 1981. Recomendo demais!",
    product: "Flamengo 1981 — Home",
    verified: true,
    date: "Há 2 dias",
    hasImage: true,
  },
  {
    id: 2,
    name: "Ana P.",
    avatar: "https://picsum.photos/id/1025/100/100",
    rating: 5,
    text: "Presente do meu marido. Ele amou! A embalaçãoo é linda e a camisa ficou ainda melhor do que nas fotos. Virei cliente fiel.",
    product: "Corinthians Clássico",
    verified: true,
    date: "Há 5 dias",
  },
  {
    id: 3,
    name: "Lucas S.",
    avatar: "https://picsum.photos/id/1074/100/100",
    rating: 5,
    text: "Já comprei 3 camisas e todas são incríveis. O atendimento via WhatsApp é excelente. Chegou antes do prazo. Nota 10!",
    product: "Manchester United 1999 — Home",
    verified: true,
    date: "Há 1 semana",
    hasImage: true,
  },
  {
    id: 4,
    name: "Mariana O.",
    avatar: "https://picsum.photos/id/1062/100/100",
    rating: 4,
    text: "Camisa linda e de ótima qualidade. Só demorou um pouco para chegar, mas valeu a pena esperar. As costuras são perfeitas.",
    product: "Real Madrid 2002 — Home",
    verified: true,
    date: "Há 2 semanas",
  },
  {
    id: 5,
    name: "Pedro H.",
    avatar: "https://picsum.photos/id/1005/100/100",
    rating: 5,
    text: "A melhor loja de camisas retrô que já comprei. A attention ao detalhe é incrível. Cada costura, cada badge, tudo perfeito.",
    product: "Liverpool 1984 — Home",
    verified: true,
    date: "Há 3 semanas",
    hasImage: true,
  },
  {
    id: 6,
    name: "Juliana R.",
    avatar: "https://picsum.photos/id/1027/100/100",
    rating: 5,
    text: "Surpreendente! A qualidade superou minhas expectativas. A camisa do Vasco ficou idêntica à original. Parabéns pela dedicação!",
    product: "Vasco 1997 — Home",
    verified: true,
    date: "Há 1 mês",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating
              ? "fill-[var(--gold)] text-[var(--gold)]"
              : "fill-muted-foreground/20 text-muted-foreground/20"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="relative py-16 md:py-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-surface/30" />

      <div className="container-vr">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)] font-semibold">
            Avaliações
          </p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">
            O que nossos clientes dizem
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-5 w-5 fill-[var(--gold)] text-[var(--gold)]"
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              4.9/5 baseado em +500 avaliações
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-[var(--border-gold)] hover:shadow-xl hover:shadow-[var(--gold)]/5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-10 w-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {review.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                </div>
                {review.verified && (
                  <div className="flex items-center gap-1 text-[10px] text-[var(--gold)]">
                    <BadgeCheck className="h-4 w-4" />
                    <span>Compra verificada</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <StarRating rating={review.rating} />

              {/* Review Text */}
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {review.text}
              </p>

              {/* Product */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Produto:{" "}
                  <span className="text-foreground">{review.product}</span>
                </p>
              </div>

              {/* Review Image */}
              {review.hasImage && (
                <div className="mt-4 rounded-lg overflow-hidden border border-border/50">
                  <img
                    src={`https://picsum.photos/id/${review.id * 50}/400/300`}
                    alt="Foto do produto"
                    className="w-full h-32 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            Sua satisfação é nossa prioridade.{" "}
            <span className="text-[var(--gold)]">+500 clientes satisfeitos</span>
          </p>
        </div>
      </div>
    </section>
  );
}
