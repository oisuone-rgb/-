import React from 'react';
import { Printer, Download, X, ShieldCheck, CheckCircle } from 'lucide-react';
import { OrderRecord } from '../types';
import { formatCurrency } from '../utils/pricing';
import { useLanguage } from '../i18n/LanguageContext';

interface QuotationPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord;
}

export const QuotationPrintModal: React.FC<QuotationPrintModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-stone-300 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top bar controls */}
        <div className="px-6 py-3.5 bg-stone-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold">{t('modal.printTitle', '官方定制茶叶礼盒报价单与订购确认书')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t('modal.printBtn', '打印或另存为 PDF')}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document */}
        <div className="p-8 sm:p-10 overflow-y-auto bg-white text-stone-900 font-sans print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-emerald-900 pb-5 mb-6">
            <div>
              <div className="text-2xl font-bold tracking-tight text-emerald-950 font-serif">
                格领包装科技 · 茶礼包装定制中心
              </div>
              <div className="text-xs text-stone-700 mt-1">
                GELING PACKAGING TECHNOLOGY · B2B CUSTOM GIFT PACKAGING
              </div>
              <div className="text-xs text-stone-700 mt-0.5">
                工坊热线：400-880-9898 · 产业基地：浙江省温州市龙港新城格领包装科技
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-emerald-900 font-mono">
                正式报价单
              </div>
              <div className="text-xs text-stone-700 font-mono mt-1">单号: {order.orderNo}</div>
              <div className="text-xs text-stone-700 mt-0.5">编制日期: {order.createdAt}</div>
              <div className="text-xs text-emerald-800 font-semibold mt-1">
                报价有效期：15个自然日
              </div>
            </div>
          </div>

          {/* Customer & Project Basics */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-stone-50 text-xs">
            <div>
              <span className="font-bold text-stone-900 block mb-1">【询价客户信息】</span>
              <div>客户全称：{order.customer.customerName}</div>
              <div>联 系 人：{order.customer.contactPerson} ({order.customer.phone})</div>
              <div>电子邮箱：{order.customer.wechatOrEmail || '无'}</div>
              <div>开票要求：{order.customer.needInvoice ? (order.customer.invoiceType === 'special' ? '增值税专用发票(13%)' : '普通发票') : '不需要发票'}</div>
            </div>
            <div>
              <span className="font-bold text-stone-900 block mb-1">【生产与交期要求】</span>
              <div>生产类型：{order.production.productionType === 'spot' ? '现货' : order.production.productionType === 'semi_custom' ? '半定制' : '全定制'}</div>
              <div>紧急程度：{order.production.urgency === 'normal' ? '正常' : order.production.urgency === 'urgent' ? '加急' : '特急'}</div>
              <div>约定交付日：{order.production.latestDeliveryDate || '确稿后10天内'}</div>
              <div>发货物流：{order.logistics.shippingMethod === 'sf_express' ? '顺丰特快' : '德邦大件'}</div>
            </div>
          </div>

          {/* Product & Packaging Specifications */}
          <div className="mb-6 text-xs">
            <span className="font-bold text-stone-900 block mb-2">【定制规格明细】</span>
            <table className="w-full border-collapse border border-stone-200 text-left">
              <tbody>
                <tr className="bg-stone-100">
                  <td className="border border-stone-200 p-2 font-semibold w-1/4">茶叶产品组合</td>
                  <td className="border border-stone-200 p-2" colSpan={3}>
                    {order.teaProduct.items.map(t => `${t.teaName} × ${t.quantityInBox}罐 (${t.unitWeight}g/罐)`).join(' + ')}
                  </td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 font-semibold">包装盒型</td>
                  <td className="border border-stone-200 p-2">{order.packaging.boxModel}</td>
                  <td className="border border-stone-200 p-2 font-semibold w-1/4">礼盒外尺寸</td>
                  <td className="border border-stone-200 p-2 font-mono">
                    {order.packaging.dimensions.length} × {order.packaging.dimensions.width} × {order.packaging.dimensions.height} mm
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="border border-stone-200 p-2 font-semibold">材质用料</td>
                  <td className="border border-stone-200 p-2">{order.packaging.material} ({order.packaging.boxColor})</td>
                  <td className="border border-stone-200 p-2 font-semibold">内托材质</td>
                  <td className="border border-stone-200 p-2">{order.packaging.innerTrayMaterial}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 font-semibold">表面特殊工艺</td>
                  <td className="border border-stone-200 p-2" colSpan={3}>
                    {order.packaging.surfaceFinishes.join('、') || '常规印刷覆膜'}
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="border border-stone-200 p-2 font-semibold">Logo与文案定制</td>
                  <td className="border border-stone-200 p-2" colSpan={3}>
                    Logo工艺：{order.customization.hasLogo ? order.customization.logoCraft : '不印Logo'} | 主题：{order.customization.boxTitle} | 寄语：{order.customization.blessingText}
                  </td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 font-semibold">手提袋与外箱</td>
                  <td className="border border-stone-200 p-2" colSpan={3}>
                    手提袋：{order.packaging.needHandbag ? `${order.packaging.handbagCraft} (${order.packaging.handbagHandleType})` : '无'} | 瓦楞外箱：{order.packaging.needOuterBox ? `含 (${order.packaging.unitsPerOuterBox}套/箱)` : '无'}
                  </td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="border border-stone-200 p-2 font-semibold">短溢装条款</td>
                  <td className="border border-stone-200 p-2" colSpan={3}>
                    {order.pricing.acceptOverage === 'reject' ? '严格按定额交付，不接受短溢' : order.pricing.acceptOverage === 'accept_3' ? '接受工业标准 ±3% 短溢（按实收件数多退少补）' : '接受 ±5% 短溢'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pricing Calculation Breakdown */}
          <div className="mb-6 text-xs">
            <span className="font-bold text-stone-900 block mb-2">【费用分项核算明细】</span>
            <table className="w-full border-collapse border border-stone-200 text-left text-xs">
              <thead className="bg-emerald-900 text-white font-semibold">
                <tr>
                  <th className="border border-stone-200 p-2">核算项目</th>
                  <th className="border border-stone-200 p-2">规格与单价基准</th>
                  <th className="border border-stone-200 p-2 text-right">订购数量</th>
                  <th className="border border-stone-200 p-2 text-right">分项金额 (RMB)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-stone-200 p-2 font-medium">1. 茶叶商品金额</td>
                  <td className="border border-stone-200 p-2">内含茶叶及精工密封罐</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{order.pricing.quantity} 套</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{formatCurrency(order.pricing.teaAmount)}</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="border border-stone-200 p-2 font-medium">2. 包装礼盒金额 (含外箱)</td>
                  <td className="border border-stone-200 p-2">特种灰板盒身 + 内托 + 强化运输箱</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{order.pricing.quantity} 套</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{formatCurrency(order.pricing.boxAmount)}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 font-medium">3. 配套手提袋</td>
                  <td className="border border-stone-200 p-2">加厚特种白卡 + 专用丝带提手</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{order.pricing.quantity} 套</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{formatCurrency(order.pricing.handbagAmount)}</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="border border-stone-200 p-2 font-medium">4. 定制工艺及制版工时费</td>
                  <td className="border border-stone-200 p-2">烫金版/局部UV/击凸版费及单套加工</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">1 批</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{formatCurrency(order.pricing.craftAmount)}</td>
                </tr>
                <tr>
                  <td className="border border-stone-200 p-2 font-medium">5. 设计排版服务费</td>
                  <td className="border border-stone-200 p-2">刀模图排版及3D效果图渲染</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">1 项</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{formatCurrency(order.pricing.designAmount)}</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="border border-stone-200 p-2 font-medium">6. 物流运费预估</td>
                  <td className="border border-stone-200 p-2">按实重约 {(order.pricing.quantity * 1.2).toFixed(0)}kg 发往收货地</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">干线速运</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">{formatCurrency(order.pricing.shippingAmount)}</td>
                </tr>
                <tr className="text-emerald-800 font-semibold bg-emerald-50">
                  <td className="border border-stone-200 p-2 font-medium">7. 阶梯批量采购优惠</td>
                  <td className="border border-stone-200 p-2" colSpan={2}>达标阶梯量大从优让利</td>
                  <td className="border border-stone-200 p-2 text-right font-mono">- {formatCurrency(order.pricing.discountAmount)}</td>
                </tr>
                <tr className="bg-stone-100 font-bold text-sm">
                  <td className="border border-stone-200 p-3" colSpan={2}>
                    应付总金额 (含税含运费)：
                  </td>
                  <td className="border border-stone-200 p-3 text-right font-mono" colSpan={2}>
                    <span className="text-base text-emerald-950">{formatCurrency(order.pricing.totalAmount)}</span>
                    <span className="text-xs font-normal text-stone-600 block">
                      (折合单套综合单价：{formatCurrency(order.pricing.unitPrice)} / 套)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms and Signatures */}
          <div className="border-t-2 border-stone-300 pt-4 text-[11px] text-stone-600 space-y-2">
            <div className="font-bold text-stone-900">【生产与交收条款协议】</div>
            <p>1. 本报价单经双方盖章或签字后具有订购合同同等效力，定金按总额30%支付后启动备料打样；</p>
            <p>2. 印刷色差以经双方签字认定的数码色卡或实物封样为准，成品尺寸误差在 ±1mm 范围内属于行业公差；</p>
            <p>3. 双方确认设计稿件锁定生产后，如因客户单方变更设计导致的制版及纸张废品费用由客户承担。</p>

            <div className="grid grid-cols-2 gap-10 pt-8 mt-6">
              <div className="border-t border-stone-300 pt-2">
                <span className="font-bold text-stone-900 block mb-1">供方：格领包装工坊茶礼中心 (盖章)</span>
                <div className="h-10 text-stone-700 italic">业务代表签字：__________________</div>
                <div>日期：2026 年 ___ 月 ___ 日</div>
              </div>
              <div className="border-t border-stone-300 pt-2">
                <span className="font-bold text-stone-900 block mb-1">需方：{order.customer.customerName} (盖章)</span>
                <div className="h-10 text-stone-700 italic">授权签约人：__________________</div>
                <div>日期：2026 年 ___ 月 ___ 日</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
