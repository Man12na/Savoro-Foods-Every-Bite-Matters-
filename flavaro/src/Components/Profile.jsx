import { useState, useEffect } from "react";
import api from "../Redux/axios.jsx";
import "./Profile.css";

function Profile() {

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    address: ""
  });

  const [edit, setEdit] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me/");
        setProfile(res.data);
      } catch (err) {
        setMessage("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {

      const res = await api.patch("/users/me/", {
        address: profile.address
      });

      setProfile(res.data);
      setEdit(false);
      setMessage("Profile updated successfully ✅");

    } catch (err) {

      if (err.response) {
        setMessage("Update failed: " + JSON.stringify(err.response.data));
      } else {
        setMessage("Server error. Try again later.");
      }

    }
  };

  return (
    <div className="profile-container">

      <h2>User Profile</h2>

      {message && <p className="profile-message">{message}</p>}

      <div className="profile-card">

        <label>Username</label>
        <input value={profile.username} disabled />

        <label>Email</label>
        <input value={profile.email} disabled />

        <label>Address</label>
        <input
          name="address"
          value={profile.address}
          disabled={!edit}
          onChange={handleChange}
        />

        {edit ? (
          <button className="save-btn" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-btn" onClick={() => setEdit(true)}>Edit</button>
        )}

      </div>
    </div>
  );
}

export default Profile;