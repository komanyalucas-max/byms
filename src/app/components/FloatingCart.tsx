import { ShoppingCart } from 'lucide-react';
import { useBuilder } from '../contexts/BuilderContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export function FloatingCart() {
    const { selectedItems, totalPrice } = useBuilder();
    const { formatPrice } = useLanguage();
    const navigate = useNavigate();

    const itemCount = selectedItems.size;



    return (
        <button
            onClick={() => navigate('/summary')}
            className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
            <div className="flex items-center gap-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 pl-4 pr-1 py-1 rounded-full shadow-2xl shadow-purple-900/50 hover:scale-105 transition-transform cursor-pointer border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-white" />
                    <span className="font-bold text-white text-sm whitespace-nowrap">
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                <div className="px-4 py-1.5 bg-white/20 rounded-full backdrop-blur-md border border-white/10">
                    <span className="font-bold text-white text-sm whitespace-nowrap">
                        {formatPrice(totalPrice)}
                    </span>
                </div>
            </div>
        </button>
    );
}
