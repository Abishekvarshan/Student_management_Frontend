"use client";

import StudentList from "./StudentList";
import StudentProfile from "./StudentProfile";
import { useRequireAuth } from "../auth/useRequireAuth";
import { useAuth } from "../auth/AuthProvider";

const StudentPage = () => {
  useRequireAuth();

  const { user } = useAuth();
  const role = user?.role;

  // Backend summary:
  // - /api/students (list): ADMIN, LECTURE
  // - /api/students/{id} (get/update): ADMIN, LECTURE, STUDENT (self)
  if (role === "STUDENT") {
    return <StudentProfile />;
  }

  if (role === "ADMIN" || role === "LECTURER") {
    return <StudentList />;
  }

  return <p className="text-sm text-slate-500">Loading...</p>;
};

export default StudentPage;