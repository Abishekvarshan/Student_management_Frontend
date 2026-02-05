"use client";

import Sidebar from "./Sidebar";

const SidebarPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-0 w-full px-4 py-8 sm:px-6 lg:ml-64 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-2xl font-bold text-slate-900">Sidebar Preview</h1>
          <p className="text-slate-500 mt-2">
            This page renders the sidebar for standalone preview.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SidebarPage;