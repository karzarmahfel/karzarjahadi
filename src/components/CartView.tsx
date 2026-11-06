import React, { useState } from 'react';
import { CartItem, SiteSettings } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface CartViewProps {
  cart: CartItem[];
  settings: SiteSettings;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onNavigateHome: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onNavigateHome,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('khorasan-razavi');
  const [city, setCity] = useState('mashhad');
  const [postalCode, setPostalCode] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [successOrder, setSuccessOrder] = useState<{
    trackingCode: string;
    buyerName: string;
    total: number;
  } | null>(null);

  // Calculations
  const totalPayable = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalDiscount = cart.reduce((sum, item) => {
    if (item.product.originalPrice && item.product.originalPrice > item.product.price) {
      return sum + (item.product.originalPrice - item.product.price) * item.quantity;
    }
    return sum;
  }, 0);

  const rawSubtotal = totalPayable + totalDiscount;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('سبد خرید شما خالی است!');
      return;
    }
    if (!fullName.trim()) {
      alert('لطفاً نام و نام خانوادگی تحویل‌گیرنده را وارد فرمایید.');
      return;
    }
    if (!phone.trim() || !/^09[0-9]{9}$/.test(phone.trim())) {
      alert('لطفاً شماره تلفن همراه معتبر (۱۱ رقم با پیش‌شماره ۰۹) وارد نمایید.');
      return;
    }
    if (!address.trim()) {
      alert('لطفاً نشانی دقیق پستی تحویل را مرقوم بفرمایید.');
      return;
    }

    const tracking = 'KM-' + Math.floor(10000 + Math.random() * 90000);
    setSuccessOrder({
      trackingCode: tracking,
      buyerName: fullName,
      total: totalPayable,
    });
    onClearCart();
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 md:px-8 w-full py-8">
      {/* 4-Step Process Bar in Red, White and Orange */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#fff1ee] p-4 rounded-2xl flex items-center justify-between shadow-sm border-2 border-[#dc2626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ea580c] text-white flex items-center justify-center font-bold shadow-sm">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            </div>
            <div>
              <div className="text-[11px] text-[#dc2626] font-bold">مرحله اول</div>
              <div className="text-[15px] font-black text-stone-900">سبد خرید محفل</div>
            </div>
          </div>
          <span className="text-[11px] bg-[#dc2626] text-white px-3 py-1 rounded-full font-bold shadow-sm">
            فعال
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-orange-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">local_shipping</span>
            </div>
            <div>
              <div className="text-[11px] text-stone-500">ارسال فوری</div>
              <div className="text-[15px] font-bold text-stone-900">پیک جهادی بلوار توس</div>
            </div>
          </div>
          <span className="text-[11px] text-stone-500">مشهد مقدس</span>
        </div>

        <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-orange-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">price_check</span>
            </div>
            <div>
              <div className="text-[11px] text-stone-500">تضمین سود مردمی</div>
              <div className="text-[15px] font-bold text-stone-900">حذف کامل واسطه‌ها</div>
            </div>
          </div>
          <span className="text-[11px] bg-[#fff1ee] text-[#dc2626] border border-red-200 px-3 py-1 rounded-full font-bold">
            ۱۰۰٪ برکت
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fff7ed] text-[#ea580c] border border-orange-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
              <div className="text-[11px] text-stone-500">اعتبار کارزار</div>
              <div className="text-[15px] font-bold text-stone-900">خرید مطمئن و جهادی</div>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#dc2626] text-[22px]">
            check_circle
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Items and Delivery Form) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Cart Items List */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
            <div className="flex items-center justify-between pb-3 mb-4 bg-[#fff1ee] p-3.5 rounded-2xl border border-red-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#dc2626] text-[24px]">
                  shopping_basket
                </span>
                <h2 className="text-[18px] font-black text-stone-900">
                  اقلام انتخابی شما در کارزار
                </h2>
              </div>
              <span className="bg-[#dc2626] text-white text-[12px] font-black px-3.5 py-1 rounded-full shadow-sm">
                {toPersianDigits(cart.length)} قلم کالا
              </span>
            </div>

            {/* Items */}
            <div className="flex flex-col gap-4">
              {cart.map((item) => {
                const lineTotal = item.product.price * item.quantity;
                return (
                  <div
                    key={item.product.id}
                    className="bg-[#fffaf8] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md border border-red-100"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 shadow-inner border border-red-100">
                        <img
                          className="w-full h-full object-cover"
                          src={item.product.imageUrl}
                          alt={item.product.title}
                        />
                        <span className="absolute top-1 right-1 bg-[#ea580c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                          {item.product.categoryLabel || item.product.category}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-[#ea580c]">
                          {item.product.subtitle || 'طرح اشتغال و جهاد اقتصادی توس'}
                        </span>
                        <h3 className="text-[15px] font-bold text-stone-900">
                          {item.product.title}
                        </h3>
                        <div className="text-[12px] text-stone-500 flex items-center gap-1 mt-1">
                          <span className="material-symbols-outlined text-[16px] text-stone-400">
                            location_on
                          </span>
                          <span>تولید محله‌ای در بلوار توس، مشهد مقدس</span>
                        </div>
                        {item.product.originalPrice &&
                          item.product.originalPrice > item.product.price && (
                            <div className="text-[11px] text-[#dc2626] font-bold mt-1">
                              تخفیف ویژه جهاد:{' '}
                              {formatPrice(item.product.originalPrice - item.product.price)} تومان
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-red-100">
                      {/* Qty Counter */}
                      <div className="flex items-center bg-[#fff7ed] rounded-xl p-1 border border-orange-200">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-8 h-8 rounded-lg bg-white text-stone-800 flex items-center justify-center hover:bg-[#ea580c] hover:text-white transition-colors shadow-sm font-bold"
                          title="افزایش تعداد"
                        >
                          <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                        <span className="w-10 text-center font-black text-[16px] text-stone-900">
                          {toPersianDigits(item.quantity)}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-8 h-8 rounded-lg bg-white text-stone-800 flex items-center justify-center hover:bg-[#ffedd5] transition-colors shadow-sm font-bold"
                          title="کاهش تعداد"
                        >
                          <span className="material-symbols-outlined text-[18px]">remove</span>
                        </button>
                      </div>

                      {/* Price */}
                      <div className="flex flex-col items-end">
                        {item.product.originalPrice && (
                          <div className="text-[11px] text-stone-400 line-through">
                            {formatPrice(item.product.originalPrice * item.quantity)} تومان
                          </div>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-[19px] font-black text-[#dc2626]">
                            {formatPrice(lineTotal)}
                          </span>
                          <span className="text-[11px] text-stone-500">تومان</span>
                        </div>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1.5 text-[#dc2626] hover:bg-[#fff1ee] rounded-xl transition-colors"
                        title="حذف این مورد"
                      >
                        <span className="material-symbols-outlined text-[22px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {cart.length === 0 && (
                <div className="text-center py-12 bg-[#fffaf8] rounded-2xl border border-red-100">
                  <span className="material-symbols-outlined text-[48px] text-stone-400">
                    remove_shopping_cart
                  </span>
                  <p className="text-[16px] font-bold text-stone-900 mt-2">
                    سبد خرید شما در حال حاضر خالی است!
                  </p>
                  <p className="text-[13px] text-stone-500 mt-1">
                    می‌توانید از محصولات و دست‌سازه‌های محلی کارزار دیدن فرمایید.
                  </p>
                  <button
                    onClick={onNavigateHome}
                    className="mt-4 px-6 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white rounded-xl text-[13px] font-bold transition-all shadow-md"
                  >
                    بازگشت به ویترین محصولات
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Delivery and Checkout Form */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-100">
            <div className="flex items-center gap-3 mb-6 bg-[#fff1ee] p-3.5 rounded-2xl border border-red-200">
              <span className="material-symbols-outlined text-[#dc2626] text-[24px]">
                assignment
              </span>
              <div>
                <h2 className="text-[18px] font-black text-stone-900">
                  اطلاعات تحویل‌گیرنده و آدرس ارسال
                </h2>
                <p className="text-[12px] text-stone-500">
                  جهت ارسال فوری و هماهنگی توزیع جهادی در مشهد مقدس و سایر شهرها
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[13px] font-bold text-stone-900">
                    نام و نام خانوادگی تحویل‌گیرنده *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute right-3 top-3 text-stone-400 text-[20px]">
                      person
                    </span>
                    <input
                      className="w-full bg-[#fff7ed] text-stone-900 text-[13px] pr-10 pl-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c] transition-all"
                      placeholder="مثال: علی احمدی"
                      required
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[13px] font-bold text-stone-900">
                    شماره تماس همراه (جهت هماهنگی پیک) *
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute right-3 top-3 text-stone-400 text-[20px]">
                      smartphone
                    </span>
                    <input
                      className="w-full bg-[#fff7ed] text-stone-900 text-[13px] pr-10 pl-4 py-2.5 rounded-xl border border-orange-200 text-right focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c] transition-all"
                      dir="ltr"
                      placeholder="09xxxxxxxxx"
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <span className="text-[11px] text-stone-500">شماره ۱۱ رقمی همراه با ۰۹</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[13px] font-bold text-stone-900">استان</label>
                  <select
                    className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  >
                    <option value="khorasan-razavi">خراسان رضوی</option>
                    <option value="tehran">تهران</option>
                    <option value="other">سایر استان‌ها</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[13px] font-bold text-stone-900">شهر</label>
                  <select
                    className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c]"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="mashhad">مشهد مقدس</option>
                    <option value="chenaran">چناران / گلبهار</option>
                    <option value="torghabeh">طرقبه و شاندیز</option>
                    <option value="other-city">سایر شهرها</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[13px] font-bold text-stone-900">
                    کد پستی (۱۰ رقمی)
                  </label>
                  <input
                    className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:bg-white"
                    maxLength={10}
                    placeholder="مثال: ۹۱۹۹۸۸۷۷۶۶"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[13px] font-bold text-stone-900">
                  نشانی دقیق پستی تحویل *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute right-3 top-3 text-stone-400 text-[20px]">
                    home_pin
                  </span>
                  <textarea
                    className="w-full bg-[#fff7ed] text-stone-900 text-[13px] pr-10 pl-4 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c] transition-all"
                    placeholder="مشهد، بلوار توس، توس ...، کوچه ...، پلاک ...، زنگ ..."
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <p className="text-[11px] text-[#dc2626] font-bold">
                  توزیع رایگان و تحویل روزانه برای تمامی آدرس‌های واقع در حاشیه و محلات بلوار توس مشهد فعال است.
                </p>
              </div>

              <div className="space-y-1">
                <label className="block text-[13px] font-bold text-stone-900">
                  یادداشت و توضیحات سفارش (اختیاری)
                </label>
                <input
                  className="w-full bg-[#fff7ed] text-stone-900 text-[13px] px-3.5 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:bg-white"
                  placeholder="ساعت حضور در منزل، شماره طبقه، هماهنگی‌های ویژه..."
                  type="text"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="block text-[14px] font-bold text-stone-900">
                  شیوه تسویه و پرداخت
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    onClick={() => setPaymentMethod('online')}
                    className={`cursor-pointer p-4 rounded-2xl flex items-center justify-between transition-all border ${
                      paymentMethod === 'online'
                        ? 'bg-[#fff1ee] border-2 border-[#dc2626] shadow-sm'
                        : 'bg-[#fff7ed] border border-orange-200 hover:bg-[#ffedd5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="w-4 h-4 accent-[#dc2626]"
                      />
                      <div>
                        <div className="text-[14px] font-bold text-stone-900">پرداخت امن آنلاین</div>
                        <div className="text-[12px] text-stone-500">
                          کلیه کارت‌های عضو شتاب (تایید فوری)
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#dc2626] text-[26px]">
                      credit_card
                    </span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`cursor-pointer p-4 rounded-2xl flex items-center justify-between transition-all border ${
                      paymentMethod === 'cod'
                        ? 'bg-[#fff1ee] border-2 border-[#dc2626] shadow-sm'
                        : 'bg-[#fff7ed] border border-orange-200 hover:bg-[#ffedd5]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 accent-[#dc2626]"
                      />
                      <div>
                        <div className="text-[14px] font-bold text-stone-900">
                          پرداخت پس از تحویل
                        </div>
                        <div className="text-[12px] text-stone-500">
                          ویژه ساکنین مشهد مقدس و بلوار توس
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#ea580c] text-[26px]">
                      local_atm
                    </span>
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (Summary & Sidebars) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Order Summary Box */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-red-100 sticky top-36">
            <div className="flex items-center justify-between pb-2 mb-4 bg-[#991b1b] text-white p-3.5 rounded-2xl shadow-sm">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#fed7aa]">receipt_long</span>
                <span className="text-[15px] font-bold">پیش‌فاکتور شفاف کارزار</span>
              </div>
              <span className="text-[11px] bg-white text-[#991b1b] px-2.5 py-0.5 rounded-full font-extrabold">
                رسمی و حمایتی
              </span>
            </div>

            <div className="space-y-4 text-[13px]">
              <div className="flex justify-between items-center text-stone-600">
                <span>جمع قیمت کالاها:</span>
                <div className="flex items-baseline gap-1 text-stone-900">
                  <span className="font-bold text-[16px]">{formatPrice(rawSubtotal)}</span>
                  <span>تومان</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[#ea580c]">
                <span className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                  سود حاصل از خرید حمایتی:
                </span>
                <div className="flex items-baseline gap-1">
                  <span>-</span>
                  <span className="font-bold text-[15px]">{formatPrice(totalDiscount)}</span>
                  <span>تومان</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-stone-600">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  هزینه ارسال پیک:
                </span>
                <span className="bg-[#fff1ee] text-[#dc2626] border border-red-200 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                  رایگان (توس مشهد)
                </span>
              </div>

              <div className="bg-[#fff1ee] p-4 rounded-2xl space-y-1 border border-red-200">
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-bold text-stone-900">مبلغ نهایی قابل پرداخت:</span>
                  <div className="flex items-baseline gap-1 text-[#dc2626]">
                    <span className="text-[24px] font-black">{formatPrice(totalPayable)}</span>
                    <span className="text-[12px] font-bold">تومان</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500">
                  مالیات بر ارزش افزوده در این طرح جهادی لحاظ نمی‌شود.
                </p>
              </div>

              <button
                onClick={handleSubmitOrder}
                disabled={cart.length === 0}
                className={`w-full py-4 px-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 font-black text-[15px] active:scale-95 ${
                  cart.length === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-orange-500/20'
                }`}
              >
                <span className="material-symbols-filled text-[22px]">verified</span>
                <span>خرید و ثبت نهایی سفارش</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 text-center">
                <span className="material-symbols-outlined text-[16px] text-[#dc2626]">lock</span>
                <span>امنیت کامل تراکنش تحت نظارت ستاد جهاد محفل</span>
              </div>
            </div>
          </div>

          {/* Quick Phone Order Helper Box */}
          <div className="bg-[#991b1b] text-white rounded-3xl p-6 shadow-md space-y-3 border-2 border-red-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ea580c] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">phone_in_talk</span>
              </div>
              <div>
                <h4 className="text-[15px] font-bold">ثبت سفارش تلفنی مستقیم</h4>
                <p className="text-[11px] text-red-200">اگر در ثبت آنلاین مشکلی دارید</p>
              </div>
            </div>
            <p className="text-[12px] text-red-100 leading-relaxed">
              پشتیبانان جهادی ما در بلوار توس آماده ثبت تلفنی سفارش، پاسخگویی به سوالات و ارسال سریع می‌باشند.
            </p>
            <a
              className="w-full bg-white text-[#991b1b] hover:bg-[#fff7ed] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] transition-colors shadow-sm"
              href={`tel:${settings.phone}`}
            >
              <span className="material-symbols-outlined text-[20px] text-[#ea580c]">call</span>
              <span dir="ltr" className="font-mono">{toPersianDigits(settings.phone)}</span>
            </a>
          </div>

          {/* Rubika Helper Box */}
          <div className="bg-[#ea580c] text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white text-[24px]">campaign</span>
                <div>
                  <h4 className="text-[15px] font-bold">کانال رسمی روبیکای کارزار</h4>
                  <p className="text-[11px] text-orange-100">اطلاع از تخفیف‌ها و کالاهای تازه</p>
                </div>
              </div>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                روبیکا
              </span>
            </div>
            <p className="text-[12px] text-orange-50 leading-relaxed">
              محصولات تازه ارگانیک، صنایع دستی خواهران و فرصت‌های هفتگی جهاد معیشتی را زودتر از بقیه در کانال روبیکا دنبال کنید.
            </p>
            <a
              className="w-full bg-white text-[#c2410c] hover:bg-[#fff7ed] py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[13px] transition-colors shadow-sm"
              href={settings.rubikaUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span>ورود و عضویت در کانال روبیکا (karzarmahfel184)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center border border-red-100">
            <div className="w-20 h-20 bg-[#fff1ee] text-[#dc2626] border-2 border-red-200 rounded-full mx-auto flex items-center justify-center shadow-inner">
              <span className="material-symbols-filled text-[44px]">verified</span>
            </div>
            <div className="space-y-1">
              <span className="text-[12px] font-bold text-[#ea580c]">
                {settings.siteName} - مشهد مقدس
              </span>
              <h3 className="text-[20px] font-black text-stone-900">
                سفارش جهادی شما با موفقیت ثبت شد!
              </h3>
              <p className="text-[13px] text-stone-500">
                ضمن تشکر از حمایت شما از تولید و اشتغال محلی، سفارش شما وارد مرحله آماده‌سازی و ارسال گردید.
              </p>
            </div>

            <div className="bg-[#fff1ee] p-4 rounded-2xl space-y-2.5 text-right border border-red-200">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-stone-600">کد پیگیری سفارش:</span>
                <span className="font-bold text-[16px] text-[#dc2626] font-mono" dir="ltr">
                  {successOrder.trackingCode}
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-stone-600">نام خریدار:</span>
                <span className="font-bold text-stone-900">{successOrder.buyerName}</span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-stone-600">مبلغ کل پرداختی:</span>
                <span className="font-bold text-[#dc2626]">
                  {formatPrice(successOrder.total)} تومان
                </span>
              </div>
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-stone-600">محدوده ارسال:</span>
                <span className="font-bold text-stone-900">مشهد - بلوار توس (پیک اختصاصی)</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => {
                  setSuccessOrder(null);
                  onNavigateHome();
                }}
                className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 px-4 rounded-xl font-bold text-[14px] transition-colors shadow-md"
              >
                بازگشت به ویترین فروشگاه
              </button>
              <a
                className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#ea580c] hover:underline"
                href={settings.rubikaUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[16px]">campaign</span>
                <span>پیگیری وضعیت ارسال در روبیکای محفل</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
