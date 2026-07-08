import { create } from 'zustand';
import { cartApi } from '../api/cart';
import type { Cart } from '../api/cart';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isOpen: boolean;
  
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,
  error: null,
  isOpen: false,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const cart = await cartApi.getCart();
      set({ cart, loading: false });
    } catch (err: any) {
      set({ error: 'Failed to load cart', loading: false });
    }
  },

  addItem: async (productId: string, quantity: number) => {
    try {
      // We wait for the server response because we need the full product details 
      // which the server returns in the Cart object. Optimistic update is tricky here 
      // without duplicating the product database on the client.
      const updatedCart = await cartApi.addItem({ productId, quantity });
      set({ cart: updatedCart });
    } catch (err: any) {
      set({ error: 'Failed to add item to cart' });
      throw err;
    }
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    const previousCart = get().cart;
    if (!previousCart) return;

    // Optimistic Update
    const optimisticCart = {
      ...previousCart,
      items: previousCart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    };
    // Recalculate total
    optimisticCart.totalAmount = optimisticCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    set({ cart: optimisticCart });

    try {
      const serverCart = await cartApi.updateQuantity(itemId, quantity);
      set({ cart: serverCart }); // Sync with truth
    } catch (err: any) {
      // Revert on failure
      set({ cart: previousCart, error: 'Failed to update quantity' });
    }
  },

  removeItem: async (itemId: string) => {
    const previousCart = get().cart;
    if (!previousCart) return;

    // Optimistic Update
    const optimisticCart = {
      ...previousCart,
      items: previousCart.items.filter(item => item.id !== itemId)
    };
    optimisticCart.totalAmount = optimisticCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    set({ cart: optimisticCart });

    try {
      const serverCart = await cartApi.removeItem(itemId);
      set({ cart: serverCart });
    } catch (err: any) {
      set({ cart: previousCart, error: 'Failed to remove item' });
    }
  },
  
  clearCart: () => set({ cart: null }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
