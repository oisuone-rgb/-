import { Language } from './translations';
import { 
  BoxModelType, 
  PackagingType, 
  ProductionType, 
  UrgencyLevel, 
  SampleStatus, 
  DesignProofStatus,
  OveragePolicy
} from '../types';

export interface LocalizedOption {
  key: string;
  label: string;
  desc?: string;
  tag?: string;
  extra?: string;
}

export const getLocalizedBoxModels = (t: (k: string, f?: string) => string): {
  key: BoxModelType;
  name: string;
  desc: string;
  dimensions: { length: number; width: number; height: number };
  tag: string;
  tagColor: string;
}[] => [
  {
    key: 'tiandigai',
    name: t('packaging.model.tiandigai', '经典天地盖 (顶底盒)'),
    desc: t('packaging.model.tiandigai.desc', '经典稳固，开启具有庄重仪式感，适合中高档商务礼茶'),
    dimensions: { length: 320, width: 220, height: 85 },
    tag: t('packaging.model.tiandigai.tag', '经典高性价比'),
    tagColor: 'bg-stone-100 text-stone-700'
  },
  {
    key: 'book_box',
    name: t('packaging.model.book_box', '书型磁吸翻盖盒'),
    desc: t('packaging.model.book_box.desc', '如书籍般开启，内置强磁吸合，高端典雅，翻盖内衬可印诗词'),
    dimensions: { length: 340, width: 240, height: 90 },
    tag: t('packaging.model.book_box.tag', '企业定制优选'),
    tagColor: 'bg-emerald-50 text-emerald-800'
  },
  {
    key: 'drawer_box',
    name: t('packaging.model.drawer_box', '双层/抽屉式礼盒'),
    desc: t('packaging.model.drawer_box.desc', '拉带抽拉设计，层次丰富，可做上下两层或左右双抽'),
    dimensions: { length: 300, width: 210, height: 110 },
    tag: t('packaging.model.drawer_box.tag', '创意新颖'),
    tagColor: 'bg-blue-50 text-blue-800'
  },
  {
    key: 'double_door',
    name: t('packaging.model.double_door', '对开门/双开门礼盒'),
    desc: t('packaging.model.double_door.desc', '中间对开迎客，尊贵迎门礼遇，常搭配丝带打结或金属锁扣'),
    dimensions: { length: 360, width: 250, height: 95 },
    tag: t('packaging.model.double_door.tag', '奢华尊贵'),
    tagColor: 'bg-amber-50 text-amber-900'
  },
  {
    key: 'portable_box',
    name: t('packaging.model.portable_box', '手提折叠卡纸礼盒'),
    desc: t('packaging.model.portable_box.desc', '盒袋一体式结构，无需额外手提袋，环保经济，轻便易携'),
    dimensions: { length: 280, width: 190, height: 80 },
    tag: t('packaging.model.portable_box.tag', '免手提袋便携'),
    tagColor: 'bg-purple-50 text-purple-800'
  },
  {
    key: 'tin_set',
    name: t('packaging.model.tin_set', '高级马口铁盒组合'),
    desc: t('packaging.model.tin_set.desc', '食品级镀锡马口铁，高气密防潮避光，可永久留存使用'),
    dimensions: { length: 290, width: 200, height: 75 },
    tag: t('packaging.model.tin_set.tag', '金属密封'),
    tagColor: 'bg-cyan-50 text-cyan-800'
  }
];

