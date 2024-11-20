import React, { useState } from "react";
import Login from "../pages/Login";

function LoginPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const onLogin = () => {
    console.log("User logged in!");
    setIsLoggedIn(true); // Example action after login
  };

  return (
    <div>
      {/* Pass the handleLogin function as the onLogin prop */}
      <Login onLogin={onLogin} />

      {/* Optionally, you can show something based on login status */}
      {isLoggedIn && <p>Welcome, user!</p>}
    </div>
  );
}

export default LoginPage;
