"use client";

const KEY = "pending_enrollment_course_ids_v1";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids))));
}

export function getPendingEnrollmentCourseIds(): string[] {
  return read();
}

export function addPendingEnrollmentCourseId(courseId: string) {
  const ids = read();
  if (ids.includes(courseId)) return;
  ids.push(courseId);
  write(ids);
}

export function removePendingEnrollmentCourseId(courseId: string) {
  const ids = read().filter((id) => id !== courseId);
  write(ids);
}
