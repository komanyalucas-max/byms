import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Info, Mail, LayoutDashboard, Menu, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { settings } = useSettings();

    const currentPath = location.pathname;
    const isHome = currentPath === '/';

    // Fallbacks
    const systemName = settings?.system_name || 'Studio Builder';
    const hasLogo = !!settings?.system_logo;

    if (currentPath === '/admin-dashboard') return null;

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50">
                <div className="relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center h-16">
                            {/* Logo */}
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-white hover:text-cyan-400 transition-colors"
                            >
                                {hasLogo ? (
                                    <img src={settings?.system_logo} alt="Logo" className="h-8 w-auto object-contain rounded-lg" />
                                ) : (
                                    <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg shadow-lg shadow-purple-500/20">
                                        <Home className="w-5 h-5" />
                                    </div>
                                )}
                                <span className="font-bold text-lg tracking-tight">{systemName}</span>
                            </button>

                            {/* Desktop Navigation Items */}
                            <div className="hidden md:flex items-center gap-4 lg:gap-6 ml-auto">
                                <button
                                    onClick={() => navigate('/')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isHome
                                        ? 'bg-slate-800/50 text-cyan-400 border border-slate-700/50'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                                        }`}
                                >
                                    <Home className="w-4 h-4" />
                                    <span>Home</span>
                                </button>

                                <button
                                    onClick={() => navigate('/about')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentPath === '/about'
                                        ? 'bg-slate-800/50 text-cyan-400 border border-slate-700/50'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                                        }`}
                                >
                                    <Info className="w-4 h-4" />
                                    <span>About</span>
                                </button>

                                <button
                                    onClick={() => navigate('/contact')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentPath === '/contact'
                                        ? 'bg-slate-800/50 text-cyan-400 border border-slate-700/50'
                                        : 'text-slate-300 hover:text-white hover:bg-slate-800/30'
                                        }`}
                                >
                                    <Mail className="w-4 h-4" />
                                    <span>Contact</span>
                                </button>

                                {/* Admin Dashboard Button */}
                                <button
                                    onClick={() => window.location.href = import.meta.env.VITE_ADMIN_URL || `${import.meta.env.BASE_URL}admin/`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-cyan-500/30 transition-all hover:shadow-lg hover:shadow-purple-500/10"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Admin Dashboard</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600 shadow-lg z-[60]"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-72 bg-slate-900 border-l border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <span className="font-bold text-lg text-white">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 p-6 space-y-2 overflow-y-auto">
                            <button
                                onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isHome
                                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                <Home className="w-5 h-5" />
                                <span className="font-medium">Home</span>
                            </button>
                            {/* ... (Other Mobile items same as before) ... */}

                            <button
                                onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPath === ('/about')
                                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                <Info className="w-5 h-5" />
                                <span className="font-medium">About</span>
                            </button>

                            <button
                                onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPath === ('/contact')
                                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`}
                            >
                                <Mail className="w-5 h-5" />
                                <span className="font-medium">Contact</span>
                            </button>

                            <div className="my-4 border-t border-slate-800/50" />

                            <button
                                onClick={() => { window.location.href = import.meta.env.VITE_ADMIN_URL || `${import.meta.env.BASE_URL}admin/`; setIsMobileMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-purple-300 hover:text-white hover:bg-slate-700/50 transition-all font-medium"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                <span>Admin Dashboard</span>
                            </button>
                        </div>
                        <div className="p-6 border-t border-slate-800">
                            <p className="text-xs text-slate-500 text-center">
                                © 2024 {systemName}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
