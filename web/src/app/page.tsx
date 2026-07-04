'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CountdownTimer from '@/components/CountdownTimer';
import { Button } from '@/components/ui/button';
import { Truck, Shield, Headphones, RotateCcw, ShoppingBag, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { productService } from '@/services/product.service';

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
  // {
  //   icon: RotateCcw,
  //   title: 'Đổi trả dễ dàng',
  //   description: 'Trong 30 ngày'
  // }
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showAllFlashSale, setShowAllFlashSale] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      setLoadingAuth(false);
    }
  }, [isAuthenticated, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = (productId: number, productImage?: string) => {
    addToCart(productId, 1, productImage);
  };

  const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        
        <main className="pt-16">
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
              <Button 
                variant="outline" 
                className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                onClick={() => setShowAllFlashSale(!showAllFlashSale)}
              >
                {showAllFlashSale ? 'Thu gọn' : 'Xem tất cả'}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(showAllFlashSale ? products : products.slice(0, isMobile ? 2 : 4)).map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                   <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-bold text-orange-600">{formatPrice(product.price)}</span>
                    {/* <span className="text-sm text-gray-400 line-through">{formatPrice(product.originalPrice)}</span> */}
                  </div>
                  <div className="bg-orange-100 text-orange-600 text-xs font-bold px-2 py-1 rounded inline-block">
                    {/* -{product.discount}% */}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Service Features Section */}
          <div className="bg-card border border-border rounded-xl p-4 mb-8 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-around gap-2">
              {serviceFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-2 flex-1 justify-center">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Products Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
              <Button variant="outline">Xem tất cả</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div> */}
                 <div className="aspect-square rounded-lg overflow-hidden mb-3">
                   <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleAddToCart(product.id, product.image)}
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
    </div>
  );
}
