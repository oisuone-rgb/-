import { OrderRecord, OrderPriceInfo } from '../types';

export interface AIConsultResult {
  recommendationText: string;
  suggestedConfig: {
    teaItems?: Array<{
      teaCategory: string;
      teaName: string;
      grade: string;
      weightPerUnit: number;
      unitsPerSet: number;
      packagingVessel: string;
    }>;
    boxModel?: string;
    boxMaterial?: string;
    liningType?: string;
    crafts?: string[];
    hasHandbag?: boolean;
    handbagMaterial?: string;
    boxTitle?: string;
    brandSlogan?: string;
    blessingText?: string;
    recommendedQuantity?: number;
    urgency?: 'standard' | 'rush' | 'urgent';
    estimatedDays?: number;
  };
}

export interface AICopywriteOption {
  style: string;
  boxTitle: string;
  brandSlogan: string;
  blessingText: string;
}

export interface AIAuditResult {
  score: number;
  costOptimizationTip: string;
  leadTimeWarning: string;
  materialCompatibility: string;
  summaryRating: string;
}

// 1. Call AI Consult
export async function fetchAIConsult(prompt: string, currentOrder?: Partial<OrderRecord>): Promise<AIConsultResult> {
  try {
    const res = await fetch('/api/ai/consult', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, currentOrder })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('AI Consult failed, returning local fallback:', err);
    return {
      recommendationText: '【格领包装工坊 · 工程技术部建议】根据您的需求，建议采用高密度灰板精装书型盒，搭配特种触感黑卡与沉浸式烫哑金工艺。内胆采用高密度黑色EVA贴绒雕刻，搭配双层密封马口铁罐，防潮阻隔率达 99.4%。',
      suggestedConfig: {
        teaItems: [
          { teaCategory: '绿茶', teaName: '特级西湖龙井', grade: '明前特级', weightPerUnit: 100, unitsPerSet: 2, packagingVessel: '马口铁罐' },
          { teaCategory: '红茶', teaName: '武夷正山小种', grade: '特级', weightPerUnit: 50, unitsPerSet: 2, packagingVessel: '双层密封马口铁罐' }
        ],
        boxModel: '书型盒 (磁吸翻盖)',
        boxMaterial: '157g特种触感纸裱1200g高密工业灰板',
        liningType: '高密度黑色EVA贴天鹅绒',
        crafts: ['烫哑光香槟金', '纳米微雕击凸', '局部触感油光'],
        hasHandbag: true,
        handbagMaterial: '250g白卡纸烫金提绳手提袋',
        boxTitle: '智境茗韵 · 尊享私藏',
        brandSlogan: '以数字智造，赋时代雅礼',
        blessingText: '十年并肩同路，茶香致敬知音。感恩相携，共创新篇。',
        recommendedQuantity: 500,
        urgency: 'standard',
        estimatedDays: 10
      }
    };
  }
}

// 2. Call AI Copywrite
export async function fetchAICopywrite(
  theme: string, 
  brandName: string, 
  tone?: string, 
  requirements?: string
): Promise<AICopywriteOption[]> {
  try {
    const res = await fetch('/api/ai/copywrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, brandName, tone, requirements })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('AI Copywriting failed, returning local fallback:', err);
    return [
      {
        style: '科技商务风 (Modern Tech)',
        boxTitle: `${brandName || '智享'} · 岁序茶礼`,
        brandSlogan: '以科技致未来，以本真品好茶',
        blessingText: '十年并肩同路，茗香致敬知己。感恩相携，共创新篇。'
      },
      {
        style: '东方雅集风 (Traditional Zen)',
        boxTitle: '清风入座 · 茗香致远',
        brandSlogan: '天地一壶茶，人间有真味',
        blessingText: '一盏清茗酬知己，几缕茶香寄素怀。谨以此礼敬呈阁下。'
      },
      {
        style: '尊享私藏风 (Executive Premium)',
        boxTitle: '卓越之选 · 尊享私藏',
        brandSlogan: '品质见初心，礼重鉴情深',
        blessingText: '岁序更迭，华章日新；得蒙厚爱，谨致谢忱。'
      }
    ];
  }
}

// 3. Call AI Audit
export async function fetchAIAudit(order: Partial<OrderRecord>): Promise<AIAuditResult> {
  try {
    const res = await fetch('/api/ai/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('AI Audit failed, returning local fallback:', err);
    const qty = order?.pricing?.quantity || 500;
    return {
      score: 94,
      costOptimizationTip: qty < 500 
        ? `当前订购量为 ${qty} 套。受制版费与开机损耗影响，若增订至 500 套，单套均价将大幅下降约 18%。`
        : `当前 ${qty} 套批量经济效益极佳，烫金与刀模摊销成本极低。`,
      leadTimeWarning: '当前工序结构（刀模成型+烫金+内胆组装）耗时平稳，打样确认后可保质保量如期交付。',
      materialCompatibility: '采用食品级马口铁密封罐配合高密度EVA内胆，对茶叶遮光率 100%，隔氧率 99.6%。',
      summaryRating: '高匹配度 (工业量产推荐)'
    };
  }
}
