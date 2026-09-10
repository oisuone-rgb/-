import React from 'react';
import { 
  Package, 
  Layers, 
  Sparkles, 
  ShoppingBag, 
  Boxes, 
  Check, 
  Box, 
  Sliders, 
  Info 
} from 'lucide-react';
import { 
  BoxPackagingInfo, 
  BoxModelType, 
  BoxCategory, 
  SurfaceCraft, 
  InnerTrayMaterial 
} from '../types';

interface PackagingSectionProps {
  data: BoxPackagingInfo;
  onChange: (updated: Partial<BoxPackagingInfo>) => void;
}

const BOX_MODELS: {
  type: BoxModelType;
  name: string;
  desc: string;
  tag: string;
  defaultDim: { length: number; width: number; height: number };
}[] = [
  {
    type: 'tiandigai',
    name: '天地盖礼盒',
    desc: '经典上下分体盖结构，结实稳固，成本优异，适应性强',
    tag: '经典高性价比',
    defaultDim: { length: 320, width: 220, height: 80 }
  },
  {
    type: 'book_box',
    name: '书型磁吸盒',
    desc: '翻盖式磁吸开启，如展开典籍，极具商务典雅感',
    tag: '企业定制优选',
    defaultDim: { length: 330, width: 240, height: 85 }
  },
  {
    type: 'drawer_box',
    name: '抽屉式礼盒',
    desc: '抽拉式双层或单层内盒，仪式感强，适合多茶拼配',
    tag: '创意新颖',
    defaultDim: { length: 300, width: 200, height: 95 }
  },
  {
    type: 'double_door',
    name: '双开门礼盒',
    desc: '左右向外对开对扇门结构，尊贵大气，适合高端礼赠',
    tag: '奢华尊贵',
    defaultDim: { length: 360, width: 260, height: 100 }
  },
  {
    type: 'portable_box',
    name: '便携手提卡盒',
    desc: '盒身自带一体化提手，轻量便携，适合轻商务与年轻客群',
    tag: '免手提袋便携',
    defaultDim: { length: 280, width: 180, height: 75 }
  },
  {
    type: 'tin_set',
    name: '马口铁罐套装盒',
    desc: '食品级马口铁精装封套，密封防潮性顶级，金属质感',
    tag: '金属密封',
    defaultDim: { length: 290, width: 190, height: 80 }
  }
];

const SURFACE_CRAFTS: { key: SurfaceCraft; label: string; desc: string; feeHint: string }[] = [
  { key: 'hot_stamping_gold', label: '烫金 (亮金/哑金)', desc: '尊贵金属光泽，凸显核心品牌与茶品', feeHint: '制版¥180+¥1.5/套' },
  { key: 'hot_stamping_silver', label: '烫哑银', desc: '清雅内敛，适合现代极简风格', feeHint: '制版¥180+¥1.5/套' },
  { key: 'uv', label: '局部立显UV', desc: '晶莹高亮透明光油，触感光滑有层次', feeHint: '制版¥220+¥1.2/套' },
  { key: 'bump', label: '高精度深击凸', desc: '物理受力凸起，触手可及立体微浮雕', feeHint: '制版¥240+¥1.6/套' },
  { key: 'emboss_deboss', label: '凹凸立体压印', desc: '无色压凹或肌理压纹，低调奢华', feeHint: '制版¥200+¥1.0/套' },
  { key: 'laminate_matte', label: '全盒覆哑膜', desc: '防水防刮，手感细腻柔滑不反光', feeHint: '全盒覆膜¥0.8/套' },
  { key: 'laminate_gloss', label: '全盒覆亮膜', desc: '色彩明亮鲜艳，光泽饱满', feeHint: '全盒覆膜¥0.8/套' },
  { key: 'screen_print', label: '高浓丝网印', desc: '墨层厚实遮盖力强，适合单色高显', feeHint: '制版¥150+¥1.0/套' },
];

