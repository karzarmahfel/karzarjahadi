import React, { useState } from 'react';
import { OrderItem, SiteSettings } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface AdminDashboardProps {
  orders: OrderItem[];
  settings: SiteSettings;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  onApproveOrder: (orderId: string) => void;
  onShowToast: (msg: string) => void;
  onNavigateToCatalog: () => void;
  onNavigateHome: () => void;
  onLockAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  settings,
  onUpdateSettings,
  onApproveOrder,
  onShowToast,
  onNavigateToCatalog,
  onLockAdmin,
}) => {
  // Local live form states
  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteSlogan, setSiteSlogan] = useState(settings.siteSlogan);
  const [phone, setPhone] = useState(settings.phone);
  const [rubikaUrl, setRubikaUrl] = useState(settings.rubikaUrl);
  const [address, setAddress] = useState(settings.address);
  const [themeScheme, setThemeScheme] = useState(settings.themeScheme);
  const [bannerText, setBannerText] = useState(settings.bannerText);

  // Orders Filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Printable Invoice Modal
  const [activeInvoice, setActiveInvoice] = useState<{
    id: string;
    buyer: string;
    amount: number;
    phone: string;
  } | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const handleSaveAllSettings = () => {
    onUpdateSettings({
      siteName,
      siteSlogan,
      phone,
      rubikaUrl,
      address,
      themeScheme,
      bannerText,
    });
    onShowToast('کلیه تنظیمات وبگاه و درگاه با موفقیت ذخیره و منتشر شدند.');
  };

  const handleResetDefaults = () => {
    setSiteName('کارزار جهاد اقتصادی محفل');
    setSiteSlogan('سفره با برکت، جهش تولید خانگی در بستر توس');
    setPhone('09367495875');
    setRubikaUrl('https://rubika.ir/karzarmahfel184');
    setAddress('مشهد مقدس، بلوار توس، توس ۱۸۴، پایگاه جهاد اقتصادی محفل');
    setThemeScheme('luxury-red-orange');
    setBannerText(
      'توزیع مستقیم زعفران ناب قائنات، عسل طبیعی کوهپایه و صنایع دستی کدبانوهای بلوار توس با تخفیف ویژه جهاد اقتصادی و تحویل اکسپرس محله‌ای.'
    );
    onShowToast('مقادیر به حالت پیش‌فرض کارزار بازگردانی شدند.');
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Top Command Strip & Live Status */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4 border border-red-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#991b1b] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[28px] text-[#fed7aa]">
              shield_person
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] sm:text-[20px] font-black text-stone-900">
                پنل فرماندهی و تنظیمات زنده کارزار
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#fff1ee] text-[#dc2626] border border-red-200">
                نسخه ۳.۴ محفل
              </span>
            </div>
            <p className="text-[12px] text-stone-500 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#ea580c] animate-pulse inline-block" />
              پایگاه داده زنده • هماهنگ با روبیکا و درگاه‌های محلی بلوار توس
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onLockAdmin}
            className="bg-[#fff7ed] hover:bg-[#ffedd5] text-stone-800 border border-orange-200 px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-[13px] font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-[#ea580c]">lock</span>
            <span>خروج و قفل پنل</span>
          </button>

          <button
            onClick={onNavigateToCatalog}
            className="bg-[#fff1ee] hover:bg-[#fee2e2] text-[#dc2626] border border-red-200 px-4 py-2.5 rounded-xl flex items-center gap-1.5 text-[13px] font-bold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>مدیریت کاتالوگ و انبار</span>
          </button>

          <button
            onClick={handleSaveAllSettings}
            className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-[13px] font-bold shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-[#fed7aa]">save</span>
            <span>ذخیره آنی کلیه تنظیمات</span>
          </button>
        </div>
      </div>

      {/* Visual Chart & Security Profile Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart in Red and Orange */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-red-100 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[18px] font-black text-stone-900">روند فروش و توزیع هفتگی</h2>
              <p className="text-[12px] text-stone-500">
                مقایسه فروش مستقیم کالاهای بومی در هفت روز اخیر (میلیون تومان)
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#fff7ed] p-1 rounded-xl border border-orange-200">
              <span className="px-3 py-1 bg-white rounded-lg text-[11px] font-bold shadow-sm text-[#dc2626]">
                هفتگی
              </span>
              <span className="px-3 py-1 text-[11px] text-stone-500">ماهانه</span>
            </div>
          </div>

          <div className="w-full h-56 relative pt-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200">
              <defs>
                <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#dc2626" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line stroke="#fee2e2" strokeWidth="1.5" x1="0" x2="700" y1="40" y2="40" />
              <line stroke="#fee2e2" strokeWidth="1.5" x1="0" x2="700" y1="90" y2="90" />
              <line stroke="#fee2e2" strokeWidth="1.5" x1="0" x2="700" y1="140" y2="140" />
              <path
                d="M 0,160 Q 60,140 120,110 T 240,80 T 360,105 T 480,50 T 600,65 T 700,20 L 700,190 L 0,190 Z"
                fill="url(#chartGradient)"
              />
              <path
                d="M 0,160 Q 60,140 120,110 T 240,80 T 360,105 T 480,50 T 600,65 T 700,20"
                fill="none"
                stroke="#dc2626"
                strokeLinecap="round"
                strokeWidth="3.5"
              />
              <circle cx="120" cy="110" fill="#ffffff" r="5" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="240" cy="80" fill="#ffffff" r="5" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="360" cy="105" fill="#ffffff" r="5" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="480" cy="50" fill="#ffffff" r="5" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="600" cy="65" fill="#ffffff" r="5" stroke="#dc2626" strokeWidth="2.5" />
              <circle cx="700" cy="20" fill="#ea580c" r="6" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[11px] text-stone-500 pt-3">
              <span>شنبه (۱۸ م)</span>
              <span>یکشنبه (۲۴ م)</span>
              <span>دوشنبه (۳۲ م)</span>
              <span>سه‌شنبه (۲۸ م)</span>
              <span>چهارشنبه (۴۵ م)</span>
              <span>پنج‌شنبه (۴۱ م)</span>
              <span className="font-bold text-[#dc2626]">امروز (۵۸ م)</span>
            </div>
          </div>
        </div>

        {/* Security & Access Protection Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[18px] font-black text-stone-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#dc2626]">verified_user</span>
                <span>امنیت و حفاظت اختصاصی</span>
              </h2>
              <span className="bg-[#fff1ee] text-[#dc2626] border border-red-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                حفاظت لایه ۲ • غیرقابل نفوذ
              </span>
            </div>
            <p className="text-[12px] text-stone-600 leading-relaxed">
              این پایانه مجهز به حفاظت رمزنگاری‌شده اختصاصی است. گذرواژه اصلی محرمانه و غیرقابل تغییر بوده و توسط هیچ کاربر یا فرد ناشناسی قابل مشاهده یا دگرگونی نمی‌باشد.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-[#fff7ed] border border-orange-200 space-y-2">
              <div className="flex items-center gap-2 text-[#ea580c]">
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span className="text-[13px] font-bold">وضعیت دسترسی مدیر:</span>
              </div>
              <p className="text-[12px] text-stone-600">
                احراز هویت شده توسط کلید محرمانه اختصاصی کارزار
              </p>
              <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-[11px] text-stone-500">
                <span>امکان بازنشانی عمومی:</span>
                <span className="text-[#dc2626] font-bold">غیرفعال (مطلق)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#fff1ee] rounded-2xl p-3 space-y-1 border border-red-200">
            <div className="flex items-center justify-between text-[11px] text-stone-600">
              <span>آخرین ورود مدیر ارشد:</span>
              <span className="font-bold text-[#dc2626]">هم‌اکنون (فعال)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-600">
              <span>آی‌پی اتصال:</span>
              <span className="font-mono text-stone-800" dir="ltr">
                178.252.189.42 (مشهد)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Site Settings Form & Layout Customizer */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-red-100">
          <div>
            <h2 className="text-[20px] font-black text-stone-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#dc2626]">tune</span>
              <span>تنظیمات زنده سایت و پوسته کارزار</span>
            </h2>
            <p className="text-[12px] text-stone-500">
              تغییر بی‌واسطه محتوا، اطلاعات تماس و نمایه فروشگاه بدون نیاز به تغییر کد
            </p>
          </div>
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 rounded-xl text-[12px] font-bold bg-[#fff7ed] hover:bg-[#ffedd5] text-[#c2410c] border border-orange-200 transition-colors"
          >
            بازنشانی پیش‌فرض
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Site Name */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-[#dc2626]">store</span>
              <span>عنوان اصلی وبگاه</span>
            </label>
            <input
              className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
            <p className="text-[11px] text-stone-500">در نوار بالا و هدر عمومی نمایش داده می‌شود.</p>
          </div>

          {/* Slogan */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-[#ea580c]">campaign</span>
              <span>شعار رسمی کارزار</span>
            </label>
            <input
              className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
              type="text"
              value={siteSlogan}
              onChange={(e) => setSiteSlogan(e.target.value)}
            />
            <p className="text-[11px] text-stone-500">متن تکمیلی در صفحه اصلی و متادیتای روبیکا.</p>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-[#dc2626]">call</span>
              <span>شماره تماس پشتیبانی و خرید</span>
            </label>
            <input
              className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 font-mono text-right border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
              dir="ltr"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <p className="text-[11px] text-stone-500">شماره رسمی جهت سفارش و ثبت فاکتورها.</p>
          </div>

          {/* Rubika URL */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-[#ea580c]">forum</span>
              <span>لینک مستقیم کانال روبیکا</span>
            </label>
            <input
              className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 font-mono text-right border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
              dir="ltr"
              type="text"
              value={rubikaUrl}
              onChange={(e) => setRubikaUrl(e.target.value)}
            />
            <p className="text-[11px] text-stone-500">دکمه اتصال به روبیکا با این نشانی لینک می‌شود.</p>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-[#dc2626]">
                location_on
              </span>
              <span>آدرس مرکز توزیع و ستاد کارزار</span>
            </label>
            <input
              className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <p className="text-[11px] text-stone-500">در فوتر و ذیل فاکتورهای چاپی درج می‌گردد.</p>
          </div>

          {/* Palette */}
          <div className="space-y-1">
            <label className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-[#ea580c]">palette</span>
              <span>پالت رنگ و هویت بصری</span>
            </label>
            <select
              className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
              value={themeScheme}
              onChange={(e) => setThemeScheme(e.target.value)}
            >
              <option value="luxury-red-orange">قرمز، سفید و نارنجی (مصوب کارزار)</option>
              <option value="saffron-crimson">زعفرانی و کرک مشهد</option>
              <option value="minimal-clean">سپید و سرخ انقلابی</option>
            </select>
            <p className="text-[11px] text-stone-500">هویت بصری رسمی کارزار جهاد اقتصادی.</p>
          </div>

          {/* Banner text */}
          <div className="md:col-span-2 lg:col-span-3 space-y-1">
            <label className="text-[13px] font-bold text-stone-900 flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-[#dc2626]">
                featured_play_list
              </span>
              <span>متن بنر ویژه و فراخوان صفحه نخست</span>
            </label>
            <textarea
              className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
              rows={2}
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
            />
            <p className="text-[11px] text-stone-500">
              در نوار اعلان سردر و بنر تبلیغاتی بالای فهرست محصولات جای می‌گیرد.
            </p>
          </div>
        </div>

        {/* Live Preview Strip */}
        <div className="bg-[#fff1ee] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dc2626] text-white flex items-center justify-center">
              <span className="material-symbols-outlined">visibility</span>
            </div>
            <div>
              <span className="text-[11px] text-stone-500">پیش‌نمایش زنده شعار جاری:</span>
              <p className="text-[15px] font-bold text-stone-900">
                {siteSlogan || 'بدون شعار'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSaveAllSettings}
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">publish</span>
            <span>انتشار تغییرات در فروشگاه</span>
          </button>
        </div>
      </div>

      {/* Active Orders Management Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-black text-stone-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#dc2626]">shopping_bag</span>
              <span>جدول آخرین سفارش‌های ثبت شده</span>
            </h2>
            <p className="text-[12px] text-stone-500">
              رسیدگی به خریدهای مشتریان منطقه توس و تحویل با ناوگان محلی
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors ${
                orderFilter === 'all'
                  ? 'bg-[#dc2626] text-white shadow-sm'
                  : 'bg-[#fff7ed] text-stone-800 hover:bg-[#ffedd5] border border-orange-200'
              }`}
            >
              همه ({toPersianDigits(orders.length)})
            </button>
            <button
              onClick={() => setOrderFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors ${
                orderFilter === 'pending'
                  ? 'bg-[#dc2626] text-white shadow-sm'
                  : 'bg-[#fff7ed] text-stone-800 hover:bg-[#ffedd5] border border-orange-200'
              }`}
            >
              در انتظار
            </button>
            <button
              onClick={() => setOrderFilter('completed')}
              className={`px-3 py-1.5 rounded-xl text-[12px] font-bold transition-colors ${
                orderFilter === 'completed'
                  ? 'bg-[#dc2626] text-white shadow-sm'
                  : 'bg-[#fff7ed] text-stone-800 hover:bg-[#ffedd5] border border-orange-200'
              }`}
            >
              تکمیل شده
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#fff1ee] text-[#991b1b] text-[13px] font-bold border-b border-red-200">
                <th className="py-3 px-4 rounded-r-xl">شناسه</th>
                <th className="py-3 px-4">نام مشتری</th>
                <th className="py-3 px-4">شماره همراه</th>
                <th className="py-3 px-4">مبلغ سفارش</th>
                <th className="py-3 px-4">اقلام سفارش</th>
                <th className="py-3 px-4">وضعیت</th>
                <th className="py-3 px-4 rounded-l-xl text-center">اقدامات سریع</th>
              </tr>
            </thead>
            <tbody className="text-[13px] divide-y divide-red-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#fff7ed]/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    #{toPersianDigits(ord.id)}
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-900">{ord.customerName}</td>
                  <td className="py-3 px-4 font-mono text-right" dir="ltr">
                    {ord.phone}
                  </td>
                  <td className="py-3 px-4 font-black text-[#dc2626]">
                    {formatPrice(ord.totalAmount)} تومان
                  </td>
                  <td className="py-3 px-4 text-stone-600">{ord.itemsSummary}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        ord.status === 'completed'
                          ? 'bg-[#fff1ee] text-[#dc2626] border border-red-200'
                          : 'bg-[#fff7ed] text-[#c2410c] border border-orange-200'
                      }`}
                    >
                      {ord.statusLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1.5">
                      {ord.status === 'pending' ? (
                        <button
                          onClick={() => {
                            onApproveOrder(ord.id);
                            onShowToast(`سفارش #${ord.id} تأیید و آماده ارسال شد.`);
                          }}
                          className="p-1.5 rounded-xl bg-[#fff7ed] hover:bg-[#ea580c] hover:text-white text-[#c2410c] border border-orange-200 transition-colors"
                          title="تایید سفارش"
                        >
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="p-1.5 rounded-xl opacity-40 text-stone-400"
                        >
                          <span className="material-symbols-outlined text-[18px]">done_all</span>
                        </button>
                      )}

                      <button
                        onClick={() =>
                          setActiveInvoice({
                            id: ord.id,
                            buyer: ord.customerName,
                            amount: ord.totalAmount,
                            phone: ord.phone,
                          })
                        }
                        className="p-1.5 rounded-xl bg-[#fff1ee] hover:bg-[#fee2e2] text-[#dc2626] border border-red-200 transition-colors"
                        title="چاپ فاکتور محفل"
                      >
                        <span className="material-symbols-outlined text-[18px]">print</span>
                      </button>

                      <a
                        className="p-1.5 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] text-[#ea580c] border border-orange-200 transition-colors"
                        href={`tel:${ord.phone}`}
                        title="تماس تلفنی با خریدار"
                      >
                        <span className="material-symbols-outlined text-[18px]">call</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-red-100">
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#dc2626]">receipt</span>
                <span className="text-[17px] font-black text-stone-900">فاکتور رسمی کارزار محفل</span>
              </div>
              <button
                onClick={() => setActiveInvoice(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="bg-[#fff1ee] p-4 rounded-2xl space-y-2.5 text-[13px] border border-red-200">
              <div className="flex justify-between">
                <span className="text-stone-600">شماره فاکتور:</span>
                <span className="font-mono font-bold text-stone-900">#{activeInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">نام خریدار:</span>
                <span className="font-bold text-stone-900">{activeInvoice.buyer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">مرکز صدور:</span>
                <span className="text-stone-900">ستاد کارزار جهاد اقتصادی - مشهد مقدس توس</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">تماس پشتیبانی کارزار:</span>
                <span className="font-mono" dir="ltr">
                  {settings.phone}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-red-200 text-[15px] font-black text-[#dc2626]">
                <span>مبلغ قابل پرداخت:</span>
                <span>{formatPrice(activeInvoice.amount)} تومان</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2.5 rounded-xl text-[13px] font-bold flex items-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>پرینت فوری فاکتور</span>
              </button>
              <button
                onClick={() => setActiveInvoice(null)}
                className="bg-[#fff7ed] hover:bg-[#ffedd5] text-stone-800 border border-orange-200 px-4 py-2.5 rounded-xl text-[13px] font-bold"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
