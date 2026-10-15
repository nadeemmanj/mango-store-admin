export interface IPromoCode {
  id?: string;                    // Firestore document ID
  code: string;
  discountPercent: number;
  expiresAt: Date | FirebaseFirestore.Timestamp;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date | FirebaseFirestore.Timestamp;
  updatedAt: Date | FirebaseFirestore.Timestamp;
}