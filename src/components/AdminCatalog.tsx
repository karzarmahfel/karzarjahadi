import React, { useState } from 'react';
import { ProductItem, CategoryItem } from '../types';
import { formatPrice, toPersianDigits } from '../utils';

interface AdminCatalogProps {
  products: ProductItem[];
  categories: CategoryItem[];
  onAddProduct: (prod: ProductItem) => void;
  onUpdateProduct: (prod: ProductItem) => void;
  onDeleteProduct: (prodId: string) => void;
  onToggleProductStatus: (prodId: string) => void;
  onAddCategory: (catName: string) => void;
  onUpdateCategory: (id: string, newName: string) => void;
  onDeleteCategory: (id: string) => void;
  onShowToast: (msg: string) => void;
  onNavigateHome: () => void;
}

export const AdminCatalog: React.FC<AdminCatalogProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleProductStatus,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onShowToast,
}) => {
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState('all');

  // Modal 1: Create / Edit Product
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'خدمات' | 'محصولات' | 'سوغات' | 'صنایع دستی'>('خدمات');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formBadge, setFormBadge] = useState<'جهادی' | 'شگفت‌انگیز' | 'تخفیف'>('جهادی');
  const [formDescription, setFormDescription] = useState('');

  // Modal 2: Quick Price Modal
  const [quickPriceModalOpen, setQuickPriceModalOpen] = useState(false);
  const [quickPriceTarget, setQuickPriceTarget] = useState<ProductItem | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState('');

  // Modal 3: Batch Price Modal
  const [batchPriceModalOpen, setBatchPriceModalOpen] = useState(false);
  const [batchCategory, setBatchCategory] = useState('all');
  const [batchPercent, setBatchPercent] = useState('10');
  const [batchType, setBatchType] = useState<'discount' | 'increase'>('discount');

  // Category Input
  const [newCatInput, setNewCatInput] = useState('');

  // Filter logic
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);

    const matchesCat = selectedCatFilter === 'all' || p.category === selectedCatFilter;
    const matchesBadge = selectedBadgeFilter === 'all' || p.badgeType === selectedBadgeFilter;

    return matchesSearch && matchesCat && matchesBadge;
  });

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormCategory('خدمات');
    setFormPrice('');
    setFormStock('نامحدود');
    setFormImageUrl('');
    setFormBadge('جهادی');
    setFormDescription('');
    setProductModalOpen(true);
  };

  const handleOpenEditModal = (p: ProductItem) => {
    setEditingProductId(p.id);
    setFormName(p.title);
    setFormCategory(p.category);
    setFormPrice(p.price.toString());
    setFormStock(p.stock.toString());
    setFormImageUrl(p.imageUrl);
    setFormBadge(
      p.badgeType === 'شگفت‌انگیز' || p.badgeType === 'تخفیف' ? p.badgeType : 'جهادی'
    );
    setFormDescription(p.description);
    setProductModalOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(formPrice.replace(/[^0-9]/g, ''), 10) || 0;
    const stockVal = formStock.includes('نامحدود')
      ? 'نامحدود'
      : parseInt(formStock.replace(/[^0-9]/g, ''), 10) || 10;

    const defaultImg =
      formCategory === 'خدمات'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3f2c186eFHM4HU62Di4KEhoABbB4LZrrxQp1qobyA8guMWU8h7H3YBQ9uL4rZ9EEC7iaaxtc4dC5nd1FS-h6SbxQR7xRS4VEoWOSo7cjiPVkhtx-1SZOSLbWyKfwT4mUquoh4AKhbep-AmDvgcv-MFJ3kzwF4-k9roKSdd1t_85hfqPvhD9XyzPqFQY6NaYcCSfwxvq8L1BgQa1hYK2dJBi5c-gNDePNwRNn2ej4'
        : formCategory === 'سوغات'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuANjrbd5g31exOVIVSH2RWQNAVg8XB7dcAEybthu2DEc_jpXhJBDjVHSa7UC-c7kzjm9SitRoF2QczTMkYeL2DeX08wtMV_vh3U3LfPtUqS4pBzTcgdB7PKroOR1TiRU7KRCLRLZ-n_qTnkxII2fNOMMaXf17l0MZQfHxD6GbTdX8B2buY7LNNbEYyFu_Z2gPVA8Wgdp6ELNPIke1Y3u5onMNHHAaJ0o1TLh_MapXA'
        : formCategory === 'صنایع دستی'
        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqzJh2h_NZTNd5rnFnHmLkIEnCZkoZsd1DzcOKG0weFmmYVJQAbgXPlTFCfvMQccQ1hEaMiwDRfqRDXJlJIYVAt9KGnAjiUJTpvt5Q1pkK9yMKwbVVtjw-LMjzaat6DbFYZdCwmdvA6XBxPCVJIw5eU3p7g25-6qgeIXPeXlFJxj9GsxavZpO_MnZQQ6CFa5atkSetzT-gh8mQxrw67aAoziPb-txUhJGS6MYMJ9I'
        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtex4oEt3BnA7mmE6OtW9dhyCXDvKWUpHNj7bd53Gt2LpZ8uvkrEy8uMMJiT4MpSpF2a5nnFavNh6hp99RNv3coLNEysCEFK-ERahPqoTuqp_tq_aCa_ibIGBuyxaa-alC8qv7YjcwfJFxR_h8YZOvbCpm-D7Up0lt930eec30pnFK3FDXzT65elM1mZ6dTXLwdbXClRSvCcN2q5b2ZessVLmytr9Wnr-XyuTw4ZI';

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        onUpdateProduct({
          ...existing,
          title: formName,
          category: formCategory,
          price: priceNum,
          stock: stockVal,
          imageUrl: formImageUrl.trim() || existing.imageUrl || defaultImg,
          badgeType: formBadge,
          badgeLabel:
            formBadge === 'جهادی'
              ? 'خدمات جهادی'
              : formBadge === 'شگفت‌انگیز'
              ? 'شگفت‌انگیز'
              : 'تخفیف‌دار',
          description: formDescription,
        });
        onShowToast(`محصول «${formName}» با موفقیت ویرایش شد.`);
      }
    } else {
      const newId = 'kz-' + Math.floor(100 + Math.random() * 900);
      const newProduct: ProductItem = {
        id: newId,
        code: newId.toUpperCase(),
        title: formName,
        category: formCategory,
        categoryLabel:
          formCategory === 'خدمات'
            ? 'خدمات کارزار'
            : formCategory === 'محصولات'
            ? 'محصولات سلامت'
            : formCategory === 'سوغات'
            ? 'سوغات و زعفران'
            : 'دست‌سازه‌های خانگی',
        price: priceNum,
        unit: 'تومان',
        stock: stockVal,
        badgeType: formBadge,
        badgeLabel:
          formBadge === 'جهادی'
            ? 'خدمات جهادی'
            : formBadge === 'شگفت‌انگیز'
            ? 'شگفت‌انگیز'
            : 'تخفیف‌دار',
        description: formDescription,
        subtitle: 'ثبت شده توسط مدیر کارزار',
        imageUrl: formImageUrl.trim() || defaultImg,
        active: true,
      };
      onAddProduct(newProduct);
      onShowToast(`محصول «${formName}» به کاتالوگ اضافه شد.`);
    }

    setProductModalOpen(false);
  };

  const handleOpenQuickPrice = (p: ProductItem) => {
    setQuickPriceTarget(p);
    setQuickPriceValue(p.price.toString());
    setQuickPriceModalOpen(true);
  };

  const handleSaveQuickPrice = () => {
    if (quickPriceTarget) {
      const val = parseInt(quickPriceValue.replace(/[^0-9]/g, ''), 10) || 0;
      onUpdateProduct({
        ...quickPriceTarget,
        price: val,
      });
      setQuickPriceModalOpen(false);
      onShowToast(`نرخ محصول «${quickPriceTarget.title}» به‌روزرسانی شد.`);
    }
  };

  const handleApplyBatchPrice = () => {
    const pct = parseFloat(batchPercent) || 10;
    const factor = batchType === 'discount' ? 1 - pct / 100 : 1 + pct / 100;

    products.forEach((p) => {
      if (batchCategory === 'all' || p.category === batchCategory) {
        const newP = Math.round(p.price * factor);
        onUpdateProduct({
          ...p,
          price: newP,
        });
      }
    });

    setBatchPriceModalOpen(false);
    onShowToast(`تغییر قیمت گروهی ${toPersianDigits(pct)}٪ اعمال گردید.`);
  };

  const handleAddCategorySubmit = () => {
    if (!newCatInput.trim()) return;
    onAddCategory(newCatInput.trim());
    setNewCatInput('');
    onShowToast('دسته جدید با موفقیت اضافه شد.');
  };

  return (
    <div className="flex flex-col w-full p-4 md:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Header Band */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[#dc2626] font-bold text-[13px]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>سامانه مدیریت انبار و محصولات کارزار جهاد اقتصادی</span>
          </div>
          <h1 className="text-[26px] sm:text-[30px] font-black text-stone-900 mt-1">
            کاتالوگ و زنجیره تأمین فرآورده‌ها
          </h1>
          <p className="text-[13px] text-stone-500 max-w-2xl mt-1">
            مدیریت متمرکز موجودی، نرخ‌گذاری دسته‌جمعی، نظارت بر خدمات خانگی بلوار توس و ارزش‌آفرینی تولیدکنندگان محلی.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => onShowToast('فایل اکسل کاتالوگ با موفقیت بارگیری شد')}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#fff7ed] text-stone-800 rounded-xl transition-all shadow-sm text-[13px] font-bold border border-orange-200"
          >
            <span className="material-symbols-outlined text-[20px] text-[#dc2626]">table_view</span>
            <span>خروجی اکسل</span>
          </button>

          <button
            onClick={() => setBatchPriceModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#fff7ed] text-stone-800 rounded-xl transition-all shadow-sm text-[13px] font-bold border border-orange-200"
          >
            <span className="material-symbols-outlined text-[20px] text-[#ea580c]">percent</span>
            <span>تغییر قیمت گروهی</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#dc2626] hover:bg-[#ea580c] text-white rounded-xl transition-all shadow-md font-bold text-[14px] active:scale-95 group"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:rotate-90 transition-transform">
              add_circle
            </span>
            <span>افزودن محصول جدید</span>
          </button>
        </div>
      </div>

      {/* Key Metrics in Red, White, and Orange */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-red-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-stone-500 text-[12px] font-bold">کل محصولات و خدمات</span>
            <span className="text-[24px] font-black text-stone-900 mt-1">
              {toPersianDigits(products.length)} قلم
            </span>
            <span className="text-[11px] text-[#dc2626] mt-1 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> ۱۲ قلم افزوده شده این ماه
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fff1ee] flex items-center justify-center text-[#dc2626] border border-red-200">
            <span className="material-symbols-outlined text-[28px]">inventory_2</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-red-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-stone-500 text-[12px] font-bold">خدمات خانگی فعال</span>
            <span className="text-[24px] font-black text-stone-900 mt-1">۳۲ کارگاه</span>
            <span className="text-[11px] text-[#ea580c] mt-1 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">handshake</span> منطقه توس مشهد
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#ea580c] border border-orange-200">
            <span className="material-symbols-outlined text-[28px]">home_repair_service</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-red-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-stone-500 text-[12px] font-bold">محصولات دارای تخفیف جهادی</span>
            <span className="text-[24px] font-black text-stone-900 mt-1">۴۵ مورد</span>
            <span className="text-[11px] text-[#dc2626] mt-1 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">loyalty</span> میانگین ۲۰٪ حمایت
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fff1ee] flex items-center justify-center text-[#dc2626] border border-red-200">
            <span className="material-symbols-outlined text-[28px]">loyalty</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-red-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-stone-500 text-[12px] font-bold">هشدار کسری موجودی</span>
            <span className="text-[24px] font-black text-[#dc2626] mt-1">۴ محصول</span>
            <span className="text-[11px] text-[#dc2626] mt-1 flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">warning</span> نیاز به شارژ انبار
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#fff1ee] flex items-center justify-center text-[#dc2626] border border-red-200">
            <span className="material-symbols-outlined text-[28px]">production_quantity_limits</span>
          </div>
        </div>
      </div>

      {/* Main Split View: Categories vs Products Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Categories Sidebar (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white rounded-3xl shadow-sm p-6 border border-red-100">
            <div className="flex items-center justify-between pb-3 border-b border-red-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#dc2626] text-[22px]">category</span>
                <h2 className="text-[16px] font-black text-stone-900">دسته‌بندی‌ها</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#fff1ee] text-[11px] font-bold text-[#dc2626] border border-red-200">
                {toPersianDigits(categories.length)} دسته
              </span>
            </div>
            <p className="text-[12px] text-stone-500 mt-2">مدیریت شاخه‌ها و دسته‌بندی‌های توزیع کارزار</p>

            {/* Add Cat */}
            <div className="mt-4 flex gap-2">
              <input
                className="flex-1 bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 placeholder:text-stone-400 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                placeholder="عنوان دسته تازه (مثال: لبنیات سنتی)..."
                type="text"
                value={newCatInput}
                onChange={(e) => setNewCatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCategorySubmit();
                }}
              />
              <button
                onClick={handleAddCategorySubmit}
                className="bg-[#dc2626] text-white px-4 py-2.5 rounded-xl hover:bg-[#b91c1c] transition-colors flex items-center gap-1 text-[13px] font-bold shrink-0 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>افزودن</span>
              </button>
            </div>

            {/* List */}
            <div className="mt-4 space-y-2">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-[#fff7ed] hover:bg-[#ffedd5] transition-all border border-orange-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#dc2626] shadow-sm border border-red-100">
                      <span className="material-symbols-outlined text-[18px]">
                        {c.icon || 'folder'}
                      </span>
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-bold text-stone-900">{c.name}</span>
                      <span className="text-[11px] text-stone-500">
                        {toPersianDigits(c.count)} مورد ثبت‌شده
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        const newName = prompt('نام جدید دسته را وارد فرمایید:', c.name);
                        if (newName && newName.trim()) {
                          onUpdateCategory(c.id, newName.trim());
                          onShowToast('نام دسته با موفقیت ویرایش شد.');
                        }
                      }}
                      className="p-1.5 hover:bg-white rounded-lg text-stone-600 hover:text-stone-900"
                      title="تغییر نام"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`آیا از حذف دسته‌بندی «${c.name}» مطمئن هستید؟`)) {
                          onDeleteCategory(c.id);
                          onShowToast('دسته‌بندی حذف شد.');
                        }
                      }}
                      className="p-1.5 hover:bg-[#fff1ee] rounded-lg text-[#dc2626]"
                      title="حذف دسته"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jihad Support Broadcast Card */}
          <div className="bg-[#991b1b] text-white rounded-3xl p-5 shadow-md relative overflow-hidden border-2 border-[#ea580c]">
            <div className="relative z-10 flex flex-col space-y-2">
              <div className="flex items-center gap-2 text-[#fed7aa]">
                <span className="material-symbols-outlined text-[20px]">campaign</span>
                <span className="text-[13px] font-bold">بسته حمایتی جهادگران محفل</span>
              </div>
              <p className="text-[12px] text-red-100 leading-relaxed">
                کلیه فرآورده‌های نشان‌دار با نشان «خدمات جهادی» بدون کارمزد توزیع شده و هزینه حمل آن در منطقه توس رایگان محاسبه خواهد شد.
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-red-800">
                <span className="text-[11px] text-white font-bold">تعداد خدمات جهادی: ۱۸ عنوان</span>
                <span className="material-symbols-filled text-[#fed7aa] text-[20px]">
                  check_circle
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Catalog Table Section (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Filter Controls */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-red-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-[20px]">
                search
              </span>
              <input
                className="w-full bg-[#fff7ed] pl-4 pr-10 py-2.5 rounded-xl text-[13px] text-stone-900 placeholder:text-stone-400 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                placeholder="جستجوی سریع نام، کد محصول یا نوع خدمت..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                className="bg-[#fff7ed] text-stone-900 border border-orange-200 text-[13px] font-bold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                value={selectedCatFilter}
                onChange={(e) => setSelectedCatFilter(e.target.value)}
              >
                <option value="all">تمام دسته‌بندی‌ها</option>
                <option value="خدمات">خدمات خانگی</option>
                <option value="محصولات">محصولات سلامت و عمومی</option>
                <option value="سوغات">سوغات و زعفران</option>
                <option value="صنایع دستی">صنایع دستی</option>
              </select>

              <select
                className="bg-[#fff7ed] text-stone-900 border border-orange-200 text-[13px] font-bold px-3 py-2 rounded-xl focus:outline-none cursor-pointer"
                value={selectedBadgeFilter}
                onChange={(e) => setSelectedBadgeFilter(e.target.value)}
              >
                <option value="all">تمام نشان‌ها</option>
                <option value="جهادی">خدمات جهادی</option>
                <option value="شگفت‌انگیز">شگفت‌انگیز</option>
                <option value="تخفیف">تخفیف‌دار</option>
              </select>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCatFilter('all');
                  setSelectedBadgeFilter('all');
                  onShowToast('فیلترها بازنشانی شدند.');
                }}
                className="p-2 hover:bg-[#fff7ed] rounded-xl text-stone-500 border border-orange-200"
                title="پاکسازی فیلترها"
              >
                <span className="material-symbols-outlined text-[20px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-red-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#fff1ee] text-[#991b1b] text-[13px] font-bold border-b border-red-200">
                    <th className="py-3 px-4">تصویر و عنوان محصول / خدمت</th>
                    <th className="py-3 px-4">دسته‌بندی</th>
                    <th className="py-3 px-4">قیمت (تومان)</th>
                    <th className="py-3 px-4">موجودی</th>
                    <th className="py-3 px-4">نشان ویژه</th>
                    <th className="py-3 px-4">وضعیت</th>
                    <th className="py-3 px-4 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100 text-[13px]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#fff7ed]/50 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-12 h-12 rounded-xl object-cover shadow-sm bg-stone-100 shrink-0 border border-red-100"
                            src={p.imageUrl}
                            alt={p.title}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-stone-900 truncate">{p.title}</span>
                            <span className="text-[11px] text-stone-500">
                              کد: {p.code} • {p.subtitle || 'جهاد اقتصادی'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#fff7ed] border border-orange-200 text-[#c2410c] text-[11px] font-bold">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-black text-[#dc2626]">
                            {formatPrice(p.price)}
                          </span>
                          <span className="text-[10px] text-stone-500">{p.unit}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold ${
                            typeof p.stock === 'number' && p.stock < 5
                              ? 'text-[#dc2626] font-bold'
                              : 'text-stone-800'
                          }`}
                        >
                          {p.stock === 'نامحدود'
                            ? 'نامحدود'
                            : `${toPersianDigits(p.stock)} عدد`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#fff1ee] text-[#dc2626] border border-red-200 text-[11px] font-bold">
                          <span className="material-symbols-outlined text-[14px]">
                            volunteer_activism
                          </span>
                          {p.badgeLabel || 'خدمات جهادی'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onToggleProductStatus(p.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                            p.active
                              ? 'bg-[#fff1ee] text-[#dc2626] border border-red-200'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              p.active ? 'bg-[#ea580c]' : 'bg-stone-400'
                            }`}
                          />
                          {p.active ? 'فعال' : 'غیرفعال'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-left">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenQuickPrice(p)}
                            className="p-1.5 hover:bg-[#fff7ed] rounded-lg text-[#ea580c]"
                            title="تغییر سریع قیمت"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              price_change
                            </span>
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 hover:bg-[#fff7ed] rounded-lg text-stone-600 hover:text-stone-900"
                            title="ویرایش کامل"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit_note</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`آیا از حذف «${p.title}» مطمئن هستید؟`)) {
                                onDeleteProduct(p.id);
                                onShowToast(`«${p.title}» حذف گردید.`);
                              }
                            }}
                            className="p-1.5 hover:bg-[#fff1ee] rounded-lg text-[#dc2626]"
                            title="حذف محصول"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-stone-500">
                        محصولی با این مشخصات یافت نشد.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 bg-[#fff1ee] flex items-center justify-between border-t border-red-200">
              <span className="text-[12px] text-stone-600">
                نمایش ۱ تا {toPersianDigits(filteredProducts.length)} از مجموع{' '}
                {toPersianDigits(products.length)} قلم ثبت‌شده در سامانه
              </span>
              <div className="flex items-center gap-1">
                <span className="px-3 py-1 rounded-lg bg-[#dc2626] text-white text-[12px] font-bold">
                  ۱
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Create / Edit Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-red-100">
            <div className="px-6 py-4 bg-[#fff1ee] flex items-center justify-between border-b border-red-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#dc2626] text-[24px]">
                  inventory
                </span>
                <h3 className="text-[17px] font-black text-stone-900">
                  {editingProductId ? 'ویرایش کاتالوگ محصول' : 'افزودن محصول یا خدمت جدید'}
                </h3>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white text-stone-500"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <form onSubmit={handleProductFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="text-[12px] font-bold text-stone-900">
                      نام محصول یا خدمت <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      className="bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                      placeholder="مثال: پاک کردن زرشک کوهی..."
                      required
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[12px] font-bold text-stone-900">
                      قیمت عرضه (تومان) <span className="text-[#dc2626]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                        placeholder="مثال: ۴۵۰,۰۰۰"
                        required
                        type="text"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-stone-500">
                        تومان
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[12px] font-bold text-stone-900">
                      دسته‌بندی <span className="text-[#dc2626]">*</span>
                    </label>
                    <select
                      className="bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                    >
                      <option value="خدمات">خدمات خانگی و محلی</option>
                      <option value="محصولات">محصولات سلامت و طبی</option>
                      <option value="سوغات">سوغات خراسان و زعفران</option>
                      <option value="صنایع دستی">صنایع دستی و گلیم‌بافی</option>
                    </select>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label className="text-[12px] font-bold text-stone-900">
                      موجودی انبار / ظرفیت پذیرش
                    </label>
                    <input
                      className="bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                      placeholder="مثال: ۲۵ عدد یا نامحدود"
                      type="text"
                      value={formStock}
                      onChange={(e) => setFormStock(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[12px] font-bold text-stone-900">
                    تصویر شاخص محصول (نشانی اینترنتی)
                  </label>
                  <input
                    className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                    placeholder="https://..."
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-[12px] font-bold text-stone-900">
                    کلید نشان و مزیت ویژه کارزار
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label
                      onClick={() => setFormBadge('جهادی')}
                      className={`flex items-center gap-2 p-3 rounded-2xl cursor-pointer border ${
                        formBadge === 'جهادی'
                          ? 'bg-[#fff1ee] border-2 border-[#dc2626]'
                          : 'bg-[#fff7ed] border border-orange-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fbadge"
                        checked={formBadge === 'جهادی'}
                        onChange={() => setFormBadge('جهادی')}
                        className="accent-[#dc2626]"
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-stone-900">خدمات جهادی</span>
                        <span className="text-[11px] text-stone-500">طرح اشتغال و حمایت</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setFormBadge('شگفت‌انگیز')}
                      className={`flex items-center gap-2 p-3 rounded-2xl cursor-pointer border ${
                        formBadge === 'شگفت‌انگیز'
                          ? 'bg-[#fff1ee] border-2 border-[#dc2626]'
                          : 'bg-[#fff7ed] border border-orange-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fbadge"
                        checked={formBadge === 'شگفت‌انگیز'}
                        onChange={() => setFormBadge('شگفت‌انگیز')}
                        className="accent-[#dc2626]"
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-stone-900">شگفت‌انگیز</span>
                        <span className="text-[11px] text-stone-500">فروش ویژه با تخفیف</span>
                      </div>
                    </label>

                    <label
                      onClick={() => setFormBadge('تخفیف')}
                      className={`flex items-center gap-2 p-3 rounded-2xl cursor-pointer border ${
                        formBadge === 'تخفیف'
                          ? 'bg-[#fff1ee] border-2 border-[#dc2626]'
                          : 'bg-[#fff7ed] border border-orange-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="fbadge"
                        checked={formBadge === 'تخفیف'}
                        onChange={() => setFormBadge('تخفیف')}
                        className="accent-[#dc2626]"
                      />
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-stone-900">تخفیف‌دار</span>
                        <span className="text-[11px] text-stone-500">یارانه مردمی محفل</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[12px] font-bold text-stone-900">
                    توضیحات و شرایط کارزار
                  </label>
                  <textarea
                    className="bg-[#fff7ed] p-3.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                    placeholder="جزئیات دستمزد، نحوه تحویل در بلوار توس، تضمین اصالت..."
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    onClick={() => setProductModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#fff7ed] text-stone-700 border border-orange-200 text-[13px] font-bold hover:bg-[#ffedd5]"
                    type="button"
                  >
                    انصراف
                  </button>
                  <button
                    className="px-6 py-2.5 rounded-xl bg-[#dc2626] hover:bg-[#ea580c] text-white text-[13px] font-bold shadow-md transition-all active:scale-95"
                    type="submit"
                  >
                    ذخیره و انتشار در کارزار
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Quick Price Modal */}
      {quickPriceModalOpen && quickPriceTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 flex flex-col space-y-4 border border-red-100">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-black text-stone-900">تغییر فوری قیمت</h3>
              <button
                onClick={() => setQuickPriceModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="text-[13px] text-stone-600">
              محصول: <strong className="text-stone-900">{quickPriceTarget.title}</strong>
            </p>
            <div className="flex flex-col space-y-1">
              <label className="text-[12px] font-bold text-stone-900">قیمت جدید به تومان</label>
              <div className="relative">
                <input
                  className="w-full bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[14px] text-stone-900 border border-orange-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ea580c]"
                  type="text"
                  value={quickPriceValue}
                  onChange={(e) => setQuickPriceValue(e.target.value)}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-stone-500">
                  تومان
                </span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setQuickPriceModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#fff7ed] text-stone-800 border border-orange-200 text-[13px] font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleSaveQuickPrice}
                className="px-5 py-2.5 rounded-xl bg-[#dc2626] hover:bg-[#ea580c] text-white text-[13px] font-bold shadow-md"
              >
                اعمال نرخ جدید
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Batch Price Change Modal */}
      {batchPriceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 flex flex-col space-y-4 border border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#dc2626] text-[22px]">tune</span>
                <h3 className="text-[17px] font-black text-stone-900">تغییر نرخ گروهی (درصدی)</h3>
              </div>
              <button
                onClick={() => setBatchPriceModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-stone-600">
              اعمال تخفیف یا تعدیل قیمت برای تمام فرآورده‌های یک دسته‌بندی مشخص بصورت خودکار.
            </p>

            <div className="space-y-3">
              <div className="flex flex-col space-y-1">
                <label className="text-[12px] font-bold text-stone-900">دسته‌بندی هدف</label>
                <select
                  className="bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none"
                  value={batchCategory}
                  onChange={(e) => setBatchCategory(e.target.value)}
                >
                  <option value="all">کلیه محصولات و خدمات</option>
                  <option value="خدمات">صرفاً خدمات خانگی</option>
                  <option value="محصولات">صرفاً محصولات سلامت</option>
                  <option value="سوغات">صرفاً سوغات و زعفران</option>
                  <option value="صنایع دستی">صرفاً صنایع دستی</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[12px] font-bold text-stone-900">درصد تغییر</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none"
                    placeholder="مثال: ۱۰"
                    type="number"
                    value={batchPercent}
                    onChange={(e) => setBatchPercent(e.target.value)}
                  />
                  <select
                    className="bg-[#fff7ed] px-3.5 py-2.5 rounded-xl text-[13px] text-stone-900 border border-orange-200 focus:outline-none"
                    value={batchType}
                    onChange={(e) => setBatchType(e.target.value as any)}
                  >
                    <option value="discount">تخفیف (کاهش نرخ)</option>
                    <option value="increase">افزایش نرخ</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setBatchPriceModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[#fff7ed] text-stone-800 border border-orange-200 text-[13px] font-bold"
              >
                انصراف
              </button>
              <button
                onClick={handleApplyBatchPrice}
                className="px-5 py-2.5 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-[13px] font-bold shadow-md transition-all active:scale-95"
              >
                اعمال دسته‌جمعی نرخ‌ها
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
