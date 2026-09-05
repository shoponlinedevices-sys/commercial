import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

const shopLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/products', label: 'Sản phẩm' },
  { href: '/cart', label: 'Giỏ hàng' },
  { href: '/orders', label: 'Đơn hàng' },
];

const supportLinks = [
  { href: '/account', label: 'Tài khoản của tôi' },
  { href: '/account/delivery-address', label: 'Địa chỉ giao hàng' },
  { href: '/account/payment-method', label: 'Phương thức thanh toán' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:py-12">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1.25fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex items-center gap-2 text-lg font-bold text-foreground">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </span>
              Commercial
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Nền tảng mua sắm thiết bị và sản phẩm chất lượng với mức giá tốt cho mọi nhu cầu.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Commercial trên Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Commercial trên Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-foreground">Mua sắm</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {shopLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="transition-colors hover:text-primary">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-foreground">Hỗ trợ khách hàng</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {supportLinks.map((link) => (
                <li key={link.href}><Link href={link.href} className="transition-colors hover:text-primary">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold text-foreground">Liên hệ</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><span>Thành phố Hồ Chí Minh, Việt Nam</span></li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 flex-shrink-0 text-primary" /><a href="tel:123456789" className="transition-colors hover:text-primary">123 456 789</a></li>
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 flex-shrink-0 text-primary" /><a href="mailto:shoponlinedevices@gmail.com" className="break-all transition-colors hover:text-primary">shoponlinedevices@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/70 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Commercial. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <Link href="#" className="transition-colors hover:text-primary">Chính sách bảo mật</Link>
            <Link href="#" className="transition-colors hover:text-primary">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}