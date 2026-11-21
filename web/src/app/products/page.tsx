'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { productService } from '@/services/product.service';
import { Product, ProductCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, Boxes, CheckCircle2, PackageSearch, Search, ShieldCheck, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { getCategoryDisplayName } from '@/lib/category-labels';
import { recordViewEvent } from '@/lib/view-tracking';

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
  const trackedCategoryId = useRef<number | null>(null);

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

  useEffect(() => {
    if (loading) return;
    if (!selectedCategory) {
      trackedCategoryId.current = null;
      return;
    }
    const category = productCategories.find((item) =>
      item.name === selectedCategory || getCategoryDisplayName(item.name) === selectedCategory,
    );
    if (!category) {
      trackedCategoryId.current = null;
      return;
    }
    if (trackedCategoryId.current !== category.id) {
      trackedCategoryId.current = category.id;
      recordViewEvent('category', category.id);
    }
  }, [loading, productCategories, selectedCategory]);

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

  const clearFilters = () => router.push('/products');

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
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <section className="relative isolate mb-8 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-100 via-white to-indigo-50 px-6 py-8 text-slate-900 shadow-xl shadow-violet-100/70 sm:mb-10 sm:px-10 sm:py-11">
          <div aria-hidden="true" className="absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-36 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-3 py-1 text-xs font-medium text-violet-700">
                <Sparkles className="h-3.5 w-3.5" />
                Danh mục Commercial
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                {selectedCategory
                  ? getCategoryDisplayName(selectedCategory)
                  : searchQuery ? 'Kết quả tìm kiếm' : 'Tất cả sản phẩm'}
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Thiết bị và dụng cụ phù hợp cho công việc, công trình và nhu cầu hằng ngày của bạn.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600 sm:text-sm">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" />Mua sắm an tâm</span>
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Thông tin rõ ràng</span>
              </div>
            </div>
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-violet-100 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Boxes className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-xl font-bold leading-6">{filteredProducts.length}</span>
                <span className="text-xs text-slate-500">sản phẩm phù hợp</span>
              </span>
            </div>
          </div>
        </section>

        <section aria-label="Danh mục sản phẩm" className="mb-8 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold">Khám phá danh mục</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Chọn nhóm sản phẩm bạn đang cần</p>
            </div>
            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
              <Search className="h-3.5 w-3.5" />
              {filteredProducts.length} kết quả
            </div>
          </div>
          <nav aria-label="Lọc theo danh mục" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
            <Button
              variant={!selectedCategory ? 'default' : 'outline'}
              size="sm"
              aria-pressed={!selectedCategory}
              className="shrink-0 rounded-full"
              onClick={() => router.push(searchQuery ? `/products?search=${encodeURIComponent(searchQuery)}` : '/products')}
            >
              Tất cả <span className="ml-1.5 opacity-75">{productCategories.reduce((count, category) => count + category.products.length, 0)}</span>
            </Button>
          {productCategories.filter((category) => category.products.length > 0).map((category) => {
            const displayName = getCategoryDisplayName(category.name);
            const isSelected = selectedCategory === category.name || selectedCategory === displayName;
            return (
              <Button
                key={category.id}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                aria-pressed={isSelected}
                className="shrink-0 rounded-full"
                onClick={() => router.push(`/products?category=${encodeURIComponent(category.name)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`)}
              >
                {displayName}<span className="ml-1.5 opacity-75">{category.products.length}</span>
              </Button>
            );
          })}
          </nav>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5" aria-label="Đang tải sản phẩm">
            {Array.from({ length: 10 }, (_, index) => (
              <div key={index} className="overflow-hidden rounded-2xl border bg-card">
                <div className="aspect-[5/4] animate-pulse bg-muted/70" />
                <div className="space-y-3 p-3.5">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-9 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div role="alert" className="rounded-2xl border border-destructive/20 bg-card px-6 py-14 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-semibold">Chưa thể tải danh sách sản phẩm</p>
            <p className="mt-1 text-sm text-muted-foreground">Vui lòng thử lại sau ít phút.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PackageSearch className="h-7 w-7" />
            </span>
            <h2 className="mt-4 text-lg font-semibold">Chưa tìm thấy sản phẩm phù hợp</h2>
            <p className="mt-1 text-sm text-muted-foreground">Thử từ khóa khác hoặc xem toàn bộ danh mục sản phẩm.</p>
            <Button className="mt-5 rounded-xl" onClick={clearFilters}>
              Xem tất cả sản phẩm <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Bộ sưu tập</p>
                <h2 className="mt-1 text-xl font-bold tracking-tight">Sản phẩm dành cho bạn</h2>
              </div>
              <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">{filteredProducts.length} sản phẩm</span>
            </div>
            <div className="space-y-9 sm:space-y-11">
              {visibleCategories.map((category) => (
                <section key={category.id} aria-labelledby={`category-${category.id}`}>
                  <div className="mb-4 flex items-center justify-between gap-3 border-b pb-3">
                    <h3 id={`category-${category.id}`} className="flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl">
                      <span className="h-5 w-1 rounded-full bg-primary" />
                      {getCategoryDisplayName(category.name)}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground sm:text-sm">{category.products.length} sản phẩm</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                    {category.products.map((product) => <ProductCard key={product.id} product={{ ...product, category: getCategoryDisplayName(category.name) }} onAddToCart={addToCart} compact />)}
                  </div>
                </section>
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-4 rounded-2xl border bg-card px-4 py-3" aria-label="Phân trang sản phẩm">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>Trước</Button>
                <span className="text-sm font-medium text-muted-foreground" aria-live="polite">Trang {currentPage} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>Tiếp</Button>
              </nav>
            )}
          </>
        )}
      </main>
    </div>
  );
}
