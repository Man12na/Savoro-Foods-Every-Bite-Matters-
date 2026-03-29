import './Category.css'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../Redux/Slice/categorySlice";
//import FoodCard from './Foodcard';
//import FoodData from '../assets/Fooddata.js'

function CategoryMenu(){
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category);

  useEffect(() => {
  if (categories.status === "idle") {
    dispatch(fetchCategories());
  }
}, [categories.status, dispatch]);


  if (categories.status === "loading") return <p>Loading...</p>;
  if (categories.status === "failed") return <p>Failed to load categories</p>;
  if (!categories.list.length) return <p>No category available</p>;
  console.log(categories.list)
  console.log("categories")
  return(
    <div className="categoryMenu">
    <h2>Find the best food</h2>
    <div className="category">
    {categories.list.map((category) => {
    console.log(category.name); // ✅ this will log each name
    return (
    <button key={category.id}>{category.name}</button>
  );
  })}
    </div>
    </div>
   
    )
}
export default CategoryMenu;

