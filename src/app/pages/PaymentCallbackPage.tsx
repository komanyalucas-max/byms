import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, XCircle, Home } from 'lucide-react';
import { pesapalService } from '../../services/pesapalService';
import { orderService } from '../../services/orderService';

export function PaymentCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const orderTrackingId = searchParams.get('OrderTrackingId');
            const merchantReference = searchParams.get('OrderMerchantReference');

            if (!orderTrackingId || !merchantReference) {
                setStatus('failed');
                setError('Invalid payment callback parameters');
                return;
            }

            try {
                // Get transaction status from Pesapal
                const transactionStatus = await pesapalService.getTransactionStatus(orderTrackingId);
                setPaymentDetails(transactionStatus);

                if (transactionStatus.status_code === 1) {
                    // Payment completed
                    setStatus('success');
                    // Update order status in our system
                    await orderService.updateOrderStatus(merchantReference, 'paid', 'pesapal');
                } else {
                    // Payment failed or invalid
                    setStatus('failed');
                    setError(transactionStatus.description || 'Payment was not completed');
                }
            } catch (err: any) {
                console.error('Payment verification error:', err);
                setStatus('failed');
                setError(err.message || 'Failed to verify payment');
            }
        };

        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                {status === 'loading' && (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center">
                        <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment</h2>
                        <p className="text-slate-400">Please wait while we confirm your payment...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 rounded-full mb-6">
                            <CheckCircle className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Payment Successful!</h2>
                        <p className="text-slate-300 mb-6">
                            Your order has been confirmed and is being processed.
                        </p>

                        {paymentDetails && (
                            <div className="bg-slate-800/50 rounded-xl p-6 mb-8 text-left space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Order Reference:</span>
                                    <span className="text-white font-mono text-sm">
                                        {paymentDetails.merchant_reference?.slice(0, 12)}...
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Amount Paid:</span>
                                    <span className="text-white font-bold">
                                        {paymentDetails.currency} {paymentDetails.amount?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Payment Method:</span>
                                    <span className="text-white">{paymentDetails.payment_method}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm">Confirmation Code:</span>
                                    <span className="text-white font-mono text-xs">
                                        {paymentDetails.confirmation_code}
                                    </span>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-purple-900/30 flex items-center gap-2 mx-auto"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-6">
                            <XCircle className="w-12 h-12 text-red-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">Payment Failed</h2>
                        <p className="text-slate-300 mb-2">
                            We couldn't process your payment.
                        </p>
                        {error && (
                            <p className="text-red-400 text-sm mb-6">{error}</p>
                        )}

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => navigate('/checkout')}
                                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
