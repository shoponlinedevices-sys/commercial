import type { Metadata } from 'next';
import { PRODUCTS_BASE_URL } from '@/lib/api-config';
import { getSiteUrl } from '@/lib/site-config';
import type { Product } from '@/types';

type Props = {
  params: { id: string };
  children: React.ReactNode;
};

async function getProduct(id: string): Promise<Product | null> {
  if (!/^\d+$/.test(id)) return null;

  try {
    const baseUrl = PRODUCTS_BASE_URL.replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/products/${encodeURIComponent(id)}`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    return (await response.json()) as Product;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.id);
  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm',
      robots: { index: false, follow: false },
    };
  }

  const canonical = `/products/${product.id}`;
  const description = product.description?.trim()
    || `Mua ${product.name} tại Commercial.`;

  return {
    title: product.name,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      locale: 'vi_VN',
      url: canonical,
      title: product.name,
      description,
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductLayout({ params, children }: Props) {
  const product = await getProduct(params.id);
  const siteUrl = getSiteUrl();

  if (!product) return children;

  const productUrl = `${siteUrl}/products/${product.id}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || undefined,
    sku: product.sku || undefined,
    image: product.image ? [product.image] : undefined,
    url: productUrl,
    category: product.category || undefined,
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'VND',
      price: product.price,
      ...(typeof product.quantityAvailable === 'number'
        ? {
            availability: product.quantityAvailable > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          }
        : {}),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
