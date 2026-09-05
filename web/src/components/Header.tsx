'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Bell, Menu, Sparkles, X } from 'lucide-react';
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
        className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur"
        style={{ backgroundColor: colors.darkMode ? '#0f172a' : '#ffffff' }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex min-h-16 items-center gap-3 py-2">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden mr-2 hover:bg-primary/10 ${colors.darkMode ? 'text-white hover:bg-white/10' : ''}`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Store brand */}
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="hidden font-bold text-lg text-foreground sm:inline">
                Commercial
              </span>
            </Link>

            <nav className="hidden items-center gap-5 text-sm font-medium lg:flex">
              <Link href="/products" className="text-muted-foreground transition-colors hover:text-primary">Sản phẩm</Link>
              <Link href="/orders" className="text-muted-foreground transition-colors hover:text-primary">Đơn hàng</Link>
            </nav>

            {/* Search Bar */}
            <div className="mx-1 min-w-0 flex-1 sm:mx-4">
              <div className="relative group">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${colors.darkMode ? 'text-gray-400 group-focus-within:text-white' : 'text-muted-foreground group-focus-within:text-primary'}`} />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  ref={searchInputRef}
                  className={`pl-10 pr-10 transition-all text-sm sm:text-base ${colors.darkMode ? 'bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20' : 'bg-muted/50 border-muted focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors hover:opacity-70 ${colors.darkMode ? 'text-gray-400' : 'text-muted-foreground'}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/cart')}
                className={`relative transition-colors ${colors.darkMode ? 'text-white hover:bg-white/10' : 'hover:bg-primary/10'}`}
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
                onClick={() => router.push('/notifications')}
                className={`relative transition-colors ${colors.darkMode ? 'text-white hover:bg-white/10' : 'hover:bg-primary/10'}`}
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-gradient-to-r from-primary to-purple-600 rounded-full text-[10px] font-bold shadow-lg">
                    {notificationCount}
                  </Badge>
                )}
              </Button>}

              {isAuthenticated ? <Link href="/account" className={`flex items-center gap-2 border-l pl-2 sm:pl-4 ${colors.darkMode ? 'border-white/20' : 'border-border'}`}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className={`text-xs sm:text-sm font-semibold hidden md:block ${colors.darkMode ? 'text-white' : ''}`}>
                  {user?.username}
                </span>
              </Link> : <Link href="/login" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Đăng nhập</Link>}
            </div>
          </div>
        </div>
      </header>
      
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
