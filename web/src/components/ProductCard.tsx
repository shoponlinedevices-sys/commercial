'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Minus, Plus, ShoppingCart, Package } from 'lucide-react';
import { useState } from 'react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatVnd } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void | Promise<void>;
  onDecreaseCartQuantity?: (product: Product, quantity: number) => void | Promise<void>;
  cartQuantity?: number;
  compact?: boolean;
  showAvailability?: boolean;
}

export default function ProductCard({
  product,
  onAddToCart,
  onDecreaseCartQuantity,
  cartQuantity = 0,
  compact = false,
  showAvailability = false,
}: ProductCardProps) {
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);

  const handleAddToCart = async () => {
    if (!onAddToCart || isUpdatingCart) return;

    setIsUpdatingCart(true);
    try {
      await onAddToCart(product);
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const handleDecreaseCartQuantity = async () => {
    if (!onDecreaseCartQuantity || isUpdatingCart) return;

    setIsUpdatingCart(true);
    try {
      await onDecreaseCartQuantity(product, cartQuantity - 1);
    } finally {
      setIsUpdatingCart(false);
    }
  };

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className={`relative block ${compact ? 'aspect-[5/4]' : 'aspect-[4/3]'} overflow-hidden bg-white`} aria-label={`Xem ${product.name}`}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-200 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        )}
        {product.badge && <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">{product.badge}</Badge>}
      </Link>
      <div className={`flex flex-1 flex-col ${compact ? 'p-3 sm:p-3.5' : 'p-4'}`}>
        {product.category && <p className="mb-1 line-clamp-1 text-[11px] font-medium uppercase tracking-wide text-primary">{product.category}</p>}
        <Link href={`/products/${product.id}`} title={product.name} className={`line-clamp-2 min-h-10 text-sm font-semibold leading-5 hover:text-primary focus-visible:rounded-sm ${compact ? '' : 'sm:text-base'}`}>
          {product.name}
        </Link>
        {!compact && <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">{product.description}</p>}
        {compact && product.sku && <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">Mã: {product.sku}</p>}
        <div className={`mt-auto ${compact ? 'pt-3' : 'pt-4'}`}>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className={`font-bold text-primary ${compact ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>{formatVnd(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{formatVnd(product.oldPrice)}</span>}
          </div>
          {(product.unit || product.moq) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {product.unit && `Đơn vị: ${product.unit}`}
              {product.unit && product.moq && ' | '}
              {product.moq && `Số lượng đặt tối thiểu: ${product.moq}`}
            </p>
          )}
          {showAvailability && product.quantityAvailable !== undefined && (
            <p className={`mt-1 text-xs ${product.quantityAvailable > 0 ? 'text-muted-foreground' : 'text-destructive'}`}>
              Có sẵn: {product.quantityAvailable.toLocaleString('vi-VN')}
            </p>
          )}
          {onAddToCart && (
            cartQuantity > 0 ? (
              <div className={`${compact ? 'mt-2' : 'mt-3'} flex h-10 items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-1`}>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Giảm số lượng ${product.name} trong giỏ`}
                  onClick={() => { void handleDecreaseCartQuantity(); }}
                  disabled={isUpdatingCart || !onDecreaseCartQuantity}
                  className="h-8 w-8 text-primary hover:bg-primary/10"
                >
                  {isUpdatingCart ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
                </Button>
                <span aria-live="polite" aria-label={`${cartQuantity} sản phẩm trong giỏ`} className="text-sm font-semibold tabular-nums text-primary">
                  {cartQuantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Tăng số lượng ${product.name} trong giỏ`}
                  onClick={() => { void handleAddToCart(); }}
                  disabled={isUpdatingCart}
                  className="h-8 w-8 text-primary hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => { void handleAddToCart(); }}
                className={`${compact ? 'mt-2 min-h-10 px-2 text-xs sm:text-sm' : 'mt-3'} w-full`}
                size="sm"
                disabled={isUpdatingCart}
                aria-busy={isUpdatingCart}
              >
                {isUpdatingCart ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                {isUpdatingCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
              </Button>
            )
          )}
        </div>
      </div>
    </article>
  );
}
