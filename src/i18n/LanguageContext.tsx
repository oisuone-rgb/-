import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, LanguageOption, SUPPORTED_LANGUAGES, translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  currentOption: LanguageOption;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('geling_app_language');
    if (saved && (saved === 'zh-CN' || saved === 'en-US' || saved === 'zh-TW' || saved === 'ja-JP' || saved === 'ru-RU' || saved === 'ar-SA')) {
      return saved as Language;
    }
    // Check browser language
    if (typeof navigator !== 'undefined' && navigator.language) {
      const navLang = navigator.language.toLowerCase();
      if (navLang.startsWith('ru')) return 'ru-RU';
      if (navLang.startsWith('ar')) return 'ar-SA';
      if (navLang.startsWith('en')) return 'en-US';
      if (navLang.startsWith('ja')) return 'ja-JP';
      if (navLang.includes('tw') || navLang.includes('hk') || navLang.includes('hant')) return 'zh-TW';
    }
    return 'zh-CN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('geling_app_language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar-SA' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar-SA' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to zh-CN
    const zhDict = translations['zh-CN'];
    if (zhDict && zhDict[key]) {
      return zhDict[key];
    }
    return fallback || key;
  };

  const currentOption = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      currentOption,
      availableLanguages: SUPPORTED_LANGUAGES
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
