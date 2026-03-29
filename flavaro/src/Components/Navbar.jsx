import './Navbar.css'
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slice/authSlice";
import { clearCart } from "../Redux/Slice/CartSlice";



function Navbar(){

  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const handleLogout = () => {
  dispatch(logout());
  dispatch(clearCart());
   };

  return(
    <nav>
    <div> 
      <h3 className="heading1">{new Date().toUTCString().slice(0,16)}</h3> <h1 className="heading2">Savoro Foods</h1>
      <Link to="/">Home</Link>
      <Link to="/categories">Categories</Link>
      <Link to="/products">Products</Link>
      {/* Only show Orders if user is logged in */}
        {user && <Link to="/orders">Orders</Link>}

      {user && user.is_seller && (
        <Link to="/seller-profile">Seller Profile</Link>
      )}

      {user && !user.is_seller && (
        <Link to="/profile">Profile</Link>
      )}

      {user ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <Link to="/login">Login</Link>
      )}

    </div>
    <div> 
    <input type="search" placeholder= "search hear" autoComplete="off"/> 
    </div>
    </nav>
  )
}

export default Navbar
