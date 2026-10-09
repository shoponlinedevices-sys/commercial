'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Truck, Shield, Headphones, ArrowRight, Wrench, Zap, Cog, HardHat, Package } from 'lucide-react';
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
];

const categoryIcons = [Wrench, Zap, Cog, HardHat];

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

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/products');
      return;
    }
    try {
      await addToCart(product.id, 1, product.image);
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Không thể thêm sản phẩm vào giỏ hàng');
    }
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
  const featuredProducts = products.slice(0, 4);
  const heroProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="bg-[linear-gradient(180deg,hsl(var(--muted)/.5),hsl(var(--background)))] px-4 pb-3 pt-4 sm:px-6">
          <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-primary/10 bg-[linear-gradient(110deg,#f6f3ff_0%,#fff_48%,#eee8ff_100%)] shadow-sm lg:min-h-[300px] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative z-10 px-6 py-8 sm:px-9 sm:py-10 lg:py-12">
              <p className="mb-3 inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">Dụng cụ & thiết bị công nghiệp</p>
              <h1 className="max-w-lg text-3xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]">Thiết bị tốt cho mọi <span className="text-primary">công trình</span></h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">Dụng cụ, thiết bị điện và vật tư công nghiệp đáng tin cậy, giá minh bạch, giao nhanh cho mọi nhu cầu.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={() => router.push('/products')}>Khám phá sản phẩm <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <Button variant="outline" className="border-slate-300 bg-white/70 text-slate-800" onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}>Xem sản phẩm nổi bật</Button>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" />Sản phẩm được cập nhật trực tiếp từ cửa hàng</p>
            </div>
            <div className="relative min-h-[210px] overflow-hidden bg-[radial-gradient(ellipse_at_70%_60%,#c4b5fd_0%,#ede9fe_40%,transparent_72%)] sm:min-h-[260px] lg:min-h-full">
              {heroProducts.length > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center px-5 py-4 sm:px-10">
                  <div className="relative h-full min-h-[190px] w-full max-w-xl">
                    {heroProducts.map((product, index) => (
                      product.image ? (
                        <div
                          key={product.id}
                          className={`absolute bottom-0 top-0 ${index === 0 ? 'left-[22%] z-20 w-[48%]' : index === 1 ? 'left-0 z-10 w-[38%] opacity-90' : 'right-0 z-10 w-[38%] opacity-90'}`}
                        >
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 40vw, 25vw"
                            className="object-contain drop-shadow-xl"
                            priority={index === 0}
                          />
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-primary/50">
                  <Wrench className="h-24 w-24" strokeWidth={1} />
                </div>
              )}
              <div className="absolute right-4 top-4 z-30 grid gap-2 sm:right-6 sm:top-6">
                {[
                  { icon: Shield, title: 'Chất lượng chính hãng', detail: 'An tâm lựa chọn' },
                  { icon: Truck, title: 'Giao hàng nhanh', detail: 'Toàn quốc' },
                  { icon: Headphones, title: 'Hỗ trợ 24/7', detail: 'Luôn sẵn sàng' },
                ].map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-center gap-2 rounded-xl border border-white/70 bg-white/90 px-3 py-2 shadow-sm backdrop-blur">
                      <span className="rounded-lg bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></span>
                      <span><span className="block text-[11px] font-semibold text-slate-800">{feature.title}</span><span className="block text-[10px] text-slate-500">{feature.detail}</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

       <section className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="grid grid-cols-1 gap-2 rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm sm:grid-cols-3 sm:gap-0 sm:px-2">
            {serviceFeatures.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className={`
                    flex items-center gap-3 px-3 py-2 sm:justify-center sm:py-3
                    ${index < serviceFeatures.length - 1 ? 'sm:border-r sm:border-border/70' : ''}
                  `}
                >
                  <div className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <PromotionSections products={products} flashSale={flashSale} promotion={promotion} onAddToCart={handleAddToCart} />

        <section className="mx-auto max-w-6xl px-4 pb-8 pt-5 sm:px-6" id="featured-products">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Khám phá cửa hàng</p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">Sản phẩm nổi bật</h2>
            </div>
            <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => router.push('/products')}>Tất cả sản phẩm <ArrowRight className="ml-2 h-3 w-3" /></Button>
          </div>
          {loading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Đang tải sản phẩm...</p>
          ) : loadError ? (
            <div className="rounded-2xl border border-dashed p-10 text-center">
              <p className="font-semibold">Không thể tải sản phẩm lúc này</p>
              <p className="mt-1 text-sm text-muted-foreground">Vui lòng thử lại sau ít phút.</p>
              <Button variant="outline" className="mt-4" onClick={loadProducts}>Thử lại</Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Chưa có sản phẩm nổi bật để hiển thị.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} compact />)}
            </div>
          )}
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Tìm nhanh theo nhu cầu</p>
              <h2 className="mt-1 text-xl font-bold tracking-tight">Danh mục sản phẩm</h2>
            </div>
            <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground" onClick={() => router.push('/products')}>Xem tất cả <ArrowRight className="ml-2 h-3 w-3" /></Button>
          </div>
          {categoriesLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Đang tải danh mục...</p>
          ) : categoriesLoadError ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <p className="text-sm font-semibold">Không thể tải danh mục lúc này</p>
              <Button variant="outline" className="mt-3" size="sm" onClick={loadProductCategories}>Thử lại</Button>
            </div>
          ) : categoriesWithProducts.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Chưa có danh mục sản phẩm để hiển thị.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categoriesWithProducts.map((category, index) => {
                const Icon = categoryIcons[index % categoryIcons.length];
                const product = category.products[0];
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => router.push(`/products?category=${encodeURIComponent(category.name)}`)}
                    className="group flex min-h-[88px] items-center gap-3 overflow-hidden rounded-xl border border-border/70 bg-card p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <span className="shrink-0 rounded-xl bg-primary/10 p-2.5 text-primary"><Icon className="h-5 w-5" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{getCategoryDisplayName(category.name)}</span>
                      <span className="mt-1 block text-[11px] text-muted-foreground">{category.products.length} sản phẩm</span>
                    </span>
                    {product?.image ? (
                      <span className="relative h-14 w-16 shrink-0">
                        <Image src={product.image} alt="" fill sizes="64px" className="object-contain transition-transform group-hover:scale-110" />
                      </span>
                    ) : (
                      <Package className="mr-1 h-8 w-8 shrink-0 text-primary/30" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
