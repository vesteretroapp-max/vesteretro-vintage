import { Star, BadgeCheck } from "lucide-react";

interface Review {
  id: number;
  name: string;
  city: string;
  state: string;
  avatar: string;
  rating: number;
  text: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Rafael M.",
    city: "São Paulo",
    state: "SP",
    avatar: "https://picsum.photos/id/1012/100/100",
    rating: 5,
    text: "A qualidade é impressionante. Detalhes perfeitos, tecido premium. Parece que estou usando a original. Recomendo demais.",
    verified: true,
  },
  {
    id: 2,
    name: "Ana P.",
    city: "Rio de Janeiro",
    state: "RJ",
    avatar: "https://picsum.photos/id/1025/100/100",
    rating: 5,
    text: "Presente do meu marido. Ele amou! A embalaçãoo é linda e a camisa ficou ainda melhor do que nas fotos.",
    verified: true,
  },
  {
    id: 3,
    name: "Lucas S.",
    city: "Belo Horizonte",
    state: "MG",
    avatar: "https://picsum.photos/id/1074/100/100",
    rating: 5,
    text: "Já comprei 3 camisas e todas são incríveis. O atendimento via WhatsApp é excelente. Nota 10.",
    verified: true,
  },
  {
    id: 4,
    name: "Mariana O.",
    city: "Curitiba",
    state: "PR",
    avatar: "https://picsum.photos/id/1062/100/100",
    rating: 5,
    text: "Camisa linda e de ótima qualidade. Valeu cada centavo. As costuras são perfeitas.",
    verified: true,
  },
  {
    id: 5,
    name: "Pedro H.",
    city: "Porto Alegre",
    state: "RS",
    avatar: "https://picsum.photos/id/1005/100/100",
    rating: 5,
    text: "A melhor loja de camisas retrô que já comprei. Atenção ao detalhe é incrível. Tudo perfeito.",
    verified: true,
  },
  {
    id: 6,
    name: "Juliana R.",
    city: "Salvador",
    state: "BA",
    avatar: "https://picsum.photos/id/1027/100/100",
    rating: 5,
    text: "Surpreendente! A qualidade superou todas as expectativas. Parabéns pela dedicação.",
    verified: true,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating
              ? "fill-[var(--gold)] text-[var(--gold)]"
              : "fill-muted-foreground/15 text-muted-foreground/15"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-vr">
        {/* Minimal header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-[var(--gold)]/40" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground/60">
              Depoimentos
            </span>
            <div className="h-px w-12 bg-[var(--gold)]/40" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl">
            O que dizem sobre nós
          </h2>
        </div>

        {/* Reviews grid — clean, no photos */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group p-8 border border-border/30 rounded-sm transition-all duration-500 hover:border-[var(--border-gold)]/30"
            >
              {/* Avatar + Name + Location */}
              <div className="flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover border border-border/30"
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground/50">
                    {review.city}, {review.state}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="mt-5">
                <StarRating rating={review.rating} />
              </div>

              {/* Comment */}
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground/70">
                "{review.text}"
              </p>

              {/* Verified badge */}
              {review.verified && (
                <div className="mt-5 pt-5 border-t border-border/20 flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-[var(--gold)]/60" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40">
                    Compra verificada
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
