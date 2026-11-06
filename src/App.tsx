import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CartView } from './components/CartView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminCatalog } from './components/AdminCatalog';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
} from './data';
import { ProductItem, OrderItem, CategoryItem, SiteSettings, CartItem } from './types';

export default function App() {
  // Global State
  const [currentView, setCurrentView] = useState<'home' | 'cart' | 'admin-dashboard' | 'admin-catalog'>('home');
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed Secret Admin Password - permanent & immutable (sajad)
  const FIXED_ADMIN_PASS = 'sajad';
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState<boolean>(false);
  const [targetAdminView, setTargetAdminView] = useState<'admin-dashboard' | 'admin-catalog'>('admin-dashboard');
  const [adminPassInput, setAdminPassInput] = useState<string>('');
  const [adminAuthError, setAdminAuthError] = useState<boolean>(false);

  // Cart State (pre-populated with 2 initial items)
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // پاک کردن زعفران
      quantity: 1,
    },
    {
      product: INITIAL_PRODUCTS[1], // عینک طبی
      quantity: 1,
    },
  ]);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Phone Order modal state
  const [phoneModalProduct, setPhoneModalProduct] = useState<string | null>(null);

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleNavigateRequest = (view: string) => {
    if (view.startsWith('admin')) {
      if (isAdminAuthenticated) {
        setCurrentView(view as any);
      } else {
        setTargetAdminView(view as any);
        setAdminPassInput('');
        setAdminAuthError(false);
        setAdminAuthModalOpen(true);
      }
    } else {
      setCurrentView(view as any);
    }
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassInput === FIXED_ADMIN_PASS) {
      setIsAdminAuthenticated(true);
      setAdminAuthModalOpen(false);
      setAdminAuthError(false);
      setAdminPassInput('');
      setCurrentView(targetAdminView);
      showToast('ورود با موفقیت انجام شد. خوش آمدید.');
    } else {
      setAdminAuthError(true);
      setAdminPassInput('');
    }
  };

  const handleAdminLock = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('home');
    showToast('پنل مدیریت قفل شد.');
  };

  // Cart Actions
  const handleAddToCart = (product: ProductItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`«${product.title}» به سبد سفارشات اضافه شد.`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((i) => {
          if (i.product.id === productId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('کالا از سبد خرید حذف شد.');
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Admin Actions
  const handleApproveOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'completed', statusLabel: 'ارسال و تسویه شد' }
          : o
      )
    );
  };

  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
  };

  const handleDeleteProduct = (prodId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== prodId));
  };

  const handleToggleProductStatus = (prodId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === prodId ? { ...p, active: !p.active } : p))
    );
  };

  const handleAddCategory = (name: string) => {
    const newCat: CategoryItem = {
      id: String(Date.now()),
      name,
      count: 0,
      icon: 'folder',
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const handleUpdateCategory = (id: string, newName: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
    );
  };

  const handleDeleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = currentView.startsWith('admin') && isAdminAuthenticated;

  return (
    <div className="min-h-screen bg-[#fffaf8] text-[#1c1917] flex flex-col font-sans">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#7f1d1d] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-800 animate-bounce">
          <span className="material-symbols-filled text-[#ea580c] text-[22px]">
            check_circle
          </span>
          <span className="text-[13px] font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Authentication Gate Modal */}
      {adminAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-red-100">
            <div className="w-16 h-16 rounded-2xl bg-[#fff1ee] mx-auto flex items-center justify-center text-[#dc2626] shadow-sm border border-red-200">
              <span className="material-symbols-outlined text-[32px]">
                lock
              </span>
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-[20px] font-black text-stone-900">احراز هویت ورود به مدیریت</h2>
              <p className="text-[12px] text-stone-500">
                دسترسی به این بخش صرفاً با رمز محرمانه مدیر امکان‌پذیر است.
              </p>
            </div>

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div className="space-y-1.5 text-right">
                <label className="text-[12px] font-bold text-stone-900">گذرواژه امنیتی</label>
                <input
                  className="w-full bg-[#fff7ed] px-4 py-3 rounded-xl text-[14px] text-stone-900 border border-orange-200 focus:outline-none focus:ring-2 focus:ring-[#ea580c] transition-all"
                  placeholder="••••••••"
                  type="password"
                  autoFocus
                  required
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                />
                {adminAuthError && (
                  <p className="text-[11px] text-[#dc2626] font-bold pt-1">
                    گذرواژه نادرست است! لطفاً مجدداً تلاش نمایید.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3 rounded-xl text-[13px] font-bold transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-[#fed7aa]">
                    verified_user
                  </span>
                  <span>تأیید و ورود</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAdminAuthModalOpen(false)}
                  className="bg-[#fff7ed] hover:bg-[#ffedd5] text-stone-700 border border-orange-200 px-5 py-3 rounded-xl text-[13px] font-bold transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Phone Order Modal */}
      {phoneModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-stone-900 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-4 border border-red-100">
            <div className="w-16 h-16 rounded-2xl bg-[#ea580c] text-white mx-auto flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[32px]">call</span>
            </div>
            <div>
              <h4 className="text-[19px] font-extrabold text-stone-900">سفارش فوری تلفنی</h4>
              <p className="text-[13px] text-[#dc2626] mt-1 font-bold">{phoneModalProduct}</p>
            </div>
            <p className="text-[13px] text-stone-600 leading-relaxed">
              جهت ثبت سریع، دریافت مشاوره سایز یا سفارش عمده بدون نیاز به درگاه آنلاین، هم‌اکنون با خادمان ما تماس حاصل نمایید:
            </p>
            <div className="bg-[#fff1ee] p-3.5 rounded-2xl text-[20px] text-[#991b1b] font-black font-mono border border-red-200" dir="ltr">
              {settings.phone}
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a
                className="flex-1 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-2.5 rounded-xl text-[13px] font-bold transition-colors shadow-md text-center"
                href={`tel:${settings.phone}`}
              >
                تماس مستقیم
              </a>
              <button
                className="flex-1 bg-[#fff7ed] text-stone-800 hover:bg-[#ffedd5] border border-orange-200 py-2.5 rounded-xl text-[13px] font-bold transition-colors"
                onClick={() => setPhoneModalProduct(null)}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Routing */}
      {isAdmin ? (
        <div className="flex w-full">
          {/* Admin Sidebar */}
          <AdminSidebar
            currentView={currentView}
            onNavigate={handleNavigateRequest}
            settings={settings}
          />

          {/* Admin Content Area (Right margin for fixed 64 (16rem) sidebar in RTL) */}
          <div className="pr-64 w-full min-h-screen flex flex-col bg-[#fffaf8]">
            <AdminHeader
              settings={settings}
              onNavigateHome={() => setCurrentView('home')}
            />

            <main className="pt-16 pb-12 w-full flex-1">
              {currentView === 'admin-dashboard' && (
                <AdminDashboard
                  orders={orders}
                  settings={settings}
                  onUpdateSettings={setSettings}
                  onApproveOrder={handleApproveOrder}
                  onShowToast={showToast}
                  onNavigateToCatalog={() => setCurrentView('admin-catalog')}
                  onNavigateHome={() => setCurrentView('home')}
                  onLockAdmin={handleAdminLock}
                />
              )}

              {currentView === 'admin-catalog' && (
                <AdminCatalog
                  products={products}
                  categories={categories}
                  onAddProduct={handleAddProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  onToggleProductStatus={handleToggleProductStatus}
                  onAddCategory={handleAddCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                  onShowToast={showToast}
                  onNavigateHome={() => setCurrentView('home')}
                />
              )}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Public Storefront Header */}
          <Header
            settings={settings}
            cartCount={totalCartCount}
            currentView={currentView}
            onNavigate={handleNavigateRequest}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCartModal={() => setCurrentView('cart')}
          />

          {/* Public Storefront Body */}
          <main className="w-full pt-36 flex-1">
            {currentView === 'home' && (
              <HomeView
                products={products}
                settings={settings}
                searchQuery={searchQuery}
                onAddToCart={handleAddToCart}
                onOpenPhoneModal={(pName) => setPhoneModalProduct(pName)}
                onShowToast={showToast}
                onNavigateToCart={() => setCurrentView('cart')}
              />
            )}

            {currentView === 'cart' && (
              <CartView
                cart={cart}
                settings={settings}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onClearCart={handleClearCart}
                onNavigateHome={() => setCurrentView('home')}
              />
            )}
          </main>

          {/* Public Storefront Footer */}
          <Footer settings={settings} onNavigate={handleNavigateRequest} />
        </div>
      )}
    </div>
  );
}
