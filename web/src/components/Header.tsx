'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Bell, User } from 'lucide-react';
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

export default function Header() {
  const { user, isAuthenticated } = useAuth();
  const { colors } = useTheme();
  const { cartCount } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);

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
    <header className="fixed top-0 left-0 lg:left-64 right-0 z-50 border-b border-gray-200" style={{ backgroundColor: colors.layoutColor }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <ColorPicker />
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/cart')}
              className="relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute top-0 right-0 h-[18px] min-w-[18px] flex items-center justify-center p-0 px-1 bg-red-500 rounded-full text-[10px] font-extrabold">
                  {cartCount}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/notifications')}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute top-0 right-0 h-[18px] min-w-[18px] flex items-center justify-center p-0 px-1 bg-red-500 rounded-full text-[10px] font-extrabold">
                  {notificationCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium hidden md:block">
                {user?.username}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
