'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Home, Package, User, LogOut, Bell, X, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  const navItems = [
    { href: '/', icon: Home, label: 'Trang chủ' },
    { href: '/products', icon: ShoppingCart, label: 'Sản phẩm' },
    { href: '/orders', icon: Package, label: 'Đơn hàng' },
    { href: '/account', icon: User, label: 'Tài khoản' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] lg:hidden transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sidebar - Overlay layout with dark background */}
      <aside className={`fixed left-0 top-0 h-full w-64 sm:w-72 z-[110] lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: colors.darkMode ? '#0f172a' : '#ffffff' }}>
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/products" className="text-2xl font-bold text-primary">
              Commercial
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : colors.darkMode
                      ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          {user ? <div className={`pt-6 border-t ${colors.darkMode ? 'border-white/20' : 'border-gray-200'}`}>
            <div className={`flex items-center space-x-3 mb-3 p-3 rounded-xl ${colors.darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className={`font-semibold text-sm ${colors.darkMode ? 'text-white' : ''}`}>{user?.username}</p>
                <p className={`text-xs ${colors.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Thành viên</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                onClose();
              }}
              className={`w-full justify-start ${colors.darkMode ? 'text-gray-300 hover:bg-white/10 hover:text-white' : ''}`}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Đăng xuất
            </Button>
          </div> : <Link href="/login" onClick={onClose} className="border-t pt-6 text-sm font-semibold text-primary">Đăng nhập để mua hàng</Link>}
        </div>
      </aside>
    </>
  );
}
