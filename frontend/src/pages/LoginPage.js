import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Logout from "../components/Logout";
import Login from "./Login";

function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLogin = () => {
    console.log("User logged in!");
    setIsLoggedIn(true); // Example action after login
  };

  const [username, setUsername] = useState(null);

  // Check token on component mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Decode the token and extract the username
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username); // Assuming the username is stored in the token
    } else {
      setUsername(null);
    }
  }, []);

  return (
    <div>
      {username ? (
        <>
          <h1>Welcome, {username}</h1>
          <Logout /> // Display username if token is present
        </> // Display username if token is present
      ) : (
        <Login></Login>
      )}
    </div>
  );
}

export default LoginPage;
