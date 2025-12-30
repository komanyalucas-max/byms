import { useState } from 'react';
import { ArrowLeft, Package, HardDrive, MapPin, User, CreditCard, Music, Wallet } from 'lucide-react';
import { Product, LibraryPack, StorageType } from '../contexts/BuilderContext';
import { useSettings } from '../contexts/SettingsContext';
import { useLanguage } from '../contexts/LanguageContext';

interface CheckoutProps {
  selectedProducts: Product[];
  selectedLibraryPacks: LibraryPack[];
  storageType: StorageType | null;
  storageCapacity: number;
  totalStorage: number;
  customerLocation: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  onBack: () => void;
  onPaymentStart: (method: 'pesapal' | 'offline') => void;
}

export function Checkout({
  selectedProducts = [],
  selectedLibraryPacks = [],
  storageType,
  storageCapacity,
  totalStorage,
  customerLocation,
  customerName,
  customerEmail,
  customerPhone,
  totalAmount,
  onBack,
  onPaymentStart,
}: CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { settings } = useSettings();
  const { formatPrice } = useLanguage();

  const systemName = settings?.system_name || 'Studio Builder';
  // Use uploaded logo or fallback icon, similar to Header
  const hasLogo = !!settings?.system_logo;

  const formatStorage = (gb: number) => {
    if (gb < 1) {
      return `${(gb * 1024).toFixed(0)} MB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  // Helper to strip HTML tags
  const stripHtml = (html: string | undefined) => {
    if (!html) return '';
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
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

  const handlePayment = (method: 'pesapal' | 'offline') => {
    setIsProcessing(true);
    onPaymentStart(method);
    // Processing state will be reset by parent or navigation interaction hopefully
    // But safely reset after delay if nothing happens
    setTimeout(() => setIsProcessing(false), 2000);
  };

  const isPesapalEnabled = settings?.payment_pesapal_enabled ?? true; // Default to true if undefined? Or false for safety. Let's assume true for demo unless settings loaded.
  const isOfflineEnabled = settings?.payment_offline_enabled ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Header with Branding */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base">Back to Order Details</span>
          </button>

          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-4">
            {hasLogo ? (
              <img src={settings?.system_logo} alt="Logo" className="w-12 h-12 object-contain rounded-xl bg-white/5 p-1" />
            ) : (
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                <Music className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                {systemName}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">Professional Music Production Tools</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-6" />

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Review Your Order</h2>
          <p className="text-slate-400 text-sm sm:text-base">Please confirm your details before payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Order Summary - Mobile First */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Selected Products */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/20 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400 rounded-lg">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Selected Products</h3>
              </div>

              <div className="space-y-3">
                {selectedProducts.map((product) => (
                  <div key={product.id}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                      <div className="flex-1 mb-2 sm:mb-0">
                        <h4 className="text-white font-medium text-sm sm:text-base mb-1">{product.name}</h4>
                        <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">{stripHtml(product.description)}</p>
                      </div>
                      <div className="text-xs sm:text-sm text-purple-400 font-medium sm:ml-4">
                        {formatStorage(product.fileSize)}
                      </div>
                    </div>

                    {/* Library Packs */}
                    {product.libraryPacks && selectedLibraryPacks.some((pack) =>
                      product.libraryPacks!.some((p) => p.id === pack.id)
                    ) && (
                        <div className="ml-3 sm:ml-6 mt-2 space-y-2">
                          {selectedLibraryPacks
                            .filter((pack) => product.libraryPacks!.some((p) => p.id === pack.id))
                            .map((pack) => (
                              <div
                                key={pack.id}
                                className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-2 sm:p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20"
                              >
                                <div className="flex-1 mb-1 sm:mb-0">
                                  <h5 className="text-xs sm:text-sm text-white font-medium">{pack.name}</h5>
                                  <p className="text-xs text-slate-400 line-clamp-1">{stripHtml(pack.description)}</p>
                                </div>
                                <div className="text-xs text-purple-400 sm:ml-4">
                                  {formatStorage(pack.fileSize)}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Device */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/20 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 rounded-lg">
                  <HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Storage Device</h3>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium text-sm sm:text-base">{getStorageTypeName()}</h4>
                  <span className="text-blue-400 font-bold text-sm sm:text-base">
                    {storageCapacity >= 1000 ? `${storageCapacity / 1000} TB` : `${storageCapacity} GB`}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Total storage needed: {formatStorage(totalStorage)}
                </p>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-500/20 p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Customer Information</h3>
              </div>

              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs sm:text-sm mb-2">Full Name</label>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-white font-medium text-sm sm:text-base">
                      {customerName}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs sm:text-sm mb-2">Email Address</label>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-white font-medium text-sm sm:text-base truncate">
                      {customerEmail}
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs sm:text-sm mb-2">Phone Number</label>
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 text-white font-medium text-sm sm:text-base truncate">
                      {customerPhone}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs sm:text-sm mb-2">Delivery Location</label>
                  <div className="p-3 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 rounded-lg border border-emerald-500/30 flex items-center gap-2 text-emerald-300 font-medium text-sm sm:text-base">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{customerLocation}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Order Total & Payment - Sticky on Desktop */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
              <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30 p-4 sm:p-6">
                {/* Brand Badge */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30 mb-4">
                    <Music className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-300">{systemName}</span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Order Summary</h3>

                <div className="space-y-3 sm:space-y-4 mb-6">
                  <div className="flex justify-between text-slate-300 text-sm sm:text-base">
                    <span>Products</span>
                    <span className="font-medium">{selectedProducts.length} items</span>
                  </div>
                  {selectedLibraryPacks.length > 0 && (
                    <div className="flex justify-between text-slate-300 text-sm sm:text-base">
                      <span>Library Packs</span>
                      <span className="font-medium">{selectedLibraryPacks.length} packs</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-300 text-sm sm:text-base">
                    <span>Storage Device</span>
                    <span className="font-medium">1 unit</span>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-4" />

                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium text-sm sm:text-base">Total Amount</span>
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 text-center">
                    Includes shipping to {customerLocation}
                  </div>
                </div>

                {/* Payment Buttons */}
                <div className="space-y-3">
                  {isPesapalEnabled && (
                    <button
                      onClick={() => handlePayment('pesapal')}
                      disabled={isProcessing}
                      className="w-full py-3 sm:py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white rounded-xl transition-all shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-sm sm:text-base"
                    >
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      {isProcessing ? 'Processing...' : 'Pay with Pesapal'}
                    </button>
                  )}

                  {isOfflineEnabled && (
                    <button
                      onClick={() => handlePayment('offline')}
                      disabled={isProcessing}
                      className="w-full py-3 sm:py-4 px-6 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all border border-slate-600 hover:border-slate-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold text-sm sm:text-base"
                    >
                      <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                      {isProcessing ? 'Processing...' : 'Pay Offline / Cash'}
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-500 text-center mt-4">
                  🔒 Secure payment
                </p>
                <p className="text-xs text-slate-600 text-center mt-2">
                  By completing your order, you agree to our terms of service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
