import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // You can use this library to decode JWT tokens

function Greeting() {
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
  }, []); // Empty array ensures this effect runs only once when the component mounts

  return (
    <nav>
      <ul>
        {username ? (
          <h2>Welcome, {username}</h2> // Display username if token is present
        ) : (
          <li>
            <a href="/login">Login</a> {/* Show login link if no token */}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Greeting;
