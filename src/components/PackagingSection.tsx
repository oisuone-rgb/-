import React from 'react';
import { 
  Package, 
  Layers, 
  Sparkles, 
  Check, 
  Maximize2, 
  ShoppingBag, 
  Boxes,
  HelpCircle
} from 'lucide-react';
import { 
  PackagingInfo, 
  PackagingType, 
  BoxModelType 
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  getLocalizedBoxModels, 
  getLocalizedSurfaceCrafts, 
  getLocalizedInnerTrays,
  getLocalizedMaterials,
  getLocalizedColorThemes,
  getLocalizedHandbagHandles
} from '../i18n/optionsData';

interface PackagingSectionProps {
  data: PackagingInfo;
  onChange: (updated: Partial<PackagingInfo>) => void;
}

export const PackagingSection: React.FC<PackagingSectionProps> = ({
  data,
  onChange
}) => {
  const { t } = useLanguage();

  const BOX_MODELS = getLocalizedBoxModels(t);
  const SURFACE_CRAFTS = getLocalizedSurfaceCrafts(t);
  const INNER_TRAYS = getLocalizedInnerTrays(t);
  const MATERIALS = getLocalizedMaterials(t);
  const COLOR_THEMES = getLocalizedColorThemes(t);
  const HANDBAG_HANDLES = getLocalizedHandbagHandles(t);

  const BOX_CATEGORIES: { key: PackagingType; label: string; desc: string; badge: string }[] = [
    { key: 'spot', label: t('packaging.type.spot', '通货现货 (已有模板/库存现货，交期极快)'), desc: t('packaging.tag.spot', '已有模板/现货'), badge: t('packaging.tag.spot', '现货模板') },
    { key: 'custom', label: t('packaging.type.custom', '定制礼盒 (全套专属刀模开孔定制)'), desc: t('packaging.tag.custom', '全套开模定制'), badge: t('packaging.tag.custom', '全套定制') },
    { key: 'festival', label: t('packaging.type.festival', '中秋/新春节日限定茶礼盒'), desc: t('packaging.tag.festival', '中秋/新春/端午'), badge: t('packaging.tag.festival', '节日限定') },
    { key: 'corporate', label: t('packaging.type.corporate', '企业商务尊享定制礼盒 (带企业识别)'), desc: t('packaging.tag.corporate', 'VIP答谢/年会'), badge: t('packaging.tag.corporate', '商务定制') },
  ];

  const handleSelectBoxModel = (modelKey: BoxModelType) => {
    const selected = BOX_MODELS.find(m => m.key === modelKey);
    if (selected) {
      onChange({
        boxModel: modelKey,
        dimensions: { ...selected.dimensions }
      });
    }
  };

  const toggleCraft = (craftKey: any) => {
    const current = (data.surfaceFinishes || []) as any[];
    const next = current.includes(craftKey)
      ? current.filter(c => c !== craftKey)
      : [...current, craftKey];
    onChange({ surfaceFinishes: next as any });
  };

  const selectedCraftsText = t('packaging.selectedCrafts', '已选 {n} 项工艺').replace('{n}', String(data.surfaceFinishes.length));

  return (
    <div id="section-pkg" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono shrink-0">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {t('packaging.title', '礼盒包装信息 (工业结构与材质工艺)')}
            </h2>
            <p className="text-xs text-stone-700 mt-0.5">
              {t('packaging.sub', '礼盒自动化下单区别于普通电商订单的重点，决定开模尺寸与纸张工价')}
            </p>
          </div>
        </div>
      </div>

      {/* 1. 包装类型大类定位 */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-stone-700 mb-2">
          {t('packaging.type', '礼盒类型')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {BOX_CATEGORIES.map((cat) => {
            const isSelected = data.boxCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onChange({ boxCategory: cat.key })}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/70 ring-2 ring-emerald-700/20 shadow-xs'
                    : 'border-stone-200/90 hover:border-stone-300 bg-stone-50/30 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-1.5">
                    <span className="text-xs font-bold text-stone-900 leading-snug line-clamp-1">{cat.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-700 font-semibold whitespace-nowrap shrink-0">
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-tight">{cat.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 经典盒型结构选择 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{t('packaging.boxModel', '礼盒盒型结构')}</span>
          </label>
          <span className="text-[11px] text-stone-700 whitespace-nowrap">
            {t('packaging.modelTip', '选择盒型自动填充工业标准模具尺寸')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BOX_MODELS.map((model) => {
            const isSelected = data.boxModel === model.key;
            return (
              <button
                key={model.key}
                type="button"
                onClick={() => handleSelectBoxModel(model.key)}
                className={`p-4 rounded-xl border text-left transition cursor-pointer relative flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/80 ring-2 ring-emerald-700/20 shadow-xs'
                    : 'border-stone-200/90 hover:border-stone-300 bg-white hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 mb-2">
                    <span className="text-xs font-bold text-stone-900 leading-tight">{model.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold whitespace-nowrap shrink-0 ${model.tagColor}`}>
                      {model.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-relaxed mb-3 line-clamp-2">
                    {model.desc}
                  </p>
                </div>
                
                <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-700">
                  <span className="whitespace-nowrap font-medium">{t('packaging.dimLength', '推荐外寸')}:</span>
                  <span className="font-mono font-bold text-emerald-900 whitespace-nowrap">
                    {model.dimensions.length}×{model.dimensions.width}×{model.dimensions.height} mm
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 尺寸与用料精细化 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 p-4.5 sm:p-5 rounded-xl bg-stone-50/60 border border-stone-200/90 mb-6">
        {/* Custom Dimensions */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2.5">
            {t('packaging.dimensions', '礼盒外尺寸 (mm)')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.dimLength', '长 (mm)')}</span>
              <div className="relative">
                <input
                  type="number"
                  value={data.dimensions?.length || 320}
                  onChange={(e) => onChange({
                    dimensions: { ...data.dimensions, length: Number(e.target.value) || 300 }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-stone-700">mm</span>
              </div>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.dimWidth', '宽 (mm)')}</span>
              <div className="relative">
                <input
                  type="number"
                  value={data.dimensions?.width || 220}
                  onChange={(e) => onChange({
                    dimensions: { ...data.dimensions, width: Number(e.target.value) || 200 }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-stone-700">mm</span>
              </div>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.dimHeight', '高 (mm)')}</span>
              <div className="relative">
                <input
                  type="number"
                  value={data.dimensions?.height || 80}
                  onChange={(e) => onChange({
                    dimensions: { ...data.dimensions, height: Number(e.target.value) || 80 }
                  })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                />
                <span className="absolute right-2 top-2.5 text-[10px] text-stone-700">mm</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-stone-700 mt-2 font-medium">
            {t('packaging.volumeCalc', '体积:')} <strong className="font-mono text-emerald-950 font-semibold">{(((data.dimensions?.length || 300) * (data.dimensions?.width || 200) * (data.dimensions?.height || 80)) / 1000000).toFixed(2)}</strong> {t('packaging.volumeUnit', '立方分米 (影响运费与装箱数)')}
          </p>
        </div>

        {/* Material & Color */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2.5">
            {t('packaging.matLabel', '用料材质与版面风格')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
            <div>
              <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.material', '礼盒核心用料 / 材质')}</span>
              <select
                value={data.material}
                onChange={(e) => onChange({ material: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-medium truncate shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              >
                {MATERIALS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.color', '盒面主色调 / 艺术风格')}</span>
              <input
                type="text"
                value={data.boxColor}
                onChange={(e) => onChange({ boxColor: e.target.value })}
                placeholder={t('packaging.colorPlaceholder', '例如：沉稳墨黑配鎏金内衬')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
              />
            </div>
          </div>

          {/* Color theme quick tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {COLOR_THEMES.map(c => (
              <button
                key={c.name}
                type="button"
                onClick={() => onChange({ boxColor: c.name })}
                className="text-[10px] px-2 py-0.5 rounded-full border border-stone-200/90 bg-white hover:bg-stone-50 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs font-medium"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.hex, borderColor: c.border, borderWidth: 1 }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 表面工艺 (Surface Finishes) - 多选 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-stone-700">
            {t('packaging.finishes', '盒面特殊工艺 (支持多选叠加)')}
          </label>
          <span className="text-xs text-emerald-800 font-bold whitespace-nowrap bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70">{selectedCraftsText}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SURFACE_CRAFTS.map((sc) => {
            const isSelected = ((data.surfaceFinishes || []) as string[]).includes(sc.key);
            return (
              <button
                key={sc.key}
                type="button"
                onClick={() => toggleCraft(sc.key)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700/30'
                    : 'border-stone-200/90 hover:border-stone-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-stone-900 leading-tight">{sc.label}</span>
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'border border-stone-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-700 mb-2 leading-snug line-clamp-2">{sc.desc}</p>
                </div>
                <span className="text-[10px] font-mono font-semibold text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded-md w-fit whitespace-nowrap">
                  {sc.feeHint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. 内托材质 (Inner Tray) */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-stone-700 mb-2.5">
          {t('packaging.innerTray', '内托缓冲支撑材质')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {INNER_TRAYS.map(tray => {
            const isSelected = data.innerTrayMaterial === tray.key;
            return (
              <button
                key={tray.key}
                type="button"
                onClick={() => onChange({ innerTrayMaterial: tray.key as any })}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/70 ring-1 ring-emerald-700/30 font-medium'
                    : 'border-stone-200/90 bg-white hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-bold text-stone-900 mb-1 leading-tight">{tray.label}</div>
                <div className="text-[10px] text-stone-700 leading-snug line-clamp-2">{tray.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. 手提袋与外箱配置 (Handbag & Outer Box) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5 pt-5 border-t border-stone-100">
        {/* Handbag */}
        <div className="p-4.5 rounded-xl border border-stone-200/90 bg-stone-50/50 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-800 shrink-0" />
              <span className="text-xs font-bold text-stone-900">{t('packaging.handbag', '是否配套手提袋')}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.needHandbag}
                onChange={(e) => onChange({ needHandbag: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {data.needHandbag ? (
            <div className="space-y-2.5 text-xs animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.handbagStyle', '手提袋工艺与提手')}</span>
                  <select
                    value={data.handbagHandleType}
                    onChange={(e) => onChange({ handbagHandleType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white truncate shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  >
                    {HANDBAG_HANDLES.map(h => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.handbagCraftLabel', '袋身工艺与纸张')}</span>
                  <input
                    type="text"
                    value={data.handbagCraft}
                    onChange={(e) => onChange({ handbagCraft: e.target.value })}
                    placeholder={t('packaging.handbagCraftPlaceholder', '例如：250g白卡纸+LOGO哑光金')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  />
                </div>
              </div>
              <p className="text-[11px] text-emerald-900 font-medium">
                ✓ {t('packaging.handbagBenefit', '包含与礼盒色系精准匹配的定制纸袋，单套增加成本约 ¥4.8 ~ ¥6.8')}
              </p>
            </div>
          ) : (
            <p className="text-xs text-stone-700">
              {t('packaging.noHandbagNote', '当前未选择手提袋（适合自带提手的盒型或电商直接寄递场景）')}
            </p>
          )}
        </div>

        {/* Outer Carton */}
        <div className="p-4.5 rounded-xl border border-stone-200/90 bg-stone-50/50 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-800 shrink-0" />
              <span className="text-xs font-bold text-stone-900">{t('packaging.outerBox', '是否需要瓦楞运输外箱')}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.needOuterBox}
                onChange={(e) => onChange({ needOuterBox: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>

          {data.needOuterBox ? (
            <div className="space-y-2.5 text-xs animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.outerBoxPrint', '外箱版面印刷类型')}</span>
                  <select
                    value={data.outerBoxPrint}
                    onChange={(e) => onChange({ outerBoxPrint: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  >
                    <option value="monochrome">{t('packaging.print.mono', '单色箱唛印刷 (低成本、清晰标准)')}</option>
                    <option value="multicolor">{t('packaging.print.multi', '多色彩印版面 (品牌展示更强)')}</option>
                    <option value="kraft_blank">{t('packaging.print.blank', '纯牛皮纸无印空白箱')}</option>
                  </select>
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-stone-700 mb-1 whitespace-nowrap">{t('packaging.outerBoxSub', '装箱规数 (每箱装套数)')}</span>
                  <select
                    value={data.unitsPerOuterBox}
                    onChange={(e) => onChange({ unitsPerOuterBox: Number(e.target.value) || 10 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                  >
                    <option value={5}>5 {t('packaging.setsPerBox', '套/箱')}</option>
                    <option value={8}>8 {t('packaging.setsPerBox', '套/箱')}</option>
                    <option value={10}>10 {t('packaging.setsPerBox', '套/箱 (行业推荐标准)')}</option>
                    <option value={12}>12 {t('packaging.setsPerBox', '套/箱')}</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-stone-700">
                {t('packaging.outerBoxDesc', '采用五层强化瓦楞纸板，抗压缓冲，确保远途干线运输茶叶礼盒完好无损。')}
              </p>
            </div>
          ) : (
            <p className="text-xs text-stone-700">
              {t('packaging.noOuterBoxNote', '不需要外箱（仅限同城托盘缠绕膜专车自提）')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
