import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone } from 'lucide-react';
import { Order } from '../../services/orderService';

interface PaymentModalProps {
    order: Order;
    onClose: () => void;
    onPaymentComplete: () => void;
}

export function PaymentModal({ order, onClose, onPaymentComplete }: PaymentModalProps) {
    const [step, setStep] = useState<'select' | 'iframe'>('select');
    const [loading, setLoading] = useState(false);

    // Mock Pesapal URL generator
    const getPesapalUrl = async () => {
        setLoading(true);
        // Simulate API call to get iframe URL
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        return `https://demo.pesapal.com/iframe/demo-payment?order=${order.id}&amount=${order.totalAmount}`;
    };

    const handleSelectPesapal = async () => {
        setStep('iframe');
        // In a real app, we would fetch the actual iframe URL here
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {step === 'select' && (
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Select Payment Method</h2>
                        <p className="text-slate-400 mb-8">Choose how you want to pay for Order #{order.id.slice(0, 8)}</p>

                        <div className="grid gap-4">
                            <button
                                onClick={handleSelectPesapal}
                                className="flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-blue-500 transition-all group"
                            >
                                <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 text-blue-400">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-white">Pesapal / Card / Mobile Money</h3>
                                    <p className="text-sm text-slate-400">Pay securely with Credit Card, M-Pesa, Airtel Money</p>
                                </div>
                            </button>

                            {/* Add more payment methods if needed */}
                        </div>
                    </div>
                )}

                {step === 'iframe' && (
                    <div className="flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                            <h3 className="text-white font-semibold">Secure Payment</h3>
                            <span className="text-xs text-slate-500">Powered by Pesapal</span>
                        </div>

                        {loading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            <div className="flex-1 bg-white relative">
                                {/* Since we don't have a real URL, we'll show a demo placeholder or the real demo URL if it works, 
                      but for now mostly likely a placeholder message to simulate the experience */}
                                <iframe
                                    src="https://www.pesapal.com/"
                                    className="w-full h-full border-0"
                                    title="Pesapal Payment"
                                />

                                {/* Overlay for demo simulation */}
                                <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-8 text-center">
                                    <h4 className="text-xl font-bold text-slate-900 mb-4">Pesapal Iframe Simulation</h4>
                                    <p className="text-slate-600 mb-6 max-w-md">
                                        In a production environment, this would load the actual Pesapal payment page via IPN/API integration.
                                        Key: {order.id} | Amount: ${order.totalAmount}
                                    </p>
                                    <button
                                        onClick={onPaymentComplete} // Simulate success
                                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
                                    >
                                        Simulate Successful Payment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
