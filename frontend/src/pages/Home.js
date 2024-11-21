import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import CourseList from "../components/CourseList";
import { Link } from "react-router-dom";

export default function Home() {
  const [userId, setuserId] = useState(null);
  const [userName, setuserName] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Decode the token and extract the username
      const decodedToken = jwtDecode(token);
      setuserId(decodedToken.id);
      setuserName(decodedToken.username); // Assuming the username is stored in the token
    } else {
      setuserId(null);
    }
  }, []);
  return (
    <div>
      {userName ? (
        <>
          <h2>Welcome, {userName}!</h2>
          <Link to="/login" className="main-page-link">
            Go to profile.
          </Link>
          <CourseList userId={userId} />
        </>
      ) : (
        <h2>
          Welcome, please{" "}
          <Link to="/login" className="main-page-link">
            Login
          </Link>
        </h2>
      )}
    </div>
  );
}
