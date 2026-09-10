import { OrderRecord } from '../types';
import { calculateOrderPrice } from '../utils/pricing';

export const INITIAL_EMPTY_ORDER: OrderRecord = {
  orderId: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
  orderNo: 'TEA-' + new Date().getFullYear() + '09-' + Math.floor(1000 + Math.random() * 9000),
  createdAt: '2026-09-10 10:30',
  updatedAt: '2026-09-10 10:30',
  status: 'pending_quote',
  customer: {
    customerName: '浙江天目数字科技有限公司',
    contactPerson: '林经理',
    phone: '13812345678',
    wechatOrEmail: 'lin.ming@tianmu-tech.com',
    customerType: 'enterprise',
    shippingAddress: '浙江省杭州市西湖区文三路科技大厦A座18层',
    needInvoice: true,
    invoiceType: 'special',
    invoiceTitle: '浙江天目数字科技有限公司',
    taxNumber: '91330106MA27X8888X',
    bankName: '招商银行杭州分行西湖支行',
    bankAccount: '5719 8888 1234 5678',
    invoiceEmail: 'finance@tianmu-tech.com'
  },
  teaProduct: {
    isCombination: true,
    items: [
      {
        id: 't-1',
        teaName: '西湖龙井（明前特级）',
        category: 'green',
        spec: '精工密封八角金属罐',
        unitWeight: 125,
        quantityInBox: 1,
        unitPriceEstimate: 68
      },
      {
        id: 't-2',
        teaName: '武夷大红袍（正岩肉桂）',
        category: 'oolong',
        spec: '精工密封八角金属罐',
        unitWeight: 125,
        quantityInBox: 1,
        unitPriceEstimate: 58
      }
    ],
    extraRemarks: '需附赠充氮保鲜小包，茶叶需出具原产地防伪追溯标'
  },
  packaging: {
    boxCategory: 'corporate',
    isStockTemplate: false,
    boxModel: 'book_box',
    dimensions: {
      length: 330,
      width: 240,
      height: 85
    },
    material: '1500g高密灰板触感纸',
    boxColor: '沉稳墨黑配鎏金内衬',
    surfaceFinishes: ['hot_stamping_gold', 'bump', 'uv'],
    innerTrayMaterial: 'eva_sponge',
    needHandbag: true,
    handbagHandleType: '高密黑色编制丝带',
    handbagCraft: '特种卡纸+LOGO哑光金',
    needOuterBox: true,
    outerBoxPrint: 'monochrome',
    unitsPerOuterBox: 10
  },
  customization: {
    hasLogo: true,
    logoFileName: 'Tianmu_Tech_Vector_Logo.ai',
    logoPosition: '礼盒正面正中偏上 + 手提袋单面',
    logoCraft: '哑光拉丝金+微浮雕击凸',
    boxTitle: '岁序茶礼 · 智创未来',
    blessingText: '十年同行，茗香致远。谨以此茶致敬并肩奋斗的同路人。',
    brandSlogan: '天目云联 · 智领未来',
    useCustomerDesign: true,
    designFileName: 'Tianmu_TeaBox_Packaging_v2.3.pdf',
    needDesignService: true,
    designServiceType: 'free_basic',
    designStatus: 'pending_confirmation'
  },
  pricing: {
    acceptOverage: 'accept_3',
    quantity: 500,
    teaAmount: 63000,
    boxAmount: 18500,
    handbagAmount: 3000,
    craftAmount: 2200,
    designAmount: 0,
    shippingAmount: 1850,
    discountAmount: 10404,
    totalAmount: 78146,
    unitPrice: 156.29
  },
  production: {
    productionType: 'semi_custom',
    productionQuantity: 500,
    needSample: true,
    sampleQuantity: 2,
    sampleStatus: 'sampling',
    estimatedProductionDays: 10,
    latestDeliveryDate: '2026-09-26',
    factorySupplier: '浙江省温州市龙港新城格领包装科技示范产线',
    urgency: 'normal'
  },
  logistics: {
    recipient: '林经理',
    phone: '13812345678',
    countryRegion: '中国',
    provinceCityDistrict: '浙江省 杭州市 西湖区',
    detailAddress: '文三路科技大厦A座18层前台',
    postalCode: '310012',
    shippingMethod: 'sf_express',
    isAppointedLogistics: true,
    appointedLogisticsName: '顺丰特快企业专签',
    appointedDeliveryDate: '2026-09-28',
    isBatchShipping: false,
    isBatchDistribution: true,
    batchAddresses: [
      {
        id: 'ba-1',
        recipient: '林经理 (杭州总部)',
        phone: '13812345678',
        address: '浙江省杭州市西湖区文三路科技大厦A座18层',
        allocatedSets: 250,
        notes: '总部中秋员工与到访贵宾礼'
      },
      {
        id: 'ba-2',
        recipient: '张总 (北京分公司)',
        phone: '13901012345',
        address: '北京市海淀区中关村南大街融科资讯中心B座8层',
        allocatedSets: 150,
        notes: '北京客户答谢专用'
      },
      {
        id: 'ba-3',
        recipient: '陈经理 (深圳研发中心)',
        phone: '13678901234',
        address: '广东省深圳市南山区粤海街道高新南一道科技园3栋5楼',
        allocatedSets: 100,
        notes: '大湾区生态伙伴赠礼'
      }
    ]
  }
};

