import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Wand2, Sliders, Library, Sparkles, Calculator, ChevronDown, Check } from 'lucide-react';
import { CostSummary } from './CostSummary';
import { StorageSelector } from './StorageSelector';
import { LanguageCurrencySelector } from './LanguageCurrencySelector';
import { useLanguage } from '../contexts/LanguageContext';
import { useBuilder } from '../contexts/BuilderContext';

// Re-export types for compatibility with other components
export interface LibraryPack {
  id: string;
  name: string;
  description: string;
  fileSize: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fileSize: number;
  isFree?: boolean;
  libraryPacks?: LibraryPack[];
  image?: string;
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  products: Product[];
  helperText?: string;
}

// Helper to get React Node icon
const getIconForCategory = (iconName: string | any) => {
  if (typeof iconName !== 'string') return iconName; // If already a component
  const iconMap: Record<string, React.ReactNode> = {
    'Music': <Music className="w-5 h-5" />,
    'Wand2': <Wand2 className="w-5 h-5" />,
    'Sliders': <Sliders className="w-5 h-5" />,
    'Library': <Library className="w-5 h-5" />,
  };
  return iconMap[iconName] || <Library className="w-5 h-5" />;
};

export function StudioBuilder() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Use Context
  const {
    categories,
    isLoading,
    error,
    selectedItems,
    selectedLibraryPacks,
    storageType,
    storageCapacity,
    totalStorage,
    toggleItem,
    setStorageType,
    setStorageCapacity,
    selectFreeStudio
  } = useBuilder();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Initialize expanded categories when data loads
  useEffect(() => {
    if (categories.length > 0 && expandedCategories.size === 0) {
      setExpandedCategories(new Set([categories[0].id]));
    }
  }, [categories, expandedCategories.size]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const formatStorage = (gb: number) => {
    if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
    return `${gb.toFixed(1)} GB`;
  };

  const stripHtml = (html: string | undefined) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 lg:pb-8">
      {/* Hero Section - Compact */}
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-b border-slate-700/50 mb-4">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span className="text-cyan-300 text-xs font-medium uppercase tracking-wide">AI-Powered Studio</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {t('app.title')}
              </h1>
              <p className="text-slate-400 text-sm hidden sm:block">
                {t('app.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={selectFreeStudio}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-lg hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg text-sm font-semibold flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Free Starter
              </button>
              <LanguageCurrencySelector />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2 space-y-3">
            {categories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id} className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-xl border border-purple-500/30 flex-shrink-0">
                      <div className="text-purple-300">
                        {typeof category.icon === 'string' ? getIconForCategory(category.icon) : category.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h2 className="text-white font-bold text-lg">{category.title}</h2>
                      <p className="text-slate-400 text-sm line-clamp-1">{stripHtml(category.subtitle)}</p>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Products List */}
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-2">
                      {category.products.map((product) => {
                        const isSelected = selectedItems.has(product.id);

                        return (
                          <label
                            key={product.id}
                            className={`block p-3 rounded-xl cursor-pointer transition-all ${isSelected
                              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-purple-500/50'
                              : 'bg-slate-800/50 border-2 border-transparent hover:border-slate-600/50'
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 pt-0.5">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleItem(product.id)}
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                  ? 'bg-gradient-to-br from-purple-500 to-cyan-500 border-transparent'
                                  : 'border-slate-600'
                                  }`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h3 className="text-white font-medium text-sm">{product.name}</h3>
                                  {product.isFree && (
                                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs rounded-full">
                                      FREE
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-400 text-xs line-clamp-2">{stripHtml(product.description)}</p>
                              </div>

                              <div className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-bold ${isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-700/50 text-slate-300'
                                }`}>
                                {formatStorage(product.fileSize)}
                              </div>
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <StorageSelector
                selectedType={storageType}
                selectedCapacity={storageCapacity}
                onTypeChange={setStorageType}
                onCapacityChange={setStorageCapacity}
              />

              <CostSummary
                selectedItems={selectedItems}
                selectedLibraryPacks={selectedLibraryPacks}
                categories={categories}
                totalStorage={totalStorage}
                storageType={storageType}
                storageCapacity={storageCapacity || 0}
                onCalculate={() => navigate('/location')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 z-40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-slate-400">Total Storage</p>
            <p className="text-lg font-bold text-white">{formatStorage(totalStorage)}</p>
          </div>
          <button
            onClick={() => navigate('/location')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg font-semibold flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}