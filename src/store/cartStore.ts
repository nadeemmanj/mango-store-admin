import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types';

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  image: string;
  price: number;
  pricePerKg: number;
  weight: string;
  quantity: number;
  subtotal: number;
  originFlag?: string;
  origin?: string;
  unit?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product: any) => {
        set((state) => {
          const id = String(product.id || product.productId || '');
          const price = Number(product.price ?? product.pricePerKg ?? 0);
          const existing = state.items.find(i => i.id === id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === id
                  ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.price }
                  : i
              ),
              isOpen: true,
            };
          }
          const newItem: CartItem = {
            id: id,
            productId: id,
            name: product.name || '',
            image: product.image || product.images?.[0] || '',
            price,
            pricePerKg: price,
            weight: product.weight || product.weightOptions?.[0] || '1kg',
            quantity: 1,
            subtotal: price,
            originFlag: product.originFlag,
            origin: product.origin,
            unit: product.unit || 'kg',
          };
          return { items: [...state.items, newItem], isOpen: true };
        });
      },

      removeItem: (id: string) => {
        set(state => ({ items: state.items.filter(i => i.id !== id) }));
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set(state => ({
          items: state.items.map(i =>
            i.id === id
              ? { ...i, quantity, subtotal: quantity * i.price }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.subtotal, 0),
    }),
    { name: 'aan-al-khair-cart' }
  )
);