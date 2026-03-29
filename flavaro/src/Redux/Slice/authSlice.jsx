import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../axios";

const access = localStorage.getItem("access");
const isSeller = localStorage.getItem("is_seller");

export const login = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/token/", data);

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("is_seller", res.data.is_seller);

      return res.data;
    } catch (err) {
      return rejectWithValue("Incorrect username or password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: access ? { is_seller: isSeller === "true" } : null,
    error: null,
    loading: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("is_seller");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          username: action.payload.username,
          is_seller: action.payload.is_seller,
        };
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;