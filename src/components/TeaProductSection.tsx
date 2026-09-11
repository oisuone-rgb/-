import React from 'react';
import { Leaf, Plus, Trash2, Check, Sparkles, Scale, Info } from 'lucide-react';
import { TeaProductInfo, TeaProductItem, TeaCategory } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface TeaProductSectionProps {
  data: TeaProductInfo;
  onChange: (updated: Partial<TeaProductInfo>) => void;
}

export const TeaProductSection: React.FC<TeaProductSectionProps> = ({
  data,
  onChange
}) => {
  const { t } = useLanguage();

  const CATEGORY_MAP: Record<TeaCategory, { label: string; color: string; bg: string }> = {
    green: { label: t('tea.category.green', '绿茶 (西湖龙井/安吉白茶/碧螺春)'), color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    black: { label: t('tea.category.black', '红茶 (金骏眉/正山小种/祁门红茶)'), color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
    white: { label: t('tea.category.white', '白茶 (福鼎白毫银针/白牡丹/老白茶)'), color: 'text-stone-700', bg: 'bg-stone-50 border-stone-200' },
    puer: { label: t('tea.category.puer', '普洱茶 (熟普金芽/生普古树茶饼)'), color: 'text-yellow-900', bg: 'bg-yellow-50 border-yellow-200' },
    oolong: { label: t('tea.category.oolong', '乌龙茶 (大红袍/铁观音/鸭屎香凤凰单丛)'), color: 'text-orange-800', bg: 'bg-orange-50 border-orange-200' },
    other: { label: t('tea.category.other', '其他 / 特调茶 (茉莉花茶/柑普/白桃乌龙)'), color: 'text-purple-800', bg: 'bg-purple-50 border-purple-200' },
  };

  const POPULAR_TEAS = [
    { name: t('tea.quick.longjing', '西湖龙井（明前特级）'), category: 'green' as TeaCategory, weight: 125, price: 68 },
    { name: t('tea.quick.dahongpao', '武夷大红袍（正岩肉桂）'), category: 'oolong' as TeaCategory, weight: 125, price: 58 },
    { name: t('tea.quick.jinjinmei', '武夷金骏眉（桐木关特级）'), category: 'black' as TeaCategory, weight: 100, price: 75 },
    { name: t('tea.quick.baihaoyinzhen', '福鼎白茶（五年陈寿眉/银针）'), category: 'white' as TeaCategory, weight: 150, price: 52 },
    { name: t('tea.quick.puer', '云南勐海普洱熟茶金芽'), category: 'puer' as TeaCategory, weight: 150, price: 46 },
    { name: t('tea.quick.tieguanyin', '安溪铁观音（清香型特选）'), category: 'oolong' as TeaCategory, weight: 125, price: 45 },
  ];

  const handleAddItem = () => {
    const newItem: TeaProductItem = {
      id: 'tea-' + Date.now(),
      teaName: t('tea.quick.longjing', '西湖龙井（特级）'),
      category: 'green',
      spec: t('tea.spec.octagon', '精装金属密封罐'),
      unitWeight: 125,
      quantityInBox: 1,
      unitPriceEstimate: 55
    };
    onChange({ items: [...data.items, newItem] });
  };

  const handleUpdateItem = (id: string, field: Partial<TeaProductItem>) => {
    const next = data.items.map(item => item.id === id ? { ...item, ...field } : item);
    onChange({ items: next });
  };

  const handleRemoveItem = (id: string) => {
    if (data.items.length <= 1) return;
    onChange({ items: data.items.filter(i => i.id !== id) });
  };

  // 汇总总克重与罐数
  const totalWeightPerBox = data.items.reduce((sum, i) => sum + (i.unitWeight * i.quantityInBox), 0);
  const totalUnitsPerBox = data.items.reduce((sum, i) => sum + i.quantityInBox, 0);

  return (
    <div id="section-tea" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-stone-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono shrink-0">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {t('tea.title', '产品基础信息 (茶叶产品规格)')}
            </h2>
            <p className="text-xs text-stone-700 mt-0.5">
              {t('tea.sub', '这是自动生成订单与定制内托刀模开孔的核心')}
            </p>
          </div>
        </div>

        {/* Combination Toggle with nowrap to prevent awkward wrapping */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChange({ isCombination: false })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              !data.isCombination
                ? 'bg-white text-emerald-900 shadow-xs font-semibold ring-1 ring-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {t('tea.comboNo', '单一品类装 (单款茶叶)')}
          </button>
          <button
            type="button"
            onClick={() => onChange({ isCombination: true })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              data.isCombination
                ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span>{t('tea.comboYes', '组合装 (多种茶叶混装拼配)')}</span>
          </button>
        </div>
      </div>

      {/* Auto-generated Summary Pill */}
      <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between flex-wrap gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-emerald-950 min-w-0 flex-wrap">
          <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-bold whitespace-nowrap">{t('tea.itemSummary', '本礼盒包含')}：</span>
          <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-950 font-semibold shadow-2xs break-all">
            {data.items.map(i => `${i.teaName || 'Tea'} × ${i.quantityInBox} × ${i.unitWeight}g`).join(' + ')}
          </span>
        </div>
        <div className="flex items-center gap-4 text-emerald-900 font-medium shrink-0 whitespace-nowrap">
          <span>{t('tea.cansCount', '礼盒内放置数量')}: <strong className="font-bold text-emerald-950">{totalUnitsPerBox}</strong></span>
          <span>{t('tea.totalWeightInBox', '单套礼盒茶叶总净重：')} <strong className="font-bold text-emerald-950">{totalWeightPerBox}g</strong></span>
        </div>
      </div>

      {/* Tea Items List */}
      <div className="space-y-4">
        {data.items.map((item, index) => (
          <div 
            key={item.id} 
            className="p-4 sm:p-4.5 rounded-xl border border-stone-200/90 bg-stone-50/40 relative hover:border-emerald-600/40 hover:bg-stone-50/70 transition shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px] font-mono font-bold shrink-0">
                  {index + 1}
                </span>
                <span>{data.isCombination ? `${t('tea.combo', '组合')} #${index + 1}` : t('tea.name', '茶叶名称')}</span>
              </span>

              {data.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-stone-400 hover:text-rose-600 transition p-1 cursor-pointer rounded-md hover:bg-rose-50"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Responsive grid preventing header squishing */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3.5">
              {/* Tea Category */}
              <div className="xl:col-span-3 min-w-0">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">
                  {t('tea.category', '茶叶品类')} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={item.category}
                  onChange={(e) => handleUpdateItem(item.id, { category: e.target.value as TeaCategory })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 truncate shadow-2xs"
                >
                  <option value="green">{t('tea.category.green', '绿茶 (西湖龙井/碧螺春)')}</option>
                  <option value="black">{t('tea.category.black', '红茶 (金骏眉/正山小种)')}</option>
                  <option value="white">{t('tea.category.white', '白茶 (福鼎白茶/白毫银针)')}</option>
                  <option value="puer">{t('tea.category.puer', '普洱茶 (熟普金芽/生普茶饼)')}</option>
                  <option value="oolong">{t('tea.category.oolong', '乌龙茶 (大红袍/铁观音)')}</option>
                  <option value="other">{t('tea.category.other', '其他 / 特调茶 (茉莉/柑普)')}</option>
                </select>
              </div>

              {/* Tea Name */}
              <div className="xl:col-span-3 min-w-0">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">
                  {t('tea.name', '茶叶名称')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.teaName}
                  onChange={(e) => handleUpdateItem(item.id, { teaName: e.target.value })}
                  placeholder={t('tea.namePlaceholder', '例如：西湖龙井（明前特级）')}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 font-medium text-stone-900 shadow-2xs"
                />
              </div>

              {/* Product Spec */}
              <div className="xl:col-span-2 min-w-0">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">
                  {t('tea.specs', '产品包装规格')}
                </label>
                <input
                  type="text"
                  value={item.spec}
                  onChange={(e) => handleUpdateItem(item.id, { spec: e.target.value })}
                  placeholder="八角铁罐 / 铝罐 / 陶罐"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 shadow-2xs"
                />
              </div>

              {/* Numeric Trio (Unit weight, Cans, Price) in a balanced sub-grid */}
              <div className="xl:col-span-4 grid grid-cols-3 gap-2 min-w-0">
                {/* Unit Weight */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap truncate" title={t('tea.unitWeight', '单罐净含量 (g)')}>
                    {t('tea.unitWeight', '单罐克重 (g)')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={5}
                      step={5}
                      value={item.unitWeight}
                      onChange={(e) => handleUpdateItem(item.id, { unitWeight: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white pr-5 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs font-mono"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-stone-700">g</span>
                  </div>
                </div>

                {/* Quantity in Box */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap truncate" title={t('tea.cansCount', '礼盒内放置数量')}>
                    {t('tea.cansCount', '盒内数量')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={item.quantityInBox}
                      onChange={(e) => handleUpdateItem(item.id, { quantityInBox: Number(e.target.value) || 1 })}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white pr-4 focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs font-mono"
                    />
                  </div>
                </div>

                {/* Unit Price Estimate */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap truncate" title={t('card.average', '折合单套单价：')}>
                    {t('card.average', '预估单价')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={item.unitPriceEstimate}
                      onChange={(e) => handleUpdateItem(item.id, { unitPriceEstimate: Number(e.target.value) || 0 })}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white pr-4 text-emerald-800 font-bold focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Combination Item Button */}
        {data.isCombination && (
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-3 border border-dashed border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-500 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('tea.addTea', '添加一款茶叶组合')}</span>
          </button>
        )}
      </div>

      {/* Quick Picks for Common Teas */}
      <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1.5 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{t('scenario.bannerTitle', '常用名茶快捷填入：')}</span>
        </span>
        {POPULAR_TEAS.map((pt) => (
          <button
            key={pt.name}
            type="button"
            onClick={() => {
              if (data.items.length > 0) {
                handleUpdateItem(data.items[0].id, {
                  teaName: pt.name,
                  category: pt.category,
                  unitWeight: pt.weight,
                  unitPriceEstimate: pt.price
                });
              }
            }}
            className="text-xs px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 border border-stone-200 hover:border-emerald-300 transition cursor-pointer whitespace-nowrap shadow-2xs font-medium"
          >
            {pt.name}
          </button>
        ))}
      </div>
    </div>
  );
};
