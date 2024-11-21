import React from "react";
function Logout() {
  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  };

  return (
    <button onClick={logout} className="logout-button">
      Logout
    </button>
  );
}

export default Logout;
