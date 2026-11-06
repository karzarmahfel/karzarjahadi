import React from 'react';
import { SiteSettings } from '../types';
import { toPersianDigits } from '../utils';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="w-full bg-[#7f1d1d] text-red-100 mt-12 pt-12 pb-8 border-t-4 border-[#ea580c]">
      <div className="max-w-[1360px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fed7aa] text-[28px]">
                storefront
              </span>
              <span className="text-[18px] font-extrabold text-white">
                {settings.siteName}
              </span>
            </div>
            <p className="text-[13px] leading-relaxed text-red-100/90">
              پلتفرم مردمی و عدالت‌محور با هدف حذف واسطه‌ها، اشتغال‌زایی خرد خانگی و رونق اقتصاد مقاومتی در منطقه بلوار توس مشهد مقدس. پشتیبان رسمی تولیدکنندگان بومی و مشاغل خانگی مذهبی.
            </p>
            <div className="pt-1">
              <a
                className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-md active:scale-95"
                href={settings.rubikaUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-white text-[18px]">
                  campaign
                </span>
                <span>عضویت در کانال روبیکا محفل</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[16px] font-extrabold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
              <span>دسترسی سریع</span>
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">chevron_left</span>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  مشاهده همه محصولات و کالاها
                </button>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">chevron_left</span>
                <button
                  onClick={() => onNavigate('cart')}
                  className="hover:text-white transition-colors"
                >
                  سبد خرید و تسویه فاکتور جهادی
                </button>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">chevron_left</span>
                <button
                  onClick={() => onNavigate('admin-catalog')}
                  className="hover:text-white transition-colors"
                >
                  مدیریت کاتالوگ و انبار کارزار
                </button>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">chevron_left</span>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition-colors"
                >
                  داشبورد فرماندهی و سفارش‌ها
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div className="space-y-4">
            <h4 className="text-[16px] font-extrabold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
              <span>راهنمای خرید و پشتیبانی</span>
            </h4>
            <ul className="space-y-2.5 text-[13px]">
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">chevron_left</span>
                <span>قوانین و شیوه حمایت جهادی</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">chevron_left</span>
                <span>نحوه ارسال سریع در مشهد و حومه</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ea580c]">call</span>
                <a
                  className="hover:text-white transition-colors font-mono"
                  dir="ltr"
                  href={`tel:${settings.phone}`}
                >
                  {toPersianDigits(settings.phone)}
                </a>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#ea580c] mt-0.5">location_on</span>
                <span className="text-red-100/90">{settings.address}</span>
              </li>
            </ul>
          </div>

          {/* Trust Badges */}
          <div className="space-y-4">
            <h4 className="text-[16px] font-extrabold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
              <span>نمادهای اعتماد و اصالت</span>
            </h4>
            <p className="text-[13px] leading-relaxed text-red-100/90">
              تضمین کیفیت کالا، نظارت مستقیم مردمی و حمایت صددرصدی از تولیدات بومی.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center w-24 h-24 shadow-md text-stone-900 border border-red-200">
                <span className="material-symbols-outlined text-[#dc2626] text-[34px]">
                  verified_user
                </span>
                <span className="text-[11px] font-bold mt-1 text-center text-[#991b1b]">ضمانت اصالت</span>
              </div>
              <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center w-24 h-24 shadow-md text-stone-900 border border-red-200">
                <span className="material-symbols-outlined text-[#ea580c] text-[34px]">
                  handshake
                </span>
                <span className="text-[11px] font-bold mt-1 text-center text-[#c2410c]">جهاد معیشتی</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-red-800/80 text-center text-[12px] text-red-200/90">
          <p>
            تمامی حقوق این سامانه متعلق به {settings.siteName} (مشهد مقدس - بلوار توس) می‌باشد. طراحی شده جهت خدمت‌رسانی به معیشت خانواده‌های ایرانی.
          </p>
        </div>
      </div>
    </footer>
  );
};
