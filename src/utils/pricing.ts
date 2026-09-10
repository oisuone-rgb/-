import {
  TeaProductInfo,
  BoxPackagingInfo,
  CustomizationInfo,
  ProductionInfo,
  OrderPriceInfo,
  LogisticsInfo,
  SurfaceCraft,
  BoxModelType
} from '../types';

// 基础盒型基准价
const BOX_BASE_PRICES: Record<BoxModelType, number> = {
  tiandigai: 14.0, // 天地盖基础价
  book_box: 18.5, // 书型磁吸盒
  drawer_box: 19.8, // 抽屉式盒
  double_door: 24.0, // 双开门礼盒
  portable_box: 12.0, // 便携折叠礼盒
  tin_set: 22.0, // 马口铁盒套装
};

// 材质溢价系数
const MATERIAL_SURCHARGES: Record<string, number> = {
  '1200g灰板特种纸': 0,
  '1500g高密灰板触感纸': 4.5,
  '纯实木黑胡桃漆器': 38.0,
  '环保天然竹木盒': 22.0,
  '食品级特级马口铁': 6.0,
  '环保原生牛皮纸卡': -2.0,
};

// 内托基准价
const INNER_TRAY_PRICES: Record<string, number> = {
  pe_foam: 2.5, // PE珍珠棉
  eva_sponge: 5.5, // 高密植绒EVA海绵
  paper_pulp: 3.8, // 环保纸塑
  satin_blister: 4.2, // 缎布吸塑
  cardboard: 1.8, // 纸卡
};

// 单项表面工艺费用 (版费固定制版 + 单套加工工时费)
const CRAFT_CONFIGS: Record<SurfaceCraft, { plateFee: number; unitFee: number; label: string }> = {
  hot_stamping_gold: { plateFee: 180, unitFee: 1.5, label: '烫亮金/哑金' },
  hot_stamping_silver: { plateFee: 180, unitFee: 1.5, label: '烫哑光银' },
  uv: { plateFee: 220, unitFee: 1.2, label: '局部立显UV' },
  emboss_deboss: { plateFee: 200, unitFee: 1.0, label: '凹凸立体压纹' },
  laminate_matte: { plateFee: 0, unitFee: 0.8, label: '全盒哑膜覆膜' },
  laminate_gloss: { plateFee: 0, unitFee: 0.8, label: '全盒亮膜覆膜' },
  bump: { plateFee: 240, unitFee: 1.6, label: '高精度深击凸' },
  screen_print: { plateFee: 150, unitFee: 1.0, label: '高浓丝网印' },
};

/**
 * 阶梯折扣计算
 */
export function getVolumeDiscountRate(qty: number): number {
  if (qty >= 2000) return 0.22; // 22% 优惠
  if (qty >= 1000) return 0.18; // 18% 优惠
  if (qty >= 500) return 0.12; // 12% 优惠
  if (qty >= 300) return 0.08; // 8% 优惠
  if (qty >= 100) return 0.04; // 4% 优惠
  return 0; // 50套以下标准原价
}

/**
 * 核心自动价格计算器
 */
