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
  OrderRecord, 
  OrderWorkflowStatus 
} from './types';
import { 
  INITIAL_EMPTY_ORDER, 
  PRESET_TEMPLATES 
} from './data/presets';
import { 
  calculateOrderPrice 
} from './utils/pricing';
import { 
  CheckCircle, 
  Sparkles, 
  Info, 
  ArrowUp, 
  Send, 
  CheckCircle2, 
  FileCheck2,
  Share2
} from 'lucide-react';

export default function App() {
  // Current active order state
  const [order, setOrder] = useState<OrderRecord>(() => {
    const saved = localStorage.getItem('tea_custom_order_draft');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_EMPTY_ORDER;
  });

  const [activeSection, setActiveSection] = useState<string>('section-customer');
  const [isLifecycleModalOpen, setIsLifecycleModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
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
        ...target.data,
        orderId: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        orderNo: 'TEA-' + new Date().getFullYear() + '09-' + Math.floor(1000 + Math.random() * 9000),
        updatedAt: new Date().toLocaleString()
      });
      showToast(`已成功载入【${target.name}】方案参数！`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 保存草稿
  const handleSaveDraft = () => {
    localStorage.setItem('tea_custom_order_draft', JSON.stringify(order));
    showToast('已成功保存当前询价单配置至本地草稿箱！');
  };

  // 提交订单
  const handleSubmitOrder = () => {
    if (!order.customer.customerName || !order.customer.contactPerson || !order.customer.phone) {
      showToast('⚠️ 请先完善第1模块中的客户名称、联系人及手机号码！');
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
      showToast('🎉 询价下单需求已成功提交！工坊已自动下发核价工单');
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

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 pb-16">
      {/* 1. Global App Header */}
      <Header
        orderNo={order.orderNo}
        orderStatus={order.status}
        onOpenLifecycle={() => setIsLifecycleModalOpen(true)}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onSelectPreset={handleSelectPreset}
        onSaveDraft={handleSaveDraft}
        onSubmitOrder={handleSubmitOrder}
        isSubmitting={isSubmitting}
      />

      {/* 2. Step Anchor Navigation */}
      <StepProgressNav
        activeSection={activeSection}
        onSelectSection={scrollToSection}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* Success Banner if submitted */}
        {showSubmitSuccessBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-800 text-white shadow-md flex items-center justify-between flex-wrap gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-300 text-emerald-950 flex items-center justify-center font-bold">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  询价订单已成功接收并进入核价流程！单号：{order.orderNo}
                </h3>
                <p className="text-xs text-emerald-100">
                  专属资深包装设计师与茶道顾问已收到您的需求，将在 2 小时内出具正式带章核价单并联系您确认打样。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold backdrop-blur cursor-pointer"
              >
                查看正式报价单
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitSuccessBanner(false)}
                className="px-3 py-1.5 rounded-lg bg-white text-emerald-900 text-xs font-semibold cursor-pointer"
              >
                知道了
              </button>
            </div>
          </div>
        )}

        {/* Quick presets banner */}
        <div className="mb-6 p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-bold text-stone-900">快速填入客户常用行业定制场景：</span>
            <span className="text-stone-700 hidden sm:inline">一键加载完整工艺参数、茶叶规格与批量配送数据</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_TEMPLATES.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPreset(p.id)}
                className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-stone-50 hover:bg-emerald-50 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 transition font-medium cursor-pointer"
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
            <CustomerInfoSection
              data={order.customer}
              onChange={(updated) => setOrder(prev => ({ ...prev, customer: { ...prev.customer, ...updated } }))}
            />

            {/* 2. 产品基础信息 (茶叶产品) */}
            <TeaProductSection
              data={order.teaProduct}
              onChange={(updated) => setOrder(prev => ({ ...prev, teaProduct: { ...prev.teaProduct, ...updated } }))}
            />

            {/* 3. 礼盒包装信息 */}
            <PackagingSection
              data={order.packaging}
              onChange={(updated) => setOrder(prev => ({ ...prev, packaging: { ...prev.packaging, ...updated } }))}
            />

            {/* 4. 定制信息 (Logo/文案/设计稿状态) */}
            <CustomizationSection
              data={order.customization}
              onChange={(updated) => setOrder(prev => ({ ...prev, customization: { ...prev.customization, ...updated } }))}
            />

            {/* 5. 订单数量与价格信息 */}
            <PricingSection
              data={order.pricing}
              onChange={(updated) => setOrder(prev => ({ ...prev, pricing: { ...prev.pricing, ...updated } }))}
              onQuantityChange={(qty) => setOrder(prev => ({ ...prev, pricing: { ...prev.pricing, quantity: qty } }))}
            />

            {/* 6. 生产信息 */}
            <ProductionSection
              data={order.production}
              orderQuantity={order.pricing.quantity}
              onChange={(updated) => setOrder(prev => ({ ...prev, production: { ...prev.production, ...updated } }))}
            />

            {/* 7. 收货与物流信息 */}
            <LogisticsSection
              data={order.logistics}
              totalOrderQuantity={order.pricing.quantity}
              onChange={(updated) => setOrder(prev => ({ ...prev, logistics: { ...prev.logistics, ...updated } }))}
            />

            {/* Bottom Final Submit Banner */}
            <div className="p-6 rounded-2xl bg-white border border-emerald-800/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-stone-900 text-base">
                  所有 7 项定制参数已确认无误？
                </h4>
                <p className="text-xs text-stone-700 mt-0.5">
                  点击提交后，系统将自动生成正式订购流水并同步推送至工厂排产生管系统。
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="px-4 py-2 text-xs rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold cursor-pointer"
                >
                  预览正式报价单
                </button>
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-sm shadow-emerald-900/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? '提交中...' : '提交询价下单'}
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
              onSaveDraft={handleSaveDraft}
              onSubmitOrder={handleSubmitOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-xl border border-stone-700 text-xs flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
