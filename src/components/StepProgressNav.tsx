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

export interface StepItem {
  id: string;
  title: string;
  shortTitle: string;
  icon: React.ElementType;
  badge?: string;
}

export const SECTIONS: StepItem[] = [
  { id: 'section-customer', title: '1. 客户基本信息', shortTitle: '客户信息', icon: UserCheck },
  { id: 'section-tea', title: '2. 产品基础信息', shortTitle: '茶叶产品', icon: Leaf },
  { id: 'section-packaging', title: '3. 礼盒包装信息', shortTitle: '礼盒包装', icon: Package },
  { id: 'section-custom', title: '4. 定制设计信息', shortTitle: 'Logo与设计', icon: Palette },
  { id: 'section-pricing', title: '5. 订单数量与价格', shortTitle: '数量价格', icon: Calculator },
  { id: 'section-production', title: '6. 生产与打样', shortTitle: '生产打样', icon: Factory },
  { id: 'section-logistics', title: '7. 收货与物流', shortTitle: '物流配送', icon: Truck },
];

interface StepProgressNavProps {
  activeSection: string;
  onSelectSection: (id: string) => void;
}

export const StepProgressNav: React.FC<StepProgressNavProps> = ({
  activeSection,
  onSelectSection
}) => {
  return (
    <div className="bg-white border-b border-stone-200 sticky top-[68px] z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar">
          {SECTIONS.map((sec, idx) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
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
                <span className="hidden sm:inline">{sec.title}</span>
                <span className="sm:hidden">{sec.shortTitle}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
