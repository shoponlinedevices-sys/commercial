'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, User, LogOut, Bell, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <aside className="w-64 border-r border-border/50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-xl min-h-screen fixed left-0 top-0 hidden lg:block z-40">
      <div className="p-6 flex flex-col h-full">
        {/* Logo */}
        <Link href="/products" className="flex items-center space-x-3 mb-8 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Commercial
          </span>
        </Link>
        
        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary/10 to-purple-600/10 text-primary font-semibold shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="pt-6 border-t border-border/50">
          <div className="flex items-center space-x-3 mb-4 p-3 rounded-xl bg-muted/50">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Thành viên</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="w-full justify-start hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </aside>
  );
}
