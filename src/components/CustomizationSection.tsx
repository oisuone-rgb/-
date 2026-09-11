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
import { useLanguage } from '../i18n/LanguageContext';
import { 
  getLocalizedDesignStatusSteps,
  getLocalizedLogoPositions,
  getLocalizedLogoCrafts
} from '../i18n/optionsData';

interface CustomizationSectionProps {
  data: CustomizationInfo;
  onChange: (updated: Partial<CustomizationInfo>) => void;
  onOpenAICopywrite?: () => void;
}

export const CustomizationSection: React.FC<CustomizationSectionProps> = ({
  data,
  onChange,
  onOpenAICopywrite
}) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const designFileInputRef = useRef<HTMLInputElement>(null);
  const [showProofPreview, setShowProofPreview] = useState(false);

  const DESIGN_STATUS_STEPS = getLocalizedDesignStatusSteps(t);
  const LOGO_POSITIONS = getLocalizedLogoPositions(t);
  const LOGO_CRAFTS = getLocalizedLogoCrafts(t);

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
    <div id="section-custom" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono shrink-0">
            4
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {t('custom.title', '定制信息与设计稿核对 (防纠纷关键流程)')}
            </h2>
            <p className="text-xs text-stone-700 mt-0.5">
              {t('custom.sub', '规范品牌识别、定制祝福语及设计稿确认状态，规避生产纠纷')}
            </p>
          </div>
        </div>
      </div>

      {/* CRITICAL: 设计稿确认状态流转栏 (防纠纷机制) */}
      <div className="mb-7 p-4.5 sm:p-5 rounded-2xl bg-stone-50/70 border border-stone-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-2.5">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-800 shrink-0" />
            <span className="text-xs font-bold text-stone-900">
              {t('custom.proofStatus', '【重点】设计稿确认状态 (防纠纷机制)')}
            </span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs text-stone-700 whitespace-nowrap font-medium">
              {t('scenario.current', '当前')}:
              <strong className="text-emerald-950 font-bold ml-1.5 bg-white px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs">
                {DESIGN_STATUS_STEPS.find(s => s.key === data.designStatus)?.label}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => setShowProofPreview(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-white border border-stone-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl shadow-2xs transition cursor-pointer whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('custom.previewProof', '在线预览 3D 设计稿与色卡')}</span>
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
                className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between min-w-0 shadow-2xs ${
                  isCurrent
                    ? `${step.color} shadow-xs font-bold ring-2 ring-emerald-700/30`
                    : isPassed
                    ? 'bg-white border-emerald-300/80 text-stone-900 hover:bg-emerald-50/40'
                    : 'bg-stone-100/70 border-stone-200/80 text-stone-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-bold text-stone-700">0{idx + 1}</span>
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-stone-300 shrink-0" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold leading-snug truncate">{step.label}</div>
                  <div className="text-[10px] text-stone-700 line-clamp-1 mt-0.5">{step.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-3.5 text-xs text-amber-900 flex items-center gap-2 bg-amber-50 border border-amber-200/80 p-3 rounded-xl leading-relaxed">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{t('custom.proofAlert', '建议增加设计稿确认状态：客户须在线预览3D样稿并核对文字无误后，方可锁定排产，杜绝错别字及印刷后生产纠纷。')}</span>
        </div>
      </div>

      {/* 1. Logo 定制 */}
      <div className="mb-6 p-4.5 rounded-xl border border-stone-200/90 bg-stone-50/40 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-900">{t('custom.logo', '是否印制客户品牌 Logo')}</span>
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
          <div className="space-y-4 pt-3 border-t border-stone-200/80 animate-in fade-in">
            {/* Logo File Upload */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                {t('custom.uploadLogo', '上传 Logo 矢量文件 (AI / EPS / PDF / 高清PNG)')}
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-xl p-4 text-center cursor-pointer bg-white transition flex flex-col items-center justify-center gap-1.5 shadow-2xs"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ai,.pdf,.cdr,.png,.psd,.jpg,.svg"
                  className="hidden"
                  onChange={handleSimulatedLogoUpload}
                />
                <UploadCloud className="w-6 h-6 text-emerald-700" />
                <div className="text-xs text-stone-700">
                  <span className="font-bold text-emerald-800">{t('doc.btnCopy', '点击上传')}</span> {t('custom.orDrag', '或将 Logo 文件拖拽至此')}
                </div>
                <div className="text-[10px] text-stone-700">
                  {t('custom.recommendVector', '优先推荐 AI / EPS / PDF 矢量图，可直接提取制版菲林')}
                </div>
              </div>

              {data.logoFileName && (
                <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs shadow-2xs">
                  <div className="flex items-center gap-2 text-emerald-950 font-semibold">
                    <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="truncate">{t('custom.uploaded', '已绑定矢量源文件')}: {data.logoFileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange({ logoFileName: undefined })}
                    className="text-stone-400 hover:text-rose-600 cursor-pointer p-1 rounded-md hover:bg-rose-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Logo Position & Craft */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
                  {t('custom.logoPosition', 'Logo 印制位置')}
                </label>
                <select
                  value={data.logoPosition}
                  onChange={(e) => onChange({ logoPosition: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white truncate shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
                >
                  {LOGO_POSITIONS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
                  {t('custom.logoCraft', 'Logo 工艺工艺方式')}
                </label>
                <select
                  value={data.logoCraft}
                  onChange={(e) => onChange({ logoCraft: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white truncate shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
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
      <div className="mb-6 p-4.5 rounded-xl border border-stone-200/90 bg-white shadow-2xs">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <label className="block text-xs font-bold text-stone-900">
            {t('custom.copywritingTitle', '礼盒包装专属文案定制')}
          </label>
          {onOpenAICopywrite && (
            <button
              type="button"
              onClick={onOpenAICopywrite}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200/70 transition cursor-pointer shadow-2xs active:scale-95 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 group-hover:rotate-12 transition-transform" />
              <span>✨ AI 智能撰写主题文案与贺词</span>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div>
            <span className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
              {t('custom.boxTitle', '定制礼盒主题名称')}
            </span>
            <input
              type="text"
              value={data.boxTitle}
              onChange={(e) => onChange({ boxTitle: e.target.value })}
              placeholder={t('custom.boxTitlePlaceholder', '例如：岁序茶礼 · 智创未来')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50/40 hover:bg-white focus:bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
            />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
              {t('custom.slogan', '企业 / 品牌 Slogan')}
            </span>
            <input
              type="text"
              value={data.brandSlogan}
              onChange={(e) => onChange({ brandSlogan: e.target.value })}
              placeholder={t('custom.sloganPlaceholder', '例如：一杯好茶，至真诚意')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50/40 hover:bg-white focus:bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
            />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
              {t('custom.blessing', '专属贺卡 / 腰封祝福文案')}
            </span>
            <input
              type="text"
              value={data.blessingText}
              onChange={(e) => onChange({ blessingText: e.target.value })}
              placeholder={t('custom.blessingPlaceholder', '例如：十年并肩同路，茶香致敬知音')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-stone-50/40 hover:bg-white focus:bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
            />
          </div>
        </div>
      </div>

      {/* 3. 图案设计与源文件 */}
      <div className="p-4.5 rounded-xl border border-stone-200/90 bg-stone-50/40 shadow-2xs">
        <label className="block text-xs font-bold text-stone-900 mb-2.5">
          {t('custom.designService', '图案设计需求')}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 mb-3">
              <label className="inline-flex items-center text-xs text-stone-800 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="designSource"
                  checked={data.useCustomerDesign}
                  onChange={() => onChange({ useCustomerDesign: true })}
                  className="text-emerald-700 focus:ring-emerald-600 mr-2"
                />
                <span>{t('custom.design.client', '客户自备设计稿 (提供标准1:1展开刀模图)')}</span>
              </label>
              <label className="inline-flex items-center text-xs text-stone-800 font-medium cursor-pointer">
                <input
                  type="radio"
                  name="designSource"
                  checked={!data.useCustomerDesign}
                  onChange={() => onChange({ useCustomerDesign: false, needDesignService: true })}
                  className="text-emerald-700 focus:ring-emerald-600 mr-2"
                />
                <span>{t('custom.needStudioRadio', '需要工坊协助')}</span>
              </label>
            </div>

            {data.useCustomerDesign ? (
              <div>
                <button
                  type="button"
                  onClick={() => designFileInputRef.current?.click()}
                  className="w-full py-2.5 px-3.5 border border-stone-300 hover:border-emerald-600 rounded-xl text-xs font-semibold text-stone-700 hover:text-emerald-900 bg-white flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs"
                >
                  <input
                    ref={designFileInputRef}
                    type="file"
                    accept=".ai,.pdf,.psd,.zip,.rar"
                    className="hidden"
                    onChange={handleSimulatedDesignUpload}
                  />
                  <UploadCloud className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('custom.uploadDielineBtn', '上传展开刀模源文件 (AI / PDF / PSD)')}</span>
                </button>
                {data.designFileName && (
                  <p className="text-xs text-emerald-900 font-mono font-medium mt-1.5">
                    ✓ {t('custom.uploaded', '已绑定矢量源文件')}：{data.designFileName}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onChange({ designServiceType: 'free_basic' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer shadow-2xs ${
                      data.designServiceType === 'free_basic'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700/30'
                        : 'border-stone-200/90 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="font-bold">{t('custom.design.standard', '工坊基础排版 (免费协助居中排版)')}</div>
                    <div className="text-[10px] text-stone-700 font-normal mt-0.5">{t('custom.freeBasicDesc', '提供Logo+文案免费微调套模')}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange({ designServiceType: 'pro_custom' })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer shadow-2xs ${
                      data.designServiceType === 'pro_custom'
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold ring-1 ring-emerald-700/30'
                        : 'border-stone-200/90 bg-white text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate font-bold">{t('custom.design.custom', '原创高端定制')}</span>
                      <span className="text-[10px] text-amber-800 font-mono font-bold shrink-0 bg-amber-50 px-1.5 py-0.5 rounded">+¥500</span>
                    </div>
                    <div className="text-[10px] text-stone-700 font-normal mt-0.5">{t('custom.proDesignDesc', '资深茶礼设计师一对一原创手绘')}</div>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-stone-200/90 text-xs text-stone-700 leading-relaxed shadow-2xs">
            <span className="font-bold text-stone-900 block mb-1.5">{t('custom.guaranteeTitle', '设计服务质检承诺：')}</span>
            <span className="text-stone-700">1. {t('custom.guarantee1', '提交下单后 24 小时内出具首轮 3D 渲染图与 1:1 印刷刀模核对线；')}</span><br />
            <span className="text-stone-700">2. {t('custom.guarantee2', '免费赠送 3 次文案与细节调整修改；')}</span><br />
            <span className="text-stone-700">3. {t('custom.guarantee3', '生产前发送高清打样数码色卡对照，双向盖章签字后方可开机印刷。')}</span>
          </div>
        </div>
      </div>

      {/* Proof Preview Modal Simulation */}
      {showProofPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-stone-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <h3 className="font-bold text-stone-900 text-sm">
                  {t('custom.previewProof', '在线预览 3D 设计稿与色卡')}
                </h3>
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
              <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded bg-emerald-800 text-white font-medium">
                3D Preview
              </div>
              <div className="max-w-xs mx-auto py-6 border border-amber-400/40 rounded-lg bg-stone-950/60 p-4 shadow-inner">
                <div className="text-[11px] text-amber-400/70 tracking-widest uppercase mb-1">GELING TEA BOX DESIGN</div>
                <div className="text-base font-serif font-bold text-amber-200 mb-1">{data.boxTitle || '岁序茶礼 · 智创未来'}</div>
                <div className="text-[11px] text-stone-300 mb-3">{data.brandSlogan || '一杯好茶 · 礼遇知己'}</div>
                {data.hasLogo && (
                  <div className="inline-block px-3 py-1 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono mb-2">
                    [LOGO: {data.logoCraft}]
                  </div>
                )}
                <div className="text-[10px] text-stone-700 italic border-t border-stone-800 pt-2">
                  “{data.blessingText || '十年同行，茗香致远。'}”
                </div>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span>{t('custom.uploaded', '设计文件')}:</span>
                <span className="font-mono text-stone-900">{data.designFileName || '待上传'}</span>
              </div>
              <div className="flex justify-between">
                <span>Pantone:</span>
                <span className="font-mono text-stone-900">Pantone 871C (Gold) + Matte Black</span>
              </div>
              <div className="flex justify-between">
                <span>{t('custom.proofStatus', '确认状态')}:</span>
                <span className="font-semibold text-emerald-800">
                  {DESIGN_STATUS_STEPS.find(s => s.key === data.designStatus)?.label}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  onChange({ designStatus: 'pending_confirmation' });
                  setShowProofPreview(false);
                }}
                className="px-3 py-1.5 text-xs rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-700"
              >
                {t('common.cancel', '取消')}
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
                <span>{t('custom.confirmProof', '核对无误 · 立即签字确稿')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
