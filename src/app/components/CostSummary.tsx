import { Database, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StorageType } from './StorageSelector';
import { Category } from './StudioBuilder';
import { useLanguage } from '../contexts/LanguageContext';

interface CostSummaryProps {
  selectedItems: Set<string>;
  selectedLibraryPacks: Set<string>;
  categories: Category[];
  totalStorage?: number;
  storageCapacity: number | null;
  storageType: StorageType;
  onCalculate: () => void;
}

export function CostSummary({
  totalStorage = 0,
  storageCapacity,
  storageType,
  onCalculate
}: CostSummaryProps) {
  const { t } = useLanguage();

  const formatStorage = (gb: number | undefined | null) => {
    const value = gb || 0;
    if (value < 1) {
      return `${(value * 1024).toFixed(0)} MB`;
    }
    return `${value.toFixed(1)} GB`;
  };

  const hasCapacity = storageCapacity !== null && storageType !== null;
  const isOverCapacity = hasCapacity && totalStorage > storageCapacity;
  const usagePercentage = hasCapacity ? Math.min((totalStorage / storageCapacity) * 100, 100) : 0;

  return (
    <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />

      <div className="relative p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-1.5 md:p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-lg md:rounded-xl border border-emerald-500/30 flex-shrink-0">
            <Database className="w-4 h-4 md:w-5 md:h-5 text-emerald-300" />
          </div>
          <h2 className="text-white text-sm md:text-base font-semibold">{t('storage.summary')}</h2>
        </div>

        {/* Total Storage Display */}
        <div className="mb-4 md:mb-6 text-center p-4 md:p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl md:rounded-2xl border border-slate-700/50">
          <div className="text-xs md:text-sm text-slate-400 mb-1 md:mb-2">{t('storage.totalNeeded')}</div>
          <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {formatStorage(totalStorage)}
          </div>
        </div>

        {/* Capacity Status */}
        {hasCapacity && (
          <div className="space-y-3 md:space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5 md:mb-2 text-xs md:text-sm">
                <span className="text-slate-400">{t('storage.capacityUsed')}</span>
                <span className={`font-medium ${isOverCapacity ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                  {usagePercentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-2.5 md:h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700/50">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${isOverCapacity
                    ? 'bg-gradient-to-r from-rose-500 to-red-500'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                    }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Status Message */}
            <div className={`flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-xl md:rounded-2xl border backdrop-blur-sm ${isOverCapacity
              ? 'bg-rose-500/10 border-rose-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
              }`}>
              {isOverCapacity ? (
                <>
                  <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-rose-300 text-xs md:text-sm font-medium mb-0.5 md:mb-1">{t('storage.insufficient')}</p>
                    <p className="text-rose-400/80 text-xs leading-relaxed">
                      {t('storage.moreNeeded', { amount: formatStorage(totalStorage - storageCapacity) })}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-emerald-300 text-xs md:text-sm font-medium mb-0.5 md:mb-1">{t('storage.perfect')}</p>
                    <p className="text-emerald-400/80 text-xs leading-relaxed">
                      {t('storage.remaining', { amount: formatStorage(storageCapacity - totalStorage) })}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {!hasCapacity && totalStorage > 0 && (
          <div className="p-3 md:p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl md:rounded-2xl backdrop-blur-sm">
            <p className="text-blue-300 text-xs md:text-sm text-center leading-relaxed">
              {t('storage.selectDetails')}
            </p>
          </div>
        )}

        {/* Calculate Button */}
        {totalStorage > 0 && hasCapacity && (
          <div className="pt-3 md:pt-4 border-t border-slate-700/50">
            <button
              onClick={onCalculate}
              disabled={isOverCapacity}
              className={`w-full py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-sm md:text-base transition-all ${isOverCapacity
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-400 hover:to-cyan-400 shadow-lg hover:shadow-xl'
                }`}
            >
              {isOverCapacity ? t('storage.selectLarger') : t('storage.calculate')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}