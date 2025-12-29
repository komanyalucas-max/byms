import { useState, useEffect } from 'react';
import { Check, Package, HardDrive, ArrowRight, Sparkles, Truck, User, Mail } from 'lucide-react';
import { Product, LibraryPack } from './StudioBuilder';
import { StorageType } from './StorageSelector';
import { getShippingCost } from './LocationSelection';
import { useLanguage } from '../contexts/LanguageContext';

interface PriceCalculationProps {
  selectedProducts: Product[];
  selectedLibraryPacks: LibraryPack[];
  storageType: StorageType;
  storageCapacity: number;
  totalStorage: number;
  customerLocation: string;
  onContinueToCheckout: (details: { name: string; email: string; totalAmount: number }) => void;
  onBack: () => void;
}

// Pricing logic
const getProductPrice = (product: Product): number => {
  // Free products cost $0
  if (product.isFree) return 0;

  // Simple pricing based on product ID (you can customize this)
  const priceMap: Record<string, number> = {
    'reaper': 60,
    'fl-studio': 199,
    'ableton-live': 449,
    'logic-pro': 199,
    'keyscape': 399,
    'serum': 189,
    'kontakt': 399,
    'valhalla-vintage': 50,
    'fabfilter-pro-q': 179,
    'soundtoys-bundle': 499,
    'izotope-ozone': 129,
    'splice': 9.99,
    'loopcloud': 14.99,
    'output-arcade': 9.99,
  };

  return priceMap[product.id] || 99;
};

const getLibraryPackPrice = (pack: LibraryPack): number => {
  // Library packs pricing
  const priceMap: Record<string, number> = {
    // Kontakt packs
    'kontakt-yamaha': 149,
    'kontakt-damage': 199,
    'kontakt-guitars': 99,
    'kontakt-strings': 299,
    'kontakt-brass': 249,

    // Vital packs
    'vital-community-1': 0, // Free
    'vital-bass': 29,
    'vital-pads': 29,

    // Keyscape packs
    'keyscape-vintage': 149,
    'keyscape-modern': 179,
    'keyscape-hybrid': 99,

    // Serum packs
    'serum-bass': 49,
    'serum-edm': 49,
    'serum-fx': 39,
    'serum-vocal': 45,

    // LABS packs
    'labs-strings': 0, // Free
    'labs-ambient': 0, // Free
    'labs-frozen': 0, // Free

    // Valhalla packs
    'valhalla-presets-vol1': 15,
    'valhalla-vintage-collection': 20,

    // FabFilter packs
    'fabfilter-mixing': 29,
    'fabfilter-mastering': 29,
    'fabfilter-creative': 25,

    // Soundtoys packs
    'soundtoys-vintage': 39,
    'soundtoys-modulation': 35,
    'soundtoys-delay': 35,

    // iZotope packs
    'izotope-genre-masters': 25,
    'izotope-loudness': 20,

    // TDR packs
    'tdr-vocal': 0, // Free
    'tdr-drums': 0, // Free
  };

  return priceMap[pack.id] || 49;
};

const getStoragePrice = (type: StorageType, capacity: number): number => {
  if (!type) return 0;

  const prices: Record<string, Record<number, number>> = {
    'usb': { 32: 15, 64: 25, 128: 40 },
    'hdd': { 256: 45, 500: 60, 1000: 80, 2000: 120 },
    'sata-ssd': { 256: 50, 500: 75, 1000: 110, 2000: 200 },
    'nvme-ssd': { 256: 70, 500: 100, 1000: 150, 2000: 280 },
  };

  return prices[type]?.[capacity] || 0;
};

// Helper function to get product image
const getProductImage = (productId: string): string => {
  const imageMap: Record<string, string> = {
    // DAWs
    'reaper': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'fl-studio': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'ableton-live': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'logic-pro': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'garageband': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',
    'cakewalk': 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400',

    // Instruments
    'vital': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',
    'keyscape': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',
    'serum': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',
    'kontakt': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',
    'labs': 'https://images.unsplash.com/photo-1642784323419-89d08b21c4de?w=400',

    // Effects
    'valhalla-vintage': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',
    'fabfilter-pro-q': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',
    'soundtoys-bundle': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',
    'izotope-ozone': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',
    'free-effects': 'https://images.unsplash.com/photo-1650147880756-32cff42ac2d7?w=400',

    // Samples
    'splice': 'https://images.unsplash.com/photo-1631692364644-d6558eab0915?w=400',
    'loopcloud': 'https://images.unsplash.com/photo-1631692364644-d6558eab0915?w=400',
    'freesound': 'https://images.unsplash.com/photo-1631692364644-d6558eab0915?w=400',
    'output-arcade': 'https://images.unsplash.com/photo-1631692364644-d6558eab0915?w=400',
  };

  return imageMap[productId] || 'https://images.unsplash.com/photo-1758179766251-6b4a0df3c936?w=400';
};

// Helper function to get library pack image
const getLibraryPackImage = (packId: string): string => {
  // Use different images for different types of library packs
  const imageMap: Record<string, string> = {
    // Sound wave/audio visualization for most packs
    default: 'https://images.unsplash.com/photo-1692838952665-a7a9577fde9e?w=400',
    // Music library/studio for sound libraries
    library: 'https://images.unsplash.com/photo-1566918230723-378f6e7878d7?w=400',
    // Vinyl for vintage/classic packs
    vintage: 'https://images.unsplash.com/photo-1603850121303-d4ade9e5ba65?w=400',
    // DAW screen for preset packs
    preset: 'https://images.unsplash.com/photo-1763336333573-e1f656aa3255?w=400',
  };

  // Categorize packs by type
  if (packId.includes('vintage') || packId.includes('classic')) {
    return imageMap.vintage;
  } else if (packId.includes('preset') || packId.includes('community')) {
    return imageMap.preset;
  } else if (packId.includes('strings') || packId.includes('brass') || packId.includes('piano') || packId.includes('guitar')) {
    return imageMap.library;
  }

  return imageMap.default;
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
  const [isCalculating, setIsCalculating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

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

  const productsTotal = selectedProducts.reduce((sum, product) => sum + getProductPrice(product), 0);
  const libraryPacksTotal = selectedLibraryPacks.reduce((sum, pack) => sum + getLibraryPackPrice(pack), 0);
  const storagePrice = getStoragePrice(storageType, storageCapacity || 0);
  const subtotal = productsTotal + libraryPacksTotal + storagePrice;
  const shippingCost = getShippingCost(customerLocation);
  const total = subtotal + shippingCost;

  const handleOrderNow = () => {
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Please fill in your name and email to continue');
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
                const productImage = getProductImage(product.id);
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
                          {product.isFree && (
                            <span className="bg-emerald-500/90 text-white text-[8px] font-bold px-1 rounded shadow-sm">FREE</span>
                          )}
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
                  {storageCapacity >= 1000 ? `${storageCapacity / 1000} TB` : `${storageCapacity} GB`}
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