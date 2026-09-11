import React from 'react';
import { 
  Factory, 
  Clock, 
  Calendar, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  ProductionInfo, 
  ProductionType, 
  UrgencyLevel, 
  SampleStatus 
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getLocalizedProductionTypes,
  getLocalizedUrgencyLevels
} from '../i18n/optionsData';

interface ProductionSectionProps {
  data: ProductionInfo;
  orderQuantity: number;
  onChange: (updated: Partial<ProductionInfo>) => void;
}

export const ProductionSection: React.FC<ProductionSectionProps> = ({
  data,
  orderQuantity,
  onChange
}) => {
  const { t } = useLanguage();

  const PRODUCTION_TYPES = getLocalizedProductionTypes(t);
  const URGENCY_LEVELS = getLocalizedUrgencyLevels(t);

  const SAMPLE_STATUS_OPTIONS: { key: SampleStatus; label: string }[] = [
    { key: 'sampling', label: t('prod.status.sampling', '实物样品制作中 (约2-3天)') },
    { key: 'pending_confirm', label: t('prod.status.pending', '样品待客户核验签字') },
    { key: 'confirmed', label: t('prod.status.confirmed', '打样已确认合格 (作为大货检验基准)') },
    { key: 'none', label: t('prod.status.none', '暂不打样') },
  ];

  return (
    <div id="section-production" className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            6
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              {t('prod.title', '生产与排产排期 (标准交付周期管理)')}
            </h2>
            <p className="text-xs text-stone-700">
              {t('prod.sub', '选择工期紧迫度、实物样品封样要求与生产基地生产示范线')}
            </p>
          </div>
        </div>
      </div>

      {/* 1. 生产类型选择 */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-stone-700 mb-2">
          {t('prod.type', '生产模式类型')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRODUCTION_TYPES.map(pt => {
            const isSelected = data.productionType === pt.key;
            return (
              <button
                key={pt.key}
                type="button"
                onClick={() => onChange({ 
                  productionType: pt.key,
                  estimatedProductionDays: pt.key === 'spot' ? 3 : pt.key === 'semi_custom' ? 7 : 14
                })}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-700'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-stone-900 leading-snug">{pt.title}</span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-relaxed mb-2 line-clamp-2">{pt.desc}</p>
                </div>
                <div className="text-[11px] font-mono text-emerald-800 font-semibold pt-1.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="whitespace-nowrap">{t('prod.estLeadTime', '预计生产周期:')}</span>
                  <span className="whitespace-nowrap">{pt.days}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 打样管理 (Proofing & Sample Parameters) */}
      <div className="mb-6 p-4 rounded-xl border border-stone-200 bg-stone-50/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-xs font-bold text-stone-900">{t('prod.sample', '是否需要产前实物打样')}</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.needSample}
              onChange={(e) => onChange({ 
                needSample: e.target.checked,
                sampleStatus: e.target.checked ? 'sampling' : 'none'
              })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
          </label>
        </div>

        {data.needSample ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2 border-t border-stone-200 text-xs animate-in fade-in">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">
                {t('prod.sampleQty', '打样数量 (套)')}
              </label>
              <select
                value={data.sampleQuantity}
                onChange={(e) => onChange({ sampleQuantity: Number(e.target.value) || 1 })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              >
                <option value={1}>1 {t('common.sets', '套')} ({t('prod.sample1Note', '常规核对质感与文案')})</option>
                <option value={2}>2 {t('common.sets', '套')} ({t('prod.sample2Note', '1套留厂封样，1套寄客户')})</option>
                <option value={3}>3 {t('common.sets', '套')} ({t('prod.sample3Note', '包含茶罐装样')})</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">
                {t('prod.sampleStatus', '打样状态')}
              </label>
              <select
                value={data.sampleStatus}
                onChange={(e) => onChange({ sampleStatus: e.target.value as SampleStatus })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-medium"
              >
                {SAMPLE_STATUS_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="font-semibold text-emerald-900 block mb-0.5">{t('prod.guaranteeTitle', '封样质保承诺：')}</span>
              <span className="text-[10px] text-emerald-800 leading-snug block">
                {t('prod.guaranteeDesc', '大货产品色差在国际标准 ΔE<2 以内，烫金及套位精度公差控制在 ±0.3mm。')}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-700">
            {t('prod.noSampleNote', '免实物打样（客户直接根据 3D 电子效果图与数码菲林确稿直接安排大货投产，交期可提速 3-4 天）')}
          </p>
        )}
      </div>

      {/* 3. 生产工期、紧急程度与最晚交付日期 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Urgency */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            {t('prod.urgency', '工期紧迫程度')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {URGENCY_LEVELS.map(u => {
              const isSelected = data.urgency === u.key;
              return (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => onChange({ urgency: u.key })}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `${u.color} ring-1 ring-emerald-700 shadow-2xs font-semibold`
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs font-bold leading-snug">{u.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-stone-200/70 text-stone-700 whitespace-nowrap shrink-0">
                      {u.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-700 leading-tight">{u.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Latest Delivery Date */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 whitespace-nowrap">
            {t('prod.latestDate', '最晚交付日期 (必须送达红线日)')}
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-700 absolute left-3 top-2.5 shrink-0" />
            <input
              type="date"
              value={data.latestDeliveryDate}
              onChange={(e) => onChange({ latestDeliveryDate: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">{t('prod.deadlineDesc', '从设计确稿下单时间算起，逾期有赔付保障')}</p>
        </div>

        {/* Production Days estimate */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 whitespace-nowrap">
            {t('prod.estimatedDays', '预计生产周期 (天)')}
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-stone-700 absolute left-3 top-2.5 shrink-0" />
            <input
              type="number"
              min={1}
              max={60}
              value={data.estimatedProductionDays}
              onChange={(e) => onChange({ estimatedProductionDays: Number(e.target.value) || 7 })}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">{t('prod.scheduleControls', '包含制版、烫金、人工组装及包装质检')}</p>
        </div>

        {/* Assigned Factory */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5 whitespace-nowrap">
            {t('prod.factory', '分配工坊 / 示范产线')}
          </label>
          <div className="relative">
            <Factory className="w-4 h-4 text-stone-700 absolute left-3 top-2.5 shrink-0" />
            <input
              type="text"
              value={data.factorySupplier}
              onChange={(e) => onChange({ factorySupplier: e.target.value })}
              placeholder={t('prod.baseValue', '浙江省温州市龙港新城格领包装科技示范产线')}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">{t('prod.scCert', '具备食品级包装生产许可证 (SC/QS认证)')}</p>
        </div>
      </div>
    </div>
  );
};
