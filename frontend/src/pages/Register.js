import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  // Step 1: Initialize state to store user inputs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    form: "",
  });

  // Step 2: Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Step 3: Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      form: "",
    });

    // Send the data to your backend API (e.g., using fetch or axios)
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful
        alert("Registration successful!");
        navigate("/login");
      } else {
        // Handle backend error (e.g., email already exists)
        setErrors({ ...errors, form: data.message || "Registration failed!" });
        alert(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors({ ...errors, form: "Error during registration" });
      alert("Error during registration");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="login-container">
        <div>
          <input
            className="login-email"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {errors.username && <span>{errors.username}</span>}
        </div>

        <div>
          <input
            className="login-email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          {errors.email && <span>{errors.email}</span>}
        </div>

        <div>
          <input
            className="login-email"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <span>{errors.password}</span>}
        </div>

        <div>
          <input
            className="login-email"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
        </div>

        <button classname="login-button" type="submit">
          Register
        </button>

        {errors.form && <p>{errors.form}</p>}
      </form>
    </div>
  );
}

export default Register;
