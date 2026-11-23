import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CartProvider } from "@/context/CartContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Footer from "@/components/Footer";
import PresenceTracker from "@/components/PresenceTracker";
import { getSiteUrl, SITE_NAME } from "@/lib/site-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Thiết bị và dụng cụ chất lượng`,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Mua sắm thiết bị, dụng cụ và sản phẩm công nghiệp tại Commercial.",
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Thiết bị và dụng cụ chất lượng`,
    description: "Mua sắm thiết bị, dụng cụ và sản phẩm công nghiệp tại Commercial.",
  },
  twitter: {
    card: 'summary',
  },
  icons: {
    icon: "/logo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <PresenceTracker />
            <CartProvider>
              <NotificationProvider>
                <Suspense fallback={null}>
                  {children}
                  <Footer />
                </Suspense>
              </NotificationProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
