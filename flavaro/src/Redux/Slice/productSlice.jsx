import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (url = "products/", { rejectWithValue }) => {
    try {
      const res = await api.get(url);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Thunk to add a new product
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("products/", formData); // no leading slash
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Thunk to update a product
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`products/${id}/`, formData); // no leading slash
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    list: [],
    status: "idle",
    error: null,
    next: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      
      .addCase(fetchProducts.fulfilled, (state, action) => {
  state.status = "succeeded";

  if (!state.next) {
    state.list = action.payload.results;
  } else {
    const existingIds = new Set(state.list.map((item) => item.id));
    const newProducts = action.payload.results.filter(
      (item) => !existingIds.has(item.id)
    );
    state.list = [...state.list, ...newProducts];
  }

  state.next = action.payload.next
    ? action.payload.next.replace(
        `${import.meta.env.VITE_API_URL}/api/`,
        ""
      )
    : null;
})
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
