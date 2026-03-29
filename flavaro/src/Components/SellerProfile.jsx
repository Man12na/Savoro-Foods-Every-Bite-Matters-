import { useState, useEffect } from "react";
import api from "../Redux/axios.jsx";
import "./SellerProfile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    products: [],
  });

  const [editProfile, setEditProfile] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me/");
        setProfile(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfile();
  }, []);

  // Profile handlers
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async () => {
  try {
    const payload = {
      store_name: profile.store_name,
      phone: profile.phone,
      address: profile.address,
    };

    const res = await api.patch("/users/me/", payload);

    setProfile((prev) => ({
      ...prev,
      ...res.data,
    }));

    setEditProfile(false);

    alert("Profile updated successfully ✅");

  } catch (err) {
    console.log(err.response?.data);
    alert("Failed to update profile ❌");
  }
};



  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}/`);
      setProfile((prev) => ({
        ...prev,
        products: prev.products.filter((p) => p.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <label>Username</label>
        <input value={profile.username} disabled />

        <label>Email</label>
        <input value={profile.email} disabled />

        <label>Store Name</label>
        <input
          value={profile.store_name}
          disabled={!editProfile}
          name="store_name"
          onChange={handleProfileChange}
        />

        <label>Phone</label>
        <input
          value={profile.phone}
          disabled={!editProfile}
          name="phone"
          onChange={handleProfileChange}
        />

        <label>Address</label>
        <input
          value={profile.address}
          disabled={!editProfile}
          name="address"
          onChange={handleProfileChange}
        />

        {editProfile ? (
          <button className="save-btn" onClick={handleProfileSave}>
            Save
          </button>
        ) : (
          <button className="edit-btn" onClick={() => setEditProfile(true)}>
            Edit
          </button>
        )}
      </div>

      <div className="seller-products">
        <div className="header">
          <h2>My Products</h2>
          <button className="add-btn" onClick={() => navigate("/product/add")}>
  + Add Product
</button>
        </div>
        <div className="product-grid">
          {profile.products?.map((product) => (
            <div className="product-card" key={product.id}>
             
              <img
                src={
                  product.images && product.images.length
                    ? `${api}${product.images[0]}`
                    : ""
                }
                alt={product.title}
                width="80"
                height="80"
              />
              <h3>{product.title}</h3>
              <p>Price: ₹{product.price}</p>
              <p>stock: {product.stock}</p>
              <div className="actions">
                <button onClick={() => navigate(`/product/edit/${product.id}`)}>Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