const INNER_TRAYS: { key: InnerTrayMaterial; label: string; desc: string }[] = [
  { key: 'eva_sponge', label: '高密植绒EVA海绵', desc: '黑色/红棕色绒布贴面，回弹保护极佳，高端首选' },
  { key: 'pe_foam', label: 'PE珍珠棉开槽', desc: '高性价比，抗震缓冲强，适合大批量' },
  { key: 'paper_pulp', label: '环保降解纸塑内托', desc: '纯天然植物纤维压制，可降解环保，外贸首选' },
  { key: 'satin_blister', label: '缎布包吸塑内胆', desc: '金色/黄色高档金丝绒缎布褶皱，国风典雅' },
  { key: 'cardboard', label: '纯纸卡折叠内托', desc: '纯牛皮卡或白卡纸折叠，结构轻盈极简' }
];

const MATERIALS = [
  '1200g灰板特种纸',
  '1500g高密灰板触感纸',
  '纯实木黑胡桃漆器',
  '环保天然竹木盒',
  '食品级特级马口铁',
  '环保原生牛皮纸卡'
];

const COLOR_THEMES = [
  { name: '沉稳墨黑配鎏金', hex: '#1c1917', border: '#ca8a04' },
  { name: '正德朱砂中国红', hex: '#991b1b', border: '#f59e0b' },
  { name: '雅致竹青墨绿', hex: '#064e3b', border: '#10b981' },
  { name: '霁蓝青花宋韵', hex: '#1e3a8a', border: '#60a5fa' },
  { name: '月岩极简素白', hex: '#f8fafc', border: '#cbd5e1' },
  { name: '尊享原木本色', hex: '#78350f', border: '#d97706' }
];

