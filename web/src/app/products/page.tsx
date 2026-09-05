'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { productService } from '@/services/product.service';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { refreshCartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    productService.getProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    const normalizedSearch = searchQuery.toLowerCase();
    setFilteredProducts(products.filter((product) => {
      const matchesSearch = !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch) || product.description.toLowerCase().includes(normalizedSearch);
      return matchesSearch && (!selectedCategory || product.category === selectedCategory);
    }));
  }, [products, searchQuery, selectedCategory]);

  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));

  const addToCart = async (product: Product) => {
    if (!user) {
      router.push('/login?redirect=/products');
      return;
    }
    try {
      const { cartService } = await import('@/services/cart.service');
      await cartService.addToCart({ userId: user.id, productId: product.id, quantity: 1, image: product.image });
      await refreshCartCount();
      alert('Đã thêm sản phẩm vào giỏ hàng');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Không thể thêm sản phẩm vào giỏ hàng');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-medium text-primary">Commercial catalog</p><h1 className="mt-1 text-3xl font-bold">Tất cả sản phẩm</h1><p className="mt-2 text-muted-foreground">Chọn thiết bị phù hợp cho công việc và công trình của bạn.</p></div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Search className="h-4 w-4" />{filteredProducts.length} sản phẩm</div>
        </div>
        <div className="mb-8 flex flex-wrap gap-2">
          <Button variant={!selectedCategory ? 'default' : 'outline'} size="sm" onClick={() => router.push(searchQuery ? `/products?search=${encodeURIComponent(searchQuery)}` : '/products')}>Tất cả</Button>
          {categories.map((category) => <Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} size="sm" onClick={() => router.push(`/products?category=${encodeURIComponent(category as string)}`)}>{category}</Button>)}
        </div>
        {loading ? <p className="py-16 text-center text-muted-foreground">Đang tải sản phẩm...</p> : filteredProducts.length === 0 ? <p className="py-16 text-center text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p> : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={addToCart} />)}</div>}
      </main>
    </div>
  );
}
