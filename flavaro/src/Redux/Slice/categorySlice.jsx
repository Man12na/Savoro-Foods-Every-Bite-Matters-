import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios";

export const fetchCategories = createAsyncThunk(
  "category/fetch",
  async () => {
    const res = await api.get("/categories/");
    console.log("API response:");
    return res.data;
  }
  );
  

const categorySlice = createSlice({
  name: "categories",
  initialState: {
  list: [],
  status: "idle", // 'loading', 'succeeded', 'failed'
  error: null
  },
  reducers: {},
extraReducers: (builder) => {
  builder
    .addCase(fetchCategories.pending, (state) => {
      state.status = "loading";
    })
    .addCase(fetchCategories.fulfilled, (state, action) => {
      state.list = action.payload.results; // 🔥 FIX HERE
      state.status = "succeeded";
    })
    .addCase(fetchCategories.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
},

});

export default categorySlice.reducer;