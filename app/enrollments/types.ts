export type EnrollmentStatus = "REQUESTED" | "APPROVED" | "REJECTED";

export type StudentEnrollment = {
  id: string;
  status: EnrollmentStatus;
  enrollmentDate?: string;
  approvedAt?: string;
  // common shapes
  studentId?: string;
  student?: { id?: string; name?: string; username?: string; email?: string };
  courseId?: string;
  course?: { id?: string; courseName?: string; name?: string; courseCode?: string };
  courseName?: string;
  [key: string]: any;
};

export type AdminPendingEnrollment = {
  id: string;
  studentId?: string;
  studentName?: string;
  courseId?: string;
  courseName?: string;
  requestedAt?: string;
  // Backend might send `createdAt` / `enrolledAt` / `requestedDate` etc.
  [key: string]: any;
};
