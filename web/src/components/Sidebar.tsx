'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, User, LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { colors } = useTheme();

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/products', icon: Home, label: 'Trang chủ' },
    { href: '/orders', icon: Package, label: 'Đơn hàng' },
    { href: '/notifications', icon: Bell, label: 'Thông báo' },
    { href: '/account', icon: User, label: 'Tài khoản' },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 min-h-screen fixed left-0 top-0 hidden lg:block z-40" style={{ backgroundColor: colors.layoutColor }}>
      <div className="p-4">
        <Link href="/products" className="text-2xl font-bold text-primary block mb-8">
          Commercial
        </Link>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
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
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-semibold text-sm">{user?.username}</p>
              <p className="text-xs text-gray-500">Thành viên</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </aside>
  );
}
