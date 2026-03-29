import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: []
  },
  reducers: {

    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cart.find(
        (food) => food.id === item.id
      );

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.cart.push({ ...item, qty: 1 });
      }
    },

    incrementQty: (state, action) => {
      const item = state.cart.find(
        (food) => food.id === action.payload
      );
      if (item) {
        item.qty += 1;
      }
    },

    decrementQty: (state, action) => {
      const item = state.cart.find(
        (food) => food.id === action.payload
      );
      if (item && item.qty > 1) {
        item.qty -= 1;
      }
    },

    removeItem: (state, action) => {
      state.cart = state.cart.filter(
        (food) => food.id !== action.payload
      );
    },

    // ⭐ NEW REDUCER
    clearCart: (state) => {
      state.cart = [];
    }

  },
});

export const {
  addToCart,
  incrementQty,
  decrementQty,
  removeItem,
  clearCart   // ⭐ export this
} = cartSlice.actions;

export default cartSlice.reducer;