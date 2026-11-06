import React from 'react';
import { SiteSettings } from '../types';

interface AdminHeaderProps {
  settings: SiteSettings;
  onNavigateHome: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ settings, onNavigateHome }) => {
  return (
    <header className="fixed top-0 right-64 left-0 h-16 bg-white/95 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] z-40 flex items-center justify-between px-6 md:px-8 border-b border-red-100">
      <div className="flex items-center gap-3">
        <span className="text-[16px] font-extrabold text-stone-900">
          سامانه پایش و مدیریت کارزار جهاد اقتصادی محفل
        </span>
        <span className="bg-[#fff1ee] text-[#dc2626] border border-[#fecaca] px-3 py-1 rounded-full text-[11px] font-bold">
          مشهد مقدس - منطقه توس
        </span>
      </div>

      <div className="flex items-center gap-3">
        <a
          className="bg-[#ea580c] hover:bg-[#c2410c] text-white px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[12px] font-bold transition-all shadow-sm active:scale-95"
          href={settings.rubikaUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined text-white text-[16px]">campaign</span>
          <span>روبیکا کارزار</span>
        </a>

        <button
          onClick={onNavigateHome}
          className="bg-[#fff7ed] hover:bg-[#ffedd5] text-[#c2410c] border border-orange-200 px-3.5 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1 transition-colors"
          title="مشاهده سایت"
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          <span className="hidden sm:inline">فروشگاه عمومی</span>
        </button>

        <div className="flex items-center gap-2 text-stone-500 mr-2">
          <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-[#dc2626] transition-colors">
            notifications
          </span>
          <span className="material-symbols-outlined text-[20px] cursor-pointer hover:text-[#dc2626] transition-colors">
            account_circle
          </span>
        </div>
      </div>
    </header>
  );
};