export const getLocalizedSurfaceCrafts = (t: (k: string, f?: string) => string): {
  key: string;
  label: string;
  desc: string;
  feeHint: string;
}[] => [
  {
    key: 'hot_gold',
    label: t('packaging.craft.hot_gold', '烫金 (金箔压烫)'),
    desc: t('packaging.craft.hot_gold.desc', '经典高档金属反光质感，凸显品牌贵重感'),
    feeHint: t('packaging.craft.hot_gold.fee', '版费 ¥80 + ¥0.6/个')
  },
  {
    key: 'hot_silver',
    label: t('packaging.craft.hot_silver', '烫亮银 / 哑光银'),
    desc: t('packaging.craft.hot_silver.desc', '现代科技与冷淡奢华感，适合极简素雅风格'),
    feeHint: t('packaging.craft.hot_silver.fee', '版费 ¥80 + ¥0.6/个')
  },
  {
    key: 'spot_uv',
    label: t('packaging.craft.spot_uv', '局部立体水晶UV'),
    desc: t('packaging.craft.spot_uv.desc', '在暗哑纸面上形成凸起的高光透明水晶光泽'),
    feeHint: t('packaging.craft.spot_uv.fee', '菲林 ¥60 + ¥0.4/个')
  },
  {
    key: 'emboss',
    label: t('packaging.craft.emboss', '高浮雕击凸 (凹凸手感)'),
    desc: t('packaging.craft.emboss.desc', '采用黄铜精密雕刻模具，形成高耸生动的肌理'),
    feeHint: t('packaging.craft.emboss.fee', '铜模 ¥120 + ¥0.5/个')
  },
  {
    key: 'deboss',
    label: t('packaging.craft.deboss', '深压凹 (素雅无色印)'),
    desc: t('packaging.craft.deboss.desc', '不用色墨，纯靠压力压出深沉内敛的阴刻纹理'),
    feeHint: t('packaging.craft.deboss.fee', '钢模 ¥100 + ¥0.3/个')
  },
  {
    key: 'matte_film',
    label: t('packaging.craft.matte_film', '触感膜 / 哑光覆膜'),
    desc: t('packaging.craft.matte_film.desc', '婴儿肌肤般细腻天鹅绒触感，防水防刮花'),
    feeHint: t('packaging.craft.matte_film.fee', '¥1.2/套 (整盒全覆)')
  },
  {
    key: 'glitter',
    label: t('packaging.craft.glitter', '金葱磨砂闪粉工艺'),
    desc: t('packaging.craft.glitter.desc', '光线下微光烁动，如同洒金宣纸，层次丰富'),
    feeHint: t('packaging.craft.glitter.fee', '网版 ¥90 + ¥0.8/个')
  },
  {
    key: 'silk_screen',
    label: t('packaging.craft.silk_screen', '高浓专色丝网印'),
    desc: t('packaging.craft.silk_screen.desc', '墨层厚实遮盖力极强，支持荧光与金属专色'),
    feeHint: t('packaging.craft.silk_screen.fee', '印网 ¥50 + ¥0.5/色')
  }
];

export const getLocalizedInnerTrays = (t: (k: string, f?: string) => string): {
  key: string;
  label: string;
  desc: string;
}[] => [
  {
    key: 'eva',
    label: t('packaging.tray.eva', '高密黑/灰EVA雕刻'),
    desc: t('packaging.tray.eva.desc', '硬挺规整，CNC高精度数控雕刻，防震缓冲性能佳')
  },
  {
    key: 'pearl_cotton',
    label: t('packaging.tray.pearl_cotton', '环保珍珠棉(EPE)复绒'),
    desc: t('packaging.tray.pearl_cotton.desc', '轻便柔软，表面复合高档植绒，高性价比')
  },
  {
    key: 'paper_pulp',
    label: t('packaging.tray.paper_pulp', '原浆植物环保纸托'),
    desc: t('packaging.tray.paper_pulp.desc', '100%可降解甘蔗浆/竹浆，契合绿色ESG环保理念')
  },
  {
    key: 'satin_blister',
    label: t('packaging.tray.satin_blister', '吸塑内托包金边绸缎'),
    desc: t('packaging.tray.satin_blister.desc', '古典金黄色/明黄色绸缎褶皱，传统茶礼标配')
  },
  {
    key: 'cardboard',
    label: t('packaging.tray.cardboard', '环保全折叠卡纸内衬'),
    desc: t('packaging.tray.cardboard.desc', '无胶水纯结构卡扣成型，极简工业风，易于回收')
  }
];

