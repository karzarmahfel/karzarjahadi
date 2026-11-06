import React from 'react';
import { SiteSettings } from '../types';
import { toPersianDigits } from '../utils';

interface AdminSidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  settings: SiteSettings;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onNavigate,
  settings,
}) => {
  return (
    <aside className="fixed right-0 top-0 h-full w-64 bg-[#7f1d1d] text-white z-50 flex flex-col pt-6 pb-8 shadow-2xl border-l border-red-900">
      {/* Brand Profile */}
      <div className="px-6 mb-6 flex items-center gap-3">
        <img
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-[#ea580c] shadow-sm"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC9bkJ1fRqlFJG3vruHEWD9mdEUqhFXlem95d8nkSqmNKsu-Ov02RCwczHJaMaq6xmJtP4hUwdlFtymHL5rtorVzuXwYqOnHjcdK5Jb3DTVHVgpr-eeY-r_f3Pw_D9xJnDomlPQRzGroIJVUac2q1XwbMmHvIiuA1JFe-pzkW4avp0AS8Yy_Em0AQnv_M9ymUWxNLpzOMN6zepT_E24DFqukTGtJ0YGyQ4-Nz_mzk"
        />
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-white">مدیریت کارزار</span>
          <span className="text-[11px] text-red-200">بلوار توس مشهد</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 text-[13px]">
        <button
          onClick={() => onNavigate('admin-dashboard')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-bold ${
            currentView === 'admin-dashboard'
              ? 'bg-white text-[#991b1b] shadow-md'
              : 'text-red-100 hover:bg-[#991b1b] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined ml-3 text-[20px] text-[#ea580c]">dashboard</span>
          <span>داشبورد و آمار کارزار</span>
        </button>

        <button
          onClick={() => onNavigate('admin-catalog')}
          className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-bold ${
            currentView === 'admin-catalog'
              ? 'bg-white text-[#991b1b] shadow-md'
              : 'text-red-100 hover:bg-[#991b1b] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined ml-3 text-[20px] text-[#ea580c]">inventory_2</span>
          <span>مدیریت محصولات و فرآورده‌ها</span>
        </button>

        <button
          onClick={() => {
            onNavigate('admin-dashboard');
            window.location.hash = 'ordersTableBody';
          }}
          className="w-full flex items-center px-4 py-3 rounded-xl text-red-100 hover:bg-[#991b1b] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined ml-3 text-[20px] text-[#fed7aa]">local_shipping</span>
          <span>سفارش‌ها و توزیع محلی</span>
        </button>

        <button
          onClick={() => {
            onNavigate('admin-catalog');
          }}
          className="w-full flex items-center px-4 py-3 rounded-xl text-red-100 hover:bg-[#991b1b] hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined ml-3 text-[20px] text-[#fed7aa]">group</span>
          <span>تولیدکنندگان مشاغل خانگی</span>
        </button>

        <div className="pt-4 mt-4 border-t border-red-800">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center px-4 py-3 rounded-xl text-white bg-[#ea580c] hover:bg-[#c2410c] transition-all font-bold shadow-md active:scale-95"
          >
            <span className="material-symbols-outlined ml-3 text-[20px]">storefront</span>
            <span>مشاهده فروشگاه عمومی</span>
          </button>
        </div>
      </nav>

      {/* Support Footer */}
      <div className="px-4">
        <div className="bg-[#991b1b] p-3 rounded-xl text-[12px] text-red-100 flex items-center justify-between border border-red-800">
          <span>پشتیبانی: {toPersianDigits(settings.phone)}</span>
          <span className="material-symbols-outlined text-[18px] text-[#fed7aa]">
            support_agent
          </span>
        </div>
      </div>
    </aside>
  );
};
