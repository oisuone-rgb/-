import React from 'react';
import { 
  UserCheck, 
  Leaf, 
  Package, 
  Palette, 
  Calculator, 
  Factory, 
  Truck 
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export interface StepItem {
  id: string;
  key: string;
  icon: React.ElementType;
}

export const SECTIONS: StepItem[] = [
  { id: 'section-customer', key: 'nav.step1', icon: UserCheck },
  { id: 'section-tea', key: 'nav.step2', icon: Leaf },
  { id: 'section-packaging', key: 'nav.step3', icon: Package },
  { id: 'section-custom', key: 'nav.step4', icon: Palette },
  { id: 'section-pricing', key: 'nav.step5', icon: Calculator },
  { id: 'section-production', key: 'nav.step6', icon: Factory },
  { id: 'section-logistics', key: 'nav.step7', icon: Truck },
];

interface StepProgressNavProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export const StepProgressNav: React.FC<StepProgressNavProps> = ({
  activeSection,
  onSelectSection
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white border-b border-stone-200 sticky top-[68px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
          {SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            const label = t(sec.key);
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSection(sec.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isActive ? 'bg-amber-300 text-emerald-950' : 'bg-stone-200 text-stone-600'
                }`}>
                  {idx + 1}
                </span>
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
