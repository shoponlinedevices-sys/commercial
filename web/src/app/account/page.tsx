'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Bell, User, Key, LogOut, HelpCircle, MapPin } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleHelpSupport = () => {
    alert('Trợ giúp & Hỗ trợ\nSố điện thoại: 123456789\nEmail: shoponlinedevices@gmail.com');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16 lg:mt-0">
          {/* HEADER */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.username || 'User'}</h2>
              <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
            </CardContent>
          </Card>

          {/* STATS */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center h-24"
                  onClick={() => router.push('/orders')}
                >
                  <Package className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-semibold text-gray-900">Đơn hàng</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center h-24"
                  onClick={() => router.push('/cart')}
                >
                  <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-semibold text-gray-900">Giỏ hàng</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center justify-center h-24"
                  onClick={() => router.push('/notifications')}
                >
                  <Bell className="h-8 w-8 mb-2 text-primary" />
                  <span className="text-sm font-semibold text-gray-900">Thông báo</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* MENU - Tài khoản */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tài khoản</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => router.push('/account/personal-info')}
                >
                  <User className="h-5 w-5 mr-3" />
                  Thông tin cá nhân
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => router.push('/account/change-password')}
                >
                  <Key className="h-5 w-5 mr-3" />
                  Đổi mật khẩu
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => router.push('/orders')}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Đơn hàng của tôi
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => router.push('/cart')}
                >
                  <ShoppingCart className="h-5 w-5 mr-3" />
                  Giỏ hàng
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* MENU - Khác */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Khác</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => router.push('/notifications')}
                >
                  <Bell className="h-5 w-5 mr-3" />
                  Thông báo
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={() => router.push('/account/delivery-address')}
                >
                  <MapPin className="h-5 w-5 mr-3" />
                  Địa chỉ giao hàng
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12"
                  onClick={handleHelpSupport}
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  Trợ giúp & Hỗ trợ
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* LOGOUT */}
          <Button
            variant="outline"
            className="w-full h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Đăng xuất
          </Button>

          {/* VERSION */}
          <p className="text-center text-sm text-gray-400 mt-4">Phiên bản 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
