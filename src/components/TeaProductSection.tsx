import React from 'react';
import { Leaf, Plus, Trash2, Check, Sparkles, Scale, Info } from 'lucide-react';
import { TeaProductInfo, TeaProductItem, TeaCategory } from '../types';

interface TeaProductSectionProps {
  data: TeaProductInfo;
  onChange: (updated: Partial<TeaProductInfo>) => void;
}

const CATEGORY_MAP: Record<TeaCategory, { label: string; color: string; bg: string }> = {
  green: { label: '绿茶 (明前龙井/碧螺春)', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  black: { label: '红茶 (金骏眉/正山小种)', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
  white: { label: '白茶 (福鼎老白茶/白毫银针)', color: 'text-stone-700', bg: 'bg-stone-50 border-stone-200' },
  puer: { label: '普洱茶 (熟茶金芽/古树生茶)', color: 'text-yellow-900', bg: 'bg-yellow-50 border-yellow-200' },
  oolong: { label: '乌龙茶 (大红袍/铁观音/肉桂)', color: 'text-orange-800', bg: 'bg-orange-50 border-orange-200' },
  other: { label: '其他 (花草茶/柑普/拼配)', color: 'text-purple-800', bg: 'bg-purple-50 border-purple-200' },
};

const POPULAR_TEAS = [
  { name: '西湖龙井（明前特级）', category: 'green' as TeaCategory, weight: 125, price: 68 },
  { name: '武夷大红袍（正岩肉桂）', category: 'oolong' as TeaCategory, weight: 125, price: 58 },
  { name: '武夷金骏眉（桐木关特级）', category: 'black' as TeaCategory, weight: 100, price: 75 },
  { name: '福鼎白茶（五年陈寿眉/银针）', category: 'white' as TeaCategory, weight: 150, price: 52 },
  { name: '云南勐海普洱熟茶金芽', category: 'puer' as TeaCategory, weight: 150, price: 46 },
  { name: '安溪铁观音（清香型特选）', category: 'oolong' as TeaCategory, weight: 125, price: 45 },
];

export const TeaProductSection: React.FC<TeaProductSectionProps> = ({
  data,
  onChange
}) => {
  const handleAddItem = () => {
    const newItem: TeaProductItem = {
      id: 'tea-' + Date.now(),
      teaName: '西湖龙井（特级）',
      category: 'green',
      spec: '精装金属密封罐',
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
    <div id="section-tea" className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-stone-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            2
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              产品基础信息 (茶叶产品)
            </h2>
            <p className="text-xs text-stone-700">自动生成标准产品品名与规格组合，支持单款纯茶或多茶拼配组合装</p>
          </div>
        </div>

        {/* Combination Toggle */}
        <div className="flex items-center gap-3 bg-stone-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onChange({ isCombination: false })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              !data.isCombination
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            单款主茶装
          </button>
          <button
            type="button"
            onClick={() => onChange({ isCombination: true })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              data.isCombination
                ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            多茶拼配组合装
          </button>
        </div>
      </div>

      {/* Auto-generated Summary Pill */}
      <div className="mb-5 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-2 text-emerald-900">
          <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold">自动生成规格组合公式：</span>
          <span className="font-mono bg-white px-2.5 py-1 rounded-md border border-emerald-300 text-emerald-950 font-medium">
            {data.items.map(i => `${i.teaName || '未定名'} × ${i.quantityInBox}罐 × ${i.unitWeight}g`).join(' + ')}
          </span>
        </div>
        <div className="flex items-center gap-3 text-emerald-800 font-medium">
          <span>单套内含: <strong>{totalUnitsPerBox}</strong> 罐/盒</span>
          <span>总净含量: <strong>{totalWeightPerBox}g</strong></span>
        </div>
      </div>

      {/* Tea Items List */}
      <div className="space-y-4">
        {data.items.map((item, index) => (
          <div 
            key={item.id} 
            className="p-4 rounded-xl border border-stone-200 bg-stone-50/40 relative hover:border-emerald-300 transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[11px]">
                  {index + 1}
                </span>
                {data.isCombination ? `茶叶组合项目 ${index + 1}` : '核心茶叶产品'}
              </span>

              {data.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-stone-700 hover:text-red-500 transition p-1 cursor-pointer"
                  title="移除该茶叶"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
              {/* Tea Category */}
              <div className="lg:col-span-3">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  茶叶品类 <span className="text-red-500">*</span>
                </label>
                <select
                  value={item.category}
                  onChange={(e) => handleUpdateItem(item.id, { category: e.target.value as TeaCategory })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="green">绿茶 (龙井/碧螺春/毛峰)</option>
                  <option value="black">红茶 (正山小种/金骏眉/祁红)</option>
                  <option value="white">白茶 (白毫银针/寿眉/贡眉)</option>
                  <option value="puer">普洱 (熟茶金芽/生茶古树)</option>
                  <option value="oolong">乌龙茶 (大红袍/铁观音/岩茶)</option>
                  <option value="other">其他特种茶/花茶/拼配</option>
                </select>
              </div>

              {/* Tea Name */}
              <div className="lg:col-span-4">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  茶叶名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.teaName}
                  onChange={(e) => handleUpdateItem(item.id, { teaName: e.target.value })}
                  placeholder="例如：西湖龙井（明前特级）"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-emerald-600 font-medium"
                />
              </div>

              {/* Product Spec */}
              <div className="lg:col-span-2">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  产品规格形式
                </label>
                <input
                  type="text"
                  value={item.spec}
                  onChange={(e) => handleUpdateItem(item.id, { spec: e.target.value })}
                  placeholder="八角铁罐 / 紫砂陶罐"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                />
              </div>

              {/* Unit Weight */}
              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  单罐净含量
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={10}
                    step={5}
                    value={item.unitWeight}
                    onChange={(e) => handleUpdateItem(item.id, { unitWeight: Number(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 bg-white pr-5"
                  />
                  <span className="absolute right-1.5 top-2 text-[10px] text-stone-700">g</span>
                </div>
              </div>

              {/* Quantity in Box */}
              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  盒内数量
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={item.quantityInBox}
                    onChange={(e) => handleUpdateItem(item.id, { quantityInBox: Number(e.target.value) || 1 })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 bg-white pr-5"
                  />
                  <span className="absolute right-1.5 top-2 text-[10px] text-stone-700">罐</span>
                </div>
              </div>

              {/* Unit Price Estimate */}
              <div className="lg:col-span-1">
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                  预估单价
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={item.unitPriceEstimate}
                    onChange={(e) => handleUpdateItem(item.id, { unitPriceEstimate: Number(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 bg-white pr-4 text-emerald-800 font-semibold"
                  />
                  <span className="absolute right-1 top-2 text-[10px] text-stone-700">元</span>
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
            className="w-full py-2.5 border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-xl text-xs font-semibold text-stone-600 hover:text-emerald-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>添加另一款拼装茶叶（支持红绿双拼、乌龙白茶组合等）</span>
          </button>
        )}
      </div>

      {/* Quick Picks for Common Teas */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 flex-wrap">
        <span className="text-[11px] font-semibold text-stone-700 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          常用名茶快捷填入：
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
            className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 border border-stone-200 transition cursor-pointer"
          >
            {pt.name}
          </button>
        ))}
      </div>

      {/* Extra Tea Quality & Certification requirements */}
      <div className="mt-4">
        <label className="block text-xs font-semibold text-stone-700 mb-1">
          茶叶等级与防伪质检溯源要求 (选填)
        </label>
        <input
          type="text"
          value={data.extraRemarks}
          onChange={(e) => onChange({ extraRemarks: e.target.value })}
          placeholder="例如：需充氮密封保鲜、出具国家农残质检报告、附带国家地理标志原产地防伪溯源码等"
          className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
        />
      </div>
    </div>
  );
};
