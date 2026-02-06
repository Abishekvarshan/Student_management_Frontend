"use client";


import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useRequireAuth } from "../auth/useRequireAuth";

const data = [
  { name: 'Mon', students: 400, attendance: 240 },
  { name: 'Tue', students: 300, attendance: 139 },
  { name: 'Wed', students: 200, attendance: 980 },
  { name: 'Thu', students: 278, attendance: 390 },
  { name: 'Fri', students: 189, attendance: 480 },
];

const dashboard: React.FC = () => {
  useRequireAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Academic Overview</h2>
        <p className="text-slate-500">Welcome back, Alex. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: '1,284', change: '+12%', color: 'blue' },
          { label: 'Active Lecturers', value: '86', change: '+2', color: 'indigo' },
          { label: 'Courses Running', value: '42', change: '-3%', color: 'rose' },
          { label: 'Avg. Attendance', value: '94.2%', change: '+1.4%', color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Student Attendance Trends</h3>
            <select className="text-sm bg-slate-50 border-none rounded-lg px-3 py-1 font-medium focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="students" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

    
      </div>
    </div>
  );
};

export default dashboard;
