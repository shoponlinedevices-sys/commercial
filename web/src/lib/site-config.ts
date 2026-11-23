export const SITE_NAME = 'Commercial';

function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '');
}

export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://thegioithietbi.online';

  try {
    const url = new URL(configuredUrl);
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      throw new Error('NEXT_PUBLIC_APP_URL must use HTTPS in production.');
    }
    return normalizeUrl(url.toString());
  } catch {
    throw new Error('NEXT_PUBLIC_APP_URL must be a valid absolute URL.');
  }
}
