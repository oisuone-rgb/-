import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Cpu, 
  Wand2, 
  Layers, 
  Zap, 
  Check, 
  Copy, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  X, 
  RefreshCw,
  Send,
  HelpCircle,
  PackageCheck
} from 'lucide-react';
import { OrderRecord } from '../types';
import { 
  fetchAIConsult, 
  fetchAICopywrite, 
  fetchAIAudit, 
  AIConsultResult, 
  AICopywriteOption, 
  AIAuditResult 
} from '../utils/aiService';
import { formatCurrency } from '../utils/pricing';

interface AIPackagingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: OrderRecord;
  currentOrder?: OrderRecord;
  onApplyConfig: (config: AIConsultResult['suggestedConfig']) => void;
  onApplyCopywriting: (copy: { boxTitle: string; brandSlogan: string; blessingText: string }) => void;
}

type AITab = 'generate' | 'audit' | 'copywriting' | 'qa';

const PRESET_PROMPTS = [
  '中秋高新科技企业高端茶礼，1000套，预算200元/套，西湖龙井与武夷红茶双罐，要沉稳黑金烫金磁吸盒',
  '集团年会VIP伴手礼，500套，特级大红袍，白金简约抽屉盒带精致手提袋，加急7天内发货',
  '政商高端拜访私享茶礼，200套，明前龙井，157g意大利触感纸特装盒，浮雕击凸+烫哑金',
  '新锐国潮茶饮品牌批量定制，3000套，追求极简环保艺术纸盒与最优经济效益'
];

