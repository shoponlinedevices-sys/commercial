'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Bell, User, Menu, Sparkles, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { notificationService } from '@/services/notification.service';
import { NotificationItem } from '@/types';
import ColorPicker from '@/components/ColorPicker';
import MobileSidebar from '@/components/MobileSidebar';
import ThemeSettingsOverlay from '@/components/ThemeSettingsOverlay';

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeSettingsOpen, setThemeSettingsOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const fetchNotificationCount = async () => {
      try {
        const notifications = await notificationService.getUserNotifications(user.id.toString());
        const count = notifications.filter(item => !item.isRead).length;
        setNotificationCount(count);
      } catch (error) {
        console.error('Error fetching notification count:', error);
        setNotificationCount(0);
      }
    };

    fetchNotificationCount();
  }, [isAuthenticated, user?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] border-b border-border/50 backdrop-blur-xl bg-white/80 dark:bg-gray-950/80 shadow-sm lg:left-64">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden mr-2 hover:bg-primary/10"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo/Brand */}
            <div className="flex items-center space-x-2 lg:hidden">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Commercial
              </span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-muted focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <ColorPicker />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setThemeSettingsOpen(true)}
                className="relative hover:bg-primary/10 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/cart')}
                className="relative hover:bg-primary/10 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
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
                className="relative hover:bg-primary/10 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center p-0 bg-gradient-to-r from-primary to-purple-600 rounded-full text-[10px] font-bold shadow-lg">
                    {notificationCount}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center space-x-2 pl-2 sm:pl-4 border-l border-border">
                <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-semibold hidden md:block">
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
