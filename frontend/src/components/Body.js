import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import SingleCourse from "./SingleCourse";

export default function Body() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.username);
    } else {
      setUsername(null);
    }
  }, []);

  const [courses, seetCourses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/body")
      .then((response) => {
        seetCourses(response.data.data);
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {courses.map((course) => (
          <li key={course[0]}>
            <SingleCourse>{course[1]}</SingleCourse>
          </li>
        ))}
      </ul>
    </div>
  );
}
