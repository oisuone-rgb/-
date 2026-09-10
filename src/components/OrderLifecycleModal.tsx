import React from 'react';
import { 
  GitBranch, 
  CheckCircle2, 
  Clock, 
  FileText, 
  CreditCard, 
  Palette, 
  FileCheck, 
  Factory, 
  ShieldCheck, 
  Truck, 
  PackageCheck, 
  X,
  ArrowRight
} from 'lucide-react';
import { OrderWorkflowStatus } from '../types';

interface OrderLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderWorkflowStatus;
  onChangeStatus: (status: OrderWorkflowStatus) => void;
}

interface WorkflowStep {
  key: OrderWorkflowStatus;
  title: string;
  subTitle: string;
  role: string;
  deliverable: string;
  icon: React.ElementType;
}

const LIFECYCLE_STEPS: WorkflowStep[] = [
  {
    key: 'draft',
    title: '草稿',
    subTitle: '客户填写定制参数与规格',
    role: '客户',
    deliverable: '暂存本地定制草案',
    icon: FileText
  },
  {
    key: 'pending_quote',
    title: '待报价 / 待核价',
    subTitle: '系统自动核算基准价，资深包装师核准工艺',
    role: '智能计价系统 + 核价专员',
    deliverable: '正式定制报价单明细',
    icon: Clock
  },
  {
    key: 'pending_confirm',
    title: '待客户确认',
    subTitle: '客户核对工艺规格、数量、单价与交期条款',
    role: '客户采购决策人',
    deliverable: '回签订购确认书',
    icon: CheckCircle2
  },
  {
    key: 'pending_payment',
    title: '待付款 / 定金',
    subTitle: '客户支付30%-50%生产定金或走企业账期审批',
    role: '客户财务 + 平台结算',
    deliverable: '定金水单/电子发票预开',
    icon: CreditCard
  },
  {
    key: 'designing',
    title: '设计排版中',
    subTitle: '制作1:1刀模展开线、Logo专色菲林与3D效果图',
    role: '包装工程设计师',
    deliverable: '高精度印前刀模图PDF',
    icon: Palette
  },
  {
    key: 'pending_proof_confirm',
    title: '待确认设计稿',
    subTitle: '双向核对图文排版、色号、文字无误，盖章锁定',
    role: '客户品牌部/设计部',
    deliverable: '签字定稿协议 (免纠纷)',
    icon: FileCheck
  },
  {
    key: 'pending_production',
    title: '待排期 / 待打样',
    subTitle: '产线备料原纸、特种油墨，下发实物数码打样',
    role: '生管排程中心',
    deliverable: '实物封样件 / 生产工单',
    icon: Factory
  },
  {
    key: 'in_production',
    title: '生产制造中',
    subTitle: '海德堡印刷、模切、烫印、覆膜、手工裱盒装茶',
    role: '精工制造车间',
    deliverable: '流水线大货组装',
    icon: Factory
  },
  {
    key: 'quality_check',
    title: '出厂综合质检',
    subTitle: '检验盒面平整度、茶叶密封度、耐磨抗压度',
    role: 'QC质检科',
    deliverable: '出厂检验合格报告',
    icon: ShieldCheck
  },
  {
    key: 'pending_shipping',
    title: '待发货打包',
    subTitle: '套瓦楞运输外箱、打托盘防潮缠绕膜、分箱贴单',
    role: '智慧物流仓',
    deliverable: '物流发运交接单',
    icon: PackageCheck
  },
  {
    key: 'shipped',
    title: '已发货物流中',
    subTitle: '顺丰/德邦专车干线发运，支持批量多地址追踪',
    role: '干线物流承运商',
    deliverable: '运单号与实时轨迹',
    icon: Truck
  },
  {
    key: 'completed',
    title: '订单已完成',
    subTitle: '客户签收验货合格，开具全额发票与售后建档',
    role: '客户 + 客户成功经理',
    deliverable: '全额完税发票 & 归档',
    icon: CheckCircle2
  }
];

export const OrderLifecycleModal: React.FC<OrderLifecycleModalProps> = ({
  isOpen,
  onClose,
  currentStatus,
  onChangeStatus
}) => {
  if (!isOpen) return null;

  const currentIdx = LIFECYCLE_STEPS.findIndex(s => s.key === currentStatus);

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-200 flex items-center justify-center font-bold">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                茶叶礼盒定制全流程生命周期看板
              </h3>
              <p className="text-xs text-stone-700">
                从草稿、智能报价、设计定稿到车间精工排产及多地址物流的完整履约闭环
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-700 hover:text-stone-600 hover:bg-stone-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between flex-wrap gap-2">
            <span>
              💡 <strong>流程说明：</strong>各定制订单因现货/半定制/全定制属性不同，节点顺序略有差异；点击下方任意节点可模拟切换当前订单状态。
            </span>
          </div>

          {/* Timeline Nodes */}
          <div className="space-y-3">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isFuture = idx > currentIdx;

              return (
                <div
                  key={step.key}
                  onClick={() => onChangeStatus(step.key)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-emerald-700 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-700'
                      : isPast
                      ? 'border-stone-200 bg-white hover:bg-emerald-50/30'
                      : 'border-stone-200 bg-stone-50/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-emerald-800 text-amber-200 font-bold'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}>
                      {isPast ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-stone-700">0{idx + 1}</span>
                        <span className={`text-sm font-bold ${isCurrent ? 'text-emerald-950' : 'text-stone-900'}`}>
                          {step.title}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-800 text-white font-semibold animate-pulse">
                            当前进行中
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-700 mt-0.5">{step.subTitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-700 block">责任方 / 交付成果</span>
                      <span className="font-medium text-stone-800">{step.role} · {step.deliverable}</span>
                    </div>
                    <button
                      type="button"
                      className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                        isCurrent
                          ? 'bg-emerald-800 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isCurrent ? '当前节点' : '设为此状态'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-700">
          <span>当前订单单号已建立全程区块链/数字溯源档案</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 text-xs font-medium cursor-pointer"
          >
            关闭返回
          </button>
        </div>
      </div>
    </div>
  );
};
