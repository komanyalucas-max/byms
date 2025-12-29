import { useState } from 'react';
import { ChevronDown, Sparkles, Plus } from 'lucide-react';
import { Category } from './StudioBuilder';

interface ProductSectionProps {
  category: Category;
  selectedItems: Set<string>;
  onToggleItem: (productId: string) => void;
  selectedLibraryPacks: Set<string>;
  onToggleLibraryPack: (packId: string) => void;
  defaultExpanded?: boolean;
}

export function ProductSection({
  category,
  selectedItems,
  onToggleItem,
  selectedLibraryPacks,
  onToggleLibraryPack,
  defaultExpanded = true,
}: ProductSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const stripHtml = (html: string | undefined) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  const formatStorage = (gb: number) => {
    if (gb < 1) {
      return `${(gb * 1024).toFixed(0)} MB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl hover:border-purple-500/50 transition-all duration-300">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full relative p-4 md:p-6 border-b border-slate-700/50 flex items-center gap-3 md:gap-4 text-left transition-colors hover:bg-slate-800/30"
      >
        <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform flex-none">
          <div className="text-purple-300 scale-75 md:scale-100">{category.icon}</div>
        </div>
        <div className="flex-1 pr-2 min-w-0">
          <h2 className="text-white mb-1 font-bold text-lg truncate">{category.title}</h2>
          <p className="text-slate-400 text-sm break-words leading-snug">{stripHtml(category.subtitle)}</p>
        </div>
        <ChevronDown className={`w-6 h-6 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Products List */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <div className="p-4 md:p-6 space-y-3">
          {category.products.map((product) => {
            const isSelected = selectedItems.has(product.id);
            const hasLibraryPacks = product.libraryPacks && product.libraryPacks.length > 0;

            return (
              <div key={product.id} className="space-y-2">
                {/* Main Product */}
                <label
                  className={`group/item relative flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isSelected
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600/50 hover:bg-slate-800/70'
                    }`}
                >
                  {/* Custom Checkbox */}
                  <div className="relative flex items-center pt-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleItem(product.id)}
                      className="peer sr-only"
                    />
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected
                      ? 'bg-gradient-to-br from-purple-500 to-cyan-500 border-transparent'
                      : 'border-slate-600 group-hover/item:border-slate-500'
                      }`}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="text-white font-medium text-base">{product.name}</h3>
                      {product.isFree && (
                        <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-full backdrop-blur-sm whitespace-nowrap">
                          FREE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{stripHtml(product.description)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm whitespace-nowrap ${isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-700/50 text-slate-300'
                      }`}>
                      {formatStorage(product.fileSize)}
                    </div>
                    {hasLibraryPacks && isSelected && (
                      <span className="text-[10px] text-purple-300 font-medium">+{product.libraryPacks?.length} packs</span>
                    )}
                  </div>
                </label>

                {/* Library Packs */}
                {hasLibraryPacks && isSelected && (
                  <div className="ml-2 md:ml-4 pl-2 md:pl-4 border-l-2 border-slate-700/50 space-y-2 animate-in slide-in-from-top-2 duration-300">
                    {product.libraryPacks?.map((pack) => {
                      const isPackSelected = selectedLibraryPacks.has(pack.id);
                      return (
                        <label
                          key={pack.id}
                          className={`group/pack relative flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${isPackSelected
                            ? 'bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/50 shadow-md shadow-fuchsia-500/20'
                            : 'bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 hover:bg-slate-800/50'
                            }`}
                        >
                          {/* Custom Checkbox */}
                          <div className="relative flex items-center pt-0.5">
                            <input
                              type="checkbox"
                              checked={isPackSelected}
                              onChange={() => onToggleLibraryPack(pack.id)}
                              className="peer sr-only"
                            />
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-none ${isPackSelected
                              ? 'bg-gradient-to-br from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                              : 'bg-slate-700/50 text-slate-400 group-hover/pack:bg-slate-700 group-hover/pack:text-slate-300'
                              }`}>
                              {isPackSelected ? <Sparkles className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm text-white font-medium mb-0.5 truncate">{pack.name}</h4>
                            <p className="text-xs text-slate-400 break-words leading-snug">{stripHtml(pack.description)}</p>
                          </div>

                          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-sm whitespace-nowrap ${isPackSelected
                            ? 'bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30'
                            : 'bg-slate-700/50 text-slate-400'
                            }`}>
                            {formatStorage(pack.fileSize)}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}