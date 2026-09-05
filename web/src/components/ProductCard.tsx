'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { Product } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatVnd } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  compact?: boolean;
}

export default function ProductCard({ product, onAddToCart, compact = false }: ProductCardProps) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-border/70 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
      <Link href={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-muted" aria-label={`Xem ${product.name}`}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Package className="h-10 w-10" />
          </div>
        )}
        {product.badge && <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">{product.badge}</Badge>}
      </Link>
      <div className={`flex flex-1 flex-col ${compact ? 'p-3' : 'p-4'}`}>
        {product.category && <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary">{product.category}</p>}
        <Link href={`/products/${product.id}`} className="line-clamp-2 text-sm font-semibold leading-5 hover:text-primary sm:text-base">
          {product.name}
        </Link>
        {!compact && <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">{product.description}</p>}
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-base font-bold text-primary sm:text-lg">{formatVnd(product.price)}</span>
            {product.oldPrice && <span className="text-xs text-muted-foreground line-through">{formatVnd(product.oldPrice)}</span>}
          </div>
          {(product.unit || product.moq) && (
            <p className="mt-1 text-xs text-muted-foreground">
              {product.unit && `Đơn vị: ${product.unit}`}
              {product.unit && product.moq && ' | '}
              {product.moq && `Tối thiểu: ${product.moq}`}
            </p>
          )}
          {onAddToCart && (
            <Button onClick={() => onAddToCart(product)} className="mt-3 w-full" size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Thêm vào giỏ
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
