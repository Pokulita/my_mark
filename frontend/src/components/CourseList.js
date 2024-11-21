import React, { useEffect, useState } from "react";
import axios from "axios";

const CourseList = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState({});
  console.log(userId);
  useEffect(() => {
    if (userId != null && userId !== "") {
      axios
        .get(`http://localhost:5000/courses?user_id=${userId}`)
        .then((response) => {
          setCourses(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [userId]);

  const handlePass = (userId, courseId) => {
    axios
      .post("http://localhost:5000/mark_course_passed", {
        user_id: userId,
        course_id: courseId,
      })
      .then((response) => {
        console.log(response.data.message);
        window.location.reload(false);
      })
      .catch(
        (error) => {
          console.error("Error arking a course passed.");
        },
        [userId]
      );
  };

  return (
    <div>
      <h2>Courses</h2>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.name}</td>
            <td>{course.ects}</td>
            <td>{course.passed ? "Passed" : "Not Passed"}</td>
            <td>
              <button onClick={() => handlePass(userId, course.id)}>
                {course.passed ? "Unmark Passed" : "Mark as Passed"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </div>
  );
};

export default CourseList;
