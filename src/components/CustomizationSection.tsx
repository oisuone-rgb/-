import React, { useRef, useState } from 'react';
import { 
  Palette, 
  UploadCloud, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  Check, 
  Sparkles,
  FileText,
  X
} from 'lucide-react';
import { CustomizationInfo, DesignProofStatus } from '../types';

interface CustomizationSectionProps {
  data: CustomizationInfo;
  onChange: (updated: Partial<CustomizationInfo>) => void;
}

const DESIGN_STATUS_STEPS: { key: DesignProofStatus; label: string; desc: string; color: string }[] = [
  { key: 'not_submitted', label: '未提交', desc: '客户设计源文件或Logo尚未上传', color: 'bg-stone-100 text-stone-700 border-stone-300' },
  { key: 'designing', label: '设计排版中', desc: '设计师正制作刀模展开图与效果图', color: 'bg-purple-50 text-purple-800 border-purple-300' },
  { key: 'pending_confirmation', label: '待客户确认稿', desc: '已出初稿/3D效果图，等待客户签字确认', color: 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/50' },
  { key: 'confirmed', label: '客户已确认', desc: '客户已签字核对尺寸、文案无误', color: 'bg-blue-50 text-blue-800 border-blue-300' },
  { key: 'locked_production', label: '已锁定生产', desc: '稿件已下发制版CTP车间，不可再行变更', color: 'bg-emerald-50 text-emerald-900 border-emerald-400' }
];

const LOGO_POSITIONS = [
  '礼盒正面正中偏上 + 手提袋单面',
  '礼盒正面正中央 (大气醒目)',
  '礼盒右下角 (内敛低调)',
  '盒盖内衬翻开处 (私享尊荣)',
  '外包封套腰封居中',
  '盒顶与手提袋双面统一定制'
];

const LOGO_CRAFTS = [
  '哑光拉丝金+微浮雕击凸 (推荐)',
  '高光亮金 (传统奢华)',
  '哑光银色 (极简冷淡)',
  '高亮局部UV立显',
  '定制专属拉丝金属贴标铭牌',
  '纯色高浓丝网印',
  '无色深压凹 (素雅无墨)'
];

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  data,
  onChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const designFileInputRef = useRef<HTMLInputElement>(null);
  const [showProofPreview, setShowProofPreview] = useState(false);

  const handleSimulatedLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({
        hasLogo: true,
        logoFileName: file.name
      });
    }
  };

  const handleSimulatedDesignUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange({
        useCustomerDesign: true,
        designFileName: file.name,
        designStatus: 'pending_confirmation'
      });
    }
  };

  const currentStepIndex = DESIGN_STATUS_STEPS.findIndex(s => s.key === data.designStatus);

  return (
    <div id="section-custom" className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            4
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              定制与设计信息 (Logo/文案/稿件状态)
            </h2>
            <p className="text-xs text-stone-700">定制专属品牌识别与文化文案，并进行具有法律约束力的设计稿确认流程</p>
          </div>
        </div>
      </div>

      {/* CRITICAL: 设计稿确认状态流转栏 (防纠纷机制) */}
      <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-stone-900">
              设计稿件确认状态 (生产纠纷防范机制)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-700">
              当前状态：
              <strong className="text-stone-900 font-semibold ml-1">
                {DESIGN_STATUS_STEPS.find(s => s.key === data.designStatus)?.label}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setShowProofPreview(true)}
              className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 bg-white border border-stone-200 hover:border-emerald-300 px-2.5 py-1 rounded-md transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>查看包装效果图/刀模样稿</span>
            </button>
          </div>
        </div>

        {/* 5-step status pipeline */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {DESIGN_STATUS_STEPS.map((step, idx) => {
            const isPassed = idx <= currentStepIndex;
            const isCurrent = step.key === data.designStatus;
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => onChange({ designStatus: step.key })}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? `${step.color} shadow-xs font-semibold`
                    : isPassed
                    ? 'bg-white border-emerald-200 text-stone-800'
                    : 'bg-stone-100/60 border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-stone-700">0{idx + 1}</span>
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-stone-300" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold">{step.label}</div>
                  <div className="text-[10px] text-stone-700 line-clamp-1 mt-0.5">{step.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3 text-[11px] text-amber-800 flex items-center gap-1.5 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            特别提示：一旦进入「已锁定生产」阶段，工厂立即安排CTP光波制版并裁切原纸，不可无损撤回或修改图稿。
          </span>
        </div>
      </div>

      {/* 1. Logo 定制 */}
      <div className="mb-6 p-4 rounded-xl border border-stone-200 bg-stone-50/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900">企业 / 品牌 Logo 印制</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.hasLogo}
              onChange={(e) => onChange({ hasLogo: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
          </label>
        </div>

        {data.hasLogo && (
          <div className="space-y-3.5 pt-2 border-t border-stone-200 animate-in fade-in">
            {/* Logo File Upload */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                上传 Logo 矢量源文件 (支持 .AI / .PDF / .CDR / .PNG 高清)
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-xl p-3.5 text-center cursor-pointer bg-white transition flex flex-col items-center justify-center gap-1.5"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ai,.pdf,.cdr,.png,.psd,.jpg,.svg"
                  className="hidden"
                  onChange={handleSimulatedLogoUpload}
                />
                <UploadCloud className="w-5 h-5 text-emerald-700" />
                <div className="text-xs text-stone-700">
                  <span className="font-semibold text-emerald-800">点击上传</span> 或将 Logo 文件拖拽至此
                </div>
                <div className="text-[10px] text-stone-700">
                  优先推荐 AI / EPS / PDF 矢量图，可直接提取制版菲林
                </div>
              </div>

              {data.logoFileName && (
                <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <FileText className="w-4 h-4 text-emerald-700" />
                    <span>已绑定Logo文件：{data.logoFileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange({ logoFileName: undefined })}
                    className="text-stone-700 hover:text-red-500 cursor-pointer p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Logo Position & Craft */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Logo 印刷位置
                </label>
                <select
                  value={data.logoPosition}
                  onChange={(e) => onChange({ logoPosition: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                >
                  {LOGO_POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Logo 工艺效果
                </label>
                <select
                  value={data.logoCraft}
                  onChange={(e) => onChange({ logoCraft: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                >
                  {LOGO_CRAFTS.map(craft => (
                    <option key={craft} value={craft}>{craft}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 文案定制 (Custom Copywriting) */}
      <div className="mb-6 p-4 rounded-xl border border-stone-200 bg-white">
        <label className="block text-xs font-bold text-stone-900 mb-3">
          礼盒包装专属文案定制
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <span className="block text-[11px] font-semibold text-stone-700 mb-1">
              礼盒专属主题名
            </span>
            <input
              type="text"
              value={data.boxTitle}
              onChange={(e) => onChange({ boxTitle: e.target.value })}
              placeholder="例如：岁序茶礼 · 智创未来"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50/50 hover:bg-white focus:bg-white"
            />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-stone-700 mb-1">
              企业品牌 Slogan / 宣传语
            </span>
            <input
              type="text"
              value={data.brandSlogan}
              onChange={(e) => onChange({ brandSlogan: e.target.value })}
              placeholder="例如：一杯好茶，至真诚意"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50/50 hover:bg-white focus:bg-white"
            />
          </div>
          <div>
            <span className="block text-[11px] font-semibold text-stone-700 mb-1">
              定制祝福语 / 专属赠言
            </span>
            <input
              type="text"
              value={data.blessingText}
              onChange={(e) => onChange({ blessingText: e.target.value })}
              placeholder="例如：十年并肩同路，茶香致敬知音"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-stone-50/50 hover:bg-white focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 3. 图案设计与源文件 */}
      <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/30">
        <label className="block text-xs font-bold text-stone-900 mb-2">
          图案设计方案与文件
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <label className="inline-flex items-center text-xs text-stone-700 cursor-pointer">
                <input
                  type="radio"
                  name="designSource"
                  checked={data.useCustomerDesign}
                  onChange={() => onChange({ useCustomerDesign: true })}
                  className="text-emerald-700 focus:ring-emerald-600 mr-1.5"
                />
                客户自备成熟设计刀模图 (AI/PDF/PSD)
              </label>
              <label className="inline-flex items-center text-xs text-stone-700 cursor-pointer">
                <input
                  type="radio"
                  name="designSource"
                  checked={!data.useCustomerDesign}
                  onChange={() => onChange({ useCustomerDesign: false, needDesignService: true })}
                  className="text-emerald-700 focus:ring-emerald-600 mr-1.5"
                />
                需要工坊提供专业排版设计
              </label>
            </div>

            {data.useCustomerDesign ? (
              <div>
                <button
                  type="button"
                  onClick={() => designFileInputRef.current?.click()}
                  className="w-full py-2 px-3 border border-stone-300 hover:border-emerald-600 rounded-lg text-xs text-stone-700 hover:text-emerald-800 bg-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <input
                    ref={designFileInputRef}
                    type="file"
                    accept=".ai,.pdf,.psd,.zip,.rar"
                    className="hidden"
                    onChange={handleSimulatedDesignUpload}
                  />
                  <UploadCloud className="w-4 h-4 text-emerald-700" />
                  <span>上传包装整体展开刀模源文件 (AI / PDF / PSD)</span>
                </button>
                {data.designFileName && (
                  <p className="text-[11px] text-emerald-800 font-mono mt-1">
                    ✓ 已上传源文件：{data.designFileName}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onChange({ designServiceType: 'free_basic' })}
                    className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                      data.designServiceType === 'free_basic'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    <div>免费基础排版</div>
                    <div className="text-[10px] text-stone-700 font-normal">提供Logo+文案免费微调套模</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ designServiceType: 'pro_custom' })}
                    className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                      data.designServiceType === 'pro_custom'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>资深专属原创设计</span>
                      <span className="text-[10px] text-amber-700">¥600</span>
                    </div>
                    <div className="text-[10px] text-stone-700 font-normal">资深茶器设计师手绘插画</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs text-stone-600 leading-relaxed">
            <span className="font-semibold text-stone-900 block mb-1">设计服务质检承诺：</span>
            1. 提交下单后 24 小时内出具首轮 3D 渲染图与 1:1 印刷刀模核对线；<br />
            2. 免费赠送 3 次文案与细节调整修改；<br />
            3. 生产前发送高清打样数码色卡对照，双向盖章签字后方可开机印刷。
          </div>
        </div>
      </div>

      {/* Proof Preview Modal Simulation */}
      {showProofPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-stone-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-sm">茶叶礼盒 3D 效果图与刀模样稿确认凭证</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowProofPreview(false)}
                className="text-stone-700 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mock Box Rendering */}
            <div className="p-6 rounded-xl bg-gradient-to-b from-stone-900 to-stone-800 text-amber-100 text-center relative overflow-hidden mb-4 border border-amber-500/30">
              <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded bg-emerald-800 text-white">
                3D打样模拟预览
              </div>
              <div className="max-w-xs mx-auto py-6 border border-amber-400/40 rounded-lg bg-stone-950/60 p-4 shadow-inner">
                <div className="text-[11px] text-amber-400/70 tracking-widest uppercase mb-1">TEA GIFT BOX DESIGN</div>
                <div className="text-base font-serif font-bold text-amber-200 mb-1">{data.boxTitle || '岁序茶礼 · 智创未来'}</div>
                <div className="text-[11px] text-stone-300 mb-3">{data.brandSlogan || '天目云联 · 智领未来'}</div>
                {data.hasLogo && (
                  <div className="inline-block px-3 py-1 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono mb-2">
                    [企业LOGO: {data.logoCraft}]
                  </div>
                )}
                <div className="text-[10px] text-stone-700 italic border-t border-stone-800 pt-2">
                  “{data.blessingText || '十年同行，茗香致远。'}”
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span>绑定设计文件：</span>
                <span className="font-mono text-stone-900">{data.designFileName || '待上传'}</span>
              </div>
              <div className="flex justify-between">
                <span>印刷专色号：</span>
                <span className="font-mono text-stone-900">Pantone 871C (鎏金) + 哑光碳黑</span>
              </div>
              <div className="flex justify-between">
                <span>当前确认状态：</span>
                <span className="font-semibold text-emerald-800">
                  {DESIGN_STATUS_STEPS.find(s => s.key === data.designStatus)?.label}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  onChange({ designStatus: 'pending_confirmation' });
                  setShowProofPreview(false);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700"
              >
                反馈修改意见
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange({ designStatus: 'confirmed' });
                  setShowProofPreview(false);
                }}
                className="px-4 py-1.5 text-xs rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>我已核对无误，签字确认图稿</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
