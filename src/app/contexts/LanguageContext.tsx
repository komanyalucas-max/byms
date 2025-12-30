import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'sw';
export type Currency = 'USD' | 'TZS';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatPrice: (price: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    'app.title': 'Build Your Music Production Studio',
    'app.subtitle': 'Select the perfect tools for your music journey',

    // Language & Currency
    'settings.language': 'Language',
    'settings.currency': 'Currency',

    // Categories
    'category.daw.title': 'DAW (Where You Make Music)',
    'category.daw.subtitle': 'Your main workspace for creating, recording, and arranging music',
    'category.daw.helper': 'You usually only need one',

    'category.instruments.title': 'Instruments (Sound Makers)',
    'category.instruments.subtitle': 'Virtual instruments to create melodies, beats, and bass lines',

    'category.effects.title': 'Effects & Audio Tools',
    'category.effects.subtitle': 'Plugins to polish and enhance your sound',

    'category.samples.title': 'Samples & Creative Tools',
    'category.samples.subtitle': 'Pre-made sounds and loops to speed up your workflow',

    // Product labels
    'product.free': 'FREE',
    'product.packs': '+ Packs',
    'product.libraryPacks': 'Library Packs',

    // Storage
    'storage.title': 'Choose Your Storage Device',
    'storage.subtitle': 'Select where you\'ll store all your music tools',
    'storage.totalNeeded': 'Total Storage Needed',
    'storage.recommended': 'Recommended',
    'storage.capacity': 'Capacity',
    'storage.device': 'Storage Device',
    'storage.used': 'used of',

    'storage.usb': 'USB Flash Drive',
    'storage.hdd': 'Hard Drive (HDD)',
    'storage.sata': 'SATA SSD',
    'storage.nvme': 'NVMe SSD',

    // CostSummary
    'storage.summary': 'Storage Summary',
    'storage.capacityUsed': 'Capacity Used',
    'storage.insufficient': 'Insufficient Storage',
    'storage.moreNeeded': 'You need {amount} more storage. Please select a larger capacity.',
    'storage.perfect': 'Perfect Fit!',
    'storage.remaining': 'You have {amount} free space remaining.',
    'storage.selectDetails': 'Select a storage device to see capacity details',
    'storage.selectLarger': 'Select Larger Storage',
    'storage.calculate': 'Calculate Your Cost',
    // Location
    'location.title': 'Where Should We Ship?',
    'location.subtitle': 'Choose your delivery location',
    'location.primary': 'Choose Location',
    'location.secondary': 'Select Region/Country',
    'location.tanzania': 'Tanzania',
    'location.other': 'Other Countries',

    // Tanzania regions
    'region.dar': 'Dar es Salaam',
    'region.arusha': 'Arusha',
    'region.mwanza': 'Mwanza',
    'region.dodoma': 'Dodoma',
    'region.mbeya': 'Mbeya',
    'region.zanzibar': 'Zanzibar',

    // Other countries
    'country.kenya': 'Kenya',
    'country.uganda': 'Uganda',
    'country.rwanda': 'Rwanda',
    'country.congo': 'Congo',
    'country.ethiopia': 'Ethiopia',
    'country.somalia': 'Somalia',
    'country.malawi': 'Malawi',

    // Summary
    'summary.title': 'Your Studio Summary',
    'summary.subtitle': 'Here\'s everything you\'ve selected for your music production setup',
    'summary.calculating': 'Calculating Your Total',
    'summary.wait': 'Please wait while we process your selection...',
    'summary.yourProducts': 'Your Products',
    'summary.items': 'items',
    'summary.item': 'item',

    // Price breakdown
    'price.products': 'Products & Tools',
    'price.storage': 'Storage Device',
    'price.shipping': 'Shipping',
    'price.total': 'Total Amount',
    'price.deliveryLocation': 'Delivery Location',

    // Client details
    'client.title': 'Client Details',
    'client.name': 'Full Name',
    'client.email': 'Email Address',
    'client.namePlaceholder': 'Enter your full name',
    'client.emailPlaceholder': 'your.email@example.com',

    // Buttons
    'button.continue': 'Continue',
    'button.back': 'Back to Selection',
    'button.orderNow': 'Order Now',
    'button.viewSummary': 'View Summary & Checkout',

    // Messages
    'message.fillDetails': 'Please fill in your name and email to continue',
    'message.validEmail': 'Please enter a valid email address',
    'message.selectProducts': 'Please select at least one product',
    'message.selectStorage': 'Please select a storage device',
    'message.selectLocation': 'Please select your delivery location',
  },
  sw: {
    // Header
    'app.title': 'Jenga Studio Yako ya Kutengeneza Muziki',
    'app.subtitle': 'Chagua zana kamili kwa safari yako ya muziki',

    // Language & Currency
    'settings.language': 'Lugha',
    'settings.currency': 'Sarafu',

    // Categories
    'category.daw.title': 'DAW (Mahali Unapotengeneza Muziki)',
    'category.daw.subtitle': 'Eneo lako kuu la kuunda, kurekodi, na kupanga muziki',
    'category.daw.helper': 'Kwa kawaida unahitaji moja tu',

    'category.instruments.title': 'Vyombo vya Muziki (Vatengenezaji Sauti)',
    'category.instruments.subtitle': 'Vyombo vya dijiti vya kuunda melodi, mapigo, na mistari ya bass',

    'category.effects.title': 'Athari na Zana za Sauti',
    'category.effects.subtitle': 'Programu za kuboresha na kuongeza ubora wa sauti yako',

    'category.samples.title': 'Sampuli na Zana za Ubunifu',
    'category.samples.subtitle': 'Sauti zilizotayarishwa na loops ili kuharakisha mchakato wako',

    // Product labels
    'product.free': 'BURE',
    'product.packs': '+ Vifurushi',
    'product.libraryPacks': 'Vifurushi vya Maktaba',

    // Storage
    'storage.title': 'Chagua Kifaa chako cha Kuhifadhi',
    'storage.subtitle': 'Chagua mahali utakopohifadhi zana zako zote za muziki',
    'storage.totalNeeded': 'Jumla ya Nafasi Inayohitajika',
    'storage.recommended': 'Inashauriwa',
    'storage.capacity': 'Uwezo',
    'storage.device': 'Kifaa cha Kuhifadhi',
    'storage.used': 'imetumika kati ya',

    'storage.usb': 'USB Flash Drive',
    'storage.hdd': 'Hard Drive (HDD)',
    'storage.sata': 'SATA SSD',
    'storage.nvme': 'NVMe SSD',

    // CostSummary
    'storage.summary': 'Muhtasari wa Hifadhi',
    'storage.capacityUsed': 'Uwezo Uliotumika',
    'storage.insufficient': 'Hifadhi Haipo',
    'storage.moreNeeded': 'Unahitaji {amount} zaidi ya hifadhi. Tafadhali chagua uwezo mkubwa.',
    'storage.perfect': 'Inatosha Kabisa!',
    'storage.remaining': 'Una {amount} ya nafasi iliyobaki.',
    'storage.selectDetails': 'Chagua kifaa cha kuhifadhi ili kuona maelezo ya uwezo',
    'storage.selectLarger': 'Chagua Hifadhi Kubwa',
    'storage.calculate': 'Hesabu Gharama Yako',

    // Location
    'location.title': 'Tulete Wapi?',
    'location.subtitle': 'Chagua eneo lako la uwasilishaji',
    'location.primary': 'Chagua Eneo',
    'location.secondary': 'Chagua Mkoa/Nchi',
    'location.tanzania': 'Tanzania',
    'location.other': 'Nchi Nyingine',

    // Tanzania regions
    'region.dar': 'Dar es Salaam',
    'region.arusha': 'Arusha',
    'region.mwanza': 'Mwanza',
    'region.dodoma': 'Dodoma',
    'region.mbeya': 'Mbeya',
    'region.zanzibar': 'Zanzibar',

    // Other countries
    'country.kenya': 'Kenya',
    'country.uganda': 'Uganda',
    'country.rwanda': 'Rwanda',
    'country.congo': 'Congo',
    'country.ethiopia': 'Ethiopia',
    'country.somalia': 'Somalia',
    'country.malawi': 'Malawi',

    // Summary
    'summary.title': 'Muhtasari wa Studio Yako',
    'summary.subtitle': 'Hapa kuna kila kitu ulichochagua kwa mfumo wako wa kutengeneza muziki',
    'summary.calculating': 'Tunahesabu Jumla Yako',
    'summary.wait': 'Tafadhali subiri tunapochakata uchaguzi wako...',
    'summary.yourProducts': 'Bidhaa Zako',
    'summary.items': 'vitu',
    'summary.item': 'kitu',

    // Price breakdown
    'price.products': 'Bidhaa na Zana',
    'price.storage': 'Kifaa cha Kuhifadhi',
    'price.shipping': 'Usafirishaji',
    'price.total': 'Jumla ya Malipo',
    'price.deliveryLocation': 'Eneo la Uwasilishaji',

    // Client details
    'client.title': 'Maelezo ya Mteja',
    'client.name': 'Jina Kamili',
    'client.email': 'Anwani ya Barua Pepe',
    'client.namePlaceholder': 'Ingiza jina lako kamili',
    'client.emailPlaceholder': 'barua.pepe@mfano.com',

    // Buttons
    'button.continue': 'Endelea',
    'button.back': 'Rudi Kwa Uchaguzi',
    'button.orderNow': 'Oda Sasa',
    'button.viewSummary': 'Tazama Muhtasari na Lipia',

    // Messages
    'message.fillDetails': 'Tafadhali jaza jina na barua pepe yako ili kuendelea',
    'message.validEmail': 'Tafadhali ingiza anwani sahihi ya barua pepe',
    'message.selectProducts': 'Tafadhali chagua angalau bidhaa moja',
    'message.selectStorage': 'Tafadhali chagua kifaa cha kuhifadhi',
    'message.selectLocation': 'Tafadhali chagua eneo lako la uwasilishaji',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage or default
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'en' || saved === 'sw') return saved;
    // Auto-detect browser language
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'sw' ? 'sw' : 'en';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    if (saved === 'USD' || saved === 'TZS') return saved;
    return 'TZS'; // Default to TZS
  });

  // Wrappers to persist state
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem('currency', curr);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(`{${paramKey}}`, String(value));
      });
    }
    return text;
  };

  const formatPrice = (price: number): string => {
    // Always format as TZS (Tsh)
    // Using 'en-US' locale for comma separators, but 'Tsh' suffix.
    return `${price.toLocaleString('en-US', { maximumFractionDigits: 0 })} Tsh`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currency, setCurrency, t, formatPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
