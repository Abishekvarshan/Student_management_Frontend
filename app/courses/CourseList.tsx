'use client';

import React, { useEffect, useState } from 'react';
import { Course } from "../types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const emptyCourse: Omit<Course, 'id'> = {
  courseCode: '',
  courseName: '',
  credits: 0,
  description: '',
  duration: '',
};

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Omit<Course, 'id'>>(emptyCourse);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 READ
  const fetchCourses = async () => {
    setLoading(true);
    const res = await fetch(`${API_BASE}/api/courses`);
    const data = await res.json();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔹 CREATE / UPDATE
  const handleSubmit = async () => {
    const url = editingId
      ? `${API_BASE}/api/courses/${editingId}`
      : `${API_BASE}/api/courses`;

    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm(emptyCourse);
    setEditingId(null);
    fetchCourses();
  };

  // 🔹 EDIT
  const handleEdit = (course: Course) => {
    setEditingId(course.id);
    const { id, ...rest } = course;
    setForm(rest);
  };

  // 🔹 DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course?')) return;

    await fetch(`${API_BASE}/api/courses/${id}`, {
      method: 'DELETE',
    });

    fetchCourses();
  };

  return (
    <div className="space-y-8">
      {/* FORM */}
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

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          {editingId ? 'Update' : 'Create'}
        </button>
      </div>

      {/* LIST */}
      <div className="grid md:grid-cols-2 gap-6">
        {loading && <p>Loading...</p>}

        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border rounded-2xl p-5 space-y-2"
          >
            <h3 className="font-bold text-lg">
              {course.courseName}
            </h3>

            <p className="text-sm text-slate-500">
              {course.courseCode} • {course.credits} Credits • {course.duration}
            </p>

            <p className="text-sm">{course.description}</p>

            <div className="flex gap-3 pt-2">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
