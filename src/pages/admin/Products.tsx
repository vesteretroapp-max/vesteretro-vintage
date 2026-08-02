import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Copy,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Package,
  Upload,
  Download,
  ChevronDown,
  Star,
  Tag,
  Check,
  X,
} from "lucide-react";
import { demoProducts, type Product } from "@/data/products";
import { getProductImageUrl } from "@/lib/supabase-storage";

// Resolve a miniatura do produto via API oficial do Supabase Storage
// (campo image_path) com fallback para imagens locais/demo.
const productThumb = (p: Product) =>
  p.imagePath
    ? getProductImageUrl(p.imagePath) || p.images[0]
    : p.images[0];

type StatusFilter = "all" | "active" | "draft" | "inactive";

const statusConfig = {
  draft: { label: "Rascunho", color: "text-[#D6A632] border-[#D6A632]/30" },
  active: {
    label: "Ativo",
    color: "text-[#2EA66B] border-[#2EA66B]/30",
  },
  inactive: {
    label: "Inativo",
    color: "text-[#9B9B9B] border-[#9B9B9B]/30",
  },
  esgotado: {
    label: "Esgotado",
    color: "text-[#C94B4B] border-[#C94B4B]/30",
  },
};

const sortOptions = [
  "Mais recentes",
  "Mais antigos",
  "Nome A-Z",
  "Nome Z-A",
  "Maior preço",
  "Menor preço",
  "Mais vendidos",
];

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("Mais recentes");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredProducts = demoProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.club.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !p.isPromotion) ||
      (statusFilter === "draft" && p.isNew) ||
      (statusFilter === "inactive" && false);
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getTotalStock = (product: Product) =>
    product.sizes.reduce((sum, s) => sum + s.stock, 0);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider">
            Produtos
          </h2>
          <p className="text-[10px] text-[#9B9B9B] mt-0.5">
            {filteredProducts.length} produto{filteredProducts.length !== 1 && "s"} encontrado{filteredProducts.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-[#D6A632] border border-[#D6A632]/30 rounded-sm hover:bg-[#D6A632]/10 transition-colors uppercase tracking-wider">
            <Upload className="w-3 h-3" />
            Importar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-[#D6A632] border border-[#D6A632]/30 rounded-sm hover:bg-[#D6A632]/10 transition-colors uppercase tracking-wider">
            <Download className="w-3 h-3" />
            Exportar
          </button>
          <Link
            to="/admin/produtos/novo"
            className="flex items-center gap-1.5 bg-[#D6A632] text-[#090B0B] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors"
          >
            <Plus className="w-3 h-3" />
            Novo Produto
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-[#9B9B9B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, clube ou tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#090B0B] border border-[#D6A632]/20 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-[#D4D4D4] border border-[#D6A632]/20 rounded-sm hover:border-[#D6A632]/40 transition-colors uppercase tracking-wider"
            >
              <Filter className="w-3 h-3" />
              Status
              <ChevronDown className="w-3 h-3" />
            </button>
            {showFilters && (
              <div className="absolute top-full mt-1 left-0 z-10 w-40 bg-[#111414] border border-[#D6A632]/20 rounded-sm shadow-lg">
                {(
                  [
                    { value: "all", label: "Todos" },
                    { value: "active", label: "Ativos" },
                    { value: "draft", label: "Rascunhos" },
                    { value: "inactive", label: "Inativos" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setStatusFilter(opt.value);
                      setShowFilters(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[10px] hover:bg-[#D6A632]/10 transition-colors ${
                      statusFilter === opt.value
                        ? "text-[#D6A632]"
                        : "text-[#D4D4D4]"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-[#D4D4D4] border border-[#D6A632]/20 rounded-sm hover:border-[#D6A632]/40 transition-colors uppercase tracking-wider"
            >
              <ArrowUpDown className="w-3 h-3" />
              {sortBy}
            </button>
            {showSortMenu && (
              <div className="absolute top-full mt-1 right-0 z-10 w-44 bg-[#111414] border border-[#D6A632]/20 rounded-sm shadow-lg">
                {sortOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortBy(opt);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-[10px] hover:bg-[#D6A632]/10 transition-colors ${
                      sortBy === opt ? "text-[#D6A632]" : "text-[#D4D4D4]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#D6A632]/10 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-[#D6A632]">
              {selectedProducts.length} selecionado{selectedProducts.length !== 1 && "s"}
            </span>
            <button className="px-2 py-1 text-[9px] text-[#2EA66B] border border-[#2EA66B]/30 rounded-sm hover:bg-[#2EA66B]/10 transition-colors uppercase tracking-wider">
              Publicar
            </button>
            <button className="px-2 py-1 text-[9px] text-[#D6A632] border border-[#D6A632]/30 rounded-sm hover:bg-[#D6A632]/10 transition-colors uppercase tracking-wider">
              Despublicar
            </button>
            <button className="px-2 py-1 text-[9px] text-[#C94B4B] border border-[#C94B4B]/30 rounded-sm hover:bg-[#C94B4B]/10 transition-colors uppercase tracking-wider">
              Arquivar
            </button>
          </div>
        )}
      </div>

      {/* Products Table (Desktop) */}
      <div className="hidden md:block bg-[#111414] border border-[#D6A632]/10 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D6A632]/10">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === filteredProducts.length &&
                      filteredProducts.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="accent-[#D6A632] w-3.5 h-3.5"
                  />
                </th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                  Produto
                </th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                  Clube/Seleção
                </th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                  Ano
                </th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                  Preço
                </th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                  Estoque
                </th>
                <th className="p-3 text-left text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                  Status
                </th>
                <th className="p-3 text-right text-[9px] text-[#9B9B9B] uppercase tracking-wider font-semibold">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const totalStock = getTotalStock(product);
                const status = product.isNew
                  ? "draft"
                  : totalStock === 0
                  ? "esgotado"
                  : "active";
                const statusInfo =
                  statusConfig[status as keyof typeof statusConfig] ||
                  statusConfig.active;

                return (
                  <tr
                    key={product.id}
                    className="border-b border-[#D6A632]/5 hover:bg-[#D6A632]/5 transition-colors"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="accent-[#D6A632] w-3.5 h-3.5"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#181B1B] rounded-sm overflow-hidden shrink-0">
                          <img
                            src={productThumb(product)}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-[#F8F5ED] max-w-[200px] truncate">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {product.isBestSeller && (
                              <span className="text-[8px] text-[#E8C56A] bg-[#E8C56A]/10 px-1 rounded">
                                <Star className="w-2 h-2 inline" /> TOP
                              </span>
                            )}
                            {product.isPromotion && (
                              <span className="text-[8px] text-[#C94B4B] bg-[#C94B4B]/10 px-1 rounded">
                                <Tag className="w-2 h-2 inline" /> PROMO
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] text-[#D4D4D4]">
                        {product.club}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] text-[#D4D4D4]">
                        {product.year}
                      </span>
                    </td>
                    <td className="p-3">
                      <div>
                        {product.promotionalPrice ? (
                          <>
                            <span className="text-[10px] text-[#C94B4B] line-through">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </span>
                            <span className="text-[10px] text-[#2EA66B] ml-1">
                              R${" "}
                              {product.promotionalPrice
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] text-[#F8F5ED]">
                            R$ {product.price.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] ${
                          totalStock < 10
                            ? "text-[#C94B4B]"
                            : "text-[#D4D4D4]"
                        }`}
                      >
                        {totalStock} unidades
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm border ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/produto/${product.slug}`}
                          target="_blank"
                          className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/produtos/${product.id}/editar`}
                          className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632] transition-colors"
                          title="Duplicar"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          className="p-1.5 text-[#9B9B9B] hover:text-[#C94B4B] transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Cards (Mobile) */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((product) => {
          const totalStock = getTotalStock(product);
          const status = product.isNew
            ? "draft"
            : totalStock === 0
            ? "esgotado"
            : "active";
          const statusInfo =
            statusConfig[status as keyof typeof statusConfig] ||
            statusConfig.active;

          return (
            <div
              key={product.id}
              className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-3"
            >
              <div className="flex gap-3">
                <div className="w-14 h-14 bg-[#181B1B] rounded-sm overflow-hidden shrink-0">
                  <img
                    src={productThumb(product)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs text-[#F8F5ED] font-medium truncate">
                      {product.name}
                    </p>
                    <span
                      className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm border shrink-0 ${statusInfo.color}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#9B9B9B] mt-0.5">
                    {product.club} • {product.year}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      {product.promotionalPrice ? (
                        <span className="text-xs text-[#2EA66B] font-bold">
                          R${" "}
                          {product.promotionalPrice
                            .toFixed(2)
                            .replace(".", ",")}
                        </span>
                      ) : (
                        <span className="text-xs text-[#F8F5ED] font-bold">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                      <span className="text-[9px] text-[#9B9B9B] ml-2">
                        {totalStock} em estoque
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/produtos/${product.id}/editar`}
                        className="p-1.5 text-[#9B9B9B] hover:text-[#D6A632]"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button className="p-1.5 text-[#9B9B9B] hover:text-[#C94B4B]">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-12">
          <div className="text-center">
            <Package className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
            <p className="text-xs text-[#F8F5ED] mb-1">
              Nenhum produto encontrado
            </p>
            <p className="text-[10px] text-[#9B9B9B]">
              Tente ajustar os filtros ou crie um novo produto
            </p>
          </div>
        </div>
      )}

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-[#9B9B9B]">
          Mostrando {filteredProducts.length} de {demoProducts.length} produtos
        </p>
        <div className="flex items-center gap-1">
          <button className="px-2 py-1 text-[10px] text-[#D6A632] bg-[#D6A632]/10 rounded-sm">
            1
          </button>
        </div>
      </div>
    </div>
  );
}
