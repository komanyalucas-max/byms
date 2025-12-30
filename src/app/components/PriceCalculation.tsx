import { useState, useEffect } from 'react';
import { Check, Package, HardDrive, ArrowRight, Sparkles, Truck, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBuilder, Product, LibraryPack, StorageType } from '../contexts/BuilderContext';
import { getShippingCost } from './LocationSelection';

interface PriceCalculationProps {
  selectedProducts: Product[];
  selectedLibraryPacks: LibraryPack[];
  storageType: StorageType | null;
  storageCapacity: number | null;
  totalStorage: number;
  customerLocation: string;
  onContinueToCheckout: (details: { name: string; email: string; phone: string; totalAmount: number }) => void;
  onBack: () => void;
}

// Helper function to get product image
const getProductImage = (product: Product): string => {
  if (product.image) return product.image;

  // Fallback map if needed, or just a default
  return 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400';
};

// Helper function to get library pack image
const getLibraryPackImage = (pack: LibraryPack): string => {
  if (pack.image) return pack.image;

  // Use different images for different types of library packs based on name
  const name = pack.name.toLowerCase();

  if (name.includes('vintage') || name.includes('classic')) {
    return 'https://images.unsplash.com/photo-1603850121303-d4ade9e5ba65?w=400';
  } else if (name.includes('preset') || name.includes('community')) {
    return 'https://images.unsplash.com/photo-1763336333573-e1f656aa3255?w=400';
  } else if (name.includes('strings') || name.includes('brass') || name.includes('piano') || name.includes('guitar')) {
    return 'https://images.unsplash.com/photo-1566918230723-378f6e7878d7?w=400';
  }

  return 'https://images.unsplash.com/photo-1692838952665-a7a9577fde9e?w=400';
};

