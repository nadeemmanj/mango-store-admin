export interface Product {
  id: string;
  name: string;
  slug?: string;
  image?: string;
  images?: string[];
  origin?: string;
  originFlag?: string;
  price?: number;
  pricePerKg?: number;
  originalPrice?: number;
  discountPercent?: number;
  weightOptions?: string[];
  description?: string;
  inStock?: boolean;
  stock?: number;
  category?: string;
  featured?: boolean;
  unit?: string;
  quantity?: number;
  weight?: string;
  subtotal?: number;
  createdAt?: string;
  tags?: string[];
}

// Alias for compatibility
export type IProduct = Product;

export interface ICartItem {
  productId: string;
  id?: string;
  name: string;
  image: string;
  pricePerKg: number;
  weight: string;
  quantity: number;
  subtotal: number;
}

export interface IAddress {
  id?: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  emirate: string;
  isDefault: boolean;
}

export interface IOrderItem {
  productId: string;
  name: string;
  pricePerKg: number;
  weight: string;
  quantity: number;
  subtotal: number;
}

export interface IOrderTimeline {
  status: string;
  timestamp: string;
  note?: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  userId?: string;
  guestEmail?: string;
  items: IOrderItem[];
  deliveryAddress: IAddress;
  paymentMethod: 'stripe' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripePaymentIntentId?: string;
  status: 'placed' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  timeline: IOrderTimeline[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  promoCode?: string;
  discount?: number;
  createdAt: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
}

export const UAE_EMIRATES = [
  'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman',
  'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain',
];

export const ORDER_STATUSES = [
  { value: 'placed',           label: 'Order Placed',     color: 'blue'   },
  { value: 'confirmed',        label: 'Confirmed',         color: 'yellow' },
  { value: 'packed',           label: 'Packed',            color: 'orange' },
  { value: 'out_for_delivery', label: 'Out for Delivery',  color: 'purple' },
  { value: 'delivered',        label: 'Delivered',         color: 'green'  },
  { value: 'cancelled',        label: 'Cancelled',         color: 'red'    },
];