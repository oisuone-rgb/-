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
    <div id="section-production" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono shrink-0">
            6
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {t('prod.title', '生产与排产排期 (标准交付周期管理)')}
            </h2>
            <p className="text-xs text-stone-700 mt-0.5">
              {t('prod.sub', '选择工期紧迫度、实物样品封样要求与生产基地生产示范线')}
            </p>
          </div>
        </div>
      </div>

      {/* 1. 生产类型选择 */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-stone-900 mb-2.5">
          {t('prod.type', '生产模式类型')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
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
                className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20 shadow-xs'
                    : 'border-stone-200/90 hover:border-stone-300 bg-stone-50/40 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold text-stone-900 leading-snug">{pt.title}</span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed mb-3 line-clamp-2">{pt.desc}</p>
                </div>
                <div className="text-xs font-mono text-emerald-900 font-bold pt-2 border-t border-stone-200/70 flex items-center justify-between">
                  <span className="whitespace-nowrap text-stone-700 text-[11px] font-normal">{t('prod.estLeadTime', '预计生产周期:')}</span>
                  <span className="whitespace-nowrap bg-white px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">{pt.days}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 打样管理 (Proofing & Sample Parameters) */}
      <div className="mb-6 p-4.5 sm:p-5 rounded-2xl border border-stone-200/90 bg-stone-50/40 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-800 shrink-0" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-3 border-t border-stone-200/80 text-xs animate-in fade-in">
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
                {t('prod.sampleQty', '打样数量 (套)')}
              </label>
              <select
                value={data.sampleQuantity}
                onChange={(e) => onChange({ sampleQuantity: Number(e.target.value) || 1 })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              >
                <option value={1}>1 {t('common.sets', '套')} ({t('prod.sample1Note', '常规核对质感与文案')})</option>
                <option value={2}>2 {t('common.sets', '套')} ({t('prod.sample2Note', '1套留厂封样，1套寄客户')})</option>
                <option value={3}>3 {t('common.sets', '套')} ({t('prod.sample3Note', '包含茶罐装样')})</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
                {t('prod.sampleStatus', '打样状态')}
              </label>
              <select
                value={data.sampleStatus}
                onChange={(e) => onChange({ sampleStatus: e.target.value as SampleStatus })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-semibold text-stone-900 shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              >
                {SAMPLE_STATUS_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/90 shadow-2xs">
              <span className="font-bold text-emerald-950 block mb-1">{t('prod.guaranteeTitle', '封样质保承诺：')}</span>
              <span className="text-[11px] text-emerald-900 leading-relaxed block font-medium">
                {t('prod.guaranteeDesc', '大货产品色差在国际标准 ΔE<2 以内，烫金及套位精度公差控制在 ±0.3mm。')}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-700 leading-relaxed">
            {t('prod.noSampleNote', '免实物打样（客户直接根据 3D 电子效果图与数码菲林确稿直接安排大货投产，交期可提速 3-4 天）')}
          </p>
        )}
      </div>

      {/* 3. 生产工期、紧急程度与最晚交付日期 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {/* Urgency */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-bold text-stone-900 mb-2.5">
            {t('prod.urgency', '工期紧迫程度')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {URGENCY_LEVELS.map(u => {
              const isSelected = data.urgency === u.key;
              return (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => onChange({ urgency: u.key })}
                  className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between shadow-2xs ${
                    isSelected
                      ? `${u.color} ring-2 ring-emerald-700/20 shadow-xs font-bold`
                      : 'border-stone-200/90 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold leading-snug">{u.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-stone-200/70 text-stone-800 whitespace-nowrap shrink-0">
                      {u.badge}
                    </span>
                  </div>
                  <span className="text-xs text-stone-700 leading-relaxed">{u.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Latest Delivery Date */}
        <div>
          <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
            {t('prod.latestDate', '最晚交付日期 (必须送达红线日)')}
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-700 absolute left-3.5 top-3 shrink-0" />
            <input
              type="date"
              value={data.latestDeliveryDate}
              onChange={(e) => onChange({ latestDeliveryDate: e.target.value })}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white font-mono shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">{t('prod.deadlineDesc', '从设计确稿下单时间算起，逾期有赔付保障')}</p>
        </div>

        {/* Production Days estimate */}
        <div>
          <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
            {t('prod.estimatedDays', '预计生产周期 (天)')}
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-stone-700 absolute left-3.5 top-3 shrink-0" />
            <input
              type="number"
              min={1}
              max={60}
              value={data.estimatedProductionDays}
              onChange={(e) => onChange({ estimatedProductionDays: Number(e.target.value) || 7 })}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white font-mono shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">{t('prod.scheduleControls', '包含制版、烫金、人工组装及包装质检')}</p>
        </div>

        {/* Assigned Factory */}
        <div>
          <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
            {t('prod.factory', '分配工坊 / 示范产线')}
          </label>
          <div className="relative">
            <Factory className="w-4 h-4 text-stone-700 absolute left-3.5 top-3 shrink-0" />
            <input
              type="text"
              value={data.factorySupplier}
              onChange={(e) => onChange({ factorySupplier: e.target.value })}
              placeholder={t('prod.baseValue', '浙江省温州市龙港新城格领包装科技示范产线')}
              className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">{t('prod.scCert', '具备食品级包装生产许可证 (SC/QS认证)')}</p>
        </div>
      </div>
    </div>
  );
};
