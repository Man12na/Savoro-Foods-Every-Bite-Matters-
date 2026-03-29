import './Foodcard.css'
import { FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart as cartAddToCart } from '../Redux/Slice/CartSlice';

function FoodCard({ id, img, name, price, category, desc, rating }) {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleAddToCart = () => {

    if (!user) {
      alert("Login required to add items to cart");
      return;
    }

    dispatch(cartAddToCart({ id, name, price, rating, img, qty: 1 }));
  };

  return (
    <div className="FoodCard">
      <img src={img} alt="" width="220" height="150"/>

      <div className="cardDetails">
        <h2>{name}</h2>
        <span style={{ color:"rgb(8,190,10)", paddingTop:"10px"}}>₹{price}</span>
      </div>

      <p>{desc}</p>

      <div className="cardRating" style={{ marginTop: '0px' }}>
        <span>
          <FaStar style={{color:"#EBD007"}} /> {rating}
        </span>

        <button
          style={{
            background:"rgb(8,190,10)",
            border:"none",
            borderRadius:"8px",
            fontSize:"16px",
            height:"25px",
            color:"white"
          }}
          onClick={handleAddToCart}
        >
          add to cart
        </button>
      </div>
    </div>
  )
}

export default FoodCard;