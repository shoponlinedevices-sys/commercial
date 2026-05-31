export type IProduct = {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  badge?: string;
  sku?: string;
  unit?: string;
  moq?: string;
  category?: string;
};

export type AdBanner = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
};

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  unread: boolean;
};