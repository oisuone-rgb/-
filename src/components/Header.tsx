import React from 'react';
import { 
  PackageCheck, 
  FileText, 
  Sparkles, 
  Send, 
  RotateCcw, 
  Printer, 
  GitBranch,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import { OrderWorkflowStatus } from '../types';
import { PRESET_TEMPLATES } from '../data/presets';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  orderNo: string;
  orderStatus: OrderWorkflowStatus;
  onOpenLifecycle: () => void;
  onOpenPrintModal: () => void;
  onSelectPreset: (presetId: string) => void;
  onSaveDraft: () => void;
  onSubmitOrder: () => void;
  isSubmitting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  orderNo,
  orderStatus,
  onOpenLifecycle,
  onOpenPrintModal,
  onSelectPreset,
  onSaveDraft,
  onSubmitOrder,
  isSubmitting = false
}) => {
  const { t } = useLanguage();

  const STATUS_MAP: Record<OrderWorkflowStatus, { label: string; color: string }> = {
    draft: { label: t('status.draft'), color: 'bg-slate-100 text-slate-700 border-slate-300' },
    pending_quote: { label: t('status.pending_quote'), color: 'bg-amber-50 text-amber-800 border-amber-300' },
    pending_confirm: { label: t('status.pending_confirm'), color: 'bg-blue-50 text-blue-800 border-blue-300' },
    pending_payment: { label: t('status.pending_payment'), color: 'bg-orange-50 text-orange-800 border-orange-300' },
    designing: { label: t('status.designing'), color: 'bg-purple-50 text-purple-800 border-purple-300' },
    pending_proof_confirm: { label: t('status.pending_proof_confirm'), color: 'bg-indigo-50 text-indigo-800 border-indigo-300' },
    pending_production: { label: t('status.pending_production'), color: 'bg-cyan-50 text-cyan-800 border-cyan-300' },
    in_production: { label: t('status.in_production'), color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
    quality_check: { label: t('status.quality_check'), color: 'bg-teal-50 text-teal-800 border-teal-300' },
    pending_shipping: { label: t('status.pending_shipping'), color: 'bg-blue-50 text-blue-800 border-blue-300' },
    shipped: { label: t('status.shipped'), color: 'bg-sky-50 text-sky-800 border-sky-300' },
    completed: { label: t('status.completed'), color: 'bg-emerald-100 text-emerald-900 border-emerald-400' }
  };

  const currentStatus = STATUS_MAP[orderStatus] || STATUS_MAP.pending_quote;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Brand & Order Identification */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-200 flex items-center justify-center font-bold shadow-sm shadow-emerald-900/20 shrink-0">
              <span className="text-lg tracking-wider">格</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 id="header-app-title" className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                  {t('app.title')}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-900 border-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-700" />
                  {t('app.badge.b2b')}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-stone-700 mt-0.5 flex-wrap">
                <span className="font-mono text-stone-700">{t('app.orderNo')}: <strong className="text-stone-800 font-semibold">{orderNo}</strong></span>
                <span className="text-stone-700">|</span>
                <span className="flex items-center gap-1">
                  {t('app.currentStatus')}:
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${currentStatus.color}`}>
                    {currentStatus.label}
                  </span>
                </span>
                <button
                  onClick={onOpenLifecycle}
                  className="inline-flex items-center text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer ml-1"
                >
                  <GitBranch className="w-3.5 h-3.5 mr-0.5" />
                  {t('app.lifecycle')}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions, Language Switcher & Preset Selector */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Multi-language switcher */}
            <LanguageSwitcher />

            {/* Presets dropdown */}
            <div className="relative group">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{t('app.loadPreset')}</span>
              </button>
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-700 uppercase tracking-wider">
                  {t('app.presetTitle')}
                </div>
                {PRESET_TEMPLATES.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPreset(p.id)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50/70 transition flex flex-col gap-0.5 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone-800">{p.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold">{p.badge}</span>
                    </div>
                    <span className="text-[11px] text-stone-700 line-clamp-1">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Print quotation sheet */}
            <button
              type="button"
              onClick={onOpenPrintModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition cursor-pointer"
              title={t('app.officialQuotation')}
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">{t('app.officialQuotation')}</span>
            </button>

            {/* Save draft */}
            <button
              type="button"
              onClick={onSaveDraft}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              <span>{t('app.saveDraft')}</span>
            </button>

            {/* Submit inquiry */}
            <button
              type="button"
              onClick={onSubmitOrder}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold shadow-sm shadow-emerald-900/20 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? t('app.submitting') : t('app.submitInquiry')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
