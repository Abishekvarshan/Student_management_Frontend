import React, { useState } from "react";
import { Student } from "../types";

const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "Jordan Rivera", email: "jordan@uni.edu", major: "Computer Science", gpa: 3.8, enrollmentDate: "2023-09-01", status: "Active" },
  { id: "2", name: "Sarah Chen", email: "sarah.c@uni.edu", major: "Bio-Engineering", gpa: 3.9, enrollmentDate: "2022-09-01", status: "Active" },
  { id: "3", name: "Marcus Miller", email: "mmiller@uni.edu", major: "Philosophy", gpa: 3.2, enrollmentDate: "2023-01-15", status: "On Leave" },
  { id: "4", name: "Elena Rodriguez", email: "elena.r@uni.edu", major: "Data Science", gpa: 3.6, enrollmentDate: "2021-09-01", status: "Active" },
  { id: "5", name: "Sam Wilson", email: "samw@uni.edu", major: "Mechanical Eng.", gpa: 3.4, enrollmentDate: "2022-01-15", status: "Graduated" },
];

const StudentList: React.FC = () => {
  const [filter, setFilter] = useState("");

  const filteredStudents = MOCK_STUDENTS.filter(
    (student) =>
      student.name.toLowerCase().includes(filter.toLowerCase()) ||
      student.major.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Student Directory</h2>
          <p className="text-slate-500">Manage and oversee all enrolled students.</p>
        </div>
        <button className="bg-indigo-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-700">
          + Add New Student
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4 border-b border-slate-100 p-6">
          <input
            type="text"
            placeholder="Filter students by name or major..."
            className="flex-1 rounded-xl border-none bg-slate-50 px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
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
              {filteredStudents.map((student) => (
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
                    <button className="px-2 font-bold text-slate-400 transition-colors hover:text-indigo-600">Edit</button>
                    <button className="px-2 font-bold text-slate-400 transition-colors hover:text-rose-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentList;