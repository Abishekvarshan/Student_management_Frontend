
import React from 'react';
import { Course } from '../types';

const MOCK_COURSES: Course[] = [
  { id: 'C1', title: 'Introduction to Artificial Intelligence', code: 'CS-501', credits: 4, instructor: 'Prof. Thomas Reed', enrolled: 124, category: 'Tech' },
  { id: 'C2', title: 'Modern Genetic Algorithms', code: 'BIO-202', credits: 3, instructor: 'Dr. Emily Watson', enrolled: 45, category: 'Science' },
  { id: 'C3', title: 'Macroeconomics 101', code: 'EC-101', credits: 3, instructor: 'Dr. Simon Banks', enrolled: 210, category: 'Business' },
  { id: 'C4', title: 'Data Structures and Design', code: 'CS-102', credits: 4, instructor: 'Jordan Rivera', enrolled: 89, category: 'Tech' },
];

const CourseList: React.FC = () => {
  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Curriculum & Courses</h2>
          <p className="text-slate-500">Monitor enrollment numbers and syllabus availability.</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-all">
            Export Catalog
          </button>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/10">
            Create Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_COURSES.map((course) => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center justify-between hover:border-indigo-200 hover:shadow-lg transition-all">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${
                course.category === 'Tech' ? 'bg-indigo-50 text-indigo-600' :
                course.category === 'Science' ? 'bg-emerald-50 text-emerald-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                {course.code.split('-')[0]}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{course.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                   <span>{course.code}</span>
                   <span>•</span>
                   <span>{course.credits} Credits</span>
                   <span>•</span>
                   <span>{course.instructor}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
               <p className="text-2xl font-black text-slate-900">{course.enrolled}</p>
               <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Students Enrolled</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Featured Insight */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mt-12">
        <div className="relative z-10">
          <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-2">Smart Recommendation</h4>
          <h3 className="text-2xl font-bold mb-4">Launch "Prompt Engineering" Course</h3>
          <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-6">
            Our AI detected high search volume among CS students for this topic. Early enrollment predictions suggest 200+ students in the first week.
          </p>
          <button className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">
            Draft Curriculum Now
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-500/20 to-transparent flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CourseList;
