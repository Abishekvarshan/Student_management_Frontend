
"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ICONS } from "./constants";
import type { UserRole } from "../auth/types";
import { useAuth } from "../auth/AuthProvider";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  roles?: UserRole[];
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: ICONS.Dashboard },
  // Students: ADMIN, LECTURER (backend allows listing; student self-profile is separate)
  { href: "/student", label: "Students", icon: ICONS.Students, roles: ["ADMIN", "LECTURER"] },
  // Profile: STUDENT only (self view/edit)
  { href: "/student", label: "Profile", icon: ICONS.Students, roles: ["STUDENT"] },
  // Courses: ADMIN, LECTURER, STUDENT
  { href: "/courses", label: "Courses", icon: ICONS.Courses, roles: ["ADMIN", "LECTURER", "STUDENT"] },
  // Lectures: ADMIN, LECTURER
  { href: "/lectures", label: "Lectures", icon: ICONS.Lecturers, roles: ["ADMIN", "LECTURER"] },
];

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const role = user?.role;

  return (
    <aside className="w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <span className="font-bold text-lg">E</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight">EduStream</h1>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems
          .filter((item) => {
            if (!item.roles) return true;
            return role ? item.roles.includes(role) : false;
          })
          .map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-white" : "group-hover:text-white"}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="mb-4 rounded-2xl bg-slate-800/50 p-4">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Signed in as</p>
          <p className="text-sm font-semibold text-white">{user?.username ?? "Unknown"}</p>
          <p className="text-xs text-slate-400">{user?.email ?? ""}</p>

          <button
            type="button"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-950"
          >
            Logout
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Academic Year</p>
          <p className="text-sm font-medium">2024 / 2025</p>
          <div className="mt-3 w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 w-[65%] h-full rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">Semester 2 - 65% Completed</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
