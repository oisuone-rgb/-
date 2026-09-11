import React from 'react';
import { User, Building, Phone, Mail, MapPin, Receipt, CheckCircle2 } from 'lucide-react';
import { CustomerInfo, CustomerType, InvoiceType } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface CustomerInfoSectionProps {
  data: CustomerInfo;
  onChange: (updated: Partial<CustomerInfo>) => void;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  data,
  onChange
}) => {
  const { t } = useLanguage();

  return (
    <div id="section-customer" className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs font-mono">
            1
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
              {t('customer.title')}
            </h2>
            <p className="text-xs text-stone-700 mt-0.5">{t('customer.sub')}</p>
          </div>
        </div>
        <span className="text-[11px] sm:text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
          * {t('customer.badge')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Customer / Company Name */}
        <div className="lg:col-span-2">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            {t('customer.name')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-stone-700 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={data.customerName}
              onChange={(e) => onChange({ customerName: e.target.value })}
              placeholder={t('customer.namePlaceholder')}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition bg-stone-50/40 hover:bg-white focus:bg-white text-stone-900 placeholder:text-stone-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Customer Type */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            {t('customer.type')} <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/60">
            {(
              [
                { key: 'enterprise', label: t('customer.type.enterprise') },
                { key: 'dealer', label: t('customer.type.distributor') },
                { key: 'personal', label: t('customer.type.personal') },
              ] as { key: CustomerType; label: string }[]
            ).map((tItem) => (
              <button
                key={tItem.key}
                type="button"
                onClick={() => onChange({ customerType: tItem.key })}
                className={`py-2 text-xs font-medium rounded-lg transition cursor-pointer text-center px-1 truncate ${
                  data.customerType === tItem.key
                    ? 'bg-white text-emerald-900 shadow-xs font-semibold ring-1 ring-stone-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title={tItem.label}
              >
                {tItem.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Person */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            {t('customer.contact')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-700 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={data.contactPerson}
              onChange={(e) => onChange({ contactPerson: e.target.value })}
              placeholder={t('customer.contactPlaceholder')}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition bg-stone-50/40 hover:bg-white focus:bg-white text-stone-900 placeholder:text-stone-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            {t('customer.phone')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-stone-700 absolute left-3.5 top-3.5" />
            <input
              type="tel"
              required
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder={t('customer.phonePlaceholder')}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition bg-stone-50/40 hover:bg-white focus:bg-white text-stone-900 placeholder:text-stone-400 shadow-2xs"
            />
          </div>
        </div>

        {/* WeChat / Email */}
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            {t('customer.wechatEmail')}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-700 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={data.wechatOrEmail}
              onChange={(e) => onChange({ wechatOrEmail: e.target.value })}
              placeholder={t('customer.wechatEmailPlaceholder')}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition bg-stone-50/40 hover:bg-white focus:bg-white text-stone-900 placeholder:text-stone-400 shadow-2xs"
            />
          </div>
        </div>

        {/* Main Delivery Address */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-xs font-semibold text-stone-700 mb-1.5">
            {t('customer.deliveryAddress')} <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-stone-700 absolute left-3.5 top-3.5" />
            <input
              type="text"
              required
              value={data.shippingAddress}
              onChange={(e) => onChange({ shippingAddress: e.target.value })}
              placeholder={t('customer.deliveryAddressPlaceholder')}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition bg-stone-50/40 hover:bg-white focus:bg-white text-stone-900 placeholder:text-stone-400 shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Invoice Information Accordion / Options */}
      <div className="mt-6 pt-5 border-t border-stone-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-800" />
            <span className="text-xs font-bold text-stone-800">{t('customer.invoiceInfo')}</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <label className="inline-flex items-center text-xs text-stone-700 cursor-pointer font-medium hover:text-stone-900">
              <input
                type="radio"
                name="invoiceRadio"
                checked={!data.needInvoice || data.invoiceType === 'none'}
                onChange={() => onChange({ needInvoice: false, invoiceType: 'none' })}
                className="text-emerald-700 focus:ring-emerald-600 mr-2 cursor-pointer"
              />
              {t('customer.invoice.none')}
            </label>
            <label className="inline-flex items-center text-xs text-stone-700 cursor-pointer font-medium hover:text-stone-900">
              <input
                type="radio"
                name="invoiceRadio"
                checked={data.needInvoice && data.invoiceType === 'normal'}
                onChange={() => onChange({ needInvoice: true, invoiceType: 'normal' })}
                className="text-emerald-700 focus:ring-emerald-600 mr-2 cursor-pointer"
              />
              {t('customer.invoice.normal')}
            </label>
            <label className="inline-flex items-center text-xs text-stone-700 cursor-pointer font-medium hover:text-stone-900">
              <input
                type="radio"
                name="invoiceRadio"
                checked={data.needInvoice && data.invoiceType === 'special'}
                onChange={() => onChange({ needInvoice: true, invoiceType: 'special' })}
                className="text-emerald-700 focus:ring-emerald-600 mr-2 cursor-pointer"
              />
              {t('customer.invoice.special')}
            </label>
          </div>
        </div>

        {data.needInvoice && data.invoiceType !== 'none' && (
          <div className="mt-4 p-4.5 rounded-xl bg-stone-50/70 border border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-in fade-in">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">{t('customer.name')}</label>
              <input
                type="text"
                value={data.invoiceTitle || ''}
                onChange={(e) => onChange({ invoiceTitle: e.target.value })}
                placeholder={t('customer.namePlaceholder')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">{t('customer.taxId')}</label>
              <input
                type="text"
                value={data.taxNumber || ''}
                onChange={(e) => onChange({ taxNumber: e.target.value })}
                placeholder="18位纳税人识别号"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">{t('customer.invoiceEmail')}</label>
              <input
                type="email"
                value={data.invoiceEmail || ''}
                onChange={(e) => onChange({ invoiceEmail: e.target.value })}
                placeholder="finance@company.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
              />
            </div>
            {data.invoiceType === 'special' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">{t('customer.bankName')}</label>
                  <input
                    type="text"
                    value={data.bankName || ''}
                    onChange={(e) => onChange({ bankName: e.target.value })}
                    placeholder="开户银行支行全称"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">{t('customer.bankAccount')}</label>
                  <input
                    type="text"
                    value={data.bankAccount || ''}
                    onChange={(e) => onChange({ bankAccount: e.target.value })}
                    placeholder="银行对公账号"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 text-stone-900 font-mono"
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
