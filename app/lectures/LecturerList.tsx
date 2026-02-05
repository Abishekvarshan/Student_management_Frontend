
import React from 'react';
import { Lecturer } from '../types';

const MOCK_LECTURERS: Lecturer[] = [
  { id: 'L1', name: 'Dr. Emily Watson', department: 'Science', email: 'watson@uni.edu', specialization: 'Genetics', courses: ['Bio-101', 'Gen-202'], rating: 4.9 },
  { id: 'L2', name: 'Prof. Thomas Reed', department: 'Engineering', email: 'reed.t@uni.edu', specialization: 'AI/Robotics', courses: ['AI-500', 'Robo-301'], rating: 4.7 },
  { id: 'L3', name: 'Sarah Jenkins', department: 'Arts', email: 'jenk.s@uni.edu', specialization: 'History of Art', courses: ['Art-102'], rating: 4.8 },
];

const LecturerList: React.FC = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Lecturer Faculty</h2>
          <p className="text-slate-500">Directory of all academic staff and their specialties.</p>
        </div>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-semibold transition-all">
          Manage Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {MOCK_LECTURERS.map((lecturer) => (
          <div key={lecturer.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img src={`https://picsum.photos/seed/${lecturer.id}/60/60`} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50" alt="" />
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lecturer.name}</h3>
                  <p className="text-sm text-slate-500">{lecturer.department} Dept.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <span className="text-amber-500 text-xs">★</span>
                <span className="text-amber-700 text-xs font-bold">{lecturer.rating}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="font-medium">{lecturer.specialization}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {lecturer.courses.map(course => (
                  <span key={course} className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                    {course}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors">
                Contact
              </button>
              <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                View Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerList;
