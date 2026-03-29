import { MdDeleteForever } from "react-icons/md";
import { AiOutlinePlus , AiOutlineMinus} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { incrementQty, decrementQty, removeItem } from "../Redux/Slice/CartSlice";
function CartItem({id, name, price, img, qty}){
  console.log(id,"%%%%%%%")
  const dispatch = useDispatch();
  return(
    
    <div style={{display:"flex", gap:"10px"}}>
      <img src= {img} height="50" width="50"/>
      <div>
        
        <div style={{display: "flex", justifyContent:"space-between"}}>
        <h3 style={{margin:"0px"}}>{name}</h3>
        <MdDeleteForever
            style={{ cursor: "pointer" }}
            onClick={() => dispatch(removeItem(id))}
          />
         </div>
       
      <div style={{display:"flex"}}>
        <span>{price}</span>
        <div style={{display:"flex"}}>
          <AiOutlineMinus style={{height:"15px", borderRadius:"5px", borderStyle:"solid", cursor: "pointer"}}
            onClick={() => dispatch(decrementQty(id))}
          />
          
          <span>{qty}</span>
          <AiOutlinePlus style={{height:"15px", borderRadius:"5px", borderStyle:"solid",cursor: "pointer"}}
            onClick={() => dispatch(incrementQty(id))}
          />
        </div>
      </div>
      </div>
    </div>)
}
export default CartItem;