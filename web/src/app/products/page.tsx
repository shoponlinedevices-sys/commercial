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
      <div className="min-h-screen flex bg-gradient-to-br from-background via-background to-muted/20">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <Header />
          <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 mt-16">
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Header />
        <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 mt-16">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className={selectedCategory === '' ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90' : ''}
              >
                Tất cả
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category!)}
                  className={selectedCategory === category ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Promotion Banner */}
          {!searchQuery && showPromotion && (
            <Card className="mb-8 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white border-0 shadow-xl overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 text-center md:text-left">
                    <Badge className="mb-3 bg-white/20 backdrop-blur-sm text-white border-white/30">B2B</Badge>
                    <h2 className="text-2xl md:text-4xl font-bold mb-2">Giảm tới 20%</h2>
                    <p className="text-white/90 text-base md:text-lg">Khuyến mãi mùa hè cho đơn hàng lớn</p>
                    <p className="text-sm text-white/70 mt-1">Ưu đãi dành cho đơn vị mua sỉ, thời gian có hạn.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-5xl md:text-7xl">🛒</div>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => router.push('/cart')}
                      className="shadow-lg"
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
              <Card className="mb-6 overflow-hidden shadow-lg">
                <div className="relative h-40 md:h-56 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      <Badge className="mb-3 bg-white/20 backdrop-blur-sm text-white border-white/30 text-lg md:text-xl px-4 py-2">⚡ FLASH SALE</Badge>
                      <h2 className="text-2xl md:text-4xl font-bold">Giảm giá sốc</h2>
                      <p className="text-white/90 text-base md:text-lg">Thời gian có hạn!</p>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Flash Sale</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Kết thúc trong:</span>
                  <Badge variant="destructive" className="text-lg md:text-xl px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500">
                    {formatTime(flashSaleTime)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                {flashSaleProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <div className="relative h-48 bg-muted">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No image
                        </div>
                      )}
                      {product.badge && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">{product.badge}</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-base mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
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
            <div className="mb-8 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <Card className="p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-transparent hover:border-primary/20">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Truck className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">Miễn phí vận chuyển</h3>
                  <p className="text-xs text-muted-foreground mt-1">Đơn hàng từ 500K</p>
                </div>
              </Card>
              <Card className="p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-transparent hover:border-primary/20">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Shield className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">Thanh toán an toàn</h3>
                  <p className="text-xs text-muted-foreground mt-1">Bảo mật 100%</p>
                </div>
              </Card>
              <Card className="p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-transparent hover:border-primary/20">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Headphones className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">Hỗ trợ 24/7</h3>
                  <p className="text-xs text-muted-foreground mt-1">Luôn sẵn sàng</p>
                </div>
              </Card>
              <Card className="p-4 md:p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-transparent hover:border-primary/20">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <RotateCcw className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base">Đổi trả dễ dàng</h3>
                  <p className="text-xs text-muted-foreground mt-1">Trong 30 ngày</p>
                </div>
              </Card>
            </div>
          )}

          {/* Product Grid */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Sản phẩm nổi bật</h2>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-transparent hover:border-primary/20">
                  <div className="relative h-48 sm:h-56 bg-muted overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No image
                      </div>
                    )}
                    {product.badge && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-primary to-purple-600 shadow-lg">{product.badge}</Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        ${product.price}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.oldPrice}
                        </span>
                      )}
                    </div>
                    {product.category && (
                      <Badge variant="secondary" className="text-xs">
                        {product.category}
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-md"
                      size="sm"
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