// 预设模版库
export const PRESET_TEMPLATES = [
  {
    id: 'preset-midautumn',
    name: '企业中秋尊贵定制礼盒',
    desc: '500套企业客户礼品，双罐组合茶，触感黑金礼盒，支持批量多地址配送',
    badge: '中秋热门',
    data: INITIAL_EMPTY_ORDER
  },
  {
    id: 'preset-stock-fast',
    name: '商务伴手礼标准现货套装',
    desc: '100套快速出货，选用精选现货天地盖礼盒，加印烫金企业Logo，3天可发',
    badge: '闪电发货',
    data: {
      ...INITIAL_EMPTY_ORDER,
      orderId: 'ORD-STOCK-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      packaging: {
        ...INITIAL_EMPTY_ORDER.packaging,
        boxCategory: 'spot' as const,
        isStockTemplate: true,
        boxModel: 'tiandigai' as const,
        material: '1200g灰板特种纸',
        boxColor: '正德朱砂红',
        surfaceFinishes: ['hot_stamping_gold', 'laminate_matte'],
      },
      production: {
        ...INITIAL_EMPTY_ORDER.production,
        productionType: 'spot' as const,
        productionQuantity: 100,
        needSample: false,
        sampleStatus: 'none' as const,
        estimatedProductionDays: 3,
        urgency: 'normal' as const
      },
      customization: {
        ...INITIAL_EMPTY_ORDER.customization,
        needDesignService: false,
        designStatus: 'confirmed' as const
      },
      pricing: {
        ...INITIAL_EMPTY_ORDER.pricing,
        quantity: 100
      },
      logistics: {
        ...INITIAL_EMPTY_ORDER.logistics,
        isBatchDistribution: false,
        batchAddresses: []
      }
    }
  },
  {
    id: 'preset-luxury-wood',
    name: '国风漆器大红袍全定制礼盒',
    desc: '200套高端客户答谢，纯实木漆器工艺，四大名丛定制，专属资深设计师排版',
    badge: '高端奢华',
    data: {
      ...INITIAL_EMPTY_ORDER,
      orderId: 'ORD-LUX-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      teaProduct: {
        isCombination: true,
        items: [
          {
            id: 't-lux-1',
            teaName: '母树大红袍传统炭焙',
            category: 'oolong',
            spec: '紫砂密封陶罐',
            unitWeight: 100,
            quantityInBox: 2,
            unitPriceEstimate: 128
          },
          {
            id: 't-lux-2',
            teaName: '福鼎白茶十年陈老白茶',
            category: 'white',
            spec: '紫砂密封陶罐',
            unitWeight: 100,
            quantityInBox: 2,
            unitPriceEstimate: 98
          }
        ],
        extraRemarks: '附带大师监制茶饼收藏证书与原木茶则'
      },
      packaging: {
        ...INITIAL_EMPTY_ORDER.packaging,
        boxCategory: 'custom' as const,
        boxModel: 'double_door' as const,
        material: '纯实木黑胡桃漆器',
        boxColor: '暗金雕花仿古漆',
        surfaceFinishes: ['bump', 'hot_stamping_gold', 'uv'],
        innerTrayMaterial: 'satin_blister' as const,
        needHandbag: true,
        handbagHandleType: '真皮头层皮质提手',
        handbagCraft: '特种棉纸烫哑金',
      },
      production: {
        ...INITIAL_EMPTY_ORDER.production,
        productionType: 'full_custom' as const,
        productionQuantity: 200,
        needSample: true,
        sampleQuantity: 1,
        sampleStatus: 'pending_confirm' as const,
        estimatedProductionDays: 15,
        urgency: 'normal' as const
      },
      customization: {
        ...INITIAL_EMPTY_ORDER.customization,
        needDesignService: true,
        designServiceType: 'pro_custom',
        designStatus: 'designing' as const
      },
      pricing: {
        ...INITIAL_EMPTY_ORDER.pricing,
        quantity: 200
      }
    }
  }
];
