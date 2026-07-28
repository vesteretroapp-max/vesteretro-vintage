import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Image,
  Eye,
  EyeOff,
  GripVertical,
  Calendar,
  Monitor,
  Smartphone,
} from "lucide-react";

const demoBanners = [
  {
    id: "1",
    title: "Camisas Retrô do Brasil",
    subtitle: "Vista a história",
    buttonText: "Ver Coleção",
    link: "/clubes-do-brasil",
    order: 1,
    active: true,
    dateStart: "2026-01-01",
    dateEnd: "2026-12-31",
  },
  {
    id: "2",
    title: "Lendas do Futebol Mundial",
    subtitle: "Os mantos que marcaram gerações",
    buttonText: "Ver Produtos",
    link: "/clubes-do-mundo",
    order: 2,
    active: true,
    dateStart: "2026-01-01",
    dateEnd: "2026-12-31",
  },
  {
    id: "3",
    title: "Seleções Históricas",
    subtitle: "Momentos eternos",
    buttonText: "Explorar",
    link: "/selecoes",
    order: 3,
    active: false,
    dateStart: "2026-01-01",
    dateEnd: "2026-12-31",
  },
];

export default function AdminBannersPage() {
  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider">
            Banners
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            Gerencie os banners do carrossel da homepage
          </p>
        </div>
        <button className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors">
          <Plus className="w-3 h-3" />
          Novo Banner
        </button>
      </div>

      <div className="space-y-3">
        {demoBanners.map((banner) => (
          <div
            key={banner.id}
            className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-4 hover:border-[#D6A632]/25 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <GripVertical className="w-4 h-4 text-[#9B9B9B]/40 cursor-grab mt-1 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xs font-bold text-[#F8F5ED]">
                      {banner.title}
                    </h3>
                    <span
                      className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border ${
                        banner.active
                          ? "text-[#2EA66B] border-[#2EA66B]/30"
                          : "text-[#9B9B9B] border-[#9B9B9B]/30"
                      }`}
                    >
                      {banner.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#9B9B9B] mb-2">
                    {banner.subtitle}
                  </p>
                  <div className="flex items-center gap-4 text-[9px] text-[#9B9B9B]/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {banner.dateStart} — {banner.dateEnd}
                    </span>
                    <span className="flex items-center gap-1">
                      Link: {banner.link}
                    </span>
                    <span className="flex items-center gap-1">
                      Botão: "{banner.buttonText}"
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <div className="w-24 h-14 bg-[#181B1B] rounded-sm overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-0.5">
                      <Monitor className="w-2 h-2 text-[#9B9B9B]/40" />
                    </div>
                    <p className="text-[7px] text-[#9B9B9B]/40">Preview</p>
                  </div>
                </div>
                <button className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 text-[#9B9B9B] hover:text-[#C94B4B] transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