export const AIPackagingStudioModal: React.FC<AIPackagingStudioModalProps> = ({
  isOpen,
  onClose,
  order: propOrder,
  currentOrder,
  onApplyConfig,
  onApplyCopywriting
}) => {
  const effectiveOrder = propOrder || currentOrder;
  const [activeTab, setActiveTab] = useState<AITab>('generate');

  // Tab 1: Generate State
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<AIConsultResult | null>(null);
  const [appliedNotification, setAppliedNotification] = useState(false);

  // Tab 2: Audit State
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AIAuditResult | null>(null);

  // Tab 3: Copywriting State
  const [copyTheme, setCopyTheme] = useState('中秋礼赞 · 知己同行');
  const [copyBrand, setCopyBrand] = useState(effectiveOrder?.customer?.customerName || '格领包装客户');
  const [copyTone, setCopyTone] = useState('科技典雅、尊贵商务、深厚底蕴');
  const [isCopywriting, setIsCopywriting] = useState(false);
  const [copyOptions, setCopyOptions] = useState<AICopywriteOption[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Tab 4: QA State
  const [qaMessages, setQaMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: '您好！我是格领包装科技示范基地首席包装工程师 AI。针对茶叶礼盒盒型结构、烫金套位精度、EVA内胆阻隔性、食品级生产标准等任何工程疑问，我均可为您实时解答。'
    }
  ]);
  const [qaInput, setQaInput] = useState('');
  const [isQaThinking, setIsQaThinking] = useState(false);

  // Auto trigger audit when switching to audit tab
  useEffect(() => {
    if (activeTab === 'audit' && !auditResult && isOpen) {
      handleRunAudit();
    }
  }, [activeTab, isOpen]);

  if (!isOpen) return null;

  // Handler: Generate
  const handleGenerate = async (customText?: string) => {
    const textToUse = customText || userPrompt;
    if (!textToUse.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetchAIConsult(textToUse, effectiveOrder);
      setGenerateResult(res);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Apply generated config
  const handleApplyGenerated = () => {
    if (generateResult?.suggestedConfig) {
      onApplyConfig(generateResult.suggestedConfig);
      setAppliedNotification(true);
      setTimeout(() => setAppliedNotification(false), 3000);
    }
  };

  // Handler: Audit
  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetchAIAudit(effectiveOrder);
      setAuditResult(res);
    } finally {
      setIsAuditing(false);
    }
  };

  // Handler: Copywrite
  const handleGenerateCopywriting = async () => {
    setIsCopywriting(true);
    try {
      const res = await fetchAICopywrite(copyTheme, copyBrand, copyTone);
      setCopyOptions(res);
    } finally {
      setIsCopywriting(false);
    }
  };

  // Handler: QA send
  const handleSendQa = async () => {
    if (!qaInput.trim()) return;
    const userMsg = qaInput.trim();
    setQaInput('');
    setQaMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsQaThinking(true);

    try {
      const res = await fetchAIConsult(`专业包装工程技术问答：${userMsg}`, effectiveOrder);
      const reply = res.recommendationText || '格领包装示范基地具备从数码打样、激光刀模、四色海德堡印刷到自动化全自动贴盒的完整闭环，可确保套位精度达到 ±0.3mm。';
      setQaMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setQaMessages(prev => [
        ...prev, 
        { role: 'assistant', text: '国家食品级包装规范要求内胆材质必须通过挥发物及重金属迁移检测。我们选用高密无味环保EVA并覆食品级绒布，可完美保护茶叶并防止串味。' }
      ]);
    } finally {
      setIsQaThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-950/40 text-slate-100 overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40">
              <Cpu className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  格领 AI 包装智造顾问
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                    Gemini 3.8 Flash
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                龙港新城科技示范基地 · 智能化意图定制、包装工程可行性诊断与品牌文案创作
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-2 pb-0 bg-slate-900/80 border-b border-slate-800 flex items-center gap-1 sm:gap-2 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'generate'
                ? 'border-cyan-400 text-cyan-300 bg-slate-800/60 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI 智能意图定制</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-teal-400 text-teal-300 bg-slate-800/60 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI 成本与交期智审</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('copywriting')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'copywriting'
                ? 'border-indigo-400 text-indigo-300 bg-slate-800/60 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI 品牌文案与贺词</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qa')}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-1.5 border-b-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'qa'
                ? 'border-amber-400 text-amber-300 bg-slate-800/60 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>包装工程百问百答</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: AI 智能意图定制 */}
          {activeTab === 'generate' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-2">
                  输入您的定制想法或自然语言要求（预算、茶叶类别、盒型风格、交期要求等）：
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="例如：科技金融企业中秋定制，1000套，预算200元左右，需要黑金烫金磁吸翻盖盒配龙井和大红袍，附带手提袋，加急10天出货..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleGenerate()}
                    disabled={isGenerating || !userPrompt.trim()}
                    className="absolute right-2.5 bottom-3.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shadow-sm"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>AI 智算中...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>开始生成方案</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick preset pills */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">快速选用预设需求灵感：</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_PROMPTS.map((promptText, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setUserPrompt(promptText);
                        handleGenerate(promptText);
                      }}
                      className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/50 text-left text-xs text-slate-300 hover:text-cyan-200 transition cursor-pointer group flex items-start gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 group-hover:scale-110 transition" />
                      <span className="line-clamp-2 leading-relaxed">{promptText}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generated Result Display */}
              {generateResult && (
                <div className="mt-4 p-4.5 rounded-2xl bg-slate-800/90 border border-cyan-500/40 shadow-lg space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">AI 智能包装工程建议已生成</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyGenerated}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <PackageCheck className="w-4 h-4" />
                      <span>一键应用至当前订单</span>
                    </button>
                  </div>

                  {appliedNotification && (
                    <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-200 text-xs flex items-center gap-2 animate-in fade-in">
                      <Check className="w-4 h-4 text-teal-400" />
                      <span>已成功将 AI 建议的盒型、茶叶、工艺与排产参数填充至当前订单！</span>
                    </div>
                  )}

                  {/* Recommendation Text */}
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    {generateResult.recommendationText}
                  </div>

                  {/* Structured Spec Grid */}
                  {generateResult.suggestedConfig && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block mb-0.5">推荐盒型结构</span>
                        <span className="font-bold text-cyan-300">{generateResult.suggestedConfig.boxModel || '精装磁吸书型盒'}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block mb-0.5">茶叶原料组合</span>
                        <span className="font-bold text-white truncate block">
                          {generateResult.suggestedConfig.teaItems?.map(t => t.teaName).join(' + ') || '西湖龙井 + 金骏眉'}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block mb-0.5">推荐订购批量</span>
                        <span className="font-bold text-teal-300 font-mono">
                          {generateResult.suggestedConfig.recommendedQuantity || 500} 套
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block mb-0.5">预估生产周期</span>
                        <span className="font-bold text-amber-300 font-mono">
                          {generateResult.suggestedConfig.estimatedDays || 10} 天
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI 成本与交期智审 */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-slate-200">当前订单工程与成本深度诊断</span>
                </div>
                <button
                  type="button"
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                  <span>重新诊断</span>
                </button>
              </div>

              {isAuditing ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">正在分析订单材料物理阻隔率、烫金开机费摊销与产线负荷...</p>
                </div>
              ) : auditResult ? (
                <div className="space-y-4 animate-in fade-in">
                  {/* Score Card */}
                  <div className="p-4.5 rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 border border-teal-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-teal-400 font-bold block uppercase tracking-wider">
                        工业量产制造匹配度
                      </span>
                      <div className="text-sm font-semibold text-white mt-1">
                        {auditResult.summaryRating}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl sm:text-4xl font-black font-mono text-teal-300">
                        {auditResult.score}<span className="text-sm font-normal text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Dimension Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold">
                        <TrendingDown className="w-4 h-4" />
                        <span>阶梯成本优化建议</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{auditResult.costOptimizationTip}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <Clock className="w-4 h-4" />
                        <span>排产与工期保障分析</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{auditResult.leadTimeWarning}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>茶叶防潮与包材匹配</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{auditResult.materialCompatibility}</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: AI 品牌文案与专属贺词 */}
          {activeTab === 'copywriting' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">礼赠主题</label>
                  <select
                    value={copyTheme}
                    onChange={(e) => setCopyTheme(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                  >
                    <option value="中秋礼赞 · 知己同行">中秋月圆 · 礼赞知己</option>
                    <option value="企业周年 · 共创辉煌">企业周年 · 共创辉煌</option>
                    <option value="商务答谢 · 尊享私藏">商务答谢 · 尊享私藏</option>
                    <option value="岁末年礼 · 祥瑞迎新">岁末年礼 · 祥瑞迎新</option>
                    <option value="清雅茶叙 · 禅意修心">清雅茶叙 · 禅意修心</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">企业 / 品牌名称</label>
                  <input
                    type="text"
                    value={copyBrand}
                    onChange={(e) => setCopyBrand(e.target.value)}
                    placeholder="例如：格领科技、未来资本..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">文案风格调性</label>
                  <select
                    value={copyTone}
                    onChange={(e) => setCopyTone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-100"
                  >
                    <option value="现代科技与沉稳商务">科技商务 · 沉稳大气</option>
                    <option value="宋风雅韵与古典茶诗">宋风雅韵 · 东方美学</option>
                    <option value="至简轻奢与年轻时尚">简约轻奢 · 雅致留白</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateCopywriting}
                  disabled={isCopywriting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isCopywriting ? '正在创作文案...' : '生成专属茶礼文案组合'}</span>
                </button>
              </div>

              {/* Options Output */}
              {copyOptions.length > 0 && (
                <div className="space-y-3 pt-2">
                  {copyOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-indigo-400/60 transition space-y-2.5 text-xs relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                          {opt.style}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(`${opt.boxTitle} | ${opt.brandSlogan} | ${opt.blessingText}`);
                              setCopiedIndex(idx);
                              setTimeout(() => setCopiedIndex(null), 2000);
                            }}
                            className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700/50 hover:bg-slate-700 transition cursor-pointer flex items-center gap-1"
                          >
                            {copiedIndex === idx ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedIndex === idx ? '已复制' : '复制'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onApplyCopywriting({
                                boxTitle: opt.boxTitle,
                                brandSlogan: opt.brandSlogan,
                                blessingText: opt.blessingText
                              });
                              setAppliedNotification(true);
                              setTimeout(() => setAppliedNotification(false), 2500);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition cursor-pointer flex items-center gap-1"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>填入当前表单</span>
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">礼盒主题名称:</span>
                          <span className="font-bold text-white">{opt.boxTitle}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">品牌 Slogan:</span>
                          <span className="text-slate-200">{opt.brandSlogan}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block mb-0.5">贺卡/腰封祝福语:</span>
                          <span className="text-slate-200 italic">“{opt.blessingText}”</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 包装工程百问百答 */}
          {activeTab === 'qa' && (
            <div className="flex flex-col h-[380px] space-y-3">
              <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                {qaMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-xl max-w-[82%] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-cyan-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isQaThinking && (
                  <div className="flex gap-2 text-xs text-slate-400 items-center">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                    <span>总工程师 AI 正在核验技术规范...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2 shrink-0">
                <input
                  type="text"
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendQa()}
                  placeholder="询问任何关于打样色差、烫金套印公差、食品级EVA、交期赔付等技术问题..."
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
                <button
                  type="button"
                  onClick={handleSendQa}
                  disabled={!qaInput.trim() || isQaThinking}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>提问</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            浙江龙港新城格领包装科技示范基地 · 算价核心直连
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition cursor-pointer"
          >
            完成并返回
          </button>
        </div>

      </div>
    </div>
  );
};
