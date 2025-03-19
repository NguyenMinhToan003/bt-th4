import React, { useEffect, useState } from "react";
import './App.css'

const API_URL = "https://67da2a0635c87309f52b2e5f.mockapi.io/api/v1/user";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState(false);
  const [age, setAge] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from MockAPI
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Create or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      await updateUser(editingUser.id);
    } else {
      await addUser();
    }
  };

  // Add new user
  const addUser = async () => {
    if (!name) return;
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          country, 
          gender, 
          age: parseInt(age) || 0 
        }),
      });
      if (response.ok) {
        fetchUsers();
        resetForm();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Edit user
  const editUser = (user) => {
    setEditingUser(user);
    setName(user.name);
    setCountry(user.country);
    setGender(user.gender);
    setAge(user.age.toString());
  };

  // Update user
  const updateUser = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          country, 
          gender, 
          age: parseInt(age) || 0
        }),
      });
      if (response.ok) {
        fetchUsers();
        resetForm();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setCountry("");
    setGender(false);
    setAge("");
    setEditingUser(null);
  };

  return (
    <div className="container">
      <h1>Nhóm 20 - ca sáng thứ 4</h1>
      
      {/* Form for adding/editing users */}
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>Gender:</label>
            <input
              type="checkbox"
              checked={gender}
              onChange={(e) => setGender(e.target.checked)}
            />
            <span>{gender ? "Male" : "Female"}</span>
          </div>
          
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="0"
            />
          </div>
          
          <div className="button-group">
            <button type="submit" className="primary-button">
              {editingUser ? "Update User" : "Add User"}
            </button>
            {editingUser && (
              <button type="button" className="secondary-button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* User list */}
      <div className="user-list">
        <h2>Users</h2>
        {users.length === 0 ? (
          <p className="empty-message">No users found</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id} className="user-card">
                <div className="user-info">
                  <div className="user-avatar">
                    <div className="avatar-placeholder">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="user-details">
                    <h3>{user.name}</h3>
                    <p>Country: {user.country || "N/A"}</p>
                    <p>Gender: {user.gender ? "Male" : "Female"}</p>
                    <p>Age: {user.age}</p>
                    <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="user-actions">
                  <button className="edit-button" onClick={() => editUser(user)}>
                    ✏️ Edit
                  </button>
                  <button className="delete-button" onClick={() => deleteUser(user.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;