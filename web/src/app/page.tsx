'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Truck, Shield, Headphones, RotateCcw, ArrowRight, Search } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { productService } from '@/services/product.service';
import { featureSettingsService, FeatureSetting } from '@/services/feature-settings.service';
import ProductCard from '@/components/ProductCard';
import PromotionSections from '@/components/PromotionSections';
import { getCategoryDisplayName } from '@/lib/category-labels';

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

function groupProductsByCategory(products: Product[]): ProductCategory[] {
  const groups = new Map<string, Product[]>();

  products.forEach((product) => {
    const category = product.category?.trim() || 'Sản phẩm';
    groups.set(category, [...(groups.get(category) || []), product]);
  });

  return Array.from(groups, ([name, categoryProducts], index) => ({
    id: -(index + 1),
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    isActive: 1,
    icon: '',
    products: categoryProducts,
  }));
}

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [flashSale, setFlashSale] = useState<FeatureSetting | null>(null);
  const [promotion, setPromotion] = useState<FeatureSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesLoadError, setCategoriesLoadError] = useState(false);

  useEffect(() => {
    loadProducts();
    loadProductCategories();
    loadPromotions();
  }, []);

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/products');
      return;
    }
    addToCart(product.id, 1, product.image);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadProductCategories = async () => {
    try {
      setCategoriesLoading(true);
      setCategoriesLoadError(false);
      const data = await productService.getProductsGroupedByCategory();
      if (data.length > 0) {
        setProductCategories(data);
        return;
      }
      const fallbackProducts = await productService.getProducts();
      setProductCategories(groupProductsByCategory(fallbackProducts));
    } catch (error) {
      console.error('Error loading products grouped by category:', error);
      try {
        const fallbackProducts = await productService.getProducts();
        setProductCategories(groupProductsByCategory(fallbackProducts));
        setCategoriesLoadError(false);
      } catch (fallbackError) {
        console.error('Error loading fallback products:', fallbackError);
        setCategoriesLoadError(true);
      }
    } finally {
      setCategoriesLoading(false);
    }
  };

  const loadPromotions = async () => {
    const [flashSaleSetting, promotionSetting] = await Promise.all([
      featureSettingsService.getSetting('flash_sale'),
      featureSettingsService.getSetting('promotion'),
    ]);
    setFlashSale(flashSaleSetting);
    setPromotion(promotionSetting);
  };

  const categoriesWithProducts = productCategories.filter((category) => category.products?.length);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/.16),transparent_40%),linear-gradient(120deg,hsl(var(--background)),hsl(var(--muted)/.55))]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:py-16">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">Commercial store</p>
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">Thiết bị tốt cho mọi công trình</h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Dụng cụ, thiết bị điện và vật tư công nghiệp đáng tin cậy, giá minh bạch, giao nhanh cho cả đơn lẻ và đơn số lượng lớn.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => router.push('/products')}>Khám phá sản phẩm <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}>Xem hàng nổi bật</Button>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">Đã có sản phẩm sẵn sàng giao hôm nay</p>
            </div>
            <div className="relative rounded-2xl border border-primary/20 bg-primary p-7 text-primary-foreground shadow-xl sm:p-9">
              <div className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">Mua sắm dễ dàng</div>
              <Search className="mb-10 h-10 w-10" aria-hidden="true" />
              <p className="text-sm font-medium text-primary-foreground/75">Tìm kiếm thông minh</p>
              <h2 className="mt-2 max-w-sm text-2xl font-bold leading-tight">Tìm đúng sản phẩm, đặt hàng nhanh</h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-primary-foreground/80">Tìm theo tên, lọc theo danh mục và xem đầy đủ thông tin trước khi thêm vào giỏ.</p>
              <Button variant="secondary" className="mt-7" onClick={() => router.push('/products')}>Bắt đầu mua sắm <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </div>
          </div>
        </section>

       <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {serviceFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`
                    flex items-center justify-center gap-3
                    border-b pb-4
                    lg:border-b-0 lg:py-0
                    ${index < serviceFeatures.length - 1 ? 'lg:border-r' : ''}
                  `}
                >
                  <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <PromotionSections products={products} flashSale={flashSale} promotion={promotion} onAddToCart={handleAddToCart} />

        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6" id="featured-products">
          <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Danh mục sản phẩm</p><h2 className="mt-1 text-2xl font-bold">Mua sắm theo nhu cầu</h2></div><Button variant="ghost" onClick={() => router.push('/products')}>Tất cả sản phẩm <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
          {categoriesLoading ? <p className="py-12 text-center text-muted-foreground">Đang tải sản phẩm...</p> : categoriesLoadError ? <div className="rounded-xl border border-dashed p-10 text-center"><p className="font-semibold">Không thể tải sản phẩm lúc này</p><p className="mt-1 text-sm text-muted-foreground">Vui lòng thử lại sau ít phút.</p><Button variant="outline" className="mt-4" onClick={loadProductCategories}>Thử lại</Button></div> : categoriesWithProducts.length === 0 ? <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">Chưa có sản phẩm để hiển thị.</div> : <div className="space-y-8">{categoriesWithProducts.slice(0, 5).map((category) => <section key={category.id} aria-labelledby={`category-${category.id}`}><div className="mb-3"><h3 id={`category-${category.id}`} className="text-xl font-semibold">{getCategoryDisplayName(category.name)}</h3></div><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{category.products.slice(0, 5).map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} compact />)}</div></section>)}</div>}
        </section>
      </main>
    </div>
  );
}
