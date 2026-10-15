export interface IProduct {
  id?: string;                    // Firestore document ID (auto-generated)
  name: string;
  slug: string;
  image: string;
  images: string[];
  origin: string;
  originFlag: string;
  price: number;
  pricePerKg: number;
  originalPrice?: number;
  discountPercent?: number;
  weightOptions: string[];
  description: string;
  stock: number;
  inStock: boolean;
  unit: string;
  category: string;
  tags?: string[];
  featured: boolean;
  badge?: string;
  variants?: { label: string; unit: string; price: number }[];
  createdAt: Date | FirebaseFirestore.Timestamp;
  updatedAt: Date | FirebaseFirestore.Timestamp;
}