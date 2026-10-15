export interface IOrderItem {
  productId: string;              // Firestore product document ID
  name: string;
  pricePerKg: number;
  weight: string;
  quantity: number;
  subtotal: number;
}

export interface IDeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  emirate: string;
  notes?: string;
}

export interface ITimelineEntry {
  status: string;
  timestamp: Date | FirebaseFirestore.Timestamp;
  note?: string;
}

export interface IOrder {
  id?: string;                    // Firestore document ID
  orderNumber: string;
  userId?: string;                // Firestore user document ID
  guestEmail?: string;
  items: IOrderItem[];
  deliveryAddress: IDeliveryAddress;
  paymentMethod: 'stripe' | 'cod';
  paymentStatus: 'pending' | 'paid' | 'failed';
  stripePaymentIntentId?: string;
  status: 'placed' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  timeline: ITimelineEntry[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  promoCode?: string;
  discount?: number;
  createdAt: Date | FirebaseFirestore.Timestamp;
}