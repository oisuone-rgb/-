import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, currentOption, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition cursor-pointer shadow-2xs hover:border-emerald-600"
        title="切换语言 / Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-800" />
        <span className="text-base leading-none">{currentOption.flag}</span>
        <span className="hidden sm:inline font-medium">{currentOption.label}</span>
        <span className="sm:hidden font-medium">{currentOption.shortLabel}</span>
        <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
          <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-wider border-b border-stone-100 mb-1">
            Language / 多语言 / Язык / اللغة
          </div>
          {availableLanguages.map((opt) => {
            const isSelected = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => {
                  setLanguage(opt.code);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-xs flex items-center justify-between transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{opt.flag}</span>
                  <span className="font-medium">{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
