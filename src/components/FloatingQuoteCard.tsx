import React from 'react';
import { 
  Send, 
  FileText, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Cpu,
  Zap
} from 'lucide-react';
import { OrderPriceInfo } from '../types';
import { formatCurrency } from '../utils/pricing';
import { useLanguage } from '../i18n/LanguageContext';

interface FloatingQuoteCardProps {
  pricing: OrderPriceInfo;
  orderQuantity: number;
  boxModelName: string;
  teaItemsCount: number;
  onOpenPrintModal: () => void;
  onOpenAIAudit?: () => void;
  onSaveDraft: () => void;
  onSubmitOrder: () => void;
  isSubmitting?: boolean;
}

export const FloatingQuoteCard: React.FC<FloatingQuoteCardProps> = ({
  pricing,
  orderQuantity,
  boxModelName,
  teaItemsCount,
  onOpenPrintModal,
  onOpenAIAudit,
  onSaveDraft,
  onSubmitOrder,
  isSubmitting = false
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-6 sticky top-28 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600"></span>
          </span>
          <span className="text-xs font-bold text-slate-900 tracking-tight">
            {t('card.title')}
          </span>
        </div>
        <span className="text-[10px] font-mono font-medium text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/70">
          {t('card.formula')}
        </span>
      </div>

      {/* Main Big Price Display */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-5 rounded-2xl relative overflow-hidden shadow-md border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">{t('card.payable')}</div>
          <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-medium border border-cyan-400/20">
            实时含税核算
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300 tracking-tight mt-1.5 tabular-nums">
          {formatCurrency(pricing.totalAmount)}
        </div>
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800 text-xs">
          <span className="text-slate-400">{t('card.average')}</span>
          <span className="font-bold font-mono text-white text-sm tabular-nums">
            {formatCurrency(pricing.unitPrice)} <span className="text-[10px] font-normal text-slate-400">{t('price.perSet')}</span>
          </span>
        </div>
      </div>

      {/* AI Smart Audit Quick Strip */}
      {onOpenAIAudit && (
        <button
          type="button"
          onClick={onOpenAIAudit}
          className="w-full p-2.5 rounded-xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-teal-500/10 hover:from-teal-500/15 hover:to-cyan-500/15 border border-teal-600/30 text-teal-950 text-xs font-semibold flex items-center justify-between transition cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-teal-700 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-bold">AI 包装工程与成本智审</span>
          </div>
          <span className="text-[10px] text-teal-700 font-mono flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            <span>开始诊断</span>
            <ChevronRight className="w-3 h-3" />
          </span>
        </button>
      )}

      {/* Itemized Mini Summary */}
      <div className="space-y-2 text-xs text-stone-600 divide-y divide-stone-100/60 pt-0.5">
        <div className="flex justify-between items-center py-1">
          <span className="text-stone-600">{t('card.quantity')}</span>
          <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-[11px]">{orderQuantity} {t('price.setsUnit')}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-stone-600">{t('card.tea')}</span>
          <span className="font-mono text-stone-800 tabular-nums">{formatCurrency(pricing.teaAmount)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-stone-600">{t('card.box')}</span>
          <span className="font-mono text-stone-800 tabular-nums">{formatCurrency(pricing.boxAmount + pricing.handbagAmount)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-stone-600">{t('card.craft')}</span>
          <span className="font-mono text-stone-800 tabular-nums">{formatCurrency(pricing.craftAmount)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-stone-600">{t('card.design')}</span>
          <span className="font-mono text-stone-800 tabular-nums">{formatCurrency(pricing.designAmount)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-stone-600">{t('card.shipping')}</span>
          <span className="font-mono text-stone-800 tabular-nums">{formatCurrency(pricing.shippingAmount)}</span>
        </div>
        {pricing.discountAmount > 0 && (
          <div className="flex justify-between items-center text-emerald-800 font-semibold py-1.5 bg-emerald-50/50 px-2 rounded-lg border border-emerald-100">
            <span className="flex items-center gap-1 text-[11px]">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
              {t('card.discount')}
            </span>
            <span className="font-mono text-xs tabular-nums">- {formatCurrency(pricing.discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={onSubmitOrder}
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ring-1 ring-emerald-900/40"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? t('app.submitting') : t('card.submit')}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="py-2.5 px-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 hover:border-stone-400 text-stone-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600" />
            <span>{t('card.preview')}</span>
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="py-2.5 px-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 hover:border-stone-400 text-stone-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>{t('card.save')}</span>
          </button>
        </div>
      </div>

      {/* Trust & Guarantee points */}
      <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-600 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>{t('card.trust1')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>{t('card.trust2')}</span>
        </div>
      </div>
    </div>
  );
};
