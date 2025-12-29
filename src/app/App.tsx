import { Routes, Route, useLocation } from 'react-router-dom';
import { StudioBuilder } from './components/StudioBuilder';
import { LocationPage } from './pages/LocationPage';
import { SummaryPage } from './pages/SummaryPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentCallbackPage } from './pages/PaymentCallbackPage';
import { PaymentCancelledPage } from './pages/PaymentCancelledPage';
import { BuilderProvider } from './contexts/BuilderContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Header } from './components/Header';
import { FloatingCart } from './components/FloatingCart';


export default function App() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <LanguageProvider>
      <SettingsProvider>
        <BuilderProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
            {/* Header Component */}
            <Header />

            {/* Floating Cart Summary */}
            <FloatingCart />


            {/* Main Content Info */}
            <div className={currentPath !== '/admin-dashboard' ? 'pt-16' : ''}>
              <Routes>
                <Route path="/" element={<StudioBuilder />} />
                <Route path="/location" element={<LocationPage />} />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/payment-callback" element={<PaymentCallbackPage />} />
                <Route path="/payment-cancelled" element={<PaymentCancelledPage />} />

                <Route path="/about" element={
                  <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="max-w-3xl mx-auto text-center">
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                        About Studio Builder
                      </h1>
                      <p className="text-xl text-slate-300 mb-8">
                        Studio Builder is your comprehensive solution for building a professional music production setup.
                        We help you select the perfect combination of software, plugins, and storage to match your creative needs and budget.
                      </p>
                      <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                          <div className="text-4xl mb-4">🎵</div>
                          <h3 className="text-white font-semibold mb-2">Curated Selection</h3>
                          <p className="text-slate-400 text-sm">Hand-picked tools for music producers at every level</p>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                          <div className="text-4xl mb-4">💾</div>
                          <h3 className="text-white font-semibold mb-2">Storage Calculator</h3>
                          <p className="text-slate-400 text-sm">Automatically calculates your storage needs</p>
                        </div>
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                          <div className="text-4xl mb-4">🚚</div>
                          <h3 className="text-white font-semibold mb-2">Fast Delivery</h3>
                          <p className="text-slate-400 text-sm">Ships to Tanzania and neighboring countries</p>
                        </div>
                      </div>
                    </div>
                  </div>
                } />

                <Route path="/contact" element={
                  <div className="min-h-screen flex items-center justify-center px-4">
                    <div className="max-w-2xl mx-auto">
                      <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
                        Get In Touch
                      </h1>
                      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                            <input
                              type="text"
                              placeholder="Your name"
                              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                            <input
                              type="email"
                              placeholder="your.email@example.com"
                              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                            <textarea
                              rows={5}
                              placeholder="How can we help you?"
                              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                          </div>
                          <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:from-purple-400 hover:to-cyan-400 transition-all shadow-lg shadow-purple-500/50 font-medium">
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                } />
              </Routes>
            </div>
          </div>
        </BuilderProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}