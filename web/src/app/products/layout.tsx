import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Khám phá thiết bị, dụng cụ và sản phẩm công nghiệp tại Commercial.',
  alternates: {
    canonical: '/products',
  },
};

export default function ProductsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
