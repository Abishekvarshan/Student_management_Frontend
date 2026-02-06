"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRequireAuth } from "../auth/useRequireAuth";
import { useRequireRole } from "../auth/useRequireRole";
import { approveEnrollment, fetchPendingEnrollments, rejectEnrollment } from "../enrollments/api";
import type { AdminPendingEnrollment } from "../enrollments/types";

function getStudentLabel(e: any): string {
  return (
    e?.studentName ??
    e?.student?.username ??
    e?.student?.name ??
    e?.student?.email ??
    e?.studentId ??
    "Unknown"
  );
}

function getCourseLabel(e: any): string {
  return e?.courseName ?? e?.course?.courseName ?? e?.course?.name ?? e?.courseId ?? "Unknown";
}

function getRequestedDate(e: any): string {
  const raw = e?.requestedAt ?? e?.createdAt ?? e?.enrolledAt ?? e?.requestedDate;
  if (!raw) return "-";
  // if backend returns ISO string
  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d.toLocaleString();
  return String(raw);
}

const EnrollmentRequestsList: React.FC = () => {
  useRequireAuth();
  useRequireRole(["ADMIN"]);

  const [items, setItems] = useState<AdminPendingEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchPendingEnrollments();
      setItems(Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn("Failed to fetch pending enrollments", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(() => items ?? [], [items]);

  const handleApprove = async (id: string) => {
    setActingId(id);
    try {
      await approveEnrollment(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert("Approve failed");
      console.warn("Approve failed", err);
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActingId(id);
    try {
      await rejectEnrollment(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      alert("Reject failed");
      console.warn("Reject failed", err);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Enrollment Requests</h1>
          <p className="text-slate-500">Pending student enrollment requests that need approval.</p>
        </div>

        <button
          type="button"
          onClick={load}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden">
        <div className="px-5 py-4 border-b">
          <p className="font-semibold">Pending ({rows.length})</p>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No pending enrollment requests.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Requested</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{getStudentLabel(e)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">{getCourseLabel(e)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-600">{getRequestedDate(e)}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={actingId === e.id}
                          onClick={() => handleApprove(e.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={actingId === e.id}
                          onClick={() => handleReject(e.id)}
                          className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentRequestsList;