export function calculateOrderPrice(
  tea: TeaProductInfo,
  packaging: BoxPackagingInfo,
  custom: CustomizationInfo,
  production: ProductionInfo,
  logistics: LogisticsInfo,
  quantity: number
): OrderPriceInfo {
  const qty = Math.max(1, quantity);

  // 1. 茶叶商品金额计算
  let singleSetTeaCost = 0;
  tea.items.forEach(item => {
    // 单罐基准价 * 罐数
    const unitPrice = item.unitPriceEstimate || 45;
    singleSetTeaCost += unitPrice * (item.quantityInBox || 1);
  });
  // 如果茶叶未配置，给合理的默认西湖龙井2罐装基准 (每罐45元)
  if (singleSetTeaCost <= 0) {
    singleSetTeaCost = 90;
  }
  const teaAmount = singleSetTeaCost * qty;

  // 2. 包装盒子金额 (盒身 + 内托 + 外箱)
  const baseBoxPrice = BOX_BASE_PRICES[packaging.boxModel] || 15;
  const materialSurcharge = MATERIAL_SURCHARGES[packaging.material] || 2;
  const innerTrayCost = INNER_TRAY_PRICES[packaging.innerTrayMaterial] || 3;

  // 尺寸调整系数 (以 300x200x80 为基准 1.0)
  const baseVolume = 300 * 200 * 80;
  const currVolume = (packaging.dimensions?.length || 300) *
                     (packaging.dimensions?.width || 200) *
                     (packaging.dimensions?.height || 80);
  const sizeFactor = Math.min(1.6, Math.max(0.85, Math.cbrt(currVolume / baseVolume)));

  // 单个盒子裸造价
  const singleBoxCost = Math.round((baseBoxPrice * sizeFactor + materialSurcharge + innerTrayCost) * 10) / 10;

  // 外箱成本分摊 (按每箱几套算，纸箱一个约 12元)
  let singleCartonCost = 0;
  if (packaging.needOuterBox) {
    const unitsPerBox = packaging.unitsPerOuterBox || 10;
    const cartonPrice = packaging.outerBoxPrint === 'multicolor' ? 16 : 12;
    singleCartonCost = cartonPrice / unitsPerBox;
  }

  const boxAmount = Math.round((singleBoxCost + singleCartonCost) * qty * 100) / 100;

  // 3. 手提袋金额
  let handbagAmount = 0;
  let singleHandbagCost = 0;
  if (packaging.needHandbag) {
    singleHandbagCost = 4.8; // 特种白卡+加厚提手
    if (packaging.handbagCraft.includes('烫金')) singleHandbagCost += 1.2;
    if (packaging.handbagHandleType.includes('皮质')) singleHandbagCost += 2.0;
    handbagAmount = Math.round(singleHandbagCost * qty * 100) / 100;
  }

  // 4. 定制工艺费用 (表面工艺 + Logo定制)
  let craftPlateFees = 0;
  let craftUnitFees = 0;

  // 盒子表面工艺
  (packaging.surfaceFinishes || []).forEach(craft => {
    const cfg = CRAFT_CONFIGS[craft];
    if (cfg) {
      craftPlateFees += cfg.plateFee;
      craftUnitFees += cfg.unitFee;
    }
  });

  // Logo 工艺
  if (custom.hasLogo) {
    craftPlateFees += 150; // Logo制版锌版费
    craftUnitFees += 1.0; // 单件烫印费
  }

  const craftAmount = Math.round((craftPlateFees + craftUnitFees * qty) * 100) / 100;

  // 5. 设计服务费用
  let designAmount = 0;
  if (custom.needDesignService) {
    designAmount = custom.designServiceType === 'pro_custom' ? 600 : 0; // 免费基础排版0元，深度原创600元
  }

  // 6. 打样费 (如果勾选打样)
  let sampleFee = 0;
  if (production.needSample) {
    sampleFee = (production.sampleQuantity || 1) * 260; // 实物首样制作调试成本
  }

  // 7. 紧急加急附加费
  let urgencySurcharge = 0;
  if (production.urgency === 'urgent') {
    urgencySurcharge = (boxAmount + craftAmount) * 0.12; // 加急 12%
  } else if (production.urgency === 'express') {
    urgencySurcharge = (boxAmount + craftAmount) * 0.25; // 特急 25%
  }

  // 8. 运费计算 (根据套数估计重量, 每套净重含盒约 1.2kg)
  const totalWeightKg = qty * 1.2;
  let shippingAmount = 0;
  if (logistics.shippingMethod === 'sf_express') {
    // 顺丰大件陆运
    shippingAmount = Math.round(25 + totalWeightKg * 2.8);
  } else if (logistics.shippingMethod === 'dedicated_truck') {
    // 专车直达起步价
    shippingAmount = Math.max(1200, Math.round(totalWeightKg * 1.8));
  } else {
    // 德邦 / 普快
    shippingAmount = Math.round(20 + totalWeightKg * 1.9);
  }

  // 多地址配送附加分包手续费
  if (logistics.isBatchDistribution && logistics.batchAddresses?.length > 1) {
    shippingAmount += (logistics.batchAddresses.length - 1) * 35; // 每个额外分包地址 +35 元分拣发货费
  }

  // 9. 阶梯折扣与优惠
  const rawSubtotal = teaAmount + boxAmount + handbagAmount + craftAmount + designAmount + sampleFee + urgencySurcharge;
  const discountRate = getVolumeDiscountRate(qty);
  const discountAmount = Math.round(rawSubtotal * discountRate * 100) / 100;

  // 10. 应付总金额
  const totalAmount = Math.max(0, Math.round((rawSubtotal - discountAmount + shippingAmount) * 100) / 100);
  const unitPrice = Math.round((totalAmount / qty) * 100) / 100;

  return {
    acceptOverage: 'accept_3',
    quantity: qty,
    teaAmount: Math.round(teaAmount * 100) / 100,
    boxAmount: Math.round(boxAmount * 100) / 100,
    handbagAmount: Math.round(handbagAmount * 100) / 100,
    craftAmount: Math.round((craftAmount + sampleFee + urgencySurcharge) * 100) / 100,
    designAmount,
    shippingAmount,
    discountAmount,
    totalAmount,
    unitPrice
  };
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(val || 0);
}
