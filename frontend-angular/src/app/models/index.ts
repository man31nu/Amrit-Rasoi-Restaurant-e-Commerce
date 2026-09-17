export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isVeg?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  avgRating?: number;
  numReviews?: number;
  reviews?: Review[];
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  items: OrderItem[];
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  salesByDate: Record<string, number>;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt?: string;
}

export interface AppliedCoupon {
  code: string;
  discountPercent: number;
  discountAmount: number;
  finalTotal: number;
  minOrderAmount: number;
}
