import { Product } from './StudioBuilder';
import { Check } from 'lucide-react';
import { LibraryPackSelector } from './LibraryPackSelector';

interface ProductItemProps {
  product: Product;
  isSelected: boolean;
  onToggle: () => void;
  selectedLibraryPacks: Set<string>;
  onToggleLibraryPack: (packId: string) => void;
}

export function ProductItem({ 
  product, 
  isSelected, 
  onToggle,
  selectedLibraryPacks,
  onToggleLibraryPack,
}: ProductItemProps) {
  const formatFileSize = () => {
    if (product.fileSize < 1) {
      return `${(product.fileSize * 1024).toFixed(0)} MB`;
    }
    return `${product.fileSize.toFixed(1)} GB`;
  };

  return (
    <div>
      <label
        className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all group ${
          isSelected
            ? 'bg-indigo-50 border-2 border-indigo-300'
            : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
        }`}
      >
        {/* Custom Checkbox */}
        <div className="flex-shrink-0 pt-0.5">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
            className="sr-only"
          />
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-indigo-600 border-indigo-600'
                : 'border-slate-300 group-hover:border-indigo-400'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-4 mb-1">
            <h3 className={`${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
              {product.name}
            </h3>
            <div className="flex-shrink-0 text-blue-600">{formatFileSize()}</div>
          </div>
          <p className="text-slate-600">{product.description}</p>
        </div>
      </label>

      {/* Show Library Packs if product is selected and has packs */}
      {isSelected && product.libraryPacks && product.libraryPacks.length > 0 && (
        <LibraryPackSelector
          libraryPacks={product.libraryPacks}
          selectedPacks={selectedLibraryPacks}
          onTogglePack={onToggleLibraryPack}
        />
      )}
    </div>
  );
}