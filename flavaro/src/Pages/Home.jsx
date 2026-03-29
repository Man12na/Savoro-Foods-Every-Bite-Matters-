import CategoryMenu from '../Components/Category-menu'
import FoodItems from '../Components/Fooditems'
import Cart from '../Components/Cart.jsx'
//import Orders from '../Components/Orders.jsx'
function Home(){
  return (
    <div style={{position:"relative", padding:"0px", margin:"0px 12px 0px 12px"}}>
      <CategoryMenu/>
      <FoodItems/>
      <Cart/>
    </div>
    )
}
export default Home;