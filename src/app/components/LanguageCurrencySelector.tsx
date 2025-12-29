import { Globe, DollarSign } from 'lucide-react';
import { useLanguage, Language, Currency } from '../contexts/LanguageContext';

export function LanguageCurrencySelector() {
  const { language, setLanguage, currency, setCurrency, t } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      {/* Language Selector */}
      <div className="relative group">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl hover:border-purple-500/50 transition-all">
          <Globe className="w-4 h-4 text-purple-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-transparent text-white text-sm outline-none cursor-pointer pr-2"
            aria-label={t('settings.language')}
          >
            <option value="en" className="bg-slate-900">English</option>
            <option value="sw" className="bg-slate-900">Swahili</option>
          </select>
        </div>
      </div>

      {/* Currency Selector */}
      <div className="relative group">
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl hover:border-emerald-500/50 transition-all">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="bg-transparent text-white text-sm outline-none cursor-pointer pr-2"
            aria-label={t('settings.currency')}
          >
            <option value="USD" className="bg-slate-900">USD</option>
            <option value="TZS" className="bg-slate-900">TZS</option>
          </select>
        </div>
      </div>
    </div>
  );
}
