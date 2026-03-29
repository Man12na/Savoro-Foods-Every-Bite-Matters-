import {configureStore} from "@reduxjs/toolkit"
import cartSlice from "./Slice/CartSlice"
import authReducer from "./Slice/authSlice";
import productReducer from "./Slice/productSlice";
import categoryReducer from "./Slice/categorySlice";
import orderReducer from "./Slice/orderSlice";
 const Store=configureStore({
   reducer:{
     cart:cartSlice,
     auth: authReducer,
     product: productReducer,
     category: categoryReducer,
     orders:orderReducer,
   },
 });
 export default Store;
 

