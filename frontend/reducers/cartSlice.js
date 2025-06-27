import { createSlice } from "@reduxjs/toolkit";

const CartSlice = createSlice({
  name: "Cart",
  initialState: {
    data: [],
    total: 0,
  },
  reducers: {
    dbToCart(currentState, { payload }) {
      if (payload && payload.data) {
        currentState.data = payload.data;
        currentState.total = payload.total;
      } else {
        console.error("Invalid payload structure:", payload);
      }
    },

    addToCart(currentState, { payload }) {
      const d = currentState.data.find(cart => cart.pId === payload.pId);
      if (d) {
        d.qty++;
      } else {
        currentState.data.push(payload);
      }
      currentState.total += payload.price;
    },

    removeFromCart(currentState, { payload }) {
      const newState = currentState.data.filter(
        (d) => d.pId !== payload.pId
      );
      currentState.data = newState;
      currentState.total -= parseFloat(payload.total_price);
    },

    changeCartQty(currentState, { payload }) {
      const d = currentState.data.find(d => d.pId === payload.pId);
      if (d) {
        if (payload.flag) {
          d.qty++;
          currentState.total += parseFloat(payload.price);
        } else {
          d.qty--;
          currentState.total -= parseFloat(payload.price);
        }
      }
    },

    // For React Native, lsToCart and emptyCart just reset state
    lsToCart(currentState) {
      // No-op or implement with redux-persist if needed
    },

    emptyCart(currentState) {
      currentState.data = [];
      currentState.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, dbToCart, changeCartQty, lsToCart, emptyCart } = CartSlice.actions;
export default CartSlice.reducer;