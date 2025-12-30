import { ShoppingCart } from 'lucide-react';
import { useBuilder } from '../contexts/BuilderContext';

import { useNavigate, useLocation } from 'react-router-dom';

export function FloatingCart() {
    const { selectedItems, storageType, storageCapacity, totalStorage } = useBuilder();
    const navigate = useNavigate();
    const location = useLocation();

    // Only show on Studio Builder page (home)
    if (location.pathname !== '/') return null;

    const itemCount = selectedItems.size;
    const formatStorage = (gb: number) => {
        if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
        return `${gb.toFixed(1)} GB`;
    };

    const isDisabled = !storageType || !storageCapacity || itemCount === 0 || totalStorage > (storageCapacity || 0);

    return (
        <button
            onClick={() => navigate('/location')}
            disabled={isDisabled}
            className={`fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 ${isDisabled ? 'opacity-50 cursor-not-allowed grayscale' : ''
                }`}
        >
            <div className={`flex items-center gap-4 pl-4 pr-1 py-1 rounded-full shadow-2xl transition-transform border border-white/10 backdrop-blur-md ${isDisabled
                ? 'bg-slate-800 shadow-none'
                : 'bg-gradient-to-r from-fuchsia-600 to-pink-600 shadow-purple-900/50 hover:scale-105 cursor-pointer'
                }`}>
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-white" />
                    <span className="font-bold text-white text-sm whitespace-nowrap">
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                <div className="px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-md border border-white/10">
                    <span className="font-bold text-white text-sm whitespace-nowrap">
                        {formatStorage(totalStorage)}
                    </span>
                </div>
            </div>
        </button>
    );
}
