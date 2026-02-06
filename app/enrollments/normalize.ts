import type { Course } from "../types";

/**
 * Extract course id from various possible backend enrollment response shapes.
 * We intentionally keep this flexible because the exact DTO isn't shared.
 */
export function getEnrollmentCourseId(enrollment: any): string | null {
  if (!enrollment) return null;

  // common: { courseId: "..." }
  if (typeof enrollment.courseId === "string") return enrollment.courseId;

  // common JPA DTO: { course: { id: "..." } }
  const nestedId = enrollment?.course?.id;
  if (typeof nestedId === "string") return nestedId;

  // sometimes: { course: { courseId: "..." } }
  const nestedAlt = enrollment?.course?.courseId;
  if (typeof nestedAlt === "string") return nestedAlt;

  return null;
}

export function getCourseId(course: Course): string {
  return course.id;
}
