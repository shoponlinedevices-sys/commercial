import type { MetadataRoute } from 'next';
import { GATEWAY_URL } from '@/lib/api-config';
import { getSiteUrl } from '@/lib/site-config';

export const revalidate = 3600;

type ProductListResponse = {
  products?: Array<{
    id: number;
  }>;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  try {
    const gatewayUrl = GATEWAY_URL.replace(/\/+$/, '');
    const response = await fetch(`${gatewayUrl}/products`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      console.error(`Sitemap product fetch failed: ${response.status} ${response.statusText}`);
      return entries;
    }

    const data = (await response.json()) as ProductListResponse;
    for (const product of data.products || []) {
      if (!Number.isInteger(product.id) || product.id <= 0) continue;
      entries.push({
        url: `${siteUrl}/products/${product.id}`,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error('Sitemap product fetch failed:', error);
  }

  return entries;
}
