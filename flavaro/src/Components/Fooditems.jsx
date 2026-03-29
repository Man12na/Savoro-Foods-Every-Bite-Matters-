import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/Slice/productSlice";
import FoodCard from './Foodcard';

function FoodItems() {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);

  // Fetch products on first load
  
  useEffect(() => {
  if (product.status === "idle") {
    console.log("Dispatching fetchProducts");
    dispatch(fetchProducts());
  }
}, [product.status, dispatch]);
  // Load more products (pagination)
  const loadMore = () => {
    if (product.next) {
      dispatch(fetchProducts(product.next));
    }
  };

  // Handle loading / errors
  if (product.status === "loading") return <p>Loading...</p>;
  if (product.status === "failed") return <p>Failed to load products</p>;
  if (product.status === "succeeded" && !product.list.length)
    return <p>No products available</p>;

  return (
    <div>
      <div
        style={{
          paddingTop: "50px",
          display: "flex",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        {product.list.map((food) => (
          <FoodCard
            key={food.id}
            id={food.id}
            name={food.title}
            price={food.price}
            desc={food.description}
            category={food.category}
            img={
              food.images && food.images.length
                ? `http://127.0.0.1:8000${food.images[0]}`
                : null
            }
            rating={4.5}
          />
        ))}
      </div>

      {/* Load More button */}
      {product.next && (
        <button onClick={loadMore} style={{ marginTop: "20px" }}>
          Load More
        </button>
      )}
    </div>
  );
}

export default FoodItems;