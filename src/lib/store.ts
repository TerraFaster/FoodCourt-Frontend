import { create } from 'zustand'

type CartItem = { id: string; name: string; price: number; qty: number }

type Store = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
}

export const useStore = create<Store>((set) => ({
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const exists = state.cart.find((i) => i.id === item.id)
      if (exists) {
        return {
          cart: state.cart.map((i) => (i.id === item.id ? { ...i, qty: i.qty + item.qty } : i)),
        }
      }
      return { cart: [...state.cart, item] }
    }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter((i) => i.id !== id) })),
}))