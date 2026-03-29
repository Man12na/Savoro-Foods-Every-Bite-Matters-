import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios";

/* CREATE ORDER */
export const createOrder = createAsyncThunk(
  "orders/create",
  async (items, { rejectWithValue }) => {
    try {
      const res = await api.post("/orders/", { items });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* GET ORDERS */
export const getOrders = createAsyncThunk(
  "orders/getOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders/");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* CANCEL ORDER (Customer) */
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/orders/${orderId}/cancel/`);
      return { id: orderId, status: res.data.status };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

/* COMPLETE ORDER (Seller) */
export const completeOrder = createAsyncThunk(
  "orders/completeOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/orders/${orderId}/mark_complete/`);
      return { id: orderId, status: res.data.status };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    lastOrder: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* CREATE ORDER */
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* GET ORDERS */
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.results || action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CANCEL ORDER */
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.orders.find(o => o.id === action.payload.id);
        if (order) {
          order.status = action.payload.status;
        }
      })

      /* COMPLETE ORDER */
      .addCase(completeOrder.fulfilled, (state, action) => {
        const order = state.orders.find(o => o.id === action.payload.id);
        if (order) {
          order.status = action.payload.status;
        }
      });
  },
});

export default orderSlice.reducer;