export const getLocalizedMaterials = (t: (k: string, f?: string) => string): string[] => [
  t('packaging.mat.1200g', '1200g 灰板外裱进口特种触感纸 (主流高端商用)'),
  t('packaging.mat.1500g', '1500g 加厚高密度工业灰板外裱金银卡纸 (坚固重型)'),
  t('packaging.mat.wood', '天然原木整料/胡桃木大漆实木盒 (至尊收藏级)'),
  t('packaging.mat.bamboo', '环保深山楠竹碳化手工精制盒 (绿色生态禅意)'),
  t('packaging.mat.tin', '0.23mm 食品级优质马口铁 (保香耐潮高密密封)'),
  t('packaging.mat.kraft', '350g 原生态天然无漂白古法牛皮纸 (极简环保)')
];

export const getLocalizedColorThemes = (t: (k: string, f?: string) => string): {
  name: string;
  hex: string;
  border?: string;
}[] => [
  { name: t('theme.blackGold', '沉稳墨黑配鎏金'), hex: '#1c1917', border: '#78716c' },
  { name: t('theme.cinnabarRed', '正德朱砂中国红'), hex: '#991b1b' },
  { name: t('theme.forestGreen', '松石青绿山水黛'), hex: '#065f46' },
  { name: t('theme.imperialYellow', '盛唐御贡尊享黄'), hex: '#b45309' },
  { name: t('theme.pureWhite', '宋瓷素白极简银'), hex: '#f8fafc', border: '#cbd5e1' },
  { name: t('theme.kraftBrown', '天然古法原色牛皮'), hex: '#78350f' }
];

export const getLocalizedLogoPositions = (t: (k: string, f?: string) => string): string[] => [
  t('custom.pos.centerTop', '礼盒正面正中偏上 + 手提袋单面'),
  t('custom.pos.center', '礼盒正面正中央 (大气醒目)'),
  t('custom.pos.bottomRight', '礼盒右下角 (内敛低调)'),
  t('custom.pos.insideLid', '盒盖内衬翻开处 (私享尊荣)'),
  t('custom.pos.bellyBand', '外包封套腰封居中'),
  t('custom.pos.bothSides', '盒顶与手提袋双面统一定制')
];

export const getLocalizedLogoCrafts = (t: (k: string, f?: string) => string): string[] => [
  t('custom.craft.brushedGold', '哑光拉丝金+微浮雕击凸 (推荐)'),
  t('custom.craft.glossGold', '高光亮金 (传统奢华)'),
  t('custom.craft.matteSilver', '哑光银色 (极简冷淡)'),
  t('custom.craft.raisedUV', '高亮局部UV立显'),
  t('custom.craft.metalPlate', '定制专属拉丝金属贴标铭牌'),
  t('custom.craft.screenPrint', '纯色高浓丝网印'),
  t('custom.craft.blindDeboss', '无色深压凹 (素雅无墨)')
];

export const getLocalizedHandbagHandles = (t: (k: string, f?: string) => string): { value: string; label: string }[] => [
  { value: '高密黑色编制丝带', label: t('packaging.handle.ribbon', '高密编制丝带 (柔软优雅)') },
  { value: '三股纯棉棉绳提手', label: t('packaging.handle.cotton', '三股纯棉棉绳 (牢固耐磨)') },
  { value: '头层环保皮质提手', label: t('packaging.handle.leather', '头层真皮/皮质提手 (高端奢华)') },
  { value: '扁平涤纶织带', label: t('packaging.handle.polyester', '扁平涤纶织带 (极简商务)') }
];

export const getLocalizedOuterCartons = (t: (k: string, f?: string) => string): { value: string; label: string }[] => [
  { value: '5层特硬加强瓦楞外箱 (10套装/箱)', label: t('packaging.carton.5layer', '5层特硬瓦楞 (每箱10套装)') },
  { value: '7层出口级重载加固外箱 (8套装/箱 打托盘)', label: t('packaging.carton.7layer', '7层特级出口瓦楞 (每箱8套加木托)') },
  { value: '白牛皮独立运输防护箱 (12套装/箱)', label: t('packaging.carton.customMark', '定制箱唛白牛皮箱 (每箱12套精装)') }
];

