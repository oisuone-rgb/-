/**
 * Type definitions for Tea Gift Box Customization & Quotation System
 */

export type CustomerType = 'personal' | 'enterprise' | 'dealer';

export type InvoiceType = 'none' | 'normal' | 'special';

export interface CustomerInfo {
  customerName: string; // 客户姓名 / 公司名称 (必填)
  contactPerson: string; // 联系人 (必填)
  phone: string; // 手机号码 (必填)
  wechatOrEmail: string; // 微信 / 邮箱 (选填)
  customerType: CustomerType; // 客户类型 (必填)
  shippingAddress: string; // 常用收货地址 (必填)
  needInvoice: boolean;
  invoiceType: InvoiceType;
  invoiceTitle?: string;
  taxNumber?: string;
  bankName?: string;
  bankAccount?: string;
  invoiceEmail?: string;
}

export type TeaCategory = 'green' | 'black' | 'white' | 'puer' | 'oolong' | 'other';

export interface TeaProductItem {
  id: string;
  teaName: string; // 茶叶名称，如 西湖龙井、特级大红袍
  category: TeaCategory;
  spec: string; // 产品规格，如 2罐装、4罐装、小泡袋
  unitWeight: number; // 单罐/单盒净含量 (g)
  quantityInBox: number; // 礼盒内产品数量 (罐/盒)
  unitPriceEstimate: number; // 预估单克/单罐基准价 (元/罐)
}

export interface TeaProductInfo {
  isCombination: boolean; // 是否需要组合装 (例如龙井+红茶拼装)
  items: TeaProductItem[];
  extraRemarks: string;
}

export type BoxCategory = 'spot' | 'custom' | 'festival' | 'corporate';

export type BoxModelType = 
  | 'tiandigai' // 天地盖盒
  | 'book_box' // 书型磁吸盒
  | 'drawer_box' // 抽屉盒
  | 'double_door' // 双开门礼盒
  | 'portable_box' // 便携折叠礼盒
  | 'tin_set'; // 马口铁罐套盒

export interface BoxDimensions {
  length: number; // mm
  width: number; // mm
  height: number; // mm
}

export type SurfaceCraft = 
  | 'hot_stamping_gold' // 烫金
  | 'hot_stamping_silver' // 烫银
  | 'uv' // 局部UV
  | 'emboss_deboss' // 凹凸压印
  | 'laminate_matte' // 哑膜覆膜
  | 'laminate_gloss' // 亮膜覆膜
  | 'bump' // 击凸
  | 'screen_print'; // 丝网印刷

export type InnerTrayMaterial = 
  | 'pe_foam' // PE珍珠棉
  | 'eva_sponge' // 高密植绒海绵/EVA
  | 'paper_pulp' // 环保纸塑内托
  | 'satin_blister' // 缎布吸塑
  | 'cardboard'; // 纯纸卡折叠托

export interface BoxPackagingInfo {
  boxCategory: BoxCategory; // 通货现货 / 定制礼盒 / 节日礼盒 / 企业礼品礼盒
  isStockTemplate: boolean; // 是否已有模板/库存
  boxModel: BoxModelType;
  dimensions: BoxDimensions;
  material: string; // 用料/材质，如 1500g灰板特种纸、马口铁、黑胡桃漆木
  boxColor: string; // 颜色/版面风格
  surfaceFinishes: SurfaceCraft[];
  innerTrayMaterial: InnerTrayMaterial;
  needHandbag: boolean; // 是否需要手提袋
  handbagHandleType: string; // 提手工艺: 棉绳、丝带、皮质提手
  handbagCraft: string; // 烫金、覆膜
  needOuterBox: boolean; // 是否需要外箱
  outerBoxPrint: 'monochrome' | 'multicolor' | 'kraft_blank'; // 单色 / 多色 / 牛皮无印
  unitsPerOuterBox: number; // 多少套打一个箱 (如 5/10/12 套/箱)
}

export type PackagingInfo = BoxPackagingInfo;
export type PackagingType = BoxCategory;

