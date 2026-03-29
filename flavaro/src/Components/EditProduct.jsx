import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { updateProduct } from "../Redux/Slice/productSlice";
import { fetchCategories } from "../Redux/Slice/categorySlice";

import "./AddProduct.css";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const products = useSelector((state) => state.product.list);
  const categories = useSelector((state) => state.category.list);

  const productData = products.find((p) => p.id === Number(id));

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

    if (productData) {
      setProduct({
        title: productData.title || "",
        slug: productData.slug || "",
        price: productData.price || "",
        description: productData.description || "",
        stock: productData.stock || "",
        category: productData.category || "",
      });
    }
  }, [dispatch, productData]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
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

      await dispatch(updateProduct({ id, formData })).unwrap();

      alert("✅ Product updated successfully");

      navigate("/seller-profile");

    } catch (err) {
      console.log(err);
      alert("❌ Failed to update product");
    }
  };

  return (
    <div className="product-form-container">

      <h2>Edit Product</h2>

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
        type="number"
        placeholder="Price"
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
        type="number"
        placeholder="Stock"
        value={product.stock}
        onChange={handleChange}
      />

      <select
        name="category"
        value={product.category}
        onChange={handleChange}
      >

        <option value="">Select Category</option>

        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}

      </select>

      {/* Upload new images */}

      <input
        type="file"
        multiple
        onChange={handleImageChange}
      />

      <button onClick={handleSubmit}>
        Update Product
      </button>

      <button onClick={() => navigate("/seller-profile")}>
        Cancel
      </button>

    </div>
  );
}

export default EditProduct;