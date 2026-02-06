"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Student } from "../types";
import { api } from "../auth/http";
import { useAuth } from "../auth/AuthProvider";

type EditableStudentFields = {
  name: string;
  age: string;
  email: string;
};

const StudentProfile: React.FC = () => {
  const { user, isInitialized, isAuthenticated, logout } = useAuth();

  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<EditableStudentFields>({ name: "", age: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  const canEdit = useMemo(() => user?.role === "STUDENT", [user?.role]);
  const shouldFetch = useMemo(
    () => isInitialized && isAuthenticated && user?.role === "STUDENT",
    [isAuthenticated, isInitialized, user?.role]
  );

  const loadProfile = async () => {
    if (!shouldFetch) return;

    try {
      setIsLoading(true);
      // Backend: GET /api/students/me (requires Bearer token)
      const res = await api.get<Student>(`/api/students/me`);
      const data = res.data;
      setStudent(data);
      setForm({
        name: data?.name ?? "",
        age: data?.age ? String(data.age) : "",
        email: data?.email ?? "",
      });
      setIsEditing(false);
      setError(null);
    } catch (e: any) {
      const status = e?.response?.status;

      // If token is missing/expired, backend will return 401/403.
      if (status === 401 || status === 403) {
        setError("Your session has expired or you are not authorized. Please login again.");
        // Clear any stale tokens so the user can login cleanly.
        logout();
        return;
      }

      if (status === 404) {
        setError("Profile endpoint not found (404). Please confirm backend has GET /api/students/me.");
        return;
      }

      setError(e instanceof Error ? e.message : "Unable to load profile.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canEdit) {
      setError("Only STUDENT can edit their own profile.");
      return;
    }

    if (!form.name.trim() || !form.email.trim() || !form.age.trim()) {
      setError("Please provide name, age and email.");
      return;
    }

    const ageValue = Number(form.age);
    if (Number.isNaN(ageValue) || ageValue <= 0) {
      setError("Please enter a valid age.");
      return;
    }

    try {
      setIsSaving(true);
      // Backend earlier note: PUT /api/students/{id} (STUDENT can update self)
      if (!student?.id) {
        throw new Error("Missing student id.");
      }

      await api.put(`/api/students/${student.id}`, {
        name: form.name.trim(),
        age: ageValue,
        email: form.email.trim(),
      });
      await loadProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading profile...</p>;
  }

  if (error) {
    return <p className="text-sm text-rose-600">{error}</p>;
  }

  if (!student) {
    return <p className="text-sm text-slate-500">Profile not found.</p>;
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
        <p className="text-slate-500">View and update your student profile.</p>
      </div>

      {/* Summary box */}
      {!isEditing && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{student.name}</h3>
              <p className="text-sm text-slate-500">{student.email}</p>
              <p className="mt-2 text-sm text-slate-600">
                <span className="font-semibold">Age:</span> {student.age}
              </p>
            </div>

            {canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}

      {/* Edit form (shown after clicking Edit Profile) */}
      {isEditing && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
            <button
              type="button"
              onClick={() => {
                // reset changes
                setForm({
                  name: student.name ?? "",
                  age: student.age ? String(student.age) : "",
                  email: student.email ?? "",
                });
                setIsEditing(false);
              }}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300"
            >
              Cancel
            </button>
          </div>

          <form className="grid gap-4 md:grid-cols-2" onSubmit={onSave}>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Age</label>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.age}
                onChange={(e) => setForm((prev) => ({ ...prev, age: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
