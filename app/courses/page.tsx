"use client";

import CourseList from "./CourseList";
import { useRequireAuth } from "../auth/useRequireAuth";

const CoursePage = () => {
  useRequireAuth();
  return <CourseList />;
};

export default CoursePage;