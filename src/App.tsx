import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  StepProgressNav, 
  SECTIONS 
} from './components/StepProgressNav';
import { 
  CustomerInfoSection 
} from './components/CustomerInfoSection';
import { 
  TeaProductSection 
} from './components/TeaProductSection';
import { 
  PackagingSection 
} from './components/PackagingSection';
import { 
  CustomizationSection 
} from './components/CustomizationSection';
import { 
  PricingSection 
} from './components/PricingSection';
import { 
  ProductionSection 
} from './components/ProductionSection';
import { 
  LogisticsSection 
} from './components/LogisticsSection';
import { 
  FloatingQuoteCard 
} from './components/FloatingQuoteCard';
import { 
  OrderLifecycleModal 
} from './components/OrderLifecycleModal';
import { 
  QuotationPrintModal 
} from './components/QuotationPrintModal';
import { 
  AIPackagingStudioModal 
} from './components/AIPackagingStudioModal';
import { 
  OrderRecord, 
  OrderWorkflowStatus 
} from './types';
import { 
  INITIAL_EMPTY_ORDER, 
  PRESET_TEMPLATES 
} from './data/presets';
import { 
  calculateOrderPrice,
  formatCurrency 
} from './utils/pricing';
import { AIConsultResult } from './utils/aiService';
import { 
  CheckCircle, 
  Sparkles, 
  Info, 
  ArrowUp, 
  Send, 
  CheckCircle2, 
  FileCheck2,
  Share2,
  Printer,
  Cpu,
  Zap
} from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

