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

interface ProductionSectionProps {
  data: ProductionInfo;
  orderQuantity: number;
  onChange: (updated: Partial<ProductionInfo>) => void;
}

const PRODUCTION_TYPES: { key: ProductionType; title: string; desc: string; days: string }[] = [
  { key: 'spot', title: '现货产品 (闪电发货)', desc: '仓库已有现货礼盒，无需开模或印刷，最快1-3天安排发货', days: '1 ~ 3 个工作日' },
  { key: 'semi_custom', title: '半定制 (现货加印Logo/文案)', desc: '采用精选库存高品质盒身，烫印客户指定Logo与腰封祝福语', days: '5 ~ 7 个工作日' },
  { key: 'full_custom', title: '全定制 (从零开模专属生产)', desc: '根据客户要求全新设计、打样、制版、印刷模切与手工裱糊', days: '12 ~ 18 个工作日' },
];

const URGENCY_LEVELS: { key: UrgencyLevel; label: string; desc: string; badge: string; color: string }[] = [
  { key: 'normal', label: '正常排产', desc: '按车间标准工时流水排程', badge: '标准工期', color: 'border-stone-200 bg-white' },
  { key: 'urgent', label: '加急排产 (+12%加急费)', desc: '产线插单优先切纸、模切、烫印', badge: '工期缩短30%', color: 'border-amber-300 bg-amber-50/50 text-amber-900' },
  { key: 'express', label: '特急专班 (+25%特急费)', desc: '24小时双班倒开机，专车押运', badge: '工期缩短50%', color: 'border-red-300 bg-red-50/60 text-red-900' },
];

const SAMPLE_STATUS_MAP: Record<SampleStatus, { label: string; desc: string }> = {
  none: { label: '未打样 / 免打样', desc: '客户直接根据3D电子稿安排量产' },
  sampling: { label: '实物样品制作中', desc: '数码打样机制作实物盒身并寄送' },
  pending_confirm: { label: '样品待客户核验', desc: '样品已寄抵，等待客户核对手感与颜色' },
  confirmed: { label: '打样已确认合格', desc: '客户已确认首样，作为大货封样标准' },
};

export const ProductionSection: React.FC<ProductionSectionProps> = ({
  data,
  orderQuantity,
  onChange
}) => {
  return (
    <div id="section-production" className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            6
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              生产与打样信息 (排产周期与工期控制)
            </h2>
            <p className="text-xs text-stone-700">明确生产类型、实物打样标准、紧急程度与最晚交付红线时间</p>
          </div>
        </div>
      </div>

      {/* 1. 生产类型选择 */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-stone-700 mb-2">
          生产类型 (决定起订门槛与交期)
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
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900">{pt.title}</span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-relaxed mb-2">{pt.desc}</p>
                </div>
                <div className="text-[11px] font-mono text-emerald-800 font-semibold pt-1 border-t border-stone-100 flex items-center justify-between">
                  <span>预估生产周期:</span>
                  <span>{pt.days}</span>
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
            <Layers className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-stone-900">实物打样与封样要求</span>
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
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                打样件数 (套)
              </label>
              <select
                value={data.sampleQuantity}
                onChange={(e) => onChange({ sampleQuantity: Number(e.target.value) || 1 })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              >
                <option value={1}>1 套 (常规核对质感与文案)</option>
                <option value={2}>2 套 (1套留厂封样，1套寄客户)</option>
                <option value={3}>3 套 (包含茶罐装样)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                打样确认状态
              </label>
              <select
                value={data.sampleStatus}
                onChange={(e) => onChange({ sampleStatus: e.target.value as SampleStatus })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-medium"
              >
                <option value="sampling">实物样品制作中 (约2-3天)</option>
                <option value="pending_confirm">样品待客户核验签字</option>
                <option value="confirmed">打样已确认合格 (作为大货检验基准)</option>
                <option value="none">暂不打样</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
              <span className="font-semibold text-emerald-900 block mb-0.5">封样质保承诺：</span>
              <span className="text-[10px] text-emerald-800">
                大货产品色差在国际标准 ΔE&lt;2 以内，烫金及套位精度公差控制在 ±0.3mm。
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-700">
            免实物打样（客户直接根据 3D 电子效果图与数码菲林确稿直接安排大货投产，交期可提速 3-4 天）
          </p>
        )}
      </div>

      {/* 3. 生产工期、紧急程度与最晚交付日期 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Urgency */}
        <div className="lg:col-span-3">
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            生产紧急程度 (交期紧迫度)
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
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{u.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-stone-200/70 text-stone-700">
                      {u.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-700">{u.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Latest Delivery Date */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            最晚交付日期 (必须送达红线日)
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-700 absolute left-3 top-2.5" />
            <input
              type="date"
              value={data.latestDeliveryDate}
              onChange={(e) => onChange({ latestDeliveryDate: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">从设计确稿下单时间算起，逾期有赔付保障</p>
        </div>

        {/* Production Days estimate */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            预计生产周期 (天)
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-stone-700 absolute left-3 top-2.5" />
            <input
              type="number"
              min={1}
              max={60}
              value={data.estimatedProductionDays}
              onChange={(e) => onChange({ estimatedProductionDays: Number(e.target.value) || 7 })}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white font-mono"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">包含制版、烫金、人工组装及包装质检</p>
        </div>

        {/* Assigned Factory */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            分配工坊 / 示范产线
          </label>
          <div className="relative">
            <Factory className="w-4 h-4 text-stone-700 absolute left-3 top-2.5" />
            <input
              type="text"
              value={data.factorySupplier}
              onChange={(e) => onChange({ factorySupplier: e.target.value })}
              placeholder="例如：浙江省温州市龙港新城格领包装科技示范产线"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 bg-white"
            />
          </div>
          <p className="text-[11px] text-stone-700 mt-1">具备食品级包装生产许可证 (SC/QS认证)</p>
        </div>
      </div>
    </div>
  );
};
