'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { FeatureSetting } from '@/services/feature-settings.service';
import ProductCard from '@/components/ProductCard';

interface PromotionSectionsProps {
  products: Product[];
  flashSale?: FeatureSetting | null;
  promotion?: FeatureSetting | null;
  onAddToCart: (product: Product) => void;
}

function getConfigNumber(setting: FeatureSetting | null | undefined, key: string, fallback: number) {
  const value = setting?.config?.[key];
  return typeof value === 'number' ? value : fallback;
}

function getConfigText(setting: FeatureSetting | null | undefined, key: string, fallback: string) {
  const value = setting?.config?.[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return [hours, minutes, remainingSeconds].map((value) => String(value).padStart(2, '0')).join(':');
}

function Countdown({ endTime }: { endTime?: string }) {
  const [secondsLeft, setSecondsLeft] = useState(() => endTime ? Math.max(0, Math.floor((Date.parse(endTime) - Date.now()) / 1000)) : 0);

  useEffect(() => {
    if (!endTime) return;
    const update = () => setSecondsLeft(Math.max(0, Math.floor((Date.parse(endTime) - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [endTime]);

  if (!endTime || secondsLeft <= 0) return null;
  return <span className="inline-flex items-center gap-1 font-mono text-sm font-bold"><Clock className="h-4 w-4" /> {formatTime(secondsLeft)}</span>;
}

export default function PromotionSections({ products, flashSale, promotion, onAddToCart }: PromotionSectionsProps) {
  const router = useRouter();
  const discountedProducts = products.filter((product) => product.oldPrice && product.oldPrice > product.price);
  const flashProducts = discountedProducts.slice(0, getConfigNumber(flashSale, 'max_products', 8));
  const hasFlashSale = Boolean(flashSale?.isEnabled && flashProducts.length);
  const hasPromotion = Boolean(promotion?.isEnabled);

  if (!hasFlashSale && !hasPromotion) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6" aria-label="Khuyến mãi">
      {hasPromotion && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">Ưu đãi dành cho bạn</p>
            <h2 className="mt-1 text-2xl font-bold text-amber-950">{getConfigText(promotion, 'badge_text', 'Khuyến mãi')}</h2>
            <p className="mt-1 text-sm text-amber-900/75">Giảm từ {getConfigNumber(promotion, 'min_discount', 10)}% trên các sản phẩm đang có giá ưu đãi.</p>
          </div>
          <button type="button" onClick={() => router.push('/products')} className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-amber-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-amber-800">Xem ưu đãi <ArrowRight className="h-4 w-4" /></button>
        </div>
      )}

      {hasFlashSale && (
        <div className="rounded-2xl bg-slate-950 p-5 text-white sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-violet-300"><Zap className="h-4 w-4 fill-current" /> {getConfigText(flashSale, 'badge_text', 'Flash Sale')}</p>
              <h2 className="mt-1 text-2xl font-bold">Giá tốt trong thời gian có hạn</h2>
            </div>
            <Countdown endTime={flashSale?.endTime} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {flashProducts.map((product) => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} compact />)}
          </div>
        </div>
      )}
    </section>
  );
}