function AppContent() {
  const { t } = useLanguage();

  // Current active order state with defensive deep merge
  const [order, setOrder] = useState<OrderRecord>(() => {
    const saved = localStorage.getItem('tea_custom_order_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_EMPTY_ORDER,
            ...parsed,
            customer: { ...INITIAL_EMPTY_ORDER.customer, ...(parsed.customer || {}) },
            teaProduct: { 
              ...INITIAL_EMPTY_ORDER.teaProduct, 
              ...(parsed.teaProduct || {}),
              items: Array.isArray(parsed?.teaProduct?.items) && parsed.teaProduct.items.length > 0
                ? parsed.teaProduct.items
                : INITIAL_EMPTY_ORDER.teaProduct.items
            },
            packaging: { 
              ...INITIAL_EMPTY_ORDER.packaging, 
              ...(parsed.packaging || {}),
              surfaceFinishes: Array.isArray(parsed?.packaging?.surfaceFinishes)
                ? parsed.packaging.surfaceFinishes
                : INITIAL_EMPTY_ORDER.packaging.surfaceFinishes
            },
            customization: { ...INITIAL_EMPTY_ORDER.customization, ...(parsed.customization || {}) },
            pricing: { ...INITIAL_EMPTY_ORDER.pricing, ...(parsed.pricing || {}) },
            production: { ...INITIAL_EMPTY_ORDER.production, ...(parsed.production || {}) },
            logistics: { ...INITIAL_EMPTY_ORDER.logistics, ...(parsed.logistics || {}) }
          };
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_EMPTY_ORDER;
  });

  const [activeSection, setActiveSection] = useState<string>('section-customer');
  const [isLifecycleModalOpen, setIsLifecycleModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitSuccessBanner, setShowSubmitSuccessBanner] = useState(false);

  // 自动重新计算价格 (核心联动引擎：任何茶叶、包装、工艺、设计、物流、数量变动都实时同步更新)
  const currentPricing = useMemo(() => {
    return calculateOrderPrice(
      order.teaProduct,
      order.packaging,
      order.customization,
      order.production,
      order.logistics,
      order.pricing.quantity
    );
  }, [
    order.teaProduct,
    order.packaging,
    order.customization,
    order.production,
    order.logistics,
    order.pricing.quantity
  ]);

  // 同步价格到 order.pricing
  useEffect(() => {
    setOrder(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        ...currentPricing
      }
    }));
  }, [currentPricing]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 快速载入预设方案
  const handleSelectPreset = (presetId: string) => {
    const target = PRESET_TEMPLATES.find(p => p.id === presetId);
    if (target) {
      setOrder({
        ...(target.data as OrderRecord),
        orderId: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        orderNo: 'TEA-' + new Date().getFullYear() + '09-' + Math.floor(1000 + Math.random() * 9000),
        updatedAt: new Date().toLocaleString()
      });
      showToast(`已成功载入【${target.name}】方案参数！`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 一键应用 AI 包装顾问生成的定制配置
  const handleApplyAIConfig = (config: AIConsultResult['suggestedConfig']) => {
    setOrder(prev => {
      const updatedTeaItems = config.teaItems && config.teaItems.length > 0 
        ? config.teaItems.map((item, idx) => ({
            id: 'tea-' + Date.now() + '-' + idx,
            teaName: item.teaName || '精选名优茶',
            category: (item.teaCategory === '红茶' ? 'black' : item.teaCategory === '乌龙茶' ? 'oolong' : item.teaCategory === '白茶' ? 'white' : 'green') as any,
            spec: (item.packagingVessel as any) || '精工密封八角金属罐',
            unitWeight: item.weightPerUnit || 100,
            quantityInBox: item.unitsPerSet || 2,
            unitPriceEstimate: 68
          }))
        : prev.teaProduct.items;

      return {
        ...prev,
        teaProduct: {
          ...prev.teaProduct,
          items: updatedTeaItems
        },
        packaging: {
          ...prev.packaging,
          material: config.boxMaterial || prev.packaging.material,
          needHandbag: config.hasHandbag !== undefined ? config.hasHandbag : prev.packaging.needHandbag,
          handbagCraft: config.handbagMaterial || prev.packaging.handbagCraft
        },
        customization: {
          ...prev.customization,
          brandSlogan: config.brandSlogan || prev.customization.brandSlogan,
          blessingText: config.blessingText || prev.customization.blessingText
        },
        pricing: {
          ...prev.pricing,
          quantity: config.recommendedQuantity || prev.pricing.quantity
        },
        production: {
          ...prev.production,
          urgency: (config.urgency as any) || prev.production.urgency
        },
        updatedAt: new Date().toLocaleString()
      };
    });
    showToast('✨ 已成功将 AI 包装定制方案一键同步到订单参数！');
  };

  // 一键应用 AI 品牌与礼盒文案
  const handleApplyAICopywriting = (copy: { boxTitle: string; brandSlogan: string; blessingText: string }) => {
    setOrder(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        boxTitle: copy.boxTitle || prev.customization.boxTitle,
        brandSlogan: copy.brandSlogan || prev.customization.brandSlogan,
        blessingText: copy.blessingText || prev.customization.blessingText
      },
      updatedAt: new Date().toLocaleString()
    }));
    showToast('✨ 已同步 AI 生成的定制礼盒主题、品牌口号与包装贺词！');
  };

  // 保存草稿
  const handleSaveDraft = () => {
    localStorage.setItem('tea_custom_order_draft', JSON.stringify(order));
    showToast(t('app.saveDraft') + ' OK!');
  };

  // 提交订单
  const handleSubmitOrder = () => {
    if (!order.customer.customerName || !order.customer.contactPerson || !order.customer.phone) {
      showToast('⚠️ ' + t('customer.name') + ' & ' + t('customer.contact') + ' & ' + t('customer.phone'));
      scrollToSection('section-customer');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOrder(prev => ({
        ...prev,
        status: 'pending_quote',
        updatedAt: new Date().toLocaleString()
      }));
      setShowSubmitSuccessBanner(true);
      showToast('🎉 ' + t('banner.successTitle') + order.orderNo);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Calculate completed status for the 7 steps
  const completedSections: Record<string, boolean> = {
    'section-customer': Boolean(order.customer.customerName?.trim() && order.customer.phone?.trim()),
    'section-tea': order.teaProduct.items.length > 0,
    'section-packaging': Boolean(order.packaging.boxModel),
    'section-custom': Boolean(order.customization.designStatus),
    'section-pricing': order.pricing.quantity > 0,
    'section-production': Boolean(order.production.productionType),
    'section-logistics': Boolean(order.logistics.shippingMethod),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-950 pb-24 lg:pb-16 antialiased">
      {/* 1. Global App Header */}
      <Header
        orderNo={order.orderNo}
        orderStatus={order.status}
        onOpenLifecycle={() => setIsLifecycleModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenAIStudio={() => setIsAIStudioOpen(true)}
        onSelectPreset={handleSelectPreset}
        onSaveDraft={handleSaveDraft}
        onSubmitOrder={handleSubmitOrder}
        isSubmitting={isSubmitting}
      />

      {/* 2. Step Anchor Navigation */}
      <StepProgressNav
        activeSection={activeSection}
        onSelectSection={scrollToSection}
        completedSections={completedSections}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* AI Quick Launcher & Engine Status Banner */}
        <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3.5 relative overflow-hidden group">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-slate-950 flex items-center justify-center shrink-0 font-bold shadow-md shadow-cyan-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white text-sm sm:text-base tracking-tight">格领 AI 智造顾问现已接入</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono border border-cyan-400/30">
                  Gemini 3.8 Flash 实时驱动
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                支持自然语言定制方案推荐、包装盒型与工艺组合、AI 成本与交期工程智审、品牌专属文案撰写
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsAIStudioOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>启动 AI 智造顾问</span>
            </button>
          </div>
        </div>

        {/* Success Banner if submitted */}
        {showSubmitSuccessBanner && (
          <div className="mb-6 p-4.5 rounded-2xl bg-emerald-800 text-white shadow-md flex items-center justify-between flex-wrap gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-300 text-emerald-950 flex items-center justify-center font-bold shadow-xs shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  {t('banner.successTitle')}{order.orderNo}
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {t('banner.successDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur transition cursor-pointer"
              >
                {t('banner.viewQuote')}
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitSuccessBanner(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white text-emerald-900 text-xs font-semibold hover:bg-stone-50 transition cursor-pointer shadow-2xs"
              >
                {t('banner.dismiss')}
              </button>
            </div>
          </div>
        )}

        {/* Quick presets strip */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200/70">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-stone-900">{t('scenario.bannerTitle')}</span>
              <span className="text-stone-700 hidden sm:inline ml-2">{t('scenario.bannerSub')}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRESET_TEMPLATES.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className="px-3 py-1 text-xs rounded-xl border border-stone-200 bg-stone-50/70 hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 transition font-medium cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Layout: Left Form (8 cols), Right Floating Quote (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form Modules (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. 客户基本信息 */}
            <div className="space-y-2">
              <CustomerInfoSection
                data={order.customer}
                onChange={(updated) => setOrder(prev => ({ ...prev, customer: { ...prev.customer, ...updated } }))}
              />
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-tea')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 px-3.5 py-1.5 rounded-lg hover:bg-emerald-50/70 transition cursor-pointer"
                >
                  <span>下一步: 2. 茶叶规格组合</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 2. 产品基础信息 (茶叶产品) */}
            <div className="space-y-2">
              <TeaProductSection
                data={order.teaProduct}
                onChange={(updated) => setOrder(prev => ({ ...prev, teaProduct: { ...prev.teaProduct, ...updated } }))}
              />
              <div className="flex justify-between items-center pt-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-customer')}
                  className="text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                >
                  ← 上一步: 客户信息
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('section-packaging')}
                  className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 px-3.5 py-1.5 rounded-lg hover:bg-emerald-50/70 transition cursor-pointer"
                >
                  <span>下一步: 3. 礼盒包装材质</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 3. 礼盒包装信息 */}
            <div className="space-y-2">
              <PackagingSection
                data={order.packaging}
                onChange={(updated) => setOrder(prev => ({ ...prev, packaging: { ...prev.packaging, ...updated } }))}
              />
              <div className="flex justify-between items-center pt-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-tea')}
                  className="text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                >
                  ← 上一步: 茶叶规格
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('section-custom')}
                  className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 px-3.5 py-1.5 rounded-lg hover:bg-emerald-50/70 transition cursor-pointer"
                >
                  <span>下一步: 4. 定制工艺信息</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 4. 定制信息 (Logo/文案/设计稿状态) */}
            <div className="space-y-2">
              <CustomizationSection
                data={order.customization}
                onChange={(updated) => setOrder(prev => ({ ...prev, customization: { ...prev.customization, ...updated } }))}
                onOpenAICopywrite={() => setIsAIStudioOpen(true)}
              />
              <div className="flex justify-between items-center pt-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-packaging')}
                  className="text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                >
                  ← 上一步: 礼盒包装
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('section-pricing')}
                  className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 px-3.5 py-1.5 rounded-lg hover:bg-emerald-50/70 transition cursor-pointer"
                >
                  <span>下一步: 5. 数量阶梯与价格</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 5. 订单数量与价格信息 */}
            <div className="space-y-2">
              <PricingSection
                data={order.pricing}
                onChange={(updated) => setOrder(prev => ({ ...prev, pricing: { ...prev.pricing, ...updated } }))}
                onQuantityChange={(qty) => setOrder(prev => ({ ...prev, pricing: { ...prev.pricing, quantity: qty } }))}
                onOpenAIAudit={() => setIsAIStudioOpen(true)}
              />
              <div className="flex justify-between items-center pt-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-custom')}
                  className="text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                >
                  ← 上一步: 定制工艺
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('section-production')}
                  className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 px-3.5 py-1.5 rounded-lg hover:bg-emerald-50/70 transition cursor-pointer"
                >
                  <span>下一步: 6. 生产打样参数</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 6. 生产信息 */}
            <div className="space-y-2">
              <ProductionSection
                data={order.production}
                orderQuantity={order.pricing.quantity}
                onChange={(updated) => setOrder(prev => ({ ...prev, production: { ...prev.production, ...updated } }))}
              />
              <div className="flex justify-between items-center pt-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-pricing')}
                  className="text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                >
                  ← 上一步: 数量与价格
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('section-logistics')}
                  className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 px-3.5 py-1.5 rounded-lg hover:bg-emerald-50/70 transition cursor-pointer"
                >
                  <span>下一步: 7. 物流配送信息</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 7. 收货与物流信息 */}
            <div className="space-y-2">
              <LogisticsSection
                data={order.logistics}
                totalOrderQuantity={order.pricing.quantity}
                onChange={(updated) => setOrder(prev => ({ ...prev, logistics: { ...prev.logistics, ...updated } }))}
              />
              <div className="flex justify-between items-center pt-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => scrollToSection('section-production')}
                  className="text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                >
                  ← 上一步: 生产打样
                </button>
                <span className="text-emerald-800 font-medium text-xs bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  ✓ 全部配置步骤已就绪
                </span>
              </div>
            </div>

            {/* Bottom Final Submit Banner */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
                  <h4 className="font-bold text-stone-900 text-base">
                    {t('bottom.confirm')}
                  </h4>
                </div>
                <p className="text-xs text-stone-700 mt-1">
                  {t('bottom.sub')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="px-4 py-2.5 text-xs rounded-xl border border-stone-300 hover:bg-stone-50 hover:border-stone-400 text-stone-700 font-semibold transition cursor-pointer shadow-2xs"
                >
                  {t('card.preview')}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs sm:text-sm rounded-xl bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold shadow-md shadow-emerald-900/20 transition cursor-pointer disabled:opacity-50 ring-1 ring-emerald-900/40"
                >
                  {isSubmitting ? t('app.submitting') : t('app.submitInquiry')}
                </button>
              </div>
            </div>
          </div>

          {/* Right Sticky Floating Summary Card (4 cols) */}
          <div className="lg:col-span-4">
            <FloatingQuoteCard
              pricing={order.pricing}
              orderQuantity={order.pricing.quantity}
              boxModelName={order.packaging.boxModel}
              teaItemsCount={order.teaProduct.items.length}
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onOpenAIAudit={() => setIsAIStudioOpen(true)}
              onSaveDraft={handleSaveDraft}
              onSubmitOrder={handleSubmitOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>

      {/* Mobile Sticky Quick Summary & Action Dock (hidden on lg screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2.5 px-4 shadow-lg flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="text-[10px] text-slate-500 font-medium">总应付金额 ({order.pricing.quantity}套)</div>
          <div className="text-base font-bold font-mono text-teal-800 leading-none mt-0.5 tabular-nums">
            {formatCurrency(order.pricing.totalAmount)}
            <span className="text-[10px] text-slate-500 font-normal ml-1">
              (均价: {formatCurrency(order.pricing.unitPrice)}/套)
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAIStudioOpen(true)}
            className="p-2 text-teal-700 hover:bg-teal-50 rounded-xl border border-teal-200 text-xs font-semibold cursor-pointer shadow-2xs"
            title="AI 智造顾问"
          >
            <Cpu className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-300 text-xs font-semibold cursor-pointer shadow-2xs"
            title="打印预览"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={isSubmitting}
            className="px-4 py-2 bg-teal-800 hover:bg-teal-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-sm shadow-teal-900/20 cursor-pointer"
          >
            {isSubmitting ? t('app.submitting') : t('app.submitInquiry')}
          </button>
        </div>
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AI Packaging Studio Modal */}
      <AIPackagingStudioModal
        isOpen={isAIStudioOpen}
        onClose={() => setIsAIStudioOpen(false)}
        order={order}
        currentOrder={order}
        onApplyConfig={handleApplyAIConfig}
        onApplyCopywriting={handleApplyAICopywriting}
      />

      {/* Order Full Lifecycle Modal */}
      <OrderLifecycleModal
        isOpen={isLifecycleModalOpen}
        onClose={() => setIsLifecycleModalOpen(false)}
        currentStatus={order.status}
        onChangeStatus={(st: OrderWorkflowStatus) => {
          setOrder(prev => ({ ...prev, status: st }));
          showToast(`已将订单状态切换为【${st}】`);
        }}
      />

      {/* Official Printable Quotation Sheet Modal */}
      <QuotationPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        order={order}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
