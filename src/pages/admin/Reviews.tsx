import { Star, MessageCircle, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";

const demoReviews: Array<{
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
}> = [];

export default function AdminReviewsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
          <Star className="w-4 h-4 text-[#D6A632]" />
          Avaliações
        </h2>
        <p className="text-[10px] text-[#9B9B9B] mt-0.5">
          Gerencie as avaliações dos clientes
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-lg font-bold text-[#D6A632]">0</p>
          <p className="text-[9px] text-[#9B9B9B] uppercase tracking-wider">Aguardando Aprovação</p>
        </div>
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-lg font-bold text-[#2EA66B]">0</p>
          <p className="text-[9px] text-[#9B9B9B] uppercase tracking-wider">Aprovadas</p>
        </div>
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
          <p className="text-lg font-bold text-[#C94B4B]">0</p>
          <p className="text-[9px] text-[#9B9B9B] uppercase tracking-wider">Reprovadas</p>
        </div>
      </div>

      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-12">
        <div className="text-center">
          <Star className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
          <p className="text-xs text-[#F8F5ED] mb-1">Nenhuma avaliação ainda</p>
          <p className="text-[10px] text-[#9B9B9B]">As avaliações dos clientes aparecerão aqui</p>
        </div>
      </div>
    </div>
  );
}
