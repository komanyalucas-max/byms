import { HardDrive, Usb, Disc, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export type StorageType = 'usb' | 'hdd' | 'sata-ssd' | 'nvme-ssd' | null;

interface StorageSelectorProps {
  selectedType: StorageType;
  selectedCapacity: number | null;
  onTypeChange: (type: StorageType) => void;
  onCapacityChange: (capacity: number) => void;
}

const storageTypes = [
  {
    id: 'usb' as StorageType,
    name: 'USB Flash Drive',
    icon: Usb,
    capacities: [32, 64, 128],
    description: 'Portable and affordable',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
  {
    id: 'hdd' as StorageType,
    name: 'Hard Drive',
    icon: HardDrive,
    capacities: [256, 500, 1000, 2000],
    description: 'Large capacity, budget-friendly',
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
  {
    id: 'sata-ssd' as StorageType,
    name: 'SATA SSD',
    icon: Disc,
    capacities: [256, 500, 1000, 2000],
    description: 'Fast and reliable',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-300',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  {
    id: 'nvme-ssd' as StorageType,
    name: 'NVMe SSD',
    icon: Zap,
    capacities: [256, 500, 1000, 2000],
    description: 'Fastest performance',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
];

export function StorageSelector({
  selectedType,
  selectedCapacity,
  onTypeChange,
  onCapacityChange,
}: StorageSelectorProps) {
  const { t } = useLanguage();
  const currentTypeData = storageTypes.find((t) => t.id === selectedType);

  return (
    <div className="relative bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl md:rounded-3xl border border-slate-700/50 overflow-hidden shadow-xl">
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative p-4 md:p-6">
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-2 md:gap-3 mb-2">
            <div className="p-1.5 md:p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg md:rounded-xl border border-blue-500/30 flex-shrink-0">
              <HardDrive className="w-4 h-4 md:w-5 md:h-5 text-blue-300" />
            </div>
            <h2 className="text-white text-sm md:text-base font-semibold">{t('storage.title')}</h2>
          </div>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            {t('storage.subtitle')}
          </p>
        </div>

        {/* Storage Type Selection */}
        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          <label className="block text-slate-300 text-xs md:text-sm font-medium">{t('storage.device')}</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {storageTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => onTypeChange(type.id)}
                  className={`group relative w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all text-left overflow-hidden ${isSelected
                    ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70'
                    }`}
                >
                  <div className="relative">
                    {/* Icon */}
                    <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                      <div
                        className={`p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all flex-shrink-0 ${isSelected
                          ? `bg-gradient-to-br ${type.color} shadow-lg`
                          : 'bg-slate-700/50 group-hover:bg-slate-700'
                          }`}
                      >
                        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-xs md:text-sm transition-colors font-medium truncate ${isSelected ? 'text-white' : 'text-slate-300'
                          }`}>
                          {t(`storage.${type.id}`)}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className={`text-xs transition-colors ml-10 md:ml-12 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                      {type.description}
                    </p>

                    {/* Visual indicator for selected */}
                    {isSelected && (
                      <div className="mt-2 md:mt-3 ml-10 md:ml-12 flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${type.color} animate-pulse`} />
                        <span className="text-xs text-purple-300">Selected</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Capacity Selection */}
        {selectedType && currentTypeData && (
          <div className="space-y-2 md:space-y-3 animate-in slide-in-from-top-2 duration-300">
            <label className="block text-slate-300 text-xs md:text-sm font-medium">{t('storage.capacity')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
              {currentTypeData.capacities.map((capacity) => {
                const isSelected = selectedCapacity === capacity;
                return (
                  <button
                    key={capacity}
                    onClick={() => onCapacityChange(capacity)}
                    className={`relative w-full p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all overflow-hidden group ${isSelected
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70'
                      }`}
                  >
                    <div className="text-center relative">
                      <div className={`font-semibold text-sm md:text-base transition-colors truncate ${isSelected ? 'text-white' : 'text-slate-300'
                        }`}>
                        {capacity >= 1000 ? `${capacity / 1000} TB` : `${capacity} GB`}
                      </div>
                      {isSelected && (
                        <div className="mt-1 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}