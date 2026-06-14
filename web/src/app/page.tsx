'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CountdownTimer from '@/components/CountdownTimer';
import { Button } from '@/components/ui/button';
import { Truck, Shield, Headphones, RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';

const flashSaleProducts = [
  {
    id: 1,
    name: 'Máy khoan động lực 850W',
    price: 1850000,
    originalPrice: 2300000,
    discount: 20,
    image: '/api/placeholder/200/200'
  },
  {
    id: 2,
    name: 'Bộ dụng cụ cơ lê, tuốc nơ vít 45 món',
    price: 1200000,
    originalPrice: 1600000,
    discount: 25,
    image: '/api/placeholder/200/200'
  },
  {
    id: 3,
    name: 'Ổ cắm chống giật 6 lỗ',
    price: 600000,
    originalPrice: 800000,
    discount: 25,
    image: '/api/placeholder/200/200'
  },
  {
    id: 4,
    name: 'Đèn bàn LED công nghiệp',
    price: 250000,
    originalPrice: 350000,
    discount: 28,
    image: '/api/placeholder/200/200'
  }
];

const featuredProducts = [
  {
    id: 1,
    name: 'Máy khoan động lực 850W',
    description: 'Máy khoan công suất cao, đa năng',
    price: 1850000,
    image: '/api/placeholder/200/200'
  },
  {
    id: 2,
    name: 'Bộ dụng cụ cơ lê, tuốc nơ vít 45 món',
    description: 'Bộ dụng cụ hoàn chỉnh cho thợ cơ khí',
    price: 1200000,
    image: '/api/placeholder/200/200'
  },
  {
    id: 3,
    name: 'Ổ cắm chống giật 6 lỗ',
    description: 'An toàn tuyệt đối cho gia đình',
    price: 600000,
    image: '/api/placeholder/200/200'
  },
  {
    id: 4,
    name: 'Đèn bàn LED công nghiệp',
    description: 'Tiết kiệm điện, ánh sáng mạnh',
    price: 250000,
    image: '/api/placeholder/200/200'
  },
  {
    id: 5,
    name: 'Bơm nước mini 220V',
    description: 'Compact, hiệu suất cao',
    price: 300000,
    image: '/api/placeholder/200/200'
  }
];

const serviceFeatures = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    description: 'Đơn hàng từ 500K'
  },
  {
    icon: Shield,
    title: 'Thanh toán an toàn',
    description: 'Bảo mật 100%'
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Luôn sẵn sàng'
  },
  {
    icon: RotateCcw,
    title: 'Đổi trả dễ dàng',
    description: 'Trong 30 ngày'
  }
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (productId: number) => {
    addToCart(productId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      
      <main className="lg:ml-64 pt-16">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Banner Section */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-6 w-6" />
                <span className="text-lg font-semibold">Khuyến mãi đặc biệt</span>
              </div>
              <h1 className="text-4xl font-bold mb-2">Giảm tới 20%</h1>
              <p className="text-lg mb-6 opacity-90">Mùa hè sôi động - Đặt sỉ giá tốt nhất</p>
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8">
                Mua ngay
              </Button>
            </div>
          </div>

          {/* Flash Sale Section */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <ShoppingBag className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">FLASH SALE</h2>
                  <CountdownTimer />
                </div>
              </div>
              <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                Xem tất cả
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {flashSaleProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</span>
                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  </div>
                  <div className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded inline-block">
                    -{product.discount}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Features Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {serviceFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Featured Products Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
              <Button variant="outline">Xem tất cả</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
