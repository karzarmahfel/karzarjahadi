import React, { useState, useEffect } from 'react';
import { ProductItem, SiteSettings } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface HomeViewProps {
  products: ProductItem[];
  settings: SiteSettings;
  searchQuery: string;
  onAddToCart: (product: ProductItem) => void;
  onOpenPhoneModal: (productName: string) => void;
  onShowToast: (msg: string) => void;
  onNavigateToCart: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  settings,
  searchQuery,
  onAddToCart,
  onOpenPhoneModal,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [remainingSec, setRemainingSec] = useState<number>(31339); // ~8h 42m

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = Math.floor(remainingSec / 3600);
  const mins = Math.floor((remainingSec % 3600) / 60);
  const secs = remainingSec % 60;

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (!p.active) return false;
    const matchesSearch =
      !searchQuery ||
      p.title.includes(searchQuery) ||
      p.description.includes(searchQuery) ||
      p.category.includes(searchQuery);

    if (!matchesSearch) return false;

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'تخفیف') {
      return p.badgeType === 'تخفیف' || !!p.originalPrice;
    }
    return p.category === selectedCategory;
  });

  // Highlight flash products
  const flashProducts = products.filter(
    (p) => p.id === 'kz-101' || p.id === 'kz-204' || p.id === 'kz-318'
  );

  const scrollToProducts = () => {
    const el = document.getElementById('productsSection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onShowToast('پیام و درخواست شما ثبت گردید. خادمان کارزار به‌زودی تماس خواهند گرفت.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="flex flex-col w-full bg-[#fffaf8]">
      {/* Hero Showcase Section (Rich Red with Orange & White accents) */}
      <section className="relative w-full overflow-hidden bg-gradient-to-bl from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] text-white py-12 md:py-16 shadow-inner border-b-4 border-[#ea580c]">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-white" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <radialGradient cx="50%" cy="50%" id="meshGrad" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect fill="url(#meshGrad)" height="100" width="100" />
          </svg>
        </div>

        <div className="max-w-[1360px] mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text & Action Column */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-4 text-right">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm">
                <span className="material-symbols-filled text-[#fed7aa] text-[18px]">stars</span>
                <span className="text-[12px] font-bold text-white">
                  رونق تولید و معیشت پایدار خانواده در بلوار توس مشهد
                </span>
              </div>

              <h1 className="text-[32px] sm:text-[44px] font-black text-white leading-tight">
                {settings.siteName}
              </h1>

              <p className="text-[15px] sm:text-[17px] text-red-100 max-w-2xl leading-relaxed">
                {settings.bannerText ||
                  'پلتفرم توانمندسازی مشاغل خانگی، پیوند مستقیم تولیدکننده محلی به سفره خانواده، حذف واسطه‌گری و توزیع عادلانه خدمات و ملزومات معیشتی در مشهد مقدس. با هر خرید، یک خانواده صاحب شغل پایدار می‌شود.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
                <button
                  onClick={scrollToProducts}
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-7 py-3 rounded-2xl font-black text-[14px] transition-all shadow-xl flex items-center justify-center gap-2 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                  <span>مشاهده محصولات و خدمات</span>
                </button>
                <a
                  className="bg-white hover:bg-[#fff7ed] text-[#991b1b] px-6 py-3 rounded-2xl font-black text-[14px] transition-all flex items-center justify-center gap-2 shadow-lg"
                  href={settings.rubikaUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-filled text-[#ea580c] text-[20px]">verified</span>
                  <span>عضویت در کانال روبیکا</span>
                </a>
              </div>

              {/* Live Metrics Bar */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 w-full max-w-xl">
                <div className="bg-[#7f1d1d]/85 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl text-center shadow-md border border-red-800">
                  <span className="text-[22px] sm:text-[28px] font-black text-[#fed7aa] block">
                    ۱۴۰+
                  </span>
                  <span className="text-[12px] text-red-100">کارگاه و شغل خانگی</span>
                </div>
                <div className="bg-[#7f1d1d]/85 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl text-center shadow-md border border-red-800">
                  <span className="text-[22px] sm:text-[28px] font-black text-[#fed7aa] block">
                    ۱۰۰٪
                  </span>
                  <span className="text-[12px] text-red-100">نظارت بر کیفیت و اصالت</span>
                </div>
                <div className="bg-[#7f1d1d]/85 backdrop-blur-sm p-3.5 sm:p-4 rounded-2xl text-center shadow-md border border-red-800">
                  <span className="text-[22px] sm:text-[28px] font-black text-[#fed7aa] block">
                    ۲۴ساعت
                  </span>
                  <span className="text-[12px] text-red-100">تحویل در بلوار توس</span>
                </div>
              </div>
            </div>

            {/* Visual Hero Showcase */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white p-2 border-2 border-white/20">
                <img
                  className="w-full h-[380px] sm:h-[400px] object-cover rounded-2xl"
                  alt="کارگاه سنتی صنایع دستی و زعفران در مشهد"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk095izkThP16rWDzArmkKdQfpVEAo6F8z9fFt8GrhHXpjcTuWhUCTjCEublpMwJRh3BC6AEAgz-9WZXaC-in_wAeA0gzz0Nd-5uyq0FrpdSSFQlU6O890OOyPYZHhYW2v3xQvj5yknkAJcN6bOwq-vjwFXNHLc6R_fib9eXkoHDqluy1-VZui2TmODlk_FUG_tVHIggTiRq6XRwQx1MfUiZ41U9PODyNOt2m0uLc"
                />
                <div className="absolute bottom-4 inset-x-4 bg-[#7f1d1d]/95 backdrop-blur-md p-3.5 rounded-2xl flex items-center justify-between text-white shadow-xl border border-red-600/40">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center text-white shadow-sm">
                      <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white">تضمین قیمت عادلانه جهادی</p>
                      <p className="text-[11px] text-red-200">پشتیبانی و سفارش مستقیم از توس</p>
                    </div>
                  </div>
                  <a
                    className="bg-white hover:bg-[#fff7ed] text-[#991b1b] px-3.5 py-1.5 rounded-xl text-[12px] font-black transition-colors shadow-sm"
                    href={`tel:${settings.phone}`}
                  >
                    تماس فوری
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Trust Highlights Ribbon (White Background with Orange/Red Badges) */}
      <section className="w-full bg-white py-4 shadow-sm border-b border-red-100">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#fff7ed] transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-[#fff1ee] flex items-center justify-center text-[#dc2626] border border-red-200 shrink-0">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div>
                <span className="text-[13px] font-bold text-stone-900 block">ضمانت اصالت</span>
                <span className="text-[11px] text-stone-500">تأییدیه تولیدکننده بومی</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#fff7ed] transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] border border-orange-200 shrink-0">
                <span className="material-symbols-outlined text-[24px]">local_shipping</span>
              </div>
              <div>
                <span className="text-[13px] font-bold text-stone-900 block">ارسال سریع مشهد</span>
                <span className="text-[11px] text-stone-500">توزیع درون‌شهری و بلوار توس</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#fff7ed] transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-[#fff1ee] flex items-center justify-center text-[#dc2626] border border-red-200 shrink-0">
                <span className="material-symbols-outlined text-[24px]">support_agent</span>
              </div>
              <div>
                <span className="text-[13px] font-bold text-stone-900 block">مشاوره و ثبت تلفنی</span>
                <span className="text-[11px] text-stone-500 font-mono" dir="ltr">{toPersianDigits(settings.phone)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#fff7ed] transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] border border-orange-200 shrink-0">
                <span className="material-symbols-outlined text-[24px]">balance</span>
              </div>
              <div>
                <span className="text-[13px] font-bold text-stone-900 block">قیمت عادلانه جهادی</span>
                <span className="text-[11px] text-stone-500">بدون سوداگری و واسطه‌گری</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#fff7ed] transition-colors col-span-2 md:col-span-1">
              <div className="w-11 h-11 rounded-2xl bg-[#fff1ee] flex items-center justify-center text-[#dc2626] border border-red-200 shrink-0">
                <span className="material-symbols-outlined text-[24px]">diversity_3</span>
              </div>
              <div>
                <span className="text-[13px] font-bold text-stone-900 block">اشتغال پایدار بانوان</span>
                <span className="text-[11px] text-stone-500">حمایت ۱۰۰٪ از کار در منزل</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Categories Strip */}
      <section className="w-full py-8">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[20px] font-extrabold text-stone-900">دسته‌بندی‌های جهاد اقتصادی</h2>
              <p className="text-[13px] text-stone-500">
                انتخاب سریع از میان حوزه‌های تولیدی و خدماتی محفل
              </p>
            </div>
            <button
              onClick={() => setSelectedCategory('all')}
              className="flex items-center gap-1 text-[13px] font-bold text-[#dc2626] hover:text-[#ea580c] transition-colors"
            >
              <span>نمایش همه دسته‌ها</span>
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <button
              onClick={() => {
                setSelectedCategory('خدمات');
                scrollToProducts();
              }}
              className={`group p-4 rounded-2xl transition-all flex flex-col items-center text-center shadow-sm border ${
                selectedCategory === 'خدمات'
                  ? 'bg-[#fff1ee] border-2 border-[#dc2626]'
                  : 'bg-white hover:bg-[#fff7ed] border-red-100 hover:border-orange-300'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#fff7ed] group-hover:bg-[#ea580c] flex items-center justify-center text-[#ea580c] group-hover:text-white transition-colors mb-2 shadow-inner border border-orange-200">
                <span className="material-symbols-outlined text-[32px]">handyman</span>
              </div>
              <span className="text-[15px] font-extrabold text-stone-900">خدمات کارزار</span>
              <span className="text-[11px] text-stone-500">پاک‌کردن زعفران، بسته‌بندی</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('محصولات');
                scrollToProducts();
              }}
              className={`group p-4 rounded-2xl transition-all flex flex-col items-center text-center shadow-sm border ${
                selectedCategory === 'محصولات'
                  ? 'bg-[#fff1ee] border-2 border-[#dc2626]'
                  : 'bg-white hover:bg-[#fff7ed] border-red-100 hover:border-orange-300'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#fff7ed] group-hover:bg-[#ea580c] flex items-center justify-center text-[#ea580c] group-hover:text-white transition-colors mb-2 shadow-inner border border-orange-200">
                <span className="material-symbols-outlined text-[32px]">visibility</span>
              </div>
              <span className="text-[15px] font-extrabold text-stone-900">سلامت و بینایی</span>
              <span className="text-[11px] text-stone-500">عینک طبی، محافظت فردی</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('سوغات');
                scrollToProducts();
              }}
              className={`group p-4 rounded-2xl transition-all flex flex-col items-center text-center shadow-sm border ${
                selectedCategory === 'سوغات'
                  ? 'bg-[#fff1ee] border-2 border-[#dc2626]'
                  : 'bg-white hover:bg-[#fff7ed] border-red-100 hover:border-orange-300'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#fff7ed] group-hover:bg-[#ea580c] flex items-center justify-center text-[#ea580c] group-hover:text-white transition-colors mb-2 shadow-inner border border-orange-200">
                <span className="material-symbols-outlined text-[32px]">eco</span>
              </div>
              <span className="text-[15px] font-extrabold text-stone-900">زعفران و سوغات</span>
              <span className="text-[11px] text-stone-500">قائنات سرگل، عسل کوهی</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('صنایع دستی');
                scrollToProducts();
              }}
              className={`group p-4 rounded-2xl transition-all flex flex-col items-center text-center shadow-sm border ${
                selectedCategory === 'صنایع دستی'
                  ? 'bg-[#fff1ee] border-2 border-[#dc2626]'
                  : 'bg-white hover:bg-[#fff7ed] border-red-100 hover:border-orange-300'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#fff7ed] group-hover:bg-[#ea580c] flex items-center justify-center text-[#ea580c] group-hover:text-white transition-colors mb-2 shadow-inner border border-orange-200">
                <span className="material-symbols-outlined text-[32px]">palette</span>
              </div>
              <span className="text-[15px] font-extrabold text-stone-900">دست‌سازه‌های بومی</span>
              <span className="text-[11px] text-stone-500">سوزن‌دوزی، تزئینات خانگی</span>
            </button>

            <button
              onClick={() => {
                setSelectedCategory('تخفیف');
                scrollToProducts();
              }}
              className={`group p-4 rounded-2xl transition-all flex flex-col items-center text-center shadow-sm border ${
                selectedCategory === 'تخفیف'
                  ? 'bg-[#fff1ee] border-2 border-[#dc2626]'
                  : 'bg-white hover:bg-[#fff7ed] border-red-100 hover:border-orange-300'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#fff1ee] group-hover:bg-[#dc2626] flex items-center justify-center text-[#dc2626] group-hover:text-white transition-colors mb-2 shadow-inner border border-red-200">
                <span className="material-symbols-outlined text-[32px]">local_fire_department</span>
              </div>
              <span className="text-[15px] font-extrabold text-[#dc2626]">طرح‌های حمایتی</span>
              <span className="text-[11px] text-stone-500">تخفیف‌های ویژه معیشتی</span>
            </button>
          </div>
        </div>
      </section>

      {/* Flash Deals & Special Offers Section (Countdown) */}
      <section id="special-offers" className="w-full bg-gradient-to-b from-[#fff1ee] to-[#fff7ed] py-8 mb-8 border-y-2 border-orange-200">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ea580c] flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined text-[28px]">bolt</span>
              </div>
              <div>
                <h3 className="text-[19px] font-black text-stone-900">پیشنهادهای شگفت‌انگیز جهادی</h3>
                <p className="text-[13px] text-stone-500">
                  فرصت ویژه دسترسی به محصولات و خدمات منتخب با کمترین بهای تمام‌شده
                </p>
              </div>
            </div>

            {/* Live Countdown Timer (Crisp White boxes with Red digits) */}
            <div className="flex items-center gap-2 bg-[#fff1ee] px-4 py-2 rounded-2xl border border-red-200 shadow-inner">
              <span className="text-[12px] text-stone-600 font-bold">زمان باقی‌مانده طرح:</span>
              <div className="flex items-center gap-1 font-mono text-[17px] font-black text-[#dc2626]" dir="ltr">
                <span className="bg-white px-2.5 py-1 rounded-xl shadow-sm text-center border border-red-200">
                  {toPersianDigits(String(hrs).padStart(2, '0'))}
                </span>
                :
                <span className="bg-white px-2.5 py-1 rounded-xl shadow-sm text-center border border-red-200">
                  {toPersianDigits(String(mins).padStart(2, '0'))}
                </span>
                :
                <span className="bg-white px-2.5 py-1 rounded-xl shadow-sm text-center border border-red-200">
                  {toPersianDigits(String(secs).padStart(2, '0'))}
                </span>
              </div>
            </div>
          </div>

          {/* Flash Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {flashProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-red-100 hover:border-orange-300 group"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden bg-stone-100 mb-4 h-52">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={p.imageUrl}
                      alt={p.title}
                    />
                    {p.badgeLabel && (
                      <span className="absolute top-2.5 right-2.5 bg-[#dc2626] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                        {p.badgeLabel}
                      </span>
                    )}
                    <span className="absolute top-2.5 left-2.5 bg-white/95 text-stone-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">
                      {p.categoryLabel}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-[17px] font-black text-stone-900">{p.title}</h4>
                    <p className="text-[13px] text-stone-500 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                    {p.subtitle && (
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 pt-1">
                        <span className="material-symbols-outlined text-[16px] text-[#ea580c]">
                          location_on
                        </span>
                        <span>{p.subtitle}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-red-100">
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {p.originalPrice && (
                        <>
                          <span className="text-[12px] text-stone-400 line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                          <span className="bg-[#fff1ee] text-[#dc2626] border border-red-200 text-[11px] font-bold px-1.5 py-0.5 rounded-lg">
                            {p.discountBadge || 'تخفیف'}
                          </span>
                        </>
                      )}
                      {!p.originalPrice && (
                        <span className="text-[12px] text-stone-500">تعرفه جهادی:</span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[21px] font-black text-[#dc2626]">
                        {formatPrice(p.price)}
                      </span>
                      <span className="text-[12px] text-stone-500">تومان</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onAddToCart(p)}
                      className="bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2.5 px-2 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                      <span>ثبت سفارش</span>
                    </button>
                    <button
                      onClick={() => onOpenPhoneModal(p.title)}
                      className="bg-[#fff7ed] hover:bg-[#ffedd5] text-[#c2410c] border border-orange-200 py-2.5 px-2 rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                      <span>خرید تلفنی</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Catalog & Filterable Product Grid */}
      <section id="productsSection" className="w-full py-8">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8">
          {/* Section Title & Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#ea580c] mb-1">
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                <span>ویترین جامع خدمات و کالاهای کارزار</span>
              </div>
              <h2 className="text-[24px] sm:text-[30px] font-black text-stone-900">
                محصولات تولیدی و خدمات خانگی محفل
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#fff7ed] p-1.5 rounded-2xl overflow-x-auto max-w-full border border-orange-200">
              {[
                { id: 'all', label: 'همه اقلام' },
                { id: 'خدمات', label: 'خدمات کارزار' },
                { id: 'محصولات', label: 'محصولات مصرفی' },
                { id: 'سوغات', label: 'سوغات و کشاورزی' },
                { id: 'صنایع دستی', label: 'دست‌سازه‌های خانگی' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-[#dc2626] text-white shadow-md'
                      : 'text-stone-700 hover:text-[#dc2626] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between border border-red-100 hover:border-orange-300 group"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden bg-stone-100 mb-3 h-48">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      src={item.imageUrl}
                      alt={item.title}
                    />
                    <span className="absolute top-2 right-2 bg-[#ea580c] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                      {item.category}
                    </span>
                    {item.badgeLabel && (
                      <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {item.badgeLabel}
                      </span>
                    )}
                  </div>
                  <h5 className="text-[15px] font-black text-stone-900 group-hover:text-[#dc2626] transition-colors">
                    {item.title}
                  </h5>
                  <p className="text-[12px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-red-50">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-[11px] text-stone-500">تعرفه حمایتی:</span>
                    <span className="text-[18px] font-black text-[#dc2626]">
                      {formatPrice(item.price)}{' '}
                      <span className="text-[11px] font-normal text-stone-500">تومان</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAddToCart(item)}
                      className="flex-1 bg-[#dc2626] hover:bg-[#ea580c] text-white py-2 rounded-xl text-[13px] font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                      <span>سفارش</span>
                    </button>
                    <a
                      className="w-9 h-9 rounded-xl bg-[#fff7ed] hover:bg-[#ffedd5] border border-orange-200 flex items-center justify-center text-[#c2410c] transition-colors shrink-0"
                      href={`tel:${settings.phone}`}
                      title="تماس فوری"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-red-100">
              <span className="material-symbols-outlined text-[48px] text-stone-400">inventory_2</span>
              <p className="text-[16px] font-bold text-stone-900 mt-2">موردی یافت نشد!</p>
              <p className="text-[13px] text-stone-500 mt-1">
                لطفاً فیلتر دیگری را انتخاب نمایید یا عبارت جستجو را پاک کنید.
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="mt-4 px-5 py-2 bg-[#dc2626] text-white rounded-xl text-[13px] font-bold"
              >
                مشاهده همه اقلام
              </button>
            </div>
          )}
        </div>
      </section>

      {/* About Campaign Story Section (Clean Warm Cream with Red/White Cards) */}
      <section id="about-section" className="w-full bg-[#fff7f5] py-12 border-t border-red-100">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 bg-[#fff1ee] border border-red-200 px-3.5 py-1.5 rounded-xl text-[13px] font-bold text-[#dc2626]">
                <span className="material-symbols-outlined text-[20px]">flag</span>
                <span>آشنایی با مرام‌نامه و اهداف قرارگاه</span>
              </div>

              <h3 className="text-[26px] sm:text-[32px] font-black text-stone-900 leading-tight">
                چرا «کارزار جهاد اقتصادی محفل» در مشهد مقدس شکل گرفت؟
              </h3>

              <p className="text-[14px] text-stone-600 leading-relaxed">
                منطقه بلوار توس مشهد، سرشار از ظرفیت‌های بالقوه کارآفرینی و دست‌های توانمند تولیدکنندگانی است که به دلیل نبود شبکه توزیع عادلانه، با حداقل درآمد روبه‌رو بودند. کارزار جهاد اقتصادی محفل با شعار برابری و حمایت از عزت خانواده، زنجیره مستقیم تولید تا مصرف را برقرار کرده است.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-red-100">
                  <span className="material-symbols-outlined text-[#dc2626] text-[28px] mb-2 block">
                    volunteer_activism
                  </span>
                  <h6 className="text-[15px] font-bold text-stone-900">استقلال مالی خانواده‌ها</h6>
                  <p className="text-[12px] text-stone-500 mt-1">
                    پرداخت مستقیم و بدون تأخیر دستمزد خدمات به مجریان خانگی.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow-sm border border-red-100">
                  <span className="material-symbols-outlined text-[#ea580c] text-[28px] mb-2 block">
                    price_check
                  </span>
                  <h6 className="text-[15px] font-bold text-stone-900">کنترل قیمت مایحتاج</h6>
                  <p className="text-[12px] text-stone-500 mt-1">
                    عرضه اقلام ضروری و اساسی با حداقل نرخ کارشناسی و نظارت محله‌ای.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <a
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 py-3 rounded-2xl text-[13px] font-bold flex items-center gap-2 transition-all shadow-md"
                  href={settings.rubikaUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="material-symbols-outlined text-white text-[20px]">forum</span>
                  <span>مشاهده گزارش‌های میدانی در روبیکا</span>
                </a>
              </div>
            </div>

            {/* Collage Images */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  className="w-full h-48 object-cover rounded-3xl shadow-md border-2 border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKb-LGmq0d4-V6NFXLZhF-YtmlDaaTPjB8blXh7LaVSwJJijZwB7j7XOKngMukgDOccxFgN7shkR3MM_Hs-PyaEprKawuoFnlV75bam9oUxwYF6bYsBFJZDGO1xoB4SZJSSbqBGLJe5FHmTZoU84oJQ8BvTnFr2OgXhQr4stsQBj8ALuOqXujERzlKZYgoqlH9Gcry_LUqZGHxkO-ocDDxjZVUbnRErvPUWEbDoPQ"
                  alt="نانوایی محلی و بسته‌بندی در توس"
                />
                <img
                  className="w-full h-60 object-cover rounded-3xl shadow-md border-2 border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEq6eN2r1y3IcPVGqK3hCQ_gkxM4_bjBCFArdiajWXDhbsHhJRw10uB6PApVVHTlPtSvLzkErXxofFfjaw-GEj3ALA37nMucon2iZNjaTcOEvl_XciOwiJQCEv1_Tt9GVbJhHloj4KoY0rahFprMleK_FsO4aHczTg9NjnO48auQwtMoYvrI_QHKwRt8vm4emZkbeq0dNBqDTD9fsAp6ztu-ovrYTwxxy27IDn_2U"
                  alt="بررسی گیاهان دارویی و محصولات ارگانیک"
                />
              </div>
              <div className="space-y-4 pt-6">
                <img
                  className="w-full h-60 object-cover rounded-3xl shadow-md border-2 border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfAqy6_42AsOCY7-zTHffbbEnw35xt7bDCy0_FDBy3_3Oibaly5-GJJ9EirTueBrX5tSbPiRyr3Oh1ImhKbobLfHzX9_enGc4bxS3YhT9QjdVXhYW85S6vOILXT-D1GTS9TGyt1bSFteObO8pD12QGldy0lzBoYBNpI7VoNHg3iF34MkViARchZs9wypM1h-B8ixVNS_1lzjlDW7zYoydk1P_Tb7QsIGCYaIhNY3M"
                  alt="کارگاه ابزارسازی و مهارت در مشهد"
                />
                <div className="bg-[#991b1b] text-white p-5 rounded-3xl shadow-md flex flex-col justify-center border-2 border-[#ea580c]">
                  <span className="text-[20px] font-black text-white">مشهد مقدس</span>
                  <span className="text-[12px] text-red-200 mt-1">
                    بلوار توس - پایگاه محوری کارزار جهاد اقتصادی محفل
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Contact & Quick Order Form + Map Location Section */}
      <section id="contact-section" className="w-full py-12">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-red-100">
              <div className="mb-6">
                <span className="text-[13px] font-bold text-[#ea580c] block mb-1">
                  ارتباط بی‌واسطه و سریع
                </span>
                <h3 className="text-[22px] font-black text-stone-900">
                  ثبت سفارش تلفنی یا ارسال پیام به خادمان کارزار
                </h3>
                <p className="text-[13px] text-stone-500">
                  برای مشاوره خرید عمده، استخدام کار در منزل یا سفارش‌های ویژه فرم زیر را تکمیل نمایید.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-stone-900 mb-1">
                      نام و نام خانوادگی
                    </label>
                    <input
                      className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                      placeholder="مثال: علی رضایی"
                      required
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-stone-900 mb-1">
                      شماره تماس (ترجیحاً دارای روبیکا یا ایتا)
                    </label>
                    <input
                      className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c] text-right"
                      dir="ltr"
                      placeholder="۰۹..."
                      required
                      type="tel"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-stone-900 mb-1">
                      موضوع درخواست
                    </label>
                    <select className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]">
                      <option value="سفارش خدمات پاک‌کردن زعفران">سفارش خدمات پاک‌کردن زعفران</option>
                      <option value="خرید عینک طبی و اقلام سلامت">خرید عینک طبی و اقلام سلامت</option>
                      <option value="همکاری در اشتغال خانگی توس">همکاری در اشتغال خانگی توس</option>
                      <option value="خرید عمده سوغات و زعفران">خرید عمده سوغات و زعفران</option>
                      <option value="سایر موضوعات">سایر موضوعات و پیشنهادات</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-stone-900 mb-1">
                      منطقه / محله سکونت در مشهد
                    </label>
                    <input
                      className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                      placeholder="مثال: بلوار توس، توس ۶۵"
                      type="text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-stone-900 mb-1">
                    توضیحات و نیازمندی‌ها
                  </label>
                  <textarea
                    className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    placeholder="تعداد، جزئیات سفارش یا زمان تحویل مورد نیاز خود را بنویسید..."
                    rows={3}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <button
                    type="submit"
                    className="bg-[#dc2626] hover:bg-[#ea580c] text-white px-7 py-3 rounded-2xl text-[14px] font-black transition-all shadow-md flex items-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>ارسال و دریافت تماس خادمان</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-[13px] text-stone-600">
                    <span className="material-symbols-outlined text-[#ea580c] text-[20px]">
                      phone
                    </span>
                    <span>پاسخگویی سریع: </span>
                    <a
                      className="text-[#dc2626] font-bold hover:underline font-mono"
                      dir="ltr"
                      href={`tel:${settings.phone}`}
                    >
                      {toPersianDigits(settings.phone)}
                    </a>
                  </div>
                </div>
              </form>
            </div>

            {/* Map and Info */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="bg-white p-5 rounded-3xl shadow-md border border-red-100">
                <h4 className="text-[16px] font-bold text-stone-900 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#dc2626]">pin_drop</span>
                  <span>موقعیت قرارگاه جهاد اقتصادی در مشهد</span>
                </h4>

                {/* Map Mockup */}
                <div
                  className="w-full h-56 bg-cover bg-center rounded-2xl shadow-inner overflow-hidden relative border border-red-100"
                  style={{
                    backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmcLT50wY89td9LoL8Ce5eUQvcG-_9PlrE4p43K1gEn532Gv9ZfVlIU1OaCZzc9KXCkjX5Ey9cYZNEgBuCSKtRWKkF35DhO6KKaF17TdAMesYo-DG2YZV4liiMEAOgzcyJeS_y6pdQKV69sOLEMZFIuD80_y9DlRJb9jptzcASanJ8EpgQd4ZmhbJa8LOjmFvTl12zzNF1oPALKnFB70RT8h3uy8J4xKKzvv087cI')`,
                  }}
                >
                  <div className="absolute bottom-2 right-2 bg-[#7f1d1d]/90 text-white px-3 py-1 rounded-xl text-[11px] font-bold backdrop-blur-sm shadow border border-red-800">
                    مشهد مقدس - محور بلوار توس
                  </div>
                </div>

                <div className="space-y-2 mt-4 text-[13px] text-stone-800">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#dc2626] mt-0.5">
                      location_on
                    </span>
                    <span>آدرس: {settings.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#dc2626]">call</span>
                    <span>تلفن تماس و هماهنگی: </span>
                    <a
                      className="text-[#dc2626] font-bold hover:underline font-mono"
                      dir="ltr"
                      href={`tel:${settings.phone}`}
                    >
                      {toPersianDigits(settings.phone)}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#ea580c]">
                      share
                    </span>
                    <span>کانال رسمی در پیام‌رسان روبیکا: </span>
                    <a
                      className="text-[#ea580c] font-bold hover:underline"
                      href={settings.rubikaUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      karzarmahfel184@
                    </a>
                  </div>
                </div>
              </div>

              {/* Support Banner */}
              <div className="bg-[#991b1b] text-white p-4 rounded-3xl shadow-md flex items-center justify-between border-2 border-[#ea580c]">
                <div className="space-y-0.5">
                  <p className="text-[13px] font-bold text-white">
                    نیاز به راهنمایی در ثبت سفارش دارید؟
                  </p>
                  <p className="text-[11px] text-red-200">تماس رایگان با پشتیبان محلی بلوار توس</p>
                </div>
                <a
                  className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  href={`tel:${settings.phone}`}
                >
                  <span className="material-symbols-outlined text-[18px]">phone_enabled</span>
                  <span font-mono dir="ltr">{toPersianDigits(settings.phone)}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
