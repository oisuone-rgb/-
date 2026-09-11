import React from 'react';
import { 
  Calculator, 
  HelpCircle, 
  Percent, 
  TrendingDown, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Cpu,
  Zap 
} from 'lucide-react';
import { OrderPriceInfo, OveragePolicy } from '../types';
import { formatCurrency, getVolumeDiscountRate } from '../utils/pricing';
import { useLanguage } from '../i18n/LanguageContext';

interface PricingSectionProps {
  data: OrderPriceInfo;
  onChange: (updated: Partial<OrderPriceInfo>) => void;
  onQuantityChange: (qty: number) => void;
  onOpenAIAudit?: () => void;
}

const QUANTITY_TIERS = [50, 100, 200, 300, 500, 1000, 2000];

export const PricingSection: React.FC<PricingSectionProps> = ({
  data,
  onChange,
  onQuantityChange,
  onOpenAIAudit
}) => {
  const { t } = useLanguage();
  const currentDiscountRate = getVolumeDiscountRate(data.quantity);

  const OVERAGE_POLICIES = [
    {
      key: 'accept_3',
      title: t('price.overage.3', '接受 ±3% 短溢 (推荐)'),
      desc: t('price.overage.3desc', '按实际合格入库数量结算多退少补，排产更顺畅')
    },
    {
      key: 'accept_5',
      title: t('price.overage.5', '接受 ±5% 短溢 (大单优选)'),
      desc: t('price.overage.5desc', '大批量采购损耗容差大，单价成本最优惠')
    },
    {
      key: 'reject',
      title: t('price.overage.reject', '严格按数，不接受短溢'),
      desc: t('price.overage.rejectdesc', '数量一丝不差，工厂需加大富余备损生产')
    }
  ];

  return (
    <div id="section-pricing" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-stone-100 gap-2.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono shrink-0">
            5
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {t('price.title', '订单数量与价格核算 (实时自动计算引擎)')}
            </h2>
            <p className="text-xs text-stone-700 mt-0.5">
              {t('price.sub', '根据盒型、材质、工艺、装配茶叶与起订量阶梯实时联动核算')}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-2xs whitespace-nowrap self-start sm:self-auto">
          {t('card.formula', '无需销售人工计算 · 实时联动')}
        </span>
      </div>

      {/* 1. 核心工业字段：是否接受短溢 (Overage Policy) */}
      <div className="mb-6 p-4.5 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <span className="text-rose-500 font-bold">*</span>
            <span>{t('price.overageTitle', '印刷行业核心字段：是否接受短溢装？')}</span>
          </label>
          <span className="text-xs text-amber-900 flex items-center gap-1.5 whitespace-nowrap font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>{t('price.overageHint', '印刷开机损耗与尾数行规')}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {OVERAGE_POLICIES.map(policy => {
            const isSelected = data.acceptOverage === policy.key;
            return (
              <button
                key={policy.key}
                type="button"
                onClick={() => onChange({ acceptOverage: policy.key as OveragePolicy })}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'border-emerald-700 bg-white ring-2 ring-emerald-700/20 font-medium'
                    : 'border-amber-200/80 bg-white/80 hover:bg-white text-stone-700'
                }`}
              >
                <div className="text-xs font-bold text-stone-900 mb-1 leading-snug">{policy.title}</div>
                <div className="text-[11px] text-stone-700 leading-snug">{policy.desc}</div>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-stone-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-amber-200/60">
          <strong className="text-stone-900 font-bold">{t('price.industryExplain', '行业说明：')}</strong>{t('price.overageLongExplain', '定制礼盒涉及印刷、烫金、UV、模切及手工裱糊多道工序，各环节存在正常机器调试损耗。选择允许±3%短溢可避免因零星废品导致交期拖延，最后结算按实收件数多退少补。')}
        </p>
      </div>

      {/* 2. 购买数量与阶梯选择器 */}
      <div className="mb-6 p-4.5 sm:p-5 rounded-2xl border border-stone-200/90 bg-stone-50/40 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-2">
          <label className="text-xs font-bold text-stone-900">
            {t('price.orderQty', '订购总数量 (套)')}
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenAIAudit && (
              <button
                type="button"
                onClick={onOpenAIAudit}
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/80 flex items-center gap-1 transition cursor-pointer active:scale-95 group shadow-2xs"
                title="查看不同批量下的开机费分摊效益及生产交期"
              >
                <Cpu className="w-3.5 h-3.5 text-teal-600 group-hover:rotate-12 transition-transform" />
                <span>AI 成本智审</span>
              </button>
            )}
            <span className="text-xs text-stone-700 font-medium">{t('price.discountApplied', '当前数量折扣率:')}</span>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100 border border-emerald-300/80 px-2.5 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shadow-2xs">
              <Percent className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
              {Math.round(currentDiscountRate * 100)}% {t('price.stepDiscount', '阶梯立减')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center mb-3.5">
          <div className="sm:col-span-5">
            <div className="relative">
              <input
                type="number"
                min={10}
                max={50000}
                step={10}
                value={data.quantity}
                onChange={(e) => onQuantityChange(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 text-base font-bold text-stone-900 rounded-xl border border-stone-300 bg-white font-mono shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 pr-24"
              />
              <span className="absolute right-3.5 top-3 text-xs text-stone-700 font-bold whitespace-nowrap">
                {t('common.setsUnit', '套 (礼盒+茶叶)')}
              </span>
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="sm:col-span-7 flex items-center gap-1.5 flex-wrap">
            {QUANTITY_TIERS.map(q => (
              <button
                key={q}
                type="button"
                onClick={() => onQuantityChange(q)}
                className={`px-3 py-2 text-xs rounded-xl border transition font-mono cursor-pointer whitespace-nowrap shadow-2xs ${
                  data.quantity === q
                    ? 'bg-emerald-800 text-white border-emerald-800 font-bold shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-800 font-medium'
                }`}
              >
                {q} {t('common.sets', '套')}
              </button>
            ))}
          </div>
        </div>

        {/* Tier discount tracker bar */}
        <div className="p-3 rounded-xl bg-white border border-stone-200/90 text-xs text-stone-700 flex items-center justify-between flex-wrap gap-2 shadow-2xs">
          <span className="font-bold text-stone-900 whitespace-nowrap">{t('price.tierThreshold', '阶梯优惠门槛：')}</span>
          <span className={data.quantity >= 100 ? 'text-emerald-800 font-bold whitespace-nowrap' : 'text-stone-700 whitespace-nowrap'}>100 {t('common.sets', '套')} (-4%)</span>
          <span className="text-stone-300">→</span>
          <span className={data.quantity >= 300 ? 'text-emerald-800 font-bold whitespace-nowrap' : 'text-stone-700 whitespace-nowrap'}>300 {t('common.sets', '套')} (-8%)</span>
          <span className="text-stone-300">→</span>
          <span className={data.quantity >= 500 ? 'text-emerald-800 font-bold whitespace-nowrap' : 'text-stone-700 whitespace-nowrap'}>500 {t('common.sets', '套')} (-12%)</span>
          <span className="text-stone-300">→</span>
          <span className={data.quantity >= 1000 ? 'text-emerald-800 font-bold whitespace-nowrap' : 'text-stone-700 whitespace-nowrap'}>1000 {t('common.sets', '套')} (-18%)</span>
          <span className="text-stone-300">→</span>
          <span className={data.quantity >= 2000 ? 'text-emerald-800 font-bold whitespace-nowrap' : 'text-stone-700 whitespace-nowrap'}>2000+ {t('common.sets', '套')} (-22%)</span>
        </div>
      </div>

      {/* 3. 价格明细拆解看板 (Automatic Breakdown) */}
      <div className="mb-6 rounded-2xl border border-emerald-900/20 overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white p-4.5 sm:p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xs text-amber-300/90 font-bold uppercase tracking-wider">{t('price.realtimeBill', '实时核算对账单')}</div>
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white mt-0.5">
              {formatCurrency(data.totalAmount)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-emerald-200/90 font-medium">{t('price.avgUnitPrice', '折合综合单价')}</div>
            <div className="text-lg sm:text-xl font-bold font-mono text-amber-300 mt-0.5">
              {formatCurrency(data.unitPrice)} <span className="text-xs font-normal text-white/80">/ {t('common.set', '套')}</span>
            </div>
          </div>
        </div>

        {/* Detailed Itemized Table */}
        <div className="p-4 sm:p-5 bg-stone-50/60">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-4">
            <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
              <span className="text-xs font-bold text-stone-700 block mb-1">{t('price.breakdown.tea', '1. 商品茶叶金额')}</span>
              <div className="text-base font-bold font-mono text-stone-900">{formatCurrency(data.teaAmount)}</div>
              <span className="text-[11px] text-stone-700 block mt-0.5">{t('price.breakdown.teaSub', '含茶叶原料、密封罐包装')}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
              <span className="text-xs font-bold text-stone-700 block mb-1">{t('price.breakdown.box', '2. 包装盒子金额 (含外箱)')}</span>
              <div className="text-base font-bold font-mono text-stone-900">{formatCurrency(data.boxAmount)}</div>
              <span className="text-[11px] text-stone-700 block mt-0.5">{t('price.breakdown.boxSub', '灰板盒身 + 内托 + 运输外箱')}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
              <span className="text-xs font-bold text-stone-700 block mb-1">{t('price.breakdown.handbag', '3. 配套手提袋金额')}</span>
              <div className="text-base font-bold font-mono text-stone-900">{formatCurrency(data.handbagAmount)}</div>
              <span className="text-[11px] text-stone-700 block mt-0.5">{t('price.breakdown.handbagSub', '加厚特种白卡 + 专用丝带提手')}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
              <span className="text-xs font-bold text-stone-700 block mb-1">{t('price.breakdown.craft', '4. 定制工艺费 (制版+烫印)')}</span>
              <div className="text-base font-bold font-mono text-stone-900">{formatCurrency(data.craftAmount)}</div>
              <span className="text-[11px] text-stone-700 block mt-0.5">{t('price.breakdown.craftSub', '表面工艺版费 + Logo烫金加工工时')}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
              <span className="text-xs font-bold text-stone-700 block mb-1">{t('price.breakdown.design', '5. 设计服务与排版费')}</span>
              <div className="text-base font-bold font-mono text-stone-900">{formatCurrency(data.designAmount)}</div>
              <span className="text-[11px] text-stone-700 block mt-0.5">{t('price.breakdown.designSub', '基础排版免费 / 专属定制设计')}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200/90 shadow-2xs">
              <span className="text-xs font-bold text-stone-700 block mb-1">{t('price.breakdown.shipping', '6. 物流运费预估')}</span>
              <div className="text-base font-bold font-mono text-stone-900">{formatCurrency(data.shippingAmount)}</div>
              <span className="text-[11px] text-stone-700 block mt-0.5">{t('price.breakdown.shippingSub', '按重量约')} {(data.quantity * 1.2).toFixed(0)}kg {t('price.breakdown.shippingCalc', '测算')}</span>
            </div>
          </div>

          {/* Discount and Equation */}
          <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 flex items-center justify-between flex-wrap gap-2 text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-emerald-950">
              <TrendingDown className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-bold">{t('price.enjoyDiscount', '已享受阶梯批量采购优惠：')}</span>
              <span className="font-bold text-emerald-800 font-mono text-base">
                - {formatCurrency(data.discountAmount)}
              </span>
            </div>
            <div className="text-xs text-emerald-900 font-medium">
              {t('price.discountAppliedAuto', '系统根据订购数量自动套用最优惠折扣系数')}
            </div>
          </div>
        </div>
      </div>

      {/* Transparent formula description */}
      <div className="p-3.5 bg-stone-100/80 rounded-xl text-xs text-stone-700 font-mono flex items-center justify-between flex-wrap gap-2 border border-stone-200/70">
        <span className="whitespace-nowrap font-bold text-stone-900">{t('card.formulaVerify', '自动计算公式验证：')}</span>
        <span className="break-all text-[11px]">
          {formatCurrency(data.teaAmount)} ({t('price.teaWord', '茶')}) + {formatCurrency(data.boxAmount + data.handbagAmount)} ({t('price.boxWord', '盒袋')}) + {formatCurrency(data.craftAmount)} ({t('price.craftWord', '工艺')}) + {formatCurrency(data.designAmount)} ({t('price.designWord', '设计')}) + {formatCurrency(data.shippingAmount)} ({t('price.shippingWord', '运费')}) - {formatCurrency(data.discountAmount)} ({t('price.discountWord', '优惠')}) = <strong className="text-emerald-950 text-xs">{formatCurrency(data.totalAmount)}</strong>
        </span>
      </div>
    </div>
  );
};