export const getLocalizedTeaSpecs = (t: (k: string, f?: string) => string): string[] => [
  t('tea.spec.octagon', '八角精品马口铁罐 (经典高密封)'),
  t('tea.spec.ceramic', '景德镇定制紫砂陶罐 (尊贵陈化)'),
  t('tea.spec.aluminum', '极简拉丝铝合金金属圆罐 (现代商务)'),
  t('tea.spec.pouch', '充氮保鲜独立小泡铝箔袋 (便携免洗)'),
  t('tea.spec.customCan', '专属定制开模异形铁罐')
];

export const getLocalizedQuickTeas = (t: (k: string, f?: string) => string): {
  name: string;
  category: string;
  specs: string;
  unitWeight: number;
  quantityInBox: number;
  unitPrice: number;
}[] => [
  { 
    name: t('tea.quick.longjing', '特级西湖明前龙井'), 
    category: '绿茶', 
    specs: t('tea.spec.octagon', '八角精品马口铁罐 (经典高密封)'), 
    unitWeight: 50, 
    quantityInBox: 2, 
    unitPrice: 120 
  },
  { 
    name: t('tea.quick.jinjinmei', '武夷山原产金骏眉'), 
    category: '红茶', 
    specs: t('tea.spec.aluminum', '极简拉丝铝合金金属圆罐 (现代商务)'), 
    unitWeight: 60, 
    quantityInBox: 2, 
    unitPrice: 150 
  },
  { 
    name: t('tea.quick.dahongpao', '正岩大红袍(肉桂水仙双拼)'), 
    category: '乌龙茶', 
    specs: t('tea.spec.ceramic', '景德镇定制紫砂陶罐 (尊贵陈化)'), 
    unitWeight: 75, 
    quantityInBox: 2, 
    unitPrice: 168 
  },
  { 
    name: t('tea.quick.baihaoyinzhen', '福鼎十年陈白毫银针'), 
    category: '白茶', 
    specs: t('tea.spec.octagon', '八角精品马口铁罐 (经典高密封)'), 
    unitWeight: 40, 
    quantityInBox: 2, 
    unitPrice: 135 
  },
  { 
    name: t('tea.quick.puer', '云南勐海金芽熟普小沱茶'), 
    category: '普洱茶', 
    specs: t('tea.spec.pouch', '充氮保鲜独立小泡铝箔袋 (便携免洗)'), 
    unitWeight: 100, 
    quantityInBox: 2, 
    unitPrice: 88 
  }
];

export const getLocalizedDesignStatusSteps = (t: (k: string, f?: string) => string): {
  key: DesignProofStatus;
  label: string;
  desc: string;
  color: string;
}[] => [
  { 
    key: 'not_submitted', 
    label: t('custom.proof.notSubmitted', '未提交'), 
    desc: t('custom.proof.notSubmittedDesc', '客户设计源文件或Logo尚未上传'), 
    color: 'bg-stone-100 text-stone-700 border-stone-300' 
  },
  { 
    key: 'designing', 
    label: t('custom.proof.designing', '设计排版中'), 
    desc: t('custom.proof.designingDesc', '设计师正制作刀模展开图与效果图'), 
    color: 'bg-purple-50 text-purple-800 border-purple-300' 
  },
  { 
    key: 'pending_confirmation', 
    label: t('custom.proof.pendingConfirm', '待客户确认稿'), 
    desc: t('custom.proof.pendingConfirmDesc', '已出初稿/3D效果图，等待客户签字确认'), 
    color: 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-400/50' 
  },
  { 
    key: 'confirmed', 
    label: t('custom.proof.confirmed', '客户已确认'), 
    desc: t('custom.proof.confirmedDesc', '客户已签字核对尺寸、文案无误'), 
    color: 'bg-blue-50 text-blue-800 border-blue-300' 
  },
  { 
    key: 'locked_production', 
    label: t('custom.proof.locked', '已锁定生产'), 
    desc: t('custom.proof.lockedDesc', '稿件已下发制版CTP车间，不可再行变更'), 
    color: 'bg-emerald-50 text-emerald-900 border-emerald-400' 
  }
];

