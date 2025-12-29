import { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, CheckCircle, XCircle, AlertCircle, Music, Shield } from 'lucide-react';
import { Order } from '../../services/orderService';
import { pesapalService, PesapalOrderResponse } from '../../services/pesapalService';

interface PesapalPaymentModalProps {
    order: Order;
    onClose: () => void;
    onPaymentComplete: (trackingId: string) => void;
}

export function PesapalPaymentModal({ order, onClose, onPaymentComplete }: PesapalPaymentModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pesapalResponse, setPesapalResponse] = useState<PesapalOrderResponse | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');

    useEffect(() => {
        // Listen for payment callback
        const handleMessage = async (event: MessageEvent) => {
            // Verify origin for security
            if (event.origin !== window.location.origin) return;

            if (event.data.type === 'PESAPAL_CALLBACK') {
                const { OrderTrackingId, OrderMerchantReference } = event.data;
                await checkPaymentStatus(OrderTrackingId);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const initiatePesapalPayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Create Pesapal order request
            const pesapalOrder = pesapalService.createOrderRequest(
                order.id,
                order.totalAmount,
                order.customer.email,
                order.customer.name,
                undefined, // phone number (optional)
                `AK23 Studio Kits Order - ${order.items.products.length + order.items.libraryPacks.length} items`
            );

            // Submit to Pesapal
            const response = await pesapalService.submitOrder(pesapalOrder);
            setPesapalResponse(response);
            setPaymentStatus('processing');
        } catch (err: any) {
            console.error('Pesapal payment error:', err);
            setError(err.message || 'Failed to initialize payment. Please try again.');
            setPaymentStatus('failed');
        } finally {
            setIsLoading(false);
        }
    };

    const checkPaymentStatus = async (trackingId: string) => {
        try {
            const status = await pesapalService.getTransactionStatus(trackingId);

            if (status.status_code === 1) {
                // Payment completed
                setPaymentStatus('completed');
                setTimeout(() => {
                    onPaymentComplete(trackingId);
                }, 2000);
            } else if (status.status_code === 2) {
                // Payment failed
                setPaymentStatus('failed');
                setError(status.description || 'Payment failed');
            } else if (status.status_code === 3) {
                // Payment reversed
                setPaymentStatus('failed');
                setError('Payment was reversed');
            }
        } catch (err: any) {
            console.error('Failed to check payment status:', err);
            setError('Failed to verify payment status');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-900/50">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-purple-500/20 bg-slate-900/80 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        {/* Brand Icon */}
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                            <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                AK23 Studio Kits
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                Secure Payment via Pesapal
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-88px)]">
                    {/* Order Summary - Compact on Mobile */}
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-purple-500/20">
                        <div className="grid grid-cols-2 sm:flex sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                <span className="text-slate-400">Order ID:</span>
                                <span className="text-white font-mono font-medium">{order.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                <span className="text-slate-400">Customer:</span>
                                <span className="text-white font-medium truncate">{order.customer.name}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                                <span className="text-slate-400">Items:</span>
                                <span className="text-white font-medium">
                                    {order.items.products.length + order.items.libraryPacks.length}
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 col-span-2 sm:col-span-1">
                                <span className="text-slate-400">Total:</span>
                                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    TZS {order.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Status - Pending */}
                    {paymentStatus === 'pending' && !pesapalResponse && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mb-4">
                                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                                </div>
                                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">Ready to Pay</h4>
                                <p className="text-sm sm:text-base text-slate-400">Click below to proceed with secure payment</p>
                            </div>

                            <button
                                onClick={initiatePesapalPayment}
                                disabled={isLoading}
                                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-purple-900/50 hover:shadow-purple-900/70 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto text-sm sm:text-base"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Initializing Payment...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay with Pesapal
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Pesapal Payment Iframe - Optimized for Mobile */}
                    {pesapalResponse && paymentStatus === 'processing' && (
                        <div className="space-y-4">
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-300 mb-1">Complete your payment</p>
                                    <p className="text-blue-400 text-xs sm:text-sm">
                                        Select your preferred payment method and follow the instructions below.
                                    </p>
                                </div>
                            </div>

                            {/* Iframe Container - Responsive Height */}
                            <div className="border-2 border-purple-500/30 rounded-xl overflow-hidden bg-white shadow-2xl">
                                <iframe
                                    src={pesapalResponse.redirect_url}
                                    className="w-full h-[500px] sm:h-[600px] lg:h-[650px]"
                                    title="Pesapal Payment Gateway"
                                    allow="payment"
                                    sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation allow-popups"
                                />
                            </div>

                            {/* Payment Instructions */}
                            <div className="bg-slate-800/30 rounded-lg p-3 sm:p-4 border border-slate-700/50">
                                <p className="text-xs sm:text-sm text-slate-400 text-center">
                                    💡 <span className="font-medium text-slate-300">Tip:</span> If the payment form doesn't load, try refreshing or using a different browser.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Success State */}
                    {paymentStatus === 'completed' && (
                        <div className="text-center py-12 sm:py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-emerald-500/20 rounded-full mb-6 animate-pulse">
                                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
                            </div>
                            <h4 className="text-2xl sm:text-3xl font-bold text-white mb-3">Payment Successful!</h4>
                            <p className="text-slate-400 mb-6 text-sm sm:text-base">Your order has been confirmed and is being processed.</p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                                <Music className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-emerald-300">Thank you for choosing AK23 Studio Kits</span>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-4">
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="font-medium text-red-300 mb-1">Payment Error</p>
                                <p className="text-red-400 text-xs sm:text-sm">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Failed State */}
                    {paymentStatus === 'failed' && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full mb-4">
                                <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Payment Failed</h4>
                            <button
                                onClick={initiatePesapalPayment}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all font-medium shadow-lg text-sm sm:text-base"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
