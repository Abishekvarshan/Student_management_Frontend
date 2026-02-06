"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Course } from "../types";
import { api } from "../auth/http";
import { useAuth } from "../auth/AuthProvider";

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

  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Omit<Course, 'id'>>(emptyCourse);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
