import React, { useState } from "react";
import "./Register.css";
import api from "../Redux/axios.jsx";

function Register() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    is_seller: false,
    store_name: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  let payload = { ...formData };

  if (!payload.is_seller) {
    delete payload.store_name;
  }

  try {
    const response = await api.post("/api/auth/register/", payload);

    alert("Registration successful!");
    console.log(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    alert(JSON.stringify(error.response?.data));
  }
};
  return (
    <div className="register-container">

      <form className="register-form" onSubmit={handleSubmit}>

        <h2>Create Account</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          onChange={handleChange}
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
          />

          <textarea
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
          />
            
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <label className="seller-check">
          <input
            type="checkbox"
            name="is_seller"
            checked={formData.is_seller}
            onChange={handleChange}
          />
          Register as Seller
        </label>

        {/* Seller Fields */}
        {formData.is_seller && (
          <div className="seller-fields">

            <input
              type="text"
              name="store_name"
              placeholder="Store Name"
              onChange={handleChange}
              required
            />


            <textarea
              name="store_address"
              placeholder="Store Address"
              onChange={handleChange}
              required
            />

          </div>
        )}

        <button type="submit">Register</button>

      </form>

    </div>
  );
}

export default Register;