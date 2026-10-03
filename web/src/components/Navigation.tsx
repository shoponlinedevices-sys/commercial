'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ShoppingCart, Package, User, Bell, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/products', icon: Package, label: 'Sản phẩm' },
    { href: '/cart', icon: ShoppingCart, label: 'Giỏ hàng' },
    { href: '/orders', icon: Package, label: 'Đơn hàng' },
    { href: '/notifications', icon: Bell, label: 'Thông báo' },
    { href: '/account', icon: User, label: 'Tài khoản' },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/products" className="text-xl font-bold text-primary">
              Commercial
            </Link>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Xin chào, {user?.username}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
