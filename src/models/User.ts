export interface IAddress {
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  emirate: string;
  isDefault: boolean;
}

export interface IUser {
  id?: string;                    // Firestore document ID
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: IAddress[];
  createdAt: Date | FirebaseFirestore.Timestamp;
  updatedAt: Date | FirebaseFirestore.Timestamp;
}