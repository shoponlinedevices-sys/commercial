'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Bell, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { useRouter, useSearchParams } from 'next/navigation';
import MobileSidebar from '@/components/MobileSidebar';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { cartCount } = useCart();
  const { notificationCount } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize search query from URL on mount
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Keep focus on search input when navigating
  useEffect(() => {
    if (searchParams.get('search')) {
      searchInputRef.current?.focus();
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      router.push(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    router.push('/products');
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur ${
          colors.darkMode
            ? 'border-violet-400/20 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 shadow-md shadow-indigo-950/20'
            : 'border-border/70 bg-gradient-to-r from-white via-violet-50/70 to-white'
        }`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="flex min-h-16 flex-wrap items-center gap-x-2 gap-y-2 py-2 sm:gap-3">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Mở menu điều hướng"
              aria-expanded={mobileMenuOpen}
              className={`shrink-0 lg:hidden ${colors.darkMode ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-primary/10'}`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Store brand */}
            <Link href="/" aria-label="Commercial - Trang chủ" className="flex shrink-0 items-center gap-2">
              <Image src="/logo.png" alt="" width={36} height={36} priority className="h-9 w-9 object-contain" />
              <span className={`hidden text-lg font-bold sm:inline ${colors.darkMode ? 'text-white' : 'text-slate-900'}`}>
                Commercial
              </span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
              <Link href="/products" className={`transition-colors hover:text-violet-500 ${colors.darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-600'}`}>Sản phẩm</Link>
              <Link href="/orders" className={`transition-colors hover:text-violet-500 ${colors.darkMode ? 'text-slate-200 hover:text-white' : 'text-slate-600'}`}>Đơn hàng</Link>
            </nav>

            {/* Search Bar */}
            <div className="order-last min-w-0 basis-full sm:order-none sm:flex-1 sm:basis-0 sm:px-2 lg:px-4">
              <div className="group relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${colors.darkMode ? 'text-gray-400 group-focus-within:text-white' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                <Input
                  type="text"
                  aria-label="Tìm kiếm sản phẩm"
                  placeholder="Tìm tên sản phẩm, mã hàng, thương hiệu..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  ref={searchInputRef}
                  className={`h-11 pl-10 pr-10 text-sm transition-all ${colors.darkMode ? 'border-white/20 bg-white/10 text-white placeholder:text-slate-300 focus:border-violet-300 focus:ring-2 focus:ring-violet-400/30' : 'border-violet-100 bg-white text-slate-900 placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Xóa nội dung tìm kiếm"
                    onClick={handleClearSearch}
                    className={`absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md transition-colors hover:bg-muted hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${colors.darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Giỏ hàng${cartCount > 0 ? `, ${cartCount} sản phẩm` : ''}`}
                onClick={() => router.push('/cart')}
                className={`relative transition-colors ${colors.darkMode ? 'text-white hover:bg-violet-400/20 hover:text-violet-100' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-gradient-to-r from-primary to-purple-600 rounded-full text-[10px] font-bold shadow-lg">
                    {cartCount}
                  </Badge>
                )}
              </Button>
              
              {isAuthenticated && <Button
                variant="ghost"
                size="icon"
                aria-label={`Thông báo${notificationCount > 0 ? `, ${notificationCount} thông báo chưa đọc` : ''}`}
                onClick={() => router.push('/notifications')}
                className={`relative transition-colors ${colors.darkMode ? 'text-white hover:bg-violet-400/20 hover:text-violet-100' : 'text-slate-700 hover:bg-primary/10 hover:text-primary'}`}
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-gradient-to-r from-primary to-purple-600 rounded-full text-[10px] font-bold shadow-lg">
                    {notificationCount}
                  </Badge>
                )}
              </Button>}

              {isAuthenticated ? <Link href="/account" aria-label={`Tài khoản ${user?.username || ''}`} className={`flex items-center gap-2 border-l pl-2 sm:pl-4 ${colors.darkMode ? 'border-white/20' : 'border-border'}`}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'N'}
                </div>
                <span className={`text-xs sm:text-sm font-semibold hidden md:block ${colors.darkMode ? 'text-white' : ''}`}>
                  {user?.username}
                </span>
              </Link> : <Link href="/login" className="rounded-lg bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-4 sm:text-sm">Đăng nhập</Link>}
            </div>
          </div>
        </div>
      </header>
      
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
