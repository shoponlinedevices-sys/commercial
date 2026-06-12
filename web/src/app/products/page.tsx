'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { productService } from '@/services/product.service';
import { Product } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Image from 'next/image';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFlashSale, setShowFlashSale] = useState(true);
  const [showPromotion, setShowPromotion] = useState(true);
  const [flashSaleTime, setFlashSaleTime] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const flashSaleProducts = filteredProducts.slice(0, 4);

  const addToCart = async (productId: number) => {
    try {
      const { cartService } = await import('@/services/cart.service');
      await cartService.addToCart({
        userId: user!.id,
        productId,
        quantity: 1,
      });
      await refreshCartCount();
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <Header />
          <div className="container mx-auto px-4 py-8 mt-16 lg:mt-0">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <div className="container mx-auto px-4 py-8 mt-16 lg:mt-0">
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
              >
                Tất cả
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category!)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Promotion Banner */}
          {!searchQuery && showPromotion && (
            <Card className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <Badge className="mb-2 bg-white text-blue-600">B2B</Badge>
                    <h2 className="text-2xl font-bold mb-2">Giảm tới 20%</h2>
                    <p className="text-blue-100">Khuyến mãi mùa hè cho đơn hàng lớn</p>
                    <p className="text-sm text-blue-200 mt-1">Ưu đãi dành cho đơn vị mua sỉ, thời gian có hạn.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-6xl">🛒</div>
                    <Button
                      variant="secondary"
                      onClick={() => router.push('/cart')}
                    >
                      Mua ngay
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flash Sale Section */}
          {!searchQuery && showFlashSale && (
            <div className="mb-8">
              <Card className="mb-4 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-r from-orange-500 to-red-600">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Badge className="mb-2 bg-white text-orange-600 text-lg px-4 py-1">⚡ FLASH SALE</Badge>
                      <h2 className="text-3xl font-bold">Giảm giá sốc</h2>
                      <p className="text-orange-100">Thời gian có hạn!</p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Flash Sale</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Kết thúc trong:</span>
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    {formatTime(flashSaleTime)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {flashSaleProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-40 bg-muted">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No image
                        </div>
                      )}
                      {product.badge && (
                        <Badge className="absolute top-2 right-2 bg-orange-500">{product.badge}</Badge>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-lg font-bold text-orange-600">
                        ${product.price}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {!searchQuery && (
            <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center">
                  <Truck className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-sm">Miễn phí vận chuyển</h3>
                  <p className="text-xs text-gray-500 mt-1">Đơn hàng từ 500K</p>
                </div>
              </Card>
              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center">
                  <Shield className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="font-semibold text-sm">Thanh toán an toàn</h3>
                  <p className="text-xs text-gray-500 mt-1">Bảo mật 100%</p>
                </div>
              </Card>
              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center">
                  <Headphones className="h-8 w-8 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-sm">Hỗ trợ 24/7</h3>
                  <p className="text-xs text-gray-500 mt-1">Luôn sẵn sàng</p>
                </div>
              </Card>
              <Card className="p-4 text-center hover:shadow-md transition-shadow">
                <div className="flex flex-col items-center">
                  <RotateCcw className="h-8 w-8 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-sm">Đổi trả dễ dàng</h3>
                  <p className="text-xs text-gray-500 mt-1">Trong 30 ngày</p>
                </div>
              </Card>
            </div>
          )}

          {/* Product Grid */}
          <h2 className="text-2xl font-bold mb-4">Sản phẩm nổi bật</h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No image
                      </div>
                    )}
                    {product.badge && (
                      <Badge className="absolute top-2 right-2">{product.badge}</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>
                    {product.category && (
                      <Badge variant="secondary" className="mt-2">
                        {product.category}
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full"
                      onClick={() => addToCart(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
