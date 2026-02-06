"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { Lecture } from "../types";
import { api } from "../auth/http";
import { useAuth } from "../auth/AuthProvider";

type LectureInput = Omit<Lecture, "id">;

const emptyLecture: LectureInput = {
  name: "",
  department: "",
  rating: 0,
  subjects: [],
  codes: [],
  contact: "",
};

function splitCsv(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toCsv(values: string[]): string {
  return values.join(", ");
}

const LecturesList: React.FC = () => {
  const { user } = useAuth();
  const canManage = user?.role === "ADMIN";

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LectureInput>(emptyLecture);
  const [subjectsCsv, setSubjectsCsv] = useState("");
  const [codesCsv, setCodesCsv] = useState("");

  const formTitle = useMemo(() => (editingId ? "Update Lecture" : "Create Lecture"), [editingId]);

  const fetchLectures = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<Lecture[]>(`/api/lectures`);
      setLectures(res.data ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load lectures.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyLecture);
    setSubjectsCsv("");
    setCodesCsv("");
    setIsFormOpen(true);
  };

  const openEdit = (lecture: Lecture) => {
    setEditingId(lecture.id);
    const { id, ...rest } = lecture;
    setForm(rest);
    setSubjectsCsv(toCsv(lecture.subjects ?? []));
    setCodesCsv(toCsv(lecture.codes ?? []));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyLecture);
    setSubjectsCsv("");
    setCodesCsv("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canManage) {
      setError("Only ADMIN can create/update/delete lectures.");
      return;
    }

    if (!form.name.trim() || !form.department.trim()) {
      setError("Please provide name and department.");
      return;
    }

    const payload: LectureInput = {
      ...form,
      name: form.name.trim(),
      department: form.department.trim(),
      contact: form.contact.trim(),
      rating: Number(form.rating) || 0,
      subjects: splitCsv(subjectsCsv),
      codes: splitCsv(codesCsv),
    };

    try {
      setIsSubmitting(true);
      if (editingId) {
        await api.put(`/api/lectures/${editingId}`, payload);
      } else {
        await api.post(`/api/lectures`, payload);
      }
      closeForm();
      await fetchLectures();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save lecture.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (lecture: Lecture) => {
    if (!canManage) {
      setError("Only ADMIN can delete lectures.");
      return;
    }

    const ok = window.confirm(`Delete lecture '${lecture.name}'?`);
    if (!ok) return;

    try {
      await api.delete(`/api/lectures/${lecture.id}`);
      await fetchLectures();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to delete lecture.");
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lectures</h2>
          <p className="text-slate-500">Manage lecture staff & their subjects (RBAC enforced).</p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={openCreate}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
          >
            + Create Lecture
          </button>
        )}
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{formTitle}</h3>
                <p className="text-sm text-slate-500">Subjects and codes are comma-separated.</p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-full px-3 py-1 text-sm font-semibold text-slate-400 transition-colors hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <form className="mt-4 flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <input
                  type="text"
                  placeholder="Department"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={form.department}
                  onChange={(e) => setForm((prev) => ({ ...prev, department: e.target.value }))}
                />
                <input
                  type="number"
                  min={0}
                  step={0.1}
                  placeholder="Rating"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={String(form.rating)}
                  onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                />
                <input
                  type="text"
                  placeholder="Contact"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={form.contact}
                  onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Subjects (comma separated)"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={subjectsCsv}
                  onChange={(e) => setSubjectsCsv(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Codes (comma separated)"
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={codesCsv}
                  onChange={(e) => setCodesCsv(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading lectures...</p>
        ) : lectures.length === 0 ? (
          <p className="text-sm text-slate-500">No lectures found.</p>
        ) : (
          lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {lecture.name}
                  </h3>
                  <p className="text-sm text-slate-500">{lecture.department}</p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <span className="text-amber-500 text-xs">★</span>
                  <span className="text-amber-700 text-xs font-bold">{lecture.rating}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold">Contact:</span> {lecture.contact || "-"}
                </p>
                <p>
                  <span className="font-semibold">Subjects:</span> {lecture.subjects?.join(", ") || "-"}
                </p>
                <p>
                  <span className="font-semibold">Codes:</span> {lecture.codes?.join(", ") || "-"}
                </p>
              </div>

              {canManage && (
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => openEdit(lecture)}
                    className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(lecture)}
                    className="flex-1 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LecturesList;
