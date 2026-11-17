'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, Bell, User, Key, LogOut, HelpCircle, MapPin, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50">
      <div className="flex-1">
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Khu vực cá nhân</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Tài khoản của tôi</h1>
            <p className="mt-2 text-sm text-slate-500">Quản lý thông tin và hoạt động mua sắm của bạn.</p>
          </div>

          <Card className="mb-5 overflow-hidden border-slate-200/80 bg-white shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-5 text-center sm:flex-row sm:p-7 sm:text-left">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-primary text-3xl font-bold text-white shadow-lg shadow-primary/20 ring-4 ring-primary/10">
                {user?.username?.charAt(0).toUpperCase() || 'N'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Xin chào,</p>
                <h2 className="mt-1 break-words text-xl font-bold text-slate-900 sm:text-2xl">{user?.username || 'Người dùng'}</h2>
                <p className="mt-1 break-all text-sm text-slate-500">{user?.email || 'Chưa cập nhật email'}</p>
              </div>
              <Button
                variant="outline"
                className="shrink-0 rounded-xl border-primary/20 text-primary hover:bg-primary/5"
                onClick={() => router.push('/account/personal-info')}
              >
                Chỉnh sửa hồ sơ <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-5 border-slate-200/80 bg-white shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="grid grid-cols-3 gap-1 sm:gap-3">
                <Button
                  variant="ghost"
                  className="h-24 flex-col justify-center rounded-xl text-slate-700 transition hover:bg-violet-50 hover:text-primary sm:h-28"
                  onClick={() => router.push('/orders')}
                >
                  <Package className="mb-2 h-7 w-7 text-primary" />
                  <span className="text-xs font-semibold sm:text-sm">Đơn hàng</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-24 flex-col justify-center rounded-xl text-slate-700 transition hover:bg-violet-50 hover:text-primary sm:h-28"
                  onClick={() => router.push('/cart')}
                >
                  <ShoppingCart className="mb-2 h-7 w-7 text-primary" />
                  <span className="text-xs font-semibold sm:text-sm">Giỏ hàng</span>
                </Button>
                <Button
                  variant="ghost"
                  className="h-24 flex-col justify-center rounded-xl text-slate-700 transition hover:bg-violet-50 hover:text-primary sm:h-28"
                  onClick={() => router.push('/notifications')}
                >
                  <Bell className="mb-2 h-7 w-7 text-primary" />
                  <span className="text-xs font-semibold sm:text-sm">Thông báo</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <h3 className="mb-3 text-base font-bold text-slate-900">Tài khoản</h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start rounded-lg text-slate-700 hover:bg-violet-50 hover:text-primary"
                    onClick={() => router.push('/account/personal-info')}
                  >
                    <User className="mr-3 h-5 w-5" />
                    Thông tin cá nhân
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start rounded-lg text-slate-700 hover:bg-violet-50 hover:text-primary"
                    onClick={() => router.push('/account/change-password')}
                  >
                    <Key className="mr-3 h-5 w-5" />
                    Đổi mật khẩu
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start rounded-lg text-slate-700 hover:bg-violet-50 hover:text-primary"
                    onClick={() => router.push('/orders')}
                  >
                    <Package className="mr-3 h-5 w-5" />
                    Đơn hàng của tôi
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start rounded-lg text-slate-700 hover:bg-violet-50 hover:text-primary"
                    onClick={() => router.push('/cart')}
                  >
                    <ShoppingCart className="mr-3 h-5 w-5" />
                    Giỏ hàng
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-white shadow-sm">
              <CardContent className="p-5 sm:p-6">
                <h3 className="mb-3 text-base font-bold text-slate-900">Khác</h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start rounded-lg text-slate-700 hover:bg-violet-50 hover:text-primary"
                    onClick={() => router.push('/notifications')}
                  >
                    <Bell className="mr-3 h-5 w-5" />
                    Thông báo
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start rounded-lg text-slate-700 hover:bg-violet-50 hover:text-primary"
                    onClick={() => router.push('/account/delivery-address')}
                  >
                    <MapPin className="mr-3 h-5 w-5" />
                    Địa chỉ giao hàng
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-12 w-full justify-start rounded-lg text-slate-700 hover:bg-violet-50 hover:text-primary"
                    onClick={handleHelpSupport}
                  >
                    <HelpCircle className="mr-3 h-5 w-5" />
                    Trợ giúp & Hỗ trợ
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            variant="outline"
            className="mt-5 h-12 w-full rounded-xl border-rose-200 bg-white text-rose-600 hover:bg-rose-50 hover:text-rose-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Đăng xuất
          </Button>

          <p className="mt-4 text-center text-xs text-slate-400">Phiên bản 1.0.0</p>
        </main>
      </div>
    </div>
  );
}
