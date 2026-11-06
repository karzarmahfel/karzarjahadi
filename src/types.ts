export interface ProductItem {
  id: string;
  title: string;
  category: 'خدمات' | 'محصولات' | 'سوغات' | 'صنایع دستی';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  unit: string;
  stock: number | 'نامحدود';
  badgeType?: 'جهادی' | 'شگفت‌انگیز' | 'تخفیف' | 'پرفروش' | 'سوغات' | 'صنایع دستی' | 'طبیعی';
  badgeLabel?: string;
  description: string;
  subtitle?: string;
  imageUrl: string;
  active: boolean;
  code: string;
}

export interface OrderItem {
  id: string;
  trackingCode: string;
  customerName: string;
  phone: string;
  totalAmount: number;
  itemsSummary: string;
  status: 'pending' | 'completed' | 'processing';
  statusLabel: string;
  address: string;
  date: string;
  paymentMethod: 'online' | 'cod';
}

export interface CategoryItem {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface SiteSettings {
  siteName: string;
  siteSlogan: string;
  phone: string;
  rubikaUrl: string;
  address: string;
  themeScheme: string;
  bannerText: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}
