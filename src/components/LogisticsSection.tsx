import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Upload 
} from 'lucide-react';
import { LogisticsInfo, BatchAddressItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedShippingMethods } from '../i18n/optionsData';

interface LogisticsSectionProps {
  data: LogisticsInfo;
  totalOrderQuantity: number;
  onChange: (updated: Partial<LogisticsInfo>) => void;
}

export const LogisticsSection: React.FC<LogisticsSectionProps> = ({
  data,
  totalOrderQuantity,
  onChange
}) => {
  const { t } = useLanguage();
  const [importStatusMsg, setImportStatusMsg] = useState<string | null>(null);

  const SHIPPING_METHODS = getLocalizedShippingMethods(t);

  // 批量地址管理
  const handleAddBatchAddress = () => {
    const newAddr: BatchAddressItem = {
      id: 'ba-' + Date.now(),
      recipient: '',
      phone: '',
      address: '',
      allocatedSets: 50,
      notes: ''
    };
    onChange({ batchAddresses: [...(data.batchAddresses || []), newAddr] });
  };

  const handleUpdateBatchAddress = (id: string, field: Partial<BatchAddressItem>) => {
    const next = (data.batchAddresses || []).map(a => a.id === id ? { ...a, ...field } : a);
    onChange({ batchAddresses: next });
  };

  const handleRemoveBatchAddress = (id: string) => {
    onChange({ batchAddresses: (data.batchAddresses || []).filter(a => a.id !== id) });
  };

  // 模拟 Excel 导入
  const handleSimulatedExcelUpload = () => {
    setImportStatusMsg(t('log.parsingExcel', '正在解析 Excel 地址簿模板...'));
    setTimeout(() => {
      const mockImported: BatchAddressItem[] = [
        {
          id: 'ba-imp-1',
          recipient: '张总 (华北办事处)',
          phone: '13901018899',
          address: '北京市朝阳区建国门外大街1号国贸大厦A座32层',
          allocatedSets: Math.floor(totalOrderQuantity * 0.4),
          notes: '北京贵宾专送'
        },
        {
          id: 'ba-imp-2',
          recipient: '李总监 (华南大区)',
          phone: '13612349988',
          address: '广东省广州市天河区珠江新城花城大道88号双子塔西塔20层',
          allocatedSets: Math.floor(totalOrderQuantity * 0.35),
          notes: '广州合作伙伴礼'
        },
        {
          id: 'ba-imp-3',
          recipient: '王经理 (华东大区)',
          phone: '13816667788',
          address: '上海市浦东新区陆家嘴环路1000号恒生银行大厦15层',
          allocatedSets: totalOrderQuantity - Math.floor(totalOrderQuantity * 0.4) - Math.floor(totalOrderQuantity * 0.35),
          notes: '上海总仓'
        }
      ];
      onChange({
        isBatchDistribution: true,
        batchAddresses: mockImported
      });
      setImportStatusMsg(t('log.autoBalanceSuccess', '✓ 成功导入分发目标地址，已自动平衡数量！'));
      setTimeout(() => setImportStatusMsg(null), 4000);
    }, 600);
  };

  // 校验当前分配套数
  const totalAllocated = (data.batchAddresses || []).reduce((sum, a) => sum + (Number(a.allocatedSets) || 0), 0);
  const allocationDiff = totalOrderQuantity - totalAllocated;

  return (
    <div id="section-logistics" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono shrink-0">
            7
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {t('log.title', '收货与物流信息 (支持企业多地址批量配送)')}
            </h2>
            <p className="text-xs text-stone-700 mt-0.5">
              {t('log.sub', '配置送达方式、指定物流、预计到货日及企业批量分发地址簿')}
            </p>
          </div>
        </div>
      </div>

      {/* 1. 主送货地址基础信息 */}
      <div className="mb-6 p-4.5 sm:p-5 rounded-2xl bg-stone-50/40 border border-stone-200/90 shadow-2xs">
        <span className="block text-xs font-bold text-stone-900 mb-3.5">
          {t('log.primaryAddress', '首要收货地 / 集中送货地址 (单地配送时生效)')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
              {t('log.recipient', '收货人姓名')} <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-700 absolute left-3 top-3 shrink-0" />
              <input
                type="text"
                value={data.recipient}
                onChange={(e) => onChange({ recipient: e.target.value })}
                placeholder={t('log.recipient', '收货人姓名')}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
              {t('log.phone', '联系电话')} <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-700 absolute left-3 top-3 shrink-0" />
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder={t('log.phone', '联系电话')}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
              {t('log.region', '省 / 市 / 区')} <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              type="text"
              value={data.provinceCityDistrict}
              onChange={(e) => onChange({ provinceCityDistrict: e.target.value })}
              placeholder={t('log.region', '例如：浙江省 杭州市 西湖区')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
              {t('log.postcode', '邮编')}
            </label>
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => onChange({ postalCode: e.target.value })}
              placeholder="310000"
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <label className="block text-[11px] font-bold text-stone-700 mb-1.5 whitespace-nowrap">
              {t('log.addressDetail', '详细街道门牌地址')} <span className="text-rose-500 font-bold">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-700 absolute left-3 top-3 shrink-0" />
              <input
                type="text"
                value={data.detailAddress}
                onChange={(e) => onChange({ detailAddress: e.target.value })}
                placeholder={t('log.addressDetailPlaceholder', '详细写字楼、楼层、门牌号及是否需要货梯装卸要求')}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. 发货方式与指定物流 */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-stone-900 mb-2.5">
          {t('log.shippingMethod', '发货运输方式')}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3.5">
          {SHIPPING_METHODS.map(m => {
            const isSelected = data.shippingMethod === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => onChange({ shippingMethod: m.key as any })}
                className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between shadow-2xs ${
                  isSelected
                    ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20 shadow-xs'
                    : 'border-stone-200/90 hover:border-stone-300 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1.5">
                    <span className="text-xs font-bold text-stone-900 leading-snug">{m.label}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-stone-100 text-stone-800 whitespace-nowrap shrink-0">
                      {m.tag}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed line-clamp-2">{m.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Appointed Logistics & Appointed Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="p-3.5 bg-stone-50/60 rounded-xl border border-stone-200/90 text-xs shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-900">{t('log.appointedCarrier', '是否指定第三方特定物流')}</span>
              <input
                type="checkbox"
                checked={data.isAppointedLogistics}
                onChange={(e) => onChange({ isAppointedLogistics: e.target.checked })}
                className="w-4 h-4 text-emerald-700 focus:ring-emerald-600 rounded cursor-pointer"
              />
            </div>
            {data.isAppointedLogistics ? (
              <input
                type="text"
                value={data.appointedLogisticsName || ''}
                onChange={(e) => onChange({ appointedLogisticsName: e.target.value })}
                placeholder={t('log.appointedCarrierPlaceholder', '填写指定物流公司名称或月结协议卡号')}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white mt-1 shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700"
              />
            ) : (
              <p className="text-xs text-stone-700">{t('log.carrierAutoDispatch', '由工坊根据区域最优调配顺丰/德邦直发')}</p>
            )}
          </div>

          <div className="p-3.5 bg-stone-50/60 rounded-xl border border-stone-200/90 text-xs shadow-2xs">
            <span className="font-bold text-stone-900 block mb-2 whitespace-nowrap">{t('log.appointedDate', '期望指定到货日期')}</span>
            <div className="relative">
              <Calendar className="w-4 h-4 text-stone-700 absolute left-3 top-2.5 shrink-0" />
              <input
                type="date"
                value={data.appointedDeliveryDate}
                onChange={(e) => onChange({ appointedDeliveryDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono shadow-2xs focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 企业礼品核心特性：批量多地址配送 (Batch Corporate Distribution) */}
      <div className="p-4.5 sm:p-5 rounded-2xl border-2 border-dashed border-emerald-300/80 bg-emerald-50/20 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3.5 gap-2.5">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-emerald-800 shrink-0" />
            <div>
              <span className="text-xs font-bold text-stone-900 leading-snug">
                {t('log.batchTitle', '企业批量配送模式 (发往全国多个分支机构 / 客户专属直达)')}
              </span>
              <p className="text-xs text-stone-700 leading-tight mt-0.5">
                {t('log.batchSub', '针对中秋/年会礼赠，一件代发至不同分公司、门店或客户收礼人')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={data.isBatchDistribution}
                onChange={(e) => onChange({ isBatchDistribution: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700"></div>
            </label>
          </div>
        </div>

        {data.isBatchDistribution && (
          <div className="pt-3.5 border-t border-emerald-200/70 animate-in fade-in space-y-3.5">
            {/* Action buttons & Template download */}
            <div className="flex items-center justify-between flex-wrap gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleSimulatedExcelUpload}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-2xs transition cursor-pointer whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('log.uploadExcel', '上传 Excel 地址簿 (.xlsx)')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert(t('log.downloadAlert', '已为您下载标准收货地址Excel导入模板'))}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-semibold shadow-2xs transition cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('log.downloadTemplate', '下载标准导入模板')}</span>
                </button>
              </div>

              {/* Dynamic Quantity Balance Validator */}
              <div className="flex items-center gap-2.5 text-xs font-mono flex-wrap bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
                <span className="text-stone-700 whitespace-nowrap">
                  {t('log.orderTotal', '订单订购总数:')} <strong className="text-stone-900">{totalOrderQuantity}</strong> {t('common.sets', '套')}
                </span>
                <span className="text-stone-300">|</span>
                <span className={allocationDiff === 0 ? 'text-emerald-800 font-bold whitespace-nowrap' : 'text-amber-800 font-bold whitespace-nowrap'}>
                  {t('log.allocatedTotal', '当前已分配:')} {totalAllocated} {t('common.sets', '套')}
                </span>
                {allocationDiff === 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold flex items-center gap-1 whitespace-nowrap">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('log.balanced', '已平衡')}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center gap-1 whitespace-nowrap">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{allocationDiff > 0 ? `${t('log.short', '尚缺')} ${allocationDiff} ${t('common.sets', '套')}` : `${t('log.excess', '超额')} ${Math.abs(allocationDiff)} ${t('common.sets', '套')}`}</span>
                  </span>
                )}
              </div>
            </div>

            {importStatusMsg && (
              <div className="p-3 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-950 text-xs font-medium animate-in fade-in shadow-2xs">
                {importStatusMsg}
              </div>
            )}

            {/* Address rows table */}
            <div className="space-y-2.5">
              {(data.batchAddresses || []).map((item, idx) => (
                <div 
                  key={item.id} 
                  className="p-3.5 bg-white rounded-xl border border-stone-200/90 grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center text-xs shadow-2xs"
                >
                  <div className="sm:col-span-1 font-mono text-stone-700 font-bold">
                    #{idx + 1}
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      value={item.recipient}
                      onChange={(e) => handleUpdateBatchAddress(item.id, { recipient: e.target.value })}
                      placeholder={t('log.thRecipient', '分发收件人 (分公司/办事处)')}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-900 focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="tel"
                      value={item.phone}
                      onChange={(e) => handleUpdateBatchAddress(item.id, { phone: e.target.value })}
                      placeholder={t('log.thPhone', '收件电话')}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 font-mono text-stone-900 focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={item.address}
                      onChange={(e) => handleUpdateBatchAddress(item.id, { address: e.target.value })}
                      placeholder={t('log.thAddress', '详细收货地址')}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-stone-900 focus:ring-1 focus:ring-emerald-700"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        value={item.allocatedSets}
                        onChange={(e) => handleUpdateBatchAddress(item.id, { allocatedSets: Number(e.target.value) || 0 })}
                        className="w-full px-1.5 py-1.5 text-right font-mono font-bold text-emerald-900 rounded-lg border border-stone-300 pr-5 focus:ring-1 focus:ring-emerald-700"
                      />
                      <span className="absolute right-1.5 top-2 text-[10px] text-stone-700">{t('common.sets', '套')}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveBatchAddress(item.id)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 cursor-pointer transition"
                      title={t('common.delete', '删除此地址')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddBatchAddress}
                className="w-full py-2.5 border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-xl text-xs text-stone-700 hover:text-emerald-900 font-bold flex items-center justify-center gap-2 transition bg-white cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>{t('log.addAddress', '手工添加一个派送地址')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
