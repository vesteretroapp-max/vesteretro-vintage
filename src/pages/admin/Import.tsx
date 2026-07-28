import { Upload, ExternalLink, AlertTriangle, FileText, Check, X, Loader2 } from "lucide-react";
import { useState } from "react";

export default function AdminImportPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4 lg:p-6 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-[#F8F5ED] uppercase tracking-wider flex items-center gap-2">
          <Upload className="w-4 h-4 text-[#D6A632]" />
          Importação de Catálogo
        </h2>
        <p className="text-[10px] text-[#9B9B9B] mt-0.5">
          Importe imagens e informações de catálogos externos como rascunho
        </p>
      </div>

      {/* Import Form */}
      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm p-6">
        <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider mb-4">
          Novo Importação
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">
              URL do Álbum
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://uniforming.x.yupoo.com/albums/..."
                className="flex-1 px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs placeholder:text-[#9B9B9B]/50 rounded-sm focus:border-[#D6A632] outline-none"
              />
              <button
                className="px-4 py-2 bg-[#D6A632] text-[#090B0B] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#E8C56A] transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-3 h-3" />
                Analisar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">Categoria</label>
              <select className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none">
                <option>Clubes do Brasil</option>
                <option>Clubes do Mundo</option>
                <option>Seleções</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">Clube/Seleção</label>
              <input type="text" placeholder="Ex: Flamengo" className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none placeholder:text-[#9B9B9B]/50" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-[#D4D4D4] mb-1.5 block">Temporada</label>
              <input type="text" placeholder="Ex: 1981" className="w-full px-3 py-2 bg-[#090B0B] border border-[#D6A632]/30 text-[#F8F5ED] text-xs rounded-sm focus:border-[#D6A632] outline-none placeholder:text-[#9B9B9B]/50" />
            </div>
          </div>

          <div className="bg-[#090B0B] border border-[#D6A632]/10 rounded-sm p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#D6A632] mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-[#D4D4D4] font-medium mb-1">Regras de Importação</p>
                <ul className="text-[9px] text-[#9B9B9B] space-y-0.5">
                  <li>• Produtos importados ficam como rascunho (não publicados automaticamente)</li>
                  <li>• Não são copiados preços nem informações de contato do fornecedor</li>
                  <li>• Imagens são baixadas e armazenadas no projeto (sem hotlink)</li>
                  <li>• Aprovação manual é necessária antes da publicação</li>
                  <li>• Nomes são traduzidos automaticamente para português</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Import History */}
      <div className="bg-[#111414] border border-[#D6A632]/10 rounded-sm">
        <div className="p-4 border-b border-[#D6A632]/10">
          <h3 className="text-xs font-semibold text-[#F8F5ED] uppercase tracking-wider">
            Histórico de Importações
          </h3>
        </div>
        <div className="p-12">
          <div className="text-center">
            <FileText className="w-10 h-10 text-[#D6A632]/20 mx-auto mb-3" />
            <p className="text-xs text-[#F8F5ED] mb-1">Nenhuma importação realizada</p>
            <p className="text-[10px] text-[#9B9B9B]">Use o formulário acima para importar produtos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
