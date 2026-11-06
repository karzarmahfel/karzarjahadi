import React from 'react';
import { SiteSettings } from '../types';
import { toPersianDigits } from '../utils';

interface HeaderProps {
  settings: SiteSettings;
  cartCount: number;
  currentView: string;
  onNavigate: (view: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCartModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  cartCount,
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenCartModal,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#991b1b] text-white shadow-[0_2px_12px_rgba(153,27,27,0.18)]">
      {/* Top Banner (Deep Burgundy Red) */}
      <div className="bg-[#7f1d1d] text-white text-[11px] py-1 px-4 md:px-8 flex items-center justify-between border-b border-red-900/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#fed7aa] text-[16px]">campaign</span>
          <span className="truncate">اطلاعیه ویژه کارزار جهاد اقتصادی: توزیع سراسری محصولات بومی محله‌ای مشهد مقدس - بلوار توس</span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a
            className="flex items-center gap-1 text-[#fed7aa] hover:text-white transition-colors font-medium"
            href={`tel:${settings.phone}`}
          >
            <span className="material-symbols-outlined text-[14px]">call</span>
            <span>تماس فوری: {toPersianDigits(settings.phone)}</span>
          </a>
          <span className="opacity-40 hidden sm:inline">|</span>
          <span className="text-red-100 hidden sm:inline">پشتیبانی محلی توس</span>
        </div>
      </div>

      {/* Main Header (Rich Crimson Red) */}
      <div className="h-20 max-w-[1360px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-right hover:opacity-95 transition-opacity"
        >
          <img
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-[#ea580c] shadow-sm"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC9bkJ1fRqlFJG3vruHEWD9mdEUqhFXlem95d8nkSqmNKsu-Ov02RCwczHJaMaq6xmJtP4hUwdlFtymHL5rtorVzuXwYqOnHjcdK5Jb3DTVHVgpr-eeY-r_f3Pw_D9xJnDomlPQRzGroIJVUac2q1XwbMmHvIiuA1JFe-pzkW4avp0AS8Yy_Em0AQnv_M9ymUWxNLpzOMN6zepT_E24DFqukTGtJ0YGyQ4-Nz_mzk"
          />
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold text-white leading-tight">
              {settings.siteName}
            </span>
            <span className="text-[11px] text-red-100 hidden sm:block">
              تولید، اشتغال و رونق معیشت محلی در مشهد مقدس (بلوار توس)
            </span>
          </div>
        </button>

        {/* Search Bar (Crisp White with Orange Focus Ring) */}
        <div className="flex-1 max-w-xl mx-2 md:mx-4">
          <div className="relative flex items-center w-full">
            <span className="material-symbols-outlined absolute right-3 text-stone-400 pointer-events-none text-[20px]">
              search
            </span>
            <input
              className="w-full bg-white text-stone-900 placeholder:text-stone-400 text-[13px] pr-10 pl-4 py-2.5 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-[#ea580c] shadow-sm"
              placeholder="جستجوی کالا، دست‌سازه خانگی، خدمات کارزار..."
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
              }}
            />
          </div>
        </div>

        {/* Action Buttons (Orange & White accents) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <a
            className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-[12px] font-bold transition-all shadow-md active:scale-95"
            href={settings.rubikaUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-white text-[18px]">verified</span>
            <span className="hidden md:inline">کانال روبیکا</span>
          </a>

          {/* Cart Trigger */}
          <button
            onClick={onOpenCartModal}
            className={`relative px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-[12px] font-bold transition-all shadow-sm ${
              currentView === 'cart'
                ? 'bg-[#ea580c] text-white ring-2 ring-white/50'
                : 'bg-white hover:bg-[#fff7ed] text-[#991b1b]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-[#ea580c]">shopping_basket</span>
            <span className="hidden sm:inline">سبد خرید</span>
            <span className="bg-[#dc2626] text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-extrabold shadow-sm">
              {toPersianDigits(cartCount)}
            </span>
          </button>

          {/* Admin Switcher */}
          <button
            onClick={() => {
              if (currentView.startsWith('admin')) {
                onNavigate('home');
              } else {
                onNavigate('admin-dashboard');
              }
            }}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-[12px] font-bold transition-all ${
              currentView.startsWith('admin')
                ? 'bg-[#ea580c] text-white shadow-md'
                : 'bg-[#7f1d1d] hover:bg-[#651212] text-white border border-white/20'
            }`}
          >
            <span className="material-symbols-outlined text-[18px] text-[#fed7aa]">admin_panel_settings</span>
            <span className="hidden md:inline">
              {currentView.startsWith('admin') ? 'مشاهده فروشگاه' : 'پنل مدیریت'}
            </span>
          </button>
        </div>
      </div>

      {/* Nav Categories Bar (Clean White Background with Red/Orange highlights) */}
      <div className="bg-white text-stone-800 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border-b border-[#fee2e2]">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8">
          <nav className="flex items-center gap-3 sm:gap-5 py-2 overflow-x-auto text-[13px] no-scrollbar">
            <button
              onClick={() => onNavigate('home')}
              className={`py-1.5 px-3 whitespace-nowrap transition-colors rounded-lg font-bold ${
                currentView === 'home'
                  ? 'bg-[#fff1ee] text-[#dc2626] border border-[#fecaca]'
                  : 'text-stone-700 hover:text-[#dc2626] hover:bg-[#fff7ed]'
              }`}
            >
              همه محصولات
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                window.location.hash = 'productsSection';
              }}
              className="text-stone-700 hover:text-[#dc2626] hover:bg-[#fff7ed] py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors font-medium"
            >
              خدمات کارزار
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                window.location.hash = 'productsSection';
              }}
              className="text-stone-700 hover:text-[#dc2626] hover:bg-[#fff7ed] py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors font-medium"
            >
              محصولات و فرآورده‌ها
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                window.location.hash = 'productsSection';
              }}
              className="text-stone-700 hover:text-[#dc2626] hover:bg-[#fff7ed] py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors font-medium"
            >
              دست‌سازه‌ها و تولیدات خانگی
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                window.location.hash = 'special-offers';
              }}
              className="text-[#ea580c] hover:bg-[#fff7ed] py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>تخفیف‌ها و پیشنهادات شگفت‌انگیز</span>
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                window.location.hash = 'about-section';
              }}
              className="text-stone-700 hover:text-[#dc2626] hover:bg-[#fff7ed] py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors font-medium"
            >
              درباره کارزار
            </button>
            <button
              onClick={() => {
                onNavigate('home');
                window.location.hash = 'contact-section';
              }}
              className="text-stone-700 hover:text-[#dc2626] hover:bg-[#fff7ed] py-1.5 px-3 rounded-lg whitespace-nowrap transition-colors font-medium"
            >
              تماس با ما
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