export function PriceCalculation({
  selectedProducts: selectedProductsSet,
  selectedLibraryPacks: selectedLibraryPacksSet,
  storageType,
  storageCapacity,
  totalStorage,
  customerLocation,
  onContinueToCheckout,
  onBack,
}: PriceCalculationProps) {
  const { t, formatPrice } = useLanguage();
  const { getStoragePrice } = useBuilder();
  const [isCalculating, setIsCalculating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Convert Sets to Arrays for easier manipulation
  const selectedProducts = Array.from(selectedProductsSet || []);
  const selectedLibraryPacks = Array.from(selectedLibraryPacksSet || []);

  useEffect(() => {
    if (isCalculating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsCalculating(false), 300);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isCalculating]);

  const productsTotal = selectedProducts.reduce((sum, product) => sum + (product.price || 0), 0);
  // Default library pack price since not yet fully managed
  const libraryPacksTotal = selectedLibraryPacks.reduce((sum, _) => sum + 49, 0);
  const storagePrice = getStoragePrice(storageType, storageCapacity || 0);
  const subtotal = productsTotal + libraryPacksTotal + storagePrice;
  const shippingCost = getShippingCost(customerLocation);
  const total = subtotal + shippingCost;

  const handleOrderNow = () => {
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      alert('Please fill in your name, email, and phone number to continue');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    // Proceed with checkout passing details
    onContinueToCheckout({
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      totalAmount: total
    });
  };

  const formatStorage = (gb: number) => {
    if (gb < 1) {
      return `${(gb * 1024).toFixed(0)} MB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  const getStorageTypeName = () => {
    switch (storageType) {
      case 'usb':
        return 'USB Flash Drive';
      case 'hdd':
        return 'Hard Drive';
      case 'sata-ssd':
        return 'SATA SSD';
      case 'nvme-ssd':
        return 'NVMe SSD';
      default:
        return 'Unknown';
    }
  };

  // Loading state
  if (isCalculating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
        {/* Animated background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="text-center max-w-md mx-auto px-4 relative z-10">
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-xl opacity-75 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {t('summary.calculating')}
            </h2>
            <p className="text-slate-300">{t('summary.wait')}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="w-full bg-slate-800/50 rounded-full h-4 overflow-hidden border border-slate-700/50 backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-300 ease-out rounded-full shadow-lg shadow-purple-500/50"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mt-3">
              {progress}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Price summary state
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 py-12">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-75" />
            <div className="relative w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50">
              <Check className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">
            {t('summary.title')}
          </h1>
          <p className="text-slate-300">
            {t('summary.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Column 1: Products List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl border border-indigo-500/30">
                <Package className="w-5 h-5 text-indigo-300" />
              </div>
              <h2 className="text-lg font-bold text-white">{t('summary.yourProducts')}</h2>
              <span className="ml-auto px-2 py-0.5 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 rounded-full text-xs">
                {selectedProducts.length}
              </span>
            </div>

            <div className="space-y-3">
              {selectedProducts.map((product) => {
                const productImage = getProductImage(product); // Pass full product object
                const hasLibraryPacks = product.libraryPacks && selectedLibraryPacks.some((pack) =>
                  product.libraryPacks!.some((p) => p.id === pack.id)
                );

                return (
                  <div key={product.id} className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-xl border border-slate-700/50 overflow-hidden hover:border-purple-500/50 transition-all">
                    <div className="flex">
                      {/* Product Image - Ultra Compact (w-20) */}
                      <div className="relative w-20 flex-shrink-0 bg-slate-900 border-r border-slate-700/50">
                        <img
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 absolute inset-0"
                        />
                        {/* Status Badges */}
                        <div className="absolute top-0 left-0 right-0 flex flex-wrap gap-0.5 p-1">

                        </div>
                      </div>

                      {/* Product Info - Compact Padding */}
                      <div className="flex-1 p-2.5 flex flex-col justify-center">
                        <div className="flex justify-between items-start leading-tight mb-1">
                          <h3 className="text-white font-semibold text-xs sm:text-sm line-clamp-1 mr-2">{product.name}</h3>
                          <span className="text-[10px] px-1.5 py-0.5 bg-blue-500/10 text-blue-300 rounded border border-blue-500/20 whitespace-nowrap">
                            {formatStorage(product.fileSize)}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400 leading-snug line-clamp-2 mb-1.5">{product.description}</p>

                        {/* Library Packs - Inline List */}
                        {hasLibraryPacks && (
                          <div className="pt-1.5 border-t border-slate-700/50">
                            <div className="space-y-1">
                              {selectedLibraryPacks
                                .filter((pack) => product.libraryPacks!.some((p) => p.id === pack.id))
                                .map((pack) => (
                                  <div key={pack.id} className="flex items-center justify-between text-[10px] text-slate-400">
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <div className="w-1 h-1 bg-fuchsia-400 rounded-full flex-shrink-0" />
                                      <span className="truncate">{pack.name}</span>
                                    </div>
                                    <span className="opacity-70 ml-1">{formatStorage(pack.fileSize)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 2: Client Details (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-lg border border-indigo-500/30">
                    <User className="w-4 h-4 text-indigo-300" />
                  </div>
                  <h2 className="text-white font-semibold text-sm">{t('client.title')}</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="customer-name" className="block text-xs font-medium text-slate-400 mb-1">
                      {t('client.name')} *
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t('client.namePlaceholder')}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-email" className="block text-xs font-medium text-slate-400 mb-1">
                      {t('client.email')} *
                    </label>
                    <input
                      id="customer-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder={t('client.emailPlaceholder')}
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-phone" className="block text-xs font-medium text-slate-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+255..."
                      className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700/50 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/50">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Delivering to: <span className="text-slate-300">{customerLocation}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Summary & Actions (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Mini Storage Summary */}
              <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-slate-300">{getStorageTypeName()}</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {(storageCapacity || 0) >= 1000 ? `${(storageCapacity || 0) / 1000} TB` : `${storageCapacity || 0} GB`}
                </span>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl p-5">
                <h2 className="text-white font-semibold text-sm mb-4">Order Summary</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Products & Packs</span>
                    <span className="text-slate-300">{formatPrice(productsTotal + libraryPacksTotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Storage Device</span>
                    <span className="text-slate-300">{formatPrice(storagePrice)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Shipping</span>
                    <span className="text-slate-300">{formatPrice(shippingCost)}</span>
                  </div>

                  <div className="border-t border-slate-700/50 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white font-medium">{t('price.total')}</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleOrderNow}
                    className="group relative w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/70"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold text-sm">{t('button.orderNow')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full py-3 px-4 bg-slate-800/50 backdrop-blur-xl text-slate-300 rounded-xl border border-slate-700/50 hover:bg-slate-800/70 text-sm transition-all"
                  >
                    {t('button.back')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}