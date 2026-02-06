"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Course } from "../types";
import { useAuth } from "../auth/AuthProvider";
import { api } from "../auth/http";
import {
  fetchMyApprovedEnrollments,
  requestEnrollment,
} from "../enrollments/api";
import {
  addPendingEnrollmentCourseId,
  getPendingEnrollmentCourseIds,
  removePendingEnrollmentCourseId,
} from "../enrollments/pendingStorage";
import { getEnrollmentCourseId } from "../enrollments/normalize";

// Use same-origin API path (Next rewrites `/api/*` -> backend)
const API_BASE = "";

const emptyCourse: Omit<Course, 'id'> = {
  courseCode: '',
  courseName: '',
  credits: 0,
  description: '',
  duration: '',
};

const CourseList: React.FC = () => {
  const { isInitialized, isAuthenticated, user } = useAuth();
  const canManage = user?.role === "ADMIN";
  const isStudent = user?.role === "STUDENT";

  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Omit<Course, 'id'>>(emptyCourse);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Enrollment UX (student)
  const [approvedCourseIds, setApprovedCourseIds] = useState<Set<string>>(new Set());
  const [pendingCourseIds, setPendingCourseIds] = useState<Set<string>>(new Set());
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const shouldFetch = useMemo(() => isInitialized && isAuthenticated, [isInitialized, isAuthenticated]);

  // 🔹 READ
  const fetchCourses = async () => {
    if (!shouldFetch) return;

    setLoading(true);
    try {
      const res = await api.get<Course[]>(`/api/courses`);
      setCourses(res.data ?? []);
    } catch (err) {
      // Avoid `console.error` in dev overlay; keep it as a warning + reset list.
      console.warn("Failed to fetch courses", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [shouldFetch]);

  const fetchEnrollmentStatus = async () => {
    if (!shouldFetch) return;
    if (!isStudent) return;

    // Start with what we already know locally (requested state)
    const pending = new Set(getPendingEnrollmentCourseIds());
    setPendingCourseIds(pending);

    try {
      const approved = await fetchMyApprovedEnrollments();
      const nextApproved = new Set<string>();
      for (const e of approved) {
        const courseId = getEnrollmentCourseId(e);
        if (courseId) nextApproved.add(courseId);
      }
      setApprovedCourseIds(nextApproved);

      // If a course becomes approved, clear its pending flag
      const nextPending = new Set<string>(Array.from(pending));
      for (const id of nextApproved) {
        if (nextPending.has(id)) {
          nextPending.delete(id);
          removePendingEnrollmentCourseId(id);
        }
      }
      setPendingCourseIds(nextPending);
    } catch (err) {
      console.warn("Failed to fetch my enrollments", err);
    }
  };

  useEffect(() => {
    fetchEnrollmentStatus();
  }, [shouldFetch, isStudent]);

  const handleEnroll = async (courseId: string) => {
    if (!isStudent) return;
    if (approvedCourseIds.has(courseId)) return;
    if (pendingCourseIds.has(courseId)) return;

    setEnrollingId(courseId);
    try {
      await requestEnrollment(courseId);
      addPendingEnrollmentCourseId(courseId);
      setPendingCourseIds(new Set([...Array.from(pendingCourseIds), courseId]));
    } catch (err: any) {
      // Duplicate request -> backend returns 409; treat it as already requested.
      const status = err?.response?.status;
      if (status === 409) {
        addPendingEnrollmentCourseId(courseId);
        setPendingCourseIds(new Set([...Array.from(pendingCourseIds), courseId]));
        return;
      }
      alert("Enroll request failed");
      console.warn("Enroll request failed", err);
    } finally {
      setEnrollingId(null);
    }
  };

  // 🔹 CREATE / UPDATE
  const handleSubmit = async () => {
    if (!canManage) return;

    const url = editingId
      ? `${API_BASE}/api/courses/${editingId}`
      : `${API_BASE}/api/courses`;

    const method = editingId ? 'PUT' : 'POST';

    // Use Axios client to ensure Bearer token is attached.
    if (editingId) {
      await api.put(`/api/courses/${editingId}`, form);
    } else {
      await api.post(`/api/courses`, form);
    }

    setForm(emptyCourse);
    setEditingId(null);
    setShowForm(false); // hide form after submit
    fetchCourses();
  };

  // 🔹 EDIT
  const handleEdit = (course: Course) => {
    if (!canManage) return;
    setEditingId(course.id);
    const { id, ...rest } = course;
    setForm(rest);
    setShowForm(true); // show form when editing
  };

  // 🔹 DELETE
  const handleDelete = async (id: string) => {
    if (!canManage) return;
    if (!confirm('Delete this course?')) return;

    await api.delete(`/api/courses/${id}`);

    fetchCourses();
  };

  return (
    <div className="space-y-8">

      {!shouldFetch && <p className="text-sm text-slate-500">Loading...</p>}

      {/* CREATE BUTTON */}
      {canManage && !showForm && (
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyCourse);
          }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          + Create Course
        </button>
      )}

      {/* FORM */}
      {canManage && showForm && (
        <div className="bg-white p-6 rounded-2xl border space-y-4">
          <h2 className="text-xl font-bold">
            {editingId ? 'Update Course' : 'Create Course'}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Course Code"
              value={form.courseCode}
              onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Course Name"
              value={form.courseName}
              onChange={(e) => setForm({ ...form, courseName: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Credits"
              value={form.credits}
              onChange={(e) => setForm({ ...form, credits: Number(e.target.value) })}
              className="border p-2 rounded"
            />
            <input
              placeholder="Duration"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="border p-2 rounded"
            />
          </div>

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded w-full"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              {editingId ? 'Update' : 'Create'}
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-300 px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {loading && <p>Loading...</p>}

        {Array.isArray(courses) && courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border rounded-2xl p-5 space-y-2"
          >
            <h3 className="font-bold text-lg">{course.courseName}</h3>

            <p className="text-sm text-slate-500">
              {course.courseCode} • {course.credits} Credits • {course.duration}
            </p>

            <p className="text-sm">{course.description}</p>

            <div className="flex gap-3 pt-2">
              {isStudent && (
                <>
                  {approvedCourseIds.has(course.id) ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Enrolled
                    </span>
                  ) : pendingCourseIds.has(course.id) ? (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Requested
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={enrollingId === course.id}
                      onClick={() => handleEnroll(course.id)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {enrollingId === course.id ? "Requesting..." : "Enroll"}
                    </button>
                  )}
                </>
              )}

              {canManage && (
                <>
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-600 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="text-red-600 font-semibold"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
