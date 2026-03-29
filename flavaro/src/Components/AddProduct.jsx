import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchCategories } from "../Redux/Slice/categorySlice";
import { addProduct } from "../Redux/Slice/productSlice";

import "./AddProduct.css";

function AddProduct() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.category);

  const [product, setProduct] = useState({
    title: "",
    slug: "",
    price: "",
    description: "",
    stock: "",
    category: "",
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  console.log("Selected images:", files); // debug
  setImages(files);
};

  const handleSubmit = async () => {
  try {
    const formData = new FormData();

    formData.append("title", product.title);
    formData.append("slug", product.slug);
    formData.append("price", product.price);
    formData.append("description", product.description);
    formData.append("stock", product.stock);
    formData.append("category", product.category);

    images.forEach((img) => {
      formData.append("images_files", img);
    });

    await dispatch(addProduct(formData)).unwrap();

    alert("✅ Product added successfully");
    navigate("/seller-profile");

  } catch (error) {
    console.log(error);
    alert("❌ Failed to add product");
  }
};

  return (
    <div className="product-form-container">

      <h2>Add Product</h2>

      <input
        name="title"
        placeholder="Title"
        value={product.title}
        onChange={handleChange}
      />

      <input
        name="slug"
        placeholder="Slug"
        value={product.slug}
        onChange={handleChange}
      />

      <input
        name="price"
        placeholder="Price"
        type="number"
        value={product.price}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
      />

      <input
        name="stock"
        placeholder="Stock"
        type="number"
        value={product.stock}
        onChange={handleChange}
      />

      {/* CATEGORY DROPDOWN */}

      <select
        name="category"
        value={product.category}
        onChange={handleChange}
      >

        <option value="">Select Category</option>

        {categories.list?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}

      </select>

      {/* IMAGE UPLOAD */}

      <input
        type="file"
        multiple
        onChange={handleImageChange}
      />

      <button onClick={handleSubmit}>
        Save Product
      </button>

      <button onClick={() => navigate("/seller-profile")}>
        Cancel
      </button>

    </div>
  );
}

export default AddProduct;