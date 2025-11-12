import { create } from "zustand";

export const useCartStore = create((set, get) => ({
    cartItems: [],

    addToCart: (item) => set((state) => {
        const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            return {
                cartItems: state.cartItems.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            };
        }
        return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
    }),

    removeFromCart: (itemId) => set((state) => ({
        cartItems: state.cartItems.filter(cartItem => cartItem.id !== itemId)
    })),

    updateQuantity: (itemId, quantity) => set((state) => {
        let updatedCart = state.cartItems.map(cartItem =>
            cartItem.id === itemId
                ? { ...cartItem, quantity }
                : cartItem
        );

        // Remove items with quantity <= 0
        updatedCart = updatedCart.filter(cartItem => cartItem.quantity > 0);

        return { cartItems: updatedCart };
    }),

    clearCart: () => set({ cartItems: [] }),

    getTotalPrice: () => {
        return get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}));