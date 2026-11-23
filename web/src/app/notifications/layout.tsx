import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông báo',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
