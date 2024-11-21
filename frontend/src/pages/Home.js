import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Greeting from "../components/Greeting";
import Body from "../components/Body";
import CourseList from "../components/CourseList";

export default function Home() {
  const [userId, setuserId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Decode the token and extract the username
      const decodedToken = jwtDecode(token);
      setuserId(decodedToken.id); // Assuming the username is stored in the token
    } else {
      setuserId(null);
    }
  }, []);
  return (
    <div>
      <Greeting />
      <CourseList userId={userId} />
    </div>
  );
}
