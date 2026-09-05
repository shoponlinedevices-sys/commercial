import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nền tảng CRM | Đơn hàng',
  description: 'Quản lý đơn hàng đơn giản cho đội ngũ vận hành',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
