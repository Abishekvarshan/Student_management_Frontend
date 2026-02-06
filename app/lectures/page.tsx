"use client";



import LecturesList from "./LecturesList";
import { useRequireAuth } from "../auth/useRequireAuth";
import { useRequireRole } from "../auth/useRequireRole";

const LecturerPage = () => {
  useRequireAuth();
  // Backend: /api/lectures is readable by ADMIN & LECTURE
  useRequireRole(["ADMIN", "LECTURER"]);
  return <LecturesList />;
};

export default LecturerPage;