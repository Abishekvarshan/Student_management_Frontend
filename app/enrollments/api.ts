"use client";

import { api } from "../auth/http";
import type { Course } from "../types";
import type { AdminPendingEnrollment, StudentEnrollment } from "./types";

/**
 * Courses are still served under `/api/courses` in the existing frontend.
 */
export async function fetchCourses(): Promise<Course[]> {
  const res = await api.get<Course[]>(`/api/courses`);
  return res.data ?? [];
}

/**
 * Student: Request enrollment for a course.
 * Backend: POST /student/enroll/{courseId}
 * Frontend calls /api/student/... so Next rewrites can proxy to backend.
 */
export async function requestEnrollment(courseId: string): Promise<void> {
  await api.post(`/api/student/enroll/${courseId}`);
}

/**
 * Student: Get my approved enrollments.
 * Backend: GET /student/my-enrollments (returns only APPROVED enrollments)
 */
export async function fetchMyApprovedEnrollments(): Promise<any[]> {
  const res = await api.get<any[]>(`/api/student/my-enrollments`);
  return res.data ?? [];
}

/**
 * Admin/Shared: Fetch enrollments for a student.
 * Backend (as per your message): GET /api/enrollments/student/{studentId}
 * NOTE: this is under `/api/*` already, so the existing rewrite works.
 */
export async function fetchEnrollmentsByStudentId(studentId: string): Promise<StudentEnrollment[]> {
  const res = await api.get<StudentEnrollment[]>(`/api/enrollments/student/${studentId}`);
  return res.data ?? [];
}

/**
 * Admin: Get pending enrollment requests.
 * Backend: GET /admin/enrollments/pending
 */
export async function fetchPendingEnrollments(): Promise<AdminPendingEnrollment[]> {
  const res = await api.get<AdminPendingEnrollment[]>(`/api/admin/enrollments/pending`);
  return res.data ?? [];
}

/**
 * Admin: Approve/Reject enrollment request.
 */
export async function approveEnrollment(enrollmentId: string): Promise<void> {
  await api.put(`/api/admin/enrollments/${enrollmentId}/approve`);
}

export async function rejectEnrollment(enrollmentId: string): Promise<void> {
  await api.put(`/api/admin/enrollments/${enrollmentId}/reject`);
}
