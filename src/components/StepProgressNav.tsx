import React from 'react';
import { 
  UserCheck, 
  Leaf, 
  Package, 
  Palette, 
  Calculator, 
  Factory, 
  Truck,
  Check
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
  completedSections?: Record<string, boolean>;
}

export const StepProgressNav: React.FC<StepProgressNavProps> = ({
  activeSection,
  onSelectSection,
  completedSections = {}
}) => {
  const { t } = useLanguage();
  const completedCount = SECTIONS.filter(s => completedSections[s.id]).length;
  const progressPercent = Math.round((completedCount / SECTIONS.length) * 100);

  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-stone-200/90 sticky top-[68px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2 gap-4">
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {SECTIONS.map((sec, idx) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const isDone = completedSections[sec.id];
              const label = t(sec.key);

              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => onSelectSection(sec.id)}
                  className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : isDone
                      ? 'text-stone-700 hover:text-stone-950 hover:bg-stone-100/80 bg-stone-50/60'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold transition-transform group-hover:scale-105 ${
                    isActive 
                      ? 'bg-amber-300 text-emerald-950 font-bold' 
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800 font-bold'
                      : 'bg-stone-200 text-stone-700'
                  }`}>
                    {isDone && !isActive ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-200' : isDone ? 'text-emerald-700' : 'text-stone-700'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick step progress indicator */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0 pl-3 border-l border-stone-200/80 text-xs">
            <div className="text-right">
              <span className="text-[11px] text-stone-700 font-medium">配置进度</span>
              <span className="font-mono font-bold text-stone-800 ml-1.5">{completedCount}/{SECTIONS.length}</span>
            </div>
            <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div 
                className="h-full bg-emerald-700 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