export const PackagingSection: React.FC<PackagingSectionProps> = ({
  data,
  onChange
}) => {
  const toggleCraft = (craft: SurfaceCraft) => {
    const exists = data.surfaceFinishes.includes(craft);
    if (exists) {
      onChange({ surfaceFinishes: data.surfaceFinishes.filter(c => c !== craft) });
    } else {
      onChange({ surfaceFinishes: [...data.surfaceFinishes, craft] });
    }
  };

  return (
    <div id="section-packaging" className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            3
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              礼盒包装信息 (包装定制核心)
            </h2>
            <p className="text-xs text-stone-700">区别于普通电商的核心工艺：盒型、用料、表面工艺、内托、手提袋与瓦楞外箱</p>
          </div>
        </div>
      </div>

      {/* 1. 礼盒类型分类 */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-stone-700 mb-2">
          礼盒类型定位
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { key: 'spot', label: '通货现货礼盒', sub: '已有刀模库存，出货最快', badge: '现货模板' },
            { key: 'custom', label: '专属定制礼盒', sub: '根据客户要求全新开模印刷', badge: '全套定制' },
            { key: 'festival', label: '节日节令礼盒', sub: '中秋/端午/新年/春茶限定', badge: '节日气氛' },
            { key: 'corporate', label: '企业礼品礼盒', sub: '带强烈品牌属性与员工关怀', badge: '商务定制' },
          ].map((cat) => {
            const isSelected = data.boxCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => onChange({ 
                  boxCategory: cat.key as BoxCategory,
                  isStockTemplate: cat.key === 'spot'
                })}
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/50 ring-1 ring-emerald-700'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900">{cat.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-medium">
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700">{cat.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. 盒型选择 (Box Model) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-stone-700">
            精选盒型结构 (点击选择并自动适配基准尺寸)
          </label>
          <span className="text-[11px] text-stone-700">盒型直接影响开合体验与防震保护</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BOX_MODELS.map((m) => {
            const isSelected = data.boxModel === m.type;
            return (
              <div
                key={m.type}
                onClick={() => {
                  onChange({
                    boxModel: m.type,
                    dimensions: m.defaultDim
                  });
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer relative ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/60 shadow-xs ring-1 ring-emerald-700'
                    : 'border-stone-200 hover:border-emerald-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <Box className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-stone-700'}`} />
                    {m.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isSelected ? 'bg-emerald-200 text-emerald-900' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {m.tag}
                  </span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed mb-2">{m.desc}</p>
                <div className="text-[10px] font-mono text-stone-700 flex items-center justify-between pt-1 border-t border-stone-100">
                  <span>推荐尺寸:</span>
                  <span>{m.defaultDim.length} × {m.defaultDim.width} × {m.defaultDim.height} mm</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 尺寸与用料材质 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6 p-4 rounded-xl bg-stone-50 border border-stone-200">
        {/* Dimensions */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            礼盒外尺寸 (长 × 宽 × 高，单位：毫米 mm)
          </label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="block text-[10px] text-stone-700 mb-0.5">长度 (长 L)</span>
              <div className="relative">
                <input
                  type="number"
                  value={data.dimensions?.length || 320}
                  onChange={(e) => onChange({
                    dimensions: { ...data.dimensions, length: Number(e.target.value) || 300 }
                  })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                />
                <span className="absolute right-2 top-2 text-[10px] text-stone-700">mm</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] text-stone-700 mb-0.5">宽度 (宽 W)</span>
              <div className="relative">
                <input
                  type="number"
                  value={data.dimensions?.width || 220}
                  onChange={(e) => onChange({
                    dimensions: { ...data.dimensions, width: Number(e.target.value) || 200 }
                  })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                />
                <span className="absolute right-2 top-2 text-[10px] text-stone-700">mm</span>
              </div>
            </div>
            <div>
              <span className="block text-[10px] text-stone-700 mb-0.5">高度 (高 H)</span>
              <div className="relative">
                <input
                  type="number"
                  value={data.dimensions?.height || 80}
                  onChange={(e) => onChange({
                    dimensions: { ...data.dimensions, height: Number(e.target.value) || 80 }
                  })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-mono"
                />
                <span className="absolute right-2 top-2 text-[10px] text-stone-700">mm</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-stone-700 mt-1.5">
            体积: {(((data.dimensions?.length || 300) * (data.dimensions?.width || 200) * (data.dimensions?.height || 80)) / 1000000).toFixed(2)} 立方分米 (影响运费与装箱数)
          </p>
        </div>

        {/* Material & Color */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            用料材质与版面风格
          </label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <span className="block text-[10px] text-stone-700 mb-0.5">礼盒主要材质</span>
              <select
                value={data.material}
                onChange={(e) => onChange({ material: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white font-medium"
              >
                {MATERIALS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <span className="block text-[10px] text-stone-700 mb-0.5">版面色系/风格</span>
              <input
                type="text"
                value={data.boxColor}
                onChange={(e) => onChange({ boxColor: e.target.value })}
                placeholder="例如：沉稳墨黑配鎏金内衬"
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
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
                className="text-[10px] px-2 py-0.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 flex items-center gap-1 cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex, borderColor: c.border, borderWidth: 1 }} />
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. 表面工艺 (Surface Finishes) - 多选 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-stone-700">
            表面特殊加工工艺 (支持多选，系统自动核算版费与工时)
          </label>
          <span className="text-[11px] text-emerald-700 font-medium">已选 {data.surfaceFinishes.length} 项工艺</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SURFACE_CRAFTS.map((sc) => {
            const isSelected = data.surfaceFinishes.includes(sc.key);
            return (
              <button
                key={sc.key}
                type="button"
                onClick={() => toggleCraft(sc.key)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/70 shadow-2xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-900">{sc.label}</span>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-emerald-700 text-white' : 'border border-stone-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-700 mb-1.5">{sc.desc}</p>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                  {sc.feeHint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. 内托材质 (Inner Tray) */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-stone-700 mb-2">
          内托材质结构 (保护茶叶罐及提升质感)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {INNER_TRAYS.map(tray => {
            const isSelected = data.innerTrayMaterial === tray.key;
            return (
              <button
                key={tray.key}
                type="button"
                onClick={() => onChange({ innerTrayMaterial: tray.key })}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/60 font-medium'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-bold text-stone-900 mb-0.5">{tray.label}</div>
                <div className="text-[10px] text-stone-700 leading-tight">{tray.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. 手提袋与外箱配置 (Handbag & Outer Box) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
        {/* Handbag */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-stone-900">配套定制手提袋</span>
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
            <div className="space-y-2 text-xs animate-in fade-in">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] text-stone-700 mb-0.5">提手材质工艺</span>
                  <select
                    value={data.handbagHandleType}
                    onChange={(e) => onChange({ handbagHandleType: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded border border-stone-300 bg-white"
                  >
                    <option value="高密黑色编制丝带">高密编制丝带 (柔软优雅)</option>
                    <option value="三股纯棉棉绳提手">三股纯棉棉绳 (牢固耐磨)</option>
                    <option value="头层环保皮质提手">头层真皮/皮质提手 (高端奢华)</option>
                    <option value="扁平涤纶织带">扁平涤纶织带 (极简商务)</option>
                  </select>
                </div>
                <div>
                  <span className="block text-[10px] text-stone-700 mb-0.5">袋身工艺与纸张</span>
                  <input
                    type="text"
                    value={data.handbagCraft}
                    onChange={(e) => onChange({ handbagCraft: e.target.value })}
                    placeholder="例如：250g白卡纸+LOGO哑光金"
                    className="w-full px-2 py-1 text-xs rounded border border-stone-300 bg-white"
                  />
                </div>
              </div>
              <p className="text-[11px] text-emerald-800">
                ✓ 包含与礼盒色系精准匹配的定制纸袋，单套增加成本约 ¥4.8 ~ ¥6.8
              </p>
            </div>
          ) : (
            <p className="text-xs text-stone-700">
              当前未选择手提袋（适合自带提手的盒型或电商直接寄递场景）
            </p>
          )}
        </div>

        {/* Outer Carton */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Boxes className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-stone-900">运输瓦楞外箱 (99%客户都需要)</span>
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
            <div className="space-y-2 text-xs animate-in fade-in">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="block text-[10px] text-stone-700 mb-0.5">外箱版面印刷类型</span>
                  <select
                    value={data.outerBoxPrint}
                    onChange={(e) => onChange({ outerBoxPrint: e.target.value as any })}
                    className="w-full px-2 py-1 text-xs rounded border border-stone-300 bg-white"
                  >
                    <option value="monochrome">单色箱麦印刷 (低成本、清晰标准)</option>
                    <option value="multicolor">多色彩印版面 (品牌展示更强)</option>
                    <option value="kraft_blank">纯牛皮纸无印空白箱</option>
                  </select>
                </div>
                <div>
                  <span className="block text-[10px] text-stone-700 mb-0.5">装箱规数 (多少套打一箱)</span>
                  <select
                    value={data.unitsPerOuterBox}
                    onChange={(e) => onChange({ unitsPerOuterBox: Number(e.target.value) || 10 })}
                    className="w-full px-2 py-1 text-xs rounded border border-stone-300 bg-white"
                  >
                    <option value={5}>5 套 / 箱 (轻便搬运)</option>
                    <option value={8}>8 套 / 箱</option>
                    <option value={10}>10 套 / 箱 (行业推荐标准)</option>
                    <option value={12}>12 套 / 箱 (集约装柜)</option>
                  </select>
                </div>
              </div>
              <p className="text-[11px] text-stone-700">
                采用五层强化瓦楞纸板，抗压缓冲，确保远途干线运输茶叶礼盒完好无损。
              </p>
            </div>
          ) : (
            <p className="text-xs text-stone-700">
              不需要外箱（仅限同城托盘缠绕膜专车自提）
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
