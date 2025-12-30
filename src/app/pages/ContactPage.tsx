import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/byms/api';

export function ContactPage() {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        try {
            const response = await fetch(`${API_BASE_URL}/contact.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const res = await response.json();
                throw new Error(res.message || 'Failed to send message');
            }

            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div className="min-h-screen py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        Get In Touch
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Have questions about your studio build? We're here to help you create the perfect setup.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* Contact Info Side */}
                    <div className="lg:col-span-5 space-y-6">
                        {settings?.contact_email && (
                            <div className="group p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                                <div className="flex items-start gap-5">
                                    <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-lg mb-1">Email Us</h3>
                                        <p className="text-slate-400 text-sm mb-2">Our friendly team is here to help.</p>
                                        <a href={`mailto:${settings.contact_email}`} className="text-blue-400 hover:text-blue-300 font-medium transition-colors break-all">
                                            {settings.contact_email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {settings?.contact_phone && (
                            <div className="group p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                                <div className="flex items-start gap-5">
                                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-lg mb-1">Call Us</h3>
                                        <p className="text-slate-400 text-sm mb-2">Mon-Fri from 8am to 5pm.</p>
                                        <a href={`tel:${settings.contact_phone}`} className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                            {settings.contact_phone}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {settings?.contact_address && (
                            <div className="group p-6 bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                                <div className="flex items-start gap-5">
                                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-lg mb-1">Visit Us</h3>
                                        <p className="text-slate-400 text-sm mb-2">Come say hello at our office.</p>
                                        <p className="text-slate-300 font-medium">
                                            {settings.contact_address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Floating WhatsApp Button */}
                        {settings?.contact_whatsapp && (
                            <div className="pt-4">
                                <a
                                    href={`https://wa.me/${settings.contact_whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-2xl shadow-lg shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold text-lg"
                                >
                                    <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Form Side */}
                    <div className="lg:col-span-7">
                        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                            <div className="relative z-10 mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Send us a message</h2>
                                <p className="text-slate-400">We'll get back to you within 24 hours.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your name"
                                            className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="your@email.com"
                                            className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 ml-1">Message</label>
                                    <textarea
                                        rows={6}
                                        required
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us about your project..."
                                        className="w-full px-5 py-4 bg-slate-950/50 border border-slate-700/50 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all resize-none"
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                        {errorMessage}
                                    </div>
                                )}

                                {status === 'success' && (
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                        Message sent successfully! We will get back to you soon.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'sending' || status === 'success'}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-2xl shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-[0.98]"
                                >
                                    {status === 'sending' ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Sending...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
