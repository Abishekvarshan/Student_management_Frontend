"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Student } from "../types";

type StudentFormInput = {
  id: string;
  name: string;
  age: string;
  email: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const StudentList: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", age: "", email: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<StudentFormInput>({ id: "", name: "", age: "", email: "" });
  const [editError, setEditError] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axios.get<Student[]>(`${API_BASE_URL}/api/students`);

      setStudents(response.data ?? []);
      setError(null);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load students.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleCreateStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!formData.name.trim() || !formData.age.trim() || !formData.email.trim()) {
      setFormError("Please provide a name, age, and email.");
      return;
    }

    const ageValue = Number(formData.age);
    if (Number.isNaN(ageValue) || ageValue <= 0) {
      setFormError("Please enter a valid age.");
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.post(`${API_BASE_URL}/api/students`, {
        name: formData.name.trim(),
        age: ageValue,
        email: formData.email.trim()
      });
      setFormData({ name: "", age: "", email: "" });
      setIsFormOpen(false);
      await fetchStudents();
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "Unable to add student.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (student: Student) => {
    setEditError(null);
    setEditFormData({
      id: student.id,
      name: student.name,
      age: student.age ? String(student.age) : "",
      email: student.email
    });
    setIsEditOpen(true);
  };

  const handleEditStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditError(null);

    if (!editFormData.name.trim() || !editFormData.age.trim() || !editFormData.email.trim()) {
      setEditError("Please provide a name, age, and email.");
      return;
    }

    const ageValue = Number(editFormData.age);
    if (Number.isNaN(ageValue) || ageValue <= 0) {
      setEditError("Please enter a valid age.");
      return;
    }

    try {
      setIsEditSubmitting(true);
      await axios.put(`${API_BASE_URL}/api/students/${editFormData.id}`, {
        name: editFormData.name.trim(),
        age: ageValue,
        email: editFormData.email.trim()
      });
      setIsEditOpen(false);
      await fetchStudents();
    } catch (submitError) {
      setEditError(submitError instanceof Error ? submitError.message : "Unable to update student.");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    setDeleteError(null);

    const confirmDelete = window.confirm(`Delete ${student.name}?`);
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/students/${student.id}`);
      await fetchStudents();
    } catch (deleteError) {
      setDeleteError(deleteError instanceof Error ? deleteError.message : "Unable to delete student.");
    }
  };

  const filteredStudents = useMemo(
    () =>
      students.filter(
        (student) =>
          student.name.toLowerCase().includes(filter.toLowerCase()) ||
          student.major.toLowerCase().includes(filter.toLowerCase())
      ),
    [students, filter]
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-slate-500">Manage and oversee all enrolled students.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700"
        >
          + Add New Student
        </button>
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Add New Student</h3>
                <p className="text-sm text-slate-500">Fill in the details and save.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-full px-3 py-1 text-sm font-semibold text-slate-400 transition-colors hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <form className="mt-4 flex flex-col gap-4" onSubmit={handleCreateStudent}>
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Student name"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Age"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.age}
                  onChange={(event) => setFormData((prev) => ({ ...prev, age: event.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-rose-500">{formError}</div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "Adding..." : "Save Student"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Edit Student</h3>
                <p className="text-sm text-slate-500">Update the student details and save.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-full px-3 py-1 text-sm font-semibold text-slate-400 transition-colors hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <form className="mt-4 flex flex-col gap-4" onSubmit={handleEditStudent}>
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Student name"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={editFormData.name}
                  onChange={(event) => setEditFormData((prev) => ({ ...prev, name: event.target.value }))}
                />
                <input
                  type="number"
                  min="1"
                  placeholder="Age"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={editFormData.age}
                  onChange={(event) => setEditFormData((prev) => ({ ...prev, age: event.target.value }))}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={editFormData.email}
                  onChange={(event) => setEditFormData((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-rose-500">{editError}</div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isEditSubmitting}
                    className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isEditSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4 border-b border-slate-100 p-6">
          <input
            type="text"
            placeholder="Filter students by name or major..."
            className="flex-1 rounded-xl border-none bg-slate-50 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          {deleteError && <p className="text-sm text-rose-500">{deleteError}</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Major</th>
                <th className="px-6 py-4">GPA</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Enrollment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                    Loading students...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-rose-500">
                    {error}
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                    No students match your filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={`https://picsum.photos/seed/${student.id}/40/40`} className="h-10 w-10 rounded-full" alt="" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">{student.major}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{student.gpa}</span>
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${(student.gpa / 4) * 100}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] font-bold uppercase ${
                          student.status === "Active"
                            ? "bg-emerald-50 text-emerald-600"
                            : student.status === "On Leave"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-600"
                        } rounded-full px-2.5 py-1`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="px-2 font-bold text-slate-400 transition-colors hover:text-indigo-600"
                        onClick={() => openEditModal(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 font-bold text-slate-400 transition-colors hover:text-rose-600"
                        onClick={() => handleDeleteStudent(student)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;