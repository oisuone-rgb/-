import React from 'react';
import { User, Building, Phone, Mail, MapPin, Receipt, CheckCircle2 } from 'lucide-react';
import { CustomerInfo, CustomerType, InvoiceType } from '../types';

interface CustomerInfoSectionProps {
  data: CustomerInfo;
  onChange: (updated: Partial<CustomerInfo>) => void;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  data,
  onChange
}) => {
  return (
    <div id="section-customer" className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              客户基本信息
            </h2>
            <p className="text-xs text-stone-700">用于识别询价客户主体、跟进服务及自动匹配企业专属账期与折扣</p>
          </div>
        </div>
        <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
          * 带红星为必填项
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Customer / Company Name */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            客户姓名 / 公司名称 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-stone-700 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={data.customerName}
              onChange={(e) => onChange({ customerName: e.target.value })}
              placeholder="例如：杭州龙坞茶叶合作社 / 浙江天目数字科技有限公司"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition bg-stone-50/50 hover:bg-white"
            />
          </div>
        </div>

        {/* Customer Type */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            客户类型 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-lg">
            {(
              [
                { key: 'enterprise', label: '企业定制' },
                { key: 'dealer', label: '渠道经销' },
                { key: 'personal', label: '个人私享' },
              ] as { key: CustomerType; label: string }[]
            ).map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => onChange({ customerType: t.key })}
                className={`py-1.5 text-xs font-medium rounded-md transition cursor-pointer ${
                  data.customerType === t.key
                    ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            联系人姓名 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-700 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={data.contactPerson}
              onChange={(e) => onChange({ contactPerson: e.target.value })}
              placeholder="例如：张经理 / 林女士"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition bg-stone-50/50 hover:bg-white"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            手机号码 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-700 absolute left-3 top-3" />
            <input
              type="tel"
              required
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="11位手机号码"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition bg-stone-50/50 hover:bg-white"
            />
          </div>
        </div>

        {/* WeChat / Email */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            微信 / 商务邮箱 <span className="text-stone-700 font-normal">(选填)</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-700 absolute left-3 top-3" />
            <input
              type="text"
              value={data.wechatOrEmail}
              onChange={(e) => onChange({ wechatOrEmail: e.target.value })}
              placeholder="微信号或用于接收PDF报价单的邮箱"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition bg-stone-50/50 hover:bg-white"
            />
          </div>
        </div>

        {/* Main Delivery Address */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            主要收货地址 / 注册地址 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-stone-700 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={data.shippingAddress}
              onChange={(e) => onChange({ shippingAddress: e.target.value })}
              placeholder="省、市、区及详细街道门牌号（企业批量发往多地址可在文末第7模块开启批量配送）"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition bg-stone-50/50 hover:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Invoice Information Accordion / Options */}
      <div className="mt-6 pt-5 border-t border-stone-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-semibold text-stone-800">开票信息 (选填)</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center text-xs text-stone-600 cursor-pointer">
              <input
                type="radio"
                name="invoiceRadio"
                checked={!data.needInvoice || data.invoiceType === 'none'}
                onChange={() => onChange({ needInvoice: false, invoiceType: 'none' })}
                className="text-emerald-600 focus:ring-emerald-500 mr-1.5"
              />
              不开发票
            </label>
            <label className="inline-flex items-center text-xs text-stone-600 cursor-pointer">
              <input
                type="radio"
                name="invoiceRadio"
                checked={data.needInvoice && data.invoiceType === 'normal'}
                onChange={() => onChange({ needInvoice: true, invoiceType: 'normal' })}
                className="text-emerald-600 focus:ring-emerald-500 mr-1.5"
              />
              增值税普通发票
            </label>
            <label className="inline-flex items-center text-xs text-stone-600 cursor-pointer">
              <input
                type="radio"
                name="invoiceRadio"
                checked={data.needInvoice && data.invoiceType === 'special'}
                onChange={() => onChange({ needInvoice: true, invoiceType: 'special' })}
                className="text-emerald-600 focus:ring-emerald-500 mr-1.5"
              />
              增值税专用发票 (13%)
            </label>
          </div>
        </div>

        {data.needInvoice && data.invoiceType !== 'none' && (
          <div className="mt-3.5 p-4 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">发票抬头</label>
              <input
                type="text"
                value={data.invoiceTitle || ''}
                onChange={(e) => onChange({ invoiceTitle: e.target.value })}
                placeholder="公司法定全称"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">统一社会信用代码/税号</label>
              <input
                type="text"
                value={data.taxNumber || ''}
                onChange={(e) => onChange({ taxNumber: e.target.value })}
                placeholder="18位税号"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">发票接收电子邮箱</label>
              <input
                type="email"
                value={data.invoiceEmail || ''}
                onChange={(e) => onChange({ invoiceEmail: e.target.value })}
                placeholder="用于接收数电发票"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
              />
            </div>
            {data.invoiceType === 'special' && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">开户银行名称</label>
                  <input
                    type="text"
                    value={data.bankName || ''}
                    onChange={(e) => onChange({ bankName: e.target.value })}
                    placeholder="例如：招商银行杭州分行"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">银行银行账号</label>
                  <input
                    type="text"
                    value={data.bankAccount || ''}
                    onChange={(e) => onChange({ bankAccount: e.target.value })}
                    placeholder="企业对公基本户账号"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 bg-white"
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
