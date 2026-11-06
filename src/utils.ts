export function toPersianDigits(n: number | string): string {
  const f = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/[0-9]/g, (w) => f[+w] || w);
}

export function formatPrice(price: number): string {
  return toPersianDigits(price.toLocaleString('fa-IR'));
}
