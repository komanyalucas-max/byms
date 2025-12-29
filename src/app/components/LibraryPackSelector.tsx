import { Check } from 'lucide-react';
import { LibraryPack } from './StudioBuilder';

interface LibraryPackSelectorProps {
  libraryPacks: LibraryPack[];
  selectedPacks: Set<string>;
  onTogglePack: (packId: string) => void;
}

export function LibraryPackSelector({
  libraryPacks,
  selectedPacks,
  onTogglePack,
}: LibraryPackSelectorProps) {
  const formatFileSize = (fileSize: number) => {
    if (fileSize < 1) {
      return `${(fileSize * 1024).toFixed(0)} MB`;
    }
    return `${fileSize.toFixed(1)} GB`;
  };

  return (
    <div className="mt-3 pl-9 space-y-2">
      <p className="text-slate-700 mb-3">Available Library Packs:</p>
      {libraryPacks.map((pack) => {
        const isSelected = selectedPacks.has(pack.id);
        return (
          <label
            key={pack.id}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all group ${
              isSelected
                ? 'bg-purple-50 border border-purple-200'
                : 'bg-slate-100 border border-transparent hover:bg-slate-200'
            }`}
          >
            {/* Custom Checkbox */}
            <div className="flex-shrink-0 pt-0.5">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onTogglePack(pack.id)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-purple-600 border-purple-600'
                    : 'border-slate-300 group-hover:border-purple-400'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </div>
            </div>

            {/* Pack Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h4
                  className={`text-sm ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}
                >
                  {pack.name}
                </h4>
                <div className="flex-shrink-0 text-sm text-purple-600">
                  {formatFileSize(pack.fileSize)}
                </div>
              </div>
              <p className="text-sm text-slate-600">{pack.description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
