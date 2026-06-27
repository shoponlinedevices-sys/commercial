'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, Bell, User, Menu, Sparkles, Settings, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useNotification } from '@/context/NotificationContext';
import { useRouter, useSearchParams } from 'next/navigation';
import ColorPicker from '@/components/ColorPicker';
import MobileSidebar from '@/components/MobileSidebar';
import ThemeSettingsOverlay from '@/components/ThemeSettingsOverlay';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { cartCount } = useCart();
  const { notificationCount } = useNotification();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);
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

  if (!isAuthenticated) return null;

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl shadow-sm lg:left-64"
        style={{ backgroundColor: colors.darkMode ? '#0f172a' : '#ffffff' }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden mr-2 hover:bg-primary/10 ${colors.darkMode ? 'text-white hover:bg-white/10' : ''}`}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo/Brand - Hidden on mobile, visible on desktop */}
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Commercial
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-[200px] sm:max-w-md md:max-w-lg lg:max-w-2xl mx-1 sm:mx-4 lg:mx-8">
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
            <div className="flex items-center space-x-0 sm:space-x-2 md:space-x-4">
              <ColorPicker />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setThemeSettingsOpen(true)}
                className={`relative transition-colors hidden sm:flex ${colors.darkMode ? 'text-white hover:bg-white/10' : 'hover:bg-primary/10'}`}
              >
                <Settings className="h-5 w-5" />
              </Button>
              
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
              
              <Button
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
              </Button>

              <div className={`flex items-center space-x-2 pl-1 sm:pl-2 md:pl-4 border-l ${colors.darkMode ? 'border-white/20' : 'border-border'}`}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className={`text-xs sm:text-sm font-semibold hidden md:block ${colors.darkMode ? 'text-white' : ''}`}>
                  {user?.username}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <MobileSidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <ThemeSettingsOverlay isOpen={themeSettingsOpen} onClose={() => setThemeSettingsOpen(false)} />
    </>
  );
}
