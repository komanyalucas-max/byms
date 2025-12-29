import { useNavigate } from 'react-router-dom';
import { XCircle, Home, ArrowLeft } from 'lucide-react';

export function PaymentCancelledPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-500/20 rounded-full mb-6">
                        <XCircle className="w-12 h-12 text-amber-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Payment Cancelled</h2>
                    <p className="text-slate-300 mb-8">
                        You cancelled the payment process. Your order has not been placed.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate('/checkout')}
                            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Checkout
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
            </div>
        </div>
    );
}
