import { HardDrive, Usb, Disc, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBuilder, StorageType } from '../contexts/BuilderContext';

interface StorageSelectorProps {
  selectedType: StorageType | null;
  selectedCapacity: number | null;
  onTypeChange: (type: StorageType) => void;
  onCapacityChange: (capacity: number) => void;
}

const IconMap: Record<string, any> = {
  'usb': Usb,
  'hard-drive': HardDrive,
  'hdd': HardDrive, // Alias
  'disc': Disc,
  'sata-ssd': Disc, // Alias
  'zap': Zap,
  'nvme-ssd': Zap // Alias
};

const StyleMap: Record<string, any> = {
  'usb': {
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-300',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
  },
  'hdd': {
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-300',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-600',
  },
  'sata-ssd': {
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-300',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-600',
  },
  'nvme-ssd': {
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
};

export function StorageSelector({
  selectedType,
  selectedCapacity,
  onTypeChange,
  onCapacityChange,
}: StorageSelectorProps) {
  const { t } = useLanguage();
  const { storageOptions } = useBuilder();

  const currentTypeData = storageOptions.find((t) => t.id === selectedType);

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
            {storageOptions.map((type) => {
              const Icon = IconMap[type.icon] || IconMap[type.id] || HardDrive;
              const styles = StyleMap[type.id] || StyleMap['hdd'];
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
                          ? `bg-gradient-to-br ${styles.color} shadow-lg`
                          : 'bg-slate-700/50 group-hover:bg-slate-700'
                          }`}
                      >
                        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-xs md:text-sm transition-colors font-medium truncate ${isSelected ? 'text-white' : 'text-slate-300'
                          }`}>
                          {type.name}
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
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${styles.color} animate-pulse`} />
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
              {currentTypeData.options.map((option) => {
                const isSelected = selectedCapacity === option.capacity;
                return (
                  <button
                    key={option.id}
                    onClick={() => onCapacityChange(option.capacity)}
                    className={`relative w-full p-3 md:p-4 rounded-lg md:rounded-xl border-2 transition-all overflow-hidden group ${isSelected
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                      : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-800/70'
                      }`}
                  >
                    <div className="text-center relative">
                      <div className={`font-semibold text-sm md:text-base transition-colors truncate ${isSelected ? 'text-white' : 'text-slate-300'
                        }`}>
                        {option.capacity >= 1000 ? `${option.capacity / 1000} TB` : `${option.capacity} GB`}
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