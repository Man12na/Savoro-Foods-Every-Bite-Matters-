import { Routes, Route, useLocation } from "react-router-dom";
import './App.css'
import Navbar from "./Components/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import Success from "./Pages/Success.jsx";
import Error from "./Pages/Error.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import CategoryMenu from "./Components/Category-menu.jsx";
import FoodItems from "./Components/Fooditems.jsx";
import FoodCard from "./Components/Foodcard.jsx";
import Orders from "./Components/Orders.jsx";
import Profile from "./Components/Profile.jsx";
import SellerProfile from "./Components/SellerProfile.jsx";
import AddProduct from "./Components/AddProduct.jsx";
import EditProduct from "./Components/EditProduct.jsx";
function App() {

  const location = useLocation();

  // check if login or register page
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div>

      {/* Main website */}
      <div className={isAuthPage ? "blur-background" : ""}>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<CategoryMenu />} />
          <Route path="/products" element={<FoodItems />} />
          <Route path="/products/:id" element={<FoodCard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/seller-profile" element={<SellerProfile />} />
          <Route path="/product/add" element={<AddProduct />} />
          <Route path="/product/edit/:id" element={<EditProduct />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>

      {/* Auth overlays */}
      {location.pathname === "/login" && <Login />}
      {location.pathname === "/register" && <Register />}

    </div>
  );
}

export default App;