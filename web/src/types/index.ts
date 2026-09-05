// Type definitions based on mobile app interfaces

export interface Product {
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
}

export interface AdBanner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: string;
}

export interface NotificationItem {
  id: number;
  userId?: string;
  title: string;
  message: string;
  isRead: boolean;
  type?: string;
  metadata?: Record<string, any>;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserInfo {
  id: number;
  username: string;
  email?: string;
}

export interface CartLine {
  id?: number;
  cartId?: number;
  productId: number;
  quantity: number;
  unitPrice: number | string; // Gateway returns string from database decimal
  totalPrice?: string;
  product?: Product;
  name?: string;
  image?: string;
  status: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Cart {
  id?: number;
  userId?: number;
  totalPrice?: string;
  status?: number;
  createdAt?: Date;
  updatedAt?: Date;
  cartLines?: CartLine[];
}

export interface AddToCart {
  userId: number;
  productId: number;
  quantity: number;
  image?: string;
  cartLines?: CartLine[];
}

export interface OrderLine {
  productId: number;
  quantity: number;
  unitPrice: string;
}

export interface CreateOrder {
  userId: string;
  totalAmount: number;
  orderLines: OrderLine[];
  fcmToken?: string;
  shippingAddress?: string;
  customerEmail?: string;
  customerName?: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  orderLines?: any[];
  shippingAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: UserInfo;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
}