export type DesignProofStatus = 
  | 'not_submitted' // 未提交
  | 'designing' // 设计中
  | 'pending_confirmation' // 待客户确认
  | 'confirmed' // 已确认
  | 'locked_production'; // 已锁定生产

export interface CustomizationInfo {
  hasLogo: boolean;
  logoFileName?: string;
  logoPosition: string; // 正面居中、右下角、盒内衬、手提袋正面
  logoCraft: string; // 烫哑金、UV高光、金属铭牌、丝印、压凹
  boxTitle: string; // 礼盒定制名称，如 "岁序茶礼"
  blessingText: string; // 定制祝福语
  brandSlogan: string; // 品牌 Slogan
  useCustomerDesign: boolean; // 是否使用客户提供设计 (AI/PDF/PSD)
  designFileName?: string;
  needDesignService: boolean; // 是否需要专业设计服务
  designServiceType: 'free_basic' | 'pro_custom'; // 免费排版 / 专属定制
  designStatus: DesignProofStatus; // 设计稿确认状态
}

export type OveragePolicy = 'reject' | 'accept_3' | 'accept_5';

export interface OrderPriceInfo {
  acceptOverage: OveragePolicy; // 是否接受短溢
  quantity: number; // 购买数量 (套)
  // 费用拆解
  teaAmount: number; // 商品茶叶金额
  boxAmount: number; // 盒子包装金额
  handbagAmount: number; // 手提袋金额
  craftAmount: number; // 定制工艺版费与加工费
  designAmount: number; // 设计费用
  shippingAmount: number; // 运费
  discountAmount: number; // 优惠金额
  totalAmount: number; // 应付总金额
  unitPrice: number; // 折合单套单价
}

export type ProductionType = 'spot' | 'semi_custom' | 'full_custom';

export type UrgencyLevel = 'normal' | 'urgent' | 'express';

export type SampleStatus = 'none' | 'sampling' | 'pending_confirm' | 'confirmed';

export interface ProductionInfo {
  productionType: ProductionType;
  productionQuantity: number;
  needSample: boolean; // 是否需要打样
  sampleQuantity: number;
  sampleStatus: SampleStatus; // 打样确认状态
  estimatedProductionDays: number;
  latestDeliveryDate: string; // 最晚交付日期
  factorySupplier: string; // 指定工坊/产线
  urgency: UrgencyLevel; // 紧急程度: 正常 / 加急 / 特急
}

export interface BatchAddressItem {
  id: string;
  recipient: string;
  phone: string;
  address: string;
  allocatedSets: number; // 对应分配套数
  notes?: string;
}

export interface LogisticsInfo {
  recipient: string;
  phone: string;
  countryRegion: string;
  provinceCityDistrict: string;
  detailAddress: string;
  postalCode: string;
  shippingMethod: 'sf_express' | 'deppon' | 'dedicated_truck' | 'standard_logistics';
  isAppointedLogistics: boolean;
  appointedLogisticsName?: string;
  appointedDeliveryDate: string;
  isBatchShipping: boolean; // 是否分批发货
  batchShippingPlan?: string;
  isBatchDistribution: boolean; // 企业批量配送多地址
  batchAddresses: BatchAddressItem[];
}

export type OrderWorkflowStatus = 
  | 'draft' // 草稿
  | 'pending_quote' // 待报价/待核价
  | 'pending_confirm' // 待确认
  | 'pending_payment' // 待付款
  | 'designing' // 设计中
  | 'pending_proof_confirm' // 待确认稿
  | 'pending_production' // 待生产/待打样
  | 'in_production' // 生产中
  | 'quality_check' // 质检
  | 'pending_shipping' // 待发货
  | 'shipped' // 已发货
  | 'completed'; // 已完成

export interface OrderRecord {
  orderId: string;
  orderNo: string;
  createdAt: string;
  updatedAt: string;
  status: OrderWorkflowStatus;
  customer: CustomerInfo;
  teaProduct: TeaProductInfo;
  packaging: BoxPackagingInfo;
  customization: CustomizationInfo;
  pricing: OrderPriceInfo;
  production: ProductionInfo;
  logistics: LogisticsInfo;
  operatorNotes?: string;
}
