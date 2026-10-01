'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { productService } from '@/services/product.service';
import { Product, ProductCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { getCategoryDisplayName } from '@/lib/category-labels';

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { addToCart: addProductToCart } = useCart();
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    productService.getProductsGroupedByCategory()
      .then(setProductCategories)
      .catch((error) => {
        console.error('Error loading products grouped by category:', error);
        setLoadError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const normalizedSearch = searchQuery.toLowerCase();
  const filteredCategories = productCategories
    .map((category) => ({
      ...category,
      products: category.products.filter((product) => {
        const matchesSearch = !normalizedSearch
          || product.name.toLowerCase().includes(normalizedSearch)
          || product.description?.toLowerCase().includes(normalizedSearch);
        const matchesCategory = !selectedCategory
          || category.name === selectedCategory
          || getCategoryDisplayName(category.name) === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    }))
    .filter((category) => category.products.length > 0);
  const filteredProducts = filteredCategories.flatMap((category) =>
    category.products.map((product) => ({ ...product, category: category.name })),
  );
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const visibleProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
  const visibleCategories = filteredCategories
    .map((category) => ({
      ...category,
      products: visibleProducts.filter((product) => product.category === category.name),
    }))
    .filter((category) => category.products.length > 0);

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/products');
      return;
    }
    try {
      await addProductToCart(product.id, 1, product.image);
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
          {productCategories.filter((category) => category.products.length > 0).map((category) => {
            const displayName = getCategoryDisplayName(category.name);
            return <Button key={category.id} variant={selectedCategory === category.name || selectedCategory === displayName ? 'default' : 'outline'} size="sm" onClick={() => router.push(`/products?category=${encodeURIComponent(category.name)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`)}>{displayName}</Button>;
          })}
        </div>
        {loading ? <p className="py-16 text-center text-muted-foreground">Đang tải sản phẩm...</p> : loadError ? <p className="py-16 text-center text-muted-foreground">Không thể tải sản phẩm lúc này. Vui lòng thử lại sau.</p> : filteredProducts.length === 0 ? <p className="py-16 text-center text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p> : (
          <>
            <div className="space-y-8">
              {visibleCategories.map((category) => (
                <section key={category.id} aria-labelledby={`category-${category.id}`}>
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h2 id={`category-${category.id}`} className="text-xl font-semibold">{getCategoryDisplayName(category.name)}</h2>
                    <span className="text-sm text-muted-foreground">{category.products.length} sản phẩm</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {category.products.map((product) => <ProductCard key={product.id} product={{ ...product, category: getCategoryDisplayName(category.name) }} onAddToCart={addToCart} compact />)}
                  </div>
                </section>
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="mt-8 flex items-center justify-center gap-4" aria-label="Phân trang sản phẩm">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>Trước</Button>
                <span className="text-sm text-muted-foreground" aria-live="polite">Trang {currentPage} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>Tiếp</Button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
}
