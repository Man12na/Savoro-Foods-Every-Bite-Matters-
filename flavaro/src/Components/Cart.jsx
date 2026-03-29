import { useState } from 'react';
import CartItem from './CartItem';
import { FaCartShopping } from "react-icons/fa6";
import {useSelector} from 'react-redux'
import { useDispatch } from "react-redux";
import { createOrder } from "../Redux/Slice/orderSlice";


function Cart() {
  const dispatch = useDispatch();

  

  const [activeCart, setActiveCart] = useState(false);
  
  const cartItems=useSelector((state)=>state.cart.cart)
  const totalItems = cartItems.reduce(
  (sum, item) => sum + item.qty,
  0
  );
  const totalAmount = cartItems.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
  );

  const handleCheckout = () => {
  if (!cartItems.length) return;
  
  const orderItems = cartItems.map((item) => ({
  product: item.id,
  quantity: item.qty, // 🔥 MUST MATCH DJANGO FIELD
}));


  dispatch(createOrder(orderItems));
  };
  const { lastOrder, loading, error } = useSelector(
  (state) => state.orders
  );
 
  // Define variables or replace them with actual values

  return (
    <>
      <div style={{
        position: "fixed",
        margin: "0px",
        padding: "0px",
        top: "0px",
        right: "0px",
        background: "white",
        height: "100%",
        width: "20%",
        transform: activeCart ? "translateX(0)" : "translateX(100%)"
      }}>
        <div style={{ paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ fontWeight: "500", fontSize: "22px" }}>My Order</h2>
          <button onClick={() => setActiveCart(false)} style={{  height: "25px", margin: "20px 20px 0px 0px", fontSize: "large", borderRadius: "5px" }}>×</button>
        </div>
        {cartItems.map((food, index)=>{
         return <CartItem 
         key={food.id ?? index} 
         id={food.id} name={food.name} 
         price={food.price} 
         img={food.img} 
         qty={food.qty}
         />
        })}
        
      {loading && <p>Placing order...</p>}

      {lastOrder && (
      <>
      <p>Status: {lastOrder.status}</p>
      <p>Total Amount: ₹{lastOrder.total_amount}</p>
      </>
      )}

         {error && <p style={{ color: "red" }}>{error.message}</p>}
        
        <div style={{ position: "absolute", bottom: "10px" }}>
          <h4>Items: {totalItems}</h4>
          <h4>Total Amount: ₹{totalAmount}</h4>
          <button style={{ width: "240px", color: "green", padding: "10px", margin: "10px" }} onClick={handleCheckout} disabled={loading}> {loading ? "Placing Order..." : "Checkout"}
            </button>

        
        </div>
      </div>
      <FaCartShopping style={{ position: "fixed", bottom: "3px", right: "4px", cursor:"pointer" }} onClick={() => setActiveCart(!activeCart)}/>
    
    
   </>

 );
}

export default Cart;