export const getLocalizedProductionTypes = (t: (k: string, f?: string) => string): {
  key: ProductionType;
  title: string;
  desc: string;
  days: string;
}[] => [
  { 
    key: 'spot', 
    title: t('prod.type.spot', '现货产品 (闪电发货)'), 
    desc: t('prod.type.spotDesc', '仓库已有现货礼盒，无需开模或印刷，最快1-3天安排发货'), 
    days: t('prod.typeSpotDays', '1 ~ 3 个工作日') 
  },
  { 
    key: 'semi_custom', 
    title: t('prod.type.semi', '半定制 (现货加印Logo/文案)'), 
    desc: t('prod.type.semiDesc', '采用精选库存高品质盒身，烫印客户指定Logo与腰封祝福语'), 
    days: t('prod.typeSemiDays', '5 ~ 7 个工作日') 
  },
  { 
    key: 'full_custom', 
    title: t('prod.type.full', '全定制 (从零开模专属生产)'), 
    desc: t('prod.type.fullDesc', '根据客户要求全新设计、打样、制版、印刷模切与手工裱糊'), 
    days: t('prod.typeFullDays', '12 ~ 18 个工作日') 
  }
];

export const getLocalizedUrgencyLevels = (t: (k: string, f?: string) => string): {
  key: UrgencyLevel;
  label: string;
  desc: string;
  badge: string;
  color: string;
}[] => [
  { 
    key: 'normal', 
    label: t('prod.urgency.normal', '正常排产'), 
    desc: t('prod.urgency.normalDesc', '按车间标准工时流水排程'), 
    badge: t('prod.urgency.normalBadge', '标准工期'), 
    color: 'border-stone-200 bg-white' 
  },
  { 
    key: 'urgent', 
    label: t('prod.urgency.urgent', '加急排产 (+12%加急费)'), 
    desc: t('prod.urgency.urgentDesc', '产线插单优先切纸、模切、烫印'), 
    badge: t('prod.urgency.urgentBadge', '工期缩短30%'), 
    color: 'border-amber-300 bg-amber-50/50 text-amber-900' 
  },
  { 
    key: 'express', 
    label: t('prod.urgency.express', '特急专班 (+25%特急费)'), 
    desc: t('prod.urgency.expressDesc', '24小时双班倒开机，专车押运'), 
    badge: t('prod.urgency.expressBadge', '工期缩短50%'), 
    color: 'border-red-300 bg-red-50/60 text-red-900' 
  }
];

export const getLocalizedShippingMethods = (t: (k: string, f?: string) => string): {
  key: string;
  label: string;
  desc: string;
  tag: string;
}[] => [
  { 
    key: 'sf_express', 
    label: t('log.sf', '顺丰特快 / 专签'), 
    desc: t('log.sfDesc', '时效极快，送货上楼，VIP独立专车取派'), 
    tag: t('log.tagRecommended', '推荐首选') 
  },
  { 
    key: 'deppon', 
    label: t('log.deppon', '德邦大件零担物流'), 
    desc: t('log.depponDesc', '适合大批量多托盘托运，防震打木架'), 
    tag: t('log.tagEconomical', '大批量经济') 
  },
  { 
    key: 'dedicated_truck', 
    label: t('log.truck', '专车包车直达'), 
    desc: t('log.truckDesc', '整车点对点一站式直达送抵，无中转损耗'), 
    tag: t('log.tagLuxury', '高端无损') 
  },
  { 
    key: 'standard_logistics', 
    label: t('log.standard', '全国专线普快'), 
    desc: t('log.standardDesc', '经济型干线物流，适合预算有限客户'), 
    tag: t('log.tagBasic', '基础经济') 
  }
];
