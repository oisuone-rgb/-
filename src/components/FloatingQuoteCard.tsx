import React from 'react';
import { 
  Send, 
  FileText, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { OrderPriceInfo } from '../types';
import { formatCurrency } from '../utils/pricing';

interface FloatingQuoteCardProps {
  pricing: OrderPriceInfo;
  orderQuantity: number;
  boxModelName: string;
  teaItemsCount: number;
  onOpenPrintModal: () => void;
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
  onSaveDraft,
  onSubmitOrder,
  isSubmitting = false
}) => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-900/15 shadow-lg p-5 sticky top-28 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-ping" />
          <span className="text-xs font-bold text-stone-900 tracking-tight">
            实时自动计价总览
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          公式实时联动
        </span>
      </div>

      {/* Main Big Price Display */}
      <div className="bg-stone-900 text-white p-4 rounded-xl relative overflow-hidden">
        <div className="text-[11px] text-stone-300 font-medium">预估应付总金额 (含税运)</div>
        <div className="text-2xl font-bold font-mono text-amber-300 tracking-tight mt-0.5">
          {formatCurrency(pricing.totalAmount)}
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-800 text-xs">
          <span className="text-stone-300">折合单套单价：</span>
          <span className="font-bold font-mono text-white text-sm">
            {formatCurrency(pricing.unitPrice)} <span className="text-[10px] font-normal text-stone-300">/ 套</span>
          </span>
        </div>
      </div>

      {/* Itemized Mini Summary */}
      <div className="space-y-2 text-xs text-stone-600 pt-1">
        <div className="flex justify-between">
          <span className="text-stone-700">订购总数：</span>
          <span className="font-mono font-bold text-stone-900">{orderQuantity} 套</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-700">茶叶商品小计：</span>
          <span className="font-mono text-stone-900">{formatCurrency(pricing.teaAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-700">包装与手提袋：</span>
          <span className="font-mono text-stone-900">{formatCurrency(pricing.boxAmount + pricing.handbagAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-700">定制工艺与版费：</span>
          <span className="font-mono text-stone-900">{formatCurrency(pricing.craftAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-700">服务及设计费：</span>
          <span className="font-mono text-stone-900">{formatCurrency(pricing.designAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-700">物流干线运费：</span>
          <span className="font-mono text-stone-900">{formatCurrency(pricing.shippingAmount)}</span>
        </div>
        {pricing.discountAmount > 0 && (
          <div className="flex justify-between text-emerald-800 font-semibold pt-1 border-t border-stone-100">
            <span className="flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              阶梯批量立减：
            </span>
            <span className="font-mono">- {formatCurrency(pricing.discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={onSubmitOrder}
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-md shadow-emerald-900/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? '正在提交并生成工单...' : '确认规格 · 提交询价下单'}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="py-2 px-2.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>预览报价单</span>
          </button>
          <button
            type="button"
            onClick={onSaveDraft}
            className="py-2 px-2.5 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>保存为草稿</span>
          </button>
        </div>
      </div>

      {/* Trust & Guarantee points */}
      <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-700 space-y-1">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>支持对公银行转账、专票抵扣</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>确稿前 100% 确认设计无误再生产</span>
        </div>
      </div>
    </div>
  );
};
